// ============================================================================
// 시공사례 관리 API (/api/admin/cases)
// ============================================================================
// GET: 목록 조회
// POST: 새 시공사례 등록
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

// GET: 시공사례 목록 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        const where: any = {};
        if (category && category !== 'all') {
            where.category = category;
        }

        const cases = await prisma.constructionCase.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ cases });
    } catch (error) {
        console.error('시공사례 조회 오류:', error);
        return NextResponse.json(
            { error: '시공사례 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// POST: 새 시공사례 등록 (관리자 전용)
export async function POST(request: NextRequest) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, category, thumbnail, content, images, shopUrl } = body;

        if (!title || !category || !thumbnail) {
            return NextResponse.json(
                { error: '제목, 카테고리, 썸네일은 필수입니다.' },
                { status: 400 }
            );
        }

        const newCase = await prisma.constructionCase.create({
            data: {
                title,
                category,
                thumbnail,
                content: content || null,
                images: images ? JSON.stringify(images) : null,
                shopUrl: shopUrl || null
            }
        });

        return NextResponse.json({
            success: true,
            case: newCase
        });
    } catch (error) {
        console.error('시공사례 등록 오류:', error);
        return NextResponse.json(
            { error: '시공사례 등록 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
