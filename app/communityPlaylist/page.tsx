'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type CommunitySong = {
  songTitle: string;
  artistStageName: string;
  likeCount: number;
};

export default function CommunityPlaylist() {
  const router = useRouter();
  const [songs, setSongs] = useState<CommunitySong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadCommunitySongs() {
      try {
        setLoading(true);
        setError('');

        const res = await fetch('/api/communityView', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Request failed: ' + res.status);
        }

        const data = await res.json();
        if (!ignore) {
          setSongs(Array.isArray(data.songs) ? data.songs : []);
        }
      } catch (err) {
        if (!ignore) {
          setSongs([]);
          setError('Could not load the community playlist view.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCommunitySongs();

    return () => {
      ignore = true;
    };
  }, []);

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
              onClick={() => router.push('/menu')}>
              Back to menu
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight max-w-4xl mx-auto leading-tight">
              Community Playlist
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted">
              This page is a View and shows the most liked songs by the community in next karaoke session.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="card p-10 text-center text-muted">Loading community songs...</div>
        ) : error ? (
          <div className="card p-10 text-center text-error">{error}</div>
        ) : songs.length === 0 ? (
          <div className="card p-10 text-center text-muted">No community songs were found in the view.</div>
        ) : (
          <div className="grid gap-4">
            {songs.map((song, index) => (
              <div
                key={`${song.songTitle}-${song.artistStageName}`}
                className="card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-pink-100 text-foreground grid place-items-center font-black shadow-lg">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{song.songTitle}</h3>
                    <p className="text-muted">{song.artistStageName}</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-taupe-100 px-4 py-2 text-sm font-semibold text-foreground">
                  <span className="h-2 w-2 rounded-full bg-pink-500" />
                  {song.likeCount} people interested
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}