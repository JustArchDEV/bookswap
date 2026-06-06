'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileUpdateSchema, type ProfileUpdateInput } from '@/lib/validators/profile.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    city?: string | null;
    bio?: string | null;
    avatar?: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(user.avatar ?? null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      city: user.city ?? '',
      bio: user.bio ?? '',
      avatar: user.avatar ?? '',
    },
  });

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsUploading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Помилка завантаження зображення');
        return;
      }
      setValue('avatar', data.url);
      setPreview(data.url);
    } catch (err) {
      console.error('Upload error', err);
      setError('Помилка завантаження зображення. Спробуйте пізніше.');
    } finally {
      setIsUploading(false);
    }
  }

  async function onSubmit(values: ProfileUpdateInput) {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Помилка оновлення профілю');
        return;
      }

      setSuccess('Профіль успішно оновлено');
      router.refresh();
    } catch (err) {
      setError('Помилка оновлення профілю. Спробуйте пізніше.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-950">Редагування профілю</h2>
      <p className="mt-2 text-sm text-slate-600">Оновіть дані, які будуть відображатися у вашому профілі.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        {error && <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {success && <div className="rounded-2xl bg-green-50 p-4 text-sm text-green-700">{success}</div>}

        <div className="flex items-center gap-6">
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-slate-100">
            {preview ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={preview} alt="Аватар" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-700">
                {(user.name?.charAt(0) ?? 'К').toUpperCase()}
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                {isUploading ? 'Завантаження...' : '📎 Вибрати файл'}
              </Button>
              <span className="text-sm text-slate-500">{selectedFileName ?? 'Файл не вибрано'} • Максимум 5MB. Формат: JPG, PNG</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm font-medium text-slate-700">Імʼя</span>
                <Input type="text" {...register('name')} />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <Input type="email" {...register('email')} disabled />
              </label>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Місто</span>
            <Input type="text" {...register('city')} />
            {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Про себе</span>
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              {...register('bio')}
            />
            {errors.bio && <p className="text-sm text-red-600">{errors.bio.message}</p>}
          </label>
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Збереження...' : 'Зберегти зміни'}
        </Button>
      </form>
    </div>
  );
}