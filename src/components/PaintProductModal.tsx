"use client";
// src/components/PaintProductModal.tsx
// ============================================================================
// 페인트 제품 상세 팝업
// ============================================================================

import React, { useState } from 'react';
import { X, Download, Share2, ArrowRight, Check } from 'lucide-react';

interface PaintProduct {
    id: string;
    name: string;
    thumbnail: string;
    description?: string;
    dataSheetPath?: string;
    dataSheetName?: string;
    usage?: string;
    features?: string;
    specification?: string;
    instructions?: string;
}

interface PaintProductModalProps {
    product: PaintProduct | null;
    isOpen: boolean;
    onClose: () => void;
}

export const PaintProductModal: React.FC<PaintProductModalProps> = ({
    product,
    isOpen,
    onClose
}) => {
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [emailUser, setEmailUser] = useState('');
    const [emailDomain, setEmailDomain] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('직접입력');
    const [shareLoading, setShareLoading] = useState(false);
    const [shareSuccess, setShareSuccess] = useState(false);

    if (!isOpen || !product) return null;

    const handleShare = async () => {
        const domain = selectedDomain === '직접입력' ? emailDomain : selectedDomain;
        const email = `${emailUser}@${domain}`;

        if (!emailUser || !domain) {
            alert('이메일을 입력해주세요.');
            return;
        }

        setShareLoading(true);
        try {
            const res = await fetch('/api/product-share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productName: product.name,
                    productDescription: product.description,
                    recipientEmail: email,
                    fileType: 'PDF'
                })
            });

            if (res.ok) {
                setShareSuccess(true);
                setTimeout(() => {
                    setShareModalOpen(false);
                    setShareSuccess(false);
                    setEmailUser('');
                    setEmailDomain('');
                }, 2000);
            } else {
                alert('공유 실패');
            }
        } catch {
            alert('공유 중 오류 발생');
        } finally {
            setShareLoading(false);
        }
    };

    return (
        <>
            {/* Main Product Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-200 rounded-full"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="grid md:grid-cols-2 gap-8 p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                        {/* Left: Product Image */}
                        <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                            <img
                                src={product.thumbnail || '/placeholder.jpg'}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>

                        {/* Right: Product Details */}
                        <div className="space-y-6">
                            {/* Description */}
                            {product.description && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 mb-2">요약 설명</h3>
                                    <p className="text-gray-700">{product.description}</p>
                                </div>
                            )}

                            {/* Usage */}
                            {product.usage && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 mb-2">용도</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{product.usage}</p>
                                </div>
                            )}

                            {/* Features */}
                            {product.features && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 mb-2">특성</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{product.features}</p>
                                </div>
                            )}

                            {/* Specification */}
                            {product.specification && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 mb-2">규격</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{product.specification}</p>
                                </div>
                            )}

                            {/* Instructions */}
                            {product.instructions && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 mb-2">사용방법</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{product.instructions}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-t border-gray-200 bg-gray-50">
                        {/* DataSheet Download */}
                        {product.dataSheetPath && (
                            <a
                                href={product.dataSheetPath}
                                download={product.dataSheetName}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                DataSheet 다운로드
                            </a>
                        )}

                        <div className="flex items-center gap-3">
                            {/* Tech Resources Link Button (Round) */}
                            <a
                                href="/resources"
                                className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shadow-lg"
                                title="기술자료실로 이동"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </a>

                            {/* Share Button */}
                            <button
                                onClick={() => setShareModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
                            >
                                <Share2 className="w-4 h-4" />
                                메일로 공유하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal (Same as TechResources) */}
            {shareModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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

                        {shareSuccess ? (
                            <div className="py-12 text-center">
                                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Check className="w-8 h-8 text-green-600" />
                                </div>
                                <p className="text-lg font-bold text-gray-900">공유 완료!</p>
                                <p className="text-gray-500 mt-2">이메일이 성공적으로 발송되었습니다.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-gray-50 p-4 border border-gray-200 text-sm text-gray-600">
                                    공유할 제품 정보와 이메일을 입력해주시기 바랍니다.
                                </div>

                                <div className="grid grid-cols-[100px_1fr] gap-y-6 items-center text-sm">
                                    <div className="font-bold text-gray-500">제품명</div>
                                    <div className="text-gray-900 font-medium">{product.name}</div>

                                    <div className="font-bold text-gray-500 self-start pt-3">
                                        이메일 <span className="text-amber-500">*</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Email User"
                                                value={emailUser}
                                                onChange={(e) => setEmailUser(e.target.value)}
                                                className="w-full bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none placeholder-gray-400"
                                            />
                                            <span className="text-gray-400 self-center">@</span>
                                            <input
                                                type="text"
                                                placeholder="Domain"
                                                value={emailDomain}
                                                onChange={(e) => setEmailDomain(e.target.value)}
                                                disabled={selectedDomain !== '직접입력'}
                                                className="w-full bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:border-amber-500 focus:outline-none placeholder-gray-400 disabled:bg-gray-100"
                                            />
                                        </div>
                                        <select
                                            value={selectedDomain}
                                            onChange={(e) => setSelectedDomain(e.target.value)}
                                            className="w-full bg-white border border-gray-300 px-3 py-2 text-gray-600 focus:border-amber-500 focus:outline-none"
                                        >
                                            <option>직접입력</option>
                                            <option>gmail.com</option>
                                            <option>naver.com</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={handleShare}
                                    disabled={shareLoading}
                                    className="w-full bg-amber-500 text-white font-bold py-4 mt-4 hover:bg-amber-600 transition-colors disabled:opacity-50"
                                >
                                    {shareLoading ? '공유 중...' : '공유하기'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
