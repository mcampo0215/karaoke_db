'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserCard from '../components/UserCard';
import { User } from '../types/user';

type CurrentUser = {
  id: number;
};

export default function FriendsPlaylistPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [playlistsByUserId, setPlaylistsByUserId] = useState<Record<number, string[]>>({});
  const [loadingPlaylistsUserId, setLoadingPlaylistsUserId] = useState<number | null>(null);
  const [playlistsErrorByUserId, setPlaylistsErrorByUserId] = useState<Record<number, string>>({});

  useEffect(() => {
    let ignore = false;

    async function loadFriendsPlaylists() {
      try {
        setLoading(true);
        setError('');

        const [usersRes, meRes] = await Promise.all([
          fetch('/api/users', { cache: 'no-store' }),
          fetch('/api/users/me', { cache: 'no-store' }),
        ]);

        if (meRes.status === 401) {
          router.push('/login');
          return;
        }

        if (!usersRes.ok) {
          throw new Error('Request failed: ' + usersRes.status);
        }

        const [usersData, meData] = await Promise.all([
          usersRes.json(),
          meRes.json() as Promise<{ user: CurrentUser }>,
        ]);

        const meUserId = Number(meData?.user?.id);
        const allUsers = Array.isArray(usersData) ? usersData : [];

        if (!ignore) {
          setCurrentUserId(Number.isFinite(meUserId) ? meUserId : null);
          setUsers(allUsers.filter((user: User) => Number(user.id) !== meUserId));
        }
      } catch (err) {
        if (!ignore) {
          setUsers([]);
          setError('Could not load friends\' playlists.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadFriendsPlaylists();

    return () => {
      ignore = true;
    };
  }, [router]);

  async function handleTogglePlaylist(userId: number) {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }

    setExpandedUserId(userId);

    if (playlistsByUserId[userId]) {
      return;
    }

    try {
      setLoadingPlaylistsUserId(userId);
      setPlaylistsErrorByUserId((prev) => ({ ...prev, [userId]: '' }));

      const res = await fetch('/api/songs?userId=' + userId, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Request failed: ' + res.status);
      }

      const data = await res.json();
      const playlists = Array.isArray(data.playlists) ? data.playlists : [];

      setPlaylistsByUserId((prev) => ({
        ...prev,
        [userId]: playlists,
      }));
    } catch (err) {
      setPlaylistsErrorByUserId((prev) => ({
        ...prev,
        [userId]: 'Could not load full playlist.',
      }));
    } finally {
      setLoadingPlaylistsUserId(null);
    }
  }

  return (
    <div className="relative overflow-hidden bg-background w-full min-h-screen text-foreground">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary opacity-10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 py-20">
        <div className="mb-12">
          <div className="flex justify-end mb-6">
            <button
              className="rounded-full border border-border bg-background/80 px-4 py-2 text-md font-semibold text-primary transition-colors hover:border-primary/40"
              onClick={() => router.push('/menu')}
            >
              Back to menu
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight max-w-4xl mx-auto leading-tight">
              Friends' Playlist
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted">
              Browse playlists from your friends.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="card p-10 text-center text-muted">Loading friends' playlists...</div>
        ) : error ? (
          <div className="card p-10 text-center text-error">{error}</div>
        ) : users.length === 0 ? (
          <div className="card p-10 text-center text-muted">
            {currentUserId ? 'No other users have playlists yet.' : 'No other users were found.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {users.map((user, index) => (
              <UserCard
                key={user.id}
                user={user}
                index={index}
                expanded={expandedUserId === user.id}
                loadingSongs={loadingPlaylistsUserId === user.id}
                songsError={playlistsErrorByUserId[user.id]}
                playlists={playlistsByUserId[user.id] || []}
                onToggle={handleTogglePlaylist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
