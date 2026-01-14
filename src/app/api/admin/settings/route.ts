// ============================================================================
// 사이트 설정 API - GET/POST /api/admin/settings
// ============================================================================
// 회사소개서 URL 등 동적 사이트 설정 관리
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

// 설정 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        if (key) {
            // 특정 키 조회
            const setting = await prisma.siteSetting.findUnique({
                where: { key }
            });
            return NextResponse.json(setting);
        }

        // 전체 설정 조회
        const settings = await prisma.siteSetting.findMany({
            orderBy: { key: 'asc' }
        });
        return NextResponse.json(settings);

    } catch (error) {
        console.error('Settings GET Error:', error);
        return NextResponse.json(
            { error: '설정을 불러오는 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// 설정 저장/수정
export async function POST(request: NextRequest) {
    try {
        // 관리자 인증 확인
        const admin = await getCurrentAdmin(request);
        if (!admin) {
            return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
        }

        const body = await request.json();
        const { key, value, label } = body;

        if (!key || value === undefined) {
            return NextResponse.json(
                { error: 'key와 value가 필요합니다.' },
                { status: 400 }
            );
        }

        // upsert: 있으면 업데이트, 없으면 생성
        const setting = await prisma.siteSetting.upsert({
            where: { key },
            update: { value, label },
            create: { key, value, label }
        });

        return NextResponse.json(setting);

    } catch (error) {
        console.error('Settings POST Error:', error);
        return NextResponse.json(
            { error: '설정 저장 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
