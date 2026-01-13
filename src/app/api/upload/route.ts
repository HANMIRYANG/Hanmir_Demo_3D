// ============================================================================
// 파일 업로드 API (/api/upload)
// ============================================================================
// 로컬: public/uploads에 저장
// Vercel: Blob Storage 사용
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

// Vercel 환경 여부 확인
const isVercel = process.env.VERCEL === '1' || !!process.env.BLOB_READ_WRITE_TOKEN;

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

        // 고유한 파일명 생성
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const safeFileName = fileName.replace(/[^a-zA-Z0-9가-힣._-]/g, '_');

        // Vercel 환경: Blob Storage 사용
        if (isVercel) {
            const blobPath = `${type === 'image' ? 'images' : 'files'}/${timestamp}_${random}_${safeFileName}`;
            const blob = await put(blobPath, file, {
                access: 'public',
            });

            return NextResponse.json({
                success: true,
                url: blob.url,
                fileName: safeFileName,
                originalName: fileName,
                size: file.size
            });
        }

        // 로컬 환경: public/uploads에 저장
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', type === 'image' ? 'images' : 'files');

        // 디렉토리 생성
        await fs.mkdir(uploadDir, { recursive: true });

        const newFileName = `${timestamp}_${random}_${safeFileName}`;
        const filePath = path.join(uploadDir, newFileName);

        // 파일 저장
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, buffer);

        // URL 반환 (로컬용)
        const url = `/uploads/${type === 'image' ? 'images' : 'files'}/${newFileName}`;

        return NextResponse.json({
            success: true,
            url: url,
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
