// ============================================================================
// 파일 업로드 API (/api/upload)
// ============================================================================
// POST: 파일 업로드 처리 (public/uploads 폴더에 저장)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { getCurrentAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // 관리자 인증 확인
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json(
                { error: '파일이 없습니다.' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 업로드 디렉토리 확인 및 생성
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }

        // 파일명 고유화 (타임스탬프 추가)
        const originalName = file.name;
        const timestamp = Date.now();
        const safeName = originalName.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        const fileName = `${timestamp}_${safeName}`;
        const filePath = join(uploadDir, fileName);

        // 파일 저장
        await writeFile(filePath, buffer);

        // 웹 접근 경로 반환
        const fileUrl = `/uploads/${fileName}`;

        return NextResponse.json({
            success: true,
            url: fileUrl,
            fileName: originalName,
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
