// ============================================================================
// 이메일 발송 유틸리티 (Email Utilities)
// ============================================================================
// Nodemailer를 사용한 이메일 발송
// ============================================================================

import nodemailer from 'nodemailer';

// ============================================================================
// SMTP 설정 가져오기 (함수 호출 시점에 환경변수 읽기)
// ============================================================================
function getSMTPConfig() {
    return {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465', // 465 포트면 SSL 사용 (하이웍스)
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
        }
    };
}

function getAdminEmail() {
    return process.env.ADMIN_EMAIL || 'hanmir@hanmirfe.com';
}

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
    // 함수 호출 시점에 설정 가져오기 (Vercel 런타임에 환경변수 읽기)
    const smtpConfig = getSMTPConfig();
    const adminEmail = getAdminEmail();

    // SMTP 설정이 없으면 로그만 남기고 성공 반환
    if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
        console.log('📧 [이메일 시뮬레이션] SMTP 설정 없음, 로그만 기록');
        console.log('받는 사람:', adminEmail);
        console.log('문의 내용:', inquiry);
        return true;
    }

    try {
        const transporter = nodemailer.createTransport(smtpConfig);

        const mailOptions = {
            from: `"한미르 웹사이트" <${smtpConfig.auth.user}>`,
            to: adminEmail,
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

// ============================================================================
// 제품 공유 이메일 발송 함수
// ============================================================================
export async function sendProductShareEmail(data: {
    productName: string;
    productDescription?: string;
    recipientEmail: string;
    senderName?: string;
    productUrl?: string;
}): Promise<boolean> {
    const smtpConfig = getSMTPConfig();

    // SMTP 설정이 없으면 로그만 남기고 성공 반환
    if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
        console.log('📧 [이메일 시뮬레이션] SMTP 설정 없음, 로그만 기록');
        console.log('받는 사람:', data.recipientEmail);
        console.log('제품 정보:', data);
        return true;
    }

    try {
        const transporter = nodemailer.createTransport(smtpConfig);

        const mailOptions = {
            from: `"한미르(주)" <${smtpConfig.auth.user}>`,
            to: data.recipientEmail,
            subject: `[한미르] ${data.productName} 제품 정보 공유`,
            html: `
                <div style="font-family: 'Noto Sans KR', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
                    <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; border-bottom: 3px solid #f59e0b; padding-bottom: 15px; margin-bottom: 20px;">
                            🎨 제품 정보 공유
                        </h2>
                        
                        <p style="color: #666; margin-bottom: 25px;">
                            ${data.senderName ? `${data.senderName}님이` : '누군가가'} 한미르(주)의 제품 정보를 공유했습니다.
                        </p>
                        
                        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                            <h3 style="color: #d97706; margin: 0 0 10px 0; font-size: 18px;">
                                ${data.productName}
                            </h3>
                            ${data.productDescription ? `
                                <p style="color: #666; margin: 0; line-height: 1.6;">
                                    ${data.productDescription}
                                </p>
                            ` : ''}
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="https://hanmirfe.com/ko/products/paint" 
                               style="display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                제품 상세 보기
                            </a>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                        
                        <div style="text-align: center;">
                            <p style="color: #999; font-size: 12px; margin: 0;">
                                이 이메일은 한미르(주) 웹사이트에서 발송되었습니다.<br />
                                <a href="https://hanmirfe.com" style="color: #f59e0b;">www.hanmirfe.com</a>
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ 제품 공유 이메일 발송 완료:', data.recipientEmail);
        return true;
    } catch (error) {
        console.error('❌ 제품 공유 이메일 발송 실패:', error);
        return false;
    }
}
