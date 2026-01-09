import { Thermometer, Shield, Zap, Droplets, Layers, Microscope } from 'lucide-react';

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
    featureSections: FeatureSection[];  // 새로 추가
    techSpecs: Record<string, string>;
    applications: string[];
}

export const products: Record<string, ProductData> = {
    "heat-dissipation": {
        id: "heat-dissipation",
        title: "High-Performance Heat Dissipation Coating",
        koreanTitle: "고성능 방열 코팅",
        description: "기기의 과열을 방지하고 성능 저하를 막는 특수 방열 페인트 기술",
        longDescription: "한미르의 방열 코팅 솔루션은 전자기기와 산업 설비에서 발생하는 열을 효과적으로 방출하여 시스템의 안정성을 보장합니다. 독자적인 나노 입자 배합 기술로 기존 방열 소재 대비 30% 이상의 열전도 효율 향상을 달성했습니다.",
        icon: Thermometer,
        heroImage: "https://images.unsplash.com/photo-1618052445524-7e8876409b69?q=80&w=2670&auto=format&fit=crop",
        features: [
            "탁월한 열전도율 및 열방사율",
            "초박막 코팅으로 공간 효율 극대화",
            "내화학성 및 내식성 보유",
            "다양한 기재에 적용 가능"
        ],
        featureSections: [
            {
                title: "탁월한 열전도 성능",
                description: "독자적인 나노 입자 배합 기술로 기존 방열 소재 대비 30% 이상의 열전도 효율 향상을 달성했습니다. 고밀도 열 방사층이 열에너지를 적외선으로 변환하여 빠르게 방출합니다.",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2532&auto=format&fit=crop"
            },
            {
                title: "초박막 설계",
                description: "10~30㎛의 극도로 얇은 도막 두께로도 우수한 방열 성능을 발휘합니다. 전자기기의 소형화 트렌드에 최적화된 공간 효율적 솔루션입니다.",
                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop"
            },
            {
                title: "다양한 기재 호환성",
                description: "알루미늄, 구리, 스테인리스 스틸 등 금속 소재는 물론 PC, ABS 등 엔지니어링 플라스틱에도 우수한 밀착력으로 적용 가능합니다.",
                image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop"
            }
        ],
        techSpecs: {
            "열전도율": "12 W/m·K 이상",
            "방사율": "0.95 @ 5~20㎛",
            "내열 온도": "최대 600°C",
            "밀착성": "5B (ASTM D3359)",
            "경도": "4H 이상"
        },
        applications: [
            "LED 모듈 방열판",
            "스마트폰 및 모바일 기기 케이스",
            "전기차(EV) 배터리 하우징",
            "고출력 파워 서플라이"
        ]
    },
    "non-combustible": {
        id: "non-combustible",
        title: "Eco-Friendly Non-Combustible Paint",
        koreanTitle: "친환경 불연 도료",
        description: "화재 시 유독 가스를 배출하지 않으며 화염 확산을 원천 차단",
        longDescription: "안전은 타협할 수 없는 가치입니다. 한미르의 무기질 불연 도료는 화재 발생 시 화염의 전파를 막고 유독 가스를 생성하지 않아 골든타임을 확보합니다. 100% 친환경 무기질 바인더를 사용하여 인체에 무해합니다.",
        icon: Shield,
        heroImage: "https://images.unsplash.com/photo-1621252179027-94459d27d3ee?q=80&w=2670&auto=format&fit=crop",
        features: [
            "불연 등급 (난연 1급) 인증 획득",
            "유독 가스 방출 '0' (Zero)",
            "우수한 항곰팡이 및 항균 성능",
            "VOCs(휘발성 유기화합물) Free"
        ],
        featureSections: [
            {
                title: "완벽한 화염 차단",
                description: "ISO 1182 불연재 인증을 획득한 무기질 도료로, 화재 발생 시에도 화염이 도료 표면에서 확산되지 않습니다. 대형 화재 사고를 예방하는 첫 번째 방어선입니다.",
                image: "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=2574&auto=format&fit=crop"
            },
            {
                title: "유독 가스 Zero",
                description: "화재 시 인명피해의 주요 원인인 유독 가스를 전혀 발생시키지 않습니다. 대피 시간인 '골든타임'을 확보하여 소중한 생명을 보호합니다.",
                image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2670&auto=format&fit=crop"
            },
            {
                title: "친환경 무기질 소재",
                description: "100% 친환경 무기질 바인더를 사용하여 VOCs(휘발성 유기화합물)가 전혀 없습니다. 실내 공기질을 깨끗하게 유지하며 새집증후군 걱정이 없습니다.",
                image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2613&auto=format&fit=crop"
            }
        ],
        techSpecs: {
            "불연 등급": "ISO 1182 (불연재)",
            "가스 유해성": "Pass (KS F 2271)",
            "건조 시간": "지촉 30분 / 경화 24시간",
            "밀도": "1.5 ± 0.1 g/cm³"
        },
        applications: [
            "반도체 공장 클린룸",
            "데이터 센터 서버실",
            "지하철 및 터널 내벽",
            "다중 이용 시설 인테리어"
        ]
    },
    "emi-shielding": {
        id: "emi-shielding",
        title: "EMI Shielding Coating",
        koreanTitle: "전자파 차폐(EMI)",
        description: "정밀 전자기기를 외부 간섭으로부터 보호하는 차폐 솔루션",
        longDescription: "전도성 필러가 고밀도로 분산된 코팅막을 형성하여 불필요한 전자파 노이즈를 반사하거나 흡수합니다. 복잡한 형상의 부품에도 스프레이 방식으로 균일한 차폐층을 형성할 수 있어 설계 자유도를 높여줍니다.",
        icon: Zap,
        heroImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
        features: [
            "광대역 주파수 차폐 (30MHz ~ 10GHz)",
            "우수한 전기 전도성",
            "박막 코팅으로 경량화 실현",
            "비용 효율적인 스프레이 공정"
        ],
        featureSections: [
            {
                title: "광대역 주파수 차폐",
                description: "30MHz부터 10GHz까지 광범위한 주파수 대역에서 평균 60dB 이상의 우수한 차폐 효과를 발휘합니다. 5G 통신 시대의 전자파 간섭 문제를 해결합니다.",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"
            },
            {
                title: "스프레이 코팅 방식",
                description: "복잡한 3D 형상의 부품에도 균일한 차폐층을 형성할 수 있습니다. 기존 금속 케이스 대비 경량화와 설계 자유도를 동시에 확보합니다.",
                image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2670&auto=format&fit=crop"
            },
            {
                title: "초박막 경량 설계",
                description: "15~25㎛의 얇은 도막으로도 우수한 차폐 성능을 발휘하여 제품의 무게 증가를 최소화합니다. 모바일 기기와 웨어러블 디바이스에 최적화되었습니다.",
                image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2670&auto=format&fit=crop"
            }
        ],
        techSpecs: {
            "차폐 효과(SE)": "평균 60dB 이상",
            "표면 저항": "< 0.1 Ω/sq",
            "권장 두께": "15 ~ 25 ㎛",
            "부착 성능": "100/100 (Cross-cut test)"
        },
        applications: [
            "통신 장비 및 중계기",
            "의료 기기 (MRI, CT 등)",
            "국방 및 항공 우주 전자 장비",
            "드론 및 자율주행 센서부"
        ]
    },
    "hydrophobic": {
        id: "hydrophobic",
        title: "Super Hydrophobic & Anti-Fouling",
        koreanTitle: "초발수 & 오염 방지",
        description: "수분과 오염물질을 완벽하게 차단하는 나노 표면 기술",
        longDescription: "연잎의 표면 구조를 모방한 나노 텍스처링 기술로 물방울이 표면에 맺히지 않고 굴러떨어지게 만듭니다. 이 과정에서 먼지와 오염물질이 함께 제거되는 '자가 세정(Self-Cleaning)' 효과를 발휘합니다.",
        icon: Droplets,
        heroImage: "https://images.unsplash.com/photo-1518640165980-d3e0e2aa2bfb?q=80&w=2670&auto=format&fit=crop",
        features: [
            "접촉각 150도 이상의 초발수성",
            "유성 오염물에 대한 발유성 겸비",
            "동결 방지 (Anti-Icing) 효과",
            "투명하고 얇은 코팅막 유지"
        ],
        featureSections: [
            {
                title: "연잎 효과 (Lotus Effect)",
                description: "자연의 연잎 표면 구조를 모방한 나노 텍스처링 기술입니다. 물방울이 표면에 맺히지 않고 굴러떨어지며 오염물질을 함께 제거합니다.",
                image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2673&auto=format&fit=crop"
            },
            {
                title: "자가 세정 기능",
                description: "빗물만으로도 표면의 먼지와 오염물질이 깨끗하게 씻겨 나갑니다. 유지보수 비용을 획기적으로 절감하고 항상 깨끗한 상태를 유지합니다.",
                image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2574&auto=format&fit=crop"
            },
            {
                title: "결빙 방지 효과",
                description: "물방울이 표면에 머무르지 않아 동절기 결빙 현상을 방지합니다. 태양광 패널, CCTV 렌즈 등 옥외 설비의 성능 저하를 막습니다.",
                image: "https://images.unsplash.com/photo-1478719059408-592965723cbc?q=80&w=2662&auto=format&fit=crop"
            }
        ],
        techSpecs: {
            "물 접촉각": "> 155°",
            "구름각(Sliding Angle)": "< 5°",
            "투과율": "98% 이상 (투명 타입)",
            "내구 수명": "옥외 5년 이상 (가속 내후성)"
        },
        applications: [
            "태양광 패널 (발전 효율 유지)",
            "CCTV 및 센서 커버 렌즈",
            "자동차 유리 및 사이드미러",
            "선박 및 해양 구조물"
        ]
    },
    "self-healing": {
        id: "self-healing",
        title: "Self-Healing Smart Coating",
        koreanTitle: "자가 치유(Self-Healing)",
        description: "스크래치 발생 시 스스로 복구하는 스마트 코팅 기술",
        longDescription: "마이크로 캡슐 기술이 적용된 스마트 코팅제입니다. 표면에 물리적 손상이 발생하면 내장된 캡슐이 터지면서 복원 물질이 흘러나와 손상 부위를 메우고 경화됩니다. 제품의 수명을 획기적으로 연장시켜 유지보수 비용을 절감합니다.",
        icon: Layers,
        heroImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop",
        features: [
            "스크래치 자동 복원 (상온 또는 열 반응)",
            "부식 방지 성능 유지",
            "반복적인 힐링(Healing) 가능",
            "고광택 표면 마감"
        ],
        featureSections: [
            {
                title: "마이크로 캡슐 기술",
                description: "도막 내 수천만 개의 마이크로 캡슐이 분산되어 있습니다. 스크래치 발생 시 캡슐이 터지며 복원 물질이 흘러나와 손상 부위를 자동으로 메웁니다.",
                image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2670&auto=format&fit=crop"
            },
            {
                title: "열 활성 복원",
                description: "60°C 정도의 열을 가하면 10분 내에 스크래치가 복원됩니다. 드라이어나 따뜻한 물만으로도 간단하게 표면을 원래 상태로 되돌릴 수 있습니다.",
                image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=2670&auto=format&fit=crop"
            },
            {
                title: "프리미엄 광택 유지",
                description: "90% 이상의 광택도 복원율로 항상 새것 같은 외관을 유지합니다. 프리미엄 가전제품과 자동차 외장재에 최적화된 고급 마감 솔루션입니다.",
                image: "https://images.unsplash.com/photo-1609619385002-f40f1df9b7eb?q=80&w=2670&auto=format&fit=crop"
            }
        ],
        techSpecs: {
            "복원 시간": "10분 (60°C 열처리 시)",
            "복원 효율": "90% 이상 (광택도 기준)",
            "캡슐 사이즈": "5 ~ 10 ㎛",
            "내마모성": "우수"
        },
        applications: [
            "프리미엄 가전 제품 외관",
            "자동차 내/외장재",
            "노트북 및 모바일 기기",
            "고급 가구 및 인테리어 소재"
        ]
    },
    "thin-film": {
        id: "thin-film",
        title: "Precision Thin-Film Coating",
        koreanTitle: "정밀 박막 코팅",
        description: "나노 단위 두께 제어로 초정밀 기능을 부여",
        longDescription: "부품의 원래 치수와 형상에 거의 영향을 주지 않으면서도 필요한 기능을 부여하는 첨단 기술입니다. 반도체, 디스플레이 등 초정밀 공차가 요구되는 첨단 산업 분야에서 필수적인 솔루션입니다.",
        icon: Microscope,
        heroImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2670&auto=format&fit=crop",
        features: [
            "서브 마이크론(Sub-micron) 두께 제어",
            "균일한 도막 분포도",
            "전기적/광학적 특성 조절 가능",
            "건식/습식 공정 모두 대응 가능"
        ],
        featureSections: [
            {
                title: "나노 수준 정밀도",
                description: "0.1㎛부터 5㎛까지 ±5% 이내의 정밀한 두께 제어가 가능합니다. 반도체와 디스플레이 등 초정밀 공차가 요구되는 분야에 최적화되었습니다.",
                image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2670&auto=format&fit=crop"
            },
            {
                title: "균일한 도막 분포",
                description: "고도로 제어된 공정 기술로 복잡한 형상에서도 균일한 두께의 도막을 형성합니다. 표면 거칠기 Ra 10nm 미만의 초평활 표면을 구현합니다.",
                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop"
            },
            {
                title: "다양한 공정 지원",
                description: "CVD, PVD 등 건식 공정부터 Sol-Gel, Spin Coating 등 습식 공정까지 다양한 방식을 지원합니다. Si, Glass, PI 등 다양한 기판에 적용 가능합니다.",
                image: "https://images.unsplash.com/photo-1517420879524-86d64ac2f339?q=80&w=2626&auto=format&fit=crop"
            }
        ],
        techSpecs: {
            "코팅 두께": "0.1 ~ 5 ㎛ (조절 가능)",
            "두께 편차": "± 5% 이내",
            "표면 거칠기(Ra)": "< 10 nm",
            "기판 호환성": "Si, Glass, PI 등"
        },
        applications: [
            "반도체 웨이퍼 보호 코팅",
            "디스플레이 광학 필름",
            "MEMS 센서 소자",
            "정밀 의료용 카테터"
        ]
    }
};
