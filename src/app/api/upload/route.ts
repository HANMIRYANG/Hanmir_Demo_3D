// ============================================================================
// 파일 업로드 API (/api/upload)
// ============================================================================
// Vercel Blob 클라이언트 업로드를 위한 토큰 발급 + 로컬 환경 지원
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { put } from '@vercel/blob';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

// Vercel 환경 여부 확인
const isVercel = process.env.VERCEL === '1' || !!process.env.BLOB_READ_WRITE_TOKEN;

// 허용된 파일 타입
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-hwp',
    'application/haansofthwp',
];

// POST: 파일 업로드 (클라이언트 업로드 토큰 발급 또는 직접 업로드)
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const contentType = request.headers.get('content-type') || '';

        // =====================================================================
        // Vercel 환경: 클라이언트 업로드 토큰 발급 (JSON 요청)
        // =====================================================================
        if (isVercel && contentType.includes('application/json')) {
            const body = (await request.json()) as HandleUploadBody;

            const jsonResponse = await handleUpload({
                body,
                request,
                onBeforeGenerateToken: async (pathname) => {
                    // 허용된 Content-Type 설정
                    return {
                        allowedContentTypes: [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES],
                        maximumSizeInBytes: 50 * 1024 * 1024, // 50MB
                        tokenPayload: JSON.stringify({ uploadedAt: new Date().toISOString() }),
                    };
                },
                onUploadCompleted: async ({ blob, tokenPayload }) => {
                    console.log('Blob 업로드 완료:', blob.url);
                },
            });

            return NextResponse.json(jsonResponse);
        }

        // =====================================================================
        // FormData 업로드 (로컬 환경 또는 레거시 지원)
        // =====================================================================
        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') as File;
            const type = formData.get('type') as string || 'image';

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

            // Vercel 환경: Blob Storage 사용 (FormData fallback)
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
        }

        return NextResponse.json(
            { error: '지원하지 않는 요청 형식입니다.' },
            { status: 400 }
        );
    } catch (error) {
        console.error('파일 업로드 오류:', error);
        return NextResponse.json(
            { error: '파일 업로드 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
