import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

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

        // 업로드 폴더 설정
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', type === 'image' ? 'images' : 'files');

        // 폴더가 없으면 생성
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // 고유한 파일명 생성 (타임스탬프 + 랜덤 + 원본이름)
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const safeFileName = fileName.replace(/[^a-zA-Z0-9가-힣._-]/g, '_');
        const newFileName = `${timestamp}_${random}_${safeFileName}`;
        const filePath = path.join(uploadDir, newFileName);

        // 파일 저장
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // URL 생성
        const url = `/uploads/${type === 'image' ? 'images' : 'files'}/${newFileName}`;

        return NextResponse.json({
            success: true,
            url,
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
