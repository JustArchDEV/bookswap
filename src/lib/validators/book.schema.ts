import { BookCondition, BookStatus } from '@prisma/client';
import { z } from 'zod';

const bookRecordSchema = z.object({}).passthrough();

export const bookImageInputSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
});

export const createBookSchema = z.object({
  title: z.string().min(2).max(255),
  author: z.string().min(2).max(255),
  description: z.string().min(10).max(5000),
  language: z.string().min(1).max(100).optional().nullable(),
  publishedYear: z.coerce.number().int().min(1000).max(new Date().getFullYear()).optional().nullable(),
  genreId: z.string().min(1),
  condition: z.nativeEnum(BookCondition),
  images: z.array(bookImageInputSchema).min(1).max(5),
});

export const updateBookSchema = createBookSchema.partial().extend({
  images: z.array(bookImageInputSchema).min(1).max(5).optional(),
});

export const bookFiltersSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  genreId: z.string().optional(),
  language: z.string().optional(),
  condition: z.nativeEnum(BookCondition).optional(),
  status: z.nativeEnum(BookStatus).optional(),
  sortBy: z.enum(['newest', 'oldest', 'title_asc', 'title_desc']).default('newest'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
});

export const bookListResponseSchema = z.object({
  books: z.array(bookRecordSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  pages: z.number(),
});

export type CreateBookDto = z.infer<typeof createBookSchema>;
export type UpdateBookDto = z.infer<typeof updateBookSchema>;
export type BookFiltersDto = z.infer<typeof bookFiltersSchema>;
export type BookListResponseDto = z.infer<typeof bookListResponseSchema>;
