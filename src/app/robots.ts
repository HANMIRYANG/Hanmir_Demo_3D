import { MetadataRoute } from 'next';

// ============================================================================
// [robots.ts] - 크롤러 접근 규칙 설정
// ============================================================================
// 구글/네이버 크롤러에 크롤링 허용/차단 규칙과 사이트맵 위치를 알려줍니다.
// ============================================================================

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
        ],
        sitemap: 'https://hanmirfe.com/sitemap.xml',
    };
}
