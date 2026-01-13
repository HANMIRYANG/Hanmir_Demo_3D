import React from 'react';
import { Layers, Battery, Building2, Tv, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// ============================================================================
// [Features.tsx] - 제품 카테고리 그리드 컴포넌트
// ============================================================================
// 4개의 제품 카테고리를 그리드 형태로 보여주는 섹션입니다.
// 각 카드를 클릭하면 해당 제품 상세 페이지(/products/[slug])로 이동합니다.
// ============================================================================

const features = [
    {
        title: "기능성 도료 솔루션",
        slug: "paint",
        desc: "방열, 불연, EMI 차폐, 초발수 등 다양한 기능성 도료의 원스톱 솔루션",
        icon: <Layers className="w-6 h-6 text-amber-600" />,
        isDevelopment: false
    },
    {
        title: "2차 전지 열폭방지 면압패드",
        slug: "battery-pad",
        desc: "전기차 배터리의 열폭주를 방지하고 안전성을 극대화하는 고성능 면압패드",
        icon: <Battery className="w-6 h-6 text-amber-600" />,
        isDevelopment: false
    },
    {
        title: "친환경 건축자재",
        slug: "building-materials",
        desc: "단열, 불연, 흡음 성능을 갖춘 차세대 친환경 건축 소재",
        icon: <Building2 className="w-6 h-6 text-amber-600" />,
        isDevelopment: false
    },
    {
        title: "가전제품 코팅",
        slug: "home-appliances",
        desc: "프리미엄 가전의 외관과 내구성을 높이는 특수 코팅 기술",
        icon: <Tv className="w-6 h-6 text-amber-600" />,
        isDevelopment: true // ⚠️ 개발 진행중
    }
];

export const Features: React.FC = () => {
    return (
        <section id="technology" className="py-32 bg-gray-50 relative">
            <div className="max-w-7xl mx-auto px-6">
                {/* 섹션 헤더 */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-gray-200 pb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2">제품 소개 (Products)</h2>
                        <p className="text-gray-500 font-medium text-sm">한미르(주)의 핵심 제품 라인업</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-gray-500 text-sm font-medium">ISO 9001:2015 / 14001 인증</p>
                        <p className="text-amber-600 text-sm font-bold tracking-wide">HANMIR</p>
                    </div>
                </div>

                {/* 제품 그리드 (2x2) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <Link
                            key={feature.slug}
                            href={`/products/${feature.slug}`}
                            className="group relative block bg-white border border-gray-200 p-8 hover:border-amber-500 hover:shadow-lg transition-all duration-300"
                        >
                            {/* 개발중 표시 */}
                            {feature.isDevelopment && (
                                <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded">
                                    <AlertCircle className="w-3 h-3" />
                                    개발 진행중
                                </div>
                            )}

                            {/* 카드 콘텐츠 */}
                            <div className="flex items-start gap-6">
                                {/* 아이콘 */}
                                <div className="w-14 h-14 bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                                    {feature.icon}
                                </div>

                                {/* 텍스트 */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>

                                {/* 화살표 */}
                                <div className="text-gray-300 group-hover:text-amber-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};