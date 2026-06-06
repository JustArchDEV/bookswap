'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Помилка</h1>
        <p className="text-gray-600 mb-8">
          Сталася помилка при завантаженні сторінки. Спробуйте ще раз.
        </p>
        <p className="text-sm text-gray-500 mb-6">{error.message}</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button onClick={reset}>Спробувати ще раз</Button>
          <Link href="/">
            <Button variant="outline">На головну</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
