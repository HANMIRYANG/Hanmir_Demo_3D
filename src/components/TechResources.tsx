"use client";

import React, { useState, useMemo } from "react";
import { Download, Search, Share2, Check, X, FileText, ChevronLeft, ChevronRight, File } from "lucide-react";
import { useTranslations } from "next-intl";

// Types
type ResourceType = "DATASHEET" | "카탈로그" | "MSDS" | "공인성적서" | "인증서" | "도장사양서" | "기타";
type FileFormat = "PDF" | "DOCX" | "XLSX" | "JPG" | "ZIP" | "HWP" | "PPT" | "PPTX";

interface Resource {
    id: string;
    number: number;
    category: ResourceType | string; // 기존 데이터 호환을 위해 string 허용
    title: string;
    date: string;
    format: FileFormat;
    size: string;
    filePath: string;
    fileName: string;
}

// 카테고리 목록
const CATEGORIES: (ResourceType | "전체")[] = ["전체", "DATASHEET", "카탈로그", "MSDS", "공인성적서", "인증서", "도장사양서"];

export const TechResources: React.FC = () => {
    const t = useTranslations();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<ResourceType | "전체">("전체");
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [sharedResource, setSharedResource] = useState<Resource | null>(null);
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

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
                        format: r.format,
                        size: r.fileSize,
                        filePath: r.filePath,
                        fileName: r.fileName || r.title // fileName이 없을 경우 title 사용 (fallback)
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

    // 카테고리별 카운트 계산
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { "전체": resources.length };
        CATEGORIES.forEach(cat => {
            if (cat !== "전체") {
                counts[cat] = resources.filter(r => r.category === cat).length;
            }
        });
        return counts;
    }, [resources]);

    // Filtering (카테고리 + 검색어)
    const filteredResources = useMemo(() => {
        return resources.filter(r => {
            const matchesCategory = selectedCategory === "전체" || r.category === selectedCategory;
            const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.category?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, selectedCategory, resources]);

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

    const handleBulkDownload = async () => {
        if (selectedItems.size === 0) return;

        try {
            setDownloading(true);
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();

            const selectedResources = resources.filter(r => selectedItems.has(r.id));
            const folder = zip.folder("hanmir_resources");

            // 파일 다운로드 및 ZIP 추가
            const promises = selectedResources.map(async (resource) => {
                try {
                    const response = await fetch(resource.filePath);
                    if (!response.ok) throw new Error(`Failed to fetch ${resource.fileName}`);
                    const blob = await response.blob();

                    // 파일명 결정 (resource.fileName 우선, 없으면 title + format)
                    let fileName = resource.fileName;
                    if (!fileName) {
                        const ext = resource.format.toLowerCase();
                        fileName = `${resource.title}.${ext}`;
                    }

                    folder?.file(fileName, blob);
                } catch (err) {
                    console.error(`Error downloading ${resource.title}:`, err);
                }
            });

            await Promise.all(promises);

            // ZIP 생성 및 다운로드
            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = `hanmir_resources_${new Date().toISOString().split('T')[0]}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            // 선택 해제
            setSelectedItems(new Set());
            alert(`${selectedResources.length}개 파일 다운로드가 완료되었습니다.`);
        } catch (error) {
            console.error("Bulk download failed:", error);
            alert("일괄 다운로드 중 오류가 발생했습니다.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <section id="resources" className="bg-white py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 border border-gray-300 bg-gray-50 text-[11px] font-bold text-gray-500">
                            {t('resources.tagline')}
                        </span>
                        <div className="h-[1px] w-20 bg-gray-300" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {t('resources.title')}
                    </h2>
                    <p className="text-gray-500 max-w-2xl text-lg font-light leading-relaxed">
                        {t('resources.description')}
                    </p>
                </div>

                {/* Search & Actions Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    {/* Search */}
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-none leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm transition-all hover:border-gray-400"
                            placeholder={t('resources.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Bulk Download Button (Conditional) */}
                    <div className={`transition-all duration-300 ${selectedItems.size > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                        <button
                            onClick={handleBulkDownload}
                            disabled={downloading}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-70"
                        >
                            <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
                            {downloading ? t('resources.preparing') : `${t('resources.bulkDownload')} (${selectedItems.size})`}
                        </button>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => {
                                setSelectedCategory(category);
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${selectedCategory === category
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                }`}
                        >
                            {category} ({categoryCounts[category] || 0})
                        </button>
                    ))}
                </div>

                {/* Table Structure */}
                <div className="w-full overflow-x-auto border-t border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="py-4 pl-4 w-12 text-center">
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={toggleSelectAll}
                                            className={`w-4 h-4 border transition-colors flex items-center justify-center ${selectedItems.size === currentData.length && currentData.length > 0
                                                ? "bg-amber-500 border-amber-500 text-white"
                                                : "border-gray-300 hover:border-gray-400"
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
                        <tbody className="text-gray-700 text-sm">
                            {currentData.length > 0 ? (
                                currentData.map((resource) => (
                                    <tr
                                        key={resource.id}
                                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors group ${selectedItems.has(resource.id) ? "bg-amber-50" : ""
                                            }`}
                                    >
                                        <td className="py-4 pl-4 text-center">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => toggleItem(resource.id)}
                                                    className={`w-4 h-4 border transition-colors flex items-center justify-center ${selectedItems.has(resource.id)
                                                        ? "bg-amber-500 border-amber-500 text-white"
                                                        : "border-gray-300 hover:border-gray-400"
                                                        }`}
                                                >
                                                    {selectedItems.has(resource.id) && <Check className="w-3 h-3" />}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 hidden md:table-cell text-gray-400 font-mono text-xs">{resource.number}</td>
                                        <td className="py-4 px-4">
                                            <span className="inline-block px-2 py-1 text-[10px] font-bold border border-gray-300 text-gray-500 rounded-sm">
                                                {resource.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 font-medium text-gray-900 group-hover:text-amber-600 transition-colors cursor-pointer">
                                            {resource.title}
                                        </td>
                                        <td className="py-4 px-4 hidden md:table-cell">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                {resource.format === "PDF" ? <FileText className="w-3 h-3" /> : <File className="w-3 h-3" />}
                                                <span className="text-xs">{resource.format}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 hidden md:table-cell text-gray-400 text-xs font-mono">{resource.date}</td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <a
                                                    href={resource.filePath}
                                                    download={resource.fileName}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900 inline-flex items-center justify-center"
                                                    title="Download"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleShare(resource)}
                                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
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
                                    <td colSpan={7} className="py-12 text-center text-gray-400">
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
                        className="p-2 border border-gray-300 hover:border-gray-400 disabled:opacity-30 disabled:hover:border-gray-300 transition-colors text-gray-500"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-500 font-mono">
                        Page <span className="text-gray-900 font-bold">{currentPage}</span> of {Math.max(1, totalPages)}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 hover:border-gray-400 disabled:opacity-30 disabled:hover:border-gray-300 transition-colors text-gray-500"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

            </div>

            {/* Share Modal */}
            {shareModalOpen && sharedResource && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShareModalOpen(false)}
                    />
                    <div className="relative w-full max-w-lg bg-white border border-gray-200 shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShareModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h3 className="text-2xl font-bold text-gray-900 mb-8">메일 공유</h3>

                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 border border-gray-200 text-sm text-gray-600">
                                공유할 기술자료의 파일형태와 이메일 정보를 입력해주시기 바랍니다.
                            </div>

                            <div className="grid grid-cols-[100px_1fr] gap-y-6 items-center text-sm">
                                <div className="font-bold text-gray-500">유형</div>
                                <div className="text-gray-900">{sharedResource.category}</div>

                                <div className="font-bold text-gray-500">자료명</div>
                                <div className="text-gray-900 font-medium">{sharedResource.title}</div>

                                <div className="font-bold text-gray-500">파일형태 <span className="text-amber-500">*</span></div>
                                <div className="flex gap-4">
                                    {["PDF", "JPG"].map(ft => (
                                        <label key={ft} className="flex items-center gap-2 cursor-pointer group">
                                            <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${sharedResource.format === ft || (ft === "PDF" && sharedResource.format !== "JPG")
                                                ? "bg-amber-500 border-amber-500"
                                                : "border-gray-300 group-hover:border-gray-400"
                                                }`}>
                                                {(sharedResource.format === ft || (ft === "PDF" && sharedResource.format !== "JPG")) && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className="text-gray-700">{ft}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="font-bold text-gray-500 self-start pt-3">
                                    이메일 <span className="text-amber-500">*</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Email User"
                                            className="w-full bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none placeholder-gray-400"
                                        />
                                        <span className="text-gray-400 self-center">@</span>
                                        <input
                                            type="text"
                                            placeholder="Domain"
                                            className="w-full bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none placeholder-gray-400"
                                        />
                                    </div>
                                    <select className="w-full bg-white border border-gray-300 px-3 py-2 text-gray-600 focus:border-amber-500 focus:outline-none">
                                        <option>직접입력</option>
                                        <option>gmail.com</option>
                                        <option>naver.com</option>
                                    </select>
                                </div>
                            </div>

                            <button className="w-full bg-amber-500 text-white font-bold py-4 mt-4 hover:bg-amber-600 transition-colors">
                                공유하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
