"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Edit, X, Image as ImageIcon, Loader2, RefreshCw, Calendar, Upload } from 'lucide-react';

interface HistoryItem {
    id: string;
    year: string;
    title: string;
    content?: string;
    image?: string;
    order: number;
    createdAt: string;
}

export default function HistoryAdminPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [histories, setHistories] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        year: '',
        title: '',
        content: '',
        image: '',
        order: 0
    });

    // Fetch Histories
    const fetchHistories = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/history?timestamp=' + Date.now());
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();

            if (data.histories) {
                setHistories(data.histories);
            }
        } catch (error) {
            console.error("Failed to fetch histories:", error);
            alert("연혁 목록을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistories();
    }, []);

    // Handle File Upload
    const handleFileUpload = async (file: File) => {
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
            setFormData(prev => ({ ...prev, image: data.url }));
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
            year: new Date().getFullYear().toString(),
            title: '',
            content: '',
            image: '',
            order: 0
        });
        setIsModalOpen(true);
    };

    // Open Edit Modal
    const openEditModal = (item: HistoryItem) => {
        setIsEditMode(true);
        setEditingId(item.id);
        setFormData({
            year: item.year,
            title: item.title,
            content: item.content || '',
            image: item.image || '',
            order: item.order
        });
        setIsModalOpen(true);
    };

    // Handle Create/Update
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.year || !formData.title) return alert("연도와 제목은 필수입니다.");

        try {
            setSubmitting(true);

            if (isEditMode && editingId) {
                const res = await fetch(`/api/admin/history/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (!res.ok) throw new Error('Failed to update');
                alert("연혁이 수정되었습니다.");
            } else {
                const res = await fetch('/api/admin/history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (!res.ok) throw new Error('Failed to create');
                alert("연혁이 등록되었습니다.");
            }

            await fetchHistories();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving history:", error);
            alert("저장에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Delete
    const handleDelete = async (id: string) => {
        if (!confirm("정말 이 연혁을 삭제하시겠습니까?")) return;

        try {
            const res = await fetch(`/api/admin/history/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete');

            await fetchHistories();
            alert("삭제되었습니다.");
        } catch (error) {
            console.error("Error deleting history:", error);
            alert("삭제에 실패했습니다.");
        }
    };

    // Filtered Items
    const filteredItems = histories.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.year.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">연혁 관리</h2>
                    <p className="text-zinc-400 text-sm">회사 연혁을 관리합니다.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchHistories}
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
                        새 연혁 등록
                    </button>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="연도 또는 제목 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black border border-zinc-800 text-white pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-600 text-sm"
                    />
                </div>
            </div>

            {loading && histories.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-zinc-500 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>데이터 불러오는 중...</span>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <div key={item.id} className="group bg-zinc-900 border border-zinc-800 p-4 hover:border-zinc-600 transition-colors flex gap-4">
                                {/* 이미지 */}
                                <div className="w-24 h-24 bg-zinc-800 flex-shrink-0 overflow-hidden">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                            <ImageIcon className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>

                                {/* 정보 */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2 py-1 bg-amber-500/20 text-amber-500 text-xs font-bold">
                                            {item.year}
                                        </span>
                                        <span className="text-xs text-zinc-500">순서: {item.order}</span>
                                    </div>
                                    <h3 className="text-white font-medium">{item.title}</h3>
                                    {item.content && (
                                        <p className="text-zinc-500 text-sm mt-1 line-clamp-2 whitespace-pre-line">{item.content}</p>
                                    )}
                                </div>

                                {/* 액션 버튼 */}
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(item)}
                                        className="p-2 bg-zinc-800 text-zinc-400 hover:text-white rounded"
                                        title="수정"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded"
                                        title="삭제"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center text-zinc-500">
                            등록된 연혁이 없습니다.
                        </div>
                    )}
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-700 p-6 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">
                                {isEditMode ? '연혁 수정' : '연혁 등록'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-zinc-500 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 mb-1">연도 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="2025"
                                        value={formData.year}
                                        onChange={e => setFormData({ ...formData, year: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 mb-1">순서</label>
                                    <input
                                        type="number"
                                        className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="0"
                                        value={formData.order}
                                        onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    />
                                    <p className="text-xs text-zinc-500 mt-1">낮을수록 상단 표시</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">제목 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="연혁 제목"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">내용</label>
                                <textarea
                                    rows={4}
                                    className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none resize-none"
                                    placeholder="상세 내용 (선택)"
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            {/* 이미지 업로드 */}
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">이미지</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(file);
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
                                    ) : formData.image ? (
                                        <div className="space-y-2">
                                            <img src={formData.image} alt="Preview" className="w-full max-h-32 object-cover mx-auto" />
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
