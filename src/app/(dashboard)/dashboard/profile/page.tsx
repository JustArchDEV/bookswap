import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ProfileEditor from '@/components/profile/ProfileEditor';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { books: true, requestedExchanges: true, ownedExchanges: true },
  });

  if (!user) redirect('/login');

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center">
        <div className="relative mx-auto w-36">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name ?? 'Аватар'} className="mx-auto h-36 w-36 rounded-full object-cover" />
          ) : (
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-slate-100 text-4xl font-semibold text-slate-700">{(user.name?.charAt(0) ?? 'К').toUpperCase()}</div>
          )}
          {/* Inline editor will appear below via ProfileEditor */}
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-slate-950">{user.name}</h1>
        <p className="text-sm text-slate-500">{user.email}</p>
        {user.city && (
          <div className="flex items-center gap-1 text-slate-500 text-sm mt-2 justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            {user.city}
          </div>
        )}
        {user.bio && <p className="mt-2 text-sm text-slate-600">{user.bio}</p>}

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-slate-100 bg-white p-4">
            <p className="text-xs text-slate-500">Книги</p>
            <p className="text-xl font-semibold text-slate-900 mt-2">{user.books.length}</p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-white p-4">
            <p className="text-xs text-slate-500">Обміни</p>
            <p className="text-xl font-semibold text-slate-900 mt-2">{(user.requestedExchanges.length || 0) + (user.ownedExchanges.length || 0)}</p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-white p-4">
            <p className="text-xs text-slate-500">Рейтинг</p>
            <p className="text-xl font-semibold text-slate-900 mt-2">—</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ProfileEditor initialUser={{ name: user.name ?? '', email: user.email ?? '', city: user.city ?? null, bio: user.bio ?? null, avatar: user.avatar ?? null }} />
      </div>
    </main>
  );
}