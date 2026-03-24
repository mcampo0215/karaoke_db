'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Playlist = {
  playlistId: number;
  playlistName: string;
  moodTag: string | null;
  createdAt: string;
  songCount: number;
};

type SongItem = {
  songId: number;
  title: string;
  artist: string;
};

type TopSong = SongItem & {
  appearances: number;
};

type DashboardData = {
  user: {
    id: number;
    username: string;
    name: string;
  };
  playlists: Playlist[];
  topSongs: TopSong[];
  recentlyViewedSongs: SongItem[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SongItem[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const [addingSongId, setAddingSongId] = useState<number | null>(null);
  const [addStatus, setAddStatus] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');

        const res = await fetch('/api/dashboard', { cache: 'no-store' });

        if (res.status === 401) {
          router.push('/login');
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to load dashboard');
        }

        const data = await res.json();

        if (!ignore) {
          setDashboard(data);
          if (data.playlists.length > 0) {
            setSelectedPlaylistId(data.playlists[0].playlistId);
          }
        }
      } catch (err) {
        if (!ignore) {
          setError('Could not load your dashboard.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [router]);

  useEffect(() => {
    let ignore = false;

    async function searchSongs() {
      if (query.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setSearching(true);
        const res = await fetch('/api/songs/search?q=' + encodeURIComponent(query.trim()), {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Search failed');
        }

        const data = await res.json();

        if (!ignore) {
          setSearchResults(Array.isArray(data.songs) ? data.songs : []);
        }
      } catch (err) {
        if (!ignore) {
          setSearchResults([]);
        }
      } finally {
        if (!ignore) {
          setSearching(false);
        }
      }
    }

    const timeoutId = setTimeout(searchSongs, 250);

    return () => {
      ignore = true;
      clearTimeout(timeoutId);
    };
  }, [query]);

  const selectedPlaylistName = useMemo(() => {
    if (!dashboard || !selectedPlaylistId) {
      return '';
    }

    const found = dashboard.playlists.find((p) => p.playlistId === selectedPlaylistId);
    return found ? found.playlistName : '';
  }, [dashboard, selectedPlaylistId]);

  async function handleAddSong(songId: number) {
    if (!selectedPlaylistId) {
      setAddStatus('Select a playlist first.');
      return;
    }

    try {
      setAddStatus('');
      setAddingSongId(songId);

      const res = await fetch('/api/playlists/add-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlistId: selectedPlaylistId, songId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Could not add song');
      }

      setAddStatus(data.message || 'Song added.');

      const refreshRes = await fetch('/api/dashboard', { cache: 'no-store' });
      if (refreshRes.ok) {
        const refreshed = await refreshRes.json();
        setDashboard(refreshed);
      }
    } catch (err: any) {
      setAddStatus(err.message || 'Could not add song.');
    } finally {
      setAddingSongId(null);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  if (loading) {
    return <div className="min-h-screen grid place-items-center">Loading dashboard...</div>;
  }

  if (error || !dashboard) {
    return <div className="min-h-screen grid place-items-center">{error || 'Dashboard unavailable.'}</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-4xl font-black">Welcome back, {dashboard.user.name}</h1>
            <p className="text-muted">Manage playlists and discover songs to add.</p>
          </div>
          <button className="btn btn-outline" onClick={handleLogout}>
            Log out
          </button>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-6">
            <p className="text-sm text-muted mb-1">Playlists</p>
            <p className="text-3xl font-black">{dashboard.playlists.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-muted mb-1">Top Songs Tracked</p>
            <p className="text-3xl font-black">{dashboard.topSongs.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-muted mb-1">Recently Added Songs</p>
            <p className="text-3xl font-black">{dashboard.recentlyViewedSongs.length}</p>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-2xl font-black mb-4">Your Playlists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dashboard.playlists.map((playlist) => (
              <div key={playlist.playlistId} className="rounded-xl border border-light p-4">
                <p className="font-bold text-lg">{playlist.playlistName}</p>
                <p className="text-sm text-muted">
                  Mood: {playlist.moodTag || 'none'} · Songs: {playlist.songCount}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-6">
            <h2 className="text-2xl font-black mb-4">Top Songs</h2>
            <div className="space-y-2">
              {dashboard.topSongs.length === 0 && <p className="text-muted">No songs yet.</p>}
              {dashboard.topSongs.map((song, index) => (
                <div key={song.songId} className="rounded-lg border border-light p-3 flex items-center justify-between">
                  <p>
                    {index + 1}. {song.title} <span className="text-muted">- {song.artist}</span>
                  </p>
                  <span className="text-xs text-muted">{song.appearances}x</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-black mb-4">Recently Viewed Songs</h2>
            <div className="space-y-2">
              {dashboard.recentlyViewedSongs.length === 0 && <p className="text-muted">No recent songs yet.</p>}
              {dashboard.recentlyViewedSongs.map((song) => (
                <div key={song.songId} className="rounded-lg border border-light p-3">
                  {song.title} <span className="text-muted">- {song.artist}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-2xl font-black mb-4">Add Songs To A Playlist</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <input
              type="text"
              placeholder="Search songs by title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring focus:border-primary bg-background text-foreground"
            />

            <select
              value={selectedPlaylistId || ''}
              onChange={(e) => setSelectedPlaylistId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring focus:border-primary bg-background text-foreground"
            >
              {dashboard.playlists.map((playlist) => (
                <option key={playlist.playlistId} value={playlist.playlistId}>
                  {playlist.playlistName}
                </option>
              ))}
            </select>
          </div>

          {selectedPlaylistName && (
            <p className="text-sm text-muted mb-3">Adding to: {selectedPlaylistName}</p>
          )}

          {addStatus && <p className="text-sm mb-3">{addStatus}</p>}

          <div className="space-y-2">
            {searching && <p className="text-muted">Searching...</p>}
            {!searching && query.trim().length >= 2 && searchResults.length === 0 && (
              <p className="text-muted">No matching songs found.</p>
            )}

            {searchResults.map((song) => (
              <div key={song.songId} className="rounded-lg border border-light p-3 flex items-center justify-between gap-3">
                <p>
                  {song.title} <span className="text-muted">- {song.artist}</span>
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleAddSong(song.songId)}
                  disabled={addingSongId === song.songId}
                >
                  {addingSongId === song.songId ? 'Adding...' : 'Add'}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
