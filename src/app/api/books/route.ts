import { auth } from '@/auth';
import { bookService } from '@/services/bookService';
import { bookFiltersSchema, createBookSchema, CreateBookDto } from '@/lib/validators/book.schema';
import { BookStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const asValue = (value: string | null) => (value && value.trim() !== '' ? value : undefined);

    const filters = bookFiltersSchema.parse({
      title: asValue(request.nextUrl.searchParams.get('title')),
      author: asValue(request.nextUrl.searchParams.get('author')),
      genreId: asValue(request.nextUrl.searchParams.get('genreId')),
      language: asValue(request.nextUrl.searchParams.get('language')),
      condition: asValue(request.nextUrl.searchParams.get('condition')),
      status: asValue(request.nextUrl.searchParams.get('status')),
      sortBy: asValue(request.nextUrl.searchParams.get('sortBy')) ?? 'newest',
      page: asValue(request.nextUrl.searchParams.get('page')) ?? 1,
      limit: asValue(request.nextUrl.searchParams.get('limit')) ?? 12,
    });

    const result = await bookService.getBooks(filters);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Помилка отримання книг' }, { status: 500 });
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
    const data = createBookSchema.parse(body);
    // enforce available status on create regardless of client input
    const createData = { ...(data as CreateBookDto), status: BookStatus.AVAILABLE } as unknown as CreateBookDto;
    const book = await bookService.createBook(session.user.id, createData);
    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Помилка створення книги' },
      { status: 400 }
    );
  }
}

