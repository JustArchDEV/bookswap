import { auth } from '@/auth';
import { exchangeService } from '@/services/exchangeService';
import { notFound, redirect } from 'next/navigation';
import { ExchangeStatusBadge } from '@/components/exchanges/ExchangeStatusBadge';
import Image from 'next/image';
import { ExchangeActions } from '@/components/exchanges/ExchangeActions';
import { prisma } from '@/lib/prisma';
import ReviewForm from '@/components/reviews/ReviewForm';

export default async function ExchangeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id } = await params;
  const exchange = await exchangeService.getExchangeById(id);
  if (!exchange) {
    notFound();
  }
  if (exchange.requesterId !== session.user.id && exchange.ownerId !== session.user.id) {
    notFound();
  }

  let hasReviewed = false;
  if (exchange.status === 'COMPLETED') {
    const existing = await prisma.review.findUnique({ where: { authorId_exchangeId: { authorId: session.user.id, exchangeId: exchange.id } } });
    hasReviewed = !!existing;
  }

  const actions: Array<'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED'> = [];
  if (exchange.status === 'PENDING' && exchange.ownerId === session.user.id) {
    actions.push('ACCEPTED', 'REJECTED');
  }
  if ((exchange.status === 'PENDING' || exchange.status === 'ACCEPTED') && exchange.requesterId === session.user.id) {
    actions.push('CANCELLED');
  }
  if (exchange.status === 'ACCEPTED' && (exchange.requesterId === session.user.id || exchange.ownerId === session.user.id)) {
    actions.push('COMPLETED');
  }

  return (
    <main className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Обмін #{exchange.id.slice(0, 8)}</p>
            <p>Назва книги: {exchange.requestedBook.title}</p>
            <p>Пропонується книга: {exchange.offeredBook.title}</p>
          </div>
          <div className="flex items-center gap-4">
            <ExchangeStatusBadge status={exchange.status} />
          </div>
        </div>

        {actions.length > 0 && <div className="mt-6"><ExchangeActions exchangeId={exchange.id} actions={actions} /></div>}
      </div>

      <div className="mt-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Запитана книга</h3>
              <div className="mt-4 flex gap-4">
                {exchange.requestedBook.images?.[0] ? (
                  <div className="relative h-32 w-24 flex-shrink-0">
                    <Image src={exchange.requestedBook.images[0].url} alt={exchange.requestedBook.title} fill className="object-cover rounded-lg" sizes="96px" />
                  </div>
                ) : (
                  <div className="h-32 w-24 flex-shrink-0 rounded-lg bg-slate-100" />
                )}
                <div>
                  <p className="text-base font-medium text-slate-900">{exchange.requestedBook.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{exchange.requestedBook.author}</p>
                  {exchange.requestedBook.genre && (
                    <p className="mt-2 text-xs text-slate-500">Жанр: {exchange.requestedBook.genre.name}</p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Запропонована книга</h3>
              <div className="mt-4 flex gap-4">
                {exchange.offeredBook.images?.[0] ? (
                  <div className="relative h-32 w-24 flex-shrink-0">
                    <Image src={exchange.offeredBook.images[0].url} alt={exchange.offeredBook.title} fill className="object-cover rounded-lg" sizes="96px" />
                  </div>
                ) : (
                  <div className="h-32 w-24 flex-shrink-0 rounded-lg bg-slate-100" />
                )}
                <div>
                  <p className="text-base font-medium text-slate-900">{exchange.offeredBook.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{exchange.offeredBook.author}</p>
                  {exchange.offeredBook.genre && (
                    <p className="mt-2 text-xs text-slate-500">Жанр: {exchange.offeredBook.genre.name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Статус</p>
                <div className="mt-2"><ExchangeStatusBadge status={exchange.status} /></div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Запитувач</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{exchange.requester.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Власник</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{exchange.owner.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Створено</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{new Date(exchange.createdAt).toLocaleDateString('uk-UA')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Чат</h2>
          <div className="mt-4">
            <a className="text-sm text-blue-600 hover:underline" href={`/dashboard/messages?chat=${exchange.id}`}>Відкрити чат</a>
          </div>
        </div>
      </div>

      {exchange.status === 'COMPLETED' && !hasReviewed && (
        <div id="review" className="mt-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Відгук</h2>
            <div className="mt-4">
              <ReviewForm exchangeId={exchange.id} targetId={exchange.requesterId === session.user.id ? exchange.ownerId : exchange.requesterId} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

