import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import { FloatingContactBtn } from "@/components/FloatingContactBtn";
import { JsonLdOrganization } from "@/components/JsonLd";

// ============================================================================
// [locale]/layout.tsx - 다국어 레이아웃 (SEO 최적화)
// ============================================================================
// 각 언어별로 동적 메타데이터를 생성하여 검색엔진 최적화를 수행합니다.
// ============================================================================

const BASE_URL = 'https://hanmirfe.com';

// 언어별 SEO 메타데이터
const seoData: Record<string, { title: string; description: string; keywords: string[] }> = {
    ko: {
        title: "한미르 | 불연·단열·차열 기능성 도료 전문기업",
        description: "불연도료, 단열도료, 차열도료, 방화코팅, EV 전기차 지하주차장 화재안전 솔루션. 한미르(주)는 40여 종의 특허로 검증된 기능성 도료 전문기업입니다.",
        keywords: [
            "불연도료", "단열도료", "차열도료", "방화도료", "내화도료",
            "방화코팅", "난연도료", "기능성도료", "기능성페인트",
            "EV 화재안전", "전기차 화재", "지하주차장 화재",
            "나노세라믹코팅", "건축자재", "한미르",
        ],
    },
    en: {
        title: "HANMIR | Functional Coating Solutions – Fire-resistant, Insulation, Heat-shielding",
        description: "Fire-resistant coatings, thermal insulation paints, heat-shielding solutions, and EV charging zone fire safety by HANMIR Co., Ltd.",
        keywords: [
            "fire resistant coating", "thermal insulation paint", "heat shielding paint",
            "EV fire safety", "functional coating", "HANMIR",
        ],
    },
    cn: {
        title: "韩美尔 | 防火·隔热·隔热功能性涂料专业企业",
        description: "防火涂料、隔热涂料、隔热涂料、防火涂层、EV电动车地下停车场火灾安全解决方案。",
        keywords: [
            "防火涂料", "隔热涂料", "功能性涂料", "EV火灾安全", "韩美尔",
        ],
    },
};

// 동적 메타데이터 생성
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const seo = seoData[locale] || seoData.ko;

    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        openGraph: {
            title: seo.title,
            description: seo.description,
            url: `${BASE_URL}/${locale}`,
            locale: locale === 'ko' ? 'ko_KR' : locale === 'cn' ? 'zh_CN' : 'en_US',
        },
        alternates: {
            canonical: `${BASE_URL}/${locale}`,
            languages: {
                ko: `${BASE_URL}/ko`,
                en: `${BASE_URL}/en`,
                'zh-CN': `${BASE_URL}/cn`,
            },
        },
    };
}

// Next.js 15+ params는 Promise
type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
    children,
    params
}: Props) {
    // params가 Promise인 경우 await
    const { locale } = await params;

    // 지원하지 않는 언어인 경우 404
    if (!locales.includes(locale as any)) {
        notFound();
    }

    // 해당 언어의 메시지 로드
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            {/* Organization 구조화 데이터 (JSON-LD) */}
            <JsonLdOrganization />
            {children}
            <FloatingContactBtn />
        </NextIntlClientProvider>
    );
}

