"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import { MediaSidebar } from '@/components/media/MediaSidebar';
import { NewsGrid } from '@/components/media/NewsGrid';
import { SNSSlider } from '@/components/media/SNSSlider';
import { mediaItems as staticMediaItems, MediaItem } from '@/lib/media-data';

export default function MediaPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Media Items
    React.useEffect(() => {
        const fetchMedia = async () => {
            try {
                const res = await fetch('/api/admin/media');
                const data = await res.json();

                if (res.ok && data.mediaItems) {
                    const mappedItems = data.mediaItems.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        category: item.category,
                        date: new Date(item.createdAt).toISOString().split('T')[0].replace(/-/g, '.'),
                        thumbnail: item.thumbnail,
                        link: item.link
                    }));
                    setMediaItems(mappedItems);
                } else {
                    // Fallback to static data if API fails or returns empty (optional)
                    setMediaItems(staticMediaItems);
                }
            } catch (error) {
                console.error("Failed to fetch media:", error);
                setMediaItems(staticMediaItems);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, []);

    // 카테고리 필터링
    const filteredItems = activeCategory === 'all'
        ? mediaItems
        : mediaItems.filter(item => item.category === activeCategory);

    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-amber-500 selection:text-white">
            <CustomCursor />
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-12">
                        {/* 1. 사이드바 (좌측) */}
                        <MediaSidebar
                            activeCategory={activeCategory}
                            onSelectCategory={setActiveCategory}
                        />

                        {/* 2. 메인 콘텐츠 (우측) */}
                        <div className="flex-1 min-w-0">
                            {/* 헤더: Breadcrumb & Title */}
                            <div className="mb-12">
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                    <span>Home</span>
                                    <span>/</span>
                                    <span>Media</span>
                                    <span>/</span>
                                    <span className="text-gray-900 font-bold">
                                        {activeCategory === 'all' ? '전체' : activeCategory}
                                    </span>
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900">
                                    {activeCategory === 'all' ? 'HANMIR MEDIA CENTER' : activeCategory}
                                </h1>
                            </div>

                            {/* 뉴스 그리드 & 검색 */}
                            {loading ? (
                                <div className="text-center py-20 text-gray-400">Loading...</div>
                            ) : (
                                <NewsGrid items={filteredItems} />
                            )}

                            {/* SNS 슬라이더 섹션 */}
                            <SNSSlider />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
