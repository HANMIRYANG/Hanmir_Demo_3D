"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, ChevronDown, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SearchModal } from './SearchModal';

// ============================================================================
// [Navbar.tsx] - 상단 네비게이션 바 컴포넌트 (드롭다운 메뉴 + 다국어)
// ============================================================================

// 지원 언어
const languages = [
    { code: 'ko', label: '한국어', short: 'KOR' },
    { code: 'en', label: 'English', short: 'ENG' },
    { code: 'cn', label: '中文', short: 'CN' },
];

// 드롭다운 메뉴 구조
const menuItems = [
    {
        label: { ko: '기업소개', en: 'About', cn: '公司介绍' },
        href: '/company',
        children: [
            { label: { ko: '소개', en: 'Introduction', cn: '公司简介' }, href: '/company/about' },
            { label: { ko: 'CEO 인사말', en: 'CEO Message', cn: 'CEO致辞' }, href: '/company/ceo' },
            { label: { ko: '연혁', en: 'History', cn: '发展历程' }, href: '/company/history' },
            { label: { ko: '위치', en: 'Location', cn: '联系地址' }, href: '/company/location' },
        ]
    },
    {
        label: { ko: '제품소개', en: 'Products', cn: '产品介绍' },
        href: '/products',
        children: [
            { label: { ko: '페인트', en: 'Paint', cn: '涂料' }, href: '/products/paint' },
            { label: { ko: '2차전지 면압패드', en: 'Battery Pad', cn: '二次电池面压垫' }, href: '/products/battery-pad' },
            { label: { ko: '건축자재', en: 'Building Materials', cn: '建筑材料' }, href: '/products/building-materials' },
            { label: { ko: '가전제품', en: 'Appliances', cn: '家电产品' }, href: '/products/home-appliances' },
        ]
    },
    {
        label: { ko: '자료실', en: 'Resources', cn: '资料室' },
        href: '/resources',
        children: [
            { label: { ko: '공지사항', en: 'Notice', cn: '公告' }, href: '/notice' },
            { label: { ko: '기술자료', en: 'Tech Resources', cn: '技术资料' }, href: '/resources' },
            { label: { ko: '미디어', en: 'Media', cn: '媒体' }, href: '/media' },
            { label: { ko: '시공사례', en: 'Cases', cn: '施工案例' }, href: '/cases' },
        ]
    },
    {
        label: { ko: '문의하기', en: 'Contact', cn: '联系我们' },
        href: '/contact',
        children: [
            { label: { ko: '온라인 상담', en: 'Contact', cn: '在线咨询' }, href: '/contact' },
            { label: { ko: '문의게시판', en: 'Q&A', cn: '问答板' }, href: '/qna' },
        ]
    },
];

interface NavbarProps {
    isSticky?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isSticky = true }) => {
    const pathname = usePathname();
    const router = useRouter();

    // 현재 언어 감지
    const getCurrentLocale = (): 'ko' | 'en' | 'cn' => {
        if (pathname.startsWith('/en')) return 'en';
        if (pathname.startsWith('/cn')) return 'cn';
        return 'ko';
    };

    const currentLocale = getCurrentLocale();

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileActiveMenu, setMobileActiveMenu] = useState<string | null>(null);
    const [searchModalOpen, setSearchModalOpen] = useState(false);

    // 언어 변경 핸들러
    const handleLanguageChange = (langCode: string) => {
        // 현재 경로에서 언어 접두사 제거 후 새 언어로 교체
        let newPath = pathname;
        if (pathname.startsWith('/ko') || pathname.startsWith('/en') || pathname.startsWith('/cn')) {
            newPath = pathname.substring(3) || '/';
        }
        router.push(`/${langCode}${newPath}`);
        setLangMenuOpen(false);
    };

    // 로컬라이즈된 href 생성
    const getLocalizedHref = (href: string) => {
        return `/${currentLocale}${href}`;
    };

    // Ctrl+K 단축키로 검색 모달 열기
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchModalOpen(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (!isSticky) return;

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isSticky]);

    const positionClass = isSticky ? 'fixed' : 'absolute';
    const currentLang = languages.find(l => l.code === currentLocale) || languages[0];

    return (
        <nav
            className={`${positionClass} top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${isSticky && scrolled
                ? 'bg-black/90 backdrop-blur-md border-zinc-800 py-4'
                : 'bg-black border-zinc-800 py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
                {/* 1. 로고 영역 (좌측) */}
                <Link href={getLocalizedHref('/')} className="flex items-center gap-3 cursor-pointer group flex-shrink-0 z-10">
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
                            key={item.label.ko}
                            className="relative"
                            onMouseEnter={() => setActiveDropdown(item.label.ko)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <Link
                                href={getLocalizedHref(item.href)}
                                className="flex items-center gap-1 text-sm font-bold tracking-[0.05em] text-zinc-400 hover:text-white transition-colors whitespace-nowrap py-2"
                            >
                                {item.label[currentLocale]}
                                {item.children && item.children.length > 0 && (
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === item.label.ko ? 'rotate-180' : ''}`} />
                                )}
                            </Link>

                            {/* 드롭다운 메뉴 */}
                            {item.children && item.children.length > 0 && activeDropdown === item.label.ko && (
                                <div className="absolute top-full left-0 mt-0 pt-2 z-50">
                                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden shadow-xl py-2 min-w-[160px] animate-fade-in">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.label.ko}
                                                href={getLocalizedHref(child.href)}
                                                className="block px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                                            >
                                                {child.label[currentLocale]}
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
                    {/* 검색 버튼 */}
                    <button
                        onClick={() => setSearchModalOpen(true)}
                        className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors px-3 py-1.5 border border-zinc-700 rounded-full hover:border-zinc-500 hover:bg-zinc-800/50 group"
                        title="검색 (Ctrl+K)"
                    >
                        <Search className="w-3.5 h-3.5" />
                        <span>{currentLocale === 'ko' ? '검색' : currentLocale === 'en' ? 'Search' : '搜索'}</span>
                        <span className="text-[10px] text-zinc-600 border border-zinc-700 rounded px-1">⌘K</span>
                    </button>

                    {/* 네이버 스마트스토어 버튼 */}
                    <a
                        href="https://smartstore.naver.com/hanmir"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-1.5 bg-[#03C75A] rounded-full hover:bg-[#02b350] transition-colors group shadow-lg shadow-green-900/20"
                    >
                        <span className="font-extrabold text-[#03C75A] bg-white w-4 h-4 flex items-center justify-center rounded text-[10px]">N</span>
                        <span className="text-xs font-bold text-white tracking-tight">
                            {currentLocale === 'ko' ? '네이버 스마트스토어' : currentLocale === 'en' ? 'Naver Store' : 'Naver商店'}
                        </span>
                    </a>

                    {/* 언어 선택 드롭다운 */}
                    <div className="relative">
                        <button
                            onClick={() => setLangMenuOpen(!langMenuOpen)}
                            className="flex items-center gap-2 text-xs font-bold text-white hover:text-blue-500 transition-colors tracking-widest px-3 py-1.5 border border-white/10 rounded-full hover:border-blue-500/50 hover:bg-blue-500/10"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span>{currentLang.short}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${langMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {langMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-32 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden shadow-xl py-1 animate-fade-in z-50">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between group ${lang.code === currentLocale ? 'text-blue-500 bg-blue-500/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                            }`}
                                        onClick={() => handleLanguageChange(lang.code)}
                                    >
                                        <span>{lang.label}</span>
                                        {lang.code === currentLocale && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
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
                        <div key={item.label.ko}>
                            <button
                                onClick={() => setMobileActiveMenu(mobileActiveMenu === item.label.ko ? null : item.label.ko)}
                                className="flex items-center justify-between w-full text-left text-sm font-bold text-zinc-300 py-3 border-b border-zinc-800"
                            >
                                {item.label[currentLocale]}
                                <ChevronDown className={`w-4 h-4 transition-transform ${mobileActiveMenu === item.label.ko ? 'rotate-180' : ''}`} />
                            </button>
                            {mobileActiveMenu === item.label.ko && item.children && (
                                <div className="pl-4 py-2 space-y-2">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.label.ko}
                                            href={getLocalizedHref(child.href)}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block text-sm text-zinc-500 py-2 hover:text-white transition-colors"
                                        >
                                            {child.label[currentLocale]}
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
                            {currentLocale === 'ko' ? '네이버 스마트스토어' : currentLocale === 'en' ? 'Naver Store' : 'Naver商店'}
                        </a>

                        <div className="flex gap-4 justify-center">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    className={`text-sm font-bold ${lang.code === currentLocale ? 'text-blue-500' : 'text-zinc-500'}`}
                                    onClick={() => handleLanguageChange(lang.code)}
                                >
                                    {lang.short}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 검색 모달 */}
            <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
        </nav>
    );
};