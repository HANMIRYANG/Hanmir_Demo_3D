import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import { CompanyDownloadCTA } from '@/components/company/CompanyDownloadCTA';
import { Target, Eye, Heart, Lightbulb } from 'lucide-react';

// ============================================================================
// 회사 소개 페이지 (/company/about)
// ============================================================================

export default function AboutPage() {
    const sections = [
        {
            icon: Target,
            title: '경영 이념',
            subtitle: 'Management Philosophy',
            content: '끊임없는 혁신과 도전을 통해 고객의 가치를 창출하고, 지속 가능한 성장을 추구합니다. 우리는 기술력과 신뢰를 바탕으로 글로벌 시장을 선도하는 기업이 되고자 합니다.',
            highlight: '혁신 · 도전 · 신뢰'
        },
        {
            icon: Eye,
            title: '회사 비전',
            subtitle: 'Company Vision',
            content: '세계 최고의 기능성 코팅 전문 기업으로 도약하여, 인류의 안전과 환경 보호에 기여하는 것이 우리의 비전입니다. 차별화된 기술력으로 글로벌 Top 5 진입을 목표로 합니다.',
            highlight: 'Global Top 5 목표'
        },
        {
            icon: Heart,
            title: '핵심 가치',
            subtitle: 'Core Values',
            content: '고객 중심의 사고, 품질 최우선 원칙, 환경 친화적 경영, 그리고 임직원의 행복 추구. 이 네 가지 가치가 한미르의 모든 의사결정과 행동의 기준이 됩니다.',
            highlight: '고객 · 품질 · 환경 · 행복'
        },
        {
            icon: Lightbulb,
            title: '핵심 역량',
            subtitle: 'Core Competencies',
            content: '42개 이상의 특허 기술, 자체 연구소 보유, 16년 이상의 업계 경험, 그리고 글로벌 네트워크. 이러한 역량을 바탕으로 최고 품질의 제품과 서비스를 제공합니다.',
            highlight: '42+ 특허 · 16+ 년 경력'
        }
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-amber-500 selection:text-white">
            <CustomCursor />
            <Navbar />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="relative py-24 px-6 border-b border-gray-200 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                            <span>Home</span>
                            <span>/</span>
                            <span>기업소개</span>
                            <span>/</span>
                            <span className="text-gray-900 font-bold">소개</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900">
                            한미르(주) <span className="text-amber-600">소개</span>
                        </h1>
                        <p className="text-gray-500 text-lg max-w-3xl leading-relaxed">
                            2009년 창립 이래, 끊임없는 연구개발과 혁신을 통해<br className="hidden md:block" />
                            대한민국 특수 도료 산업을 선도해온 기업입니다.
                        </p>
                    </div>
                </section>

                {/* 4개 섹션 그리드 */}
                <section className="py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {sections.map((section, index) => (
                                <div
                                    key={index}
                                    className="p-8 bg-white border border-gray-200 rounded-lg hover:border-amber-500/50 hover:shadow-lg transition-all group"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                                            <section.icon className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                                            <p className="text-sm text-gray-400">{section.subtitle}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        {section.content}
                                    </p>
                                    <div className="inline-block px-4 py-2 bg-gray-100 text-amber-600 font-bold text-sm rounded">
                                        {section.highlight}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 인증 현황 */}
                <section className="py-16 px-6 bg-gray-50 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">인증 및 수상 내역</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['ISO 9001', 'ISO 14001', 'INNO-BIZ', '벤처기업인증'].map((cert, idx) => (
                                <div key={idx} className="p-6 border border-gray-200 rounded-lg bg-white hover:border-amber-500 transition-colors">
                                    <span className="text-gray-700 font-bold">{cert}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 회사소개서 다운로드 */}
                <CompanyDownloadCTA />
            </main>

            <Footer />
        </div>
    );
}
