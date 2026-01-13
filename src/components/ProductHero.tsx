import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react';

// ============================================================================
// [ProductHero.tsx] - 제품 상세 페이지 히어로 컴포넌트
// ============================================================================

interface ProductHeroProps {
    title: string;
    koreanTitle: string;
    description: string;
    heroImage: string;
    isDevelopment?: boolean;  // 개발 진행중 표시
}

export const ProductHero: React.FC<ProductHeroProps> = ({ title, koreanTitle, description, heroImage, isDevelopment }) => {
    return (
        <section className="relative h-[70vh] w-full overflow-hidden flex items-end pb-20">
            {/* 배경 이미지 */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                    style={{ backgroundImage: `url(${heroImage})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
                {/* Breadcrumb */}
                <div className="mb-8 flex items-center gap-2 text-zinc-400 text-sm font-medium animate-fade-in-up">
                    <Link href="/" className="hover:text-white transition-colors flex items-center gap-1 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Main
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/products" className="text-blue-500 hover:text-blue-400 transition-colors">
                        제품소개
                    </Link>
                </div>

                {/* 메인 콘텐츠 */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {/* 개발 진행중 배지 */}
                    {isDevelopment && (
                        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/50 text-amber-400 text-sm font-bold px-4 py-2 rounded mb-4">
                            <AlertCircle className="w-4 h-4" />
                            개발 진행중
                        </div>
                    )}

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
