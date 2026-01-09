import React from 'react';
import { Shield, Zap, Thermometer, Droplets, Layers, Microscope } from 'lucide-react';

const features = [
    {
        title: "초고성능 방열 코팅",
        desc: "열전도율을 극대화하여 기기의 과열을 방지하고 성능 저하를 막는 특수 방열 페인트 기술.",
        icon: <Thermometer className="w-6 h-6 text-white" />
    },
    {
        title: "친환경 불연 도료",
        desc: "화재 시 유독 가스를 배출하지 않으며 화염 확산을 원천 차단하는 세라믹 기반 불연재.",
        icon: <Shield className="w-6 h-6 text-white" />
    },
    {
        title: "전자파 차폐(EMI)",
        desc: "전도성 입자를 활용하여 정밀 전자기기를 외부 간섭으로부터 보호하는 차폐 코팅 솔루션.",
        icon: <Zap className="w-6 h-6 text-white" />
    },
    {
        title: "초발수 & 오염 방지",
        desc: "연잎 효과(Lotus Effect)를 모방한 나노 표면 처리로 수분과 오염물질을 완벽하게 차단.",
        icon: <Droplets className="w-6 h-6 text-white" />
    },
     {
        title: "자가 치유(Self-Healing)",
        desc: "표면 스크래치 발생 시 마이크로 캡슐이 반응하여 도막을 자동으로 복구하는 스마트 기술.",
        icon: <Layers className="w-6 h-6 text-white" />
    },
     {
        title: "정밀 박막 코팅",
        desc: "나노 단위의 두께 제어로 부품의 원래 치수와 형상을 유지하면서 기능을 부여하는 기술.",
        icon: <Microscope className="w-6 h-6 text-white" />
    }
];

export const Features: React.FC = () => {
    return (
        <section id="technology" className="py-32 bg-zinc-950 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-zinc-800 pb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">핵심 기술 (Core Technology)</h2>
                        <p className="text-zinc-500 font-medium text-sm">한미르(주)만의 독자적인 분자 배합 기술</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-zinc-500 text-sm font-medium">ISO 9001:2015 / 14001 인증</p>
                        <p className="text-zinc-500 text-sm font-medium">기업부설연구소 보유</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-zinc-950 p-10 hover:bg-zinc-900 transition-colors group cursor-crosshair relative overflow-hidden">
                            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] text-zinc-500 font-mono">CODE 0{idx + 1}</span>
                            </div>
                            <div className="mb-6 p-4 bg-zinc-900 w-fit rounded-none border border-zinc-800 group-hover:border-blue-500 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed break-keep">{feature.desc}</p>
                            
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};