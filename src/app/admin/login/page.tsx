"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // 로그인 성공 시 대시보드로 이동
                // alert('로그인 성공! 대시보드로 이동합니다.'); // Debug: Uncomment if needed
                router.push('/admin');
            } else {
                alert(`로그인 실패: ${data.error || '알 수 없는 오류'}`); // Debug
                setError(data.error || '로그인에 실패했습니다.');
            }
        } catch (err) {
            alert('서버 연결 오류 발생'); // Debug
            setError('서버 연결 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            {/* 배경 효과 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] bg-zinc-800/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl p-8 md:p-12 relative z-10 shadow-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">HANMIR ADMIN</h1>
                    <p className="text-zinc-500 text-sm">한미르 관리자 시스템 로그인</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Admin ID</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                className="w-full bg-black border border-zinc-800 text-white pl-12 pr-4 py-4 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-700"
                                placeholder="아이디를 입력하세요"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border border-zinc-800 text-white pl-12 pr-4 py-4 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-700"
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black font-bold py-4 hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {isLoading ? (
                            <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                로그인 <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-zinc-600 text-xs">
                        &copy; 2025 HANMIR CO., LTD. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
