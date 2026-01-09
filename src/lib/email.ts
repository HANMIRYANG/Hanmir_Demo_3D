// ============================================================================
// 이메일 발송 유틸리티 (Email Utilities)
// ============================================================================
// Nodemailer를 사용한 이메일 발송
// ============================================================================

import nodemailer from 'nodemailer';

// ============================================================================
// 이메일 설정
// ============================================================================
const SMTP_CONFIG = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
    }
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hanmir@hanmirfe.com';

// ============================================================================
// 메일 발송 함수
// ============================================================================
export async function sendInquiryNotification(inquiry: {
    name: string;
    company?: string;
    phone: string;
    email: string;
    interest: string;
    message?: string;
    productId?: string;
}): Promise<boolean> {
    // SMTP 설정이 없으면 로그만 남기고 성공 반환
    if (!SMTP_CONFIG.auth.user || !SMTP_CONFIG.auth.pass) {
        console.log('📧 [이메일 시뮬레이션] SMTP 설정 없음, 로그만 기록');
        console.log('받는 사람:', ADMIN_EMAIL);
        console.log('문의 내용:', inquiry);
        return true;
    }

    try {
        const transporter = nodemailer.createTransport(SMTP_CONFIG);

        const mailOptions = {
            from: `"한미르 웹사이트" <${SMTP_CONFIG.auth.user}>`,
            to: ADMIN_EMAIL,
            subject: `[문의] ${inquiry.interest} - ${inquiry.name}님의 문의`,
            html: `
                <div style="font-family: 'Noto Sans KR', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
                        새로운 문의가 접수되었습니다
                    </h2>
                    
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">담당자 성명</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${inquiry.name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">업체명</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${inquiry.company || '-'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">연락처</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${inquiry.phone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">이메일</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                                <a href="mailto:${inquiry.email}">${inquiry.email}</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">관심 분야</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${inquiry.interest}</td>
                        </tr>
                        ${inquiry.productId ? `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">관련 제품</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${inquiry.productId}</td>
                        </tr>
                        ` : ''}
                    </table>
                    
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
                        <h3 style="margin-top: 0; color: #333;">문의 내용</h3>
                        <p style="white-space: pre-wrap; color: #555;">${inquiry.message || '(내용 없음)'}</p>
                    </div>
                    
                    <p style="color: #999; font-size: 12px; margin-top: 30px;">
                        이 이메일은 한미르 웹사이트에서 자동 발송되었습니다.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ 문의 알림 이메일 발송 완료');
        return true;
    } catch (error) {
        console.error('❌ 이메일 발송 실패:', error);
        return false;
    }
}
