import { prisma } from '@/lib/prisma';
import { CreateExchangeDto } from '@/lib/validators/exchange.schema';
import { BookStatus, ExchangeStatus, Prisma } from '@prisma/client';

const exchangeInclude = Prisma.validator<Prisma.ExchangeArgs>()({
  include: {
    requester: true,
    owner: true,
    requestedBook: {
      include: {
        owner: true,
        genre: true,
        images: { orderBy: [{ isCover: 'desc' }, { position: 'asc' }] },
      },
    },
    offeredBook: {
      include: {
        owner: true,
        genre: true,
        images: { orderBy: [{ isCover: 'desc' }, { position: 'asc' }] },
      },
    },
    messages: {
      include: {
        sender: true,
      },
      orderBy: { createdAt: 'asc' },
    },
  },
});

type ExchangeWithRelations = Prisma.ExchangeGetPayload<typeof exchangeInclude>;

async function assertExchangeAccess(exchangeId: string) {
  const exchange = await prisma.exchange.findUnique({
    where: { id: exchangeId },
    select: {
      id: true,
      requesterId: true,
      ownerId: true,
      status: true,
      requestedBookId: true,
      offeredBookId: true,
    },
  });

  if (!exchange) {
    throw new Error('Обмін не знайдено');
  }

  return exchange;
}

async function setBookStatuses(tx: Prisma.TransactionClient, requestedBookId: string, offeredBookId: string, status: BookStatus) {
  await Promise.all([
    tx.book.update({ where: { id: requestedBookId }, data: { status } }),
    tx.book.update({ where: { id: offeredBookId }, data: { status } }),
  ]);
}

export const exchangeService = {
  async createExchange(userId: string, data: CreateExchangeDto): Promise<ExchangeWithRelations> {
    const [requestedBook, offeredBook] = await Promise.all([
      prisma.book.findUnique({ where: { id: data.requestedBookId }, select: { id: true, ownerId: true, status: true } }),
      prisma.book.findUnique({ where: { id: data.offeredBookId }, select: { id: true, ownerId: true, status: true } }),
    ]);

    if (!requestedBook || !offeredBook) {
      throw new Error('Книгу не знайдено');
    }
    if (offeredBook.ownerId === requestedBook.ownerId) {
      throw new Error('Не можна пропонувати власну книгу');
    }
    if (offeredBook.ownerId !== userId) {
      throw new Error('Ви можете пропонувати лише власну книгу');
    }
    const isUnavailable = (status: BookStatus) =>
      status === BookStatus.RESERVED || status === BookStatus.EXCHANGED;

    if (isUnavailable(requestedBook.status)) {
  throw new Error('Ця книга вже зарезервована або обміняна і недоступна для обміну');
}
if (isUnavailable(offeredBook.status)) {
  throw new Error('Ваша книга вже зарезервована або обміняна. Оберіть іншу книгу для обміну');
}

    const exchange = await prisma.exchange.create({
      data: {
        requesterId: userId,
        ownerId: requestedBook.ownerId,
        requestedBookId: data.requestedBookId,
        offeredBookId: data.offeredBookId,
        status: ExchangeStatus.PENDING,
        messages: data.message
          ? {
              create: {
                senderId: userId,
                content: data.message,
              },
            }
          : undefined,
      },
      include: exchangeInclude.include,
    });

    return exchange;
  },

  async acceptExchange(exchangeId: string, userId: string): Promise<ExchangeWithRelations> {
    const exchange = await assertExchangeAccess(exchangeId);
    if (exchange.ownerId !== userId) {
      throw new Error('Прийняти обмін може лише власник книги');
    }
    if (exchange.status !== ExchangeStatus.PENDING) {
      throw new Error('Обмін можна прийняти лише зі статусом PENDING');
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await setBookStatuses(tx, exchange.requestedBookId, exchange.offeredBookId, BookStatus.RESERVED);
      const updatedExchange = await tx.exchange.update({ where: { id: exchangeId }, data: { status: ExchangeStatus.ACCEPTED }, include: exchangeInclude.include });
      return updatedExchange;
    });
  },

  async rejectExchange(exchangeId: string, userId: string): Promise<ExchangeWithRelations> {
    const exchange = await assertExchangeAccess(exchangeId);
    if (exchange.ownerId !== userId) {
      throw new Error('Відхилити обмін може лише власник книги');
    }
    if (exchange.status !== ExchangeStatus.PENDING) {
      throw new Error('Обмін можна відхилити лише зі статусом PENDING');
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await setBookStatuses(tx, exchange.requestedBookId, exchange.offeredBookId, BookStatus.AVAILABLE);
      const updatedExchange = await tx.exchange.update({ where: { id: exchangeId }, data: { status: ExchangeStatus.REJECTED }, include: exchangeInclude.include });
      return updatedExchange;
    });
  },

  async cancelExchange(exchangeId: string, userId: string): Promise<ExchangeWithRelations> {
    const exchange = await assertExchangeAccess(exchangeId);
    if (exchange.requesterId !== userId) {
      throw new Error('Скасувати обмін може лише ініціатор');
    }
    if (exchange.status !== ExchangeStatus.PENDING && exchange.status !== ExchangeStatus.ACCEPTED) {
      throw new Error('Обмін можна скасувати лише у статусі PENDING або ACCEPTED');
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await setBookStatuses(tx, exchange.requestedBookId, exchange.offeredBookId, BookStatus.AVAILABLE);
      const updatedExchange = await tx.exchange.update({ where: { id: exchangeId }, data: { status: ExchangeStatus.CANCELLED }, include: exchangeInclude.include });
      return updatedExchange;
    });
  },

  async completeExchange(exchangeId: string, userId: string): Promise<ExchangeWithRelations> {
    const exchange = await assertExchangeAccess(exchangeId);
    if (exchange.requesterId !== userId && exchange.ownerId !== userId) {
      throw new Error('Завершити обмін можуть лише учасники обміну');
    }
    if (exchange.status !== ExchangeStatus.ACCEPTED) {
      throw new Error('Обмін можна завершити лише після прийняття');
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await setBookStatuses(tx, exchange.requestedBookId, exchange.offeredBookId, BookStatus.EXCHANGED);
      const updatedExchange = await tx.exchange.update({
        where: { id: exchangeId },
        data: { status: ExchangeStatus.COMPLETED, completedAt: new Date() },
        include: exchangeInclude.include,
      });
      return updatedExchange;
    });
  },

  async getExchangeById(exchangeId: string): Promise<ExchangeWithRelations | null> {
    const exchange = await prisma.exchange.findUnique({ where: { id: exchangeId }, include: exchangeInclude.include });
    return exchange;
  },

  async getUserExchanges(userId: string, filters: { status?: ExchangeStatus; role?: 'requester' | 'owner' } = {}): Promise<ExchangeWithRelations[]> {
    const where: Prisma.ExchangeWhereInput = {
      ...(filters.role === 'requester' ? { requesterId: userId } : filters.role === 'owner' ? { ownerId: userId } : { OR: [{ requesterId: userId }, { ownerId: userId }] }),
      ...(filters.status ? { status: filters.status } : {}),
    };

    const exchanges = await prisma.exchange.findMany({ where, include: exchangeInclude.include, orderBy: { createdAt: 'desc' } });
    return exchanges;
  },
};
