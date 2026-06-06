import { ExchangeStatus } from '@prisma/client';

const styles: Record<ExchangeStatus, string> = {
  PENDING: 'bg-blue-100 text-blue-800',
  ACCEPTED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-violet-100 text-violet-800',
  CANCELLED: 'bg-slate-100 text-slate-700',
};

const labels: Record<ExchangeStatus, string> = {
  PENDING: 'Очікує',
  ACCEPTED: 'Прийнято',
  REJECTED: 'Відхилено',
  COMPLETED: 'Завершено',
  CANCELLED: 'Скасовано',
};

export function ExchangeStatusBadge({ status }: { status: ExchangeStatus }) {
  return <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${styles[status]}`}>{labels[status]}</span>;
}
