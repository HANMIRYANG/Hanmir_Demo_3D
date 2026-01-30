// src/app/api/product-share/route.ts
// ============================================================================
// 제품 메일 공유 API
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { sendProductShareEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            productName,
            productDescription,
            recipientEmail,
            senderName,
        } = body;

        if (!productName || !recipientEmail) {
            return NextResponse.json(
                { error: 'Product name and recipient email are required' },
                { status: 400 }
            );
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recipientEmail)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // 실제 이메일 발송
        const success = await sendProductShareEmail({
            productName,
            productDescription,
            recipientEmail,
            senderName,
        });

        if (success) {
            return NextResponse.json({
                success: true,
                message: '제품 정보가 성공적으로 공유되었습니다.'
            });
        } else {
            return NextResponse.json(
                { error: '이메일 발송에 실패했습니다.' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('POST /api/product-share error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
