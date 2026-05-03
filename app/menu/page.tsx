'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MenuDashboard  from '../components/MenuDashboard';

type UserData = {
  user: {
    id: number;
    username: string;
    name: string;
  };
};

export default function MenuPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMenu() {
      const res = await fetch('/api/menu', { cache: 'no-store' });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) return;

      const data = (await res.json()) as UserData;
      if (!ignore) setUserData(data);
    }

    loadMenu();

    return () => {
      ignore = true;
    };
  }, [router]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <div className="relative overflow-hidden bg-background w-full min-h-screen">
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Centered content for top + title */}
      <div className="relative max-w-5xl mx-auto px-4 py-12">
        {/* top row */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="rounded-full border border-border bg-background/80 px-6 py-3 text-md font-semibold text-primary transition-colors hover:border-primary/40"
            onClick={handleLogout}>
            Log Out
          </button>

          <div className="w-[88px]" />
        </div>

        <h1 className="mt-6 text-center text-5xl md:text-6xl font-extrabold tracking-tight text-purple-600">
           Hello, {userData?.user.name}!
        </h1>
      </div>

      {/* Menu Options */}
      <div className="relative left-1/2 -translate-x-1/2 w-screen px-6 md:px-12">
        <h3 className="mt-6 text-center text-5xl md:text-6xl font-extrabold tracking-tight text-purple-600">
          Choose a menu option below:
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 py-10">
          <button type="button" className="rounded-full bg-blue-400 px-10 py-5 text-xl text-gray-900 hover:bg-blue-500 transition-colors"
            onClick={() => router.push('/fullCatalog')}>
            View Catalog
          </button>
          
          <button type="button" className="rounded-full bg-blue-300 px-10 py-5 text-xl text-gray-900 hover:bg-blue-400 transition-colors"
            onClick={() => router.push('/playlistDashboard')}>
            Manage Playlists
          </button>

          <button type="button" className="rounded-full bg-indigo-300 px-10 py-5 text-xl text-gray-900 hover:bg-indigo-400 transition-colors"
            onClick={() => router.push('/communityPlaylist')}>
            Community Playlist
          </button>

          <button type="button" className="rounded-full bg-violet-400 px-10 py-5 text-xl text-gray-900 hover:bg-violet-500 transition-colors"
            onClick={() => router.push('/otherFriendsPlaylists')}>
            Friends' Playlists
          </button>

          <button type="button" className="rounded-full bg-purple-400 px-10 py-5 text-xl text-gray-900 hover:bg-purple-500 transition-colors"
            onClick={() => router.push('/user')}>
            Manage Account Center
          </button>
        </div>
      </div>

      {/* Current Statistics */}
      <div className="border border-gray-100"> </div>    
        <MenuDashboard />
    </div>
  );
}