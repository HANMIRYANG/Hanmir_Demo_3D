import prisma from '@/lib/prisma';

export async function logActivity(
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT',
    target: 'Resource' | 'MediaItem' | 'Inquiry' | 'System' | 'Notice' | 'QnaPost',
    targetId: string,
    details?: string
) {
    try {
        await prisma.activityLog.create({
            data: {
                action,
                target,
                targetId,
                details
            }
        });
    } catch (error) {
        console.error('Failed to create activity log', error);
    }
}
