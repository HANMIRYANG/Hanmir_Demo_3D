import React from 'react';

export const Contact: React.FC = () => {
    return (
        <section id="contact" className="py-32 bg-black relative border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-tight">
                        한미르와 함께<br/>혁신을 시작하세요
                    </h2>
                    <p className="text-zinc-400 text-lg mb-12 max-w-md break-keep">
                        귀사의 프로젝트에 최적화된 기능성 도료 솔루션을 제안해 드립니다. 전문 연구진이 상담을 도와드립니다.
                    </p>
                    
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">본사 및 연구소</h4>
                            <p className="text-zinc-500">경기도 화성시 동탄첨단산업1로<br/>(우) 18469</p>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">연락처</h4>
                            <p className="text-zinc-500">sales@hanmir.co.kr<br/>031-123-4567</p>
                        </div>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500">담당자 성명</label>
                            <input type="text" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:outline-none focus:border-white transition-colors rounded-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500">연락처</label>
                            <input type="text" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:outline-none focus:border-white transition-colors rounded-none" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500">이메일</label>
                        <input type="email" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:outline-none focus:border-white transition-colors rounded-none" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500">관심 분야</label>
                        <select className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:outline-none focus:border-white transition-colors rounded-none appearance-none">
                            <option>자동차 부품 코팅</option>
                            <option>항공/우주/방산</option>
                            <option>로봇 & 자동화 설비</option>
                            <option>건축 및 중공업</option>
                            <option>기타 특수 목적</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                         <label className="text-xs font-bold text-zinc-500">문의 내용</label>
                        <textarea rows={4} className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:outline-none focus:border-white transition-colors rounded-none" placeholder="프로젝트 요건이나 필요한 도료의 사양을 입력해주세요."></textarea>
                    </div>

                    <button className="w-full bg-white text-black font-bold py-5 hover:bg-zinc-200 transition-colors">
                        상담 신청하기
                    </button>
                </form>
            </div>
        </section>
    );
};