"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

export function MainPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState({
        enabled: false,
        title: "",
        content: "",
        imageUrl: "",
        linkUrl: ""
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch('/api/admin/settings?key=main_popup_config');
                if (res.ok) {
                    const data = await res.json();
                    if (data?.value) {
                        const parsed = JSON.parse(data.value);
                        setConfig(parsed);

                        // 활성화 상태이고 오늘 하루 보지 않기가 설정되어 있지 않은 경우에만 팝업 표시
                        if (parsed.enabled) {
                            const hideUntil = localStorage.getItem('hideMainPopupUntil');
                            if (hideUntil) {
                                const hideUntilDate = new Date(hideUntil);
                                if (new Date() < hideUntilDate) {
                                    return;
                                }
                            }

                            // 자연스러운 나타남을 위해 약간의 지연 후 표시
                            setTimeout(() => {
                                setIsOpen(true);
                            }, 500);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch popup config:', error);
            }
        };

        fetchConfig();
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleHideToday = () => {
        const tomorrow = new Date();
        tomorrow.setHours(24, 0, 0, 0);
        localStorage.setItem('hideMainPopupUntil', tomorrow.toISOString());
        setIsOpen(false);
    };

    if (!isOpen || !config.enabled) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-auto">
            <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">

                {/* 상단 이미지 영역 */}
                <div className="relative w-full aspect-[7/5] bg-zinc-100 overflow-hidden">
                    {config.imageUrl ? (
                        <img
                            src={config.imageUrl}
                            alt={config.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-zinc-900 flex items-center justify-center text-white">
                            <span className="text-xl font-bold opacity-20">HANMIR NOTICE</span>
                        </div>
                    )}

                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full transition-all backdrop-blur-md hover:scale-105"
                        aria-label="닫기"
                    >
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* 하단 텍스트 영역 */}
                <div className="p-7 flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                    <h3 className="text-xl font-bold text-zinc-900 leading-tight">
                        {config.title || "공지사항"}
                    </h3>
                    <div className="text-[15px] text-zinc-600 leading-relaxed whitespace-pre-wrap">
                        {config.content || "등록된 내용이 없습니다."}
                    </div>
                </div>

                {/* 하단 버튼 영역 */}
                <div className="flex flex-col border-t border-zinc-100 bg-zinc-50 font-medium">
                    {/* 링크 URL이 있을 경우에만 렌더링 */}
                    {config.linkUrl && (
                        <a
                            href={config.linkUrl}
                            className="w-full py-4 text-center text-white bg-blue-600 hover:bg-blue-700 transition-colors font-bold text-[15px]"
                        >
                            자세히 보기 →
                        </a>
                    )}

                    <div className="flex w-full">
                        <button
                            onClick={handleHideToday}
                            className="flex-1 py-4 text-sm text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200 transition-colors"
                        >
                            오늘 하루 보지 않기
                        </button>
                        <div className="w-[1px] bg-zinc-200"></div>
                        <button
                            onClick={handleClose}
                            className="flex-1 py-4 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition-colors font-medium"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

