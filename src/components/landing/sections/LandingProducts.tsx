"use client";
// ============================================================================
// LandingProducts.tsx - 원페이지 랜딩 제품소개 섹션
// ============================================================================

import React from 'react';
import { Flame, Building2, Home, Paintbrush } from 'lucide-react';

interface Props {
    locale: 'en' | 'cn';
}

const content = {
    en: {
        tagline: "Our Products",
        title: "Specialized Coating Solutions",
        description: "HANMIR provides a comprehensive range of functional coatings for various industries.",
        products: [
            {
                icon: Paintbrush,
                title: "Paint",
                description: "Architectural, marine, and industrial paints with superior durability and protection.",
                color: "from-amber-500 to-orange-600"
            },
            {
                icon: Flame,
                title: "Battery Pad",
                description: "Thermal runaway prevention pads for EV batteries and ESS systems.",
                color: "from-red-500 to-rose-600"
            },
            {
                icon: Building2,
                title: "Building Materials",
                description: "Eco-friendly construction materials with excellent insulation and fire resistance.",
                color: "from-blue-500 to-cyan-600"
            },
            {
                icon: Home,
                title: "Home Appliances",
                description: "Antibacterial and anti-fingerprint coatings for consumer electronics.",
                color: "from-purple-500 to-violet-600"
            }
        ],
        cta: "Contact Us for Details"
    },
    cn: {
        tagline: "我们的产品",
        title: "专业涂料解决方案",
        description: "韩美尔为各行业提供全面的功能性涂料产品。",
        products: [
            {
                icon: Paintbrush,
                title: "涂料",
                description: "具有卓越耐久性和保护性的建筑、船舶和工业涂料。",
                color: "from-amber-500 to-orange-600"
            },
            {
                icon: Flame,
                title: "电池垫",
                description: "用于电动汽车电池和储能系统的热失控防护垫。",
                color: "from-red-500 to-rose-600"
            },
            {
                icon: Building2,
                title: "建筑材料",
                description: "具有优异隔热和防火性能的环保建筑材料。",
                color: "from-blue-500 to-cyan-600"
            },
            {
                icon: Home,
                title: "家电产品",
                description: "用于消费电子产品的抗菌和防指纹涂层。",
                color: "from-purple-500 to-violet-600"
            }
        ],
        cta: "联系我们了解详情"
    }
};

export const LandingProducts: React.FC<Props> = ({ locale }) => {
    const t = content[locale];

    const handleContactClick = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-black py-24">
            <div className="max-w-7xl mx-auto px-6">
                {/* 헤더 */}
                <div className="text-center mb-16">
                    <p className="text-sm tracking-[0.3em] text-amber-400 mb-4 uppercase">{t.tagline}</p>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">{t.title}</h2>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">{t.description}</p>
                </div>

                {/* 제품 그리드 */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {t.products.map((product, idx) => (
                        <div
                            key={idx}
                            className="group relative bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 overflow-hidden"
                        >
                            {/* 그라데이션 배경 */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                            <div className="relative z-10">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-4`}>
                                    <product.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">{product.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">{product.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <button
                        onClick={handleContactClick}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors"
                    >
                        {t.cta}
                    </button>
                </div>
            </div>
        </div>
    );
};
