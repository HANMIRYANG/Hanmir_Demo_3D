// ============================================================================
// 문의 개별 관리 API (/api/inquiries/[id])
// ============================================================================
// DELETE: 문의 삭제
// PATCH: 문의 상태 변경 (읽음 처리 등)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

// ============================================================================
// DELETE - 문의 삭제
// ============================================================================
export async function DELETE(
    request: NextRequest,
    context: RouteContext
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

        await prisma.inquiry.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: '문의가 삭제되었습니다.'
        });
    } catch (error) {
        console.error('문의 삭제 오류:', error);
        return NextResponse.json(
            { error: '문의 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// ============================================================================
// PATCH - 문의 상태 변경
// ============================================================================
export async function PATCH(
    request: NextRequest,
    context: RouteContext
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
        const body = await request.json();
        const { isRead } = body;

        const updatedInquiry = await prisma.inquiry.update({
            where: { id },
            data: {
                isRead: isRead
            }
        });

        return NextResponse.json({
            success: true,
            message: '문의 상태가 변경되었습니다.',
            inquiry: updatedInquiry
        });
    } catch (error) {
        console.error('문의 상태 변경 오류:', error);
        return NextResponse.json(
            { error: '문의 상태 변경 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
