"use client";

import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, MessageSquare, Mail, Phone, Building, User, Calendar, CheckCircle2, X } from 'lucide-react';

// API Response Types
interface Inquiry {
    id: string;
    name: string;
    company: string | null;
    phone: string;
    email: string;
    interest: string;
    message: string | null;
    productId: string | null;
    isRead: boolean;
    isAnswered: boolean;
    answeredAt: string | null;
    answeredBy: string | null;
    answerNote: string | null;
    createdAt: string;
}

const RESPONDER_STORAGE_KEY = 'hanmir_admin_responder_name';

export default function InquiriesAdminPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInterest, setSelectedInterest] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'answered'>('all');

    // 답변완료 처리 모달
    const [answerModalId, setAnswerModalId] = useState<string | null>(null);
    const [modalResponder, setModalResponder] = useState<string>("");
    const [modalNote, setModalNote] = useState<string>("");
    const [modalSubmitting, setModalSubmitting] = useState(false);

    // 마지막에 입력한 담당자 이름 (localStorage)
    const [rememberedName, setRememberedName] = useState<string>("");

    // Fetch Inquiries
    const fetchInquiries = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (selectedInterest !== "all") queryParams.append("interest", selectedInterest);

            const res = await fetch(`/api/inquiries?${queryParams.toString()}`);
            const data = await res.json();

            if (res.ok) {
                setInquiries(data.inquiries || []);
            }
        } catch (error) {
            console.error("Failed to fetch inquiries", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, [selectedInterest]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = window.localStorage.getItem(RESPONDER_STORAGE_KEY);
            if (saved) setRememberedName(saved);
        }
    }, []);

    const persistResponderName = (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        setRememberedName(trimmed);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(RESPONDER_STORAGE_KEY, trimmed);
        }
    };

    // Handle Delete
    const handleDelete = async (id: string) => {
        if (!confirm("정말 이 문의 내역을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.")) return;

        try {
            const res = await fetch(`/api/inquiries/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert("삭제되었습니다.");
                setInquiries(prev => prev.filter(item => item.id !== id));
            } else {
                throw new Error("Failed to delete");
            }
        } catch (error) {
            console.error("Error deleting inquiry:", error);
            alert("삭제에 실패했습니다.");
        }
    };

    // Handle Read Status Toggle
    const handleToggleRead = async (id: string, currentStatus: boolean) => {
        try {
            setInquiries(prev => prev.map(item =>
                item.id === id ? { ...item, isRead: !currentStatus } : item
            ));

            const res = await fetch(`/api/inquiries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: !currentStatus })
            });

            if (!res.ok) {
                setInquiries(prev => prev.map(item =>
                    item.id === id ? { ...item, isRead: currentStatus } : item
                ));
                throw new Error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("상태 변경에 실패했습니다.");
        }
    };

    // 답변완료 처리 모달 열기
    const openAnswerModal = (id: string) => {
        setAnswerModalId(id);
        setModalResponder(rememberedName);
        setModalNote("");
    };

    const closeAnswerModal = () => {
        setAnswerModalId(null);
        setModalResponder("");
        setModalNote("");
    };

    // 답변완료 처리 확정
    const handleMarkAsAnswered = async () => {
        if (!answerModalId) return;
        const responder = modalResponder.trim();
        if (!responder) {
            alert("처리자 이름을 입력해주세요.");
            return;
        }

        setModalSubmitting(true);
        try {
            const res = await fetch(`/api/inquiries/${answerModalId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'markAsAnswered',
                    answeredBy: responder,
                    answerNote: modalNote.trim() || undefined
                })
            });
            const data = await res.json();
            if (res.ok && data.inquiry) {
                setInquiries(prev => prev.map(item =>
                    item.id === answerModalId ? { ...item, ...data.inquiry } : item
                ));
                persistResponderName(responder);
                closeAnswerModal();
            } else {
                alert(data.error || "답변완료 처리에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error marking as answered:", error);
            alert("처리 중 오류가 발생했습니다.");
        } finally {
            setModalSubmitting(false);
        }
    };

    // 답변완료 취소
    const handleUnmarkAsAnswered = async (id: string) => {
        if (!confirm("답변완료 처리를 취소하시겠습니까?")) return;
        try {
            const res = await fetch(`/api/inquiries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'unmarkAsAnswered' })
            });
            const data = await res.json();
            if (res.ok && data.inquiry) {
                setInquiries(prev => prev.map(item =>
                    item.id === id ? { ...item, ...data.inquiry } : item
                ));
            } else {
                alert(data.error || "취소에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error unmarking:", error);
            alert("처리 중 오류가 발생했습니다.");
        }
    };

    // Filter
    const filteredInquiries = inquiries.filter(inquiry => {
        const matchesSearch =
            inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inquiry.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'pending' && !inquiry.isAnswered) ||
            (statusFilter === 'answered' && inquiry.isAnswered);

        return matchesSearch && matchesStatus;
    });

    const pendingCount = inquiries.filter(i => !i.isAnswered).length;
    const answeredCount = inquiries.filter(i => i.isAnswered).length;

    const handleDownloadExcel = () => {
        if (inquiries.length === 0) {
            alert("다운로드할 데이터가 없습니다.");
            return;
        }

        const headers = [
            "ID", "이름", "업체명", "연락처", "이메일", "관심분야", "문의내용", "제품ID",
            "접수일시", "읽음여부", "답변여부", "답변일시", "답변자", "답변메모"
        ];

        const rows = inquiries.map(inquiry => [
            inquiry.id,
            `"${inquiry.name}"`,
            `"${inquiry.company || ''}"`,
            `"${inquiry.phone}"`,
            `"${inquiry.email}"`,
            `"${inquiry.interest}"`,
            `"${(inquiry.message || '').replace(/"/g, '""')}"`,
            inquiry.productId || '',
            new Date(inquiry.createdAt).toLocaleString(),
            inquiry.isRead ? "읽음" : "안읽음",
            inquiry.isAnswered ? "답변완료" : "미답변",
            inquiry.answeredAt ? new Date(inquiry.answeredAt).toLocaleString() : '',
            `"${inquiry.answeredBy || ''}"`,
            `"${(inquiry.answerNote || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob(["﻿" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `hanmir_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">문의 내역 관리</h2>
                    <p className="text-zinc-400 text-sm">
                        총 {inquiries.length}건
                        <span className="text-amber-400 font-bold ml-2">미답변 {pendingCount}건</span>
                        <span className="text-green-400 font-bold ml-2">답변완료 {answeredCount}건</span>
                    </p>
                </div>
                <button
                    onClick={handleDownloadExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-sm transition-colors text-sm"
                >
                    <Download className="w-4 h-4" />
                    엑셀 다운로드
                </button>
            </div>

            {/* Filter & Search */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="이름, 업체명, 이메일 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black border border-zinc-800 text-white pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors placeholder-zinc-600 text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 min-w-[200px]">
                    <Filter className="w-4 h-4 text-zinc-500" />
                    <select
                        value={selectedInterest}
                        onChange={(e) => setSelectedInterest(e.target.value)}
                        className="w-full bg-black border border-zinc-800 text-white p-2 focus:outline-none focus:border-blue-500 text-sm"
                    >
                        <option value="all">모든 관심 분야</option>
                        <option value="자동차 배터리">자동차 배터리</option>
                        <option value="선박">선박</option>
                        <option value="건축 및 중공업">건축 및 중공업</option>
                        <option value="기타 특수 목적">기타 특수 목적</option>
                    </select>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-3 py-2 text-xs font-bold transition-colors ${statusFilter === 'all' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                    >
                        전체
                    </button>
                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`px-3 py-2 text-xs font-bold transition-colors ${statusFilter === 'pending' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                    >
                        미답변 ({pendingCount})
                    </button>
                    <button
                        onClick={() => setStatusFilter('answered')}
                        className={`px-3 py-2 text-xs font-bold transition-colors ${statusFilter === 'answered' ? 'bg-green-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                    >
                        완료 ({answeredCount})
                    </button>
                </div>
            </div>

            {/* Inquiries List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-20 text-zinc-500">데이터를 불러오는 중...</div>
                ) : filteredInquiries.length > 0 ? (
                    filteredInquiries.map((inquiry) => (
                        <div
                            key={inquiry.id}
                            className={`bg-zinc-900 border p-6 transition-colors ${inquiry.isAnswered
                                ? 'border-green-900/50 opacity-80'
                                : inquiry.isRead
                                    ? 'border-zinc-800'
                                    : 'border-blue-900/50 hover:border-blue-800'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {/* 답변 상태 뱃지 */}
                                    {inquiry.isAnswered ? (
                                        <span className="px-2 py-1 text-[10px] font-bold rounded border bg-green-600 text-white border-green-500 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" />
                                            답변완료
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleToggleRead(inquiry.id, inquiry.isRead)}
                                            className={`px-2 py-1 text-[10px] font-bold rounded border cursor-pointer transition-all hover:scale-105 ${inquiry.isRead
                                                ? 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                                                : 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20 hover:bg-blue-500'
                                                }`}
                                            title={inquiry.isRead ? "읽지 않음으로 표시" : "읽음으로 표시"}
                                        >
                                            {inquiry.isRead ? '확인됨 (미답변)' : '새 문의'}
                                        </button>
                                    )}
                                    <span className="text-sm text-zinc-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(inquiry.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {inquiry.isAnswered ? (
                                        <button
                                            onClick={() => handleUnmarkAsAnswered(inquiry.id)}
                                            className="text-xs text-zinc-400 hover:text-amber-400 underline transition-colors"
                                        >
                                            답변완료 취소
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => openAnswerModal(inquiry.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded transition-colors"
                                        >
                                            <CheckCircle2 className="w-3 h-3" />
                                            답변완료 처리
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(inquiry.id)}
                                        className="text-xs text-zinc-400 hover:text-red-400 underline transition-colors"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-white font-bold text-lg">
                                        <User className="w-4 h-4 text-zinc-500" />
                                        {inquiry.name}
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                        <Building className="w-4 h-4 text-zinc-600" />
                                        {inquiry.company || '업체명 미기입'}
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-zinc-300">
                                        <Phone className="w-4 h-4 text-zinc-600" />
                                        {inquiry.phone}
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-300">
                                        <Mail className="w-4 h-4 text-zinc-600" />
                                        <a href={`mailto:${inquiry.email}`} className="hover:text-blue-400 transition-colors">
                                            {inquiry.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="bg-black/50 p-4 rounded border border-zinc-800/50">
                                    <h4 className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                                        관심 분야: {inquiry.interest}
                                    </h4>
                                    <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">
                                        {inquiry.message || '문의 내용이 없습니다.'}
                                    </p>
                                </div>
                            </div>

                            {/* 답변완료 정보 표시 */}
                            {inquiry.isAnswered && (
                                <div className="mt-4 p-3 bg-green-950/40 border border-green-900/40 rounded text-sm">
                                    <div className="flex items-center gap-2 text-green-300 font-bold">
                                        <CheckCircle2 className="w-4 h-4" />
                                        {inquiry.answeredBy && <span>{inquiry.answeredBy}님이</span>}
                                        {inquiry.answeredAt && (
                                            <span className="text-green-400/80 font-normal">
                                                {new Date(inquiry.answeredAt).toLocaleString()}에 처리
                                            </span>
                                        )}
                                    </div>
                                    {inquiry.answerNote && (
                                        <p className="mt-1 text-zinc-300 whitespace-pre-wrap pl-6">
                                            메모: {inquiry.answerNote}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="bg-zinc-900 border border-zinc-800 p-12 text-center">
                        <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-1">문의 내역이 없습니다</h3>
                        <p className="text-zinc-500 text-sm">조건에 맞는 문의가 없습니다.</p>
                    </div>
                )}
            </div>

            {/* 답변완료 처리 모달 */}
            {answerModalId && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                    onClick={closeAnswerModal}
                >
                    <div
                        className="bg-zinc-900 border border-zinc-700 max-w-md w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                답변완료 처리
                            </h3>
                            <button
                                onClick={closeAnswerModal}
                                className="text-zinc-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-300 mb-1">
                                    처리자 이름 <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={modalResponder}
                                    onChange={(e) => setModalResponder(e.target.value)}
                                    className="w-full bg-black border border-zinc-700 text-white p-2 focus:outline-none focus:border-green-500 text-sm"
                                    placeholder="예: 양호준"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-300 mb-1">
                                    회신 방법 / 메모 <span className="text-zinc-500">(선택)</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={modalNote}
                                    onChange={(e) => setModalNote(e.target.value)}
                                    className="w-full bg-black border border-zinc-700 text-white p-2 focus:outline-none focus:border-green-500 text-sm resize-none"
                                    placeholder="예: 전화로 회신 완료"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={closeAnswerModal}
                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleMarkAsAnswered}
                                disabled={modalSubmitting}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold transition-colors disabled:opacity-50"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                {modalSubmitting ? '처리 중...' : '확정'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
