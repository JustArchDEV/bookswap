import { auth } from '@/auth';
import { exchangeService } from '@/services/exchangeService';
import { updateExchangeStatusSchema } from '@/lib/validators/exchange.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Необхідна авторизація' }, { status: 401 });
    }

    const { id } = await params;
    const exchange = await exchangeService.getExchangeById(id);
    if (!exchange) {
      return NextResponse.json({ error: 'Обмін не знайдено' }, { status: 404 });
    }
    if (session.user.id !== exchange.requesterId && session.user.id !== exchange.ownerId) {
      return NextResponse.json({ error: 'Доступ заборонено' }, { status: 403 });
    }

    return NextResponse.json(exchange);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Помилка отримання обміну' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Необхідна авторизація' }, { status: 401 });
    }
    if (session.user.isBlocked) {
      return NextResponse.json({ error: 'Користувача заблоковано' }, { status: 403 });
    }

    const { id } = await params;
    const { status } = updateExchangeStatusSchema.parse(await request.json());

    const actions = {
      ACCEPTED: exchangeService.acceptExchange,
      REJECTED: exchangeService.rejectExchange,
      CANCELLED: exchangeService.cancelExchange,
      COMPLETED: exchangeService.completeExchange,
    } as const;

    const action = actions[status];
    const exchange = await action(id, session.user.id);
    return NextResponse.json(exchange);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Помилка оновлення обміну' }, { status: 400 });
  }
}

