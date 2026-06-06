'use client';

import React from 'react';

export function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  const stars = [1, 2, 3, 4, 5];
  const className = size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <div className={`inline-flex items-center gap-1 text-yellow-500 ${className}`}>
      {stars.map((s) => (
        <span key={s} aria-hidden>{s <= rating ? '★' : '☆'}</span>
      ))}
    </div>
  );
}
