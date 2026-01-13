import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/CustomCursor';
import { CompanyDownloadCTA } from '@/components/company/CompanyDownloadCTA';
import { MapPin, Phone, Mail, Clock, Car, Train, Bus } from 'lucide-react';

// ============================================================================
// 위치 페이지 (/company/location)
// ============================================================================

export default function LocationPage() {
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
                            <span className="text-gray-900 font-bold">위치</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900">
                            오시는 <span className="text-amber-600">길</span>
                        </h1>
                        <p className="text-gray-500 text-lg max-w-3xl leading-relaxed">
                            한미르(주) 본사를 방문해주셔서 감사합니다.
                        </p>
                    </div>
                </section>

                {/* 지도 및 정보 */}
                <section className="py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* 지도 */}
                            <div className="order-2 lg:order-1">
                                <div className="aspect-square lg:aspect-auto lg:h-[500px] bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3161.619442523186!2d126.62113069999998!3d37.58757800000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357c8011c5cbd9a3%3A0xdc422f7087fd2a48!2z7J247LKc6rSR7Jet7IucIOyEnOq1rCDrj4Tri7TroZwgMTkw!5e0!3m2!1sko!2skr!4v1768291051183!5m2!1sko!2skr"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>

                                {/* 구글 지도 링크 */}
                                <a
                                    href="https://share.google/J0WwR1HdaBGBthQyB"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
                                >
                                    <MapPin className="w-4 h-4" />
                                    구글 지도에서 열기
                                </a>
                            </div>

                            {/* 연락처 정보 */}
                            <div className="order-1 lg:order-2">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8">본사</h2>

                                <div className="space-y-6">
                                    {/* 주소 */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">주소</h3>
                                            <p className="text-gray-600">인천 서구 도담로 190</p>
                                            <p className="text-gray-400 text-sm">(우편번호: 22824)</p>
                                        </div>
                                    </div>

                                    {/* 전화 */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">전화</h3>
                                            <p className="text-gray-600">1533-2112</p>
                                        </div>
                                    </div>

                                    {/* 이메일 */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">이메일</h3>
                                            <p className="text-gray-600">hanmir@hanmirfe.com</p>
                                        </div>
                                    </div>

                                    {/* 운영시간 */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">운영시간</h3>
                                            <p className="text-gray-600">월-금 09:00 - 18:00</p>
                                            <p className="text-gray-400 text-sm">주말 및 공휴일 휴무</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 교통편 안내 */}
                                <div className="mt-12 pt-8 border-t border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">교통편 안내</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Car className="w-5 h-5 text-amber-500 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-900">자가용</p>
                                                <p className="text-sm text-gray-500">서인천IC에서 약 10분 거리</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Train className="w-5 h-5 text-amber-500 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-900">지하철</p>
                                                <p className="text-sm text-gray-500">인천2호선 검단오류역 하차, 택시 5분</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Bus className="w-5 h-5 text-amber-500 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-900">버스</p>
                                                <p className="text-sm text-gray-500">간선 60, 62번 도담로 정류장 하차</p>
                                            </div>
                                        </div>
                                    </div>
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
