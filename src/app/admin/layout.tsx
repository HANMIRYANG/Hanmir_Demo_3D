"use client";

import React, { useState } from 'react';
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
    Settings,
    Activity
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/auth', { method: 'DELETE' });
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const navItems = [
        { name: '대시보드', href: '/admin', icon: LayoutDashboard },
        { name: '기술자료 관리', href: '/admin/resources', icon: FileText },
        { name: '미디어 관리', href: '/admin/media', icon: ImageIcon },
        { name: '문의 내역', href: '/admin/inquiries', icon: MessageSquare },
    ];

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
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto"> {/* Changed space-y-2 to space-y-1 */}
                    <Link
                        href="/admin"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/admin') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
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
                        <ImageIcon className="w-5 h-5" /> {/* Used ImageIcon as per original import */}
                        미디어 관리
                    </Link>
                    <Link
                        href="/admin/inquiries"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive('/admin/inquiries') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        문의 내역
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
