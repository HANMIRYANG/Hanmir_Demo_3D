"use client";
// src/app/[locale]/products/[slug]/page.tsx
// ============================================================================
// 제품 상세 페이지 - 페인트 페이지 스타일 적용
// ============================================================================

import React, { useState, use } from 'react';
import { notFound } from 'next/navigation';
import { products, IconFeature } from '@/lib/product-data';
import ProductTabContent from '@/components/ProductTabContent';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { CustomCursor } from '@/components/CustomCursor';
import { AlertCircle, Flame, Target, Thermometer, ShieldCheck, Leaf, Award, Shield, Fingerprint, Sparkles } from 'lucide-react';

// 아이콘 매핑
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    Flame, Target, Thermometer, ShieldCheck, Leaf, Award, Shield, Fingerprint, Sparkles
};

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: PageProps) {
    const { slug } = use(params);
    const product = products[slug];

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <CustomCursor />
            <Navbar />

            <main className="pt-20">
                {/* ================================================================
                    0. Breadcrumb + 페이지 타이틀
                ================================================================ */}
                <section className="bg-white">
                    {/* Breadcrumb 네비게이션 (오른쪽 정렬) */}
                    <div className="max-w-7xl mx-auto px-6 pt-4">
                        <nav className="flex justify-end text-sm">
                            <span className="text-gray-400">홈</span>
                            <span className="mx-2 text-gray-300">&gt;</span>
                            <span className="text-gray-400">제품소개</span>
                            <span className="mx-2 text-gray-300">&gt;</span>
                            <span className="text-amber-600 font-medium">
                                {product.koreanTitle}
                            </span>
                        </nav>
                    </div>

                    {/* 페이지 타이틀 */}
                    <div className="max-w-7xl mx-auto px-6 py-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                            {product.koreanTitle}
                        </h1>
                        {product.isDevelopment && (
                            <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-700 text-sm font-bold px-4 py-2 rounded mt-4">
                                <AlertCircle className="w-4 h-4" />
                                개발 진행중
                            </div>
                        )}
                    </div>
                </section>

                {/* ================================================================
                    1. 히어로 섹션 (2열 그리드)
                ================================================================ */}
                <section className="bg-gray-50">
                    <div className="max-w-7xl mx-auto px-6 py-16">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            {/* 텍스트 영역 */}
                            <div>
                                <p className="text-sm text-gray-500 mb-2">{product.title}</p>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                                    {product.description}
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.longDescription}
                                </p>
                            </div>

                            {/* 이미지 영역 */}
                            <div className="aspect-[4/3] rounded-lg overflow-hidden">
                                <img
                                    src={product.heroImage}
                                    alt={product.koreanTitle}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* 아이콘 섹션 */}
                        {product.iconFeatures && product.iconFeatures.length > 0 && (
                            <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-gray-200">
                                {product.iconFeatures.map((feature: IconFeature, idx: number) => {
                                    const IconComponent = ICON_MAP[feature.icon];
                                    return (
                                        <div key={idx} className="text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                                                {IconComponent && <IconComponent className="w-8 h-8 text-amber-600" />}
                                            </div>
                                            <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                                            <p className="text-sm text-gray-500">{feature.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* ================================================================
                    2. 탭 콘텐츠 영역
                ================================================================ */}
                <ProductTabContent
                    koreanTitle={product.koreanTitle}
                    features={product.features}
                    longDescription={product.longDescription}
                    featureSections={product.featureSections}
                    techSpecs={product.techSpecs}
                    applications={product.applications}
                />
            </main>

            <Footer />
        </div>
    );
}
