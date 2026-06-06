import { prisma } from '@/lib/prisma';
import { CreateMessageDto } from '@/lib/validators/message.schema';
import { Prisma } from '@prisma/client';

type MessageWithSender = Prisma.MessageGetPayload<{ include: { sender: true } }>;

async function assertExchangeAccess(exchangeId: string, userId: string) {
  const exchange = await prisma.exchange.findUnique({
    where: { id: exchangeId },
    select: { requesterId: true, ownerId: true },
  });

  if (!exchange) {
    throw new Error('Обмін не знайдено');
  }
  if (exchange.requesterId !== userId && exchange.ownerId !== userId) {
    throw new Error('Доступ до чату дозволено лише учасникам обміну');
  }

  return exchange;
}

export const messageService = {
  async getMessages(exchangeId: string, userId: string): Promise<MessageWithSender[]> {
    await assertExchangeAccess(exchangeId, userId);

    return prisma.message.findMany({
      where: { exchangeId },
      include: { sender: true },
      orderBy: { createdAt: 'asc' },
    });
  },

  async createMessage(userId: string, data: CreateMessageDto): Promise<MessageWithSender> {
    await assertExchangeAccess(data.exchangeId, userId);

    return prisma.message.create({
      data: {
        exchangeId: data.exchangeId,
        senderId: userId,
        content: data.content.trim(),
      },
      include: { sender: true },
    });
  },
};
