// ============================================================================
// 시공사례 공개 상세 API (/api/cases/[id])
// ============================================================================
// GET: 공개 상세 조회 + 조회수 증가
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: 시공사례 상세 조회 (공개)
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        // 시공사례 조회
        const caseItem = await prisma.constructionCase.findUnique({
            where: { id }
        });

        if (!caseItem) {
            return NextResponse.json(
                { error: '시공사례를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 조회수 증가
        await prisma.constructionCase.update({
            where: { id },
            data: { views: { increment: 1 } }
        });

        // 관련 시공사례 조회 (같은 카테고리, 최대 4개)
        const relatedCases = await prisma.constructionCase.findMany({
            where: {
                category: caseItem.category,
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
            caseItem: {
                ...caseItem,
                views: caseItem.views + 1
            },
            relatedCases
        });
    } catch (error) {
        console.error('시공사례 조회 오류:', error);
        return NextResponse.json(
            { error: '시공사례 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
