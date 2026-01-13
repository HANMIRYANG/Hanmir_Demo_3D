import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: 관리자용 전체 문의글 조회 (이메일, 연락처 포함)
export async function GET() {
    try {
        const posts = await (prisma as any).qnaPost.findMany({
            orderBy: [
                { isAnswered: 'asc' },  // 미답변 먼저
                { createdAt: 'desc' }
            ],
            select: {
                id: true,
                number: true,
                author: true,
                email: true,
                phone: true,
                title: true,
                content: true,
                isAnswered: true,
                answer: true,
                answeredAt: true,
                views: true,
                createdAt: true,
            }
        });
        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Failed to fetch QnA posts:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}
