import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Необхідна авторизація' }, { status: 401 });
    }

    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);

    const [users, books, pendingExchanges] = await Promise.all([
      prisma.user.findMany({ where: { createdAt: { gte: startDate } }, select: { createdAt: true } }),
      prisma.book.findMany({ where: { createdAt: { gte: startDate } }, select: { createdAt: true } }),
      prisma.exchange.count({ where: { status: 'PENDING' } }),
    ]);

    const dates = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      return formatDate(date);
    });

    const newUsersLast7Days = dates.map((date) => ({
      date,
      count: users.filter((item) => formatDate(item.createdAt) === date).length,
    }));
    const newBooksLast7Days = dates.map((date) => ({
      date,
      count: books.filter((item) => formatDate(item.createdAt) === date).length,
    }));

    return NextResponse.json({ newUsersLast7Days, newBooksLast7Days, pendingExchanges });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Помилка отримання статистики' }, { status: 500 });
  }
}
