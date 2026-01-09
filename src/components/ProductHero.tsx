import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';

// ============================================================================
// [ProductHero.tsx] - 제품 상세 페이지 히어로 컴포넌트
// ============================================================================
// 이 파일은 개별 제품 상세 페이지(/products/[slug]) 상단에 표시되는
// 대형 배너 영역입니다. 제품명, 설명, 배경 이미지를 표시합니다.
// ============================================================================

// 컴포넌트 Props 정의
interface ProductHeroProps {
    title: string;        // 영문 제품명
    koreanTitle: string;  // 한글 제품명
    description: string;  // 제품 설명
    heroImage: string;    // 배경 이미지 URL
}

export const ProductHero: React.FC<ProductHeroProps> = ({ title, koreanTitle, description, heroImage }) => {
    return (
        <section className="relative h-[70vh] w-full overflow-hidden flex items-end pb-20">
            {/* ================================================================
                🔧 [수정 포인트 #1] 배경 이미지
                heroImage props로 전달받은 URL이 여기에 표시됩니다.
                이미지를 변경하려면 이 컴포넌트를 호출하는 곳에서 
                heroImage 값을 수정하세요.
            ================================================================ */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                    style={{ backgroundImage: `url(${heroImage})` }}
                ></div>
                {/* 텍스트 가독성을 위한 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
                {/* Breadcrumb / 뒤로가기 네비게이션 */}
                <div className="mb-8 flex items-center gap-2 text-zinc-400 text-sm font-medium animate-fade-in-up">
                    <Link href="/" className="hover:text-white transition-colors flex items-center gap-1 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Main
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-blue-500">Products</span>
                </div>

                {/* ============================================================
                    📝 [메인 콘텐츠]
                    - koreanTitle: 한글 제품명 (큰 글씨)
                    - title: 영문 제품명 (작은 글씨)
                    - description: 제품 설명문
                    이 값들은 props로 전달받으며, /products/[slug]/page.tsx에서 정의됩니다.
                ============================================================ */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
                        {koreanTitle}
                        <span className="block text-2xl md:text-3xl text-zinc-500 font-light mt-2 tracking-normal">
                            {title}
                        </span>
                    </h1>
                    <p className="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed border-l-2 border-blue-500 pl-6 mt-8">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    );
};
