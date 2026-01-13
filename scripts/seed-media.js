// 미디어 더미 데이터 생성 스크립트
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const mediaData = [
    {
        title: '한미르, 친환경 방열 코팅 기술로 글로벌 시장 진출',
        category: 'HANMIR NEWS',
        thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
        content: `한미르가 독자 개발한 친환경 방열 코팅 기술이 유럽 및 북미 시장에서 큰 관심을 받고 있습니다.

이번 기술은 기존 방열 솔루션 대비 30% 이상 향상된 열전도 효율을 자랑하며, 친환경 소재를 사용하여 환경 규제가 강화되고 있는 글로벌 시장에서 경쟁력을 갖추었습니다.

한미르 관계자는 "지속적인 R&D 투자를 통해 기술 혁신을 이루었으며, 앞으로도 고객 맞춤형 솔루션 개발에 주력하겠다"고 밝혔습니다.`,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
            'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80'
        ]),
        link: ''
    },
    {
        title: '2026 국제 코팅 기술 박람회 참가 안내',
        category: 'HANMIR NOW',
        thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        content: `한미르가 2026년 국제 코팅 기술 박람회에 참가합니다.

일시: 2026년 3월 15일 ~ 17일
장소: 코엑스 전시장 A홀
부스: A-215

당사의 최신 방열 코팅 기술과 불연 도료 제품을 직접 확인하실 수 있습니다. 많은 관심과 방문 부탁드립니다.`,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&q=80'
        ]),
        link: ''
    },
    {
        title: '한미르 본사 신축 이전 완료',
        category: 'HANMIR NEWS',
        thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
        content: `한미르가 경기도 화성에 위치한 새로운 본사 및 연구소로 이전을 완료했습니다.

신축 본사는 연면적 5,000평 규모로, 최첨단 R&D 시설과 생산 라인을 갖추고 있습니다. 이번 이전을 통해 연구개발 역량을 한층 강화하고, 고객 맞춤형 솔루션 제공 능력을 높일 예정입니다.`,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80'
        ]),
        link: ''
    },
    {
        title: '2026년 제품 카탈로그 다운로드',
        category: '홍보자료실',
        thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
        content: `2026년 한미르 제품 카탈로그가 업데이트되었습니다.

신제품 라인업과 상세 스펙을 확인하실 수 있습니다.

포함 내용:
- 방열 코팅제 시리즈
- 불연 도료 시리즈
- EMI 차폐 솔루션
- 초발수/자가치유 코팅`,
        images: JSON.stringify([]),
        link: 'https://example.com/catalog'
    },
    {
        title: '친환경 인증 획득 - ISO 14001',
        category: 'HANMIR NEWS',
        thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
        content: `한미르가 환경경영시스템 국제 표준 ISO 14001 인증을 획득했습니다.

이번 인증 획득으로 친환경 기업으로서의 위상을 더욱 높이게 되었으며, 지속 가능한 성장을 위한 기반을 마련했습니다.

한미르는 앞으로도 환경 보호와 사회적 책임을 다하는 기업이 되도록 노력하겠습니다.`,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80'
        ]),
        link: ''
    },
    {
        title: '한미르 기업 홍보 영상',
        category: '홍보자료실',
        thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
        content: `한미르의 기업 비전과 핵심 기술을 소개하는 홍보 영상입니다.

영상에서는 당사의 R&D 역량, 생산 시설, 그리고 글로벌 파트너십에 대해 상세히 소개하고 있습니다.`,
        images: JSON.stringify([]),
        link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
];

async function main() {
    console.log('기존 미디어 데이터 삭제 중...');
    await prisma.mediaItem.deleteMany({});

    console.log('새 미디어 데이터 생성 중...');
    for (const item of mediaData) {
        await prisma.mediaItem.create({
            data: item
        });
        console.log(`  - ${item.title} 생성 완료`);
    }

    console.log('\n✅ 미디어 더미 데이터 생성 완료!');
    console.log(`총 ${mediaData.length}개의 미디어 항목이 생성되었습니다.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
