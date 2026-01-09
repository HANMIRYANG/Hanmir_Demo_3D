// ============================================================================
// 관리자 인증 유틸리티 (Auth Utilities)
// ============================================================================
// JWT 토큰 기반 인증 시스템
// 관리자 계정: ID = hanmirco, PW = victorhan77#
// ============================================================================

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// ============================================================================
// 설정
// ============================================================================
const JWT_SECRET = process.env.JWT_SECRET || 'hanmir_admin_jwt_secret_key_2025';
const TOKEN_EXPIRY = '24h'; // 토큰 만료 시간
const COOKIE_NAME = 'hanmir_admin_token';

// 관리자 자격증명 (하드코딩 - 단일 관리자)
const ADMIN_CREDENTIALS = {
    id: 'hanmirco',
    // 비밀번호 해시 (victorhan77#)
    passwordHash: '$2a$10$8vR8JZK5XQKXC5VZK5XQKO8vR8JZK5XQKXC5VZK5XQKO8vR8JZK5'
};

// ============================================================================
// 비밀번호 검증
// ============================================================================
export async function verifyCredentials(id: string, password: string): Promise<boolean> {
    if (id !== ADMIN_CREDENTIALS.id) {
        return false;
    }

    // 직접 비밀번호 비교 (개발용, 실제로는 bcrypt 해시 비교)
    if (password === 'victorhan77#') {
        return true;
    }

    return false;
}

// ============================================================================
// JWT 토큰 생성
// ============================================================================
export function generateToken(adminId: string): string {
    return jwt.sign(
        { adminId, role: 'admin' },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
    );
}

// ============================================================================
// JWT 토큰 검증
// ============================================================================
export function verifyToken(token: string): { adminId: string; role: string } | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            adminId: string;
            role: string;
        };
        return decoded;
    } catch {
        return null;
    }
}

// ============================================================================
// 쿠키에서 토큰 가져오기
// ============================================================================
export async function getTokenFromCookies(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    return token?.value || null;
}

// ============================================================================
// 현재 관리자 세션 확인
// ============================================================================
export async function getCurrentAdmin(): Promise<{ adminId: string; role: string } | null> {
    const token = await getTokenFromCookies();
    if (!token) {
        return null;
    }
    return verifyToken(token);
}

// ============================================================================
// 쿠키 설정값
// ============================================================================
export const COOKIE_OPTIONS = {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24, // 24시간
    path: '/'
};
