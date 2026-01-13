"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import { CompanyDownloadCTA } from '@/components/company/CompanyDownloadCTA';
import { Calendar, Loader2 } from 'lucide-react';

// ============================================================================
// 연혁 페이지 (/company/history) - DB 연동
// ============================================================================

interface HistoryItem {
    id: string;
    year: string;
    title: string;
    content?: string;
    image?: string;
    order: number;
}

export default function HistoryPage() {
    const [histories, setHistories] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistories = async () => {
            try {
                const res = await fetch('/api/history');
                const data = await res.json();
                if (data.histories) {
                    setHistories(data.histories);
                }
            } catch (error) {
                console.error('Failed to fetch histories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistories();
    }, []);

    // 연도별 그룹핑
    const groupedHistories = histories.reduce((acc, item) => {
        if (!acc[item.year]) {
            acc[item.year] = [];
        }
        acc[item.year].push(item);
        return acc;
    }, {} as Record<string, HistoryItem[]>);

    const years = Object.keys(groupedHistories).sort((a, b) => parseInt(b) - parseInt(a));

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
                            <span className="text-gray-900 font-bold">연혁</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900">
                            회사 <span className="text-amber-600">연혁</span>
                        </h1>
                        <p className="text-gray-500 text-lg max-w-3xl leading-relaxed">
                            2009년 창립 이래, 한미르(주)의 성장 발자취입니다.
                        </p>
                    </div>
                </section>

                {/* 연혁 타임라인 */}
                <section className="py-24 px-6">
                    <div className="max-w-5xl mx-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                            </div>
                        ) : histories.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                등록된 연혁이 없습니다.
                            </div>
                        ) : (
                            <div className="relative">
                                {/* 세로선 */}
                                <div className="absolute left-0 md:left-24 top-0 bottom-0 w-px bg-gray-200" />

                                {years.map((year) => (
                                    <div key={year} className="mb-16">
                                        {/* 연도 헤더 */}
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="relative z-10 w-12 h-12 md:w-24 md:h-12 bg-amber-500 text-white font-bold flex items-center justify-center text-lg md:text-xl">
                                                {year}
                                            </div>
                                        </div>

                                        {/* 해당 연도 항목들 */}
                                        <div className="space-y-8 pl-8 md:pl-32">
                                            {groupedHistories[year].map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="relative grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-gray-200 rounded-lg p-6 hover:border-amber-500/50 hover:shadow-lg transition-all"
                                                >
                                                    {/* 마커 */}
                                                    <div className="absolute -left-8 md:-left-8 top-8 w-4 h-4 bg-amber-500 rounded-full border-4 border-white shadow" />

                                                    {/* 텍스트 */}
                                                    <div className="flex flex-col justify-center">
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                            {item.title}
                                                        </h3>
                                                        {item.content && (
                                                            <p className="text-gray-500 leading-relaxed">
                                                                {item.content}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* 이미지 */}
                                                    {item.image && (
                                                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                                            <img
                                                                src={item.image}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* 회사소개서 다운로드 */}
                <CompanyDownloadCTA />
            </main>

            <Footer />
        </div>
    );
}
