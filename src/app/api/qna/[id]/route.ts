import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// GET: 게시글 상세 조회 (조회수 증가)
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const post = await (prisma as any).qnaPost.update({
            where: { id },
            data: { views: { increment: 1 } },
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
            }
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ post });
    } catch (error) {
        console.error('Failed to fetch QnA post:', error);
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}

// PUT: 게시글 수정 (비밀번호 검증 필요, 답변 완료 시 수정 불가)
export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { password, title, content } = body;

        if (!password) {
            return NextResponse.json({ error: '비밀번호를 입력해주세요.' }, { status: 400 });
        }

        // 기존 게시글 조회
        const existingPost = await (prisma as any).qnaPost.findUnique({
            where: { id }
        });

        if (!existingPost) {
            return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
        }

        // 답변 완료된 글은 수정 불가
        if (existingPost.isAnswered) {
            return NextResponse.json({ error: '답변이 완료된 글은 수정할 수 없습니다.' }, { status: 403 });
        }

        // 비밀번호 검증
        const hashedPassword = hashPassword(password);
        if (existingPost.password !== hashedPassword) {
            return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
        }

        // 게시글 수정
        const updatedPost = await (prisma as any).qnaPost.update({
            where: { id },
            data: { title, content },
            select: {
                id: true,
                number: true,
                author: true,
                title: true,
                content: true,
            }
        });

        return NextResponse.json({ post: updatedPost, message: '수정되었습니다.' });
    } catch (error) {
        console.error('Failed to update QnA post:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

// DELETE: 게시글 삭제 (비밀번호 검증 필요, 답변 완료 시 삭제 불가)
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { password } = body;

        if (!password) {
            return NextResponse.json({ error: '비밀번호를 입력해주세요.' }, { status: 400 });
        }

        // 기존 게시글 조회
        const existingPost = await (prisma as any).qnaPost.findUnique({
            where: { id }
        });

        if (!existingPost) {
            return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
        }

        // 답변 완료된 글은 삭제 불가
        if (existingPost.isAnswered) {
            return NextResponse.json({ error: '답변이 완료된 글은 삭제할 수 없습니다.' }, { status: 403 });
        }

        // 비밀번호 검증
        const hashedPassword = hashPassword(password);
        if (existingPost.password !== hashedPassword) {
            return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
        }

        // 게시글 삭제
        await (prisma as any).qnaPost.delete({ where: { id } });

        return NextResponse.json({ message: '삭제되었습니다.' });
    } catch (error) {
        console.error('Failed to delete QnA post:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
