"use client";

import React, { useState, useEffect, useRef } from 'react';

export interface SubNavItem {
    label: string;
    id: string;
}

interface ProductSubNavProps {
    productName: string;
    items: SubNavItem[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export const ProductSubNav: React.FC<ProductSubNavProps> = ({ productName, items, activeTab, onTabChange }) => {
    const [isSticky, setIsSticky] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!navRef.current || !placeholderRef.current) return;

            const placeholderTop = placeholderRef.current.getBoundingClientRect().top;
            setIsSticky(placeholderTop <= 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleTabClick = (id: string) => {
        onTabChange(id);

        // 탭 전환 시 스크롤을 서브네비게이션 위치로 올림 (사용자 경험 개선)
        if (isSticky) {
            window.scrollTo({
                top: (placeholderRef.current?.offsetTop || 0),
                behavior: 'smooth'
            });
        }
    };

    return (
        <>
            {/* Placeholder - sticky 전환 시 레이아웃 유지용 */}
            <div ref={placeholderRef} className={isSticky ? 'h-16' : 'h-0'} />

            {/* 서브 네비게이션 바 */}
            <div
                ref={navRef}
                className={`w-full bg-white border-b border-zinc-200 z-40 transition-shadow duration-300 ${isSticky
                    ? 'fixed top-0 left-0 right-0 shadow-lg'
                    : 'relative'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* 제품명 */}
                        <div className="hidden md:flex items-center">
                            <span className="text-lg font-bold text-zinc-900">{productName}</span>
                        </div>

                        {/* 카테고리 탭 */}
                        <div className="flex items-center gap-1 md:gap-2 overflow-x-auto scrollbar-hide">
                            {items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleTabClick(item.id)}
                                    className={`px-6 py-2 text-sm font-bold whitespace-nowrap transition-all duration-300 rounded-full ${activeTab === item.id
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* 문의하기 버튼 */}
                        <div className="hidden lg:flex items-center">
                            <a
                                href="/contact"
                                className="px-6 py-2 bg-zinc-900 text-white text-sm font-bold rounded-full hover:bg-blue-600 transition-all duration-300"
                            >
                                문의하기
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
