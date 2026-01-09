// ============================================================================
// Prisma Seed Script - 샘플 데이터 추가
// ============================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 시드 데이터 추가 시작...');

    // 기존 데이터 확인
    const existingResources = await prisma.resource.count();
    const existingMedia = await prisma.mediaItem.count();
    const existingInquiries = await prisma.inquiry.count();

    console.log(`📊 현재 데이터 현황:`);
    console.log(`   - Resources: ${existingResources}건`);
    console.log(`   - MediaItems: ${existingMedia}건`);
    console.log(`   - Inquiries: ${existingInquiries}건`);

    // 샘플 Resource 추가 (기존 데이터가 없을 경우)
    if (existingResources === 0) {
        const resources = await prisma.resource.createMany({
            data: [
                {
                    category: 'Catalogue',
                    title: '한미르 제품 카탈로그 2025',
                    fileName: 'hanmir_catalogue_2025.pdf',
                    filePath: '/uploads/hanmir_catalogue_2025.pdf',
                    fileSize: '12.5 MB',
                    format: 'PDF',
                },
                {
                    category: 'Manual',
                    title: '배터리 용접기 사용 설명서',
                    fileName: 'battery_welder_manual.pdf',
                    filePath: '/uploads/battery_welder_manual.pdf',
                    fileSize: '5.2 MB',
                    format: 'PDF',
                },
                {
                    category: 'Datasheet',
                    title: 'HM-5000 시리즈 기술 사양서',
                    fileName: 'hm5000_datasheet.pdf',
                    filePath: '/uploads/hm5000_datasheet.pdf',
                    fileSize: '2.1 MB',
                    format: 'PDF',
                },
                {
                    category: 'Certificate',
                    title: 'ISO 9001:2015 인증서',
                    fileName: 'iso_9001_certificate.pdf',
                    filePath: '/uploads/iso_9001_certificate.pdf',
                    fileSize: '1.8 MB',
                    format: 'PDF',
                },
            ],
        });
        console.log(`✅ Resources ${resources.count}건 추가 완료`);
    }

    // 샘플 MediaItem 추가
    if (existingMedia === 0) {
        const mediaItems = await prisma.mediaItem.createMany({
            data: [
                {
                    title: '한미르 2025년 신제품 발표회',
                    category: 'HANMIR NEWS',
                    thumbnail: '/images/news_thumbnail_1.jpg',
                    link: 'https://example.com/news/1',
                },
                {
                    title: '배터리 용접 기술 세미나 개최',
                    category: 'HANMIR NOW',
                    thumbnail: '/images/news_thumbnail_2.jpg',
                    link: 'https://example.com/news/2',
                },
                {
                    title: '한미르 홍보 영상 2025',
                    category: '홍보자료실',
                    thumbnail: '/images/promo_thumbnail_1.jpg',
                    link: 'https://www.youtube.com/watch?v=example',
                },
            ],
        });
        console.log(`✅ MediaItems ${mediaItems.count}건 추가 완료`);
    }

    // 샘플 Inquiry 추가
    if (existingInquiries === 0) {
        const inquiries = await prisma.inquiry.createMany({
            data: [
                {
                    name: '김철수',
                    company: '(주)삼성SDI',
                    phone: '010-1234-5678',
                    email: 'chulsu.kim@example.com',
                    interest: '자동차 배터리',
                    message: 'HM-5000 시리즈에 대한 견적 문의드립니다.',
                    isRead: false,
                },
                {
                    name: '이영희',
                    company: '현대중공업',
                    phone: '010-9876-5432',
                    email: 'younghee.lee@example.com',
                    interest: '선박',
                    message: '선박용 용접 장비 도입을 검토 중입니다.',
                    isRead: true,
                },
                {
                    name: '박민수',
                    company: null,
                    phone: '010-5555-1234',
                    email: 'minsu.park@example.com',
                    interest: '기타',
                    message: '일반 문의사항입니다.',
                    isRead: false,
                },
            ],
        });
        console.log(`✅ Inquiries ${inquiries.count}건 추가 완료`);
    }

    // 샘플 ActivityLog 추가
    const existingLogs = await prisma.activityLog.count();
    if (existingLogs === 0) {
        await prisma.activityLog.create({
            data: {
                action: 'CREATE',
                target: 'Resource',
                targetId: 'seed-data',
                details: '시드 데이터 생성',
            },
        });
        console.log(`✅ ActivityLog 1건 추가 완료`);
    }

    // 최종 데이터 확인
    const finalResources = await prisma.resource.count();
    const finalMedia = await prisma.mediaItem.count();
    const finalInquiries = await prisma.inquiry.count();
    const finalLogs = await prisma.activityLog.count();

    console.log('\n📊 최종 데이터 현황:');
    console.log(`   - Resources: ${finalResources}건`);
    console.log(`   - MediaItems: ${finalMedia}건`);
    console.log(`   - Inquiries: ${finalInquiries}건`);
    console.log(`   - ActivityLogs: ${finalLogs}건`);
    console.log('\n🎉 시드 완료!');
}

main()
    .catch((e) => {
        console.error('❌ 시드 실패:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
