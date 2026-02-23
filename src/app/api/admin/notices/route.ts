import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: 공지사항 목록 조회
export async function GET() {
    try {
        const notices = await prisma.notice.findMany({
            orderBy: [
                { isImportant: 'desc' },
                { createdAt: 'desc' }
            ]
        });
        const response = NextResponse.json({ notices });
        response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30');
        return response;
    } catch (error) {
        console.error('Failed to fetch notices:', error);
        return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
    }
}

// POST: 공지사항 생성
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { category, title, content, thumbnail, images, attachments, isImportant, createdAt } = body;

        if (!category || !title) {
            return NextResponse.json({ error: 'Category and title are required' }, { status: 400 });
        }

        const createData: any = {
            category,
            title,
            content: content || '',
            thumbnail: thumbnail || null,
            images: images || null,
            attachments: attachments || null,
            isImportant: isImportant || false
        };

        // 등록일이 전달된 경우 설정
        if (createdAt) {
            createData.createdAt = new Date(createdAt);
        }

        const notice = await prisma.notice.create({
            data: createData
        });

        return NextResponse.json({ notice }, { status: 201 });
    } catch (error) {
        console.error('Failed to create notice:', error);
        return NextResponse.json({ error: 'Failed to create notice' }, { status: 500 });
    }
}
