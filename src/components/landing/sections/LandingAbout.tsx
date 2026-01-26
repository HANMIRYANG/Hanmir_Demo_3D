"use client";
// ============================================================================
// LandingAbout.tsx - 원페이지 랜딩 기업소개 섹션
// ============================================================================

import React from 'react';
import { Building2, Users, Award, Globe } from 'lucide-react';

interface Props {
    locale: 'en' | 'cn';
}

const content = {
    en: {
        tagline: "About HANMIR",
        title: "Leading Functional Coating Technology",
        description: "HANMIR Co., Ltd. is a specialized functional coating company founded in 2008. We develop high-performance paints for heat dissipation, fireproofing, and EMI shielding.",
        stats: [
            { icon: Building2, value: "2008", label: "Founded" },
            { icon: Users, value: "50+", label: "Partners" },
            { icon: Award, value: "15+", label: "Patents" },
            { icon: Globe, value: "10+", label: "Export Countries" }
        ],
        vision: {
            title: "Our Vision",
            text: "We strive to create innovative coating solutions that protect and enhance industrial applications worldwide."
        }
    },
    cn: {
        tagline: "关于韩美尔",
        title: "领先的功能性涂料技术",
        description: "韩美尔株式会社成立于2008年，是一家专业的功能性涂料公司。我们开发用于散热、防火和电磁屏蔽的高性能涂料。",
        stats: [
            { icon: Building2, value: "2008", label: "成立年份" },
            { icon: Users, value: "50+", label: "合作伙伴" },
            { icon: Award, value: "15+", label: "专利数量" },
            { icon: Globe, value: "10+", label: "出口国家" }
        ],
        vision: {
            title: "我们的愿景",
            text: "我们致力于创造创新的涂料解决方案，保护和增强全球工业应用。"
        }
    }
};

export const LandingAbout: React.FC<Props> = ({ locale }) => {
    const t = content[locale];

    return (
        <div className="bg-zinc-950 py-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* 헤더 */}
                <div className="text-center mb-16">
                    <p className="text-sm tracking-[0.3em] text-amber-400 mb-4 uppercase">{t.tagline}</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">{t.title}</h2>
                    <p className="text-lg text-zinc-400 max-w-3xl mx-auto">{t.description}</p>
                </div>

                {/* 통계 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    {t.stats.map((stat, idx) => (
                        <div key={idx} className="text-center p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                            <stat.icon className="w-8 h-8 text-amber-500 mx-auto mb-4" />
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                            <div className="text-sm text-zinc-500">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* 비전 */}
                <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-2xl p-8 md:p-12 border border-amber-500/20">
                    <h3 className="text-2xl font-bold mb-4 text-amber-400">{t.vision.title}</h3>
                    <p className="text-lg text-zinc-300 leading-relaxed">{t.vision.text}</p>
                </div>
            </div>
        </div>
    );
};
