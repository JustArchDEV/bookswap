import { z } from 'zod';

export const createMessageSchema = z.object({
  exchangeId: z.string().min(1),
  content: z.string().min(1, 'Повідомлення не може бути пустим').max(2000),
});

export type CreateMessageDto = z.infer<typeof createMessageSchema>;
