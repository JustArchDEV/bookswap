import { z } from 'zod';

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Ім\'я повинно містити мінімум 2 символи'),
  email: z.string().email('Вкажіть коректну email адресу'),
  bio: z.string().max(500, 'Біографія не повинна перевищувати 500 символів').optional(),
  city: z.string().max(100, 'Місто не повинне перевищувати 100 символів').optional(),
  avatar: z.string().url('Вкажіть коректний URL').optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
