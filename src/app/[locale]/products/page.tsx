import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';

// ============================================================================
// [products/page.tsx] - 제품 목록 페이지 (/products)
// ============================================================================
// 이 파일은 한미르의 모든 제품 라인업을 그리드 형태로 보여주는 페이지입니다.
// Features 컴포넌트를 재사용하여 제품 카드를 표시합니다.
// 각 카드 클릭 시 /products/[slug] 상세 페이지로 이동합니다.
// ============================================================================

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-amber-500 selection:text-white">
            {/* 공통 레이아웃 요소 */}
            <CustomCursor />
            <Navbar />

            <main className="pt-24">
                {/* ============================================================
                    🔧 [수정 포인트 #1] 페이지 헤더
                    - 제목: "Product Lineup"
                    - 설명문: "한미르의 첨단 기술력이 집약된..."
                ============================================================ */}
                <div className="py-20 px-6 bg-gray-50 border-b border-gray-200 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Product Lineup</h1>
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
