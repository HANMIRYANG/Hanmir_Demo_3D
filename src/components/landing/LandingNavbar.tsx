"use client";
// ============================================================================
// LandingNavbar.tsx - EN/CN 원페이지 랜딩용 간소화된 네비바
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// 지원 언어
const languages = [
    { code: 'ko', label: '한국어', short: 'KOR' },
    { code: 'en', label: 'English', short: 'ENG' },
    { code: 'cn', label: '中文', short: 'CN' },
];

// 원페이지 메뉴 (섹션 스크롤)
const menuItems = {
    en: [
        { label: 'About', href: '#about' },
        { label: 'Products', href: '#products' },
        { label: 'Contact', href: '#contact' },
    ],
    cn: [
        { label: '公司介绍', href: '#about' },
        { label: '产品介绍', href: '#products' },
        { label: '联系我们', href: '#contact' },
    ],
};

export const LandingNavbar: React.FC = () => {
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
    const [activeSection, setActiveSection] = useState('');

    // 언어 변경 핸들러
    const handleLanguageChange = (langCode: string) => {
        router.push(`/${langCode}/`);
        setLangMenuOpen(false);
    };

    // 섹션 스크롤 핸들러
    const handleSectionClick = (href: string) => {
        const sectionId = href.replace('#', '');
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    // 스크롤 감지
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // 현재 활성 섹션 감지
            const sections = ['about', 'products', 'contact'];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const currentLang = languages.find(l => l.code === currentLocale) || languages[1];
    const currentMenu = menuItems[currentLocale as 'en' | 'cn'] || menuItems.en;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${scrolled
                ? 'bg-black/90 backdrop-blur-md border-zinc-800 py-4'
                : 'bg-black border-zinc-800 py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* 로고 */}
                <Link href={`/${currentLocale}/`} className="flex items-center gap-3 cursor-pointer group flex-shrink-0">
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

                {/* 데스크탑 메뉴 */}
                <div className="hidden md:flex items-center gap-8">
                    {currentMenu.map((item) => (
                        <button
                            key={item.href}
                            onClick={() => handleSectionClick(item.href)}
                            className={`text-sm font-bold tracking-[0.05em] transition-colors ${activeSection === item.href.replace('#', '')
                                ? 'text-amber-500'
                                : 'text-zinc-400 hover:text-white'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* 우측: 언어 선택 */}
                <div className="hidden md:flex items-center gap-4">
                    {/* 네이버 스마트스토어 버튼 */}
                    <a
                        href="https://smartstore.naver.com/hanmir"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-1.5 bg-[#03C75A] rounded-full hover:bg-[#02b350] transition-colors group shadow-lg shadow-green-900/20"
                    >
                        <span className="font-extrabold text-[#03C75A] bg-white w-4 h-4 flex items-center justify-center rounded text-[10px]">N</span>
                        <span className="text-xs font-bold text-white tracking-tight">
                            {currentLocale === 'en' ? 'Naver Store' : 'Naver商店'}
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
                                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between ${lang.code === currentLocale
                                            ? 'text-blue-500 bg-blue-500/10'
                                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
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
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* 모바일 메뉴 */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-black border-b border-zinc-800 p-6 flex flex-col gap-4 md:hidden">
                    {currentMenu.map((item) => (
                        <button
                            key={item.href}
                            onClick={() => handleSectionClick(item.href)}
                            className="text-left text-sm font-bold text-zinc-300 py-3 border-b border-zinc-800 hover:text-white"
                        >
                            {item.label}
                        </button>
                    ))}

                    <div className="flex gap-4 justify-center pt-4">
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
            )}
        </nav>
    );
};
