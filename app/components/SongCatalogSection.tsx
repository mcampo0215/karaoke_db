'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Song = {
    songId: number;
    songName: string;
    artistName: string;
    genre: string | null;
    duration: string | null;
    releaseYear: number | null;
};

type SongCatalogSectionProps = {
    showHeader?: boolean;
    compact?: boolean;
};

export default function SongCatalogSection({ showHeader = true, compact = false }: SongCatalogSectionProps) {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [karaokeMessage, setKaraokeMessage] = useState('');
    const [karaokeMessageType, setKaraokeMessageType] = useState<'success' | 'info'>('success');
    const [karaokeError, setKaraokeError] = useState('');
    const [karaokeLoadingSongId, setKaraokeLoadingSongId] = useState<number | null>(null);
    const router = useRouter();

    async function handleAddToKaraoke(songId: number, songName: string) {
        try {
            setKaraokeMessage('');
            setKaraokeError('');
            setKaraokeLoadingSongId(songId);

            const res = await fetch('/api/sp-and-trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ songId }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.status === 409) {
                if (data?.source !== 'trigger') {
                    throw new Error('Duplicate response did not come from trigger behavior. Please verify DB setup.');
                }
                setKaraokeMessageType('info');
                setKaraokeMessage(data?.error || 'This user already added this song to karaoke interest');
                return;
            }

            if (!res.ok) {
                throw new Error(data?.error || 'Failed to add song to karaoke interest');
            }

            setKaraokeMessageType('success');
            setKaraokeMessage(`added "${songName}" to Community Playlist`);
        } catch (err: any) {
            setKaraokeError(err?.message || 'Could not add this song to karaoke interest.');
        } finally {
            setKaraokeLoadingSongId(null);
        }
    }
    

    useEffect(() => {
        let ignore = false;

        async function loadSongs() {
            try {
                setLoading(true);
                setError('');

                const res = await fetch('/api/songs/catalog', { cache: 'no-store' });

                if (!res.ok) {
                    throw new Error('Failed to load song catalog');
                }

                const data = await res.json();

                if (!ignore) {
                    setSongs(Array.isArray(data.songs) ? data.songs : []);
                }
            } catch (err: any) {
                if (!ignore) {
                    setSongs([]);
                    setError(err.message || 'Could not load the song catalog.');
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadSongs();

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <div className={compact ? 'w-full' : 'relative overflow-hidden bg-background w-full min-h-screen text-foreground'}>
            {!compact && (
                <>
                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`,
                            backgroundSize: '24px 24px',
                        }}
                    />
                    <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-primary opacity-10 blur-3xl" />
                    <div className="absolute top-40 -left-32 h-72 w-72 rounded-full bg-secondary opacity-10 blur-3xl" />
                </>
            )}

            <div className={compact ? 'w-full' : 'relative max-w-7xl mx-auto px-4 py-16 md:py-20'}>
                {showHeader && !compact && (
                    <div className="mb-10 max-w-3xl">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-5 leading-tight max-w-4xl">
                            Songs Catalog
                        </h1>
                        <p className="text-lg text-muted max-w-2xl">
                            This page reads directly from the songs table in the database.
                        </p>
                    </div>
                )}

                {loading ? (
                    <div className="card p-10 text-center text-muted">Loading song catalog...</div>
                ) : error ? (
                    <div className="card p-10 text-center text-error">{error}</div>
                ) : songs.length === 0 ? (
                    <div className="card p-10 text-center text-muted">No songs matched your search.</div>
                ) : (
                    <>
                        {karaokeError ? (
                            <div className="mb-4 card p-4 text-center text-error">{karaokeError}</div>
                        ) : null}

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {songs.map((song, index) => (
                            <article key={song.songId} className="card p-6 flex flex-col gap-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="inline-flex items-center gap-2 rounded-full border border-light bg-background px-3 py-2 text-sm font-bold mb-3">{index + 1}</div>
                                        <h3 className="text-2xl font-black leading-tight mb-2">{song.songName}</h3>
                                        <p className="text-muted text-base">{song.artistName}</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <button
                                            type="button"
                                            className="h-14 w-14 rounded-2xl bg-primary/10 text-teal-500 grid place-items-center font-black text-xs border border-primary/20 transition-colors hover:bg-emerald-200 hover:text-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                            onClick={() => handleAddToKaraoke(song.songId, song.songName)}
                                            disabled={karaokeLoadingSongId === song.songId}
                                        >
                                            {karaokeLoadingSongId === song.songId ? 'Adding' : 'Karaoke'}
                                        </button>
                                        <button
                                            type="button"
                                            className="h-14 w-14 rounded-2xl bg-primary/10 text-pink-300 grid place-items-center font-black text-xs border border-primary/20 transition-colors hover:bg-pink-200 hover:text-pink-700"
                                            onClick={() => router.push('/songCRUD')}>
                                            Actions
                                        </button>
                                    </div>
                                </div>
                        
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div className="rounded-2xl border border-light bg-background/70 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-subtle mb-1">Genre</p>
                                        <p className="font-semibold text-foreground">{song.genre || 'Unknown genre'}</p>
                                    </div>
                                    <div className="rounded-2xl border border-light bg-background/70 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-subtle mb-1">Duration</p>
                                        <p className="font-semibold text-foreground">{song.duration || 'Not listed'}</p>
                                    </div>
                                    <div className="rounded-2xl border border-light bg-background/70 p-4 sm:col-span-2">
                                        <p className="text-xs uppercase tracking-[0.2em] text-subtle mb-1">Release year</p>
                                        <p className="font-semibold text-foreground">{song.releaseYear || 'Not listed'}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                        </div>
                    </>
                )}
            </div>

            {karaokeMessage ? (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
                    <div className="card w-full max-w-md p-6 text-center">
                        <p className={`text-lg font-bold mb-5 ${karaokeMessageType === 'success' ? 'text-teal-600' : 'text-amber-600'}`}>
                            {karaokeMessage}
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <button
                                type="button"
                                className="rounded-xl border border-light px-4 py-2 font-semibold transition-colors hover:bg-muted"
                                onClick={() => {
                                    setKaraokeMessage('');
                                    setKaraokeMessageType('success');
                                }}>
                                Close
                            </button>
                            <button
                                type="button"
                                className="rounded-xl bg-primary px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90"
                                onClick={() => {
                                    setKaraokeMessage('');
                                    setKaraokeMessageType('success');
                                    router.push('/communityPlaylist');
                                }}>
                                Go to Community Playlist
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}