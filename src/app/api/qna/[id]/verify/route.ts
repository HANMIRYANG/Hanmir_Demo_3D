import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// POST: 비밀번호 검증
export async function POST(
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

        const post = await (prisma as any).qnaPost.findUnique({
            where: { id },
            select: { password: true, isAnswered: true }
        });

        if (!post) {
            return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
        }

        const hashedPassword = hashPassword(password);
        const isValid = post.password === hashedPassword;

        return NextResponse.json({
            valid: isValid,
            isAnswered: post.isAnswered,
            canEdit: isValid && !post.isAnswered,  // 답변 완료 시 수정/삭제 불가
            canDelete: isValid && !post.isAnswered
        });
    } catch (error) {
        console.error('Failed to verify password:', error);
        return NextResponse.json({ error: 'Failed to verify' }, { status: 500 });
    }
}
