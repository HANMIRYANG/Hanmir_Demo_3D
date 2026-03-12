import { MetadataRoute } from 'next';

// ============================================================================
// [sitemap.ts] - 동적 사이트맵 생성
// ============================================================================
// 구글/네이버 크롤러가 사이트의 모든 페이지를 발견할 수 있도록
// 전체 URL 목록을 자동 생성합니다.
// ============================================================================

const BASE_URL = 'https://hanmirfe.com';

// 지원 언어
const locales = ['ko', 'en', 'cn'] as const;

// 정적 페이지 목록
const staticPages = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: '/company/about', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/company/ceo', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/company/history', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/company/location', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/products', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/products/paint', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/products/battery-pad', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/products/building-materials', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/products/home-appliances', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/resources', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/media', changeFrequency: 'weekly' as const, priority: 0.6 },
    { path: '/cases', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/notice', changeFrequency: 'weekly' as const, priority: 0.6 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/qna', changeFrequency: 'weekly' as const, priority: 0.6 },
];

// EV 화재안전 페이지 (쿼리 파라미터 포함)
const evFireSafetyPage = {
    path: '/products/paint?main=ev-fire-safety',
    changeFrequency: 'weekly' as const,
    priority: 0.95,
};

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const entries: MetadataRoute.Sitemap = [];

    // 정적 페이지 - 각 언어별로 생성
    for (const page of staticPages) {
        for (const locale of locales) {
            entries.push({
                url: `${BASE_URL}/${locale}${page.path}`,
                lastModified: now,
                changeFrequency: page.changeFrequency,
                priority: page.priority,
                alternates: {
                    languages: {
                        ko: `${BASE_URL}/ko${page.path}`,
                        en: `${BASE_URL}/en${page.path}`,
                        'zh-CN': `${BASE_URL}/cn${page.path}`,
                    },
                },
            });
        }
    }

    // EV 화재안전 페이지 (한국어 우선)
    entries.push({
        url: `${BASE_URL}/ko${evFireSafetyPage.path}`,
        lastModified: now,
        changeFrequency: evFireSafetyPage.changeFrequency,
        priority: evFireSafetyPage.priority,
    });

    return entries;
}
