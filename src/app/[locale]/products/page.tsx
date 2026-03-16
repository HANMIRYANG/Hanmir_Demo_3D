import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';
// [DISABLED] 커스텀 커서 비활성화
// import { CustomCursor } from '@/components/CustomCursor';

// ============================================================================
// [products/page.tsx] - 제품 목록 페이지 (/products)
// ============================================================================

export const metadata: Metadata = {
    title: "제품소개 | 불연·단열·차열 기능성 도료 및 건축자재",
    description:
        "한미르 제품 라인업: 기능성 도료(불연도료, 단열도료, 차열도료), 2차전지 열폭방지 면압패드, 친환경 건축자재, EV 전기차 화재안전 솔루션 등 전체 제품을 소개합니다.",
    keywords: [
        "불연도료", "단열도료", "차열도료", "기능성도료", "건축자재",
        "2차전지 면압패드", "EV 화재안전", "한미르 제품",
    ],
};

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-amber-500 selection:text-white">
            {/* [DISABLED] <CustomCursor /> */}
            <Navbar />

            <main className="pt-24">
                <div className="py-20 px-6 bg-gray-50 border-b border-gray-200 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">한미르 제품 라인업</h1>
                    <p className="text-gray-500">한미르의 첨단 기술력이 집약된 핵심 제품군을 소개합니다.</p>
                </div>

                {/* ============================================================
                    📦 [제품 목록 그리드]
                    Features 컴포넌트를 재사용합니다.
                    제품 추가/수정: src/components/Features.tsx의 features 배열
                ============================================================ */}
                <Features />

                {/* 하단 문의 섹션 (필요 시 추가) */}
            </main>

            <Footer />
        </div>
    );
}
