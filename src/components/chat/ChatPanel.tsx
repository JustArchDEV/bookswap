'use client';

import { useCallback, useEffect, useState } from 'react';
import { POLLING_INTERVAL } from '@/constants/chat';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Prisma } from '@prisma/client';

type ChatMessage = Prisma.MessageGetPayload<{ include: { sender: true } }>;

export function ChatPanel({ exchangeId, currentUserId }: { exchangeId: string; currentUserId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const loadMessages = useCallback(async () => {
    const response = await fetch(`/api/messages?exchangeId=${exchangeId}`);
    const payload = await response.json();
    if (response.ok) {
      setMessages(payload.messages ?? payload);
    }
  }, [exchangeId]);

  async function sendMessage(content: string) {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exchangeId, content }),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error ?? 'Помилка відправки');
    }
    await loadMessages();
  }

  useEffect(() => {
    loadMessages();
    const timer = setInterval(loadMessages, POLLING_INTERVAL);
    return () => clearInterval(timer);
  }, [exchangeId, loadMessages]);

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} isOwn={message.senderId === currentUserId} />
        ))}
      </div>
      <div className="mt-auto">
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}
