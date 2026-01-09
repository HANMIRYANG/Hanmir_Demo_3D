"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowDown, ChevronRight } from "lucide-react";

// ============================================================================
// [Hero.tsx] - 메인 페이지 히어로(첫 화면) 섹션
// ============================================================================
// 이 파일은 메인 페이지에서 가장 먼저 보이는 대형 배너 영역입니다.
// 3D 애니메이션, 메인 슬로건, CTA 버튼 등을 담당합니다.
// ============================================================================

// ✅ [3D 배경 설정]
// Spline 3D 툴을 사용하여 배경 애니메이션을 로딩합니다.
// ssr: false → 서버 렌더링을 비활성화하여 클라이언트에서만 로드합니다.
const Spline = dynamic(
    () => import("@splinetool/react-spline").then((m) => m.default),
    {
        ssr: false,
        // 로딩 중 표시될 placeholder (반투명 검정 배경)
        loading: () => (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        ),
    }
);

export const Hero: React.FC = () => {
    // ============================================================================
    // 🔧 [수정 포인트 #1] 3D 배경 URL
    // ============================================================================
    // 아래 URL을 변경하면 3D 배경 애니메이션이 교체됩니다.
    // Spline(https://spline.design)에서 scene을 만들고 "Share" → "Get Embed Code"에서
    // .splinecode URL을 가져와 아래에 붙여넣으세요.
    // ============================================================================
    const SPLINE_SCENE =
        "https://prod.spline.design/ThhmVkUKSVS5CZrz/scene.splinecode";

    return (
        <section className="relative w-full h-screen overflow-hidden bg-black flex flex-col justify-end pb-20">
            {/* ================================================================
                🎨 [3D 배경 영역]
                이 부분에서 3D 애니메이션이 표시됩니다.
                opacity-60: 투명도 60%
                grayscale-[30%]: 회색조 30% 적용
                scale-110: 살짝 확대하여 가장자리 빈 공간 방지
            ================================================================ */}
            <div className="absolute inset-0 w-full h-full z-0">
                <div className="absolute inset-0 w-full h-full opacity-60 grayscale-[30%] contrast-125 scale-110">
                    <Spline scene={SPLINE_SCENE} />
                </div>

                {/* 텍스트 가독성을 위한 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* ================================================================
                📝 [콘텐츠 영역] - 메인 슬로건 및 CTA 버튼
            ================================================================ */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-3xl">
                    {/* ============================================================
                        🔧 [수정 포인트 #2] 상단 태그라인 (작은 라벨)
                        아래 텍스트를 수정하면 상단 작은 태그가 변경됩니다.
                    ============================================================ */}
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 border border-zinc-700 bg-black/50 backdrop-blur text-[11px] font-bold text-zinc-300">
                            The Future of Functional Coating
                        </span>
                        <div className="h-[1px] w-20 bg-zinc-700" />
                    </div>

                    {/* ============================================================
                        🔧 [수정 포인트 #3] 메인 슬로건 (큰 제목)
                        아래 텍스트를 수정하면 히어로 메인 문구가 변경됩니다.
                        - 첫 번째 줄: "보이지 않는 곳에서"
                        - 두 번째 줄(그라데이션): "완벽을 칠하다"
                    ============================================================ */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8">
                        보이지 않는 곳에서 <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-500">
                            완벽을 칠하다
                        </span>
                    </h1>

                    {/* ============================================================
                        🔧 [수정 포인트 #4] 서브 설명문
                        아래 텍스트를 수정하면 슬로건 아래 설명문이 변경됩니다.
                    ============================================================ */}
                    <p className="text-zinc-400 text-lg md:text-xl max-w-xl leading-relaxed mb-10 font-light break-keep">
                        한미르(주)는 방열, 불연, 전자파 차폐 등 특수 목적을 위한 고기능성 도료를 개발합니다.
                        극한의 환경에서도 변하지 않는 가치를 경험하십시오.
                    </p>

                    {/* ============================================================
                        🔧 [수정 포인트 #5] CTA 버튼들
                        - 첫 번째 버튼: "제품 살펴보기" → /products 페이지로 이동
                        - 두 번째 버튼: "기술 문의하기" → /contact 페이지로 이동
                        버튼 텍스트나 링크(href)를 수정하면 변경됩니다.
                    ============================================================ */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <Link href="/products" className="flex items-center justify-between px-8 py-4 bg-white text-black min-w-[200px] hover:bg-zinc-200 transition-colors group">
                            <span className="text-xs font-bold">제품 살펴보기</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/contact" className="flex items-center justify-between px-8 py-4 border border-zinc-700 text-white min-w-[200px] hover:bg-white/5 transition-colors group backdrop-blur-sm">
                            <span className="text-xs font-bold">기술 문의하기</span>
                            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* 스크롤 유도 인디케이터 (우측 하단) */}
            <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 z-20 opacity-50 pointer-events-none">
                <span className="text-[10px] tracking-widest uppercase rotate-90 origin-right translate-x-4">
                    Scroll
                </span>
                <div className="w-[1px] h-16 bg-zinc-700 mt-8" />
            </div>
        </section>
    );
};
