import React from 'react';

// ============================================================================
// [TechSpecs.tsx] - 기술 사양 테이블 컴포넌트
// ============================================================================
// 이 파일은 제품 상세 페이지에서 기술 스펙을 그리드로 보여주는 섹션입니다.
// key-value 형태의 specs 객체를 받아서 표 형태로 렌더링합니다.
// ============================================================================

interface TechSpecsProps {
    // 🔧 [수정 포인트] specs 객체
    // Record<string, string> 형태로, key는 항목명, value는 값입니다.
    // 예: { "열전도율": "15 W/m·K", "내열온도": "1,200°C" }
    specs: Record<string, string>;
}

export const TechSpecs: React.FC<TechSpecsProps> = ({ specs }) => {
    const entries = Object.entries(specs);

    return (
        <section className="py-24 bg-zinc-950 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-6">
                {/* ============================================================
                    🔧 [수정 포인트 #1] 섹션 헤더
                    - 제목: "Technical Specifications"
                    - 부제목: "제품의 물리적/화학적 특성 데이터"
                ============================================================ */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Technical Specifications</h2>
                        <p className="text-zinc-500">제품의 물리적/화학적 특성 데이터</p>
                    </div>
                </div>

                {/* 스펙 그리드 - specs 객체의 각 항목이 카드로 표시됩니다 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800 border border-zinc-800">
                    {entries.map(([key, value], idx) => (
                        <div key={idx} className="bg-zinc-950 p-6 flex flex-col justify-between hover:bg-zinc-900/50 transition-colors group">
                            {/* 항목명 (key) */}
                            <span className="text-zinc-500 text-sm font-mono mb-2">{key.toUpperCase()}</span>
                            {/* 값 (value) */}
                            <span className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                {value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* 🔧 [수정 포인트 #2] 하단 안내문구 */}
                <p className="text-xs text-zinc-600 mt-6 text-right">
                    * 상기 데이터는 표준 실험 환경에서의 측정값이며 실제 환경에 따라 다소 차이가 있을 수 있습니다.
                </p>
            </div>
        </section>
    );
};
