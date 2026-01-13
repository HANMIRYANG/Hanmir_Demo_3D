import { Thermometer, Shield, Zap, Droplets, Layers, Microscope, Battery, Building2, Tv } from 'lucide-react';

// Feature Section 정의
export interface FeatureSection {
    title: string;
    description: string;
    image: string;
}

export interface ProductData {
    id: string;
    title: string;
    koreanTitle: string;
    description: string;
    longDescription: string;
    icon: any;
    heroImage: string;
    features: string[];
    featureSections: FeatureSection[];
    techSpecs: Record<string, string>;
    applications: string[];
    isDevelopment?: boolean; // 개발 진행중 표시
}

export const products: Record<string, ProductData> = {
    // ========================================
    // 페인트 (기능성 도료 솔루션)
    // ========================================
    "paint": {
        id: "paint",
        title: "Functional Paint Solutions",
        koreanTitle: "기능성 도료 솔루션",
        description: "방열, 불연, EMI 차폐, 초발수 등 다양한 기능성 도료의 원스톱 솔루션",
        longDescription: "한미르는 20년간의 연구개발을 통해 방열, 불연, 전자파 차폐, 초발수, 자가치유, 정밀 박막 등 다양한 기능성 도료를 개발해왔습니다. 산업별 맞춤 솔루션을 제공하며, ISO 9001 품질경영 인증과 다수의 특허를 보유하고 있습니다.",
        icon: Layers,
        heroImage: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2670&auto=format&fit=crop",
        features: [
            "방열 코팅 - 기기 과열 방지, 30% 향상된 열전도 효율",
            "불연 도료 - ISO 1182 인증, 유독가스 Zero",
            "EMI 차폐 - 30MHz~10GHz 광대역 차폐",
            "초발수 코팅 - 접촉각 155° 이상, 자가 세정",
            "자가치유 - 스크래치 자동 복원",
            "정밀 박막 - 나노 단위 두께 제어"
        ],
        featureSections: [
            {
                title: "다양한 기능성 도료 라인업",
                description: "방열, 불연, EMI 차폐, 초발수, 자가치유, 정밀 박막 등 산업별 맞춤 솔루션을 제공합니다. 20년간의 R&D를 통해 축적된 기술력으로 최고의 품질을 보장합니다.",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2532&auto=format&fit=crop"
            },
            {
                title: "국제 인증과 특허 보유",
                description: "ISO 9001 품질경영 인증, ISO 1182 불연재 인증을 보유하고 있으며, 핵심 기술 관련 다수의 국내외 특허를 등록하고 있습니다.",
                image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop"
            },
            {
                title: "맞춤형 솔루션 제공",
                description: "고객의 요구사항에 맞춘 맞춤형 도료 개발 서비스를 제공합니다. 기재 분석부터 시제품 제작, 양산까지 원스톱으로 지원합니다.",
                image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2670&auto=format&fit=crop"
            }
        ],
        techSpecs: {
            "방열 코팅 열전도율": "12 W/m·K 이상",
            "불연 등급": "ISO 1182 (불연재)",
            "EMI 차폐 효과": "평균 60dB 이상",
            "초발수 접촉각": "> 155°",
            "자가치유 복원율": "90% 이상",
            "박막 두께 정밀도": "± 5% 이내"
        },
        applications: [
            "전자/IT - 스마트폰, LED, 배터리 하우징",
            "산업/건설 - 공장, 데이터센터, 터널",
            "모빌리티 - 전기차, 드론, 항공"
        ]
    },

    // ========================================
    // 2차전지 열폭방지 면압패드
    // ========================================
    "battery-pad": {
        id: "battery-pad",
        title: "Battery Thermal Runaway Prevention Pad",
        koreanTitle: "2차 전지 열폭방지 면압패드",
        description: "전기차 배터리의 열폭주를 방지하고 안전성을 극대화하는 고성능 면압패드",
        longDescription: "전기차(EV)와 에너지 저장장치(ESS)의 핵심 안전 부품인 열폭방지 면압패드입니다. 배터리 셀 간 균일한 압력 분산과 우수한 열관리 성능으로 열폭주(Thermal Runaway) 현상을 효과적으로 방지합니다. 고온에서도 물성을 유지하는 특수 실리콘 소재를 사용하여 배터리 수명 전체에 걸쳐 안정적인 성능을 보장합니다.",
        icon: Battery,
        heroImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2672&auto=format&fit=crop",
        features: [
            "균일 압력 분산으로 배터리 셀 보호",
            "300°C 이상의 고온 안정성",
            "열전도와 열차단 동시 구현",
            "10만회 이상 반복 압축에도 복원력 유지"
        ],
        featureSections: [
            {
                title: "열폭주 방지 기술",
                description: "배터리 셀 간 열전파를 차단하여 한 셀의 과열이 인접 셀로 확산되는 것을 방지합니다. 화재와 폭발 위험을 원천적으로 차단하는 핵심 안전 솔루션입니다.",
                image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2670&auto=format&fit=crop"
            },
            {
                title: "균일 압력 분산 설계",
                description: "±2% 이내의 압력 편차로 배터리 셀 전체에 균일한 압력을 가합니다. 셀 간 접촉 저항을 최소화하고 배터리 효율과 수명을 향상시킵니다.",
                image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=2671&auto=format&fit=crop"
            },
            {
                title: "고내열 특수 소재",
                description: "300°C 이상의 고온에서도 물성을 유지하는 특수 실리콘 컴파운드를 사용합니다. 배터리 수명 전체(10년 이상)에 걸쳐 안정적인 성능을 보장합니다.",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2532&auto=format&fit=crop"
            }
        ],
        techSpecs: {
            "압력 분산 균일도": "±2% 이내",
            "내열 온도": "연속 260°C / 순간 300°C",
            "압축률": "20~40% (조절 가능)",
            "복원율": "95% 이상 (10만회 반복)",
            "열전도율": "0.5~3.0 W/m·K (사양별)",
            "두께 범위": "0.5mm ~ 5mm"
        },
        applications: [
            "전기차(EV) 배터리팩",
            "에너지 저장장치(ESS)",
            "배터리 모듈 조립 공정",
            "하이브리드 차량 배터리"
        ]
    },

    // ========================================
    // 건축자재
    // ========================================
    "building-materials": {
        id: "building-materials",
        title: "Eco-Friendly Building Materials",
        koreanTitle: "친환경 건축자재",
        description: "단열, 불연, 흡음 성능을 갖춘 차세대 친환경 건축 소재",
        longDescription: "한미르의 건축자재는 무기질 불연 소재를 기반으로 뛰어난 단열 성능과 화재 안전성을 동시에 제공합니다. 녹색건축 인증(G-SEED)과 에너지 효율 기준을 충족하며, 실내 공기질을 깨끗하게 유지하는 친환경 소재입니다.",
        icon: Building2,
        heroImage: "https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=2574&auto=format&fit=crop",
        features: [
            "무기질 불연 코어로 화재 안전",
            "고단열 에어로젤 기술 적용",
            "VOC Free 친환경 소재",
            "흡음, 차음 성능 우수"
        ],
        featureSections: [
            {
                title: "불연 + 단열 복합 성능",
                description: "무기질 소재로 화재 시 화염 확산을 완벽히 차단하면서도, 에어로젤 기술로 열관류율 0.15W/m²K 수준의 우수한 단열 성능을 제공합니다.",
                image: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=2574&auto=format&fit=crop"
            },
            {
                title: "녹색건축 인증 충족",
                description: "G-SEED(녹색건축인증), 에너지 효율 등급, 제로에너지건축물 인증 기준을 충족합니다. 탄소 중립 건축물 구현에 기여합니다.",
                image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2613&auto=format&fit=crop"
            },
            {
                title: "친환경 실내 환경",
                description: "포름알데히드, VOC가 전혀 없는 친환경 소재로 새집증후군 걱정 없이 쾌적한 실내 환경을 유지할 수 있습니다.",
                image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop"
            }
        ],
        techSpecs: {
            "불연 등급": "불연재 (KS F ISO 1182)",
            "열관류율": "0.15 W/m²K 이하",
            "흡음 계수": "NRC 0.85 이상",
            "포름알데히드 방출": "E0 / SE0 등급",
            "압축 강도": "0.5 MPa 이상"
        },
        applications: [
            "오피스, 호텔, 병원 등 상업시설",
            "아파트, 주택 등 주거시설",
            "공장, 물류센터 등 산업시설",
            "지하철역, 터널 등 공공시설"
        ]
    },

    // ========================================
    // 가전제품 코팅 (개발 진행중)
    // ========================================
    "home-appliances": {
        id: "home-appliances",
        title: "Home Appliance Coating Solutions",
        koreanTitle: "가전제품 코팅 솔루션",
        description: "프리미엄 가전의 외관과 내구성을 높이는 특수 코팅 기술",
        longDescription: "가전제품의 외장재와 내부 부품에 적용되는 특수 코팅 솔루션입니다. 항균, 지문방지(AFP), 자가치유 등 다양한 기능을 통해 제품의 가치를 높이고 사용자 경험을 개선합니다.",
        icon: Tv,
        heroImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2670&auto=format&fit=crop",
        isDevelopment: true, // ⚠️ 개발 진행중
        features: [
            "99.9% 항균 코팅 기술",
            "지문방지(AFP) 코팅",
            "스크래치 자가치유 기능",
            "프리미엄 광택 마감"
        ],
        featureSections: [
            {
                title: "항균 코팅 기술",
                description: "은(Ag) 나노 입자를 활용한 항균 코팅으로 99.9%의 세균을 제거합니다. 위생이 중요한 주방가전과 건강가전에 최적화된 솔루션입니다. (개발 진행중)",
                image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=2670&auto=format&fit=crop"
            },
            {
                title: "지문방지(AFP) 코팅",
                description: "올레오포빅(Oleophobic) 특성을 가진 코팅으로 지문과 유분이 묻지 않습니다. 터치 패널과 스테인리스 외장재에 적용됩니다. (개발 진행중)",
                image: "https://images.unsplash.com/photo-1609619385002-f40f1df9b7eb?q=80&w=2670&auto=format&fit=crop"
            },
            {
                title: "자가치유 외장 코팅",
                description: "일상적인 스크래치가 열에 의해 자동으로 복원되어 항상 새것 같은 외관을 유지합니다. 프리미엄 가전 브랜드에 적합합니다. (개발 진행중)",
                image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=2676&auto=format&fit=crop"
            }
        ],
        techSpecs: {
            "항균 효과": "99.9% (KS 시험 예정)",
            "지문방지 접촉각": "> 110° (예정)",
            "자가치유 복원율": "85% 이상 (목표)",
            "광택도": "90 GU 이상"
        },
        applications: [
            "냉장고, 세탁기, 에어컨 등 백색가전",
            "커피머신, 에어프라이어 등 소형가전",
            "인덕션, 후드 등 주방가전",
            "TV, 오디오 등 AV 기기"
        ]
    }
};
