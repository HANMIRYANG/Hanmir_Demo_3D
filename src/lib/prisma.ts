// ============================================================================
// Prisma Client 인스턴스 - 데이터베이스 연결
// ============================================================================

import { PrismaClient } from '@prisma/client';

// PrismaClient 전역 인스턴스 (개발 환경에서 핫 리로드 시 중복 연결 방지)
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
