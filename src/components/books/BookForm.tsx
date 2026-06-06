'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBookSchema, CreateBookDto, updateBookSchema } from '@/lib/validators/book.schema';
import { BookCondition } from '@prisma/client';
import { BOOK_CONDITION_LABELS } from '@/constants/books';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type FormImage = { url: string; publicId: string; isCover: boolean; position: number };

function normalizeImages(images: FormImage[]) {
  return images.map((image, index) => ({ ...image, position: index, isCover: index === 0 }));
}

export function BookForm({
  mode,
  bookId,
  defaultValues,
  genres,
}: {
  mode: 'create' | 'edit';
  bookId?: string;
  defaultValues?: Partial<CreateBookDto> & { images?: FormImage[] };
  genres: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [images, setImages] = useState<FormImage[]>(
    defaultValues?.images?.length ? normalizeImages(defaultValues.images) : []
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const schema = mode === 'create' ? createBookSchema : updateBookSchema;
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CreateBookDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      author: defaultValues?.author ?? '',
      description: defaultValues?.description ?? '',
      language: defaultValues?.language ?? '',
      publishedYear: defaultValues?.publishedYear ?? undefined,
      genreId: defaultValues?.genreId ?? genres[0]?.id ?? '',
      condition: defaultValues?.condition ?? BookCondition.GOOD,
      images: defaultValues?.images?.map(({ url, publicId }) => ({ url, publicId })) ?? [],
    },
  });

  useEffect(() => {
    setValue('images', images.map(({ url, publicId }) => ({ url, publicId })));
  }, [images, setValue]);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    if (images.length + files.length > 5) {
      setError('Максимум 5 фото');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          const response = await fetch('/api/upload', { method: 'POST', body: formData });
          const payload = await response.json();
          if (!response.ok) throw new Error(payload.error ?? 'Помилка завантаження');
          return { url: payload.url as string, publicId: payload.publicId as string, isCover: false, position: 0 };
        })
      );
      setImages((current) => normalizeImages([...current, ...uploaded]));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка завантаження');
    } finally {
      setBusy(false);
    }
  }

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return normalizeImages(next);
    });
  };

  const removeImage = (index: number) =>
    setImages((current) => normalizeImages(current.filter((_, i) => i !== index)));

  async function onSubmit(values: CreateBookDto) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(
        mode === 'create' ? '/api/books' : `/api/books/${bookId}`,
        {
          method: mode === 'create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...values,
            images: normalizeImages(images).map(({ url, publicId }) => ({ url, publicId })),
          }),
        }
      );
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Помилка збереження');
      router.push('/dashboard/books');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка збереження');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
      {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Інформація про книгу</h2>
          <p className="mt-2 text-sm text-slate-500">Заповніть дані, щоб покупці легко знаходили вашу книгу.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-800">Назва</span>
            <input className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" {...register('title')} />
            {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-800">Автор</span>
            <input className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" {...register('author')} />
            {errors.author && <p className="text-sm text-red-600">{errors.author.message}</p>}
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-800">Опис</span>
          <textarea className="min-h-32 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" {...register('description')} />
          {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
        </label>

        <div className="grid gap-6 md:grid-cols-3">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-800">Мова</span>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" {...register('language')}>
              <option value="uk">Українська</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
              <option value="pl">Polski</option>
              <option value="cs">Čeština</option>
              <option value="it">Italiano</option>
              <option value="es">Español</option>
              <option value="pt">Português</option>
              <option value="nl">Nederlands</option>
              <option value="sv">Svenska</option>
              <option value="no">Norsk</option>
              <option value="da">Dansk</option>
              <option value="fi">Suomi</option>
              <option value="hu">Magyar</option>
              <option value="ro">Română</option>
              <option value="bg">Български</option>
              <option value="other">Інша</option>
            </select>
            {errors.language && <p className="text-sm text-red-600">{errors.language.message}</p>}
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-800">Рік</span>
            <input
              type="number"
              min={1}
              max={new Date().getFullYear()}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('publishedYear', { valueAsNumber: true })}
            />
            {errors.publishedYear && <p className="text-sm text-red-600">{errors.publishedYear.message}</p>}
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-800">Жанр</span>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" {...register('genreId')}>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
            {errors.genreId && <p className="text-sm text-red-600">{errors.genreId.message}</p>}
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-800">Стан</span>
              <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" {...register('condition')}>
                <option value="NEW">{BOOK_CONDITION_LABELS.NEW ?? 'Нова'}</option>
                <option value="GOOD">{BOOK_CONDITION_LABELS.GOOD ?? 'В гарному стані'}</option>
                <option value="FAIR">{BOOK_CONDITION_LABELS.FAIR ?? 'Задовільна'}</option>
                <option value="POOR">{BOOK_CONDITION_LABELS.POOR ?? 'Погана'}</option>
              </select>
            {errors.condition && <p className="text-sm text-red-600">{errors.condition.message}</p>}
          </label>
          {/* status removed: books are set to AVAILABLE on create */}
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Фотографії</h2>
          <p className="mt-2 text-sm text-slate-600">Завантажте до 5 фото. Перша фотографія автоматично стане обкладинкою.</p>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-sm text-slate-600">Фото: {images.length} / 5</p>
            <div className="flex items-center gap-3">
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                const files = e.target.files;
                uploadFiles(files);
                if (files && files.length) setSelectedFileName(files.length > 1 ? `${files.length} файлів` : files[0].name);
              }} disabled={busy} />
              <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium" onClick={() => fileInputRef.current?.click()} disabled={busy}>📎 Вибрати файл</button>
              <span className="text-sm text-slate-600">{selectedFileName ?? 'Файл не вибрано'}</span>
            </div>
          </div>
          {errors.images && <p className="text-sm text-red-600">{errors.images.message ?? 'Додайте хоча б одне фото'}</p>}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {images.map((image, index) => (
            <div key={`${image.publicId}-${index}`} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-40 w-full">
                <Image src={image.url} alt={`book-${index + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 20vw" />
              </div>
              <div className="flex items-center justify-between gap-2 p-3 text-xs">
                {index === 0 && (
                  <span className="rounded-full bg-amber-500 px-2 py-1 text-white text-xs">Обкладинка</span>
                )}
                <div className="flex gap-1">
                  <button type="button" onClick={() => moveImage(index, -1)} className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-slate-700">↑</button>
                  <button type="button" onClick={() => moveImage(index, 1)} className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-slate-700">↓</button>
                  <button type="button" onClick={() => removeImage(index)} className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-red-600">✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-blue-600 px-8 py-3 text-lg font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? 'Збереження...' : mode === 'create' ? 'Створити книгу' : 'Зберегти зміни'}
      </button>
    </form>
  );
}