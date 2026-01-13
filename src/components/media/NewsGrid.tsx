"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MediaItem } from '@/lib/media-data';
import { Search, Calendar, ChevronRight, Eye } from 'lucide-react';

interface NewsGridProps {
    items: MediaItem[];
}

export const NewsGrid: React.FC<NewsGridProps> = ({ items }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // 검색어 필터링
    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full">
            {/* 검색바 섹션 */}
            <div className="bg-gray-100 p-6 mb-12 rounded-lg border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* 드롭다운 (현재 기능은 없지만 UI상 존재) */}
                    <div className="w-full md:w-48">
                        <select className="w-full h-12 bg-white border border-gray-300 text-gray-900 px-4 rounded focus:outline-none focus:border-amber-500">
                            <option value="all">전체</option>
                            <option value="title">제목</option>
                            <option value="content">내용</option>
                        </select>
                    </div>

                    {/* 입력창 + 버튼 */}
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            placeholder="검색어를 입력해주세요."
                            className="flex-1 h-12 bg-white text-gray-900 px-4 border border-gray-300 focus:outline-none focus:border-amber-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="h-12 px-8 bg-amber-500 hover:bg-amber-600 text-white font-bold transition-colors">
                            검색하기
                        </button>
                    </div>
                </div>
            </div>

            {/* 뉴스 그리드 */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredItems.map((item) => (
                        <Link
                            key={item.id}
                            href={`/media/${item.id}`}
                            className="group cursor-pointer block"
                        >
                            {/* 썸네일 */}
                            <div className="relative aspect-[16/9] overflow-hidden bg-gray-200 mb-4 rounded-lg">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* 카테고리 뱃지 */}
                                <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded">
                                    {item.category}
                                </div>
                            </div>

                            {/* 텍스트 정보 */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                            <div className="flex items-center gap-4 text-gray-500 text-sm mt-3 border-t border-gray-200 pt-3">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {item.date}
                                </span>
                                {(item as any).views !== undefined && (
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5" />
                                        {(item as any).views}
                                    </span>
                                )}
                                <span className="flex items-center gap-1 ml-auto text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View More <ChevronRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
                    검색 결과가 없습니다.
                </div>
            )}
        </div>
    );
};
