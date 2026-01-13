import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

// PUT: 미디어 수정
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // 관리자 인증 확인
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const { id } = await context.params;
        const body = await request.json();
        const { title, category, thumbnail, content, images, link } = body;

        if (!title) {
            return NextResponse.json(
                { error: '제목은 필수입니다.' },
                { status: 400 }
            );
        }

        const mediaItem = await prisma.mediaItem.update({
            where: { id },
            data: {
                title,
                category,
                thumbnail: thumbnail || '',
                content: content || null,
                images: images || null,
                link: link || null
            }
        });

        // 활동 로그 기록
        await logActivity('UPDATE', 'MediaItem', mediaItem.id, `${title} (${category}) 수정`);

        return NextResponse.json({
            success: true,
            mediaItem
        });
    } catch (error) {
        console.error('미디어 수정 오류:', error);
        return NextResponse.json(
            { error: '미디어 수정 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// GET: 단일 미디어 조회
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const mediaItem = await prisma.mediaItem.findUnique({
            where: { id }
        });

        if (!mediaItem) {
            return NextResponse.json(
                { error: '미디어를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ mediaItem });
    } catch (error) {
        console.error('미디어 조회 오류:', error);
        return NextResponse.json(
            { error: '미디어 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
