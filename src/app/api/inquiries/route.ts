// ============================================================================
// 문의 API (/api/inquiries)
// ============================================================================
// POST: 새 문의 저장 + 이메일 알림
// GET: 문의 목록 조회 (관리자용)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendInquiryNotification } from '@/lib/email';
import { getCurrentAdmin } from '@/lib/auth';

// ============================================================================
// POST - 새 문의 저장
// ============================================================================
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, company, phone, email, interest, message, productId } = body;

        // 필수 필드 검증
        if (!name || !phone || !email || !interest) {
            return NextResponse.json(
                { error: '필수 항목을 입력해주세요.' },
                { status: 400 }
            );
        }

        // 데이터베이스에 저장
        const inquiry = await prisma.inquiry.create({
            data: {
                name,
                company: company || null,
                phone,
                email,
                interest,
                message: message || null,
                productId: productId || null,
                isRead: false
            }
        });

        // 이메일 알림 발송 (await로 완료 대기 - Vercel 서버리스 환경 필수)
        try {
            await sendInquiryNotification({
                name,
                company,
                phone,
                email,
                interest,
                message,
                productId
            });
        } catch (err) {
            console.error('이메일 발송 실패:', err);
            // 이메일 실패해도 문의는 저장됨
        }

        return NextResponse.json({
            success: true,
            message: '문의가 성공적으로 접수되었습니다.',
            inquiry: { id: inquiry.id }
        });
    } catch (error) {
        console.error('문의 저장 오류:', error);
        return NextResponse.json(
            { error: '문의 저장 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// ============================================================================
// GET - 문의 목록 조회 (관리자용)
// ============================================================================
export async function GET(request: NextRequest) {
    try {
        // 관리자 인증 확인
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        // 쿼리 파라미터 파싱
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const interest = searchParams.get('interest');
        const isRead = searchParams.get('isRead');

        // 필터 조건 생성
        const where: any = {};
        if (interest) {
            where.interest = interest;
        }
        if (isRead !== null && isRead !== undefined) {
            where.isRead = isRead === 'true';
        }

        // 전체 개수 조회
        const total = await prisma.inquiry.count({ where });

        // 페이지네이션 적용하여 조회
        const inquiries = await prisma.inquiry.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit
        });

        // 통계 데이터 (관심 분야별)
        const stats = await prisma.inquiry.groupBy({
            by: ['interest'],
            _count: { id: true }
        });

        return NextResponse.json({
            inquiries,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            stats
        });
    } catch (error) {
        console.error('문의 조회 오류:', error);
        return NextResponse.json(
            { error: '문의 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
