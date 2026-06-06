import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Ім\'я повинно містити мінімум 2 символи'),
    email: z.string().email('Вкажіть коректну email адресу'),
    password: z.string().min(8, 'Пароль повинен містити мінімум 8 символів'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролі не співпадають',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Вкажіть коректну email адресу'),
  password: z.string().min(1, 'Пароль обов\'язковий'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
