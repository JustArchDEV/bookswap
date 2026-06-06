import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Сторінка не знайдена
        </h2>
        <p className="text-gray-600 mb-8">
          На жаль, сторінка, яку ви шукаєте, не існує або була видалена.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/">
            <Button>На головну</Button>
          </Link>
          <Link href="/books">
            <Button variant="outline">До каталогу</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
