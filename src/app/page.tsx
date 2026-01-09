import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { ChatWidget } from '@/components/ChatWidget';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';

// ============================================================================
// [page.tsx] - 메인 홈페이지 (루트 경로: /)
// ============================================================================
// 이 파일은 웹사이트의 메인 페이지 구성을 담당합니다.
// 각 섹션 컴포넌트들을 순서대로 배치합니다.
// ============================================================================

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white cursor-none">
      {/* 커스텀 마우스 커서 */}
      <CustomCursor />

      {/* 상단 네비게이션 바 */}
      <Navbar />

      <main>
        {/* ================================================================
            🎬 [섹션 1] 히어로 영역
            - 3D 배경 + 메인 슬로건 + CTA 버튼
            - 수정: src/components/Hero.tsx
        ================================================================ */}
        <Hero />

        {/* ================================================================
            📊 [섹션 2] 통계 밴드
            🔧 [수정 포인트] 아래 숫자와 라벨을 수정하면 통계가 변경됩니다.
            - label: 항목 이름 (예: "협력 파트너사")
            - val: 표시할 숫자/값 (예: "350+")
        ================================================================ */}
        <div className="w-full bg-zinc-900 border-y border-zinc-800 py-12 cursor-none">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "협력 파트너사", val: "350+" },
              { label: "보유 특허", val: "42" },
              { label: "수출 국가", val: "18" },
              { label: "기술 만족도", val: "99%" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col border-l border-zinc-700 pl-6 group hover:bg-zinc-800/50 transition-colors p-2 rounded">
                <span className="text-3xl font-bold text-white tracking-tighter group-hover:text-blue-500 transition-colors">{stat.val}</span>
                <span className="text-sm font-bold text-zinc-500 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================================
            🔬 [섹션 3] 핵심 기술/제품 그리드
            - 6개의 제품 카드
            - 수정: src/components/Features.tsx
        ================================================================ */}
        <Features />

        {/* ================================================================
            🖼️ [섹션 4] 중간 인용문 + 배경 이미지 구간
            🔧 [수정 포인트]
            - 배경 이미지: 아래 div의 className에서 Unsplash URL을 변경하면 배경이 교체됩니다.
            - 인용문: 아래 h2 태그 내 텍스트를 수정하면 변경됩니다.
        ================================================================ */}
        <section className="py-32 bg-black relative overflow-hidden cursor-none">
          {/* 배경 이미지 - Unsplash URL을 다른 이미지로 교체 가능 */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale"></div>
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-snug">
              "소재의 한계를 뛰어넘는<br />첨단 코팅 기술의 정점"
            </h2>
            <p className="text-zinc-400 font-medium">HANMIR Co., Ltd.</p>
          </div>
        </section>

        {/* ================================================================
            📨 [섹션 5] 문의하기 폼
            - 상담 신청 폼 + 회사 연락처
            - 수정: src/components/Contact.tsx
        ================================================================ */}
        <Contact />
      </main>

      {/* 하단 푸터 - 수정: src/components/Footer.tsx */}
      <Footer />

      {/* AI 채팅 위젯 - 수정: src/components/ChatWidget.tsx */}
      <ChatWidget />
    </div>
  );
}
