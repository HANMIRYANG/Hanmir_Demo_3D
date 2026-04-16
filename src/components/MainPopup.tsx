"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function MainPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
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

                        if (parsed.enabled) {
                            const hideUntil = localStorage.getItem('hideMainPopupUntil');
                            if (hideUntil) {
                                const hideUntilDate = new Date(hideUntil);
                                if (new Date() < hideUntilDate) {
                                    return;
                                }
                            }

                            // 이미지 원본 크기 파악
                            if (parsed.imageUrl) {
                                const img = new window.Image();
                                img.onload = () => {
                                    setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
                                };
                                img.src = parsed.imageUrl;
                            }

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

    const hasContent = config.title || config.content;

    // 이미지 비율에 따라 팝업 내 이미지 영역 너비를 계산 (화면 90vw, 90vh 내에서)
    // 텍스트가 있으면 오른쪽에 최소 280px 확보
    const getImageStyle = (): React.CSSProperties => {
        if (!imgSize) return {};
        const ratio = imgSize.w / imgSize.h;

        if (!hasContent) {
            // 텍스트 없으면 이미지만 표시 - 이미지 비율 그대로
            return { aspectRatio: `${imgSize.w}/${imgSize.h}` };
        }

        // 텍스트가 있을 때 - 세로 이미지면 높이 기준, 가로 이미지면 비율 유지
        if (ratio >= 1) {
            // 가로 이미지
            return { aspectRatio: `${imgSize.w}/${imgSize.h}`, width: '100%' };
        } else {
            // 세로 이미지
            return { aspectRatio: `${imgSize.w}/${imgSize.h}`, height: '100%' };
        }
    };

    // 이미지 비율에 따라 레이아웃 결정
    const isLandscape = imgSize ? imgSize.w / imgSize.h >= 1.2 : true;
    // 가로 이미지 → 위아래 배치, 세로/정사각형 이미지 → 좌우 배치
    const useHorizontalLayout = hasContent && !isLandscape;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-auto">
            <div
                className="relative bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300"
                style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            >
                {/* 닫기 버튼 */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 z-10 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full transition-all backdrop-blur-md hover:scale-105"
                    aria-label="닫기"
                >
                    <X size={18} strokeWidth={2.5} />
                </button>

                {/* 메인 컨텐츠 */}
                <div className={`flex flex-1 min-h-0 ${
                    useHorizontalLayout ? 'flex-row' : 'flex-col'
                }`}>
                    {/* 이미지 영역 */}
                    <div className={`relative bg-zinc-100 overflow-hidden flex-shrink-0 ${
                        useHorizontalLayout ? 'max-w-[60%]' : ''
                    }`}>
                        {config.imageUrl ? (
                            <img
                                src={config.imageUrl}
                                alt={config.title}
                                className="block max-w-full max-h-[70vh] object-contain transition-transform duration-500 hover:scale-105"
                                style={imgSize ? { aspectRatio: `${imgSize.w}/${imgSize.h}` } : undefined}
                            />
                        ) : (
                            <div className="w-[420px] aspect-[7/5] bg-gradient-to-tr from-blue-900 to-zinc-900 flex items-center justify-center text-white">
                                <span className="text-xl font-bold opacity-20">HANMIR NOTICE</span>
                            </div>
                        )}
                    </div>

                    {/* 텍스트 박스 영역 - 제목이나 내용이 있을 때만 표시 */}
                    {hasContent && (
                        <div className={`flex flex-col min-w-0 ${
                            useHorizontalLayout ? 'w-[280px] flex-shrink-0 border-l border-zinc-100' : ''
                        }`}>
                            <div className="p-7 flex flex-col gap-3 flex-1 overflow-y-auto">
                                {config.title && (
                                    <h3 className="text-xl font-bold text-zinc-900 leading-tight">
                                        {config.title}
                                    </h3>
                                )}
                                {config.content && (
                                    <div className="text-[15px] text-zinc-600 leading-relaxed whitespace-pre-wrap">
                                        {config.content}
                                    </div>
                                )}
                            </div>

                            {config.linkUrl && (
                                <div className="px-7 pb-5">
                                    <a
                                        href={config.linkUrl}
                                        className="block w-full py-3 text-center text-white bg-blue-600 hover:bg-blue-700 transition-colors font-bold text-[15px] rounded-lg"
                                    >
                                        자세히 보기 →
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 하단 버튼 영역 */}
                <div className="flex border-t border-zinc-100 bg-zinc-50 font-medium flex-shrink-0">
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
    );
}
