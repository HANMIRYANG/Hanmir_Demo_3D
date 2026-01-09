"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

// ============================================================================
// [FloatingContactBtn.tsx] - 플로팅 문의 버튼 컴포넌트
// ============================================================================
// 이 파일은 모든 페이지 우측 하단에 표시되는 둥근 문의 버튼입니다.
// 클릭 시 /contact 페이지로 이동합니다.
// layout.tsx에서 전역으로 렌더링되어 모든 페이지에 표시됩니다.
// ============================================================================

export const FloatingContactBtn: React.FC = () => {
    const pathname = usePathname();

    // 관리자 페이지(/admin으로 시작)에서는 렌더링하지 않음
    if (pathname?.startsWith('/admin')) return null;

    return (
        <Link
            // 🔧 [수정 포인트 #1] 이동할 페이지 경로
            href="/contact"
            className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 bg-white text-black rounded-full shadow-lg hover:scale-110 hover:bg-zinc-200 transition-all duration-300 group"
            // 🔧 [수정 포인트 #2] 마우스 오버 시 표시되는 툴팁 텍스트
            title="문의하기"
        >
            {/* 아이콘 - lucide-react의 MessageCircle 사용 */}
            <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />

            {/* 🔧 [수정 포인트 #3] 호버 시 나타나는 라벨 텍스트 */}
            <span className="absolute right-full mr-4 px-3 py-1 bg-white text-black text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
                문의하기
            </span>
        </Link>
    );
};
