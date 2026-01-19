"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowDown, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

// ============================================================================
// [Hero.tsx] - 메인 페이지 히어로(첫 화면) 섹션 (다국어 지원)
// ============================================================================

const Spline = dynamic(
    () => import("@splinetool/react-spline").then((m) => m.default),
    {
        ssr: false,
        loading: () => (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        ),
    }
);

export const Hero: React.FC = () => {
    const t = useTranslations();
    const pathname = usePathname();

    // 현재 언어 감지
    const getCurrentLocale = () => {
        if (pathname.startsWith('/en')) return 'en';
        if (pathname.startsWith('/cn')) return 'cn';
        return 'ko';
    };
    const locale = getCurrentLocale();

    const SPLINE_SCENE =
        "https://prod.spline.design/iCYtFSnvvRwm2M4o/scene.splinecode";

    return (
        <section className="relative w-full h-screen overflow-hidden bg-black flex flex-col justify-end pb-20">
            {/* 3D 배경 영역 */}
            <div className="absolute inset-0 w-full h-full z-0">
                <div className="absolute inset-0 w-full h-full opacity-60 grayscale-[30%] contrast-125 scale-110">
                    <Spline scene={SPLINE_SCENE} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* 콘텐츠 영역 */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-3xl">
                    {/* 태그라인 */}
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 border border-zinc-700 bg-black/50 backdrop-blur text-[11px] font-bold text-zinc-300">
                            {t('hero.tagline')}
                        </span>
                        <div className="h-[1px] w-20 bg-zinc-700" />
                    </div>

                    {/* 메인 슬로건 */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8">
                        {t('hero.title1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-500">
                            {t('hero.title2')}
                        </span>
                    </h1>

                    {/* 서브 설명문 */}
                    <p className="text-zinc-400 text-lg md:text-xl max-w-xl leading-relaxed mb-10 font-light break-keep">
                        {t('hero.description')}
                    </p>

                    {/* CTA 버튼들 */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <Link href={`/${locale}/products`} className="flex items-center justify-between px-8 py-4 bg-white text-black min-w-[200px] hover:bg-zinc-200 transition-colors group">
                            <span className="text-xs font-bold">{t('hero.cta.products')}</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href={`/${locale}/contact`} className="flex items-center justify-between px-8 py-4 border border-zinc-700 text-white min-w-[200px] hover:bg-white/5 transition-colors group backdrop-blur-sm">
                            <span className="text-xs font-bold">{t('hero.cta.contact')}</span>
                            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* 스크롤 유도 인디케이터 */}
            <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 z-20 opacity-50 pointer-events-none">
                <span className="text-[10px] tracking-widest uppercase rotate-90 origin-right translate-x-4">
                    {t('common.scroll')}
                </span>
                <div className="w-[1px] h-16 bg-zinc-700 mt-8" />
            </div>
        </section>
    );
};
