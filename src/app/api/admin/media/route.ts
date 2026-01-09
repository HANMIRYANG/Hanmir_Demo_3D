// ============================================================================
// 미디어 콘텐츠 관리 API (/api/admin/media)
// ============================================================================
// GET: 미디어 목록 조회
// POST: 새 미디어 등록
// DELETE: 미디어 삭제
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

// ============================================================================
// GET - 미디어 목록 조회
// ============================================================================
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        const where: any = {};
        if (category && category !== 'all') {
            where.category = category;
        }
        if (search) {
            where.title = { contains: search, mode: 'insensitive' };
        }

        const mediaItems = await prisma.mediaItem.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ mediaItems });
    } catch (error) {
        console.error('미디어 조회 오류:', error);
        return NextResponse.json(
            { error: '미디어 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// ============================================================================
// POST - 새 미디어 등록
// ============================================================================
export async function POST(request: NextRequest) {
    try {
        // 관리자 인증 확인
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, category, thumbnail, link } = body;

        if (!title || !category) {
            return NextResponse.json(
                { error: '필수 항목이 누락되었습니다.' },
                { status: 400 }
            );
        }

        const mediaItem = await prisma.mediaItem.create({
            data: {
                title,
                category,
                thumbnail: thumbnail || '',
                link: link || '#'
            }
        });

        // 활동 로그 기록
        await logActivity('CREATE', 'MediaItem', mediaItem.id, `${title} (${category}) 등록`);

        return NextResponse.json({
            success: true,
            mediaItem
        });
    } catch (error) {
        console.error('미디어 등록 오류:', error);
        return NextResponse.json(
            { error: '미디어 등록 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// ============================================================================
// DELETE - 미디어 삭제
// ============================================================================
export async function DELETE(request: NextRequest) {
    try {
        // 관리자 인증 확인
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: '삭제할 아이디가 필요합니다.' },
                { status: 400 }
            );
        }

        const mediaItem = await prisma.mediaItem.delete({
            where: { id }
        });

        // 활동 로그 기록
        await logActivity('DELETE', 'MediaItem', id, `${mediaItem.title} 삭제`);

        return NextResponse.json({
            success: true,
            message: '삭제되었습니다.'
        });
    } catch (error) {
        console.error('미디어 삭제 오류:', error);
        return NextResponse.json(
            { error: '미디어 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
