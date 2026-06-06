import { ExchangeStatus } from '@/types/exchange';

export const EXCHANGE_STATUS_LABELS: Record<ExchangeStatus, string> = {
  [ExchangeStatus.PENDING]: 'Очікує',
  [ExchangeStatus.ACCEPTED]: 'Прийнято',
  [ExchangeStatus.REJECTED]: 'Відхилено',
  [ExchangeStatus.COMPLETED]: 'Завершено',
  [ExchangeStatus.CANCELLED]: 'Скасовано',
};

export const EXCHANGE_STATUS_COLORS: Record<ExchangeStatus, string> = {
  [ExchangeStatus.PENDING]: 'bg-blue-100 text-blue-800',
  [ExchangeStatus.ACCEPTED]: 'bg-green-100 text-green-800',
  [ExchangeStatus.REJECTED]: 'bg-red-100 text-red-800',
  [ExchangeStatus.COMPLETED]: 'bg-purple-100 text-purple-800',
  [ExchangeStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
};

export const EXCHANGE_STATUS_BADGES: Record<ExchangeStatus, string> = {
  [ExchangeStatus.PENDING]: 'warning',
  [ExchangeStatus.ACCEPTED]: 'success',
  [ExchangeStatus.REJECTED]: 'error',
  [ExchangeStatus.COMPLETED]: 'info',
  [ExchangeStatus.CANCELLED]: 'default',
};

export const MESSAGE_POLLING_INTERVAL = 5000; // 5 seconds

export const MESSAGES_PER_PAGE = 20;
