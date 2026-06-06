import { Prisma } from '@prisma/client';
import { ExchangeCard } from './ExchangeCard';

type ExchangeListExchange = Prisma.ExchangeGetPayload<{
  include: {
    requester: true;
    owner: true;
    requestedBook: { include: { images: true; genre: true; owner: true } };
    offeredBook: { include: { images: true; genre: true; owner: true } };
  };
}>;

export function ExchangeList({ exchanges }: { exchanges: ExchangeListExchange[] }) {
  if (!exchanges.length) {
    return <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500">Обмінів ще немає</div>;
  }

  return <div className="grid gap-4">{exchanges.map((exchange) => <ExchangeCard key={exchange.id} exchange={exchange} />)}</div>;
}
