// ============================================================================
// 관리자 인증 유틸리티 (Auth Utilities)
// ============================================================================
// JWT + bcrypt 기반 인증 시스템
// 관리자 자격증명은 전부 환경변수에서 로드 (ADMIN_ID / ADMIN_PASSWORD_HASH)
// ============================================================================

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const TOKEN_EXPIRY = '24h';
const COOKIE_NAME = 'hanmir_admin_token';

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error(
            'JWT_SECRET 환경변수가 설정되지 않았거나 너무 짧습니다 (최소 32자 권장).'
        );
    }
    return secret;
}

function getAdminCredentials(): { id: string; passwordHash: string } {
    const id = process.env.ADMIN_ID;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!id || !passwordHash) {
        throw new Error(
            'ADMIN_ID 또는 ADMIN_PASSWORD_HASH 환경변수가 설정되지 않았습니다.'
        );
    }
    return { id, passwordHash };
}

export async function verifyCredentials(id: string, password: string): Promise<boolean> {
    const admin = getAdminCredentials();
    if (id !== admin.id) {
        // 타이밍 공격 완화: ID 불일치여도 bcrypt 비교를 수행
        await bcrypt.compare(password, admin.passwordHash);
        return false;
    }
    return bcrypt.compare(password, admin.passwordHash);
}

export function generateToken(adminId: string): string {
    return jwt.sign(
        { adminId, role: 'admin' },
        getJwtSecret(),
        { expiresIn: TOKEN_EXPIRY }
    );
}

export function verifyToken(token: string): { adminId: string; role: string } | null {
    try {
        const decoded = jwt.verify(token, getJwtSecret()) as {
            adminId: string;
            role: string;
        };
        return decoded;
    } catch {
        return null;
    }
}

export async function getTokenFromCookies(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    return token?.value || null;
}

export async function getCurrentAdmin(): Promise<{ adminId: string; role: string } | null> {
    const token = await getTokenFromCookies();
    if (!token) return null;
    return verifyToken(token);
}

export const COOKIE_OPTIONS = {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24,
    path: '/'
};
