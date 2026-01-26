"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Edit, ExternalLink, X, Image as ImageIcon, Loader2, RefreshCw, Eye, Upload } from 'lucide-react';
import Link from 'next/link';

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

export default function MediaAdminPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const additionalImagesRef = useRef<HTMLInputElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: 'HANMIR NEWS',
        thumbnail: '',
        content: '',
        images: [] as string[],
        link: '',
        createdAt: ''
    });

    // Fetch Media
    const fetchMedia = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/media?timestamp=' + Date.now());
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();

            if (data.mediaItems) {
                const mapped = data.mediaItems.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    category: item.category,
                    thumbnail: item.thumbnail,
                    content: item.content,
                    images: item.images,
                    link: item.link,
                    views: item.views || 0,
                    createdAt: new Date(item.createdAt).toISOString().split('T')[0].replace(/-/g, '.')
                }));
                setMediaItems(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch media:", error);
            alert("미디어 목록을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    // Handle File Upload
    const handleFileUpload = async (file: File, type: 'thumbnail' | 'additional') => {
        try {
            setUploading(true);
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            formDataUpload.append('type', 'image');

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload
            });

            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();

            if (type === 'thumbnail') {
                setFormData(prev => ({ ...prev, thumbnail: data.url }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, data.url]
                }));
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('파일 업로드에 실패했습니다.');
        } finally {
            setUploading(false);
        }
    };

    // Open Create Modal
    const openCreateModal = () => {
        setIsEditMode(false);
        setEditingId(null);
        setFormData({
            title: '',
            category: 'HANMIR NEWS',
            thumbnail: '',
            content: '',
            images: [],
            link: '',
            createdAt: new Date().toISOString().split('T')[0] // Default to today
        });
        setIsModalOpen(true);
    };

    // Open Edit Modal
    const openEditModal = (item: MediaItem) => {
        setIsEditMode(true);
        setEditingId(item.id);
        let parsedImages: string[] = [];
        try {
            if (item.images) parsedImages = JSON.parse(item.images);
        } catch { }
        setFormData({
            title: item.title,
            category: item.category,
            thumbnail: item.thumbnail || '',
            content: item.content || '',
            images: parsedImages,
            link: item.link || '',
            createdAt: item.createdAt.replace(/\./g, '-') // Convert YYYY.MM.DD back to YYYY-MM-DD
        });
        setIsModalOpen(true);
    };

    // Handle Create/Update
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return alert("제목을 입력해주세요.");

        try {
            setSubmitting(true);

            const payload = {
                ...formData,
                images: JSON.stringify(formData.images)
            };

            if (isEditMode && editingId) {
                // Update
                const res = await fetch(`/api/admin/media/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!res.ok) throw new Error('Failed to update');
                alert("콘텐츠가 수정되었습니다.");
            } else {
                // Create
                const res = await fetch('/api/admin/media', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!res.ok) throw new Error('Failed to create');
                alert("콘텐츠가 등록되었습니다.");
            }

            await fetchMedia();
            setIsModalOpen(false);
            setFormData({
                title: '',
                category: 'HANMIR NEWS',
                thumbnail: '',
                content: '',
                images: [],
                link: '',
                createdAt: ''
            });
        } catch (error) {
            console.error("Error saving media:", error);
            alert("저장에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Delete
    const handleDelete = async (id: string) => {
        if (!confirm("정말 이 콘텐츠를 삭제하시겠습니까?")) return;

        try {
            const res = await fetch(`/api/admin/media?id=${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete');

            await fetchMedia();
            alert("삭제되었습니다.");
        } catch (error) {
            console.error("Error deleting media:", error);
            alert("삭제에 실패했습니다.");
        }
    };

    // Remove Additional Image
    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // Filtered Items
    const filteredItems = mediaItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">미디어 관리</h2>
                    <p className="text-zinc-400 text-sm">뉴스, 홍보자료, 보도자료 등 미디어 콘텐츠를 관리합니다.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchMedia}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-sm transition-colors"
                        title="새로고침"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-sm transition-colors text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        새 콘텐츠 등록
                    </button>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="제목 또는 내용 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black border border-zinc-800 text-white pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-600 text-sm"
                    />
                </div>
            </div>

            {loading && mediaItems.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-zinc-500 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>데이터 불러오는 중...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <div key={item.id} className="group bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-zinc-600 transition-colors">
                                <div className="aspect-video bg-zinc-800 relative">
                                    {/* Thumbnail or Placeholder */}
                                    {item.thumbnail ? (
                                        <div className="absolute inset-0">
                                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }} />
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                                            <ImageIcon className="w-8 h-8" />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="p-2 bg-white text-black rounded-full hover:bg-zinc-200"
                                            title="수정"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            title="삭제"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold px-2 py-0.5 border border-zinc-700 rounded text-zinc-400">
                                            {item.category}
                                        </span>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {item.views}
                                            </span>
                                            <span>{item.createdAt}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-white font-medium line-clamp-2 h-12 mb-4">
                                        {item.title}
                                    </h3>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/media/${item.id}`}
                                            target="_blank"
                                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                        >
                                            상세보기 <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-zinc-500">
                            등록된 콘텐츠가 없습니다.
                        </div>
                    )}
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-700 p-6 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">
                                {isEditMode ? '미디어 콘텐츠 수정' : '미디어 콘텐츠 등록'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-zinc-500 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">제목 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="제목을 입력하세요"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">카테고리</label>
                                <select
                                    className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="HANMIR NEWS">HANMIR NEWS</option>
                                    <option value="HANMIR NOW">HANMIR NOW</option>
                                    <option value="홍보자료실">홍보자료실</option>
                                </select>
                            </div>

                            {/* 썸네일 이미지 업로드 */}
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">썸네일 이미지</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(file, 'thumbnail');
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full border-2 border-dashed border-zinc-700 hover:border-blue-500 p-4 text-center transition-colors"
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <div className="flex items-center justify-center gap-2 text-zinc-400">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            업로드 중...
                                        </div>
                                    ) : formData.thumbnail ? (
                                        <div className="space-y-2">
                                            <img src={formData.thumbnail} alt="Thumbnail" className="w-full max-h-40 object-cover mx-auto" />
                                            <p className="text-xs text-zinc-400">클릭하여 변경</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-zinc-500">
                                            <Upload className="w-8 h-8" />
                                            <span className="text-sm">클릭하여 이미지 업로드</span>
                                        </div>
                                    )}
                                </button>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">본문 내용</label>
                                <textarea
                                    rows={8}
                                    className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none resize-none"
                                    placeholder="미디어 상세 내용을 입력하세요."
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            {/* 추가 이미지 업로드 */}
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">추가 이미지</label>
                                <input
                                    type="file"
                                    ref={additionalImagesRef}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(file, 'additional');
                                    }}
                                />
                                <div className="grid grid-cols-4 gap-2 mb-2">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="relative aspect-square bg-zinc-800 overflow-hidden group">
                                            <img src={img} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => additionalImagesRef.current?.click()}
                                        className="aspect-square border-2 border-dashed border-zinc-700 hover:border-blue-500 flex items-center justify-center transition-colors"
                                        disabled={uploading}
                                    >
                                        <Plus className="w-6 h-6 text-zinc-500" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">외부 링크 URL (선택)</label>
                                <input
                                    type="text"
                                    className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="연결될 페이지 주소 (선택사항)"
                                    value={formData.link}
                                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">등록일 (선택)</label>
                                <input
                                    type="date"
                                    className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none"
                                    value={formData.createdAt}
                                    onChange={e => setFormData({ ...formData, createdAt: e.target.value })}
                                />
                                <p className="text-xs text-zinc-500 mt-1">미리 지정된 날짜로 등록하거나 수정할 수 있습니다.</p>
                            </div>

                            <div className="pt-4 flex gap-3 border-t border-zinc-700">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition-colors"
                                    disabled={submitting}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
                                    disabled={submitting || uploading}
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isEditMode ? '수정하기' : '등록하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
