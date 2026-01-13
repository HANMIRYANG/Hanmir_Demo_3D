"use client";

import React from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';

interface CaseItem {
    id: string;
    title: string;
    category: string;
    thumbnail: string;
    views: number;
    createdAt: string;
}

interface CasesGridProps {
    items: CaseItem[];
}

export const CasesGrid: React.FC<CasesGridProps> = ({ items }) => {
    // 카테고리 색상
    const getCategoryColor = (category: string) => {
        switch (category) {
            case '페인트': return 'bg-blue-100 text-blue-600 border-blue-200';
            case '건축자재': return 'bg-green-100 text-green-600 border-green-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-20 text-gray-400">
                등록된 시공사례가 없습니다.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
                <Link
                    key={item.id}
                    href={`/cases/${item.id}`}
                    className="group bg-white border border-gray-200 hover:border-amber-500 transition-all duration-300 overflow-hidden"
                >
                    {/* 썸네일 */}
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                        <img
                            src={item.thumbnail || '/placeholder.jpg'}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* 카테고리 배지 */}
                        <div className="absolute top-3 left-3">
                            <span className={`px-2 py-1 text-[10px] font-bold border rounded ${getCategoryColor(item.category)}`}>
                                {item.category}
                            </span>
                        </div>
                    </div>

                    {/* 정보 */}
                    <div className="p-4">
                        <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-2">
                            {item.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</span>
                            <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {item.views}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};
