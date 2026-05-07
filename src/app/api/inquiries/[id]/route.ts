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
// ----------------------------------------------------------------------------
// body 형식:
//  { isRead: boolean }                        → 읽음 토글
//  { action: "markAsAnswered",
//    answeredBy: string, answerNote?: string} → 답변완료 처리
//  { action: "unmarkAsAnswered" }             → 답변완료 취소
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
        const { action, isRead, answeredBy, answerNote } = body;

        let data: Record<string, unknown> = {};

        if (action === 'markAsAnswered') {
            if (!answeredBy || typeof answeredBy !== 'string' || answeredBy.trim() === '') {
                return NextResponse.json(
                    { error: '처리자 이름을 입력해주세요.' },
                    { status: 400 }
                );
            }
            data = {
                isAnswered: true,
                answeredAt: new Date(),
                answeredBy: answeredBy.trim(),
                answerNote: typeof answerNote === 'string' && answerNote.trim() !== ''
                    ? answerNote.trim()
                    : null,
                isRead: true,
            };
        } else if (action === 'unmarkAsAnswered') {
            data = {
                isAnswered: false,
                answeredAt: null,
                answeredBy: null,
                answerNote: null,
            };
        } else if (typeof isRead === 'boolean') {
            data = { isRead };
        } else {
            return NextResponse.json(
                { error: '요청 형식이 올바르지 않습니다.' },
                { status: 400 }
            );
        }

        const updatedInquiry = await prisma.inquiry.update({
            where: { id },
            data
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
