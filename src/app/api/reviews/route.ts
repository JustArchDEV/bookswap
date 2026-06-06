import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Необхідна авторизація' }, { status: 401 });
    }
    if (session.user.isBlocked) {
      return NextResponse.json({ error: 'Користувача заблоковано' }, { status: 403 });
    }

    const body = await request.json();
    const { targetId, exchangeId, rating, comment } = body as { targetId: string; exchangeId: string; rating: number; comment?: string };

    if (!targetId || !exchangeId || typeof rating !== 'number') {
      return NextResponse.json({ error: 'Невірні дані' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Рейтинг повинен бути від 1 до 5' }, { status: 400 });
    }

    // verify exchange exists and is completed
    const exchange = await prisma.exchange.findUnique({ where: { id: exchangeId } });
    if (!exchange || exchange.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Неможливо залишити відгук для цього обміну' }, { status: 400 });
    }

    const userId = session.user.id;
    // user must be participant
    if (exchange.requesterId !== userId && exchange.ownerId !== userId) {
      return NextResponse.json({ error: 'Лише учасники обміну можуть залишати відгуки' }, { status: 403 });
    }
    // cannot review yourself
    if (userId === targetId) {
      return NextResponse.json({ error: 'Неможливо залишити відгук самому собі' }, { status: 400 });
    }

    // check unique (one review per exchange per author)
    const existing = await prisma.review.findUnique({ where: { authorId_exchangeId: { authorId: userId, exchangeId } } });
    if (existing) {
      return NextResponse.json({ error: 'Ви вже залишили відгук для цього обміну' }, { status: 400 });
    }

    const review = await prisma.review.create({ data: { authorId: userId, targetId, exchangeId, rating, comment } });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Помилка створення відгуку' }, { status: 500 });
  }
}
