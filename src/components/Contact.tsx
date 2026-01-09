"use client";

import React from 'react';

// ============================================================================
// [Contact.tsx] - 문의하기 폼 컴포넌트
// ============================================================================
// 이 파일은 메인 페이지 하단과 /contact 페이지에서 사용되는
// 상담 신청 폼입니다. 회사 정보와 입력 폼을 포함합니다.
// ============================================================================

export const Contact: React.FC = () => {
    return (
        <section id="contact" className="py-32 bg-black relative border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20">
                {/* ============================================================
                    🔧 [수정 포인트 #1] 좌측 정보 영역
                ============================================================ */}
                <div>
                    {/* ========================================================
                        🔧 [수정 포인트 #1-1] 섹션 제목
                        아래 텍스트를 수정하면 문의 섹션 제목이 변경됩니다.
                    ======================================================== */}
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-tight">
                        한미르와 함께<br />혁신을 시작하세요
                    </h2>

                    {/* ========================================================
                        🔧 [수정 포인트 #1-2] 섹션 설명문
                    ======================================================== */}
                    <p className="text-zinc-400 text-lg mb-12 max-w-md break-keep">
                        귀사의 프로젝트에 최적화된 기능성 도료 솔루션을 제안해 드립니다. 전문 인력이 상담을 도와드립니다.
                    </p>

                    {/* ========================================================
                        🔧 [수정 포인트 #1-3] 회사 연락처 정보
                        아래 주소, 이메일, 전화번호를 수정하면 변경됩니다.
                    ======================================================== */}
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">본사 및 연구소</h4>
                            <p className="text-zinc-500">인천광역시 서구 도담로 190<br />(우) 22667</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">연락처</h4>
                            <p className="text-zinc-500">hanmir@hanmirfe.com<br />1533-2112</p>
                        </div>
                    </div>
                </div>

                {/* ============================================================
                    🔧 [수정 포인트 #2] 문의 폼 영역
                    현재는 프론트엔드만 구현되어 있으며, 폼 제출 시 alert만 표시됩니다.
                    실제 백엔드 연동 시 onSubmit 핸들러를 수정해야 합니다.
                ============================================================ */}
                <form className="space-y-6" onSubmit={async (e) => {
                    e.preventDefault();
                    // 폼 데이터 수집
                    const form = e.currentTarget;
                    const formData = {
                        name: (form.querySelector('input[type="text"][required]') as HTMLInputElement).value,
                        company: (form.querySelectorAll('input[type="text"]')[1] as HTMLInputElement).value,
                        phone: (form.querySelector('input[type="tel"]') as HTMLInputElement).value,
                        email: (form.querySelector('input[type="email"]') as HTMLInputElement).value,
                        interest: (form.querySelector('select') as HTMLSelectElement).value,
                        message: (form.querySelector('textarea') as HTMLTextAreaElement).value
                    };

                    const button = form.querySelector('button');
                    if (button) {
                        button.disabled = true;
                        button.textContent = "처리중...";
                    }

                    try {
                        const res = await fetch('/api/inquiries', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(formData)
                        });

                        const result = await res.json();

                        if (res.ok) {
                            alert("상담 신청이 성공적으로 접수되었습니다. 담당자가 곧 연락드리겠습니다.");
                            form.reset();
                        } else {
                            alert(`접수 실패: ${result.error || '오류가 발생했습니다.'}`);
                        }
                    } catch (error) {
                        alert("서버 통신 중 오류가 발생했습니다.");
                    } finally {
                        if (button) {
                            button.disabled = false;
                            button.textContent = "상담 신청하기";
                        }
                    }
                }}>
                    {/* Row 1: 담당자 성명 (필수) | 업체명 (선택) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500">
                                담당자 성명 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:outline-none focus:border-white transition-colors rounded-none placeholder-zinc-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500">
                                업체명 <span className="text-zinc-600 font-normal">(선택)</span>
                            </label>
                            <input
                                type="text"
                                name="company"
                                className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:outline-none focus:border-white transition-colors rounded-none placeholder-zinc-700"
                            />
                        </div>
                    </div>

                    {/* Row 2: 연락처 (필수) | 이메일 (필수) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500">
                                연락처 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:outline-none focus:border-white transition-colors rounded-none placeholder-zinc-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500">
                                이메일 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:outline-none focus:border-white transition-colors rounded-none placeholder-zinc-700"
                            />
                        </div>
                    </div>

                    {/* Interest Dropdown */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500">관심 분야</label>
                        <select
                            name="interest"
                            className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:outline-none focus:border-white transition-colors rounded-none appearance-none"
                        >
                            <option>자동차 배터리</option>
                            <option>선박</option>
                            <option>건축 및 중공업</option>
                            <option>기타 특수 목적</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500">문의 내용</label>
                        <textarea
                            name="message"
                            rows={4}
                            className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:outline-none focus:border-white transition-colors rounded-none placeholder-zinc-700"
                            placeholder="프로젝트 요건이나 필요한 도료의 사양을 입력해주세요."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold py-5 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        상담 신청하기
                    </button>
                </form>
            </div>
        </section>
    );
};