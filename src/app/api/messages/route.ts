import { auth } from '@/auth';
import { messageService } from '@/services/messageService';
import { createMessageSchema } from '@/lib/validators/message.schema';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Необхідна авторизація' }, { status: 401 });
    }
    if (session.user.isBlocked) {
      return NextResponse.json({ error: 'Користувача заблоковано' }, { status: 403 });
    }

    const exchangeId = request.nextUrl.searchParams.get('exchangeId');
    if (!exchangeId) {
      return NextResponse.json({ error: 'exchangeId обов\'язковий' }, { status: 400 });
    }

    const messages = await messageService.getMessages(exchangeId, session.user.id);

    await prisma.message.updateMany({
      where: {
        exchangeId,
        senderId: { not: session.user.id },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Помилка отримання повідомлень' }, { status: 500 });
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
    const data = createMessageSchema.parse(body);
    const message = await messageService.createMessage(session.user.id, data);
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Помилка створення повідомлення' }, { status: 400 });
  }
}

