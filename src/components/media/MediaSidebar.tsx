"use client";

import React from 'react';

interface MediaSidebarProps {
    activeCategory: string;
    onSelectCategory: (category: string) => void;
}

const categories = [
    { id: 'all', label: '전체' },
    { id: 'HANMIR NEWS', label: 'HANMIR NEWS' },
    { id: 'HANMIR NOW', label: 'HANMIR NOW' },
    { id: '홍보자료실', label: '홍보자료실' }
];

export const MediaSidebar: React.FC<MediaSidebarProps> = ({ activeCategory, onSelectCategory }) => {
    return (
        <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
            {/* 대제목 */}
            <h2 className="text-3xl font-bold text-gray-900 mb-8">미디어</h2>

            {/* 메뉴 목록 */}
            <div className="flex flex-col border-t border-gray-200">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`text-left py-4 border-b border-gray-200 transition-colors flex justify-between items-center group ${activeCategory === cat.id
                            ? 'text-amber-600 font-bold'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <span>{cat.label}</span>
                        {activeCategory === cat.id && (
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                        )}
                    </button>
                ))}
            </div>
        </aside>
    );
};
