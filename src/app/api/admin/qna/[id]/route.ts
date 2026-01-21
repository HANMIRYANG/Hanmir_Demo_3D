import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentAdmin } from '@/lib/auth';

const prisma = new PrismaClient();

// DELETE: 관리자 게시글 삭제
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // 관리자 인증 확인
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const { id } = await context.params;

        // 게시글 존재 확인
        const existingPost = await (prisma as any).qnaPost.findUnique({
            where: { id }
        });

        if (!existingPost) {
            return NextResponse.json(
                { error: '게시글을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 게시글 삭제
        await (prisma as any).qnaPost.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: '게시글이 삭제되었습니다.'
        });
    } catch (error) {
        console.error('Failed to delete QnA post:', error);
        return NextResponse.json(
            { error: '게시글 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
