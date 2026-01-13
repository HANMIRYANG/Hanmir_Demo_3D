import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// 비밀번호 해시 함수
function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// GET: 문의게시판 목록 조회
export async function GET() {
    try {
        const posts = await (prisma as any).qnaPost.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                number: true,
                author: true,
                title: true,
                content: true,
                isAnswered: true,
                answer: true,
                answeredAt: true,
                views: true,
                createdAt: true,
                // 비밀번호, 이메일, 연락처는 제외
            }
        });
        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Failed to fetch QnA posts:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

// POST: 문의글 작성
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { author, email, phone, title, content, password } = body;

        // 필수 필드 검증
        if (!author || !email || !phone || !title || !content || !password) {
            return NextResponse.json({
                error: '작성자, 이메일, 연락처, 제목, 내용, 비밀번호는 필수입니다.'
            }, { status: 400 });
        }

        // 비밀번호 해시화
        const hashedPassword = hashPassword(password);

        const post = await (prisma as any).qnaPost.create({
            data: {
                author,
                email,
                phone,
                title,
                content,
                password: hashedPassword,
            }
        });

        return NextResponse.json({
            post: {
                id: post.id,
                number: post.number,
                author: post.author,
                title: post.title,
            },
            message: '문의글이 등록되었습니다.'
        }, { status: 201 });
    } catch (error) {
        console.error('Failed to create QnA post:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
