//src/app/api/admin/paint-products/route.ts
// ============================================================================
// 페인트 제품 관리 API - 관리자 전용
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

// GET - 모든 카테고리 및 제품 조회
export async function GET(request: NextRequest) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // 'categories' | 'products' | null (all)

        if (type === 'categories') {
            const categories = await prisma.paintCategory.findMany({
                orderBy: { order: 'asc' },
                include: { _count: { select: { products: true } } }
            });
            return NextResponse.json({ categories });
        }

        if (type === 'products') {
            const categoryId = searchParams.get('categoryId');
            const products = await prisma.paintProduct.findMany({
                where: categoryId ? { categoryId } : {},
                orderBy: { order: 'asc' },
                include: { category: true }
            });
            return NextResponse.json({ products });
        }

        // 전체 조회 (카테고리 + 제품)
        const categories = await prisma.paintCategory.findMany({
            orderBy: { order: 'asc' },
            include: {
                products: {
                    orderBy: { order: 'asc' }
                },
                _count: { select: { products: true } }
            }
        });

        return NextResponse.json({ categories });
    } catch (error) {
        console.error('GET /api/admin/paint-products error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - 카테고리 또는 제품 생성
export async function POST(request: NextRequest) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type } = body;

        if (type === 'category') {
            const { mainCategory, slug, name, order, isActive } = body;

            if (!mainCategory || !slug || !name) {
                return NextResponse.json({ error: 'mainCategory, slug and name are required' }, { status: 400 });
            }

            const category = await prisma.paintCategory.create({
                data: {
                    mainCategory,
                    slug,
                    name,
                    order: order ?? 0,
                    isActive: isActive ?? true
                }
            });

            return NextResponse.json({ category }, { status: 201 });
        }

        if (type === 'product') {
            const {
                categoryId,
                name,
                thumbnail,
                description,
                dataSheetPath,
                dataSheetName,
                usage,
                features,
                specification,
                instructions,
                order,
                isActive
            } = body;

            if (!categoryId || !name || !thumbnail) {
                return NextResponse.json({ error: 'categoryId, name, and thumbnail are required' }, { status: 400 });
            }

            const product = await prisma.paintProduct.create({
                data: {
                    categoryId,
                    name,
                    thumbnail,
                    description,
                    dataSheetPath,
                    dataSheetName,
                    usage,
                    features,
                    specification,
                    instructions,
                    order: order ?? 0,
                    isActive: isActive ?? true
                }
            });

            return NextResponse.json({ product }, { status: 201 });
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    } catch (error) {
        console.error('POST /api/admin/paint-products error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
