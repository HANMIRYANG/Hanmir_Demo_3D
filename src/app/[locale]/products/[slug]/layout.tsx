import type { Metadata } from "next";
import { products } from "@/lib/product-data";

// ============================================================================
// [products/[slug]/layout.tsx] - 제품 상세 페이지 SEO 레이아웃
// ============================================================================
// page.tsx가 "use client"이므로 layout에서 generateMetadata를 사용하여
// 각 제품별 동적 SEO 메타데이터를 생성합니다.
// ============================================================================

const BASE_URL = 'https://hanmirfe.com';

// 제품별 SEO 데이터 (product-data.ts의 koreanTitle/description 기반)
const productSeo: Record<string, { title: string; description: string; keywords: string[] }> = {
    "battery-pad": {
        title: "2차전지 열폭방지 면압패드 - EV 배터리 안전 솔루션",
        description: "전기차 배터리 열폭주 방지 면압패드. 300℃ 이상 고온 안정성, 균일 압력 분산으로 EV·ESS 배터리팩의 안전성을 극대화하는 한미르의 핵심 기술.",
        keywords: ["열폭주방지", "면압패드", "EV 배터리", "전기차 배터리 안전", "ESS", "열관리", "2차전지", "한미르"],
    },
    "building-materials": {
        title: "친환경 건축자재 - 불연 단열 흡음 복합소재",
        description: "무기질 불연 코어 + 에어로젤 단열 기술의 친환경 건축자재. KS F ISO 1182 불연재 인증, 열관류율 0.15W/m²K, 포름알데히드 ZERO. 우수건축자재 선정.",
        keywords: ["불연건축자재", "단열건축자재", "친환경건축자재", "불연재", "에어로젤단열", "흡음재", "우수건축자재", "한미르"],
    },
    "home-appliances": {
        title: "가전제품 코팅 솔루션 - 항균·지문방지·자가치유",
        description: "프리미엄 가전제품을 위한 특수 코팅 기술. 99.9% 항균, 지문방지(AFP), 스크래치 자가치유 코팅으로 가전의 가치를 높이는 한미르 코팅 솔루션.",
        keywords: ["가전코팅", "항균코팅", "지문방지코팅", "AFP코팅", "자가치유코팅", "한미르"],
    },
};

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
    const { slug, locale } = await params;
    const product = products[slug];
    const seo = productSeo[slug];

    if (!product || !seo) {
        return { title: "제품 소개" };
    }

    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        openGraph: {
            title: `${seo.title} | 한미르`,
            description: seo.description,
            url: `${BASE_URL}/${locale}/products/${slug}`,
            images: product.heroImage ? [{ url: product.heroImage }] : undefined,
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}/products/${slug}`,
        },
    };
}

export default function ProductSlugLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
