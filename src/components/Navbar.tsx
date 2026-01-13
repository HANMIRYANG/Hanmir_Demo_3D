"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { NavItem } from '../types';
import Link from 'next/link';

// ============================================================================
// [Navbar.tsx] - 상단 네비게이션 바 컴포넌트 (드롭다운 메뉴)
// ============================================================================

// 드롭다운 메뉴 구조
const menuItems = [
    {
        label: '회사소개',
        href: '/company',
    },
    {
        label: '제품소개',
        href: '/products',
        children: [
            { label: '페인트', href: '/products/paint' },
            { label: '2차전지 면압패드', href: '/products/battery-pad' },
            { label: '건축자재', href: '/products/building-materials' },
            { label: '가전제품', href: '/products/home-appliances' },
        ]
    },
    {
        label: '자료실',
        href: '/resources',
        children: [
            { label: '공지사항', href: '/notice' },
            { label: '기술자료', href: '/resources' },
            { label: '미디어', href: '/media' },
        ]
    },
    {
        label: '문의하기',
        href: '/contact',
        children: [
            { label: '온라인 상담', href: '/contact' },
            { label: '문의게시판', href: '/qna' },
        ]
    },
];

interface NavbarProps {
    isSticky?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isSticky = true }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileActiveMenu, setMobileActiveMenu] = useState<string | null>(null);

    useEffect(() => {
        if (!isSticky) return;

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isSticky]);

    const positionClass = isSticky ? 'fixed' : 'absolute';

    return (
        <nav
            className={`${positionClass} top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${isSticky && scrolled
                ? 'bg-black/90 backdrop-blur-md border-zinc-800 py-4'
                : 'bg-black border-zinc-800 py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
                {/* 1. 로고 영역 (좌측) */}
                <Link href="/" className="flex items-center gap-3 cursor-pointer group flex-shrink-0 z-10">
                    <img
                        src="/logo.png"
                        alt="HANMIR Logo"
                        className="w-10 h-10 object-contain transition-transform group-hover:scale-105"
                    />
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-widest text-white leading-none">
                            HANMIR
                        </span>
                        <span className="text-[10px] text-zinc-400 tracking-[0.2em] mt-1">
                            Co., Ltd.
                        </span>
                    </div>
                </Link>

                {/* 2. 데스크탑 메뉴 (중앙) - 드롭다운 */}
                <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {menuItems.map((item) => (
                        <div
                            key={item.label}
                            className="relative"
                            onMouseEnter={() => setActiveDropdown(item.label)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <Link
                                href={item.href}
                                className="flex items-center gap-1 text-sm font-bold tracking-[0.05em] text-zinc-400 hover:text-white transition-colors whitespace-nowrap py-2"
                            >
                                {item.label}
                                {item.children && item.children.length > 0 && (
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                                )}
                            </Link>

                            {/* 드롭다운 메뉴 */}
                            {item.children && item.children.length > 0 && activeDropdown === item.label && (
                                <div className="absolute top-full left-0 mt-0 pt-2 z-50">
                                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden shadow-xl py-2 min-w-[160px] animate-fade-in">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.label}
                                                href={child.href}
                                                className="block px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 3. 우측 버튼 그룹 */}
                <div className="hidden md:flex items-center gap-4 z-10">
                    {/* 네이버 스마트스토어 버튼 */}
                    <a
                        href="https://smartstore.naver.com/hanmir"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-1.5 bg-[#03C75A] rounded-full hover:bg-[#02b350] transition-colors group shadow-lg shadow-green-900/20"
                    >
                        <span className="font-extrabold text-[#03C75A] bg-white w-4 h-4 flex items-center justify-center rounded text-[10px]">N</span>
                        <span className="text-xs font-bold text-white tracking-tight">네이버 스마트스토어</span>
                    </a>

                    {/* 언어 선택 드롭다운 */}
                    <div className="relative">
                        <button
                            onClick={() => setLangMenuOpen(!langMenuOpen)}
                            className="flex items-center gap-2 text-xs font-bold text-white hover:text-blue-500 transition-colors tracking-widest px-3 py-1.5 border border-white/10 rounded-full hover:border-blue-500/50 hover:bg-blue-500/10"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span>KOR</span>
                            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${langMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {langMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-28 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden shadow-xl py-1 animate-fade-in z-50">
                                {['ENG', 'KOR', 'CN'].map((lang) => (
                                    <button
                                        key={lang}
                                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between group ${lang === 'KOR' ? 'text-blue-500 bg-blue-500/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                            }`}
                                        onClick={() => setLangMenuOpen(false)}
                                    >
                                        {lang}
                                        {lang === 'KOR' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 모바일 햄버거 */}
                <div className="md:hidden ml-auto">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* 모바일 드롭다운 */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-black border-b border-zinc-800 p-6 flex flex-col gap-2 md:hidden max-h-[80vh] overflow-y-auto">
                    {menuItems.map((item) => (
                        <div key={item.label}>
                            <button
                                onClick={() => setMobileActiveMenu(mobileActiveMenu === item.label ? null : item.label)}
                                className="flex items-center justify-between w-full text-left text-sm font-bold text-zinc-300 py-3 border-b border-zinc-800"
                            >
                                {item.label}
                                <ChevronDown className={`w-4 h-4 transition-transform ${mobileActiveMenu === item.label ? 'rotate-180' : ''}`} />
                            </button>
                            {mobileActiveMenu === item.label && item.children && (
                                <div className="pl-4 py-2 space-y-2">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.label}
                                            href={child.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block text-sm text-zinc-500 py-2 hover:text-white transition-colors"
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="flex flex-col gap-4 border-t border-zinc-800 pt-6 mt-4">
                        <a
                            href="https://smartstore.naver.com/hanmir"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 justify-center px-4 py-3 bg-[#03C75A] rounded-lg text-white font-bold"
                        >
                            <span className="font-extrabold text-[#03C75A] bg-white w-5 h-5 flex items-center justify-center rounded text-xs">N</span>
                            네이버 스마트스토어
                        </a>

                        <div className="flex gap-4 justify-center">
                            {['ENG', 'KOR', 'CN'].map((lang) => (
                                <button key={lang} className={`text-sm font-bold ${lang === 'KOR' ? 'text-blue-500' : 'text-zinc-500'}`}>
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};