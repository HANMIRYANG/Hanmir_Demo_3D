"use client";
// src/components/PaintCategoryTabs.tsx
// ============================================================================
// 페인트 카테고리 탭 네비게이션
// ============================================================================

import React from 'react';

interface Category {
    id: string;
    slug: string;
    name: string;
}

interface PaintCategoryTabsProps {
    categories: Category[];
    activeSlug: string;
    onTabChange: (slug: string) => void;
}

export const PaintCategoryTabs: React.FC<PaintCategoryTabsProps> = ({
    categories,
    activeSlug,
    onTabChange
}) => {
    return (
        <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
                    {/* 전체 탭 */}
                    <button
                        onClick={() => onTabChange('all')}
                        className={`px-6 py-2.5 text-sm font-bold whitespace-nowrap transition-all duration-300 rounded-full ${activeSlug === 'all'
                                ? 'bg-amber-400 text-gray-900 shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        전체
                    </button>

                    {/* 카테고리 탭들 */}
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onTabChange(category.slug)}
                            className={`px-6 py-2.5 text-sm font-bold whitespace-nowrap transition-all duration-300 rounded-full ${activeSlug === category.slug
                                    ? 'bg-amber-400 text-gray-900 shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
