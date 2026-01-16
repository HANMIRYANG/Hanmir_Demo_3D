"use client";
// src/components/PaintCalculator.tsx
// ============================================================================
// 페인트량 계산기
// ============================================================================

import React, { useState } from 'react';
import { X, Calculator, RotateCcw } from 'lucide-react';

interface PaintCalculatorProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PaintCalculator: React.FC<PaintCalculatorProps> = ({
    isOpen,
    onClose
}) => {
    const [area, setArea] = useState('');
    const [coats, setCoats] = useState('2');
    const [result, setResult] = useState<{
        liters: number;
        cans18L: number;
        cans4L: number;
    } | null>(null);

    // 일반적인 페인트 도포율: 8-12 m²/L (1회 도장 기준)
    const COVERAGE_PER_LITER = 10; // m²/L

    const calculatePaint = () => {
        const areaNum = parseFloat(area);
        const coatsNum = parseInt(coats);

        if (isNaN(areaNum) || areaNum <= 0) {
            alert('면적을 올바르게 입력해주세요.');
            return;
        }

        // 필요한 페인트 양 계산 (면적 * 도장 횟수 / 도포율)
        const litersNeeded = (areaNum * coatsNum) / COVERAGE_PER_LITER;

        // 18L 캔 개수 (소수점 올림)
        const cans18L = Math.ceil(litersNeeded / 18);

        // 4L 캔 개수 (소수점 올림)
        const cans4L = Math.ceil(litersNeeded / 4);

        setResult({
            liters: Math.round(litersNeeded * 10) / 10,
            cans18L,
            cans4L
        });
    };

    const reset = () => {
        setArea('');
        setCoats('2');
        setResult(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-amber-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                            <Calculator className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">페인트량 계산기</h2>
                            <p className="text-sm text-gray-500">필요한 페인트 양을 계산합니다</p>
                            <p className="text-sm text-gray-500">제품별 정확한 사용량은 문의하기를 이용 바랍니다.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Area Input */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            도장 면적 (m²)
                        </label>
                        <input
                            type="number"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            placeholder="예: 50"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            벽면의 가로 × 세로 합계를 입력하세요. 가구, 창문 등 제외.
                        </p>
                    </div>

                    {/* Coats Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            도장 횟수
                        </label>
                        <div className="flex gap-2">
                            {['1', '2', '3'].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setCoats(num)}
                                    className={`flex-1 py-3 rounded-lg font-bold transition-all ${coats === num
                                        ? 'bg-amber-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {num}회
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            일반적으로 2회 도장을 권장합니다.
                        </p>
                    </div>

                    {/* Calculate Button */}
                    <div className="flex gap-2">
                        <button
                            onClick={calculatePaint}
                            className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            계산하기
                        </button>
                        <button
                            onClick={reset}
                            className="p-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Result */}
                    {result && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 space-y-4">
                            <h3 className="font-bold text-gray-900">계산 결과</h3>

                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <p className="text-2xl font-bold text-amber-600">{result.liters}</p>
                                    <p className="text-xs text-gray-500 mt-1">필요량 (L)</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <p className="text-2xl font-bold text-gray-900">{result.cans18L}</p>
                                    <p className="text-xs text-gray-500 mt-1">18L 캔</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <p className="text-2xl font-bold text-gray-900">{result.cans4L}</p>
                                    <p className="text-xs text-gray-500 mt-1">4L 캔</p>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 text-center">
                                * 도포율 10m²/L 기준 / 실제 필요량은 표면 상태에 따라 달라질 수 있습니다.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
