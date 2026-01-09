// ============================================================================
// 기술자료 관리 API (/api/admin/resources)
// ============================================================================
// GET: 자료 목록 조회
// POST: 새 자료 등록
// DELETE: 자료 삭제
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logActivity } from '@/lib/activity'; // Import logActivity
import { unlink } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

// ============================================================================
// GET - 자료 목록 조회
// ============================================================================
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        const where: any = {};
        if (category && category !== 'all') {
            where.category = category;
        }
        if (search) {
            where.title = { contains: search, mode: 'insensitive' };
        }

        const resources = await prisma.resource.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ resources });
    } catch (error) {
        console.error('자료 조회 오류:', error);
        return NextResponse.json(
            { error: '자료 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// ============================================================================
// POST - 새 자료 등록
// ============================================================================
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

        const body = await request.json();
        const { title, category, fileName, filePath, fileSize, format } = body;

        if (!title || !category || !filePath) {
            return NextResponse.json(
                { error: '필수 항목이 누락되었습니다.' },
                { status: 400 }
            );
        }

        const resource = await prisma.resource.create({
            data: {
                title,
                category,
                fileName,
                filePath,
                fileSize,
                format: format || 'UNKNOWN'
            }
        });

        // 활동 로그 기록
        await logActivity('CREATE', 'Resource', resource.id, `${title} (${category}) 등록`);

        return NextResponse.json({
            success: true,
            resource
        });
    } catch (error) {
        console.error('자료 등록 오류:', error);
        return NextResponse.json(
            { error: '자료 등록 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// ============================================================================
// DELETE - 자료 삭제
// ============================================================================
export async function DELETE(request: NextRequest) {
    try {
        // 관리자 인증 확인
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: '삭제할 자료 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        // 삭제할 자료 조회 (파일 경로 확인용)
        const resource = await prisma.resource.findUnique({
            where: { id }
        });

        if (!resource) {
            return NextResponse.json(
                { error: '자료를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // DB에서 삭제
        await prisma.resource.delete({
            where: { id }
        });

        // 실제 파일 삭제 시도 (실패해도 DB 삭제는 유지)
        try {
            const fullPath = join(process.cwd(), 'public', resource.filePath.replace(/^\//, ''));
            // 파일 삭제 로직은 주석 처리 (실수 방지), 필요 시 해제
            // await unlink(fullPath);
        } catch (err) {
            console.warn('파일 삭제 실패 (파일이 없거나 권한 부족):', err);
        }

        // 활동 로그 기록
        await logActivity('DELETE', 'Resource', id, `${resource.title} 삭제`);

        return NextResponse.json({
            success: true,
            message: '자료가 삭제되었습니다.'
        });
    } catch (error) {
        console.error('자료 삭제 오류:', error);
        return NextResponse.json(
            { error: '자료 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
