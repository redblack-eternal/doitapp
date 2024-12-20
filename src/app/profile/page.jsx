'use client';

import { useSession } from 'next-auth/react';

export default function Profile() {
  const { data: session } = useSession();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <div className="rounded-lg border bg-card text-card-foreground p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="text-lg">{session?.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 