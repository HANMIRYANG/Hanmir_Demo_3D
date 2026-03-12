import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ============================================================================
// [layout.tsx] - 루트 레이아웃
// ============================================================================
// 모든 페이지에 적용되는 최상위 레이아웃입니다.
// 폰트 설정, 메타데이터(SEO), 전역 스타일을 담당합니다.
// ============================================================================

const BASE_URL = 'https://hanmirfe.com';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // ─── 기본 메타 ───
  metadataBase: new URL(BASE_URL),
  title: {
    default: "한미르 | 불연·단열·차열 기능성 도료 전문기업",
    template: "%s | 한미르",
  },
  description:
    "불연도료, 단열도료, 차열도료, 방화코팅, EV 전기차 지하주차장 화재안전 솔루션. 한미르(주)는 40여 종의 특허로 검증된 기능성 도료 전문기업입니다.",
  keywords: [
    "불연도료", "단열도료", "차열도료", "방화도료", "내화도료",
    "방화코팅", "난연도료", "기능성도료", "기능성페인트",
    "EV 화재안전", "전기차 화재", "지하주차장 화재", "전기차 충전구역 방화",
    "나노세라믹코팅", "열폭주방지", "건축자재", "친환경건축자재",
    "한미르", "HANMIR", "한미르 주식회사",
  ],

  // ─── 아이콘 ───
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  // ─── Open Graph (카카오톡/SNS 공유 미리보기) ───
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: BASE_URL,
    siteName: "한미르 주식회사",
    title: "한미르 | 불연·단열·차열 기능성 도료 전문기업",
    description:
      "불연도료, 단열도료, 차열도료, 방화코팅, EV 전기차 지하주차장 화재안전 솔루션. 40여 종의 특허로 검증된 기능성 도료 전문기업.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "한미르 - 불연·단열·차열 기능성 도료 전문기업" }],
  },

  // ─── Twitter Card ───
  twitter: {
    card: "summary_large_image",
    title: "한미르 | 불연·단열·차열 기능성 도료 전문기업",
    description:
      "불연도료, 단열도료, 차열도료, EV 전기차 화재안전 솔루션 전문기업",
  },

  // ─── 검색엔진 크롤링 설정 ───
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ─── 다국어 대체 URL ───
  alternates: {
    canonical: BASE_URL,
    languages: {
      "ko": `${BASE_URL}/ko`,
      "en": `${BASE_URL}/en`,
      "zh-CN": `${BASE_URL}/cn`,
    },
  },

  // ─── 네이버 웹마스터 도구 인증 (추후 코드 입력) ───
  verification: {
    google: "jgJ0Y7A4CHs4IrNSoqx7SwQCDQj-gYYf2hD2ptvORZo",
    other: { "naver-site-verification": "eb796fbb0d4c69e84e5ad064d825231a9bc4fbb9" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
