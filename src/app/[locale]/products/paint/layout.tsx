import type { Metadata } from "next";

// ============================================================================
// [products/paint/layout.tsx] - 페인트 페이지 SEO 레이아웃
// ============================================================================
// page.tsx가 "use client"이므로 layout에서 메타데이터를 설정합니다.
// 불연, 단열, 차열, EV 화재안전 등 핵심 SEO 키워드를 포함합니다.
// ============================================================================

const BASE_URL = 'https://hanmirfe.com';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;

    if (locale === 'ko') {
        return {
            title: "기능성 페인트 | 불연·단열·방화 도료 & EV 화재안전 코팅",
            description:
                "한미르 기능성 페인트: 건축용 불연도료, 단열도료, 차열도료, 선박용 방청도료, 공업용 내화학 도료, EV 전기차 지하주차장 화재안전 나노세라믹 방화코팅. 수성 친환경 방식.",
            keywords: [
                "불연도료", "단열도료", "차열도료", "방화코팅", "건축페인트",
                "선박페인트", "공업용페인트", "EV 화재안전", "전기차 충전구역 방화",
                "지하주차장 화재대책", "나노세라믹코팅", "방화도료",
                "내화도료", "난연도료", "한미르 페인트",
            ],
            openGraph: {
                title: "기능성 페인트 | 불연·단열·방화 도료 & EV 화재안전 - 한미르",
                description: "건축·선박·공업용 불연/단열/차열 도료 및 EV 전기차 충전구역 화재안전 솔루션",
                url: `${BASE_URL}/${locale}/products/paint`,
            },
            alternates: {
                canonical: `${BASE_URL}/${locale}/products/paint`,
            },
        };
    }

    // EN
    if (locale === 'en') {
        return {
            title: "Functional Paints | Fire-resistant, Insulation & EV Fire Safety Coating",
            description: "HANMIR functional paints: architectural fire-resistant, thermal insulation, marine, industrial coatings and EV charging zone fire safety nano-ceramic coating solutions.",
            keywords: [
                "fire resistant paint", "thermal insulation coating", "EV fire safety",
                "nano ceramic coating", "HANMIR paint",
            ],
            openGraph: {
                title: "Functional Paints | Fire-resistant & EV Fire Safety - HANMIR",
                description: "Architectural, marine, industrial coatings and EV fire safety solutions",
                url: `${BASE_URL}/${locale}/products/paint`,
            },
        };
    }

    // CN
    return {
        title: "功能性涂料 | 防火·隔热涂料 & EV火灾安全涂层 - 韩美尔",
        description: "韩美尔功能性涂料：建筑防火涂料、隔热涂料、船舶涂料、工业涂料及EV电动车充电区火灾安全纳米陶瓷涂层解决方案。",
    };
}

export default function PaintLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
