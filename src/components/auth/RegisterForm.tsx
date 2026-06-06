'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validators/auth.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';

interface RegisterResponse {
  success: boolean;
  error?: string;
  errors?: Record<string, string>;
}

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: RegisterInput) {
    setIsLoading(true);
    setError(null);
    form.clearErrors();

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });

      const data = (await response.json()) as RegisterResponse;

      if (!response.ok || !data.success) {
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, message]) => {
            form.setError(field as keyof RegisterInput, {
              type: 'server',
              message,
            });
          });

          const firstError = Object.values(data.errors)[0];
          setError(firstError || 'Перевірте поля форми');
        } else {
          setError(data.error || 'Помилка реєстрації');
        }
      } else {
        router.push('/login');
      }
    } catch (err) {
      setError('Помилка при реєстрації. Спробуйте пізніше.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Реєстрація</CardTitle>
        <CardDescription>Створіть новий акаунт на BookSwap</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ім&apos;я</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ваше ім'я"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Мінімум 8 символів"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Повторіть пароль</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Повторіть пароль"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Завантаження...' : 'Зареєструватися'}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Вже маєте акаунт?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Увійдіть
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
