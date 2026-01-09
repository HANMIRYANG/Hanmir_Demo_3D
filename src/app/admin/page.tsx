"use client";

import React, { useEffect, useState } from 'react';
import {
    Users,
    FileText,
    Image as ImageIcon,
    TrendingUp,
    Activity,
    MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';

// Stats Card Component
const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="bg-zinc-900 border border-zinc-800 p-6">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-none ${color} bg-opacity-10 text-white`}>
                <Icon className="w-6 h-6" />
            </div>
            {change && (
                <span className={`text-xs font-bold px-2 py-1 ${change.startsWith('+') ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    {change}
                </span>
            )}
        </div>
        <h3 className="text-zinc-500 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
    </div>
);

export default function AdminDashboard() {
    // 실제 데이터 연동 전 더미 데이터 상태
    const [stats, setStats] = useState({
        totalInquiries: 0,
        todayInquiries: 0,
        resourcesCount: 0,
        mediaCount: 0
    });
    const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 데이터 로드 (시뮬레이션)
        const loadDashboardData = async () => {
            try {
                const res = await fetch('/api/inquiries?limit=5');
                const data = await res.json();

                if (res.ok) {
                    setRecentInquiries(data.inquiries || []);
                    setStats({
                        totalInquiries: data.pagination?.total || 124,
                        todayInquiries: 3, // 실제 API에서 가져와야 함
                        resourcesCount: 15,
                        mediaCount: 28
                    });
                }
            } catch (error) {
                console.error('Failed to load dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
                <p className="text-zinc-400">한미르 관리자 시스템 개요 및 현황</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="총 문의 내역"
                    value={stats.totalInquiries}
                    change="+12% from last month"
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="오늘 접수된 문의"
                    value={stats.todayInquiries}
                    change="New"
                    icon={Activity}
                    color="bg-green-500"
                />
                <StatCard
                    title="기술자료"
                    value={stats.resourcesCount}
                    icon={FileText}
                    color="bg-orange-500"
                />
                <StatCard
                    title="미디어 콘텐츠"
                    value={stats.mediaCount}
                    icon={ImageIcon}
                    color="bg-purple-500"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Inquiries */}
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800">
                    <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-white">최근 문의 내역</h3>
                        <Link href="/admin/inquiries" className="text-sm text-blue-400 hover:text-blue-300">
                            전체보기
                        </Link>
                    </div>
                    <div className="p-0">
                        {loading ? (
                            <div className="p-8 text-center text-zinc-500">Loading...</div>
                        ) : recentInquiries.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="bg-zinc-900/50 text-xs uppercase text-zinc-500 border-b border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">담당자 / 업체</th>
                                        <th className="px-6 py-4 font-medium">관심 분야</th>
                                        <th className="px-6 py-4 font-medium text-right">접수일</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {recentInquiries.map((inquiry: any) => (
                                        <tr key={inquiry.id} className="hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{inquiry.name}</div>
                                                <div className="text-xs text-zinc-500">{inquiry.company || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-900/50">
                                                    {inquiry.interest}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-zinc-400">
                                                {new Date(inquiry.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center text-zinc-600">
                                문의 내역이 없습니다.
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions & System Info */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-zinc-900 border border-zinc-800 p-6">
                        <h3 className="font-bold text-lg text-white mb-4">빠른 작업</h3>
                        <div className="space-y-3">
                            <Link
                                href="/admin/resources"
                                className="block w-full text-left px-4 py-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition-colors"
                            >
                                + 기술자료 등록
                            </Link>
                            <Link
                                href="/admin/media"
                                className="block w-full text-left px-4 py-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition-colors"
                            >
                                + 뉴스/미디어 등록
                            </Link>
                            <Link
                                href="/admin/inquiries"
                                className="block w-full text-left px-4 py-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition-colors"
                            >
                                문의 내역 다운로드 (Excel)
                            </Link>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-zinc-900 border border-zinc-800 p-6">
                        <h3 className="font-bold text-lg text-white mb-4">시스템 상태</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500">Database</span>
                                <span className="flex items-center gap-2 text-green-400 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    Connected
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500">Last Setup</span>
                                <span className="text-zinc-300 text-sm">Today, 6:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500">Version</span>
                                <span className="text-zinc-300 text-sm">v1.2.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
