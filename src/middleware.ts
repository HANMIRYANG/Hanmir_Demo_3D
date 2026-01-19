import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

// next-intl 미들웨어 생성
const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always'
});

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 관리자 페이지 처리 (/admin)
    if (path.startsWith('/admin')) {
        // 로그인 페이지는 토큰 체크 제외
        if (path !== '/admin/login') {
            const token = request.cookies.get('hanmir_admin_token');
            if (!token) {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }
        }
        // 관리자 페이지는 다국어 처리 없이 그대로 진행
        return NextResponse.next();
    }

    // API 경로는 다국어 처리 제외
    if (path.startsWith('/api')) {
        return NextResponse.next();
    }

    // 나머지 경로는 next-intl 미들웨어로 처리
    return intlMiddleware(request);
}

export const config = {
    matcher: [
        // 다국어 적용 경로
        '/((?!_next|_vercel|.*\\..*).*)',
        // 관리자 페이지
        '/admin/:path*'
    ],
};
