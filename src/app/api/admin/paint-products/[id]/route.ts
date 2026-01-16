// src/app/api/admin/paint-products/[id]/route.ts
// ============================================================================
// 페인트 제품 관리 API - 개별 항목 수정/삭제
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

// PUT - 카테고리 또는 제품 수정
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { type } = body;

        if (type === 'category') {
            const { mainCategory, slug, name, order, isActive } = body;

            const category = await prisma.paintCategory.update({
                where: { id },
                data: {
                    ...(mainCategory && { mainCategory }),
                    ...(slug && { slug }),
                    ...(name && { name }),
                    ...(order !== undefined && { order }),
                    ...(isActive !== undefined && { isActive })
                }
            });

            return NextResponse.json({ category });
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

            const product = await prisma.paintProduct.update({
                where: { id },
                data: {
                    ...(categoryId && { categoryId }),
                    ...(name && { name }),
                    ...(thumbnail && { thumbnail }),
                    description,
                    dataSheetPath,
                    dataSheetName,
                    usage,
                    features,
                    specification,
                    instructions,
                    ...(order !== undefined && { order }),
                    ...(isActive !== undefined && { isActive })
                }
            });

            return NextResponse.json({ product });
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    } catch (error) {
        console.error('PUT /api/admin/paint-products/[id] error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - 카테고리 또는 제품 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        if (type === 'category') {
            await prisma.paintCategory.delete({ where: { id } });
            return NextResponse.json({ success: true });
        }

        if (type === 'product') {
            await prisma.paintProduct.delete({ where: { id } });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    } catch (error) {
        console.error('DELETE /api/admin/paint-products/[id] error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
