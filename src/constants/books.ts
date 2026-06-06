import { BookCondition, BookStatus } from '@/types/book';

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  [BookStatus.AVAILABLE]: 'Доступна',
  [BookStatus.RESERVED]: 'Зарезервована',
  [BookStatus.EXCHANGED]: 'Обміняна',
};

export const BOOK_CONDITION_LABELS: Record<BookCondition, string> = {
  [BookCondition.NEW]: 'Нова',
  [BookCondition.GOOD]: 'В гарному стані',
  [BookCondition.FAIR]: 'Задовільна',
  [BookCondition.POOR]: 'Погана',
};

export const LANGUAGE_LABELS: Record<string, string> = {
  uk: 'Українська',
  en: 'Англійська',
  de: 'Німецька',
  fr: 'Французька',
  pl: 'Польська',
  cs: 'Чеська',
  it: 'Італійська',
  es: 'Іспанська',
  pt: 'Португальська',
  nl: 'Нідерландська',
  sv: 'Шведська',
  no: 'Норвезька',
  da: 'Данська',
  fi: 'Фінська',
  hu: 'Угорська',
  ro: 'Румунська',
  bg: 'Болгарська',
  other: 'Інша',
};

export const BOOK_CONDITION_COLORS: Record<BookCondition, string> = {
  [BookCondition.NEW]: 'bg-green-100 text-green-800',
  [BookCondition.GOOD]: 'bg-blue-100 text-blue-800',
  [BookCondition.FAIR]: 'bg-yellow-100 text-yellow-800',
  [BookCondition.POOR]: 'bg-red-100 text-red-800',
};

export const BOOK_STATUS_COLORS: Record<BookStatus, string> = {
  [BookStatus.AVAILABLE]: 'bg-green-100 text-green-800',
  [BookStatus.RESERVED]: 'bg-yellow-100 text-yellow-800',
  [BookStatus.EXCHANGED]: 'bg-gray-100 text-gray-800',
};

export const BOOKS_PER_PAGE = 12;

export const BOOK_IMAGE_UPLOAD_CONFIG = {
  FOLDER: 'bookswap/books',
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};
