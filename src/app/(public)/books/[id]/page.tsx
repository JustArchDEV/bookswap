export const revalidate = 60;

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { bookService } from '@/services/bookService';
import { notFound } from 'next/navigation';
import { BookDetail } from '@/components/books/BookDetail';
import { ExchangeProposalForm } from '@/components/exchanges/ExchangeProposalForm';

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [book, session] = await Promise.all([bookService.getBookById(id), auth()]);

  if (!book) {
    notFound();
  }

  const userBooks = session?.user?.id
    ? await prisma.book.findMany({
        where: { ownerId: session.user.id, status: 'AVAILABLE', id: { not: book.id } },
        select: { id: true, title: true },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <BookDetail book={book} />
      {session?.user?.id && book.ownerId !== session.user.id && userBooks.length > 0 && (
        <div className="mt-8 max-w-xl">
          <ExchangeProposalForm requestedBookId={book.id} userBooks={userBooks} />
        </div>
      )}
    </main>
  );
}

