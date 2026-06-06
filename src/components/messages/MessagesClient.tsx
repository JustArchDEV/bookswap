'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ChatPanel } from '@/components/chat/ChatPanel';

type Conversation = {
  id: string;
  requesterId: string;
  ownerId: string;
  requester: { id: string; name: string; avatar?: string };
  owner: { id: string; name: string; avatar?: string };
  requestedBook: { id: string; title: string };
  offeredBook: { id: string; title: string };
  messages: Array<{ id: string; content: string; createdAt: string; isRead: boolean; senderId: string }>;
};

export default function MessagesClient({ initialConversations, currentUserId }: { initialConversations: Conversation[]; currentUserId: string }) {
  const searchParams = useSearchParams();
  const [conversations] = useState<Conversation[]>(initialConversations);
  const [selectedExchangeId, setSelectedExchangeId] = useState<string | null>(null);

  useEffect(() => {
    const chatParam = searchParams.get('chat');
    if (!chatParam) return;
    const exists = conversations.some((exchange) => exchange.id === chatParam);
    if (exists) {
      setSelectedExchangeId(chatParam);
    }
  }, [conversations, searchParams]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="md:grid grid-cols-[320px_1fr] gap-6">
        <aside className={`h-[calc(100vh-4rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm ${selectedExchangeId ? 'hidden md:block' : 'block'}`}>
          {conversations.length === 0 ? (
            <div className="text-center text-sm text-slate-600">У вас ще немає чатів</div>
          ) : (
            <div className="space-y-2">
              {conversations.map((exchange) => {
                const otherUser = exchange.requesterId === currentUserId ? exchange.owner : exchange.requester;
                const lastMessage = exchange.messages[0];
                const preview = lastMessage ? lastMessage.content : 'Почніть розмову';
                const hasUnreadMessages = lastMessage && !lastMessage.isRead && lastMessage.senderId !== currentUserId;

                return (
                  <button key={exchange.id} onClick={() => setSelectedExchangeId(exchange.id)} className={`group flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition ${
                    selectedExchangeId === exchange.id ? 'bg-blue-50' : hasUnreadMessages ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-slate-50'
                  }`}>
                    <div className="flex-shrink-0">
                      {otherUser.avatar ? (
                        <Image src={otherUser.avatar} alt={otherUser.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">{otherUser.name.split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase()}</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm ${hasUnreadMessages ? 'font-bold text-slate-950' : 'font-semibold'} text-slate-900`}>{otherUser.name}</p>
                          <p className="text-xs text-slate-500">{exchange.requestedBook.title}</p>
                        </div>
                        {hasUnreadMessages && <div className="flex-shrink-0 rounded-full bg-blue-500 w-2.5 h-2.5"></div>}
                      </div>
                      <p className={`mt-2 text-sm truncate ${hasUnreadMessages ? 'text-slate-700 font-medium' : 'text-slate-600'}`}>{preview}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <div className={`h-[calc(100vh-4rem)] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${selectedExchangeId ? 'block' : 'hidden md:block'}`}>
          {/* Back button visible only on mobile when a chat is selected */}
          {selectedExchangeId && (
            <div className="mb-4 md:hidden">
              <button type="button" onClick={() => setSelectedExchangeId(null)} className="inline-flex items-center gap-2 text-sm text-slate-700">← Назад до списку</button>
            </div>
          )}

          {selectedExchangeId ? (
            <ChatPanel exchangeId={selectedExchangeId} currentUserId={currentUserId} />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">Оберіть чат зі списку</div>
          )}
        </div>
      </div>
    </div>
  );
}
