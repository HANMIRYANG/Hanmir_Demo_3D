"use client";

import React from 'react';
import { Download, FileText } from 'lucide-react';

interface CompanyDownloadCTAProps {
    className?: string;
}

export const CompanyDownloadCTA: React.FC<CompanyDownloadCTAProps> = ({ className = "" }) => {
    const handleDownload = () => {
        // PDF 다운로드 - public/company/회사소개서.pdf
        const link = document.createElement('a');
        link.href = '/company/회사소개서.pdf';
        link.download = '한미르_회사소개서.pdf';
        link.click();
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
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-amber-600 font-bold hover:bg-gray-100 transition-colors rounded-lg shadow-lg"
                >
                    <Download className="w-5 h-5" />
                    회사소개서 PDF 다운로드
                </button>
            </div>
        </section>
    );
};
