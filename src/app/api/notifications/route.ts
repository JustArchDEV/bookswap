import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { ExchangeStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Необхідна авторизація' }, { status: 401 });
    }
    if (session.user.isBlocked) {
      return NextResponse.json({ error: 'Користувача заблоковано' }, { status: 403 });
    }

    // support clearing notifications client-side: ?clear=true will return empty list
    const clear = request.nextUrl.searchParams.get('clear');
    if (clear === 'true') {
      return NextResponse.json({ notifications: [] });
    }

    const userId = session.user.id;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const baseExchanges = await prisma.exchange.findMany({
      where: {
        OR: [{ requesterId: userId }, { ownerId: userId }],
        status: { in: [ExchangeStatus.PENDING, ExchangeStatus.ACCEPTED] },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        requester: true,
        owner: true,
        requestedBook: true,
        offeredBook: true,
      },
    });

    const recentProposals = await prisma.exchange.findMany({
      where: {
        ownerId: userId,
        status: ExchangeStatus.PENDING,
        createdAt: { gte: sevenDaysAgo },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        requester: true,
        requestedBook: true,
        offeredBook: true,
      },
    });

    const exchangeMap = new Map<string, typeof baseExchanges[number]>();
    baseExchanges.forEach((exchange) => exchangeMap.set(exchange.id, exchange));
    recentProposals.forEach((exchange) => {
      if (!exchangeMap.has(exchange.id)) {
        exchangeMap.set(exchange.id, exchange as typeof baseExchanges[number]);
      }
    });

    const unreadGroups = await prisma.message.groupBy({
      by: ['exchangeId'],
      where: {
        senderId: { not: userId },
        isRead: false,
        exchange: {
          OR: [{ requesterId: userId }, { ownerId: userId }],
        },
      },
      _count: {
        _all: true,
      },
    });

    const unreadMap = new Map(unreadGroups.map((group) => [group.exchangeId, group._count._all]));

    const exchanges = Array.from(exchangeMap.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const completedExchanges = await prisma.exchange.findMany({
      where: {
        status: ExchangeStatus.COMPLETED,
        OR: [{ requesterId: userId }, { ownerId: userId }],
        completedAt: { not: null },
      },
      orderBy: { completedAt: 'desc' },
      include: {
        requester: true,
        owner: true,
        requestedBook: true,
        offeredBook: true,
      },
    });

    const reviewedRows = await prisma.review.findMany({
      where: {
        authorId: userId,
        exchangeId: { in: completedExchanges.map((exchange) => exchange.id) },
      },
      select: { exchangeId: true },
    });

    const reviewedExchangeIds = new Set(reviewedRows.map((review) => review.exchangeId));

    const reviewNotifications = completedExchanges
      .filter((exchange) => !reviewedExchangeIds.has(exchange.id))
      .map((exchange) => ({
        id: `review-${exchange.id}`,
        type: 'review_needed' as const,
        exchangeId: exchange.id,
        text: 'Оцініть обмін — залиште відгук партнеру',
        createdAt: exchange.completedAt?.toISOString() ?? exchange.updatedAt.toISOString(),
        isRead: false,
      }));

    const notifications = [
      ...exchanges.flatMap((exchange) => {
        const items: Array<{
          id: string;
          type: 'exchange_proposal' | 'new_message';
          exchangeId: string;
          text: string;
          createdAt: string;
          isRead: boolean;
        }> = [];

        const unreadCount = unreadMap.get(exchange.id) ?? 0;

        if (exchange.ownerId === userId && exchange.status === ExchangeStatus.PENDING && exchange.createdAt >= sevenDaysAgo) {
          items.push({
            id: `proposal-${exchange.id}`,
            type: 'exchange_proposal',
            exchangeId: exchange.id,
            text: `Нова пропозиція обміну від ${exchange.requester.name} на "${exchange.requestedBook.title}"`,
            createdAt: exchange.createdAt.toISOString(),
            isRead: false,
          });
        }

        if (unreadCount > 0) {
          items.push({
            id: `message-${exchange.id}`,
            type: 'new_message',
            exchangeId: exchange.id,
            text: `Нове повідомлення в обміні на "${exchange.requestedBook.title}"`,
            createdAt: exchange.updatedAt.toISOString(),
            isRead: false,
          });
        }

        return items;
      }),
      ...reviewNotifications,
    ];

    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Помилка отримання сповіщень' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // notifications are derived; there's no persistent store for dismissed notifications.
  // Provide a simple endpoint that clients can call to acknowledge/clear notifications locally.
  return NextResponse.json({ cleared: true });
}
