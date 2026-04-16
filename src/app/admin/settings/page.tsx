"use client";

import { useState, useEffect } from "react";
import { Upload, Save, Link as LinkIcon, FileText, Loader2, Check, ExternalLink } from "lucide-react";
import { upload } from "@vercel/blob/client";

// ============================================================================
// 관리자 사이트 설정 페이지
// ============================================================================

interface Setting {
    id?: string;
    key: string;
    value: string;
    label?: string;
}

export default function SettingsPage() {
    const [brochureUrl, setBrochureUrl] = useState("");
    const [originalUrl, setOriginalUrl] = useState("");

    // 메인 팝업 설정 상태
    const [popupConfig, setPopupConfig] = useState({
        enabled: false,
        title: "",
        content: "",
        imageUrl: "",
        linkUrl: ""
    });
    const [originalPopupConfig, setOriginalPopupConfig] = useState({
        enabled: false,
        title: "",
        content: "",
        imageUrl: "",
        linkUrl: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [popupUploading, setPopupUploading] = useState(false);

    // 설정 불러오기
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [brochureRes, popupRes] = await Promise.all([
                    fetch("/api/admin/settings?key=company_brochure_url"),
                    fetch("/api/admin/settings?key=main_popup_config")
                ]);

                if (brochureRes.ok) {
                    const data = await brochureRes.json();
                    if (data?.value) {
                        setBrochureUrl(data.value);
                        setOriginalUrl(data.value);
                    }
                }

                if (popupRes.ok) {
                    const data = await popupRes.json();
                    if (data?.value) {
                        const config = JSON.parse(data.value);
                        setPopupConfig(config);
                        setOriginalPopupConfig(config);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // 설정 저장
    const handleSave = async (key: string, value: string, label: string) => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key, value, label })
            });

            if (res.ok) {
                if (key === "company_brochure_url") {
                    setOriginalUrl(value);
                } else if (key === "main_popup_config") {
                    setOriginalPopupConfig(JSON.parse(value));
                }
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (error) {
            console.error("Failed to save settings:", error);
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    };

    // 파일 업로드 (범용 - 클라이언트 사이드 업로드 지원)
    const uploadFile = async (file: File, type: 'image' | 'attachment') => {
        try {
            // Vercel 환경인 경우 클라이언트 직접 업로드 시도 (서버 용량 제한 4.5MB 우회용)
            // .env에 BLOB_READ_WRITE_TOKEN이 있거나 Vercel 배포 환경인지 확인하는 로직은 라이브러리가 내부적으로 처리하거나 API 응답으로 판단

            // 1. 클라이언트 직접 업로드 시도
            try {
                const blob = await upload(file.name, file, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });
                return blob.url;
            } catch (clientUploadError: any) {
                console.warn("Client upload failed or not supported in this env, falling back to FormData:", clientUploadError);

                // 2. FormData Fallback (로컬 개발 환경 등)
                const formData = new FormData();
                formData.append("file", file);
                formData.append("type", type);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (res.ok) {
                    const data = await res.json();
                    return data.url;
                } else {
                    // 에러 메시지 추출 시도
                    let errorMsg = "업로드 실패";
                    try {
                        const errorData = await res.json();
                        errorMsg = errorData.error || errorMsg;
                    } catch (e) {
                        // 413 등 HTML 에러 대응
                        if (res.status === 413) errorMsg = "파일 용량이 너무 큽니다. (분산 업로드 실패)";
                    }
                    throw new Error(errorMsg);
                }
            }
        } catch (error: any) {
            console.error("Upload error:", error);
            alert(error.message || "업로드 중 오류가 발생했습니다.");
            return null;
        }
    };

    const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== "application/pdf") {
            alert("PDF 파일만 업로드 가능합니다.");
            return;
        }
        setUploading(true);
        const url = await uploadFile(file, 'attachment');
        if (url) setBrochureUrl(url);
        setUploading(false);
    };

    const handlePopupImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드 가능합니다.");
            return;
        }
        setPopupUploading(true);
        const url = await uploadFile(file, 'image');
        if (url) setPopupConfig(prev => ({ ...prev, imageUrl: url }));
        setPopupUploading(false);
    };

    const brochureChanged = brochureUrl !== originalUrl;
    const popupChanged = JSON.stringify(popupConfig) !== JSON.stringify(originalPopupConfig);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl">
            {/* 헤더 */}
            <div>
                <h1 className="text-2xl font-bold text-white">사이트 설정</h1>
                <p className="text-zinc-400 mt-1">
                    사이트 전체에 적용되는 설정을 관리합니다.
                </p>
            </div>

            {/* 1. 메인 팝업 설정 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <ExternalLink className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">메인 팝업 관리</h2>
                            <p className="text-sm text-gray-500">홈페이지 접속 시 첫 화면에 표시될 팝업을 설정합니다.</p>
                        </div>
                    </div>
                    <label className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={popupConfig.enabled}
                                onChange={(e) => setPopupConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                            />
                            <div className={`block w-14 h-8 rounded-full transition-colors ${popupConfig.enabled ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${popupConfig.enabled ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-700">{popupConfig.enabled ? "활성화됨" : "비활성화됨"}</span>
                    </label>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">팝업 제목</label>
                            <input
                                type="text"
                                value={popupConfig.title}
                                onChange={(e) => setPopupConfig(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="예: 신규 홈페이지 오픈 안내"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">팝업 내용</label>
                            <textarea
                                value={popupConfig.content}
                                onChange={(e) => setPopupConfig(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="사용자에게 보여줄 내용을 입력하세요."
                                rows={5}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-zinc-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">자세히 보기 링크 URL (선택)</label>
                            <input
                                type="url"
                                value={popupConfig.linkUrl || ""}
                                onChange={(e) => setPopupConfig(prev => ({ ...prev, linkUrl: e.target.value }))}
                                placeholder="예: /ko/products/paint?main=ev-fire-safety"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900"
                            />
                            <p className="text-xs text-gray-500 mt-1">입력 시 팝업 하단에 해당 경로로 이동하는 버튼이 활성화됩니다.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">팝업 이미지 (자유 크기 - 이미지에 맞춰 자동 조절)</label>
                            <div className="relative aspect-[7/4] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden group">
                                {popupConfig.imageUrl ? (
                                    <>
                                        <img src={popupConfig.imageUrl} alt="Popup preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-gray-50 flex items-center gap-2">
                                                <Upload className="w-4 h-4" />
                                                이미지 변경
                                                <input type="file" accept="image/*" onChange={handlePopupImageUpload} className="hidden" />
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200/50 transition-colors">
                                        {popupUploading ? <Loader2 className="w-8 h-8 animate-spin text-blue-500" /> : <Upload className="w-8 h-8 text-gray-400 mb-2" />}
                                        <span className="text-gray-500 text-sm">{popupUploading ? "업로드 중..." : "이미지 업로드"}</span>
                                        <input type="file" accept="image/*" onChange={handlePopupImageUpload} className="hidden" />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={() => handleSave("main_popup_config", JSON.stringify(popupConfig), "메인 팝업 설정")}
                        disabled={saving || !popupChanged}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${saving ? "bg-blue-400 text-white" : popupChanged ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        팝업 설정 저장
                    </button>
                </div>
            </div>

            {/* 2. 회사소개서 설정 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <FileText className="w-5 h-5 text-amber-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">회사소개서 관리</h2>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">현재 파일 URL</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={brochureUrl}
                                onChange={(e) => setBrochureUrl(e.target.value)}
                                placeholder="PDF 파일 URL"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
                            />
                            {brochureUrl && (
                                <a href={brochureUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600">
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">새 파일 업로드</label>
                        <label className="block border-2 border-dashed border-gray-300 rounded-lg py-10 text-center hover:bg-gray-50 cursor-pointer transition-colors">
                            {uploading ? <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" /> : <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />}
                            <p className="text-gray-600 font-medium">{uploading ? "업로드 중..." : "PDF 파일 선택"}</p>
                            <input type="file" accept=".pdf" onChange={handleBrochureUpload} className="hidden" />
                        </label>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button
                            onClick={() => handleSave("company_brochure_url", brochureUrl, "회사소개서 URL")}
                            disabled={saving || !brochureChanged}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${brochureChanged ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            <Save className="w-4 h-4" />
                            업로드 파일 저장
                        </button>
                    </div>
                </div>
            </div>

            {saved && (
                <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
                    <Check className="w-5 h-5 bg-white text-green-500 rounded-full p-0.5" />
                    <span className="font-semibold">설정이 저장되었습니다!</span>
                </div>
            )}
        </div>
    );
}

