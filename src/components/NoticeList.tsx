"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Eye, Bell, Download, Image as ImageIcon, Paperclip, X } from "lucide-react";

// Types
type NoticeCategory = "공지" | "뉴스" | "이벤트" | "채용";

interface Attachment {
    name: string;
    url: string;
}

interface Notice {
    id: string;
    number: number;
    category: NoticeCategory;
    title: string;
    content?: string;
    thumbnail?: string;
    images?: string; // JSON array
    attachments?: string; // JSON array
    isImportant: boolean;
    views: number;
    date: string;
}

export const NoticeList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Fetch Notices
    React.useEffect(() => {
        const fetchNotices = async () => {
            try {
                const res = await fetch('/api/admin/notices?timestamp=' + Date.now(), { cache: 'no-store' });
                const data = await res.json();

                if (res.ok && data.notices) {
                    const mappedNotices = data.notices.map((n: any) => ({
                        id: n.id,
                        number: n.number,
                        category: n.category as NoticeCategory,
                        title: n.title,
                        content: n.content,
                        thumbnail: n.thumbnail,
                        images: n.images,
                        attachments: n.attachments,
                        isImportant: n.isImportant,
                        views: n.views || 0,
                        date: new Date(n.createdAt).toISOString().split('T')[0]
                    }));
                    setNotices(mappedNotices);
                }
            } catch (error) {
                console.error("Failed to fetch notices:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    // Pagination
    const ITEMS_PER_PAGE = 10;

    // Filtering
    const filteredNotices = useMemo(() => {
        return notices.filter(n =>
            n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, notices]);

    const totalPages = Math.ceil(filteredNotices.length / ITEMS_PER_PAGE);
    const currentData = filteredNotices.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // 카테고리 색상
    const getCategoryColor = (category: string) => {
        switch (category) {
            case '공지': return 'bg-red-100 text-red-600 border-red-200';
            case '뉴스': return 'bg-blue-100 text-blue-600 border-blue-200';
            case '이벤트': return 'bg-green-100 text-green-600 border-green-200';
            case '채용': return 'bg-purple-100 text-purple-600 border-purple-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    // 이미지 파싱
    const parseImages = (notice: Notice): string[] => {
        const images: string[] = [];
        if (notice.thumbnail) images.push(notice.thumbnail);
        try {
            if (notice.images) {
                const parsed = JSON.parse(notice.images);
                if (Array.isArray(parsed)) images.push(...parsed);
            }
        } catch { }
        return images;
    };

    // 첨부파일 파싱
    const parseAttachments = (notice: Notice): Attachment[] => {
        try {
            if (notice.attachments) {
                const parsed = JSON.parse(notice.attachments);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch { }
        return [];
    };

    // 파일 용량 포맷
    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes}B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    };

    // 파일 다운로드 핸들러 (외부 URL도 강제 다운로드)
    const handleDownload = async (url: string, fileName: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download error:', error);
            // 실패 시 새 탭에서 열기
            window.open(url, '_blank');
        }
    };

    return (
        <section id="notice" className="bg-white py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 border border-gray-300 bg-gray-50 text-[11px] font-bold text-gray-500">
                            Notice
                        </span>
                        <div className="h-[1px] w-20 bg-gray-300" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        공지사항
                    </h2>
                    <p className="text-gray-500 max-w-2xl text-lg font-light leading-relaxed">
                        한미르의 최신 소식, 공지사항, 이벤트 정보를 확인하세요.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-none leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm transition-all hover:border-gray-400"
                            placeholder="제목 또는 키워드 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <p className="text-sm text-gray-500">
                        총 <span className="font-bold text-gray-900">{filteredNotices.length}</span>건
                    </p>
                </div>

                {/* Table Structure */}
                <div className="w-full overflow-x-auto border-t border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="py-4 px-4 font-medium w-20 text-center">No</th>
                                <th className="py-4 px-4 font-medium w-24">Category</th>
                                <th className="py-4 px-4 font-medium">Title</th>
                                <th className="py-4 px-4 font-medium hidden md:table-cell w-16 text-center">File</th>
                                <th className="py-4 px-4 font-medium hidden md:table-cell w-32 text-center">Date</th>
                                <th className="py-4 px-4 font-medium hidden md:table-cell w-24 text-center">Views</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-400">
                                        로딩 중...
                                    </td>
                                </tr>
                            ) : currentData.length > 0 ? (
                                currentData.map((notice) => {
                                    const hasImages = parseImages(notice).length > 0;
                                    const hasAttachments = parseAttachments(notice).length > 0;
                                    return (
                                        <tr
                                            key={notice.id}
                                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${notice.isImportant ? 'bg-amber-50/50' : ''}`}
                                            onClick={() => setSelectedNotice(notice)}
                                        >
                                            <td className="py-4 px-4 text-center">
                                                {notice.isImportant ? (
                                                    <Bell className="w-4 h-4 text-amber-500 mx-auto" />
                                                ) : (
                                                    <span className="text-gray-400 font-mono text-xs">{notice.number}</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-block px-2 py-1 text-[10px] font-bold border rounded-sm ${getCategoryColor(notice.category)}`}>
                                                    {notice.category}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`font-medium group-hover:text-amber-600 transition-colors ${notice.isImportant ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
                                                    {notice.isImportant && <span className="text-amber-500 mr-2">[중요]</span>}
                                                    {notice.title}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 hidden md:table-cell text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    {hasImages && <ImageIcon className="w-3 h-3 text-blue-500" />}
                                                    {hasAttachments && <Paperclip className="w-3 h-3 text-green-500" />}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 hidden md:table-cell text-center text-gray-400 text-xs font-mono">{notice.date}</td>
                                            <td className="py-4 px-4 hidden md:table-cell text-center">
                                                <span className="flex items-center justify-center gap-1 text-gray-400 text-xs">
                                                    <Eye className="w-3 h-3" />
                                                    {notice.views}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-400">
                                        {searchTerm ? '검색 결과가 없습니다.' : '등록된 공지사항이 없습니다.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center mt-12 gap-4">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 hover:border-gray-400 disabled:opacity-30 disabled:hover:border-gray-300 transition-colors text-gray-500"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-500 font-mono">
                        Page <span className="text-gray-900 font-bold">{currentPage}</span> of {Math.max(1, totalPages)}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 border border-gray-300 hover:border-gray-400 disabled:opacity-30 disabled:hover:border-gray-300 transition-colors text-gray-500"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Notice Detail Modal */}
            {selectedNotice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setSelectedNotice(null)}
                    />
                    <div className="relative w-full max-w-3xl bg-white border border-gray-200 shadow-2xl max-h-[85vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`inline-block px-2 py-1 text-[10px] font-bold border rounded-sm ${getCategoryColor(selectedNotice.category)}`}>
                                    {selectedNotice.category}
                                </span>
                                {selectedNotice.isImportant && (
                                    <span className="text-amber-500 text-xs font-bold">중요</span>
                                )}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{selectedNotice.title}</h3>
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                <span>{selectedNotice.date}</span>
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> {selectedNotice.views}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* 썸네일 이미지 */}
                            {selectedNotice.thumbnail && (
                                <div
                                    className="mb-6 cursor-pointer"
                                    onClick={() => setSelectedImage(selectedNotice.thumbnail!)}
                                >
                                    <img
                                        src={selectedNotice.thumbnail}
                                        alt="썸네일"
                                        className="w-full max-h-[500px] object-contain rounded hover:opacity-90 transition-opacity"
                                    />
                                </div>
                            )}

                            {/* 본문 */}
                            <div className="prose prose-gray max-w-none mb-6">
                                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                    {selectedNotice.content || '내용이 없습니다.'}
                                </div>
                            </div>

                            {/* 추가 이미지 갤러리 */}
                            {(() => {
                                const images = parseImages(selectedNotice).slice(selectedNotice.thumbnail ? 1 : 0);
                                if (images.length === 0) return null;
                                return (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4" /> 이미지
                                        </h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {images.map((img, index) => (
                                                <div
                                                    key={index}
                                                    className="aspect-square bg-gray-100 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                                    onClick={() => setSelectedImage(img)}
                                                >
                                                    <img src={img} alt={`이미지 ${index + 1}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* 첨부파일 */}
                            {(() => {
                                const attachments = parseAttachments(selectedNotice);
                                if (attachments.length === 0) return null;
                                return (
                                    <div className="mb-6 border border-gray-200 rounded p-4 bg-gray-50">
                                        <h4 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
                                            <Paperclip className="w-4 h-4" /> 첨부파일
                                        </h4>
                                        <div className="space-y-2">
                                            {attachments.map((att, index) => (
                                                <button
                                                    key={index}
                                                    onClick={(e) => handleDownload(att.url, att.name, e)}
                                                    className="flex items-center justify-between p-3 bg-white border border-gray-200 hover:border-amber-500 transition-colors group w-full text-left"
                                                >
                                                    <span className="text-sm text-gray-700 truncate flex-1">
                                                        {att.name}
                                                    </span>
                                                    <Download className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors ml-2" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
                            <button
                                onClick={() => setSelectedNotice(null)}
                                className="px-6 py-2 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 이미지 확대 모달 */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 text-white hover:text-amber-500 transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <img
                        src={selectedImage}
                        alt="확대 이미지"
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            )}
        </section>
    );
};
