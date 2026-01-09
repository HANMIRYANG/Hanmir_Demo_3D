import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';

// [기업소개 페이지]
// 회사 비전, CEO 인사말, 연혁, 인증 현황 등을 소개하는 페이지입니다.
export default function CompanyPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white cursor-none">
            {/* 커스텀 커서 및 상단 내비게이션 바 */}
            <CustomCursor />
            <Navbar />

            <main className="pt-24">
                {/* 1. Hero Section: 페이지 타이틀 및 메인 슬로건 */}
                <section className="relative py-24 px-6 border-b border-zinc-800">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            Global Leader in <br />
                            <span className="text-blue-500">Functional Coating</span>
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                            한미르(주)는 2009년 창립 이래, 끊임없는 연구개발과 혁신을 통해<br className="hidden md:block" />
                            대한민국 특수 도료 산업을 선도해왔습니다.
                        </p>
                    </div>
                </section>

                {/* 2. CEO 인사말 및 회사 비전 섹션 */}
                <section className="py-24 px-6 bg-zinc-950">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        {/* 왼쪽: CEO 이미지 영역 */}
                        <div>
                            <div className="w-full h-[500px] bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg overflow-hidden relative group flex items-center justify-center">
                                {/* CEO 이미지 */}
                                <img
                                    src="/ceo.jpg"
                                    alt="CEO of HANMIR"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* 오른쪽: 인사말 텍스트 및 핵심 지표(통계) */}
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">CEO 인사말</h2>
                            <p className="text-zinc-400 leading-relaxed mb-6">
                                안녕하십니까, 한미르(주) 대표이사입니다.<br /><br />
                                저희는 "기술로 세상을 안전하게"라는 신념 아래, 불연·방열·전자파 차폐 등 특수 기능성 도료 개발에 매진해왔습니다.<br /><br />
                                앞으로도 지속적인 R&D 투자와 글로벌 네트워크 확장을 통해 세계적인 화학 소재 기업으로 도약하겠습니다.
                            </p>

                            {/* 주요 통계 수치 */}
                            <div className="flex gap-8 mt-8 border-t border-zinc-800 pt-8">
                                <div>
                                    <p className="text-3xl font-bold text-blue-500">16+</p>
                                    <p className="text-zinc-500 text-sm mt-1">Years of History</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-blue-500">42+</p>
                                    <p className="text-zinc-500 text-sm mt-1">Patents Held</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-blue-500">5+</p>
                                    <p className="text-zinc-500 text-sm mt-1">Export Countries</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. 회사 연혁 섹션 */}
                <section className="py-24 px-6 bg-black border-t border-zinc-900">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4">회사 연혁</h2>
                            <p className="text-zinc-500">한미르의 성장 발자취</p>
                        </div>

                        {/* 타임라인 */}
                        <div className="relative">
                            {/* 중앙 세로선 */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-zinc-800 hidden md:block" />

                            {/* 연혁 아이템들 */}
                            {[
                                { year: '2025', title: '중소벤처기업부 장관상 수상', desc: '기술혁신 분야 우수기업 선정' },
                                { year: '2023', title: '방열 코팅제 특허 취득', desc: '고성능 방열 도료 기술 확보' },
                                { year: '2021', title: '해외 수출 본격화', desc: '동남아시아 5개국 수출 개시' },
                                { year: '2019', title: 'ISO 9001 / 14001 인증 획득', desc: '품질 및 환경경영 시스템 구축' },
                                { year: '2017', title: '불연 도료 KS 인증 획득', desc: '국내 최초 무기질 불연 도료 개발' },
                                { year: '2015', title: '기업부설연구소 설립', desc: 'R&D 역량 강화 및 특허 출원 본격화' },
                                { year: '2012', title: 'EMI 차폐 코팅 사업 진출', desc: '전자파 차폐 솔루션 개발 착수' },
                                { year: '2009', title: '한미르(주) 설립', desc: '인천광역시 서구에 본사 설립' },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`relative flex items-center mb-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                >
                                    {/* 좌/우 콘텐츠 */}
                                    <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                                        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-blue-500/50 transition-colors group">
                                            <span className="text-blue-500 font-mono text-sm">{item.year}</span>
                                            <h3 className="text-xl font-bold text-white mt-2 group-hover:text-blue-400 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-zinc-500 mt-1">{item.desc}</p>
                                        </div>
                                    </div>

                                    {/* 중앙 원형 마커 */}
                                    <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center justify-center">
                                        <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-black" />
                                    </div>

                                    {/* 반대쪽 빈 공간 */}
                                    <div className="hidden md:block w-1/2" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section className="py-24 px-6 bg-black border-t border-zinc-900">
                    <div className="max-w-7xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-white mb-12">인증 및 수상 내역</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['ISO 9001', 'ISO 14001', 'INNO-BIZ', '벤처기업인증'].map((cert, idx) => (
                                <div key={idx} className="p-8 border border-zinc-800 rounded flex items-center justify-center hover:border-blue-500 transition-colors">
                                    <span className="text-zinc-400 font-bold">{cert}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 하단 문의 섹션 (공통 컴포넌트) */}
            </main>
            <Footer />
        </div>
    );
}
