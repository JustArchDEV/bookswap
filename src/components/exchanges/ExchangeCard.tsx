'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Prisma } from '@prisma/client';
import { ExchangeStatusBadge } from './ExchangeStatusBadge';

let unreadExchangeCache: string[] | null = null;

type ExchangeCardExchange = Prisma.ExchangeGetPayload<{
  include: {
    requester: true;
    owner: true;
    requestedBook: { include: { images: true; genre: true; owner: true } };
    offeredBook: { include: { images: true; genre: true; owner: true } };
  };
}>;

export function ExchangeCard({ exchange }: { exchange: ExchangeCardExchange }) {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    let active = true;

    const updateUnread = (ids: string[]) => {
      if (!active) return;
      setHasUnread(ids.includes(exchange.id));
    };

    if (unreadExchangeCache) {
      updateUnread(unreadExchangeCache);
      return;
    }

    fetch('/api/messages/unread')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!data || !Array.isArray(data.unreadExchanges)) return;
        const ids = data.unreadExchanges as string[];
        unreadExchangeCache = ids;
        updateUnread(ids);
      })
      .catch(() => {
        // ignore fetch failures
      });

    return () => {
      active = false;
    };
  }, [exchange.id]);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Book image */}
        {exchange.requestedBook.images?.[0] && (
          <div className="relative h-48 w-full sm:h-auto sm:w-48 flex-shrink-0">
            <Image src={exchange.requestedBook.images[0].url} alt={exchange.requestedBook.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 192px" />
          </div>
        )}
        {/* Content */}
        <div className="flex flex-col justify-between flex-1 p-5">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">#{exchange.id.slice(0, 8)}</p>
                <h3 className="text-lg font-semibold text-slate-900 mt-1">{exchange.requestedBook.title}</h3>
                <p className="text-sm text-slate-600 mt-1">Пропозиція: <span className="font-medium">{exchange.offeredBook.title}</span></p>
              </div>
              <ExchangeStatusBadge status={exchange.status} />
            </div>
            {hasUnread && (
              <span className="inline-block rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white mb-3">
                Нові повідомлення
              </span>
            )}
          </div>
          {/* Avatars and actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
            <div className="flex items-center gap-3">
              {/* Requester avatar */}
              <div className="flex items-center gap-2">
                {exchange.requester.avatar ? (
                  <Image src={exchange.requester.avatar} alt={exchange.requester.name} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                    {exchange.requester.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium text-slate-600">{exchange.requester.name}</span>
              </div>
              <span className="text-slate-300">↔️</span>
              {/* Owner avatar */}
              <div className="flex items-center gap-2">
                {exchange.owner.avatar ? (
                  <Image src={exchange.owner.avatar} alt={exchange.owner.name} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                    {exchange.owner.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium text-slate-600">{exchange.owner.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/messages?chat=${exchange.id}`} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Чат
              </Link>
              <Link href={`/dashboard/exchanges/${exchange.id}`} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                Деталі
              </Link>
              {exchange.status === 'COMPLETED' && (
                <Link href={`/dashboard/exchanges/${exchange.id}#review`} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
                  Відгук
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
