// DB 연결 확인 스크립트
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    console.log('🔍 Neon DB 연결 확인 중...\n');

    try {
        // 연결 테스트
        await prisma.$connect();
        console.log('✅ DB 연결 성공!\n');

        // 데이터 조회
        const resources = await prisma.resource.findMany();
        const mediaItems = await prisma.mediaItem.findMany();
        const inquiries = await prisma.inquiry.findMany();
        const logs = await prisma.activityLog.findMany();

        console.log('📊 데이터 현황:');
        console.log('=====================================\n');

        console.log(`📁 Resources (${resources.length}건):`);
        resources.forEach((r, i) => {
            console.log(`   ${i + 1}. [${r.category}] ${r.title}`);
        });

        console.log(`\n📺 MediaItems (${mediaItems.length}건):`);
        mediaItems.forEach((m, i) => {
            console.log(`   ${i + 1}. [${m.category}] ${m.title}`);
        });

        console.log(`\n📧 Inquiries (${inquiries.length}건):`);
        inquiries.forEach((q, i) => {
            console.log(`   ${i + 1}. ${q.name} (${q.company ?? '개인'}) - ${q.interest}`);
        });

        console.log(`\n📝 ActivityLogs (${logs.length}건):`);
        logs.forEach((l, i) => {
            console.log(`   ${i + 1}. [${l.action}] ${l.target} - ${l.details}`);
        });

        console.log('\n=====================================');
        console.log('🎉 Neon DB 연동 확인 완료!');

    } catch (error) {
        console.error('❌ DB 연결 실패:', error);
    } finally {
        await prisma.$disconnect();
    }
}

check();
