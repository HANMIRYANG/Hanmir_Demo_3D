import React from 'react';
import { Navbar } from '@/components/Navbar';
import { QnaBoard } from '@/components/QnaBoard';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
// [DISABLED] 커스텀 커서 비활성화
// import { CustomCursor } from '@/components/CustomCursor';

// ============================================================================
// [qna/page.tsx] - 문의게시판 페이지 (/qna)
// ============================================================================

export default function QnaPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-amber-500 selection:text-white">
            {/* [DISABLED] <CustomCursor /> */}
            <Navbar />

            <main className="pt-20">
                <QnaBoard />
            </main>

            <Footer />
            <ChatWidget />
        </div>
    );
}
