"use client";

import React, { useRef } from 'react';
import { snsItems } from '@/lib/media-data';
import { Instagram, Youtube, Facebook, ArrowRight } from 'lucide-react';

export const SNSSlider: React.FC = () => {
    // 가로 스크롤 컨테이너 ref
    const scrollRef = useRef<HTMLDivElement>(null);

    // 아이콘 매핑
    const getIcon = (platform: string) => {
        switch (platform) {
            case 'Instagram': return <Instagram className="w-5 h-5" />;
            case 'YouTube': return <Youtube className="w-5 h-5" />;
            case 'Facebook': return <Facebook className="w-5 h-5" />;
            default: return <Instagram className="w-5 h-5" />;
        }
    };

    // 색상 매핑
    const getColor = (platform: string) => {
        switch (platform) {
            case 'Instagram': return 'text-pink-500';
            case 'YouTube': return 'text-red-500';
            case 'Facebook': return 'text-blue-500';
            default: return 'text-white';
        }
    };

    return (
        <div className="w-full py-16 border-t border-zinc-900 mt-20">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">HANMIR SNS</h2>
                    <p className="text-zinc-500">한미르의 생생한 소식을 만나보세요.</p>
                </div>
                {/* 스크롤 가이드 */}
                <div className="text-zinc-500 text-sm hidden md:flex items-center gap-2">
                    Scroll <ArrowRight className="w-4 h-4" />
                </div>
            </div>

            {/* 슬라이더 컨테이너 */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x"
                style={{ scrollBehavior: 'smooth' }}
            >
                {snsItems.map((item) => (
                    <div
                        key={item.id}
                        className="min-w-[300px] md:min-w-[350px] bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex-shrink-0 snap-start group cursor-pointer hover:border-zinc-600 transition-colors"
                    >
                        {/* 이미지 영역 */}
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={item.image}
                                alt={item.platform}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* 플랫폼 아이콘 Overlay */}
                            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm p-2 rounded-full text-white">
                                {getIcon(item.platform)}
                            </div>
                        </div>

                        {/* 내용 영역 */}
                        <div className="p-6">
                            <div className={`flex items-center gap-2 mb-3 text-sm font-bold ${getColor(item.platform)}`}>
                                {item.platform}
                            </div>
                            <p className="text-zinc-300 text-sm line-clamp-2 leading-relaxed h-10 mb-4">
                                {item.content}
                            </p>
                            <div className="text-zinc-500 text-xs flex justify-between items-center border-t border-zinc-800 pt-4">
                                <span>{item.date}</span>
                                <span className="group-hover:text-white transition-colors">자세히 보기 &rarr;</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
