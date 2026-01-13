// ============================================================================
// 공개용 연혁 조회 API (/api/history)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET: 공개용 연혁 목록 조회
export async function GET(request: NextRequest) {
    try {
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
