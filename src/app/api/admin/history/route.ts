// ============================================================================
// 연혁 관리 API (/api/admin/history)
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

// GET: 연혁 목록 조회
export async function GET(request: NextRequest) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const histories = await prisma.companyHistory.findMany({
            orderBy: [
                { order: 'asc' },
                { year: 'desc' }
            ]
        });

        return NextResponse.json({ histories });
    } catch (error) {
        console.error('Error fetching histories:', error);
        return NextResponse.json({ error: 'Failed to fetch histories' }, { status: 500 });
    }
}

// POST: 연혁 등록
export async function POST(request: NextRequest) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { year, title, content, image, order } = body;

        if (!year || !title) {
            return NextResponse.json({ error: '연도와 제목은 필수입니다.' }, { status: 400 });
        }

        const history = await prisma.companyHistory.create({
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
        console.error('Error creating history:', error);
        return NextResponse.json({ error: 'Failed to create history' }, { status: 500 });
    }
}
