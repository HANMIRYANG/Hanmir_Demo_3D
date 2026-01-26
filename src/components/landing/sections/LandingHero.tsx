"use client";
// ============================================================================
// LandingHero.tsx - 원페이지 랜딩 히어로 섹션
// ============================================================================

import React from 'react';
import { ArrowDown } from 'lucide-react';

interface Props {
    locale: 'en' | 'cn';
}

const content = {
    en: {
        tagline: "The Future of Functional Coating",
        title1: "Where You Can't See,",
        title2: "We Paint Perfection",
        description: "HANMIR develops high-performance functional coatings for heat dissipation, fireproofing, and EMI shielding. Experience unchanging value even in extreme environments.",
        cta: "Explore Products",
        scroll: "Scroll"
    },
    cn: {
        tagline: "功能性涂料的未来",
        title1: "在看不见的地方",
        title2: "涂抹完美",
        description: "韩美尔开发用于散热、防火、电磁屏蔽等特殊用途的高性能功能性涂料。即使在极端环境下也能体验不变的价值。",
        cta: "探索产品",
        scroll: "滚动"
    }
};

export const LandingHero: React.FC<Props> = ({ locale }) => {
    const t = content[locale];

    const handleScrollDown = () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* 배경 이미지 */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2670&auto=format&fit=crop"
                    alt="Hero Background"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
            </div>

            {/* 콘텐츠 */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                <p className="text-sm md:text-base tracking-[0.3em] text-amber-400 mb-6 uppercase font-medium">
                    {t.tagline}
                </p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                    <span className="block">{t.title1}</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                        {t.title2}
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    {t.description}
                </p>
                <button
                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-black font-bold rounded-full hover:bg-amber-400 transition-colors"
                >
                    {t.cta}
                </button>
            </div>

            {/* 스크롤 인디케이터 */}
            <button
                onClick={handleScrollDown}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
                <span className="text-xs tracking-widest uppercase">{t.scroll}</span>
                <ArrowDown className="w-5 h-5 animate-bounce" />
            </button>
        </section>
    );
};
