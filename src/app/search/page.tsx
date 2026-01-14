"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowRight, FileText, Package, Bell, Image, MessageCircle, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import { SearchResultItem, SearchResponse, SearchContentType } from '@/types';

// ============================================================================
// [page.tsx] - 검색 결과 페이지 (/search?q=검색어)
// ============================================================================

// 콘텐츠 타입별 설정
const typeConfig: Record<SearchContentType, { icon: typeof Package, label: string, color: string }> = {
    product: { icon: Package, label: '제품', color: 'text-blue-400' },
    resource: { icon: FileText, label: '기술자료', color: 'text-green-400' },
    notice: { icon: Bell, label: '공지사항', color: 'text-yellow-400' },
    media: { icon: Image, label: '미디어', color: 'text-purple-400' },
    qna: { icon: MessageCircle, label: 'Q&A', color: 'text-pink-400' },
    case: { icon: Building2, label: '시공사례', color: 'text-orange-400' },
};

const ITEMS_PER_PAGE = 10;

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const [results, setResults] = useState<SearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'all' | SearchContentType>('all');
    const [currentPage, setCurrentPage] = useState(1);

    // 검색 실행
    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults(null);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=50`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
        setCurrentPage(1);
    }, [query]);

    // 모든 결과를 하나의 배열로 합치기
    const allResults: SearchResultItem[] = useMemo(() => {
        if (!results) return [];
        return [
            ...results.products,
            ...results.resources,
            ...results.notices,
            ...results.media,
            ...results.qna,
            ...results.cases
        ];
    }, [results]);

    // 필터링된 결과
    const filteredResults = useMemo(() => {
        if (activeFilter === 'all') return allResults;
        return allResults.filter(item => item.type === activeFilter);
    }, [allResults, activeFilter]);

    // 페이지네이션
    const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
    const paginatedResults = filteredResults.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // 타입별 개수
    const typeCounts = useMemo(() => {
        if (!results) return {};
        return {
            product: results.products.length,
            resource: results.resources.length,
            notice: results.notices.length,
            media: results.media.length,
            qna: results.qna.length,
            case: results.cases.length,
        };
    }, [results]);

    return (
        <div className="min-h-screen bg-black text-white cursor-none">
            <CustomCursor />
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-6">
                    {/* 헤더 */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">검색 결과</h1>
                        {query && (
                            <p className="text-zinc-400">
                                "<span className="text-blue-400">{query}</span>" 검색 결과
                                <span className="ml-2 text-white font-bold">{filteredResults.length}</span>건
                            </p>
                        )}
                    </div>

                    {/* 필터 탭 */}
                    {results && results.totalCount > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-zinc-800">
                            <button
                                onClick={() => { setActiveFilter('all'); setCurrentPage(1); }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'all'
                                        ? 'bg-white text-black'
                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                    }`}
                            >
                                전체 ({allResults.length})
                            </button>
                            {(Object.keys(typeConfig) as SearchContentType[]).map((type) => {
                                const count = typeCounts[type] || 0;
                                if (count === 0) return null;
                                const config = typeConfig[type];
                                return (
                                    <button
                                        key={type}
                                        onClick={() => { setActiveFilter(type); setCurrentPage(1); }}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === type
                                                ? 'bg-white text-black'
                                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                            }`}
                                    >
                                        {config.label} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* 로딩 */}
                    {loading && (
                        <div className="py-20 text-center">
                            <div className="w-8 h-8 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin mx-auto" />
                            <p className="mt-4 text-zinc-400">검색 중...</p>
                        </div>
                    )}

                    {/* 검색어 없음 */}
                    {!loading && !query && (
                        <div className="py-20 text-center">
                            <Search className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
                            <p className="text-zinc-400">검색어를 입력해주세요.</p>
                        </div>
                    )}

                    {/* 결과 없음 */}
                    {!loading && query && results && results.totalCount === 0 && (
                        <div className="py-20 text-center">
                            <Search className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
                            <p className="text-xl font-medium mb-2">검색 결과가 없습니다</p>
                            <p className="text-zinc-400">다른 검색어로 시도해보세요.</p>
                        </div>
                    )}

                    {/* 결과 목록 */}
                    {!loading && paginatedResults.length > 0 && (
                        <div className="space-y-3">
                            {paginatedResults.map((item) => {
                                const config = typeConfig[item.type];
                                const Icon = config.icon;

                                return (
                                    <Link
                                        key={`${item.type}-${item.id}`}
                                        href={item.url}
                                        className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors group"
                                    >
                                        <div className={`w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center ${config.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                                                {item.title}
                                            </p>
                                            {item.description && (
                                                <p className="text-sm text-zinc-500 mt-1 line-clamp-1">
                                                    {item.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-2 text-xs text-zinc-600">
                                                <span className={config.color}>{config.label}</span>
                                                {item.category && <span>· {item.category}</span>}
                                                {item.date && <span>· {item.date}</span>}
                                            </div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                ? 'bg-white text-black'
                                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
