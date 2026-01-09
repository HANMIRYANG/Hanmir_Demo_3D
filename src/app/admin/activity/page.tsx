"use client";

import React, { useEffect, useState } from 'react';
import { Activity, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface Log {
    id: string;
    action: string;
    target: string;
    targetId: string;
    details: string | null;
    createdAt: string;
}

export default function ActivityLogPage() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch('/api/admin/activity-logs');
                const data = await res.json();
                if (res.ok) {
                    setLogs(data.logs || []);
                }
            } catch (error) {
                console.error("Failed to fetch logs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'CREATE': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'DELETE': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'UPDATE': return <Clock className="w-4 h-4 text-blue-500" />;
            case 'LOGIN': return <Activity className="w-4 h-4 text-purple-500" />;
            default: return <AlertCircle className="w-4 h-4 text-zinc-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-white">활동 로그</h2>
                <p className="text-zinc-400 text-sm">관리자 시스템의 주요 활동 내역을 확인합니다.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-zinc-500">로딩 중...</div>
                ) : logs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-950 text-zinc-500 uppercase text-xs border-b border-zinc-800">
                                <tr>
                                    <th className="px-6 py-3 font-medium">활동</th>
                                    <th className="px-6 py-3 font-medium">대상</th>
                                    <th className="px-6 py-3 font-medium">상세 내용</th>
                                    <th className="px-6 py-3 font-medium text-right">일시</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getActionIcon(log.action)}
                                                <span className={`font-medium ${log.action === 'CREATE' ? 'text-green-400' :
                                                        log.action === 'DELETE' ? 'text-red-400' :
                                                            'text-white'
                                                    }`}>
                                                    {log.action}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-300">
                                            {log.target}
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400">
                                            {log.details || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right text-zinc-500">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-zinc-600">
                        기록된 활동이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
