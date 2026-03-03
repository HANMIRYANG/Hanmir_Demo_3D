"use client";
// src/app/products/paint/page.tsx
// ============================================================================
// 페인트 제품소개 페이지 - 3단계 구조
// 1. 메인 카테고리 탭 (건축, 선박, 일반공업)
// 2. 히어로 섹션 + 아이콘 섹션
// 3. 서브 카테고리 탭 + 제품 그리드 (검색 기능)
// ============================================================================

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import { PaintProductModal } from '@/components/PaintProductModal';
import { PaintCalculator } from '@/components/PaintCalculator';
import { EvFireSafetyPremiumView } from '@/components/EvFireSafetyPremiumView';
import { Loader2, Calculator, Search, Users, Leaf, Palette } from 'lucide-react';

// ============================================================================
// 메인 카테고리 데이터 (하드코딩 - 사용자 요청)
const MAIN_CATEGORIES = [
    {
        id: 'building',
        name: '건축',
        isDevelopment: false,
        hero: {
            title: '선명하고 오래가는 건축페인트',
            description: '한미르 건축페인트는 아름다운 색상으로 우리의 일상 공간에 다채로움을 더하고, 용도별 세분화된 기능을 제공하여 건축물에 더 높은 가치를 선사하도록 개발되었습니다. 한미르만의 시장 선도적인 기술력으로 더 우수한 내구성의 페인트를 통해 건축물의 수명을 연장하고 안전하게 사용할 수 있습니다.',
            image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop'
        },
        features: [
            { icon: Users, title: '누구나', desc: '간편한 사용법으로 누구나 시공가능' },
            { icon: Leaf, title: '고내구성', desc: '내구성이 뛰어나 반영구적 효과가 있음' },
            { icon: Palette, title: '공간 특화', desc: '공간에 맞는 특화 기능을 제공' }
        ]
    },
    {
        id: 'ship',
        name: '선박',
        isDevelopment: true,
        hero: {
            title: '해양 환경에 최적화된 선박페인트',
            description: '한미르 선박페인트는 해양 환경의 극한 조건에서도 뛰어난 내구성과 방청력을 제공합니다. 선박의 수명을 연장하고 유지보수 비용을 절감할 수 있습니다.',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2532&auto=format&fit=crop'
        },
        features: [
            { icon: Users, title: '전문가용', desc: '전문 시공자를 위한 고성능 제품' },
            { icon: Leaf, title: '친환경', desc: '해양 환경을 고려한 친환경 설계' },
            { icon: Palette, title: '고내구성', desc: '극한 환경에서도 우수한 내구성' }
        ]
    },
    {
        id: 'industrial',
        name: '일반공업',
        isDevelopment: false,
        hero: {
            title: '산업 현장을 위한 공업용 페인트',
            description: '한미르 공업용 페인트는 공장, 창고, 기계 설비 등 산업 현장에 최적화된 제품입니다. 뛰어난 내화학성과 내마모성으로 산업 시설을 보호합니다.',
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop'
        },
        features: [
            { icon: Users, title: '산업용', desc: '산업 현장에 최적화된 제품' },
            { icon: Leaf, title: '안전성', desc: '작업자 안전을 고려한 설계' },
            { icon: Palette, title: '내화학성', desc: '화학물질에 강한 내구성' }
        ]
    },
    {
        id: 'ev-fire-safety',
        name: 'EV 화재 안전',
        isDevelopment: false,
        hero: {
            title: '1,000℃의 극한을 견디는 나노 세라믹 방어막',
            description: '전기차 시대, 충전구역의 화재 안전은 필수입니다. 화염 확산을 차단하고 골든타임을 확보하세요.',
            image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2672&auto=format&fit=crop'
        },
        features: [
            { icon: Leaf, title: '일체형 솔루션', desc: '벽면, 천장, 바닥, 배관 완벽 보호' },
            { icon: Users, title: '초고온 내열성', desc: '1,000℃ 이상의 화염 차단' },
            { icon: Palette, title: '골든타임 확보', desc: '열전파 지연 및 확산 억제' }
        ]
    }
];

// Types
interface PaintProduct {
    id: string;
    name: string;
    thumbnail: string;
    description?: string;
    dataSheetPath?: string;
    dataSheetName?: string;
    usage?: string;
    features?: string;
    specification?: string;
    instructions?: string;
}

interface PaintCategory {
    id: string;
    mainCategory: string;
    slug: string;
    name: string;
    products: PaintProduct[];
}

function PaintProductsContent() {
    const searchParams = useSearchParams();
    const mainParam = searchParams.get('main');
    const initialMain = MAIN_CATEGORIES.some(cat => cat.id === mainParam) ? mainParam! : 'building';

    const [categories, setCategories] = useState<PaintCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeMain, setActiveMain] = useState(initialMain);
    const [activeSub, setActiveSub] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<PaintProduct | null>(null);
    const [calculatorOpen, setCalculatorOpen] = useState(false);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/paint-products?main=${activeMain}`);
                const data = await res.json();
                if (res.ok) {
                    setCategories(data.categories || []);
                    setActiveSub('all');
                }
            } catch (error) {
                console.error('Failed to fetch:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeMain]);

    // Get active main category data
    const mainCategoryData = MAIN_CATEGORIES.find(mc => mc.id === activeMain);

    // Filter products
    const filteredProducts = activeSub === 'all'
        ? categories.flatMap(c => c.products)
        : categories.find(c => c.slug === activeSub)?.products || [];

    // Apply search
    const searchedProducts = searchQuery
        ? filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : filteredProducts;

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <CustomCursor />
            <Navbar />

            {/* Navbar 높이만큼 여백 */}
            <div className="pt-20">
                {/* 1. 메인 카테고리 탭 */}
                <div className="bg-white border-b border-gray-200 sticky top-[72px] z-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center gap-8">
                            {MAIN_CATEGORIES.map((mc) => (
                                <button
                                    key={mc.id}
                                    onClick={() => {
                                        setActiveMain(mc.id);
                                        setLoading(true);
                                    }}
                                    className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeMain === mc.id
                                        ? 'text-amber-600 border-amber-500'
                                        : 'text-gray-500 border-transparent hover:text-gray-900'
                                        }`}
                                >
                                    {mc.name}
                                    {mc.isDevelopment && (
                                        <span className="ml-1 text-xs text-gray-400">(개발중)</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ================================================================
                    프리미엄 뷰 분기 처리 (EV 화재 안전)
                ================================================================ */}
                {activeMain === 'ev-fire-safety' ? (
                    <main>
                        <EvFireSafetyPremiumView />
                    </main>
                ) : (
                    /* 기존 일반 카테고리 뷰 (건축, 선박, 산업용 등) */
                    <main>
                        <section className="bg-white">
                            <div className="max-w-7xl mx-auto px-6 pt-4">
                                <nav className="flex justify-end text-sm">
                                    <span className="text-gray-400">홈</span>
                                    <span className="mx-2 text-gray-300">&gt;</span>
                                    <span className="text-amber-600">페인트</span>
                                    <span className="mx-2 text-gray-300">&gt;</span>
                                    <span className="text-amber-600 font-medium">
                                        {mainCategoryData?.name}페인트
                                    </span>
                                </nav>
                            </div>
                            <div className="max-w-7xl mx-auto px-6 py-10">
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                                    페인트
                                </h1>
                            </div>
                        </section>

                        {mainCategoryData && (
                            <section className="bg-gray-50">
                                <div className="max-w-7xl mx-auto px-6 py-16">
                                    <div className="grid md:grid-cols-2 gap-12 items-center">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2">수성인 방식의 친환경 페인트</p>
                                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                                {mainCategoryData.hero.title}
                                            </h1>
                                            <p className="text-gray-600 leading-relaxed">
                                                {mainCategoryData.hero.description}
                                            </p>
                                        </div>
                                        <div className="aspect-[4/3] rounded-lg overflow-hidden">
                                            <img
                                                src={mainCategoryData.hero.image}
                                                alt={mainCategoryData.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-gray-200">
                                        {mainCategoryData.features.map((feature, idx) => (
                                            <div key={idx} className="text-center">
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                                                    <feature.icon className="w-8 h-8 text-amber-600" />
                                                </div>
                                                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                                                <p className="text-sm text-gray-500">{feature.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        <section className="py-12">
                            <div className="max-w-7xl mx-auto px-6">
                                <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-gray-200">
                                    <button
                                        onClick={() => setActiveSub('all')}
                                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeSub === 'all'
                                            ? 'text-amber-600 border-b-2 border-amber-500'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        전체
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveSub(cat.slug)}
                                            className={`px-4 py-2 text-sm font-medium transition-colors ${activeSub === cat.slug
                                                ? 'text-amber-600 border-b-2 border-amber-500'
                                                : 'text-gray-500 hover:text-gray-900'
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-sm text-gray-500">
                                        전체 {searchedProducts.length}건
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="검색"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-amber-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="flex items-center justify-center py-20">
                                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                                    </div>
                                ) : searchedProducts.length === 0 ? (
                                    <div className="text-center py-20 text-gray-400">
                                        {searchQuery ? '검색 결과가 없습니다.' : '등록된 제품이 없습니다.'}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {searchedProducts.map((product) => (
                                            <button
                                                key={product.id}
                                                onClick={() => setSelectedProduct(product)}
                                                className="group text-left bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                                            >
                                                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                                                    <img
                                                        src={product.thumbnail}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="p-4 border-t border-gray-100">
                                                    <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors">
                                                        {product.name}
                                                    </h3>
                                                    {product.description && (
                                                        <p className="text-xs text-gray-500 line-clamp-2">
                                                            {product.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="py-16 bg-gradient-to-b from-gray-100 to-white">
                            <div className="max-w-7xl mx-auto px-6">
                                <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-lg">
                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                        <div className="flex-1">
                                            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-sm font-bold rounded-full mb-4">
                                                CALCULATOR
                                            </span>
                                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                                페인트량 계산기
                                            </h2>
                                            <p className="text-gray-600 mb-6">
                                                도장할 면적을 입력하시면 필요한 페인트 양을 간편하게 계산할 수 있습니다.
                                            </p>
                                            <button
                                                onClick={() => setCalculatorOpen(true)}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-colors shadow-lg"
                                            >
                                                <Calculator className="w-5 h-5" />
                                                계산기 열기
                                            </button>
                                        </div>
                                        <div className="w-48 h-48 bg-amber-100 rounded-full flex items-center justify-center">
                                            <Calculator className="w-20 h-20 text-amber-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                )}
            </div>

            <Footer />

            <PaintProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />

            <PaintCalculator
                isOpen={calculatorOpen}
                onClose={() => setCalculatorOpen(false)}
            />
        </div >
    );
}

export default function PaintProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <PaintProductsContent />
        </Suspense>
    );
}
