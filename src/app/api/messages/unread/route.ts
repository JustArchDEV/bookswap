import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Необхідна авторизація' }, { status: 401 });
    }
    if (session.user.isBlocked) {
      return NextResponse.json({ error: 'Користувача заблоковано' }, { status: 403 });
    }

    const unreadGroups = await prisma.message.groupBy({
      by: ['exchangeId'],
      where: {
        senderId: { not: session.user.id },
        isRead: false,
        exchange: {
          OR: [
            { requesterId: session.user.id },
            { ownerId: session.user.id },
          ],
        },
      },
      _count: {
        _all: true,
      },
    });

    const unreadMessages = unreadGroups.reduce((sum, group) => sum + group._count._all, 0);
    const unreadExchanges = unreadGroups.map((group) => group.exchangeId);

    return NextResponse.json({ unreadMessages, unreadExchanges });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Помилка отримання сповіщень' }, { status: 500 });
  }
}
