"use client";

import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, MessageSquare, Mail, Phone, Building, User, Calendar, ExternalLink } from 'lucide-react';

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
    createdAt: string;
}

export default function InquiriesAdminPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInterest, setSelectedInterest] = useState<string>("all");

    // Fetch Inquiries
    const fetchInquiries = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (selectedInterest !== "all") queryParams.append("interest", selectedInterest);

            // 실제 API 연동
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

    // Handle Delete
    const handleDelete = async (id: string) => {
        if (!confirm("정말 이 문의 내역을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.")) return;

        try {
            const res = await fetch(`/api/inquiries/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert("삭제되었습니다.");
                // 즉시 목록에서 제거 (Optimistic UI)
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
            // Optimistic UI Update first
            setInquiries(prev => prev.map(item =>
                item.id === id ? { ...item, isRead: !currentStatus } : item
            ));

            const res = await fetch(`/api/inquiries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: !currentStatus })
            });

            if (!res.ok) {
                // Revert on failure
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

    // Filter by Search Term
    const filteredInquiries = inquiries.filter(inquiry =>
        inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDownloadExcel = () => {
        if (inquiries.length === 0) {
            alert("다운로드할 데이터가 없습니다.");
            return;
        }

        // CSV Header
        const headers = ["ID", "이름", "업체명", "연락처", "이메일", "관심분야", "문의내용", "제품ID", "접수일시", "읽음여부"];

        // CSV Rows
        const rows = inquiries.map(inquiry => [
            inquiry.id,
            `"${inquiry.name}"`, // Escape quotes
            `"${inquiry.company || ''}"`,
            `"${inquiry.phone}"`,
            `"${inquiry.email}"`,
            `"${inquiry.interest}"`,
            `"${(inquiry.message || '').replace(/"/g, '""')}"`, // Extract message and escape double quotes
            inquiry.productId || '',
            new Date(inquiry.createdAt).toLocaleString(),
            inquiry.isRead ? "읽음" : "안읽음"
        ]);

        // Combine
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create Blob and Download
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
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
                    <p className="text-zinc-400 text-sm">웹사이트를 통해 접수된 고객 문의를 확인하고 관리합니다.</p>
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
            </div>

            {/* Inquiries List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-20 text-zinc-500">데이터를 불러오는 중...</div>
                ) : filteredInquiries.length > 0 ? (
                    filteredInquiries.map((inquiry) => (
                        <div key={inquiry.id} className={`bg-zinc-900 border p-6 transition-colors ${inquiry.isRead ? 'border-zinc-800 opacity-75' : 'border-blue-900/50 hover:border-blue-800'
                            }`}>
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleToggleRead(inquiry.id, inquiry.isRead)}
                                        className={`px-2 py-1 text-[10px] font-bold rounded border cursor-pointer transition-all hover:scale-105 ${inquiry.isRead
                                            ? 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:bg-zinc-700'
                                            : 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20 hover:bg-blue-500'
                                            }`}
                                        title={inquiry.isRead ? "읽지 않음으로 표시" : "읽음으로 표시"}
                                    >
                                        {inquiry.isRead ? '읽음' : '새 문의'}
                                    </button>
                                    <span className="text-sm text-zinc-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(inquiry.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
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
                        </div>
                    ))
                ) : (
                    <div className="bg-zinc-900 border border-zinc-800 p-12 text-center">
                        <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-1">문의 내역이 없습니다</h3>
                        <p className="text-zinc-500 text-sm">아직 접수된 고객 문의가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

