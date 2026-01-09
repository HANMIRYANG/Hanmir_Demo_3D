"use client";

import React, { useState } from 'react';
import { FeatureSection } from '@/lib/product-data';
import { ProductSubNav, SubNavItem } from './ProductSubNav';
import { ProductFeatureGrid } from './ProductFeatureGrid';
import { ProductFeatureSection } from './ProductFeatureSection';
import { TechSpecs } from './TechSpecs';

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
                return (
                    <div className="animate-fade-in">
                        <ProductFeatureGrid
                            features={features}
                            description={longDescription}
                        />
                    </div>
                );
            case 'features':
                return (
                    <div className="animate-fade-in">
                        <ProductFeatureSection sections={featureSections} />
                    </div>
                );
            case 'specs':
                return (
                    <div className="animate-fade-in">
                        <TechSpecs specs={techSpecs} />
                    </div>
                );
            case 'applications':
                return (
                    <div className="animate-fade-in py-24 bg-black border-t border-zinc-900">
                        <div className="max-w-7xl mx-auto px-6 text-center">
                            <h3 className="text-3xl font-bold text-white mb-4">주요 적용 분야</h3>
                            <p className="text-zinc-500 mb-12 max-w-2xl mx-auto">
                                {koreanTitle}은(는) 다양한 산업 분야에서 최상의 성능과 안전성을 제공합니다.
                            </p>
                            <div className="flex flex-wrap justify-center gap-6">
                                {applications.map((app, idx) => (
                                    <div
                                        key={idx}
                                        className="px-8 py-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 text-zinc-200 font-bold text-lg hover:border-blue-500 hover:text-white hover:bg-zinc-900 transition-all duration-300 transform hover:-translate-y-1 cursor-none"
                                    >
                                        {app}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
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
