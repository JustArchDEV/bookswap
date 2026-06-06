import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const genres = await prisma.genre.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(genres, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Помилка отримання жанрів' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Назва жанру обовʼязкова' }, { status: 400 });
    }
    const genre = await prisma.genre.create({
      data: { name: body.name.trim() },
    });
    return NextResponse.json(genre, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Помилка створення жанру' }, { status: 500 });
  }
}