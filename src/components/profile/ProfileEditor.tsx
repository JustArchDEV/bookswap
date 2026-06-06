'use client';

import { useState } from 'react';
import { ProfileForm } from './ProfileForm';

export default function ProfileEditor({ initialUser }: { initialUser: { name: string; email: string; city?: string | null; bio?: string | null; avatar?: string | null } }) {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      <div className="mt-4">
        <button onClick={() => setEditing((s) => !s)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          {editing ? 'Приховати форму' : 'Редагувати профіль'}
        </button>
      </div>
      {editing && (
        <div className="mt-4">
          <ProfileForm user={{ name: initialUser.name, email: initialUser.email, city: initialUser.city ?? undefined, bio: initialUser.bio ?? undefined, avatar: initialUser.avatar ?? undefined }} />
        </div>
      )}
    </div>
  );
}
