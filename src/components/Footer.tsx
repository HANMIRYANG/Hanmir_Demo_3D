"use client";

import React from 'react';
import { useTranslations } from "next-intl";

// ============================================================================
// [Footer.tsx] - 하단 푸터 컴포넌트 (다국어 지원)
// ============================================================================

export const Footer: React.FC = () => {
    const t = useTranslations();

    return (
        <footer className="bg-gray-900 py-12 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs font-medium">
                <p>{t('footer.copyright')}</p>
                <div className="flex gap-8 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white transition-colors">{t('footer.links.privacy')}</a>
                    <a href="#" className="hover:text-white transition-colors">{t('footer.links.terms')}</a>
                    <a href="#" className="hover:text-white transition-colors">{t('footer.links.sitemap')}</a>
                </div>
            </div>
        </footer>
    );
};
