"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import { CompanyDownloadCTA } from '@/components/company/CompanyDownloadCTA';
import { Loader2 } from 'lucide-react';

// ============================================================================
// 연혁 페이지 (/company/history) - 5년 단위 탭 구조
// ============================================================================

interface HistoryItem {
    id: string;
    year: string;
    title: string;
    content?: string;
    image?: string;
    order: number;
}

// 5년 단위 기간 정의
const PERIOD_TABS = [
    { id: '2025-2029', label: '2025 ~ 2029', start: 2025, end: 2029 },
    { id: '2020-2024', label: '2020 ~ 2024', start: 2020, end: 2024 },
    { id: '2015-2019', label: '2015 ~ 2019', start: 2015, end: 2019 },
    { id: '2009-2014', label: '2009 ~ 2014', start: 2009, end: 2014 },
];

// 연도 문자열에서 첫 번째 연도 추출 ("2018~2019" -> 2018, "2017" -> 2017)
const getFirstYear = (yearStr: string): number => {
    const match = yearStr.match(/\d{4}/);
    return match ? parseInt(match[0]) : 0;
};

export default function HistoryPage() {
    const [histories, setHistories] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('2025-2029');

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

    // 현재 탭에 해당하는 연혁 필터링
    const filteredHistories = useMemo(() => {
        const currentPeriod = PERIOD_TABS.find(tab => tab.id === activeTab);
        if (!currentPeriod) return [];

        return histories.filter(item => {
            const year = getFirstYear(item.year);
            return year >= currentPeriod.start && year <= currentPeriod.end;
        });
    }, [histories, activeTab]);

    // 연도별 그룹핑
    const groupedHistories = useMemo(() => {
        return filteredHistories.reduce((acc, item) => {
            if (!acc[item.year]) {
                acc[item.year] = [];
            }
            acc[item.year].push(item);
            return acc;
        }, {} as Record<string, HistoryItem[]>);
    }, [filteredHistories]);

    const years = Object.keys(groupedHistories).sort((a, b) => getFirstYear(b) - getFirstYear(a));

    // 각 탭에 데이터가 있는지 확인
    const getTabDataCount = (tabId: string) => {
        const period = PERIOD_TABS.find(tab => tab.id === tabId);
        if (!period) return 0;
        return histories.filter(item => {
            const year = getFirstYear(item.year);
            return year >= period.start && year <= period.end;
        }).length;
    };

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

                {/* 5년 단위 탭 */}
                <section className="py-8 px-6 border-b border-gray-200 bg-white sticky top-20 z-30">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-wrap gap-2 md:gap-4">
                            {PERIOD_TABS.map((tab) => {
                                const count = getTabDataCount(tab.id);
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            px-5 py-3 font-medium text-sm md:text-base transition-all rounded-lg
                                            ${activeTab === tab.id
                                                ? 'bg-amber-500 text-white shadow-lg'
                                                : count > 0
                                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    : 'bg-gray-50 text-gray-400 cursor-default'
                                            }
                                        `}
                                        disabled={count === 0}
                                    >
                                        {tab.label}
                                        {count > 0 && (
                                            <span className={`
                                                ml-2 px-2 py-0.5 text-xs rounded-full
                                                ${activeTab === tab.id
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-amber-100 text-amber-600'
                                                }
                                            `}>
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* 연혁 타임라인 */}
                <section className="py-16 px-6">
                    <div className="max-w-5xl mx-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                            </div>
                        ) : filteredHistories.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                해당 기간의 연혁이 없습니다.
                            </div>
                        ) : (
                            <div className="relative">
                                {/* 세로선 */}
                                <div className="absolute left-0 md:left-24 top-0 bottom-0 w-px bg-gray-200" />

                                {years.map((year) => (
                                    <div key={year} className="mb-12">
                                        {/* 연도 헤더 */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="relative z-10 min-w-[4rem] md:min-w-[6rem] px-3 h-12 bg-amber-500 text-white font-bold flex items-center justify-center text-base md:text-xl rounded whitespace-nowrap">
                                                {year}
                                            </div>
                                        </div>

                                        {/* 해당 연도 항목들 */}
                                        <div className="space-y-6 pl-8 md:pl-32">
                                            {groupedHistories[year].map((item) => (
                                                <div
                                                    key={item.id}
                                                    className={`
                                                        relative bg-white border border-gray-200 rounded-lg p-6 
                                                        hover:border-amber-500/50 hover:shadow-lg transition-all
                                                        ${item.image ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : ''}
                                                    `}
                                                >
                                                    {/* 마커 */}
                                                    <div className="absolute -left-8 md:-left-8 top-8 w-4 h-4 bg-amber-500 rounded-full border-4 border-white shadow" />

                                                    {/* 텍스트 */}
                                                    <div className="flex flex-col justify-center">
                                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                                                            {item.title}
                                                        </h3>
                                                        {item.content && (
                                                            <p className="text-gray-500 leading-relaxed text-sm md:text-base whitespace-pre-line">
                                                                {item.content}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* 이미지 */}
                                                    {item.image && (
                                                        <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-2">
                                                            <img
                                                                src={item.image}
                                                                alt={item.title}
                                                                className="max-w-full max-h-48 object-contain"
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

                {/* 회사소개서 다운로드 - 별도 섹션 */}
                <CompanyDownloadCTA />
            </main>

            <Footer />
        </div>
    );
}
