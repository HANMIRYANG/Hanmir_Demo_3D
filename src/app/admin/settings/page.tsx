"use client";

import { useState, useEffect } from "react";
import { Upload, Save, Link as LinkIcon, FileText, Loader2, Check, ExternalLink } from "lucide-react";

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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [uploading, setUploading] = useState(false);

    // 설정 불러오기
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/settings?key=company_brochure_url");
                if (res.ok) {
                    const data = await res.json();
                    if (data?.value) {
                        setBrochureUrl(data.value);
                        setOriginalUrl(data.value);
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
    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: "company_brochure_url",
                    value: brochureUrl,
                    label: "회사소개서 URL"
                })
            });

            if (res.ok) {
                setOriginalUrl(brochureUrl);
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

    // 파일 업로드
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("PDF 파일만 업로드 가능합니다.");
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const { url } = await res.json();
                setBrochureUrl(url);
            } else {
                alert("업로드 실패");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("업로드 중 오류가 발생했습니다.");
        } finally {
            setUploading(false);
        }
    };

    const hasChanges = brochureUrl !== originalUrl;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* 헤더 */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">사이트 설정</h1>
                <p className="text-gray-500 mt-1">
                    사이트 전체에 적용되는 설정을 관리합니다.
                </p>
            </div>

            {/* 회사소개서 설정 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-amber-500" />
                        <h2 className="text-lg font-semibold text-gray-900">회사소개서 관리</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 ml-8">
                        회사소개 페이지에서 다운로드되는 PDF 파일을 설정합니다.
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* URL 입력 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <LinkIcon className="w-4 h-4 inline mr-1" />
                            회사소개서 URL
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={brochureUrl}
                                onChange={(e) => setBrochureUrl(e.target.value)}
                                placeholder="https://example.com/회사소개서.pdf"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                            {brochureUrl && (
                                <a
                                    href={brochureUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    미리보기
                                </a>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Vercel Blob Storage URL 또는 외부 파일 URL을 입력하세요.
                        </p>
                    </div>

                    {/* 또는 구분선 */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-sm text-gray-400">또는</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* 파일 업로드 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Upload className="w-4 h-4 inline mr-1" />
                            새 파일 업로드
                        </label>
                        <label className="block">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                                {uploading ? (
                                    <div className="flex flex-col items-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                                        <span className="text-gray-500">업로드 중...</span>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-600 font-medium">클릭하여 PDF 업로드</p>
                                        <p className="text-xs text-gray-400 mt-1">PDF 파일만 지원됩니다</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </div>
                        </label>
                    </div>

                    {/* 저장 버튼 */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            {hasChanges ? (
                                <span className="text-amber-600 font-medium">⚠️ 저장되지 않은 변경사항이 있습니다.</span>
                            ) : (
                                "변경사항을 저장하려면 저장 버튼을 클릭하세요."
                            )}
                        </p>
                        <button
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${saved
                                    ? "bg-green-500 text-white"
                                    : hasChanges
                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : saved ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {saving ? "저장 중..." : saved ? "저장됨" : "저장"}
                        </button>
                    </div>
                </div>
            </div>

            {/* 안내 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">💡 사용 방법</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 새 회사소개서 파일을 업로드하면 URL이 자동으로 입력됩니다.</li>
                    <li>• URL 입력 후 반드시 <strong>저장</strong> 버튼을 클릭해야 적용됩니다.</li>
                    <li>• 저장된 URL은 회사소개 페이지의 다운로드 버튼에 즉시 반영됩니다.</li>
                </ul>
            </div>
        </div>
    );
}
