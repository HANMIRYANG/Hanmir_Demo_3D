"use client";

import React, { useState } from 'react';
import { Search, Plus, FileText, Trash2, Edit, Download, X, Upload } from 'lucide-react';

export default function ResourcesAdminPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dummy Data (나중에 API 연동)
    const [resources, setResources] = useState([
        { id: '1', title: 'Hanmir High-Temp Coating Spec Sheet v2.0', category: 'Catalogue', date: '2024-01-15', format: 'PDF', size: '2.4 MB' },
        { id: '2', title: 'Klenze K200 Application Guide', category: 'Manual', date: '2024-01-20', format: 'DOCX', size: '1.2 MB' },
        { id: '3', title: 'Safety Data Sheet (MSDS) - Series H', category: 'Certificate', date: '2024-02-01', format: 'PDF', size: '0.8 MB' },
    ]);

    const handleCreate = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">기술자료 관리</h2>
                    <p className="text-zinc-400 text-sm">제품 사양서, 인증서, 매뉴얼 등 기술 자료를 등록하고 관리합니다.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-sm transition-colors text-sm"
                >
                    <Plus className="w-4 h-4" />
                    새 자료 등록
                </button>
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
            <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
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
                        {resources.map((res) => (
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
                                    {res.format} <span className="text-zinc-600">({res.size})</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-zinc-500">
                                    {res.date}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white" title="파일 다운로드">
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-zinc-700 rounded text-zinc-400 hover:text-blue-400" title="수정">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-400" title="삭제">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit Modal */}
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

                        <form className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">제목</label>
                                <input type="text" className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none" placeholder="자료명을 입력하세요" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">카테고리</label>
                                <select className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none">
                                    <option>Catalogue</option>
                                    <option>Manual</option>
                                    <option>Datasheet</option>
                                    <option>Certificate</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">파일 첨부</label>
                                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-zinc-500 transition-colors cursor-pointer bg-zinc-950">
                                    <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                                    <p className="text-sm text-zinc-400">클릭하여 파일을 선택하거나 이곳으로 드래그하세요</p>
                                    <p className="text-xs text-zinc-600 mt-1">PDF, DOCX, XLSX (최대 10MB)</p>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-zinc-800 text-zinc-300 font-medium hover:bg-zinc-700 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors"
                                >
                                    등록하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
