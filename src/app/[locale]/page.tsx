"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { ChatWidget } from '@/components/ChatWidget';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import { useTranslations } from 'next-intl';
import { OneLandingPage } from '@/components/landing/OneLandingPage';

// ============================================================================
// [locale]/page.tsx - 메인 홈페이지 (다국어 지원)
// KO: 기존 다중 페이지 구조
// EN/CN: 원페이지 랜딩
// ============================================================================

export default function Home() {
    const t = useTranslations();
    const pathname = usePathname();

    // 현재 언어 감지
    const isKorean = pathname.startsWith('/ko') || (!pathname.startsWith('/en') && !pathname.startsWith('/cn'));

    // EN/CN은 원페이지 랜딩
    if (!isKorean) {
        return <OneLandingPage />;
    }

    // KO는 기존 구조 유지
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white cursor-none">
            <CustomCursor />
            <Navbar />

            <main>
                <Hero />

                {/* 통계 밴드 */}
                <div className="w-full bg-zinc-900 border-y border-zinc-800 py-12 cursor-none">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: t('stats.partners'), val: "100+" },
                            { label: t('stats.patents'), val: "40+" },
                            { label: t('stats.countries'), val: "5+" },
                            { label: t('stats.satisfaction'), val: "99%" }
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col border-l border-zinc-700 pl-6 group hover:bg-zinc-800/50 transition-colors p-2 rounded">
                                <span className="text-3xl font-bold text-white tracking-tighter group-hover:text-blue-500 transition-colors">{stat.val}</span>
                                <span className="text-sm font-bold text-zinc-500 mt-1">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <Features />

                {/* 중간 인용문 구간 */}
                <section className="py-32 bg-black relative overflow-hidden cursor-none">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale"></div>
                    <div className="relative max-w-7xl mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-snug">
                            "{t('quote.text')}"
                        </h2>
                        <p className="text-zinc-400 font-medium">HANMIR Co., Ltd.</p>
                    </div>
                </section>

                <Contact />
            </main>

            <Footer />
            <ChatWidget />
        </div>
    );
}
