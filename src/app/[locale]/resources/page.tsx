import React from 'react';
import { Navbar } from '@/components/Navbar';
import { TechResources } from '@/components/TechResources';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
// [DISABLED] 커스텀 커서 비활성화
// import { CustomCursor } from '@/components/CustomCursor';

// ============================================================================
// [resources/page.tsx] - 기술자료실 페이지 (/resources)
// ============================================================================
// 이 파일은 기술 문서, 인증서, 매뉴얼 등을 다운로드할 수 있는
// 자료실 페이지입니다. TechResources 컴포넌트로 테이블을 표시합니다.
// ============================================================================

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-amber-500 selection:text-white">
            {/* [DISABLED] <CustomCursor /> */}
            <Navbar />

            {/* 상단 Navbar 고정으로 인한 여백 */}
            <main className="pt-20">
                {/* ============================================================
                    📂 [기술자료 테이블]
                    자료 목록, 검색, 다운로드 기능을 담당합니다.
                    
                    🔧 [수정 위치]
                    - 자료 목록: src/components/TechResources.tsx 의 RESOURCES 배열
                    - 헤더/설명문: TechResources.tsx 상단 부분
                ============================================================ */}
                <TechResources />
            </main>

            <Footer />

            {/* AI 채팅 위젯 */}
            <ChatWidget />
        </div>
    );
}
