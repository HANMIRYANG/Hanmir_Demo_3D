"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import { CasesSidebar } from '@/components/cases/CasesSidebar';
import { CasesGrid } from '@/components/cases/CasesGrid';

interface CaseItem {
    id: string;
    title: string;
    category: string;
    thumbnail: string;
    views: number;
    createdAt: string;
}

export default function CasesPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [cases, setCases] = useState<CaseItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Cases
    useEffect(() => {
        const fetchCases = async () => {
            try {
                const res = await fetch('/api/admin/cases');
                const data = await res.json();

                if (res.ok && data.cases) {
                    setCases(data.cases);
                }
            } catch (error) {
                console.error("Failed to fetch cases:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCases();
    }, []);

    // 카테고리 필터링
    const filteredCases = activeCategory === 'all'
        ? cases
        : cases.filter(item => item.category === activeCategory);

    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-amber-500 selection:text-white">
            <CustomCursor />
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-12">
                        {/* 1. 사이드바 (좌측) */}
                        <CasesSidebar
                            activeCategory={activeCategory}
                            onSelectCategory={setActiveCategory}
                        />

                        {/* 2. 메인 콘텐츠 (우측) */}
                        <div className="flex-1 min-w-0">
                            {/* 헤더: Breadcrumb & Title */}
                            <div className="mb-12">
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                    <span>Home</span>
                                    <span>/</span>
                                    <span>시공사례</span>
                                    <span>/</span>
                                    <span className="text-gray-900 font-bold">
                                        {activeCategory === 'all' ? '전체' : activeCategory}
                                    </span>
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900">
                                    {activeCategory === 'all' ? 'HANMIR 시공사례' : activeCategory}
                                </h1>
                            </div>

                            {/* 시공사례 그리드 */}
                            {loading ? (
                                <div className="text-center py-20 text-gray-400">Loading...</div>
                            ) : (
                                <CasesGrid items={filteredCases} />
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
