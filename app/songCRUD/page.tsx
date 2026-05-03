'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type SongOption = {
    songId: number;
    songName: string;
    artistId: number;
    genreId: number;
    artistName: string;
    duration: string | null;
    releaseYear: number | null;
};

type ArtistOption = {
    artistId: number;
    artistStageName: string;
};

type GenreOption = {
    genreId: number;
    genreName: string;
};

type SongForm = {
    songId: string;
    songName: string;
    artistId: string;
    genreId: string;
    duration: string;
    releaseYear: string;
};

export default function SongCRUDPage() {
    const router = useRouter();
    const [songs, setSongs] = useState<SongOption[]>([]);
    const [artists, setArtists] = useState<ArtistOption[]>([]);
    const [genres, setGenres] = useState<GenreOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ type: '', message: '' });

    const [createForm, setCreateForm] = useState<SongForm>({
        songId: '',
        songName: '',
        artistId: '',
        genreId: '',
        duration: '',
        releaseYear: '',
    });

    const [updateForm, setUpdateForm] = useState<SongForm>({
        songId: '',
        songName: '',
        artistId: '',
        genreId: '',
        duration: '',
        releaseYear: '',
    });

    const [deleteSongId, setDeleteSongId] = useState('');   

    useEffect(() => {
        loadCatalogData();
    }, []);

    async function loadCatalogData(clearStatus = true) {
        try {
            setLoading(true);
            if (clearStatus) {
                setStatus({ type: '', message: '' });
            }

            const [songsRes, artistsRes, genresRes] = await Promise.all([
                fetch('/api/songs/catalog', { cache: 'no-store' }),
                fetch('/api/artists/catalog', { cache: 'no-store' }),
                fetch('/api/genres/catalog', { cache: 'no-store' }),
            ]);

            if (!songsRes.ok || !artistsRes.ok || !genresRes.ok) {
                throw new Error('Failed to load form options.');
            }

            const [songsData, artistsData, genresData] = await Promise.all([
                songsRes.json(),
                artistsRes.json(),
                genresRes.json(),
            ]);

            setSongs(Array.isArray(songsData.songs) ? songsData.songs : []);
            setArtists(Array.isArray(artistsData.artists) ? artistsData.artists : []);

            setGenres(Array.isArray(genresData.genres) ? genresData.genres : []);
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Could not load song options.' });
        } finally {
            setLoading(false);
        }
    }

    async function submitAction(action: 'create' | 'update' | 'delete', songData: Record<string, unknown>) {
        const response = await fetch('/api/songs/song-actions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, songData }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Song action failed.');
        }

        return data;
    }

    async function handleCreate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await submitAction('create', {
                songName: createForm.songName,
                artistId: Number(createForm.artistId),
                genreId: Number(createForm.genreId),
                duration: createForm.duration || null,
                releaseYear: createForm.releaseYear ? Number(createForm.releaseYear) : null,
            });

            setStatus({ type: 'success', message: 'Song created successfully.' });
            setCreateForm({
                songId: '',
                songName: '',
                artistId: '',
                genreId: '',
                duration: '',
                releaseYear: '',
            });
            await loadCatalogData(false);
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Failed to create song.' });
        }
    }

    async function handleUpdate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await submitAction('update', {
                songId: Number(updateForm.songId),
                songName: updateForm.songName,
                artistId: Number(updateForm.artistId),
                genreId: Number(updateForm.genreId),
                duration: updateForm.duration || null,
                releaseYear: updateForm.releaseYear ? Number(updateForm.releaseYear) : null,
            });

            setStatus({ type: 'success', message: 'Song updated successfully.' });
            await loadCatalogData(false);
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Failed to update song.' });
        }
    }

    async function handleDelete(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await submitAction('delete', { songId: Number(deleteSongId) });

            setStatus({ type: 'success', message: 'Song deleted successfully.' });
            setDeleteSongId('');
            setUpdateForm((prev) => (prev.songId === deleteSongId ? { ...prev, songId: '' } : prev));
            await loadCatalogData(false);
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Failed to delete song.' });
        }
    }

    return (
        <div className="relative overflow-hidden bg-background w-full min-h-screen text-foreground">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
            <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-primary opacity-10 blur-3xl" />
            <div className="absolute top-40 -left-32 h-72 w-72 rounded-full bg-secondary opacity-10 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                    <button
                        type="button"
                        className="rounded-full border border-border bg-background/80 px-5 py-2.5 text-md font-semibold text-primary transition-colors hover:border-primary/40"
                        onClick={() => router.push('/fullCatalog')}
                    >
                        Back to Full Catalog
                    </button>

                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight max-w-4xl text-center"> Song CRUD Operations </h1>

                {status.message && (
                    <div className={`card p-4 mb-6 ${status.type === 'error' ? 'text-error' : 'text-center text-green-600'}`}>
                        {status.message}
                    </div>
                )}
                {loading && <div className="card p-4 mb-6 text-muted">Loading form options...</div>}
                
                {/* CREATE operation - adding new artists to the database */}
                <section className="card p-6">
                    <h2 className="text-2xl font-black mb-4">Add New Song to the Catalog</h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCreate}>
                        <input
                            className="rounded-xl border border-light bg-background/70 p-3"
                            placeholder="Song title"
                            value={createForm.songName}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, songName: e.target.value }))}
                            required/>
                        <select
                            className="rounded-xl border border-light bg-background/70 p-3"
                            value={createForm.artistId}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, artistId: e.target.value }))}
                            required
                        >
                            <option value="">Select artist</option>
                            {artists.map((artist) => (
                                <option key={artist.artistId} value={artist.artistId}>
                                    {artist.artistStageName}
                                </option>
                            ))}
                        </select>
                        <select
                            className="rounded-xl border border-light bg-background/70 p-3"
                            value={createForm.genreId}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, genreId: e.target.value }))}
                            required
                        >
                            <option value="">Select genre</option>
                            {genres.map((genre) => (
                                <option key={genre.genreId} value={genre.genreId}>
                                    {genre.genreName}
                                </option>
                            ))}
                        </select>
                        <input
                            className="rounded-xl border border-light bg-background/70 p-3"
                            placeholder="Duration (HH:MM:SS)"
                            value={createForm.duration}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, duration: e.target.value }))}
                        />
                        <input
                            className="rounded-xl border border-light bg-background/70 p-3"
                            placeholder="Release year"
                            type="number"
                            min="1900"
                            max="2100"
                            value={createForm.releaseYear}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, releaseYear: e.target.value }))}
                        />
                        <button
                            type="submit"
                            className="rounded-xl bg-primary text-white font-semibold px-5 py-3 hover:opacity-90 transition-opacity"
                        >
                            Add Song
                        </button>
                    </form>
                </section>  

                {/* UPDATE operation - updating existing artists in the database */}
                <section className="card p-6 mt-6">
                    <h2 className="text-2xl font-black mb-4">Update Existing Song Details</h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleUpdate}>
                        <select
                            className="rounded-xl border border-light bg-background/70 p-3 md:col-span-2"
                            value={updateForm.songId}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const selectedSong = songs.find((song) => String(song.songId) === selectedId);
                                if (!selectedSong) {
                                    setUpdateForm({
                                        songId: '',
                                        songName: '',
                                        artistId: '',
                                        genreId: '',
                                        duration: '',
                                        releaseYear: '',
                                    });
                                    return;
                                }

                                setUpdateForm({
                                    songId: selectedId,
                                    songName: selectedSong.songName,
                                    artistId: String(selectedSong.artistId),
                                    genreId: String(selectedSong.genreId),
                                    duration: selectedSong.duration || '',
                                    releaseYear: selectedSong.releaseYear ? String(selectedSong.releaseYear) : '',
                                });
                            }}
                            required
                        >
                            <option value="">Select song</option>
                            {songs.map((song) => (
                                <option key={song.songId} value={song.songId}>
                                    {song.songName} - {song.artistName}
                                </option>
                            ))}
                        </select>
                        <input
                            className="rounded-xl border border-light bg-background/70 p-3"
                            placeholder="Song title"
                            value={updateForm.songName}
                            onChange={(e) => setUpdateForm((prev) => ({ ...prev, songName: e.target.value }))}
                            required
                        />
                        <select
                            className="rounded-xl border border-light bg-background/70 p-3"
                            value={updateForm.artistId}
                            onChange={(e) => setUpdateForm((prev) => ({ ...prev, artistId: e.target.value }))}
                            required
                        >
                            <option value="">Select artist</option>
                            {artists.map((artist) => (
                                <option key={artist.artistId} value={artist.artistId}>
                                    {artist.artistStageName}
                                </option>
                            ))}
                        </select>
                        <select
                            className="rounded-xl border border-light bg-background/70 p-3"
                            value={updateForm.genreId}
                            onChange={(e) => setUpdateForm((prev) => ({ ...prev, genreId: e.target.value }))}
                            required
                        >
                            <option value="">Select genre</option>
                            {genres.map((genre) => (
                                <option key={genre.genreId} value={genre.genreId}>
                                    {genre.genreName}
                                </option>
                            ))}
                        </select>
                        <input
                            className="rounded-xl border border-light bg-background/70 p-3"
                            placeholder="Duration (HH:MM:SS)"
                            value={updateForm.duration}
                            onChange={(e) => setUpdateForm((prev) => ({ ...prev, duration: e.target.value }))}
                        />
                        <input
                            className="rounded-xl border border-light bg-background/70 p-3"
                            placeholder="Release year"
                            type="number"
                            min="1900"
                            max="2100"
                            value={updateForm.releaseYear}
                            onChange={(e) => setUpdateForm((prev) => ({ ...prev, releaseYear: e.target.value }))}
                        />
                        <button
                            type="submit"
                            className="rounded-xl bg-primary text-white font-semibold px-5 py-3 hover:opacity-90 transition-opacity"
                        >
                            Save Changes
                        </button>
                    </form>
                </section>
                
                {/* DELETE operation - deleting artists from the database */}
                <section className="card p-6 mt-6">
                    <h2 className="text-2xl font-black mb-4">Delete Song from Catalog</h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleDelete}>
                        <select
                            className="rounded-xl border border-light bg-background/70 p-3"
                            value={deleteSongId}
                            onChange={(e) => setDeleteSongId(e.target.value)}
                            required
                        >
                            <option value="">Select song to delete</option>
                            {songs.map((song) => (
                                <option key={song.songId} value={song.songId}>
                                    {song.songName} - {song.artistName}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="rounded-xl bg-primary text-white font-semibold px-5 py-3 hover:bg-primary/90 transition-colors"
                        >
                            Delete Song
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}