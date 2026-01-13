import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import { CompanyDownloadCTA } from '@/components/company/CompanyDownloadCTA';
import { Quote } from 'lucide-react';

// ============================================================================
// CEO 인사말 페이지 (/company/ceo)
// ============================================================================

export default function CEOPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-amber-500 selection:text-white">
            <CustomCursor />
            <Navbar />

            <main className="pt-24">
                {/* Hero Section */}
                <section className="relative py-24 px-6 border-b border-gray-200 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                            <span>Home</span>
                            <span>/</span>
                            <span>기업소개</span>
                            <span>/</span>
                            <span className="text-gray-900 font-bold">CEO 인사말</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900">
                            CEO <span className="text-amber-600">인사말</span>
                        </h1>
                        <p className="text-gray-500 text-lg max-w-3xl leading-relaxed">
                            한미르(주)를 찾아주신 여러분께 진심으로 감사드립니다.
                        </p>
                    </div>
                </section>

                {/* CEO 인사말 본문 */}
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* CEO 이미지 */}
                        <div className="order-2 lg:order-1">
                            <div className="relative">
                                <div className="w-full aspect-[3/4] bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-xl">
                                    <img
                                        src="/ceo.jpg"
                                        alt="한미르(주) 대표이사"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* 장식 요소 */}
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-500/20 rounded-lg -z-10" />
                            </div>
                        </div>

                        {/* 인사말 텍스트 */}
                        <div className="order-1 lg:order-2">
                            <Quote className="w-12 h-12 text-amber-500 mb-6" />

                            <div className="space-y-6 text-gray-600 leading-relaxed">
                                <p className="text-xl font-medium text-gray-900">
                                    안녕하십니까, 한미르(주) 대표이사입니다.
                                </p>

                                <p>
                                    저희 한미르(주)는 2009년 창립 이래 "기술로 세상을 안전하게"라는
                                    신념 아래, 불연·방열·전자파 차폐 등 특수 기능성 도료 개발에
                                    매진해왔습니다.
                                </p>

                                <p>
                                    끊임없는 연구개발과 품질 혁신을 통해 국내외 다양한 산업 분야에서
                                    신뢰받는 파트너로 자리매김하고 있으며, 42개 이상의 특허를 보유한
                                    기술 선도 기업으로 성장해왔습니다.
                                </p>

                                <p>
                                    앞으로도 지속적인 R&D 투자와 글로벌 네트워크 확장을 통해
                                    세계적인 화학 소재 기업으로 도약하겠습니다. 고객 여러분의
                                    변함없는 관심과 성원을 부탁드립니다.
                                </p>

                                <p className="text-lg font-bold text-gray-900 pt-4">
                                    감사합니다.
                                </p>
                            </div>

                            {/* CEO 서명 */}
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <p className="text-sm text-gray-400 mb-2">한미르(주) 대표이사</p>
                                <p className="text-2xl font-bold text-gray-900">대표이사</p>
                            </div>

                            {/* 통계 */}
                            <div className="flex gap-8 mt-8">
                                <div>
                                    <p className="text-3xl font-bold text-amber-600">16+</p>
                                    <p className="text-gray-500 text-sm mt-1">Years of History</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-amber-600">42+</p>
                                    <p className="text-gray-500 text-sm mt-1">Patents Held</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-amber-600">5+</p>
                                    <p className="text-gray-500 text-sm mt-1">Export Countries</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 회사소개서 다운로드 */}
                <CompanyDownloadCTA />
            </main>

            <Footer />
        </div>
    );
}
