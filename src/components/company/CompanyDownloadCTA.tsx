"use client";

import React, { useState, useEffect } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';

interface CompanyDownloadCTAProps {
    className?: string;
}

export const CompanyDownloadCTA: React.FC<CompanyDownloadCTAProps> = ({ className = "" }) => {
    const [brochureUrl, setBrochureUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // DB에서 회사소개서 URL 조회
    useEffect(() => {
        const fetchBrochureUrl = async () => {
            try {
                const res = await fetch('/api/admin/settings?key=company_brochure_url');
                if (res.ok) {
                    const data = await res.json();
                    if (data?.value) {
                        setBrochureUrl(data.value);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch brochure URL:', error);
            }
        };
        fetchBrochureUrl();
    }, []);

    const handleDownload = () => {
        setLoading(true);
        const link = document.createElement('a');
        // DB에 URL이 있으면 사용, 없으면 기본 파일
        link.href = brochureUrl || '/company/한미르 소개서(KOR)251210.pdf';
        link.download = '한미르_회사소개서.pdf';
        link.click();
        setTimeout(() => setLoading(false), 1000);
    };

    return (
        <section className={`py-16 px-6 bg-gradient-to-r from-amber-500 to-amber-600 ${className}`}>
            <div className="max-w-4xl mx-auto text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <FileText className="w-8 h-8 text-white" />
                    <h3 className="text-2xl font-bold text-white">회사소개서 다운로드</h3>
                </div>
                <p className="text-white/80 mb-8">
                    한미르(주)의 상세한 기업 정보와 제품 소개를 확인하세요.
                </p>
                <button
                    onClick={handleDownload}
                    disabled={loading}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-amber-600 font-bold hover:bg-gray-100 transition-colors rounded-lg shadow-lg disabled:opacity-70"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Download className="w-5 h-5" />
                    )}
                    회사소개서 PDF 다운로드
                </button>
            </div>
        </section>
    );
};

