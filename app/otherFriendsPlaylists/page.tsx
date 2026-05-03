'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type CurrentUser = {
  id: number;
};

type FriendPlaylist = {
  playlistId: number;
  playlistName: string;
};

type FriendUser = {
  id: number;
  name: string;
  playlistsCount: number;
  allPlaylistsDetailed?: FriendPlaylist[];
  topPlaylistsDetailed?: FriendPlaylist[];
};

type PlaylistSong = {
  songId: number;
  title: string;
  artist: string;
  genre: string;
  releaseYear: number | null;
  duration: string | null;
};

export default function FriendsPlaylistPage() {
  const router = useRouter();
  const [users, setUsers] = useState<FriendUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlaylistByUserId, setSelectedPlaylistByUserId] = useState<Record<number, number | null>>({});
  const [songsByPlaylistId, setSongsByPlaylistId] = useState<Record<number, PlaylistSong[]>>({});
  const [loadingPlaylistId, setLoadingPlaylistId] = useState<number | null>(null);
  const [songsErrorByPlaylistId, setSongsErrorByPlaylistId] = useState<Record<number, string>>({});

  useEffect(() => {
    let ignore = false;

    async function loadFriends() {
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
          usersRes.json() as Promise<FriendUser[]>,
          meRes.json() as Promise<{ user: CurrentUser }>,
        ]);

        const meUserId = Number(meData?.user?.id);
        const allUsers = Array.isArray(usersData) ? usersData : [];

        if (!ignore) {
          setCurrentUserId(Number.isFinite(meUserId) ? meUserId : null);
          setUsers(allUsers.filter((user) => Number(user.id) !== meUserId));
        }
      } catch {
        if (!ignore) {
          setUsers([]);
          setError("Could not load friends' playlists.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadFriends();

    return () => {
      ignore = true;
    };
  }, [router]);

  async function handlePlaylistClick(userId: number, playlistId: number) {
    setSelectedPlaylistByUserId((prev) => ({ ...prev, [userId]: playlistId }));

    if (songsByPlaylistId[playlistId]) {
      return;
    }

    try {
      setLoadingPlaylistId(playlistId);
      setSongsErrorByPlaylistId((prev) => ({ ...prev, [playlistId]: '' }));

      const res = await fetch('/api/playlists/friend-details?playlistId=' + playlistId, {
        cache: 'no-store',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Request failed');
      }

      const data = await res.json();
      const songs = Array.isArray(data.songs) ? data.songs : [];

      setSongsByPlaylistId((prev) => ({
        ...prev,
        [playlistId]: songs,
      }));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Could not load songs for this playlist.';
      setSongsErrorByPlaylistId((prev) => ({
        ...prev,
        [playlistId]: errorMessage,
      }));
    } finally {
      setLoadingPlaylistId(null);
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
              Friends&apos; Playlist
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted">
              Browse playlists from your friends.
            </p>
          </div>
        </div>

        {loading ? (
          <section className="card p-10 text-center text-muted">Loading friends&apos; playlists...</section>
        ) : error ? (
          <section className="card p-10 text-center text-error">{error}</section>
        ) : users.length === 0 ? (
          <section className="card p-10 text-center text-muted">
            {currentUserId ? 'No other users have playlists yet.' : 'No other users were found.'}
          </section>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {users.map((user) => {
              const allPlaylists = Array.isArray(user.allPlaylistsDetailed)
                ? user.allPlaylistsDetailed
                : Array.isArray(user.topPlaylistsDetailed)
                  ? user.topPlaylistsDetailed
                  : [];
              const selectedPlaylistId = selectedPlaylistByUserId[user.id] || null;
              const selectedSongs = selectedPlaylistId ? songsByPlaylistId[selectedPlaylistId] || [] : [];
              const selectedSongsError = selectedPlaylistId ? songsErrorByPlaylistId[selectedPlaylistId] || '' : '';
              const isLoadingSongs = selectedPlaylistId !== null && loadingPlaylistId === selectedPlaylistId;

              return (
                <article key={user.id} className="card p-7">
                  <h3 className="text-4xl font-black mb-6 tracking-tight">{user.name}</h3>

                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-primary">♪</span>
                    <p className="font-bold text-foreground text-xl">Current Playlists</p>
                  </div>

                  <div className="space-y-3">
                    {allPlaylists.length > 0 ? (
                      allPlaylists.map((playlist, idx) => {
                        const isSelected = selectedPlaylistId === playlist.playlistId;

                        return (
                          <button
                            key={playlist.playlistId}
                            type="button"
                            onClick={() => handlePlaylistClick(user.id, playlist.playlistId)}
                            aria-pressed={isSelected}
                            className={[
                              'w-full flex items-center gap-4 p-4 rounded-xl border text-left',
                              'transition-colors duration-200',
                              'border-light bg-background',
                              'hover:bg-green-500 hover:border-red-950',
                              isSelected ? 'border-rose-950 bg-red-950 shadow-sm' : '',
                            ].join(' ')}
                          >
                            <div className="w-10 h-10 rounded-xl border border-border bg-surface-elevated text-primary font-bold flex items-center justify-center">
                              {idx + 1}
                            </div>
                            <div className="flex-1 flex items-center justify-between gap-3">
                              <span className="font-semibold text-sm text-foreground">{playlist.playlistName}</span>
                              {isSelected && <span className="text-xs font-bold text-rose-700">Selected</span>}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted">No playlists available.</p>
                    )}
                  </div>

                  {selectedPlaylistId && (
                    <div className="mt-6 border-t border-light pt-5">
                      <h4 className="font-bold text-foreground mb-3">Songs (view only)</h4>
                      {isLoadingSongs ? (
                        <p className="text-sm text-muted">Loading songs...</p>
                      ) : selectedSongsError ? (
                        <p className="text-sm text-error">{selectedSongsError}</p>
                      ) : selectedSongs.length > 0 ? (
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {selectedSongs.map((song, songIndex) => (
                            <div
                              key={`${selectedPlaylistId}-${song.songId}-${songIndex}`}
                              className="rounded-lg border border-light bg-background px-3 py-2 text-sm"
                            >
                              <p className="font-semibold text-foreground">{song.title}</p>
                              <p className="text-muted text-xs">
                                {song.artist} • {song.genre}
                                {song.duration ? ` • ${song.duration}` : ''}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted">This playlist has no songs yet.</p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}

      </div>
    </div>
  );
}
