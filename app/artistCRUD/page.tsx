'use client';

import {SubmitEvent, useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function normalizeBirthdate(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    if (!DATE_ONLY_REGEX.test(trimmed)) {
        throw new Error('Birthdate must be in YYYY-MM-DD format.');
    }

    const parsed = new Date(`${trimmed}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== trimmed) {
        throw new Error('Birthdate must be a valid calendar date.');
    }

    return trimmed;
}

function toDateInputValue(value: string | null): string {
    if (!value) {
        return '';
    }

    const dateOnly = value.split('T')[0];
    return DATE_ONLY_REGEX.test(dateOnly) ? dateOnly : '';
}

function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return fallback;
}

type Artist = {
    artistId: number;
    artistStageName: string;
    birthdate: string | null;
    countryOrigin: string | null;
};

type ArtistForm = {
    artistId: string;
    artistStageName: string;
    birthdate: string;
    countryOrigin: string;
}

export default function ArtistCRUDPage() {
    const router = useRouter();
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ type: '', message: '' });

    // Form state for creating a new artist
    const [createForm, setCreateForm] = useState<ArtistForm>({
        artistId: '',
        artistStageName: '',
        birthdate: '', 
        countryOrigin: '',
    });

    //Form state for updating existing artist
    const [updateForm, setUpdateForm] = useState<ArtistForm>({
        artistId: '',
        artistStageName: '',
        birthdate: '', 
        countryOrigin: '',
    });

    //state for deleting artist
    const [deleteArtistId, setDeleteArtistId] = useState('');

    useEffect(() => {
        loadCatalogData();
    }, []);

    async function loadCatalogData(clearStatus = true) {
        try {
            setLoading(true);
            if (clearStatus) {
                setStatus({ type: '', message: '' });
            }

            const [artistsRes] = await Promise.all([
                fetch('/api/artists/catalog', { cache: 'no-store' }),
            ]);

            if (!artistsRes.ok) {
                throw new Error('Failed to load form options.');
            }

            const [artistsData] = await Promise.all([
                artistsRes.json(),
            ]);

            setArtists(Array.isArray(artistsData.artists) ? artistsData.artists : []);
        }catch (error: unknown) {
            setStatus({ type: 'error', message: getErrorMessage(error, 'Could not load artist options.') });
        } finally {
            setLoading(false);
        }
    }

    // submission action
    async function submitAction(action: 'create' | 'update' | 'delete', artistData: Record<string, unknown>) {
        const response = await fetch('/api/artists/artist-actions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, artistData }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Artist action failed.');
        }

        return data;
    }

    //function for CREATE operation in artist table 
    async function handleCreate(e: SubmitEvent<HTMLFormElement>){
        e.preventDefault();

        try {
            await submitAction('create', {
                artist_stage_name: createForm.artistStageName.trim(),
                birthdate: normalizeBirthdate(createForm.birthdate), 
                country_of_origin: createForm.countryOrigin.trim() || null,
            });

            setStatus({ type: 'success', message: 'Artist created successfully.' });
            setCreateForm({
                artistId: '',
                artistStageName: '',
                birthdate: '', 
                countryOrigin: '',
            });
            await loadCatalogData(false);
        } catch (error: unknown) {
            setStatus({ type: 'error', message: getErrorMessage(error, 'Failed to create artist.') });
        }
    }

    //function for UPDATE operation in artist table 
    async function handleUpdate(e: SubmitEvent<HTMLFormElement>){
        e.preventDefault();

        try {
            await submitAction('update' , {
                artist_id: Number(updateForm.artistId), 
                artist_stage_name: updateForm.artistStageName.trim(),
                birthdate: normalizeBirthdate(updateForm.birthdate),
                country_of_origin: updateForm.countryOrigin.trim() || null,
            });
            setStatus({ type: 'success', message: 'Artist updated successfully.' });
            await loadCatalogData(false);

        } catch (error: unknown) {
            setStatus({ type: 'error', message: getErrorMessage(error, 'Failed to update artist.') });
        }
    }

    //function for DELETE  operation in artist table 
    async function handleDelete(e: SubmitEvent<HTMLFormElement>) {
            e.preventDefault();
    
            try {
                await submitAction('delete', { artist_id: Number(deleteArtistId) });
    
                setStatus({ type: 'success', message: 'Artist deleted successfully.' });
                setDeleteArtistId('');
                setUpdateForm((prev) => (prev.artistId === deleteArtistId ? {
                    artistId: '',
                    artistStageName: '',
                    birthdate: '',
                    countryOrigin: '',
                } : prev));
                await loadCatalogData(false);
            } catch (error: unknown) {
                setStatus({ type: 'error', message: getErrorMessage(error, 'Failed to delete artist.') });
            }
        }
    
    //front end 
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
                        onClick={() => router.push('/fullCatalog')}>
                        Back to Full Catalog
                    </button>

                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight max-w-4xl text-center"> Artist  CRUD Operations </h1>
                {status.message && (
                    <div className={`card p-4 mb-6 ${status.type === 'error' ? 'text-error' : 'text-center text-green-600'}`}>
                        {status.message}
                    </div>
                )}
                {loading && <div className="card p-4 mb-6 text-muted">Loading form options...</div>}
                
                {/* CREATE operation - adding new to the database */}
                <section className="card p-6">
                    <h2 className="text-2xl font-black mb-4">Add New Artist to the Catalog</h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCreate}>
                        {/* input for artist stage name */}
                        <input
                            className="rounded-xl border border-light bg-background/70 p-3"
                            placeholder = "Artist Stage Name"
                            value={createForm.artistStageName}
                            onChange={(e) => setCreateForm((prev)=> ({...prev, artistStageName: e.target.value}))}
                            required/>

                        {/* input for birthdate */}
                        <input
                            className="rounded-xl border border-light bg-background/70 p-3"
                            type="text"
                            placeholder = "Birthdate (YYYY-MM-DD) - optional"
                            value={createForm.birthdate}
                            onChange={(e) => setCreateForm((prev)=> ({...prev, birthdate: e.target.value}))}/>

                        {/* input for country of origin */}
                        <input
                            className="rounded-xl border border-light bg-background/70 p-3"
                            placeholder = "Country of Origin"
                            value={createForm.countryOrigin}
                            onChange={(e) => setCreateForm((prev)=> ({...prev, countryOrigin: e.target.value}))}/>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-primary text-white font-semibold px-5 py-3 hover:opacity-90 transition-opacity">
                            Add Artist
                        </button>
                    </form>
                </section>  

                {/* UPDATE operation - updating existing songs in the database */}
                <section className="card p-6 mt-6">
                    <h2 className="text-2xl font-black mb-4">Update Existing Artist Details</h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleUpdate}>
                         {/* selecting the song to update */}
                        <select
                            className="rounded-xl border border-light bg-background/70 p-3 md:col-span-2"
                            value={updateForm.artistId}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const selectedArtist = artists.find((artist)=> String(artist.artistId)=== selectedId);
                                if (!selectedArtist) {
                                    setUpdateForm({
                                        artistId: '',
                                        artistStageName: '',
                                        birthdate: '', 
                                        countryOrigin: '',
                                    });
                                    return;
                                }

                                setUpdateForm({
                                    artistId: selectedId,
                                    artistStageName: selectedArtist.artistStageName,
                                    birthdate: toDateInputValue(selectedArtist.birthdate),
                                    countryOrigin: String(selectedArtist.countryOrigin)
                                });
                            }}
                            required
                        >
                            <option value="">Select Artist</option>
                            {artists.map((artist) => (
                                <option key={artist.artistId} value={artist.artistId}>
                                    {artist.artistStageName}
                                </option>
                            ))}
                        </select>
                        
                        {/* input new information about artist selected */}
                        <input 
                            className="rounded-xl border border-light bg-background/70 p-3"
                            placeholder="Artist Stage Name"
                            value={updateForm.artistStageName}
                            onChange={(e) => setUpdateForm((prev) => ({ ...prev, artistStageName: e.target.value }))}
                            required
                        />
                        
                        <input 
                            className="rounded-xl border border-light bg-background/70 p-3"
                            type="date"
                            placeholder="Birthdate"
                            value={updateForm.birthdate}
                            onChange={(e) => setUpdateForm((prev) => ({ ...prev, birthdate: e.target.value }))}
                        />  
                        
                        <input 
                            className="rounded-xl border border-light bg-background/70 p-3"
                            placeholder="Country of Origin"
                            value={updateForm.countryOrigin}
                            onChange={(e) => setUpdateForm((prev) => ({ ...prev, countryOrigin: e.target.value }))}
                        />  
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-primary text-white font-semibold px-5 py-3 hover:opacity-90 transition-opacity">
                            Save Changes
                        </button>
                    </form>
                </section>
                
                {/* DELETE operation - deleting songs from the database */}
                <section className="card p-6 mt-6">
                    <h2 className="text-2xl font-black mb-4">Delete Artist from Catalog</h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleDelete}>
                        <select
                            className="rounded-xl border border-light bg-background/70 p-3"
                            value={deleteArtistId}
                            onChange={(e) => setDeleteArtistId(e.target.value)}
                            required
                        >
                            <option value="">Select artist to delete</option>
                            {artists.map((artist) => (
                                <option key={artist.artistId} value={artist.artistId}>
                                    {artist.artistStageName}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-primary text-white font-semibold px-5 py-3 hover:bg-primary/90 transition-colors">
                            Delete Artist
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}