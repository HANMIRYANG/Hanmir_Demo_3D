import React from 'react';
import { ArrowDown, ChevronRight } from 'lucide-react';

export const Hero: React.FC = () => {
    return (
        <section className="relative w-full h-screen overflow-hidden bg-black flex flex-col justify-end pb-20">
            {/* 3D Background */}
            <div className="absolute inset-0 w-full h-full z-0">
                <iframe 
                    src='https://my.spline.design/nexbotrobotcharacterconcept-QN3RdrGqvI6Hw5n5v1RsASsN/' 
                    frameBorder='0' 
                    width='100%' 
                    height='100%'
                    className="w-full h-full opacity-60 grayscale-[30%] contrast-125 scale-110"
                    title="HANMIR Robot Concept"
                ></iframe>
                {/* Overlays for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-3xl">
                    <div className="flex items-center gap-4 mb-6">
                         <span className="px-3 py-1 border border-zinc-700 bg-black/50 backdrop-blur text-[11px] font-bold text-zinc-300">
                            The Future of Functional Coating
                        </span>
                        <div className="h-[1px] w-20 bg-zinc-700"></div>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8">
                        보이지 않는 곳에서 <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-500">
                            완벽을 칠하다
                        </span>
                    </h1>
                    
                    <p className="text-zinc-400 text-lg md:text-xl max-w-xl leading-relaxed mb-10 font-light break-keep">
                        한미르(주)는 방열, 불연, 전자파 차폐 등 특수 목적을 위한 고기능성 도료를 개발합니다. 
                        극한의 환경에서도 변하지 않는 가치를 경험하십시오.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6">
                        <button className="flex items-center justify-between px-8 py-4 bg-white text-black min-w-[200px] hover:bg-zinc-200 transition-colors group">
                            <span className="text-xs font-bold">제품 살펴보기</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="flex items-center justify-between px-8 py-4 border border-zinc-700 text-white min-w-[200px] hover:bg-white/5 transition-colors group backdrop-blur-sm">
                            <span className="text-xs font-bold">기술 문의하기</span>
                            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 z-20 opacity-50">
                <span className="text-[10px] tracking-widest uppercase rotate-90 origin-right translate-x-4">Scroll</span>
                <div className="w-[1px] h-16 bg-zinc-700 mt-8"></div>
            </div>
        </section>
    );
};