// ============================================================================
// 연혁 상세 관리 API (/api/admin/history/[id])
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// 관리자 인증 확인
async function checkAdminAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');
    return token?.value === 'hanmir_admin_authenticated';
}

// GET: 단일 연혁 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const history = await prisma.companyHistory.findUnique({
            where: { id }
        });

        if (!history) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json({ history });
    } catch (error) {
        console.error('Error fetching history:', error);
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}

// PUT: 연혁 수정
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { year, title, content, image, order } = body;

        const history = await prisma.companyHistory.update({
            where: { id },
            data: {
                year,
                title,
                content: content || null,
                image: image || null,
                order: order || 0
            }
        });

        return NextResponse.json({ success: true, history });
    } catch (error) {
        console.error('Error updating history:', error);
        return NextResponse.json({ error: 'Failed to update history' }, { status: 500 });
    }
}

// DELETE: 연혁 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await prisma.companyHistory.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting history:', error);
        return NextResponse.json({ error: 'Failed to delete history' }, { status: 500 });
    }
}
