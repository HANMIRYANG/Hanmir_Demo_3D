import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NavItem } from '../types';

const navItems: NavItem[] = [
    { label: '솔루션', href: '#solutions' },
    { label: '핵심기술', href: '#technology' },
    { label: '적용분야', href: '#industries' },
    { label: '문의하기', href: '#contact' },
];

export const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${
                scrolled 
                ? 'bg-black/80 backdrop-blur-md border-zinc-800 py-4' 
                : 'bg-transparent border-transparent py-6'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-105">
                        <path d="M25 15 L50 5 L50 45 L40 50 L40 90 L15 80 L15 25 Z" fill="#2563EB" />
                        <path d="M75 15 L50 5 L50 45 L60 50 L60 90 L85 80 L85 25 Z" fill="#EA580C" />
                        <path d="M40 50 L60 50 L60 90 L40 90 Z" fill="white" fillOpacity="0.1" /> 
                    </svg>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-widest text-white leading-none">
                            HANMIR
                        </span>
                        <span className="text-[10px] text-zinc-400 tracking-[0.2em] mt-1">
                            Co., Ltd.
                        </span>
                    </div>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-12">
                    {navItems.map((item) => (
                        <a 
                            key={item.label}
                            href={item.href}
                            className="text-xs font-bold tracking-[0.05em] text-zinc-400 hover:text-white transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}
                    <button className="px-6 py-2 border border-white/20 text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-all duration-300">
                        CLIENT PORTAL
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-black border-b border-zinc-800 p-6 flex flex-col gap-6 md:hidden">
                     {navItems.map((item) => (
                        <a 
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-sm font-bold text-zinc-300 block"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
};