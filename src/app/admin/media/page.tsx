"use client";

import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit, ExternalLink, X, Image as ImageIcon } from 'lucide-react';

export default function MediaAdminPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dummy Data
    const [mediaItems, setMediaItems] = useState([
        { id: '1', title: '2025년 중소벤처기업부 기술혁신 장관상 수상', category: 'HANMIR NEWS', date: '2025.01.05', link: '#' },
        { id: '2', title: '신규 방열 코팅 솔루션 "HM-2025" 런칭 세미나', category: 'HANMIR NEWS', date: '2024.12.20', link: '#' },
        { id: '3', title: '[인터뷰] 한미르(주) 대표이사, "친환경 도료가 미래다"', category: 'HANMIR NOW', date: '2024.10.02', link: '#' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">미디어 관리</h2>
                    <p className="text-zinc-400 text-sm">뉴스, 홍보자료, 보도자료 등 미디어 콘텐츠를 관리합니다.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-sm transition-colors text-sm"
                >
                    <Plus className="w-4 h-4" />
                    새 콘텐츠 등록
                </button>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaItems.map((item) => (
                    <div key={item.id} className="group bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-zinc-600 transition-colors">
                        <div className="aspect-video bg-zinc-800 relative">
                            {/* Placeholder Image */}
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                                <ImageIcon className="w-8 h-8" />
                            </div>

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button className="p-2 bg-white text-black rounded-full hover:bg-zinc-200">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 border border-zinc-700 rounded text-zinc-400">
                                    {item.category}
                                </span>
                                <span className="text-xs text-zinc-500">{item.date}</span>
                            </div>
                            <h3 className="text-white font-medium line-clamp-2 h-12 mb-4">
                                {item.title}
                            </h3>
                            <a href={item.link} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                원문 보기 <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 shadow-2xl p-6 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-6">미디어 콘텐츠 등록</h3>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">제목</label>
                                <input type="text" className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none" placeholder="제목을 입력하세요" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">카테고리</label>
                                <select className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none">
                                    <option>HANMIR NEWS</option>
                                    <option>HANMIR NOW</option>
                                    <option>홍보자료실</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">썸네일 이미지 URL</label>
                                <div className="flex gap-2">
                                    <input type="text" className="full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none flex-1" placeholder="https://..." />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">링크 URL</label>
                                <input type="text" className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-blue-500 focus:outline-none" placeholder="연결될 페이지 주소" />
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
