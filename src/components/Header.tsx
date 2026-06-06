"use client";

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated' && !!session?.user?.id;
  const displayName = session?.user?.name ?? 'Користувач';
  const avatarUrl = session?.user?.image || session?.user?.avatar;

  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Array<{id: string; exchangeId: string; text: string; type: string}>>([]);
  const [cleared, setCleared] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: number;
    const loadUnread = async () => {
      try {
        const response = await fetch('/api/messages/unread');
        if (!response.ok) return;
        const data = await response.json();
        setUnreadCount(typeof data.unreadMessages === 'number' ? data.unreadMessages : 0);
      } catch {
        // ignore
      }
    };

    if (isAuthenticated) {
      loadUnread();
      interval = window.setInterval(loadUnread, 10000);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isAuthenticated, cleared]);

  useEffect(() => {
    let interval: number;
    const loadNotifications = async () => {
      if (cleared) return;
      try {
        const response = await fetch('/api/notifications');
        if (!response.ok) return;
        const data = await response.json();
        setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      } catch {
        // ignore
      }
    };

    if (isAuthenticated) {
      loadNotifications();
      interval = window.setInterval(loadNotifications, 10000);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isAuthenticated, cleared]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);

  useEffect(() => {
    if (!isAuthenticated) return;
    router.prefetch('/dashboard/messages');
  }, [isAuthenticated, router]);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold text-slate-950">BookSwap</Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6 text-base font-semibold text-slate-700">
          <Link href="/books" prefetch className="hover:text-slate-950">Каталог книг</Link>
          {isAuthenticated && (
            <>
              <Link href="/dashboard/books" prefetch className="hover:text-slate-950">Мої книги</Link>
              <Link href="/dashboard/exchanges" prefetch className="hover:text-slate-950">Обміни</Link>
            </>
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard/books/create" prefetch className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">+ Додати книгу</Link>
              {session?.user?.role === 'ADMIN' && (<Link href="/admin" prefetch className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Адмін</Link>)}

              <div ref={notificationRef} className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-3 text-slate-700 hover:bg-slate-100">
                  <span className="text-xl">🔔</span>
                  {notifications.length > 0 && (<span className="absolute -right-1 -top-1 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-semibold text-white">{notifications.length}</span>)}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-slate-200 bg-white shadow-lg">
                    <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">Сповіщення</h3>
                      {notifications.length > 0 && (<button onClick={() => { setCleared(true); setNotifications([]); setUnreadCount(0); setShowNotifications(false); }} className="text-sm text-slate-500 hover:underline">Очистити</button>)}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <Link key={notif.id} href={`/dashboard/exchanges/${notif.exchangeId}`} className="block border-b border-slate-100 px-4 py-3 hover:bg-slate-50" onClick={() => setShowNotifications(false)}>
                            <p className="text-sm text-slate-900">{notif.text}</p>
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-sm text-slate-500">Немає сповіщень</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/dashboard/messages" prefetch className="relative inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-3 text-slate-700 hover:bg-slate-100">
                <span className="text-xl">💬</span>
                {unreadCount > 0 && (<span className="absolute -right-1 -top-1 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-semibold text-white">{unreadCount}</span>)}
              </Link>

              <Link href="/dashboard/profile" prefetch className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">{displayName.charAt(0).toUpperCase()}</span>
                )}
                <span>{displayName}</span>
              </Link>
              <button
                onClick={() => { window.location.href = '/api/auth/signout'; }}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Вихід
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Увійти</Link>
              <Link href="/register" className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">Зареєструватись</Link>
            </>
          )}
        </div>

        {/* Mobile burger button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="rounded-lg border border-slate-200 bg-white p-2">{menuOpen ? '✕' : '☰'}</button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="space-y-2 px-4 py-4">
            <Link href="/books" prefetch onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50">Каталог книг</Link>
            {isAuthenticated && (
              <>
                <Link href="/dashboard/books" prefetch onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50">Мої книги</Link>
                <Link href="/dashboard/exchanges" prefetch onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50">Обміни</Link>
                <Link href="/dashboard/books/create" prefetch onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50">+ Додати книгу</Link>
                {session?.user?.role === 'ADMIN' && (<Link href="/admin" prefetch onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50">Адмін</Link>)}
                <Link href="/dashboard/messages" prefetch onClick={() => setMenuOpen(false)} className="flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50">
                  <span>Повідомлення</span>
                  {unreadCount > 0 && (<span className="inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">{unreadCount}</span>)}
                </Link>
                <Link href="/dashboard/profile" prefetch onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50">Профіль</Link>
                <button onClick={() => { setMenuOpen(false); window.location.href = '/api/auth/signout'; }} className="w-full text-left rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50">Вийти</button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50">Увійти</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700">Зареєструватись</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}