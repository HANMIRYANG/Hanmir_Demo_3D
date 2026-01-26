// Feature Section 정의
export interface FeatureSection {
    title: string;
    description: string;
    image: string;
}

// 아이콘 특징 섹션 정의
export interface IconFeature {
    icon: string;  // lucide 아이콘 이름
    title: string;
    desc: string;
}

export interface ProductData {
    title: string;
    koreanTitle: string;
    description: string;
    longDescription: string;
    heroImage: string;
    features: string[];
    featureSections: FeatureSection[];
    techSpecs: Record<string, string>;
    applications: string[];
    isDevelopment?: boolean; // 개발 진행중 표시
    iconFeatures?: IconFeature[]; // 히어로 섹션 아래 아이콘 특징
}

export const products: Record<string, ProductData> = {
    // ========================================
    // 2차전지 열폭방지 면압패드
    // ========================================
    "battery-pad": {
        title: "Battery Thermal Runaway Prevention Pad",
        koreanTitle: "2차 전지 열폭방지 면압패드",
        description: "전기차 배터리의 열폭주를 방지하고 안전성을 극대화하는 고성능 면압패드",
        longDescription: "전기차(EV)와 에너지 저장장치(ESS)의 핵심 안전 부품인 열폭방지 면압패드입니다. 배터리 셀 간 균일한 압력 분산과 우수한 열관리 성능으로 열폭주(Thermal Runaway) 현상을 효과적으로 방지합니다. 고온에서도 물성을 유지하는 특수 실리콘 소재를 사용하여 배터리 수명 전체에 걸쳐 안정적인 성능을 보장합니다.",
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
        ],
        iconFeatures: [
            { icon: "Flame", title: "열폭방지", desc: "배터리 셀 간 열전파 차단" },
            { icon: "Target", title: "균일 압력", desc: "±2% 이내 압력 편차" },
            { icon: "Thermometer", title: "고내열", desc: "300°C 이상 고온 안정성" }
        ]
    },

    // ========================================
    // 건축자재
    // ========================================
    "building-materials": {
        title: "Eco-Friendly Building Materials",
        koreanTitle: "친환경 건축자재",
        description: "단열, 불연, 흡음 성능을 갖춘 차세대 친환경 건축 소재",
        longDescription: "한미르의 건축자재는 화재에 타지 않는 무기질 불연 소재를 기반으로, 화염 확산을 차단하는 동시에 탁월한 단열 성능을 제공합니다. 여름철 열기와 겨울철 냉기를 완벽히 차단하여 에너지 효율을 극대화하는 고기능성 자재입니다. 안전한 공간과 쾌적한 온도를 위한 최적의 솔루션을 제안합니다.",
        heroImage: "https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=2574&auto=format&fit=crop",
        features: [
            "무기질 불연 코어로 화재 안전",
            "고단열 에어로젤 기술 적용",
            "우수건축자재 선정 입증",
            "흡음, 차음 성능 우수"
        ],
        featureSections: [
            {
                title: "불연 + 단열 복합 성능",
                description: "무기질 소재로 화재 시 화염 확산을 완벽히 차단하면서도, 에어로젤 기술로 열관류율 0.15W/m²K 수준의 우수한 단열 성능을 제공합니다.",
                image: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=2574&auto=format&fit=crop"
            },
            {
                title: "우수건축자재 선정 입증",
                description: "대한건축사협회 주관 '우수건축자재'로 공식 선정되어, 건축 현장에서의 품질 신뢰성과 시공 안정성을 검증받았습니다.",
                image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2613&auto=format&fit=crop"
            },
            {
                title: "유해물질 걱정 없는 안전성",
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
        ],
        iconFeatures: [
            { icon: "ShieldCheck", title: "불연+단열", desc: "화재 안전성과 단열 동시 제공" },
            { icon: "Leaf", title: "우수건축자재", desc: "우수건축자재 선정 입증" },
            { icon: "Award", title: "안전성", desc: "유해물질 걱정 없는 안전성" }
        ]
    },

    // ========================================
    // 가전제품 코팅 (개발 진행중)
    // ========================================
    "home-appliances": {
        title: "Home Appliance Coating Solutions",
        koreanTitle: "가전제품 코팅 솔루션",
        description: "프리미엄 가전의 외관과 내구성을 높이는 특수 코팅 기술",
        longDescription: "가전제품의 외장재와 내부 부품에 적용되는 특수 코팅 솔루션입니다. 항균, 지문방지(AFP), 자가치유 등 다양한 기능을 통해 제품의 가치를 높이고 사용자 경험을 개선합니다.",
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
        ],
        iconFeatures: [
            { icon: "Shield", title: "항균", desc: "99.9% 세균 제거" },
            { icon: "Fingerprint", title: "지문방지", desc: "지문과 유분 부착 방지" },
            { icon: "Sparkles", title: "자가치유", desc: "스크래치 자동 복원" }
        ]
    }
};
