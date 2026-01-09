import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const logs = await prisma.activityLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100 // Limit to recent 100 logs
        });

        return NextResponse.json({ logs });
    } catch (error) {
        console.error('Failed to fetch activity logs', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
