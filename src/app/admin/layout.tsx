"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Image as ImageIcon,
    MessageSquare,
    LogOut,
    Menu,
    X,
    Activity,
    Loader2,
    Bell,
    Hammer,
    History,
    Settings
} from 'lucide-react';


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

    // 인증 확인 및 보호 로직
    useEffect(() => {
        const checkAuth = async () => {
            // 로그인 페이지는 인증 검사 제외 (단, 이미 로그인된 경우 대시보드로 보낼 수도 있으나, 일단은 렌더링 허용)
            if (pathname === '/admin/login') {
                setIsAuthorized(true);
                setIsLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/admin/auth');
                if (res.ok) {
                    setIsAuthorized(true);
                } else {
                    throw new Error('Unauthorized');
                }
            } catch (error) {
                // 인증 실패 시 로그인 페이지로 강제 이동
                router.replace('/admin/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    // 로딩 중일 때 (인증 확인 중)
    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-zinc-500 text-sm">인증 확인 중...</p>
                </div>
            </div>
        );
    }

    // 로그인 페이지는 사이드바 없이 렌더링 (Full Screen)
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    // 인증되지 않은 경우 (보통 useEffect에서 리다이렉트 되지만, 찰나의 순간 방어)
    if (!isAuthorized) {
        return null;
    }

    // 로그아웃 핸들러
    const handleLogout = async () => {
        try {
            await fetch('/api/admin/auth', { method: 'DELETE' });
            // 로그아웃 후 로그인 페이지로 이동
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white flex">

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-300
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo Area */}
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">HANMIR ADMIN</h1>
                        <p className="text-xs text-zinc-500 mt-1">관리자 시스템 v1.0</p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-zinc-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <Link
                        href="/admin"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/admin') && pathname === '/admin' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        대시보드
                    </Link>
                    <Link
                        href="/admin/resources"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/admin/resources') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                    >
                        <FileText className="w-5 h-5" />
                        기술자료 관리
                    </Link>
                    <Link
                        href="/admin/media"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/admin/media') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                    >
                        <ImageIcon className="w-5 h-5" />
                        미디어 관리
                    </Link>
                    <Link
                        href="/admin/cases"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/admin/cases') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                    >
                        <Hammer className="w-5 h-5" />
                        시공사례 관리
                    </Link>
                    <Link
                        href="/admin/history"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/admin/history') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                    >
                        <History className="w-5 h-5" />
                        연혁 관리
                    </Link>
                    <Link
                        href="/admin/paint-products"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/admin/paint-products') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                    >
                        <FileText className="w-5 h-5" />
                        페인트 제품 관리
                    </Link>
                    <Link
                        href="/admin/notices"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/admin/notices') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                    >
                        <Bell className="w-5 h-5" />
                        공지사항 관리
                    </Link>
                    <Link
                        href="/admin/inquiries"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/admin/inquiries') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        문의 내역
                    </Link>
                    <Link
                        href="/admin/qna"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/admin/qna') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        문의게시판
                    </Link>
                    <div className="pt-4 pb-2">
                        <div className="text-xs uppercase text-zinc-600 font-bold px-3">System</div>
                    </div>
                    <Link
                        href="/admin/activity"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/admin/activity') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                    >
                        <Activity className="w-5 h-5" />
                        활동 로그
                    </Link>
                    <Link
                        href="/admin/settings"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/admin/settings') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                    >
                        <Settings className="w-5 h-5" />
                        사이트 설정
                    </Link>
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-zinc-800 space-y-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        로그아웃
                    </button>
                    <div className="px-4 py-3 text-xs text-zinc-600">
                        Logged in as <span className="text-zinc-400 font-bold">hanmirco</span>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 flex flex-col">
                {/* Mobile Header */}
                <div className="lg:hidden h-16 border-b border-zinc-800 flex items-center px-4 bg-black/50 backdrop-blur sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-white p-2"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="ml-4 font-bold">HANMIR ADMIN</span>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 md:p-10 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
