// Media Content Types
export interface MediaItem {
    id: string;
    title: string;
    category: 'HANMIR NEWS' | 'HANMIR NOW' | '홍보자료실';
    date: string;
    thumbnail: string;
    link: string; // Detail page or External link
}

export interface SNSItem {
    id: string;
    platform: 'Instagram' | 'YouTube' | 'Facebook';
    content: string; // Post caption or summary
    date: string;
    image: string;
    link: string;
}

// Mock Data - News & Promo
export const mediaItems: MediaItem[] = [
    {
        id: '1',
        title: '2025년 중소벤처기업부 기술혁신 장관상 수상',
        category: 'HANMIR NEWS',
        date: '2025.01.05',
        thumbnail: 'https://images.unsplash.com/photo-1635327263050-7053aa4f85e4?q=80&w=2670&auto=format&fit=crop',
        link: '#'
    },
    {
        id: '2',
        title: '신규 방열 코팅 솔루션 "HM-2025" 런칭 세미나 개최 안내',
        category: 'HANMIR NEWS',
        date: '2024.12.20',
        thumbnail: 'https://images.unsplash.com/photo-1544531696-fa52ff235652?q=80&w=2670&auto=format&fit=crop',
        link: '#'
    },
    {
        id: '3',
        title: '한미르, 베트남 하노이 국제 코팅 박람회 참가 성료',
        category: 'HANMIR NEWS',
        date: '2024.11.15',
        thumbnail: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2576&auto=format&fit=crop',
        link: '#'
    },
    {
        id: '4',
        title: '[인터뷰] 한미르(주) 대표이사, "친환경 무기질 도료가 미래다"',
        category: 'HANMIR NOW',
        date: '2024.10.02',
        thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop',
        link: '#'
    },
    {
        id: '5',
        title: '전기차 배터리팩 화재 지연 불연 도료 성능 테스트 영상',
        category: '홍보자료실',
        date: '2024.09.28',
        thumbnail: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2670&auto=format&fit=crop',
        link: '#'
    },
    {
        id: '6',
        title: '2024 한미르 기업 브로슈어 (국문/영문)',
        category: '홍보자료실',
        date: '2024.08.10',
        thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?q=80&w=2670&auto=format&fit=crop',
        link: '#'
    }
];

// Mock Data - SNS Feed
export const snsItems: SNSItem[] = [
    {
        id: 's1',
        platform: 'Instagram',
        content: '#한미르 #불연도료 #화재안전 전기차 배터리 안전을 위한 필수 선택! 한미르 불연코팅 솔루션을 소개합니다. 🔥🚫',
        date: '2025.01.07',
        image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2672&auto=format&fit=crop',
        link: 'https://instagram.com'
    },
    {
        id: 's2',
        platform: 'YouTube',
        content: '[TECH CLIP] 방열 코팅 시공 가이드 영상 업데이트! 초보자도 쉽게 따라하는 스프레이 코팅 노하우를 공개합니다.',
        date: '2025.01.03',
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop',
        link: 'https://youtube.com'
    },
    {
        id: 's3',
        platform: 'Facebook',
        content: '한미르가 2025 품질경영대상을 수상했습니다! 🎉 따뜻한 성원 보내주신 고객 여러분께 감사드립니다.',
        date: '2025.01.01',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2670&auto=format&fit=crop',
        link: 'https://facebook.com'
    },
    {
        id: 's4',
        platform: 'Instagram',
        content: '연구소 일상 🧪 새로운 친환경 바인더 테스트 중! 더 안전하고 강력한 제품을 위해 오늘도 불을 밝힙니다.',
        date: '2024.12.28',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2670&auto=format&fit=crop',
        link: 'https://instagram.com'
    }
];
