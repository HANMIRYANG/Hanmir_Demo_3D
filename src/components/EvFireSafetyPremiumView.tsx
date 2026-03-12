"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ShieldCheck, Flame, ThermometerSun, Leaf, Users, CheckCircle, Calculator } from 'lucide-react';
import { JsonLdFaq, JsonLdBreadcrumb } from '@/components/JsonLd';

// EV 화재안전 FAQ 구조화 데이터 (구글/네이버 리치 스니펫)
const evFaqItems = [
    {
        question: 'EV 전기차 지하주차장 화재 시 일반 건축물의 위험성은?',
        answer: '일반 건축물 구조는 전기차 배터리 화염(1,000℃ 이상)에 노출 시 10분 이내에 구조적 손상과 콘크리트 폭열 현상이 발생하여 붕괴 위험에 직면합니다.',
    },
    {
        question: '한미르 나노 세라믹 방화코팅의 내열 성능은?',
        answer: '표면에 형성된 세라믹 방어막이 화염과 열을 근본적으로 차단하여 이면 온도를 300℃ 이하로 유지하고, 최소 1시간 이상의 구조적 안정성을 보장합니다.',
    },
    {
        question: 'EV 충전구역 방화코팅 솔루션의 적용 범위는?',
        answer: '벽면, 천장, 바닥, 배관 등 충전구역 전체를 일체형으로 보호하며, 면적 기반 물량 산출과 전문 시공팀의 상세 견적 서비스를 제공합니다.',
    },
];

const temperatureData = [
    { time: '0분', normal: 20, hanmir: 20 },
    { time: '10분', normal: 600, hanmir: 80 },
    { time: '20분', normal: 1000, hanmir: 150 },
    { time: '30분', normal: 1200, hanmir: 220 },
    { time: '60분', normal: '붕괴위험', hanmir: 350 },
];

export function EvFireSafetyPremiumView() {
    const [calcOpen, setCalcOpen] = useState(false);
    const pathname = usePathname();
    const currentLocale = pathname?.startsWith('/en') ? 'en' : pathname?.startsWith('/cn') ? 'cn' : 'ko';

    return (
        <div className="bg-zinc-950 text-white min-h-screen font-sans selection:bg-amber-500 selection:text-white">
            {/* SEO 구조화 데이터 */}
            <JsonLdFaq items={evFaqItems} />
            <JsonLdBreadcrumb items={[
                { name: '홈', url: 'https://hanmirfe.com/ko' },
                { name: '제품소개', url: 'https://hanmirfe.com/ko/products' },
                { name: '페인트', url: 'https://hanmirfe.com/ko/products/paint' },
                { name: 'EV 전기차 화재안전 솔루션', url: 'https://hanmirfe.com/ko/products/paint?main=ev-fire-safety' },
            ]} />

            {/* 1. Hero / Video Intro */}
            <section aria-label="EV 전기차 화재안전 히어로" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/60 via-zinc-950/80 to-zinc-950 z-10" />
                {/* 비디오 연출용 백그라운드 */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2672&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat scale-105 animate-[pulse_10s_ease-in-out_infinite]" role="img" aria-label="EV 전기차 충전구역 화재안전 솔루션 배경 이미지" />

                <div className="relative z-20 text-center px-6 max-w-5xl mx-auto mt-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 font-bold tracking-widest text-xs md:text-sm mb-8"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        HMR EV FIRE SAFETY ZONE
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight mb-8"
                    >
                        <span className="block mb-2">열폭주,</span>
                        <span className="inline-block whitespace-nowrap pr-4 -mr-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                            막을 수 없다면 지연시켜라.
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto font-light leading-relaxed"
                    >
                        1,000℃의 극한 화염을 차단하는 <strong className="text-zinc-200 font-bold">한미르 나노 세라믹 방어막</strong>.<br className="hidden md:block" />
                        전기차 시대, 충전구역의 생명과 자산을 지키는 최후의 저지선입니다.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1.2 }}
                        className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })} className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors w-full sm:w-auto">
                            솔루션 원리 보기
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* 3. 데이터 증명 (차트) & Scrollytelling Section */}
            <section aria-label="EV 화재안전 내열 성능 데이터" className="py-32 relative bg-zinc-950 border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">골든타임을 확보하는 <span className="text-amber-500">압도적 내열 성능</span></h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">전기차 화재 시 발생하는 초고온의 열전파를 획기적으로 지연시켜 대피 및 초기 진압을 위한 생명선(Golden Time)을 구축합니다.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 h-[400px] md:h-[500px] w-full bg-zinc-900/50 p-4 md:p-8 rounded-2xl border border-zinc-800">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={temperatureData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                                    <XAxis dataKey="time" stroke="#a1a1aa" tick={{ fill: '#a1a1aa' }} />
                                    <YAxis stroke="#a1a1aa" tick={{ fill: '#a1a1aa' }} label={{ value: '형면 온도 (℃)', angle: -90, position: 'insideLeft', fill: '#71717a' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                                        itemStyle={{ color: '#e4e4e7' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Line type="monotone" name="일반 콘크리트 벽면" dataKey="normal" stroke="#ef4444" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                                    <Line type="monotone" name="한미르 방화코팅 적용" dataKey="hanmir" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="order-1 lg:order-2 space-y-8">
                            <div className="flex gap-4">
                                <div className="mt-1 w-12 h-12 shrink-0 bg-red-500/10 rounded-full flex items-center justify-center">
                                    <Flame className="w-6 h-6 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">무방비 상태의 열폭주 위험성</h3>
                                    <p className="text-zinc-400 leading-relaxed">일반 건축물 구조는 전기차 배터리 화염(1,000℃ 이상)에 노출 시 10분 이내에 구조적 손상과 콘크리트 폭열 현상이 발생하여 붕괴 위험에 직면합니다.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-1 w-12 h-12 shrink-0 bg-amber-500/10 rounded-full flex items-center justify-center">
                                    <ThermometerSun className="w-6 h-6 text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">독자적 나노 세라믹 단열 기술</h3>
                                    <p className="text-zinc-400 leading-relaxed">표면에 형성된 세라믹 방어막이 화염과 열을 근본적으로 차단, 이면 온도를 300℃ 이하로 유지하여 최소 1시간 이상의 구조적 안정성을 보장합니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. 인증 마크 갤러리 */}
            <section aria-label="한미르 방화코팅 인증 현황" className="py-24 bg-zinc-900 border-t border-zinc-800">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h3 className="text-2xl font-bold text-white mb-12">국내외 공신력 있는 기관의 검증 완료</h3>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* 뱃지 예시 */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                                <span className="font-black text-2xl text-zinc-400">KOLAS</span>
                            </div>
                            <span className="text-sm text-zinc-400">방염 성능 통과</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                                <span className="font-black text-2xl text-zinc-400">UL</span>
                            </div>
                            <span className="text-sm text-zinc-400">국제 난연 인증</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                                <span className="font-black text-2xl text-zinc-400">1000℃</span>
                            </div>
                            <span className="text-sm text-zinc-400">초고온 내열 테스트</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. B2B 스마트 견적 & Lead Generation */}
            <section aria-label="EV 충전구역 방화코팅 견적" className="py-32 relative bg-gradient-to-b from-zinc-950 to-zinc-900 border-t border-zinc-800 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full" />
                </div>

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative">
                        {/* 장식용 */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full" />

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    우리 현장에는<br />
                                    <span className="text-amber-500">얼마나 필요할까?</span>
                                </h2>
                                <p className="text-zinc-400 mb-8 leading-relaxed">
                                    전기차 충전구역의 면적과 설치 환경에 맞춘 최적의 물량 산출 결과를 바로 확인해 보세요. 전문 시공팀의 상세 견적도 문의하실 수 있습니다.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3 text-zinc-300">
                                        <CheckCircle className="w-5 h-5 text-amber-500" />
                                        <span>면적 기반 즉각적인 물량 결과 제공</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-300">
                                        <CheckCircle className="w-5 h-5 text-amber-500" />
                                        <span>맞춤형 시공 스펙 추천</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 text-center">
                                <Calculator className="w-16 h-16 text-amber-600 mx-auto mb-6 opacity-80" />
                                <h3 className="text-xl font-bold text-white mb-2">EV 전용 견적 계산기</h3>
                                <p className="text-sm text-zinc-500 mb-8">안전 확보를 위한 첫 걸음을 시작하세요</p>

                                <Link href={`/${currentLocale}/contact`} className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                                    <Calculator className="w-5 h-5" />
                                    스마트 물량 산출하기
                                </Link>

                                <p className="mt-4 text-xs text-zinc-600">
                                    * 상세 견적은 공식 대리점/영업팀을 통해 확정됩니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
