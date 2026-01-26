"use client";

import React, { useState } from 'react';
import { FeatureSection } from '@/lib/product-data';
import { ProductSubNav, SubNavItem } from './ProductSubNav';
import { CheckCircle2, Award, Target, Users, TrendingUp, Shield, Zap, Settings, Cpu, Factory, Building2, Car, Smartphone } from 'lucide-react';

interface ProductTabContentProps {
    koreanTitle: string;
    features: string[];
    longDescription: string;
    featureSections: FeatureSection[];
    techSpecs: Record<string, string>;
    applications: string[];
}

export default function ProductTabContent({
    koreanTitle,
    features,
    longDescription,
    featureSections,
    techSpecs,
    applications
}: ProductTabContentProps) {
    const [activeTab, setActiveTab] = useState('overview');

    const subNavItems: SubNavItem[] = [
        { label: '개요', id: 'overview' },
        { label: '핵심 기술', id: 'features' },
        { label: '기술 사양', id: 'specs' },
        { label: '적용 분야', id: 'applications' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab koreanTitle={koreanTitle} features={features} longDescription={longDescription} />;
            case 'features':
                return <FeaturesTab featureSections={featureSections} koreanTitle={koreanTitle} />;
            case 'specs':
                return <SpecsTab techSpecs={techSpecs} koreanTitle={koreanTitle} />;
            case 'applications':
                return <ApplicationsTab applications={applications} koreanTitle={koreanTitle} />;
            default:
                return null;
        }
    };

    return (
        <>
            <ProductSubNav
                productName={koreanTitle}
                items={subNavItems}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            <div className="min-h-[600px] bg-black">
                {renderContent()}
            </div>
        </>
    );
}

// ============================================================================
// 개요 탭 - 3개 섹션
// ============================================================================
function OverviewTab({ koreanTitle, features, longDescription }: { koreanTitle: string; features: string[]; longDescription: string }) {
    return (
        <div className="animate-fade-in">
            {/* Section 1: 제품 소개 */}
            <section className="py-24 bg-black relative">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-blue-500 font-mono text-sm mb-4 block">01 / INTRODUCTION</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                            혁신을 위한 <br />
                            <span className="text-blue-500">최적의 솔루션</span>
                        </h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {features.slice(0, 4).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-blue-500/50 transition-colors">
                                <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                                <span className="text-zinc-200 font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 2: 핵심 가치 */}
            <section className="py-24 bg-zinc-950 border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-blue-500 font-mono text-sm mb-4 block">02 / CORE VALUES</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">왜 한미르를 선택해야 할까요?</h2>
                        <p className="text-zinc-500 max-w-2xl mx-auto">20년간의 연구개발을 통해 축적된 기술력으로 최고의 품질을 보장합니다.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 text-center hover:border-blue-500/50 transition-colors">
                            <Award className="w-12 h-12 text-blue-500 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">품질 인증</h3>
                            <p className="text-zinc-400">ISO 9001:2015 품질경영 인증 및 다수의 국내외 특허 보유</p>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 text-center hover:border-blue-500/50 transition-colors">
                            <Target className="w-12 h-12 text-amber-500 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">맞춤 솔루션</h3>
                            <p className="text-zinc-400">고객 요구사항에 맞춘 1:1 맞춤형 제품 개발 서비스</p>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 text-center hover:border-blue-500/50 transition-colors">
                            <Users className="w-12 h-12 text-green-500 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">전문 기술 지원</h3>
                            <p className="text-zinc-400">제품 선정부터 시공까지 전 과정 기술 컨설팅</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: 숫자로 보는 한미르 */}
            <section className="py-24 bg-black border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-blue-500 font-mono text-sm mb-4 block">03 / ACHIEVEMENTS</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">숫자로 보는 한미르</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">20+</div>
                            <p className="text-zinc-400">년 업력</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">150+</div>
                            <p className="text-zinc-400">특허 및 인증</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">500+</div>
                            <p className="text-zinc-400">파트너사</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-2">98%</div>
                            <p className="text-zinc-400">고객 만족도</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// ============================================================================
// 핵심 기술 탭 - 3개 이상 섹션 (featureSections 데이터 활용)
// ============================================================================
function FeaturesTab({ featureSections, koreanTitle }: { featureSections: FeatureSection[]; koreanTitle: string }) {
    return (
        <div className="animate-fade-in">
            {/* Section 1: 기술 소개 헤더 */}
            <section className="py-20 bg-black text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <span className="text-blue-500 font-mono text-sm mb-4 block">CORE TECHNOLOGY</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{koreanTitle}의 핵심 기술</h2>
                    <p className="text-zinc-400 text-lg">한미르만의 독자적인 기술력으로 최고의 성능을 구현합니다.</p>
                </div>
            </section>

            {/* Section 2~4: Feature Sections (교차 레이아웃) */}
            <section className="bg-white">
                {featureSections.map((section, idx) => {
                    const isReversed = idx % 2 === 1;
                    return (
                        <div
                            key={idx}
                            className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} min-h-[500px]`}
                        >
                            <div className="w-full lg:w-1/2 h-[350px] lg:h-auto relative overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                                    style={{ backgroundImage: `url(${section.image})` }}
                                />
                            </div>
                            <div className={`w-full lg:w-1/2 flex items-center ${isReversed ? 'bg-zinc-100' : 'bg-zinc-50'}`}>
                                <div className="max-w-xl mx-auto px-8 lg:px-16 py-16">
                                    <span className="text-blue-500 font-mono text-sm mb-4 block">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className="text-3xl font-bold text-zinc-900 mb-6 leading-tight">
                                        {section.title}
                                    </h3>
                                    <p className="text-zinc-600 text-lg leading-relaxed">
                                        {section.description}
                                    </p>
                                    <div className="mt-8 h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-400" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Section 5: 기술 차별점 요약 */}
            <section className="py-20 bg-zinc-950 border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl font-bold text-white mb-4">기술 차별점</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800">
                            <Shield className="w-8 h-8 text-blue-500" />
                            <span className="text-white font-medium">안전성 검증</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800">
                            <Zap className="w-8 h-8 text-amber-500" />
                            <span className="text-white font-medium">고효율 성능</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800">
                            <Settings className="w-8 h-8 text-green-500" />
                            <span className="text-white font-medium">커스터마이징</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-zinc-800">
                            <TrendingUp className="w-8 h-8 text-purple-500" />
                            <span className="text-white font-medium">지속적 혁신</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// ============================================================================
// 기술 사양 탭 - 3개 섹션
// ============================================================================
function SpecsTab({ techSpecs, koreanTitle }: { techSpecs: Record<string, string>; koreanTitle: string }) {
    const entries = Object.entries(techSpecs);

    return (
        <div className="animate-fade-in">
            {/* Section 1: 스펙 그리드 */}
            <section className="py-24 bg-zinc-950 border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-12">
                        <div>
                            <span className="text-blue-500 font-mono text-sm mb-4 block">01 / SPECIFICATIONS</span>
                            <h2 className="text-3xl font-bold text-white mb-2">Technical Specifications</h2>
                            <p className="text-zinc-500">제품의 물리적/화학적 특성 데이터</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800 border border-zinc-800">
                        {entries.map(([key, value], idx) => (
                            <div key={idx} className="bg-zinc-950 p-6 flex flex-col justify-between hover:bg-zinc-900/50 transition-colors group">
                                <span className="text-zinc-500 text-sm font-mono mb-2">{key.toUpperCase()}</span>
                                <span className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-zinc-600 mt-6 text-right">
                        * 상기 데이터는 표준 실험 환경에서의 측정값이며 실제 환경에 따라 다소 차이가 있을 수 있습니다.
                    </p>
                </div>
            </section>

            {/* Section 2: 인증 및 시험 */}
            <section className="py-24 bg-black border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-blue-500 font-mono text-sm mb-4 block">02 / CERTIFICATIONS</span>
                        <h2 className="text-3xl font-bold text-white mb-4">인증 및 시험 성적</h2>
                        <p className="text-zinc-500">국내외 공인 기관의 시험 인증을 획득했습니다.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 text-center">
                            <div className="text-4xl font-bold text-blue-500 mb-4">ISO</div>
                            <h3 className="text-lg font-bold text-white mb-2">ISO 9001:2015</h3>
                            <p className="text-zinc-400 text-sm">품질경영시스템 인증</p>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 text-center">
                            <div className="text-4xl font-bold text-amber-500 mb-4">KS</div>
                            <h3 className="text-lg font-bold text-white mb-2">KS 규격 인증</h3>
                            <p className="text-zinc-400 text-sm">한국산업규격 적합</p>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 text-center">
                            <div className="text-4xl font-bold text-green-500 mb-4">CE</div>
                            <h3 className="text-lg font-bold text-white mb-2">CE 마크</h3>
                            <p className="text-zinc-400 text-sm">유럽 안전 규격 적합</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: 품질 관리 */}
            <section className="py-24 bg-zinc-950 border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-blue-500 font-mono text-sm mb-4 block">03 / QUALITY CONTROL</span>
                            <h2 className="text-3xl font-bold text-white mb-6">엄격한 품질 관리</h2>
                            <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                                모든 제품은 출하 전 전수 검사를 거치며, 최신 분석 장비를 통해 품질을 보증합니다.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-zinc-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    원자재 입고 검사
                                </li>
                                <li className="flex items-center gap-3 text-zinc-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    공정 중 품질 모니터링
                                </li>
                                <li className="flex items-center gap-3 text-zinc-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    완제품 출하 전수 검사
                                </li>
                                <li className="flex items-center gap-3 text-zinc-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    고객 불만 Zero 정책
                                </li>
                            </ul>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8">
                            <Cpu className="w-16 h-16 text-blue-500 mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-4">최첨단 분석 장비</h3>
                            <p className="text-zinc-400">SEM, XRD, TGA 등 최신 분석 장비를 갖춘 자체 연구소에서 모든 품질 검사를 수행합니다.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// ============================================================================
// 적용 분야 탭 - 3개 섹션
// ============================================================================
function ApplicationsTab({ applications, koreanTitle }: { applications: string[]; koreanTitle: string }) {
    const applicationIcons = [Factory, Building2, Car, Smartphone];

    return (
        <div className="animate-fade-in">
            {/* Section 1: 적용 분야 헤더 */}
            <section className="py-24 bg-black border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <span className="text-blue-500 font-mono text-sm mb-4 block">01 / APPLICATIONS</span>
                    <h3 className="text-3xl font-bold text-white mb-4">주요 적용 분야</h3>
                    <p className="text-zinc-500 mb-12 max-w-2xl mx-auto">
                        {koreanTitle}은(는) 다양한 산업 분야에서 최상의 성능과 안전성을 제공합니다.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        {applications.map((app, idx) => (
                            <div
                                key={idx}
                                className="px-8 py-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 text-zinc-200 font-bold text-lg hover:border-blue-500 hover:text-white hover:bg-zinc-900 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {app}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 2: 산업별 솔루션 */}
            <section className="py-24 bg-zinc-950 border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-blue-500 font-mono text-sm mb-4 block">02 / INDUSTRIES</span>
                        <h2 className="text-3xl font-bold text-white mb-4">산업별 맞춤 솔루션</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 hover:border-blue-500/50 transition-colors">
                            <Factory className="w-10 h-10 text-blue-500 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-3">제조/산업</h3>
                            <p className="text-zinc-400">공장 설비, 생산 라인, 산업 기계 등 다양한 산업 환경에 최적화된 솔루션을 제공합니다.</p>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 hover:border-blue-500/50 transition-colors">
                            <Building2 className="w-10 h-10 text-amber-500 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-3">건설/건축</h3>
                            <p className="text-zinc-400">고층 빌딩, 상업시설, 주거공간 등 다양한 건축물에 적용 가능한 솔루션입니다.</p>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 hover:border-blue-500/50 transition-colors">
                            <Car className="w-10 h-10 text-green-500 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-3">자동차/모빌리티</h3>
                            <p className="text-zinc-400">전기차, 하이브리드 차량, 자율주행 시스템 등 미래 모빌리티를 위한 솔루션입니다.</p>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 hover:border-blue-500/50 transition-colors">
                            <Smartphone className="w-10 h-10 text-purple-500 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-3">전자/IT</h3>
                            <p className="text-zinc-400">스마트폰, 노트북, 서버 등 전자기기의 성능과 안전성을 높이는 솔루션입니다.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: 레퍼런스 및 문의 */}
            <section className="py-24 bg-gradient-to-b from-black to-zinc-950 border-t border-zinc-900">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <span className="text-blue-500 font-mono text-sm mb-4 block">03 / CONTACT</span>
                    <h2 className="text-3xl font-bold text-white mb-6">프로젝트 문의</h2>
                    <p className="text-zinc-400 text-lg mb-8">
                        제품 적용에 대한 기술 상담이나 견적 문의는 언제든지 연락주세요.<br />
                        전문 엔지니어가 맞춤형 솔루션을 제안해 드립니다.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block px-8 py-4 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
                    >
                        문의하기
                    </a>
                </div>
            </section>
        </div>
    );
}
