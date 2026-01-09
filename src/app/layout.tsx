import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FloatingContactBtn } from "@/components/FloatingContactBtn";

// ============================================================================
// [layout.tsx] - 전체 레이아웃 (모든 페이지에 적용)
// ============================================================================
// 이 파일은 모든 페이지에 공통으로 적용되는 레이아웃입니다.
// 폰트 설정, 메타데이터, 전역 스타일 등을 담당합니다.
// ============================================================================

// 🔧 [수정 포인트 #1] 폰트 설정
// Google Fonts에서 불러오는 폰트입니다.
// 다른 폰트로 변경하려면 next/font/google에서 해당 폰트를 import하세요.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ============================================================================
// 🔧 [수정 포인트 #2] SEO 메타데이터
// ============================================================================
// 브라우저 탭 제목과 검색엔진 설명에 표시되는 정보입니다.
// - title: 브라우저 탭에 표시되는 제목
// - description: 검색 결과에 표시되는 설명문
// ============================================================================
export const metadata: Metadata = {
  title: "HANMIR - Advanced Functional Paints",
  description: "High-performance functional coating solutions by HANMIR Co., Ltd.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 🔧 [수정 포인트 #3] HTML 언어 설정 - 한국어 사이트면 "ko"로 변경 권장
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 각 페이지의 콘텐츠가 여기에 렌더링됩니다 */}
        {children}

        {/* ================================================================
            📱 [플로팅 문의 버튼]
            모든 페이지 우측 하단에 표시되는 둥근 문의 버튼입니다.
            수정: src/components/FloatingContactBtn.tsx
        ================================================================ */}
        <FloatingContactBtn />
      </body>
    </html>
  );
}
