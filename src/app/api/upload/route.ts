// ============================================================================
// 파일 업로드 API (/api/upload)
// ============================================================================
// Vercel Blob Storage를 사용한 파일 업로드
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import path from 'path';

export const dynamic = 'force-dynamic';

// POST: 파일 업로드
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string || 'image'; // 'image' or 'attachment'

        if (!file) {
            return NextResponse.json(
                { error: '파일이 없습니다.' },
                { status: 400 }
            );
        }

        // 파일 확장자 확인
        const fileName = file.name;
        const fileExt = path.extname(fileName).toLowerCase();

        // 허용된 파일 타입
        const allowedImageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const allowedAttachmentExts = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.hwp'];

        if (type === 'image' && !allowedImageExts.includes(fileExt)) {
            return NextResponse.json(
                { error: '허용되지 않은 이미지 형식입니다. (jpg, jpeg, png, gif, webp, svg)' },
                { status: 400 }
            );
        }

        if (type === 'attachment' && !allowedAttachmentExts.includes(fileExt) && !allowedImageExts.includes(fileExt)) {
            return NextResponse.json(
                { error: '허용되지 않은 파일 형식입니다.' },
                { status: 400 }
            );
        }

        // 고유한 파일명 생성 (타임스탬프 + 랜덤 + 원본이름)
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const safeFileName = fileName.replace(/[^a-zA-Z0-9가-힣._-]/g, '_');
        const newFileName = `${type === 'image' ? 'images' : 'files'}/${timestamp}_${random}_${safeFileName}`;

        // Vercel Blob에 업로드
        const blob = await put(newFileName, file, {
            access: 'public',
        });

        return NextResponse.json({
            success: true,
            url: blob.url,
            fileName: safeFileName,
            originalName: fileName,
            size: file.size
        });
    } catch (error) {
        console.error('파일 업로드 오류:', error);
        return NextResponse.json(
            { error: '파일 업로드 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
