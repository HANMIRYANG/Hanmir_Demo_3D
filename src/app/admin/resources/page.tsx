"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, FileText, Trash2, Edit, Download, X, Upload, Loader2, RefreshCw, File } from 'lucide-react';

interface Resource {
    id: string;
    title: string;
    category: string;
    format: string;
    fileSize: string;
    filePath: string;
    createdAt: string;
}

// 파일 크기 포맷 함수
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 확장자에서 포맷 추출 함수
const getFormatFromFileName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toUpperCase() || 'UNKNOWN';
    return ext;
};

export default function ResourcesAdminPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: 'Catalogue',
        fileName: '',
        filePath: '',
        fileSize: '',
        format: ''
    });

    // Fetch Resources
    const fetchResources = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/resources?timestamp=' + Date.now()); // 캐시 방지용 쿼리
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();

            if (data.resources) {
                const mapped = data.resources.map((r: any) => ({
                    id: r.id,
                    title: r.title,
                    category: r.category,
                    format: r.format,
                    fileSize: r.fileSize,
                    filePath: r.filePath,
                    createdAt: new Date(r.createdAt).toISOString().split('T')[0]
                }));
                setResources(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch resources:", error);
            alert("자료 목록을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    // Handle Create
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return alert("제목을 입력해주세요.");
        if (!selectedFile) return alert("파일을 첨부해주세요.");

        try {
            setSubmitting(true);

            // 1. 파일 업로드
            setUploading(true);
            const uploadFormData = new FormData();
            uploadFormData.append('file', selectedFile);
            uploadFormData.append('type', 'attachment');

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData
            });

            if (!uploadRes.ok) {
                const uploadError = await uploadRes.json();
                throw new Error(uploadError.error || '파일 업로드 실패');
            }

            const uploadData = await uploadRes.json();
            setUploading(false);

            // 2. 기술자료 등록 (업로드된 파일 정보 사용)
            const resourceData = {
                title: formData.title,
                category: formData.category,
                fileName: uploadData.originalName || selectedFile.name,
                filePath: uploadData.url,
                fileSize: formData.fileSize,
                format: formData.format
            };

            const res = await fetch('/api/admin/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resourceData)
            });

            if (!res.ok) throw new Error('Failed to create');

            await fetchResources(); // 목록 갱신
            setIsModalOpen(false);
            setSelectedFile(null);
            setFormData({
                title: '',
                category: 'Catalogue',
                fileName: '',
                filePath: '',
                fileSize: '',
                format: ''
            });
            alert("자료가 등록되었습니다.");
        } catch (error) {
            console.error("Error creating resource:", error);
            alert("자료 등록에 실패했습니다: " + (error instanceof Error ? error.message : ''));
        } finally {
            setSubmitting(false);
            setUploading(false);
        }
    };

    // Handle Delete
    const handleDelete = async (id: string) => {
        if (!confirm("정말 이 자료를 삭제하시겠습니까?")) return;

        try {
            const res = await fetch(`/api/admin/resources?id=${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete');

            await fetchResources(); // 목록 갱신
            alert("자료가 삭제되었습니다.");
        } catch (error) {
            console.error("Error deleting resource:", error);
            alert("자료 삭제에 실패했습니다.");
        }
    };

    // Filtered Resources
    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">기술자료 관리</h2>
                    <p className="text-zinc-400 text-sm">제품 사양서, 인증서, 매뉴얼 등 기술 자료를 등록하고 관리합니다.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchResources}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-sm transition-colors"
                        title="새로고침"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-sm transition-colors text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        새 자료 등록
                    </button>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-zinc-900 border border-zinc-800 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="자료명 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black border border-zinc-800 text-white pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-600 text-sm"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-zinc-900 border border-zinc-800 overflow-hidden min-h-[400px]">
                {loading && resources.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-zinc-500 gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>데이터 불러오는 중...</span>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-black/50 text-xs uppercase text-zinc-500 border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4 font-medium">자료 정보</th>
                                <th className="px-6 py-4 font-medium">카테고리</th>
                                <th className="px-6 py-4 font-medium">형식/크기</th>
                                <th className="px-6 py-4 font-medium">등록일</th>
                                <th className="px-6 py-4 font-medium text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {filteredResources.length > 0 ? (
                                filteredResources.map((res) => (
                                    <tr key={res.id} className="hover:bg-zinc-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-zinc-200">{res.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-zinc-800 text-zinc-400 border border-zinc-700">
                                                {res.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-400">
                                            {res.format} <span className="text-zinc-600">({res.fileSize})</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-500">
                                            {res.createdAt}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white" title="파일 다운로드">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(res.id)}
                                                    className="p-2 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-400"
                                                    title="삭제"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-zinc-500">
                                        등록된 자료가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 shadow-2xl p-6 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-6">새 자료 등록</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">제목</label>
                                <input
                                    type="text"
                                    className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none"
                                    placeholder="자료명을 입력하세요"
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
                                    <option value="Catalogue">Catalogue</option>
                                    <option value="Manual">Manual</option>
                                    <option value="Datasheet">Datasheet</option>
                                    <option value="Certificate">Certificate</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">파일 첨부</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.hwp"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setSelectedFile(file);
                                            setFormData({
                                                ...formData,
                                                fileName: file.name,
                                                fileSize: formatFileSize(file.size),
                                                format: getFormatFromFileName(file.name)
                                            });
                                        }
                                    }}
                                />
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer bg-zinc-950 ${selectedFile ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 hover:border-zinc-500'
                                        }`}
                                >
                                    {selectedFile ? (
                                        <div className="space-y-2">
                                            <File className="w-8 h-8 text-blue-400 mx-auto" />
                                            <p className="text-sm text-white font-medium">{selectedFile.name}</p>
                                            <p className="text-xs text-zinc-400">
                                                {formData.format} • {formData.fileSize}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedFile(null);
                                                    setFormData({
                                                        ...formData,
                                                        fileName: '',
                                                        fileSize: '',
                                                        format: ''
                                                    });
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = '';
                                                    }
                                                }}
                                                className="mt-2 px-3 py-1 text-xs bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                                            >
                                                파일 변경
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                                            <p className="text-sm text-zinc-400">클릭하여 파일 선택</p>
                                            <p className="text-xs text-zinc-600 mt-1">PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, HWP</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
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
                                    className="flex-1 py-3 bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    disabled={submitting || uploading}
                                >
                                    {(submitting || uploading) && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {uploading ? '업로드 중...' : submitting ? '등록 중...' : '등록하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
