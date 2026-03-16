import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
// [DISABLED] 커스텀 커서 비활성화
// import { CustomCursor } from '@/components/CustomCursor';
import { Contact } from '@/components/Contact';

// ============================================================================
// [contact/page.tsx] - 문의하기 페이지 (/contact)
// ============================================================================
// 이 파일은 상담 신청 전용 페이지입니다.
// 메인 페이지의 Contact 섹션과 동일한 Contact 컴포넌트를 사용합니다.
// ============================================================================

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-amber-500 selection:text-white">
            {/* [DISABLED] <CustomCursor /> */}
            <Navbar />

            <main className="pt-20">
                {/* ============================================================
                    📨 [문의하기 폼]
                    Contact 컴포넌트를 재사용합니다.
                    
                    🔧 [수정 위치]
                    - 회사 정보/폼 필드: src/components/Contact.tsx
                ============================================================ */}
                <Contact />
            </main>

            <Footer />
            <ChatWidget />
        </div>
    );
}
