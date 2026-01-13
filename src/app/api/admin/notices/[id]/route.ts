import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';

// GET: 단일 공지사항 조회
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const notice = await (prisma as any).notice.findUnique({
            where: { id }
        });

        if (!notice) {
            return NextResponse.json(
                { error: '공지사항을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ notice });
    } catch (error) {
        console.error('공지사항 조회 오류:', error);
        return NextResponse.json(
            { error: '공지사항 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// PUT: 공지사항 수정
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const { id } = await context.params;
        const body = await request.json();
        const { category, title, content, thumbnail, images, attachments, isImportant, createdAt } = body;

        if (!title) {
            return NextResponse.json(
                { error: '제목은 필수입니다.' },
                { status: 400 }
            );
        }

        const updateData: any = {
            category,
            title,
            content: content || null,
            thumbnail: thumbnail || null,
            images: images || null,
            attachments: attachments || null,
            isImportant: isImportant || false
        };

        // 등록일이 전달된 경우 업데이트
        if (createdAt) {
            updateData.createdAt = new Date(createdAt);
        }

        const notice = await (prisma as any).notice.update({
            where: { id },
            data: updateData
        });

        await logActivity('UPDATE', 'Notice', notice.id, `${title} 수정`);

        return NextResponse.json({
            success: true,
            notice
        });
    } catch (error) {
        console.error('공지사항 수정 오류:', error);
        return NextResponse.json(
            { error: '공지사항 수정 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// DELETE: 공지사항 삭제
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const { id } = await context.params;

        const notice = await (prisma as any).notice.delete({
            where: { id }
        });

        await logActivity('DELETE', 'Notice', id, `${notice.title} 삭제`);

        return NextResponse.json({
            success: true,
            message: '삭제되었습니다.'
        });
    } catch (error) {
        console.error('공지사항 삭제 오류:', error);
        return NextResponse.json(
            { error: '공지사항 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
