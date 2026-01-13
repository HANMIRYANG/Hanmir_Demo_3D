// ============================================================================
// 시공사례 상세 API (/api/admin/cases/[id])
// ============================================================================
// GET: 단일 조회
// PUT: 수정
// DELETE: 삭제
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

// GET: 단일 시공사례 조회
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const caseItem = await prisma.constructionCase.findUnique({
            where: { id }
        });

        if (!caseItem) {
            return NextResponse.json(
                { error: '시공사례를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ case: caseItem });
    } catch (error) {
        console.error('시공사례 조회 오류:', error);
        return NextResponse.json(
            { error: '시공사례 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// PUT: 시공사례 수정 (관리자 전용)
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const { id } = await context.params;
        const body = await request.json();
        const { title, category, thumbnail, content, images, shopUrl } = body;

        const updatedCase = await prisma.constructionCase.update({
            where: { id },
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
            case: updatedCase
        });
    } catch (error) {
        console.error('시공사례 수정 오류:', error);
        return NextResponse.json(
            { error: '시공사례 수정 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// DELETE: 시공사례 삭제 (관리자 전용)
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const { id } = await context.params;

        await prisma.constructionCase.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: '시공사례가 삭제되었습니다.'
        });
    } catch (error) {
        console.error('시공사례 삭제 오류:', error);
        return NextResponse.json(
            { error: '시공사례 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
