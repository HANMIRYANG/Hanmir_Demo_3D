"use client";
// ============================================================================
// OneLandingPage.tsx - EN/CN 원페이지 랜딩 메인 컴포넌트
// ============================================================================

import React from 'react';
import { usePathname } from 'next/navigation';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './sections/LandingHero';
import { LandingAbout } from './sections/LandingAbout';
import { LandingProducts } from './sections/LandingProducts';
import { LandingContact } from './sections/LandingContact';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';

export const OneLandingPage: React.FC = () => {
    const pathname = usePathname();

    // 현재 언어 감지
    const getCurrentLocale = (): 'en' | 'cn' => {
        if (pathname.startsWith('/cn')) return 'cn';
        return 'en';
    };

    const locale = getCurrentLocale();

    return (
        <div className="min-h-screen bg-black text-white cursor-none selection:bg-blue-500 selection:text-white relative font-sans">
            <CustomCursor />
            <LandingNavbar />

            <main>
                {/* Hero Section */}
                <LandingHero locale={locale} />

                {/* About Section */}
                <section id="about">
                    <LandingAbout locale={locale} />
                </section>

                {/* Products Section */}
                <section id="products">
                    <LandingProducts locale={locale} />
                </section>

                {/* Contact Section */}
                <section id="contact">
                    <LandingContact locale={locale} />
                </section>
            </main>

            <Footer />
        </div>
    );
};
