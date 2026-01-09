// ============================================================================
// 관리자 인증 API (/api/admin/auth)
// ============================================================================
// POST: 로그인 (토큰 발급 + 쿠키 설정)
// DELETE: 로그아웃 (쿠키 삭제)
// GET: 세션 확인
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, generateToken, verifyToken, COOKIE_OPTIONS } from '@/lib/auth';
import { logActivity } from '@/lib/activity';
import { cookies } from 'next/headers';

// ============================================================================
// POST - 로그인
// ============================================================================
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, password } = body;

        // 자격증명 검증
        const isValid = await verifyCredentials(id, password);
        if (!isValid) {
            return NextResponse.json(
                { error: '아이디 또는 비밀번호가 올바르지 않습니다.' },
                { status: 401 }
            );
        }

        // JWT 토큰 생성
        const token = generateToken(id);

        // 응답 생성 및 쿠키 설정
        const response = NextResponse.json({
            success: true,
            message: '로그인 성공',
            admin: { id }
        });

        response.cookies.set({
            ...COOKIE_OPTIONS,
            value: token
        });

        await logActivity('LOGIN', 'System', id, '로그인 성공');

        return response;
    } catch (error) {
        console.error('로그인 오류:', error);
        return NextResponse.json(
            { error: '로그인 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// ============================================================================
// DELETE - 로그아웃
// ============================================================================
export async function DELETE() {
    try {
        const response = NextResponse.json({
            success: true,
            message: '로그아웃 성공'
        });

        // 쿠키 삭제
        response.cookies.set({
            name: COOKIE_OPTIONS.name,
            value: '',
            maxAge: 0,
            path: '/'
        });

        await logActivity('LOGOUT', 'System', 'admin', '로그아웃 성공');

        return response;
    } catch (error) {
        console.error('로그아웃 오류:', error);
        return NextResponse.json(
            { error: '로그아웃 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// ============================================================================
// GET - 세션 확인
// ============================================================================
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_OPTIONS.name);

        if (!token?.value) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token.value);
        if (!decoded) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        return NextResponse.json({
            authenticated: true,
            admin: { id: decoded.adminId }
        });
    } catch (error) {
        console.error('세션 확인 오류:', error);
        return NextResponse.json(
            { authenticated: false, error: '세션 확인 실패' },
            { status: 500 }
        );
    }
}
