"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import {
    ArrowLeft,
    Eye,
    Calendar,
    Share2,
    Link as LinkIcon,
    Check,
    MessageCircle
} from 'lucide-react';

interface MediaItem {
    id: string;
    title: string;
    category: string;
    thumbnail: string;
    content?: string;
    images?: string;
    link?: string;
    views: number;
    createdAt: string;
}

interface RelatedItem {
    id: string;
    title: string;
    thumbnail: string;
    category: string;
    createdAt: string;
}

// SNS 공유 컴포넌트
const ShareButtons: React.FC<{ title: string; url: string }> = ({ title, url }) => {
    const [copied, setCopied] = useState(false);

    const shareKakao = () => {
        if (typeof window !== 'undefined' && (window as any).Kakao) {
            (window as any).Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: title,
                    description: '한미르 미디어',
                    imageUrl: '',
                    link: { mobileWebUrl: url, webUrl: url }
                }
            });
        } else {
            alert('카카오 공유 기능을 사용할 수 없습니다.');
        }
    };

    const shareFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            alert('링크 복사에 실패했습니다.');
        }
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 flex items-center gap-1">
                <Share2 className="w-4 h-4" /> 공유
            </span>
            <button
                onClick={shareKakao}
                className="w-9 h-9 flex items-center justify-center bg-[#FEE500] rounded-full hover:opacity-80 transition-opacity"
                title="카카오톡 공유"
            >
                <MessageCircle className="w-5 h-5 text-[#3C1E1E]" />
            </button>
            <button
                onClick={shareFacebook}
                className="w-9 h-9 flex items-center justify-center bg-[#1877F2] rounded-full hover:opacity-80 transition-opacity"
                title="페이스북 공유"
            >
                <span className="text-white font-bold text-sm">f</span>
            </button>
            <button
                onClick={copyLink}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${copied ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                title="링크 복사"
            >
                {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
            </button>
        </div>
    );
};

export default function MediaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [media, setMedia] = useState<MediaItem | null>(null);
    const [relatedItems, setRelatedItems] = useState<RelatedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const res = await fetch(`/api/media/${params.id}`);
                const data = await res.json();
                if (res.ok) {
                    setMedia(data.mediaItem);
                    setRelatedItems(data.relatedItems || []);
                } else {
                    router.push('/media');
                }
            } catch (error) {
                console.error('Failed to fetch media:', error);
                router.push('/media');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchMedia();
        }
    }, [params.id, router]);

    // 이미지 배열 파싱
    const additionalImages: string[] = media?.images ? JSON.parse(media.images) : [];

    // 카테고리 색상
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'HANMIR NEWS': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'HANMIR NOW': return 'bg-green-100 text-green-600 border-green-200';
            case '홍보자료실': return 'bg-purple-100 text-purple-600 border-purple-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
            </div>
        );
    }

    if (!media) {
        return null;
    }

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-amber-500 selection:text-white">
            <CustomCursor />
            <Navbar />

            <main className="pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    {/* 뒤로가기 */}
                    <Link
                        href="/media"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        목록으로
                    </Link>

                    {/* 메인 이미지 */}
                    <div className="relative w-full aspect-video bg-gray-100 mb-8 overflow-hidden">
                        <img
                            src={media.thumbnail || '/placeholder.jpg'}
                            alt={media.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* 카테고리 & 메타 정보 */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className={`px-3 py-1 text-xs font-bold border rounded ${getCategoryColor(media.category)}`}>
                            {media.category}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {new Date(media.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-400">
                            <Eye className="w-4 h-4" />
                            조회 {media.views}
                        </span>
                    </div>

                    {/* 제목 */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        {media.title}
                    </h1>

                    {/* 공유 버튼 */}
                    <div className="border-y border-gray-200 py-4 mb-8">
                        <ShareButtons title={media.title} url={currentUrl} />
                    </div>

                    {/* 본문 내용 */}
                    {media.content && (
                        <div className="prose prose-gray max-w-none mb-12">
                            <div
                                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: media.content.replace(/\n/g, '<br/>') }}
                            />
                        </div>
                    )}

                    {/* 추가 이미지 갤러리 */}
                    {additionalImages.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">이미지 갤러리</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {additionalImages.map((img, index) => (
                                    <div
                                        key={index}
                                        className="aspect-square bg-gray-100 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 외부 링크 */}
                    {media.link && (
                        <div className="mb-12">
                            <a
                                href={media.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors"
                            >
                                <LinkIcon className="w-4 h-4" />
                                관련 링크 보기
                            </a>
                        </div>
                    )}

                    {/* 관련 미디어 */}
                    {relatedItems.length > 0 && (
                        <div className="border-t border-gray-200 pt-12">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">관련 미디어</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {relatedItems.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/media/${item.id}`}
                                        className="group"
                                    >
                                        <div className="aspect-video bg-gray-100 overflow-hidden mb-2">
                                            <img
                                                src={item.thumbnail || '/placeholder.jpg'}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                                            {item.title}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 목록으로 버튼 */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <Link
                            href="/media"
                            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            목록으로
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />

            {/* 이미지 확대 모달 */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={selectedImage}
                        alt="Enlarged"
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            )}
        </div>
    );
}
