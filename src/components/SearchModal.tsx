"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ArrowRight, FileText, Package, Bell, Image, MessageCircle, Building2 } from 'lucide-react';
import Link from 'next/link';
import { SearchResultItem, SearchResponse } from '@/types';

// ============================================================================
// [SearchModal.tsx] - 통합 검색 모달 컴포넌트
// ============================================================================
// Ctrl+K 또는 검색 버튼 클릭 시 열리는 풀스크린 검색 모달
// 실시간 검색 결과 미리보기 및 전체 결과 페이지 연결
// ============================================================================

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// 콘텐츠 타입별 아이콘 및 라벨
const typeConfig = {
    product: { icon: Package, label: '제품', color: 'text-blue-400' },
    resource: { icon: FileText, label: '기술자료', color: 'text-green-400' },
    notice: { icon: Bell, label: '공지사항', color: 'text-yellow-400' },
    media: { icon: Image, label: '미디어', color: 'text-purple-400' },
    qna: { icon: MessageCircle, label: 'Q&A', color: 'text-pink-400' },
    case: { icon: Building2, label: '시공사례', color: 'text-orange-400' },
};

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // 모달 열릴 때 입력창에 포커스
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        // 모달 닫힐 때 초기화
        if (!isOpen) {
            setQuery('');
            setResults(null);
        }
    }, [isOpen]);

    // ESC 키로 닫기
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // 검색 API 호출 (debounce)
    const performSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults(null);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=3`);
            if (res.ok) {
                const data = await res.json();
                setResults(data);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // 입력 변경 시 debounce 적용
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            performSearch(value);
        }, 300);
    };

    // 모든 결과를 하나의 배열로 합치기
    const allResults: SearchResultItem[] = results ? [
        ...results.products,
        ...results.resources,
        ...results.notices,
        ...results.media,
        ...results.qna,
        ...results.cases
    ] : [];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            {/* 배경 오버레이 */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* 검색 모달 */}
            <div className="relative w-full max-w-2xl mx-4 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                {/* 검색 입력 */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
                    <Search className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder="제품, 기술자료, 공지사항 검색..."
                        className="flex-1 bg-transparent text-white text-lg outline-none placeholder-zinc-500"
                    />
                    {query && (
                        <button
                            onClick={() => {
                                setQuery('');
                                setResults(null);
                            }}
                            className="text-zinc-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                    <div className="flex items-center gap-1 text-xs text-zinc-500 border border-zinc-700 rounded px-2 py-1">
                        ESC
                    </div>
                </div>

                {/* 검색 결과 */}
                <div className="max-h-[50vh] overflow-y-auto">
                    {loading && (
                        <div className="px-5 py-8 text-center text-zinc-400">
                            <div className="w-6 h-6 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin mx-auto" />
                            <p className="mt-2 text-sm">검색 중...</p>
                        </div>
                    )}

                    {!loading && query && allResults.length === 0 && (
                        <div className="px-5 py-8 text-center text-zinc-400">
                            <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">"{query}"에 대한 검색 결과가 없습니다.</p>
                        </div>
                    )}

                    {!loading && allResults.length > 0 && (
                        <div className="py-2">
                            {allResults.map((item) => {
                                const config = typeConfig[item.type];
                                const Icon = config.icon;

                                return (
                                    <Link
                                        key={`${item.type}-${item.id}`}
                                        href={item.url}
                                        onClick={onClose}
                                        className="flex items-center gap-4 px-5 py-3 hover:bg-zinc-800 transition-colors group"
                                    >
                                        <div className={`w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center ${config.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-zinc-500 mt-0.5 truncate">
                                                <span className={config.color}>{config.label}</span>
                                                {item.category && <span> · {item.category}</span>}
                                                {item.date && <span> · {item.date}</span>}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 transition-colors" />
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* 빈 상태 - 검색어 없을 때 */}
                    {!query && (
                        <div className="px-5 py-8 text-center text-zinc-500">
                            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">검색어를 입력하세요</p>
                            <p className="text-xs mt-1 text-zinc-600">
                                제품, 기술자료, 공지사항 등을 검색할 수 있습니다
                            </p>
                        </div>
                    )}
                </div>

                {/* 전체 결과 보기 링크 */}
                {results && results.totalCount > 0 && (
                    <div className="border-t border-zinc-800 px-5 py-3">
                        <Link
                            href={`/search?q=${encodeURIComponent(query)}`}
                            onClick={onClose}
                            className="flex items-center justify-between text-sm text-zinc-400 hover:text-white transition-colors group"
                        >
                            <span>
                                전체 <span className="text-blue-400 font-bold">{results.totalCount}</span>개 결과 보기
                            </span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
