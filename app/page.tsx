'use client';

import { useEffect, useState } from 'react';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import UsersGrid from './components/UsersGrid';
import JoinCommunity from './components/JoinCommunity';
import { User } from './types/user';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [fullSongsByUser, setFullSongsByUser] = useState<Record<number, string[]>>({});
  const [loadingSongsUserId, setLoadingSongsUserId] = useState<number | null>(null);
  const [songsErrorByUser, setSongsErrorByUser] = useState<Record<number, string>>({});

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      try {
        setLoading(true);
        setError('');

        const res = await fetch('/api/users', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Request failed: ' + res.status);
        }

        const data = await res.json();
        if (!ignore) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!ignore) {
          setError('Could not load performers.');
          setUsers([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadUsers();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleTogglePlaylist(userId: number) {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }

    setExpandedUserId(userId);
    if (fullSongsByUser[userId]) {
      return;
    }

    try {
      setLoadingSongsUserId(userId);
      setSongsErrorByUser((prev) => ({ ...prev, [userId]: '' }));

      const res = await fetch('/api/songs?userId=' + userId, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Request failed: ' + res.status);
      }

      const data = await res.json();
      const songs = Array.isArray(data.songs) ? data.songs : [];

      setFullSongsByUser((prev) => ({
        ...prev,
        [userId]: songs,
      }));
    } catch (err) {
      setSongsErrorByUser((prev) => ({
        ...prev,
        [userId]: 'Could not load full playlist.',
      }));
    } finally {
      setLoadingSongsUserId(null);
    }
  }

  if (loading) {
    return <div className="min-h-screen grid place-items-center">Loading performers...</div>;
  }

  if (error) {
    return <div className="min-h-screen grid place-items-center">{error}</div>;
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <StatsSection users={users} />
        <div className="mt-16">
          <UsersGrid
            users={users}
            expandedUserId={expandedUserId}
            loadingSongsUserId={loadingSongsUserId}
            songsErrorByUser={songsErrorByUser}
            fullSongsByUser={fullSongsByUser}
            onToggle={handleTogglePlaylist}
          />
        </div>
        <JoinCommunity />
      </div>
    </div>
  );
}