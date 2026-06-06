import { auth } from '@/auth';
import { exchangeService } from '@/services/exchangeService';
import { createExchangeSchema } from '@/lib/validators/exchange.schema';
import { NextRequest, NextResponse } from 'next/server';
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

    const statusValue = request.nextUrl.searchParams.get('status');
    const roleValue = request.nextUrl.searchParams.get('role');
    const exchanges = await exchangeService.getUserExchanges(session.user.id, {
      status: statusValue && Object.values(ExchangeStatus).includes(statusValue as ExchangeStatus) ? (statusValue as ExchangeStatus) : undefined,
      role: roleValue === 'requester' || roleValue === 'owner' ? roleValue : undefined,
    });

    return NextResponse.json({ exchanges });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Помилка отримання обмінів' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Необхідна авторизація' }, { status: 401 });
    }
    if (session.user.isBlocked) {
      return NextResponse.json({ error: 'Користувача заблоковано' }, { status: 403 });
    }

    const body = await request.json();
    const data = createExchangeSchema.parse(body);
    const exchange = await exchangeService.createExchange(session.user.id, data);
    return NextResponse.json(exchange, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Помилка створення обміну' }, { status: 400 });
  }
}

