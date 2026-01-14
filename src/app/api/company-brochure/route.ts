// ============================================================================
// 회사소개서 다운로드 API - GET /api/company-brochure
// ============================================================================
// DB에서 회사소개서 URL을 조회하여 리다이렉트
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        // DB에서 회사소개서 URL 조회
        const setting = await prisma.siteSetting.findUnique({
            where: { key: 'company_brochure_url' }
        });

        if (setting?.value) {
            // DB에 URL이 있으면 리다이렉트
            return NextResponse.redirect(setting.value);
        }

        // DB에 없으면 기본 파일로 리다이렉트
        const baseUrl = request.nextUrl.origin;
        return NextResponse.redirect(`${baseUrl}/company/한미르 소개서(KOR)251210.pdf`);

    } catch (error) {
        console.error('Company Brochure API Error:', error);
        // 에러 시에도 기본 파일로 리다이렉트
        const baseUrl = request.nextUrl.origin;
        return NextResponse.redirect(`${baseUrl}/company/한미르 소개서(KOR)251210.pdf`);
    }
}
