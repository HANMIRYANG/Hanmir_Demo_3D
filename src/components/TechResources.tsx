"use client";

import React, { useState, useMemo } from "react";
import { Download, Search, Share2, Check, X, FileText, ChevronLeft, ChevronRight, File } from "lucide-react";

// Types
type ResourceType = "Catalogue" | "Manual" | "Datasheet" | "Certificate";
type FileFormat = "PDF" | "DOCX" | "XLSX" | "JPG";

interface Resource {
    id: string;
    number: number;
    category: ResourceType;
    title: string;
    date: string;
    format: FileFormat;
    size: string;
}



export const TechResources: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [sharedResource, setSharedResource] = useState<Resource | null>(null);
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Resources
    React.useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await fetch('/api/admin/resources?timestamp=' + Date.now(), { cache: 'no-store' });
                const data = await res.json();

                if (res.ok && data.resources) {
                    const mappedResources = data.resources.map((r: any) => ({
                        id: r.id,
                        number: r.number,
                        category: r.category as ResourceType,
                        title: r.title,
                        date: new Date(r.createdAt).toISOString().split('T')[0],
                        format: r.format as FileFormat,
                        size: r.fileSize
                    }));
                    setResources(mappedResources);
                }
            } catch (error) {
                console.error("Failed to fetch resources:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    // Pagination
    const ITEMS_PER_PAGE = 10;

    // Filtering
    const filteredResources = useMemo(() => {
        return resources.filter(r =>
            r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, resources]);

    const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
    const currentData = filteredResources.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Handlers
    const toggleSelectAll = () => {
        if (selectedItems.size === currentData.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(currentData.map(r => r.id)));
        }
    };

    const toggleItem = (id: string) => {
        const newSet = new Set(selectedItems);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedItems(newSet);
    };

    const handleShare = (resource: Resource) => {
        setSharedResource(resource);
        setShareModalOpen(true);
    };

    const handleBulkDownload = () => {
        alert(`Downloading ${selectedItems.size} files...`);
    };

    return (
        <section id="resources" className="bg-black py-24 relative overflow-hidden">
            {/* Background Elements to match Hero */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 border border-zinc-700 bg-black/50 backdrop-blur text-[11px] font-bold text-zinc-300">
                            Technical Resources
                        </span>
                        <div className="h-[1px] w-20 bg-zinc-700" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        기술자료실
                    </h2>
                    <p className="text-zinc-400 max-w-2xl text-lg font-light leading-relaxed">
                        한미르의 최신 기술 문서, 인증서, 매뉴얼을 확인하고 다운로드하실 수 있습니다.
                        필요한 자료를 검색하여 업무에 활용하세요.
                    </p>
                </div>

                {/* Search & Actions Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    {/* Search */}
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-zinc-800 rounded-none leading-5 bg-black/50 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all hover:border-zinc-700"
                            placeholder="자료명 또는 키워드 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Bulk Download Button (Conditional) */}
                    <div className={`transition-all duration-300 ${selectedItems.size > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                        <button
                            onClick={handleBulkDownload}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            선택 다운로드 ({selectedItems.size})
                        </button>
                    </div>
                </div>

                {/* Table Structure */}
                <div className="w-full overflow-x-auto border-t border-zinc-800">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                                <th className="py-4 pl-4 w-12 text-center">
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={toggleSelectAll}
                                            className={`w-4 h-4 border transition-colors flex items-center justify-center ${selectedItems.size === currentData.length && currentData.length > 0
                                                ? "bg-blue-500 border-blue-500 text-white"
                                                : "border-zinc-700 hover:border-zinc-500"
                                                }`}
                                        >
                                            {selectedItems.size === currentData.length && currentData.length > 0 && <Check className="w-3 h-3" />}
                                        </button>
                                    </div>
                                </th>
                                <th className="py-4 px-4 font-medium hidden md:table-cell w-24">No</th>
                                <th className="py-4 px-4 font-medium w-32">Category</th>
                                <th className="py-4 px-4 font-medium">Title</th>
                                <th className="py-4 px-4 font-medium hidden md:table-cell w-32">Format</th>
                                <th className="py-4 px-4 font-medium hidden md:table-cell w-32">Date</th>
                                <th className="py-4 px-4 font-medium text-right w-32">Manage</th>
                            </tr>
                        </thead>
                        <tbody className="text-zinc-300 text-sm">
                            {currentData.length > 0 ? (
                                currentData.map((resource) => (
                                    <tr
                                        key={resource.id}
                                        className={`border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors group ${selectedItems.has(resource.id) ? "bg-zinc-900/60" : ""
                                            }`}
                                    >
                                        <td className="py-4 pl-4 text-center">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => toggleItem(resource.id)}
                                                    className={`w-4 h-4 border transition-colors flex items-center justify-center ${selectedItems.has(resource.id)
                                                        ? "bg-blue-500 border-blue-500 text-white"
                                                        : "border-zinc-700 hover:border-zinc-500"
                                                        }`}
                                                >
                                                    {selectedItems.has(resource.id) && <Check className="w-3 h-3" />}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 hidden md:table-cell text-zinc-500 font-mono text-xs">{resource.number}</td>
                                        <td className="py-4 px-4">
                                            <span className="inline-block px-2 py-1 text-[10px] font-bold border border-zinc-700 text-zinc-400 rounded-sm">
                                                {resource.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 font-medium group-hover:text-blue-400 transition-colors cursor-pointer">
                                            {resource.title}
                                        </td>
                                        <td className="py-4 px-4 hidden md:table-cell">
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                {resource.format === "PDF" ? <FileText className="w-3 h-3" /> : <File className="w-3 h-3" />}
                                                <span className="text-xs">{resource.format}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 hidden md:table-cell text-zinc-500 text-xs font-mono">{resource.date}</td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleShare(resource)}
                                                    className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                                                    title="Share"
                                                >
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-zinc-600">
                                        검색 결과가 없습니다.
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
                        className="p-2 border border-zinc-800 hover:border-zinc-600 disabled:opacity-30 disabled:hover:border-zinc-800 transition-colors text-zinc-400"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-zinc-500 font-mono">
                        Page <span className="text-white">{currentPage}</span> of {Math.max(1, totalPages)}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-zinc-800 hover:border-zinc-600 disabled:opacity-30 disabled:hover:border-zinc-800 transition-colors text-zinc-400"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

            </div>

            {/* Share Modal */}
            {shareModalOpen && sharedResource && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShareModalOpen(false)}
                    />
                    <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShareModalOpen(false)}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h3 className="text-2xl font-bold text-white mb-8">메일 공유</h3>

                        <div className="space-y-6">
                            <div className="bg-zinc-800/50 p-4 border border-zinc-700/50 text-sm text-zinc-300">
                                공유할 기술자료의 파일형태와 이메일 정보를 입력해주시기 바랍니다.
                            </div>

                            <div className="grid grid-cols-[100px_1fr] gap-y-6 items-center text-sm">
                                <div className="font-bold text-zinc-400">유형</div>
                                <div className="text-white">{sharedResource.category}</div>

                                <div className="font-bold text-zinc-400">자료명</div>
                                <div className="text-white font-medium">{sharedResource.title}</div>

                                <div className="font-bold text-zinc-400">파일형태 <span className="text-orange-500">*</span></div>
                                <div className="flex gap-4">
                                    {["PDF", "JPG"].map(ft => (
                                        <label key={ft} className="flex items-center gap-2 cursor-pointer group">
                                            <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${sharedResource.format === ft || (ft === "PDF" && sharedResource.format !== "JPG")
                                                ? "bg-blue-500 border-blue-500"
                                                : "border-zinc-600 group-hover:border-zinc-400"
                                                }`}>
                                                {(sharedResource.format === ft || (ft === "PDF" && sharedResource.format !== "JPG")) && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className="text-zinc-300">{ft}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="font-bold text-zinc-400 self-start pt-3">
                                    이메일 <span className="text-orange-500">*</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Email User"
                                            className="w-full bg-black border border-zinc-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none placeholder-zinc-700"
                                        />
                                        <span className="text-zinc-500 self-center">@</span>
                                        <input
                                            type="text"
                                            placeholder="Domain"
                                            className="w-full bg-black border border-zinc-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none placeholder-zinc-700"
                                        />
                                    </div>
                                    <select className="w-full bg-black border border-zinc-700 px-3 py-2 text-zinc-400 focus:border-blue-500 focus:outline-none">
                                        <option>직접입력</option>
                                        <option>gmail.com</option>
                                        <option>naver.com</option>
                                    </select>
                                </div>
                            </div>

                            <button className="w-full bg-white text-black font-bold py-4 mt-4 hover:bg-zinc-200 transition-colors">
                                공유하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
