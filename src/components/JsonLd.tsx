// ============================================================================
// [JsonLd.tsx] - JSON-LD 구조화 데이터 컴포넌트
// ============================================================================
// 구글/네이버 검색 결과에 리치 스니펫(회사 정보, 제품 정보, 빵부스러기 등)을
// 표시하기 위한 구조화된 데이터를 삽입합니다.
// ============================================================================

import React from 'react';

// ─── Organization 스키마 (회사 정보) ───
export function JsonLdOrganization() {
    const data = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "한미르 주식회사",
        "alternateName": "HANMIR Co., Ltd.",
        "url": "https://hanmirfe.com",
        "logo": "https://hanmirfe.com/logo.png",
        "description": "불연·단열·차열 기능성 도료 전문 제조기업. 방화코팅, EV 전기차 충전구역 화재안전 솔루션 제공.",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "KR",
            "addressRegion": "인천광역시",
            "addressLocality": "서구",
            "streetAddress": "도담로 190"
        },
        "sameAs": [
            "https://smartstore.naver.com/hanmir"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// ─── Product 스키마 (제품 정보) ───
interface ProductJsonLdProps {
    name: string;
    description: string;
    url: string;
    image?: string;
    brand?: string;
}

export function JsonLdProduct({ name, description, url, image, brand = "한미르" }: ProductJsonLdProps) {
    const data = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": name,
        "description": description,
        "url": url,
        "brand": {
            "@type": "Brand",
            "name": brand
        },
        ...(image && { "image": image }),
        "manufacturer": {
            "@type": "Organization",
            "name": "한미르 주식회사"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// ─── BreadcrumbList 스키마 (탐색 경로) ───
interface BreadcrumbItem {
    name: string;
    url: string;
}

export function JsonLdBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
    const data = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// ─── FAQPage 스키마 (EV 화재안전 FAQ) ───
interface FaqItem {
    question: string;
    answer: string;
}

export function JsonLdFaq({ items }: { items: FaqItem[] }) {
    const data = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": items.map((item) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
