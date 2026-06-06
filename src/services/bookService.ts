import { prisma } from '@/lib/prisma';
import { deleteImage } from '@/lib/cloudinary';
import { BookFiltersDto, CreateBookDto, UpdateBookDto } from '@/lib/validators/book.schema';
import { BookCondition, BookStatus, Prisma } from '@prisma/client';

const bookInclude = Prisma.validator<Prisma.BookArgs>()({
  include: {
    owner: true,
    genre: true,
    images: {
      orderBy: [{ isCover: 'desc' }, { position: 'asc' }],
    },
  },
});

type BookWithRelations = Prisma.BookGetPayload<typeof bookInclude>;

function ensureImageRules(images: Array<{ url: string; publicId: string }>) {
  if (images.length < 1) {
    throw new Error('Мінімум 1 фото');
  }
  if (images.length > 5) {
    throw new Error('Максимум 5 фото');
  }
}

function mapBookImages(images: Array<{ url: string; publicId: string }>) {
  return images.map((image, index) => ({
    url: image.url,
    publicId: image.publicId,
    position: index,
    isCover: index === 0,
  }));
}

export const bookService = {
  async createBook(userId: string, data: CreateBookDto): Promise<BookWithRelations> {
    ensureImageRules(data.images);

    const book = await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        description: data.description,
        language: data.language ?? null,
        publishedYear: data.publishedYear ?? null,
        genreId: data.genreId,
        condition: data.condition,
        status: BookStatus.AVAILABLE,
        ownerId: userId,
        images: {
          create: mapBookImages(data.images),
        },
      },
        include: bookInclude.include,
    });

    return book;
  },

  async updateBook(bookId: string, userId: string, data: UpdateBookDto): Promise<BookWithRelations> {
    const currentBook = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        ownerId: true,
        images: { select: { publicId: true } },
      },
    });

    if (!currentBook) {
      throw new Error('Книгу не знайдено');
    }
    if (currentBook.ownerId !== userId) {
      throw new Error('Немає доступу');
    }
    if (data.images) {
      ensureImageRules(data.images);
    }

    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const book = await tx.book.update({
        where: { id: bookId },
        data: {
          ...(data.title !== undefined ? { title: data.title } : {}),
          ...(data.author !== undefined ? { author: data.author } : {}),
          ...(data.description !== undefined ? { description: data.description } : {}),
          ...(data.language !== undefined ? { language: data.language ?? null } : {}),
          ...(data.publishedYear !== undefined ? { publishedYear: data.publishedYear ?? null } : {}),
          ...(data.genreId !== undefined ? { genreId: data.genreId } : {}),
          ...(data.condition !== undefined ? { condition: data.condition } : {}),
          ...(data.images
            ? {
                images: {
                  deleteMany: {},
                  create: mapBookImages(data.images),
                },
              }
            : {}),
        },
          include: bookInclude.include,
      });

      return book;
    });

    if (data.images) {
      await Promise.all(currentBook.images.map((image) => image.publicId && deleteImage(image.publicId)));
    }

    return updated;
  },

  async deleteBook(bookId: string, userId: string) {
    const currentBook = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        ownerId: true,
        images: { select: { publicId: true } },
      },
    });

    if (!currentBook) {
      throw new Error('Книгу не знайдено');
    }
    if (currentBook.ownerId !== userId) {
      throw new Error('Немає доступу');
    }

    const deleted = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.bookImage.deleteMany({ where: { bookId } });
      return tx.book.delete({ where: { id: bookId } });
    });

    await Promise.all(currentBook.images.map((image) => image.publicId && deleteImage(image.publicId)));
    return deleted;
  },

  async getBookById(bookId: string): Promise<BookWithRelations | null> {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
        include: bookInclude.include,
    });

    return book;
  },

  async getBooks(filters: BookFiltersDto): Promise<{
    books: BookWithRelations[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const where: Prisma.BookWhereInput = {
      status: { not: BookStatus.EXCHANGED },
      ...(filters.title ? { title: { contains: filters.title, mode: 'insensitive' } } : {}),
      ...(filters.author ? { author: { contains: filters.author, mode: 'insensitive' } } : {}),
      ...(filters.genreId ? { genreId: filters.genreId } : {}),
      ...(filters.language ? { language: { contains: filters.language, mode: 'insensitive' } } : {}),
      ...(filters.condition ? { condition: filters.condition as BookCondition } : {}),
      ...(filters.status ? { status: filters.status as BookStatus } : {}),
    };

    const orderBy: Prisma.BookOrderByWithRelationInput =
      filters.sortBy === 'oldest'
        ? { createdAt: 'asc' }
        : filters.sortBy === 'title_asc'
          ? { title: 'asc' }
          : filters.sortBy === 'title_desc'
            ? { title: 'desc' }
            : { createdAt: 'desc' };

    const skip = (filters.page - 1) * filters.limit;

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
          include: bookInclude.include,
        orderBy,
        skip,
        take: filters.limit,
      }),
      prisma.book.count({ where }),
    ]);

    return {
      books,
      total,
      page: filters.page,
      limit: filters.limit,
      pages: Math.max(1, Math.ceil(total / filters.limit)),
    };
  },

  async getUserBooks(userId: string, filters: Partial<BookFiltersDto> = {}): Promise<{
    books: BookWithRelations[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const where: Prisma.BookWhereInput = {
      ownerId: userId,
      ...(filters.title ? { title: { contains: filters.title, mode: 'insensitive' } } : {}),
      ...(filters.author ? { author: { contains: filters.author, mode: 'insensitive' } } : {}),
      ...(filters.genreId ? { genreId: filters.genreId } : {}),
      ...(filters.language ? { language: { contains: filters.language, mode: 'insensitive' } } : {}),
      ...(filters.condition ? { condition: filters.condition as BookCondition } : {}),
      ...(filters.status ? { status: filters.status as BookStatus } : {}),
    };

    const orderBy: Prisma.BookOrderByWithRelationInput =
      filters.sortBy === 'oldest'
        ? { createdAt: 'asc' }
        : filters.sortBy === 'title_asc'
          ? { title: 'asc' }
          : filters.sortBy === 'title_desc'
            ? { title: 'desc' }
            : { createdAt: 'desc' };

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;
    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      prisma.book.findMany({ where, include: bookInclude.include, orderBy, skip, take: limit }),
      prisma.book.count({ where }),
    ]);

    return {
      books,
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
    };
  },

  async setCoverImage(bookId: string, userId: string, imageId: string): Promise<BookWithRelations | null> {
    const book = await prisma.book.findUnique({ where: { id: bookId }, select: { ownerId: true } });
    if (!book || book.ownerId !== userId) {
      throw new Error('Немає доступу');
    }

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.bookImage.updateMany({ where: { bookId }, data: { isCover: false } });
      const image = await tx.bookImage.findFirst({ where: { id: imageId, bookId } });
      if (!image) {
        throw new Error('Фото не знайдено');
      }
      await tx.bookImage.update({ where: { id: image.id }, data: { isCover: true, position: 0 } });
      const book = await tx.book.findUnique({ where: { id: bookId }, include: bookInclude.include });
      return book;
    });

    return result;
  },

  async reorderImages(bookId: string, userId: string, imageIds: string[]): Promise<BookWithRelations | null> {
    const book = await prisma.book.findUnique({ where: { id: bookId }, select: { ownerId: true } });
    if (!book || book.ownerId !== userId) {
      throw new Error('Немає доступу');
    }

    if (imageIds.length < 1 || imageIds.length > 5) {
      throw new Error('Недопустима кількість фото');
    }

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const [index, id] of imageIds.entries()) {
        const image = await tx.bookImage.findFirst({ where: { id, bookId } });
        if (!image) {
          throw new Error('Фото не знайдено');
        }
        await tx.bookImage.update({
          where: { id: image.id },
          data: { position: index, isCover: index === 0 },
        });
      }

      const book = await tx.book.findUnique({ where: { id: bookId }, include: bookInclude.include });
      return book;
    });

    return result;
  },
};
