import React from 'react';
import { Navbar } from '@/components/Navbar';
import { NoticeList } from '@/components/NoticeList';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
import { CustomCursor } from '@/components/CustomCursor';

// ============================================================================
// [notice/page.tsx] - 공지사항 페이지 (/notice)
// ============================================================================
// 이 파일은 회사 공지사항, 뉴스, 이벤트 등을 표시하는 페이지입니다.
// NoticeList 컴포넌트로 테이블을 표시합니다.
// ============================================================================

export default function NoticePage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-amber-500 selection:text-white flex flex-col">
            <CustomCursor />
            <Navbar />

            {/* 상단 Navbar 고정으로 인한 여백 */}
            <main className="pt-20 flex-1">
                <NoticeList />
            </main>

            <Footer />

            {/* AI 채팅 위젯 */}
            <ChatWidget />
        </div>
    );
}
