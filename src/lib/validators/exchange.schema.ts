import { z } from 'zod';

export const createExchangeSchema = z.object({
  requestedBookId: z.string().min(1),
  offeredBookId: z.string().min(1),
  message: z.string().min(1).max(2000).optional().nullable(),
});

export const updateExchangeStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED']),
});

export type CreateExchangeDto = z.infer<typeof createExchangeSchema>;
export type UpdateExchangeStatusDto = z.infer<typeof updateExchangeStatusSchema>;
