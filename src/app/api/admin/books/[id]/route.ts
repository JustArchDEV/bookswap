import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;

  await prisma.message.deleteMany({
    where: {
      exchange: {
        OR: [
          { requestedBookId: id },
          { offeredBookId: id },
        ],
      },
    },
  });

  await prisma.exchange.deleteMany({
    where: {
      OR: [
        { requestedBookId: id },
        { offeredBookId: id },
      ],
    },
  });

  await prisma.bookImage.deleteMany({ where: { bookId: id } });

  await prisma.book.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const book = await prisma.book.update({
    where: { id },
    data: { status: body.status },
  });
  return NextResponse.json(book);
}