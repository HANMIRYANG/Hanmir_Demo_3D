// src/app/api/paint-products/route.ts
// ============================================================================
// 페인트 제품 공개 API - 프론트엔드용
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - 활성화된 카테고리 및 제품 조회 (공개)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const mainCategory = searchParams.get('main'); // building | ship | industrial
        const subCategorySlug = searchParams.get('sub');
        const search = searchParams.get('search');

        // 특정 서브 카테고리의 제품 조회 + 검색
        if (subCategorySlug) {
            const category = await prisma.paintCategory.findUnique({
                where: { slug: subCategorySlug, isActive: true },
                include: {
                    products: {
                        where: {
                            isActive: true,
                            ...(search && {
                                OR: [
                                    { name: { contains: search } },
                                    { description: { contains: search } }
                                ]
                            })
                        },
                        orderBy: { order: 'asc' }
                    }
                }
            });

            if (!category) {
                return NextResponse.json({ error: 'Category not found' }, { status: 404 });
            }

            return NextResponse.json({ category });
        }

        // 메인 카테고리별 서브 카테고리 및 제품 조회
        if (mainCategory) {
            const categories = await prisma.paintCategory.findMany({
                where: {
                    mainCategory,
                    isActive: true
                },
                orderBy: { order: 'asc' },
                include: {
                    products: {
                        where: {
                            isActive: true,
                            ...(search && {
                                OR: [
                                    { name: { contains: search } },
                                    { description: { contains: search } }
                                ]
                            })
                        },
                        orderBy: { order: 'asc' }
                    }
                }
            });

            return NextResponse.json({ categories });
        }

        // 모든 활성 카테고리 및 제품 조회
        const categories = await prisma.paintCategory.findMany({
            where: { isActive: true },
            orderBy: [
                { mainCategory: 'asc' },
                { order: 'asc' }
            ],
            include: {
                products: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' }
                }
            }
        });

        return NextResponse.json({ categories });
    } catch (error) {
        console.error('GET /api/paint-products error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
