import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 관리자 페이지 경로 (/admin) 확인, 단 로그인 페이지 (/admin/login)는 제외
    if (path.startsWith('/admin') && path !== '/admin/login') {
        // 쿠키에서 토큰 확인
        const token = request.cookies.get('hanmir_admin_token');

        // 토큰이 없으면 로그인 페이지로 리다이렉트
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // /admin 경로 아래의 모든 페이지에 미들웨어 적용
        '/admin/:path*',
    ],
};
