// ============================================================================
// 통합 검색 API - GET /api/search
// ============================================================================
// 쿼리 파라미터:
// - q: 검색어 (필수)
// - type: 콘텐츠 타입 필터 (선택, 기본값: all)
// - limit: 각 타입별 최대 결과 수 (선택, 기본값: 10)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { products } from '@/lib/product-data';
import { SearchResultItem, SearchResponse } from '@/types';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q')?.trim();
        const type = searchParams.get('type') || 'all';
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!query || query.length < 1) {
            return NextResponse.json({
                products: [],
                resources: [],
                notices: [],
                media: [],
                qna: [],
                cases: [],
                totalCount: 0
            });
        }

        const searchLower = query.toLowerCase();
        const response: SearchResponse = {
            products: [],
            resources: [],
            notices: [],
            media: [],
            qna: [],
            cases: [],
            totalCount: 0
        };

        // ========================================
        // 1. 제품 검색 (정적 데이터)
        // ========================================
        if (type === 'all' || type === 'products') {
            const productResults: SearchResultItem[] = Object.values(products)
                .filter(product =>
                    product.title.toLowerCase().includes(searchLower) ||
                    product.koreanTitle.toLowerCase().includes(searchLower) ||
                    product.description.toLowerCase().includes(searchLower) ||
                    product.longDescription.toLowerCase().includes(searchLower) ||
                    product.features.some(f => f.toLowerCase().includes(searchLower))
                )
                .slice(0, limit)
                .map(product => ({
                    id: product.id,
                    type: 'product' as const,
                    title: product.koreanTitle,
                    description: product.description,
                    url: `/products/${product.id}`,
                    category: product.title
                }));
            response.products = productResults;
        }

        // ========================================
        // 2. 기술자료 검색 (DB)
        // ========================================
        if (type === 'all' || type === 'resources') {
            const resources = await prisma.resource.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { category: { contains: query, mode: 'insensitive' } },
                        { fileName: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: limit,
                orderBy: { createdAt: 'desc' }
            });
            response.resources = resources.map(r => ({
                id: r.id,
                type: 'resource' as const,
                title: r.title,
                description: `${r.category} · ${r.format}`,
                url: '/resources',
                date: r.createdAt.toISOString().split('T')[0],
                category: r.category
            }));
        }

        // ========================================
        // 3. 공지사항 검색 (DB)
        // ========================================
        if (type === 'all' || type === 'notices') {
            const notices = await prisma.notice.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { category: { contains: query, mode: 'insensitive' } },
                        { content: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: limit,
                orderBy: { createdAt: 'desc' }
            });
            response.notices = notices.map(n => ({
                id: n.id,
                type: 'notice' as const,
                title: n.title,
                description: n.content?.substring(0, 100) || '',
                url: `/notice?id=${n.id}`,
                date: n.createdAt.toISOString().split('T')[0],
                category: n.category
            }));
        }

        // ========================================
        // 4. 미디어 검색 (DB)
        // ========================================
        if (type === 'all' || type === 'media') {
            const media = await prisma.mediaItem.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { category: { contains: query, mode: 'insensitive' } },
                        { content: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: limit,
                orderBy: { createdAt: 'desc' }
            });
            response.media = media.map(m => ({
                id: m.id,
                type: 'media' as const,
                title: m.title,
                description: m.content?.substring(0, 100) || '',
                url: '/media',
                date: m.createdAt.toISOString().split('T')[0],
                category: m.category
            }));
        }

        // ========================================
        // 5. Q&A 검색 (DB)
        // ========================================
        if (type === 'all' || type === 'qna') {
            const qna = await prisma.qnaPost.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { content: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: limit,
                orderBy: { createdAt: 'desc' }
            });
            response.qna = qna.map(q => ({
                id: q.id,
                type: 'qna' as const,
                title: q.title,
                description: q.content?.substring(0, 100) || '',
                url: `/qna?id=${q.id}`,
                date: q.createdAt.toISOString().split('T')[0],
                category: q.isAnswered ? '답변완료' : '대기중'
            }));
        }

        // ========================================
        // 6. 시공사례 검색 (DB)
        // ========================================
        if (type === 'all' || type === 'cases') {
            const cases = await prisma.constructionCase.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { category: { contains: query, mode: 'insensitive' } },
                        { content: { contains: query, mode: 'insensitive' } }
                    ]
                },
                take: limit,
                orderBy: { createdAt: 'desc' }
            });
            response.cases = cases.map(c => ({
                id: c.id,
                type: 'case' as const,
                title: c.title,
                description: c.content?.substring(0, 100) || '',
                url: '/cases',
                date: c.createdAt.toISOString().split('T')[0],
                category: c.category
            }));
        }

        // 전체 결과 수 계산
        response.totalCount =
            response.products.length +
            response.resources.length +
            response.notices.length +
            response.media.length +
            response.qna.length +
            response.cases.length;

        return NextResponse.json(response);

    } catch (error) {
        console.error('Search API Error:', error);
        return NextResponse.json(
            { error: '검색 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
