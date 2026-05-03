'use client';

import { useEffect, useState } from 'react';
import HomeSection from './components/HomeSection';
import StatsSection from './components/StatsSection';
import UsersGrid from './components/UsersGrid';
import JoinCommunity from './components/JoinCommunity';
import { User } from './types/user';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [communitySongCount, setCommunitySongCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  //const [fullSongsByUser, setFullSongsByUser] = useState<Record<number, string[]>>({});
  //const [loadingSongsUserId, setLoadingSongsUserId] = useState<number | null>(null);
  //const [songsErrorByUser, setSongsErrorByUser] = useState<Record<number, string>>({});
  // This holds the "full playlist list" (playlist names) per userId
  const [playlistsByUserId, setPlaylistsByUserId] = useState<Record<number, string[]>>({});
  const [loadingPlaylistsUserId, setLoadingPlaylistsUserId] = useState<number | null>(null);
  const [playlistsErrorByUserId, setPlaylistsErrorByUserId] = useState<Record<number, string>>({});

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      try {
        setLoading(true);
        setError('');

        const [usersRes, communityRes] = await Promise.all([
          fetch('/api/users', { cache: 'no-store' }),
          fetch('/api/communityView', { cache: 'no-store' }),
        ]);

        if (!usersRes.ok) {
          throw new Error('Request failed: ' + usersRes.status);
        }

        const data = await usersRes.json();
        if (!ignore) {
          setUsers(Array.isArray(data) ? data : []);
        }

        if (communityRes.ok) {
          const communityData = await communityRes.json();
          if (!ignore) {
            setCommunitySongCount(Number(communityData.communitySongCount) || 0);
          }
        } else if (!ignore) {
          setCommunitySongCount(0);
        }
      } catch (err) {
        if (!ignore) {
          setError('Could not load home screen.');
          setUsers([]);
          setCommunitySongCount(0);
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

  if (loading) {
    return <div className="min-h-screen grid place-items-center">Loading friends...</div>;
  }

  if (error) {
    return <div className="min-h-screen grid place-items-center">{error}</div>;
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <HomeSection />
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <StatsSection users={users} communitySongCount={communitySongCount} />
        <div className="mt-16">
          <JoinCommunity />
          <UsersGrid
            users={users}
            expandedUserId={expandedUserId}
            loadingPlaylistsUserId={loadingPlaylistsUserId}
            playlistsErrorByUserId={playlistsErrorByUserId}
            playlistsByUserId={playlistsByUserId}
            onToggle={handleTogglePlaylist}
          />
        </div>
      </div>
    </div>
  );
}