"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, MessageCircle, Pencil, Trash2, X, Plus } from "lucide-react";

interface QnaPost {
    id: string;
    number: number;
    author: string;
    title: string;
    content: string;
    isAnswered: boolean;
    answer?: string;
    answeredAt?: string;
    views: number;
    createdAt: string;
}

// 작성자명 마스킹 함수 (첫 글자만 표시)
const maskAuthor = (name: string): string => {
    if (!name) return '';
    if (name.length === 1) return name;
    if (name.length === 2) return name[0] + '*';
    return name[0] + '*'.repeat(name.length - 1);
};

export const QnaBoard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState<QnaPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [writeModalOpen, setWriteModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [passwordAction, setPasswordAction] = useState<'edit' | 'delete'>('edit');
    const [selectedPost, setSelectedPost] = useState<QnaPost | null>(null);
    const [passwordInput, setPasswordInput] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // 글쓰기 폼 상태
    const [formData, setFormData] = useState({
        author: '',
        email: '',
        phone: '',
        title: '',
        content: '',
        password: '',
        passwordConfirm: ''
    });

    // 수정 폼 상태
    const [editFormData, setEditFormData] = useState({
        title: '',
        content: '',
        password: ''
    });

    // Fetch Posts
    React.useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/qna?timestamp=' + Date.now(), { cache: 'no-store' });
            const data = await res.json();
            if (res.ok && data.posts) {
                setPosts(data.posts.map((p: any) => ({
                    ...p,
                    createdAt: new Date(p.createdAt).toISOString().split('T')[0]
                })));
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    // Pagination
    const ITEMS_PER_PAGE = 10;
    const filteredPosts = useMemo(() => {
        return posts.filter(p =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            maskAuthor(p.author).includes(searchTerm)
        );
    }, [searchTerm, posts]);

    const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
    const currentData = filteredPosts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // 글쓰기 확인 팝업 열기
    const openConfirmModal = () => {
        if (formData.password !== formData.passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!formData.author || !formData.email || !formData.phone || !formData.title || !formData.content || !formData.password) {
            alert('모든 필수 항목을 입력해주세요.');
            return;
        }
        setConfirmModalOpen(true);
    };

    // 글쓰기 제출
    const handleSubmitPost = async () => {
        try {
            const res = await fetch('/api/qna', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    author: formData.author,
                    email: formData.email,
                    phone: formData.phone,
                    title: formData.title,
                    content: formData.content,
                    password: formData.password
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert('문의글이 등록되었습니다.');
                setWriteModalOpen(false);
                setConfirmModalOpen(false);
                setFormData({ author: '', email: '', phone: '', title: '', content: '', password: '', passwordConfirm: '' });
                fetchPosts();
            } else {
                alert(data.error || '등록에 실패했습니다.');
            }
        } catch (error) {
            alert('오류가 발생했습니다.');
        }
    };

    // 비밀번호 모달 열기 (수정/삭제용)
    const openPasswordModal = (post: QnaPost, action: 'edit' | 'delete') => {
        setSelectedPost(post);
        setPasswordAction(action);
        setPasswordInput('');
        setPasswordError('');
        setPasswordModalOpen(true);
    };

    // 비밀번호 검증
    const verifyPassword = async () => {
        if (!selectedPost || !passwordInput) return;
        try {
            const res = await fetch(`/api/qna/${selectedPost.id}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordInput })
            });
            const data = await res.json();
            if (data.valid) {
                if (passwordAction === 'edit') {
                    if (!data.canEdit) {
                        setPasswordError('답변이 완료된 글은 수정할 수 없습니다.');
                        return;
                    }
                    // 수정 모달 열기
                    setEditFormData({
                        title: selectedPost.title,
                        content: selectedPost.content,
                        password: passwordInput
                    });
                    setPasswordModalOpen(false);
                    setEditModalOpen(true);
                } else {
                    if (!data.canDelete) {
                        setPasswordError('답변이 완료된 글은 삭제할 수 없습니다.');
                        return;
                    }
                    // 삭제 실행
                    await executeDelete();
                }
            } else {
                setPasswordError('비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            setPasswordError('오류가 발생했습니다.');
        }
    };

    // 수정 실행
    const executeEdit = async () => {
        if (!selectedPost) return;
        try {
            const res = await fetch(`/api/qna/${selectedPost.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: editFormData.password,
                    title: editFormData.title,
                    content: editFormData.content
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert('수정되었습니다.');
                setEditModalOpen(false);
                setSelectedPost(null);
                fetchPosts();
            } else {
                alert(data.error || '수정에 실패했습니다.');
            }
        } catch (error) {
            alert('오류가 발생했습니다.');
        }
    };

    // 삭제 실행
    const executeDelete = async () => {
        if (!selectedPost || !passwordInput) return;
        try {
            const res = await fetch(`/api/qna/${selectedPost.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordInput })
            });
            const data = await res.json();
            if (res.ok) {
                alert('삭제되었습니다.');
                setPasswordModalOpen(false);
                setSelectedPost(null);
                setPasswordInput('');
                fetchPosts();
            } else {
                setPasswordError(data.error || '삭제에 실패했습니다.');
            }
        } catch (error) {
            setPasswordError('오류가 발생했습니다.');
        }
    };

    return (
        <section id="qna" className="bg-white py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 border border-gray-300 bg-gray-50 text-[11px] font-bold text-gray-500">
                            Q&A Board
                        </span>
                        <div className="h-[1px] w-20 bg-gray-300" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        문의게시판
                    </h2>
                    <p className="text-gray-500 max-w-2xl text-lg font-light leading-relaxed">
                        제품 및 서비스에 대한 문의사항을 남겨주시면 담당자가 답변 드립니다.
                    </p>
                </div>

                {/* Search & Write Button */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-none leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm transition-all hover:border-gray-400"
                            placeholder="제목 또는 작성자 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setWriteModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        글쓰기
                    </button>
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto border-t border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="py-4 px-4 font-medium w-20 text-center">No</th>
                                <th className="py-4 px-4 font-medium">제목</th>
                                <th className="py-4 px-4 font-medium w-24 text-center">작성자</th>
                                <th className="py-4 px-4 font-medium hidden md:table-cell w-28 text-center">등록일</th>
                                <th className="py-4 px-4 font-medium w-20 text-center">답변</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm">
                            {loading ? (
                                <tr><td colSpan={5} className="py-12 text-center text-gray-400">로딩 중...</td></tr>
                            ) : currentData.length > 0 ? (
                                currentData.map((post) => (
                                    <React.Fragment key={post.id}>
                                        <tr
                                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${expandedId === post.id ? 'bg-amber-50' : ''}`}
                                            onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                                        >
                                            <td className="py-4 px-4 text-center text-gray-400 font-mono text-xs">{post.number}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">{post.title}</span>
                                                    {expandedId === post.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center text-gray-500">{maskAuthor(post.author)}</td>
                                            <td className="py-4 px-4 hidden md:table-cell text-center text-gray-400 text-xs font-mono">{post.createdAt}</td>
                                            <td className="py-4 px-4 text-center">
                                                {post.isAnswered ? (
                                                    <span className="inline-flex flex-row items-center gap-1 px-2 py-1 bg-green-100 text-green-600 text-xs font-bold rounded whitespace-nowrap">
                                                        <MessageCircle className="w-3 h-3 flex-shrink-0" />
                                                        <span>완료</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex flex-row items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded whitespace-nowrap">
                                                        <span>대기</span>
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                        {/* 확장된 내용 */}
                                        {expandedId === post.id && (
                                            <tr>
                                                <td colSpan={5} className="bg-gray-50 border-b border-gray-200">
                                                    <div className="p-6">
                                                        {/* 문의 내용 */}
                                                        <div className="mb-6">
                                                            <h4 className="text-sm font-bold text-gray-700 mb-2">문의 내용</h4>
                                                            <div className="bg-white p-4 border border-gray-200 text-gray-600 whitespace-pre-wrap">
                                                                {post.content}
                                                            </div>
                                                        </div>
                                                        {/* 답변 */}
                                                        {post.isAnswered && post.answer && (
                                                            <div className="mb-6">
                                                                <h4 className="text-sm font-bold text-green-600 mb-2 flex items-center gap-2">
                                                                    <MessageCircle className="w-4 h-4" />
                                                                    관리자 답변
                                                                    <span className="text-xs text-gray-400 font-normal ml-2">
                                                                        {post.answeredAt && new Date(post.answeredAt).toLocaleDateString()}
                                                                    </span>
                                                                </h4>
                                                                <div className="bg-green-50 p-4 border border-green-200 text-gray-700 whitespace-pre-wrap">
                                                                    {post.answer}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {/* 수정/삭제 버튼 */}
                                                        {!post.isAnswered ? (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); openPasswordModal(post, 'edit'); }}
                                                                    className="flex items-center gap-1 px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <Pencil className="w-4 h-4" />수정
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); openPasswordModal(post, 'delete'); }}
                                                                    className="flex items-center gap-1 px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />삭제
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-gray-400">답변이 완료된 글은 수정/삭제가 불가능합니다.</p>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="py-12 text-center text-gray-400">등록된 문의글이 없습니다.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center mt-12 gap-4">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 hover:border-gray-400 disabled:opacity-30 transition-colors text-gray-500"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-500 font-mono">
                        Page <span className="text-gray-900 font-bold">{currentPage}</span> of {Math.max(1, totalPages)}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 border border-gray-300 hover:border-gray-400 disabled:opacity-30 transition-colors text-gray-500"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* 글쓰기 모달 */}
            {writeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setWriteModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white border border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">문의글 작성</h3>
                            <button onClick={() => setWriteModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">작성자명 <span className="text-red-500">*</span></label>
                                <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full border border-gray-300 p-3 text-gray-900 focus:outline-none focus:border-amber-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">이메일 <span className="text-red-500">*</span></label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full border border-gray-300 p-3 text-gray-900 focus:outline-none focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">연락처 <span className="text-red-500">*</span></label>
                                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full border border-gray-300 p-3 text-gray-900 focus:outline-none focus:border-amber-500" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">제목 <span className="text-red-500">*</span></label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full border border-gray-300 p-3 text-gray-900 focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">내용 <span className="text-red-500">*</span></label>
                                <textarea rows={5} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full border border-gray-300 p-3 text-gray-900 focus:outline-none focus:border-amber-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">비밀번호 <span className="text-red-500">*</span></label>
                                    <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full border border-gray-300 p-3 text-gray-900 focus:outline-none focus:border-amber-500" placeholder="수정/삭제 시 필요" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">비밀번호 확인 <span className="text-red-500">*</span></label>
                                    <input type="password" value={formData.passwordConfirm} onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                                        className="w-full border border-gray-300 p-3 text-gray-900 focus:outline-none focus:border-amber-500" />
                                </div>
                            </div>
                        </div>
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3">
                            <button onClick={() => setWriteModalOpen(false)} className="px-6 py-2 border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors">취소</button>
                            <button onClick={openConfirmModal} className="px-6 py-2 bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors">등록</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 등록 확인 팝업 */}
            {confirmModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-white border border-gray-200 shadow-2xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">문의글 등록 안내</h3>
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded mb-6">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                <strong className="text-amber-600">※ 알림</strong><br /><br />
                                관리자가 답변을 완료하면 <strong>수정 및 삭제가 불가능</strong>합니다.<br /><br />
                                이에 동의하지 않으시면 글쓰기가 불가능하며, <a href="/contact" className="text-amber-600 underline font-bold">온라인 상담</a>으로 진행해주시길 부탁드립니다.
                            </p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmModalOpen(false)}
                                className="px-6 py-2 border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmitPost}
                                className="px-6 py-2 bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors"
                            >
                                동의 및 등록
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 비밀번호 확인 모달 (수정/삭제용) */}
            {passwordModalOpen && selectedPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPasswordModalOpen(false)} />
                    <div className="relative w-full max-w-sm bg-white border border-gray-200 shadow-2xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">비밀번호 확인</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            게시글 {passwordAction === 'edit' ? '수정' : '삭제'}을 위해 비밀번호를 입력해주세요.
                        </p>
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full border border-gray-300 p-3 text-gray-900 focus:outline-none focus:border-amber-500 mb-2"
                            placeholder="비밀번호"
                        />
                        {passwordError && <p className="text-red-500 text-xs mb-4">{passwordError}</p>}
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setPasswordModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors">취소</button>
                            <button
                                onClick={verifyPassword}
                                className={`px-4 py-2 text-white font-bold transition-colors ${passwordAction === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'}`}
                            >
                                {passwordAction === 'edit' ? '확인' : '삭제'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 수정 모달 */}
            {editModalOpen && selectedPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white border border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">문의글 수정</h3>
                            <button onClick={() => setEditModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">제목 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={editFormData.title}
                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                    className="w-full border border-gray-300 p-3 text-gray-900 focus:outline-none focus:border-amber-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">내용 <span className="text-red-500">*</span></label>
                                <textarea
                                    rows={8}
                                    value={editFormData.content}
                                    onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                                    className="w-full border border-gray-300 p-3 text-gray-900 focus:outline-none focus:border-amber-500"
                                />
                            </div>
                        </div>
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3">
                            <button onClick={() => setEditModalOpen(false)} className="px-6 py-2 border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors">취소</button>
                            <button onClick={executeEdit} className="px-6 py-2 bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors">수정</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
