import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// 이메일 발송 함수
async function sendAnswerNotification(email: string, title: string, answer: string) {
    try {
        // 환경변수에서 이메일 설정 가져오기 (SMTP_USER/SMTP_PASS로 통일)
        const emailUser = process.env.SMTP_USER;
        const emailPass = process.env.SMTP_PASS;

        if (!emailUser || !emailPass) {
            console.log('Email credentials not configured, skipping notification');
            return;
        }

        // 하이웍스 SMTP 설정 사용
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtps.hiworks.com',
            port: parseInt(process.env.SMTP_PORT || '465'),
            secure: process.env.SMTP_PORT === '465', // 465 포트면 SSL 사용
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });

        await transporter.sendMail({
            from: emailUser,
            to: email,
            subject: `[한미르] 문의에 대한 답변이 등록되었습니다`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">문의 답변 안내</h2>
                    <p>안녕하세요, 한미르입니다.</p>
                    <p>문의하신 <strong>"${title}"</strong>에 대한 답변이 등록되었습니다.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <h3 style="color: #666;">답변 내용</h3>
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
                        ${answer.replace(/\n/g, '<br/>')}
                    </div>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="color: #888; font-size: 12px;">
                        본 메일은 발신 전용입니다.<br/>
                        추가 문의사항은 홈페이지 문의게시판을 이용해주세요.
                    </p>
                </div>
            `,
        });
        console.log('Answer notification email sent to:', email);
    } catch (error) {
        console.error('Failed to send email notification:', error);
    }
}

// POST: 관리자 답변 등록
export async function POST(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { answer } = body;

        if (!answer || answer.trim() === '') {
            return NextResponse.json({ error: '답변 내용을 입력해주세요.' }, { status: 400 });
        }

        // 게시글 조회
        const existingPost = await (prisma as any).qnaPost.findUnique({
            where: { id }
        });

        if (!existingPost) {
            return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
        }

        // 답변 저장
        const updatedPost = await (prisma as any).qnaPost.update({
            where: { id },
            data: {
                answer,
                isAnswered: true,
                answeredAt: new Date(),
            },
            select: {
                id: true,
                number: true,
                title: true,
                answer: true,
                isAnswered: true,
                answeredAt: true,
                email: true,
            }
        });

        // 이메일 알림 발송
        await sendAnswerNotification(existingPost.email, existingPost.title, answer);

        return NextResponse.json({
            post: updatedPost,
            message: '답변이 등록되었습니다.'
        });
    } catch (error) {
        console.error('Failed to add answer:', error);
        return NextResponse.json({ error: 'Failed to add answer' }, { status: 500 });
    }
}

// PUT: 관리자 답변 수정
export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const { answer } = body;

        if (!answer || answer.trim() === '') {
            return NextResponse.json({ error: '답변 내용을 입력해주세요.' }, { status: 400 });
        }

        // 게시글 조회
        const existingPost = await (prisma as any).qnaPost.findUnique({
            where: { id }
        });

        if (!existingPost) {
            return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
        }

        if (!existingPost.isAnswered) {
            return NextResponse.json({ error: '등록된 답변이 없습니다.' }, { status: 400 });
        }

        // 답변 수정
        const updatedPost = await (prisma as any).qnaPost.update({
            where: { id },
            data: {
                answer,
                answeredAt: new Date(),
            },
            select: {
                id: true,
                number: true,
                title: true,
                answer: true,
                isAnswered: true,
                answeredAt: true,
            }
        });

        return NextResponse.json({
            post: updatedPost,
            message: '답변이 수정되었습니다.'
        });
    } catch (error) {
        console.error('Failed to update answer:', error);
        return NextResponse.json({ error: '답변 수정 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

// DELETE: 관리자 답변 삭제 (게시글은 유지, 미답변 상태로 전환)
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        // 게시글 조회
        const existingPost = await (prisma as any).qnaPost.findUnique({
            where: { id }
        });

        if (!existingPost) {
            return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
        }

        if (!existingPost.isAnswered) {
            return NextResponse.json({ error: '등록된 답변이 없습니다.' }, { status: 400 });
        }

        // 답변 삭제 (미답변 상태로 전환)
        const updatedPost = await (prisma as any).qnaPost.update({
            where: { id },
            data: {
                answer: null,
                isAnswered: false,
                answeredAt: null,
            },
            select: {
                id: true,
                number: true,
                title: true,
                isAnswered: true,
            }
        });

        return NextResponse.json({
            post: updatedPost,
            message: '답변이 삭제되었습니다.'
        });
    } catch (error) {
        console.error('Failed to delete answer:', error);
        return NextResponse.json({ error: '답변 삭제 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
