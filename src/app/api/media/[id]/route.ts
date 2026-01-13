import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET: 미디어 상세 조회 (조회수 증가)
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        // 조회수 증가 및 상세 정보 조회
        const mediaItem = await prisma.mediaItem.update({
            where: { id },
            data: { views: { increment: 1 } }
        });

        if (!mediaItem) {
            return NextResponse.json({ error: 'Media not found' }, { status: 404 });
        }

        // 같은 카테고리의 관련 미디어 (최신 4개, 현재 제외)
        const relatedItems = await prisma.mediaItem.findMany({
            where: {
                category: mediaItem.category,
                id: { not: id }
            },
            orderBy: { createdAt: 'desc' },
            take: 4,
            select: {
                id: true,
                title: true,
                thumbnail: true,
                category: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            mediaItem,
            relatedItems
        });
    } catch (error) {
        console.error('Failed to fetch media item:', error);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}
