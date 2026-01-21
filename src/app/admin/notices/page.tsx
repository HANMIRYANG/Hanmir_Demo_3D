"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Edit, X, Loader2, RefreshCw, Bell, Eye, Image as ImageIcon, Paperclip, Upload } from 'lucide-react';

interface Attachment {
    name: string;
    url: string;
    size?: string;
}

interface Notice {
    id: string;
    number: number;
    category: string;
    title: string;
    content?: string;
    thumbnail?: string;
    images?: string;
    attachments?: string;
    isImportant: boolean;
    views: number;
    createdAt: string;
}

export default function AdminNoticesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    // File input refs
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const attachmentInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        category: '공지',
        title: '',
        content: '',
        thumbnail: '',
        images: [] as string[],
        attachments: [] as Attachment[],
        isImportant: false,
        createdAt: new Date().toISOString().split('T')[0]
    });

    // 파일 업로드 함수
    const uploadFile = async (file: File, type: 'image' | 'attachment'): Promise<{ url: string; name: string } | null> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || '업로드 실패');
            }

            const data = await res.json();
            return { url: data.url, name: data.originalName };
        } catch (error) {
            console.error('Upload error:', error);
            alert(error instanceof Error ? error.message : '파일 업로드에 실패했습니다.');
            return null;
        }
    };

    // 썸네일 업로드
    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const result = await uploadFile(file, 'image');
        setUploading(false);

        if (result) {
            setFormData({ ...formData, thumbnail: result.url });
        }
        e.target.value = '';
    };

    // 이미지 추가
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const result = await uploadFile(file, 'image');
        setUploading(false);

        if (result) {
            setFormData({ ...formData, images: [...formData.images, result.url] });
        }
        e.target.value = '';
    };

    // 첨부파일 추가
    const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const result = await uploadFile(file, 'attachment');
        setUploading(false);

        if (result) {
            setFormData({
                ...formData,
                attachments: [...formData.attachments, { name: result.name, url: result.url }]
            });
        }
        e.target.value = '';
    };

    // 이미지 삭제
    const removeImage = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index)
        });
    };

    // 첨부파일 삭제
    const removeAttachment = (index: number) => {
        setFormData({
            ...formData,
            attachments: formData.attachments.filter((_, i) => i !== index)
        });
    };

    // Fetch Notices
    const fetchNotices = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/notices?timestamp=' + Date.now());
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();

            if (data.notices) {
                const mapped = data.notices.map((item: any) => ({
                    id: item.id,
                    number: item.number,
                    category: item.category,
                    title: item.title,
                    content: item.content,
                    thumbnail: item.thumbnail,
                    images: item.images,
                    attachments: item.attachments,
                    isImportant: item.isImportant,
                    views: item.views || 0,
                    createdAt: new Date(item.createdAt).toISOString().split('T')[0].replace(/-/g, '.')
                }));
                setNotices(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch notices:", error);
            alert("공지사항 목록을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    // Open Create Modal
    const openCreateModal = () => {
        setIsEditMode(false);
        setEditingId(null);
        setFormData({
            category: '공지',
            title: '',
            content: '',
            thumbnail: '',
            images: [],
            attachments: [],
            isImportant: false,
            createdAt: new Date().toISOString().split('T')[0]
        });
        setIsModalOpen(true);
    };

    // Open Edit Modal
    const openEditModal = (item: Notice) => {
        setIsEditMode(true);
        setEditingId(item.id);
        let attachments: Attachment[] = [];
        let images: string[] = [];
        try {
            if (item.attachments) attachments = JSON.parse(item.attachments);
            if (item.images) images = JSON.parse(item.images);
        } catch { }
        setFormData({
            category: item.category,
            title: item.title,
            content: item.content || '',
            thumbnail: item.thumbnail || '',
            images,
            attachments,
            isImportant: item.isImportant,
            createdAt: item.createdAt.replace(/\./g, '-')
        });
        setIsModalOpen(true);
    };

    // Handle Create/Update
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return alert("제목을 입력해주세요.");

        try {
            setSubmitting(true);

            const dataToSend = {
                ...formData,
                images: JSON.stringify(formData.images),
                attachments: JSON.stringify(formData.attachments)
            };

            if (isEditMode && editingId) {
                const res = await fetch(`/api/admin/notices/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend)
                });
                if (!res.ok) throw new Error('Failed to update');
                alert("공지사항이 수정되었습니다.");
            } else {
                const res = await fetch('/api/admin/notices', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend)
                });
                if (!res.ok) throw new Error('Failed to create');
                alert("공지사항이 등록되었습니다.");
            }

            await fetchNotices();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving notice:", error);
            alert("저장에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Delete
    const handleDelete = async (id: string) => {
        if (!confirm("정말 이 공지사항을 삭제하시겠습니까?")) return;

        try {
            const res = await fetch(`/api/admin/notices/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            await fetchNotices();
            alert("삭제되었습니다.");
        } catch (error) {
            console.error("Error deleting notice:", error);
            alert("삭제에 실패했습니다.");
        }
    };

    // Filtered Items
    const filteredItems = notices.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 카테고리 색상
    const getCategoryColor = (category: string) => {
        switch (category) {
            case '공지': return 'border-red-500 text-red-400';
            case '뉴스': return 'border-blue-500 text-blue-400';
            case '이벤트': return 'border-green-500 text-green-400';
            case '채용': return 'border-purple-500 text-purple-400';
            default: return 'border-zinc-600 text-zinc-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">공지사항 관리</h2>
                    <p className="text-zinc-400 text-sm">홈페이지에 표시되는 공지사항을 관리합니다.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchNotices} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-sm transition-colors" title="새로고침">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-sm transition-colors text-sm">
                        <Plus className="w-4 h-4" /> 새 공지 등록
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="bg-zinc-900 border border-zinc-800 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="제목 또는 카테고리 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black border border-zinc-800 text-white pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-600 text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            {loading && notices.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-zinc-500 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>데이터 불러오는 중...</span>
                </div>
            ) : (
                <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase">
                                <th className="py-3 px-4 text-left w-16">No</th>
                                <th className="py-3 px-4 text-left w-24">분류</th>
                                <th className="py-3 px-4 text-left">제목</th>
                                <th className="py-3 px-4 text-center w-16">첨부</th>
                                <th className="py-3 px-4 text-center w-20">조회</th>
                                <th className="py-3 px-4 text-center w-28">등록일</th>
                                <th className="py-3 px-4 text-center w-24">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => {
                                    let hasAttachments = false;
                                    let hasImages = false;
                                    try {
                                        hasAttachments = item.attachments ? JSON.parse(item.attachments).length > 0 : false;
                                        hasImages = !!(item.thumbnail || (item.images && JSON.parse(item.images).length > 0));
                                    } catch { }
                                    return (
                                        <tr key={item.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                            <td className="py-3 px-4 text-zinc-500 text-sm">
                                                {item.isImportant ? <Bell className="w-4 h-4 text-amber-500" /> : item.number}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 border rounded ${getCategoryColor(item.category)}`}>
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-white">
                                                {item.isImportant && <span className="text-amber-500 mr-2">[중요]</span>}
                                                {item.title}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    {hasImages && <ImageIcon className="w-3 h-3 text-blue-400" />}
                                                    {hasAttachments && <Paperclip className="w-3 h-3 text-green-400" />}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-center text-zinc-500 text-sm">
                                                <span className="flex items-center justify-center gap-1">
                                                    <Eye className="w-3 h-3" /> {item.views}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center text-zinc-500 text-sm">{item.createdAt}</td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => openEditModal(item)} className="p-1 text-zinc-500 hover:text-white transition-colors" title="수정">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id)} className="p-1 text-zinc-500 hover:text-red-500 transition-colors" title="삭제">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center text-zinc-500">등록된 공지사항이 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Hidden File Inputs */}
            <input type="file" ref={thumbnailInputRef} onChange={handleThumbnailUpload} accept="image/*" className="hidden" />
            <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <input type="file" ref={attachmentInputRef} onChange={handleAttachmentUpload} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.hwp,.jpg,.jpeg,.png" className="hidden" />

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-700 p-6 flex justify-between items-center z-10">
                            <h3 className="text-xl font-bold text-white">
                                {isEditMode ? '공지사항 수정' : '공지사항 등록'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* 업로드 중 표시 */}
                            {uploading && (
                                <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center">
                                    <div className="bg-zinc-800 p-4 rounded flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                        <span className="text-white">업로드 중...</span>
                                    </div>
                                </div>
                            )}

                            {/* 카테고리 & 등록일 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 mb-1">카테고리</label>
                                    <select
                                        className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="공지">공지</option>
                                        <option value="뉴스">뉴스</option>
                                        <option value="이벤트">이벤트</option>
                                        <option value="채용">채용</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 mb-1">등록일</label>
                                    <input
                                        type="date"
                                        className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none"
                                        value={formData.createdAt}
                                        onChange={e => setFormData({ ...formData, createdAt: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* 중요 공지 */}
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isImportant}
                                        onChange={e => setFormData({ ...formData, isImportant: e.target.checked })}
                                        className="w-4 h-4 accent-amber-500"
                                    />
                                    <span className="text-white text-sm">중요 공지로 설정</span>
                                </label>
                            </div>

                            {/* 제목 */}
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">제목 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="공지사항 제목을 입력하세요"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {/* 썸네일 이미지 */}
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">
                                    <ImageIcon className="w-4 h-4 inline mr-1" />
                                    썸네일 이미지
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => thumbnailInputRef.current?.click()}
                                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm flex items-center gap-2"
                                    >
                                        <Upload className="w-4 h-4" /> 이미지 선택
                                    </button>
                                    {formData.thumbnail && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, thumbnail: '' })}
                                            className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-sm"
                                        >
                                            삭제
                                        </button>
                                    )}
                                </div>
                                {formData.thumbnail && (
                                    <div className="mt-2 max-w-md bg-zinc-800 rounded overflow-hidden">
                                        <img src={formData.thumbnail} alt="Thumbnail" className="w-full max-h-64 object-contain" />
                                    </div>
                                )}
                            </div>

                            {/* 추가 이미지 */}
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">
                                    <ImageIcon className="w-4 h-4 inline mr-1" />
                                    추가 이미지
                                </label>
                                <button
                                    type="button"
                                    onClick={() => imageInputRef.current?.click()}
                                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm flex items-center gap-2"
                                >
                                    <Upload className="w-4 h-4" /> 이미지 추가
                                </button>
                                {formData.images.length > 0 && (
                                    <div className="mt-2 grid grid-cols-4 gap-2">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="relative aspect-square bg-zinc-800 overflow-hidden group">
                                                <img src={img} alt={`Image ${index}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 내용 */}
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">내용</label>
                                <textarea
                                    rows={6}
                                    className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none resize-none"
                                    placeholder="공지사항 내용을 입력하세요"
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            {/* 첨부파일 섹션 */}
                            <div className="border border-zinc-700 p-4 rounded">
                                <label className="block text-xs font-bold text-zinc-500 mb-3">
                                    <Paperclip className="w-4 h-4 inline mr-1" />
                                    첨부파일
                                </label>

                                <button
                                    type="button"
                                    onClick={() => attachmentInputRef.current?.click()}
                                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm flex items-center gap-2 mb-3"
                                >
                                    <Upload className="w-4 h-4" /> 파일 선택
                                </button>
                                <p className="text-xs text-zinc-500 mb-3">PDF, DOC, XLS, PPT, ZIP, HWP, 이미지 파일</p>

                                {formData.attachments.length > 0 && (
                                    <div className="space-y-2">
                                        {formData.attachments.map((att, index) => (
                                            <div key={index} className="flex items-center justify-between bg-zinc-800 p-2 rounded">
                                                <span className="text-sm text-white truncate flex-1">{att.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(index)}
                                                    className="text-red-400 hover:text-red-300 ml-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 버튼 */}
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
