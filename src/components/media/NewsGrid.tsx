"use client";

import React, { useState } from 'react';
import { MediaItem } from '@/lib/media-data';
import { Search, Calendar, ChevronRight } from 'lucide-react';

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
            <div className="bg-zinc-900 p-6 mb-12 rounded-lg border border-zinc-800">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* 드롭다운 (현재 기능은 없지만 UI상 존재) */}
                    <div className="w-full md:w-48">
                        <select className="w-full h-12 bg-black border border-zinc-700 text-white px-4 rounded focus:outline-none focus:border-blue-500">
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
                            className="flex-1 h-12 bg-white text-black px-4 focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="h-12 px-8 bg-green-600 hover:bg-green-700 text-white font-bold transition-colors">
                            검색하기
                        </button>
                    </div>
                </div>
            </div>

            {/* 뉴스 그리드 */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="group cursor-pointer">
                            {/* 썸네일 */}
                            <div className="relative aspect-[16/9] overflow-hidden bg-zinc-800 mb-4">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* 카테고리 뱃지 */}
                                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1">
                                    {item.category}
                                </div>
                            </div>

                            {/* 텍스트 정보 */}
                            <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-blue-500 transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                            <div className="flex items-center gap-4 text-zinc-500 text-sm mt-3 border-t border-zinc-800 pt-3">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {item.date}
                                </span>
                                <span className="flex items-center gap-1 ml-auto text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View More <ChevronRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center text-zinc-500 border border-zinc-900 rounded-lg bg-zinc-950">
                    검색 결과가 없습니다.
                </div>
            )}
        </div>
    );
};
