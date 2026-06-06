 'use client';

import { Prisma } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

export function MessageBubble({ message, isOwn }: { message: Prisma.MessageGetPayload<{ include: { sender: true } }>; isOwn: boolean }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} py-1`}>
      <div className={`flex items-end gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        <Link href={`/users/${message.sender.id}`} className="flex-shrink-0">
          {message.sender.avatar ? (
            <Image src={message.sender.avatar} alt={message.sender.name} width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">{message.sender.name.charAt(0).toUpperCase()}</div>
          )}
        </Link>
        <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${isOwn ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
          <p className="text-sm font-medium">{message.sender.name}</p>
          <p className="whitespace-pre-line text-sm">{message.content}</p>
        </div>
      </div>
    </div>
  );
}
