'use client';

import {SubmitEvent, useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';

type GenreOption = {
    genreId: number; 
    genreName: string; 
    genreDescription: string; 
};

type GenreForm = {
    genreId: string; 
    genreName: string; 
    genreDescription: string; 
};

export default function GenreCRUDPage(){
    const router = useRouter();
    const [genres, setGenres] = useState<GenreOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ type: '', message: '' });

    // CREATE operation
    const [createForm, setCreateForm] = useState<GenreForm>({
        genreId: '', 
        genreName: '',
        genreDescription: '',
    });

    //UPDATE operation
    const [updateForm, setUpdateForm] = useState<GenreForm>({
        genreId: '', 
        genreName: '',
        genreDescription: '',
    });

    //DELETE operation
    const [deleteGenreId, setDeleteGenreId] = useState('');

    useEffect(() => {
        loadCatalogData();
    }, []);


    //function for loading genre data
    async function loadCatalogData(clearStatus = true){
        try {
            setLoading(true);
            if (clearStatus) {
                setStatus({ type: '', message: '' });
            }

            const [genresRes] = await Promise.all([
                fetch('/api/genres/catalog', { cache: 'no-store' }),
            ]);

            if (!genresRes.ok) {
                throw new Error('Failed to load form options.');
            }

            const [genresData] = await Promise.all([
                genresRes.json(),
            ]);

            setGenres(Array.isArray(genresData.genres) ? genresData.genres : []);
        }  catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Could not load song options.' });
        } finally {
            setLoading(false);
        }
    }

    //function for submiting action 
    async function submitAction(action: 'create' | 'update' | 'delete', genreData: Record<string, unknown>){
        const response = await fetch('/api/genres/genre-actions',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, genreData }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Genre action failed.');
        }

        return data;
    }

    //CREATE function
    async function handleCreate(e: SubmitEvent<HTMLFormElement>){
        e.preventDefault();

        try {
            await submitAction('create', {
                genre_name: createForm.genreName,
                genre_description: createForm.genreDescription
            });

            setStatus({type: 'success', message: 'Genre created successfully'});
            setCreateForm({
                genreId: '', 
                genreName: '',
                genreDescription: '',
            });
            await loadCatalogData(false);
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Failed to create genre.' });
        }
    }

    //UPDATE function
    async function handleUpdate(e: SubmitEvent<HTMLFormElement>){
        e.preventDefault();

        try {
            await submitAction('update', {
                genre_id: Number(updateForm.genreId),
                genre_name: updateForm.genreName,
                genre_description: updateForm.genreDescription,
            });

            setStatus({ type: 'success', message: 'Genre updated successfully.' });
            await loadCatalogData(false);

        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Failed to update genre.' });
        }
    }

    //DELETE function
    async function handleDelete(e: SubmitEvent<HTMLFormElement>){
        e.preventDefault();

        try {
            await submitAction('delete', { genre_id: Number(deleteGenreId) });

            setStatus({ type: 'success', message: 'Genre deleted successfully.' });
            setDeleteGenreId('');
            setUpdateForm((prev) => (prev.genreId === deleteGenreId ? { ...prev, genreId: '' } : prev));
            await loadCatalogData(false);
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Failed to delete genre.' });
        }
    }

    //frontend 
    return(
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
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight max-w-4xl text-center"> Genre CRUD Operations </h1>

                {status.message && (
                    <div className={`card p-4 mb-6 ${status.type === 'error' ? 'text-error' : 'text-center text-green-600'}`}>
                        {status.message}
                    </div>
                )}
                {loading && <div className="card p-4 mb-6 text-muted">Loading form options...</div>}

                {/* CREATE operation - adding new artists to the database */}
                <section className="card p-6">
                    <h2 className="text-2xl font-black mb-4">Add New Genre to the Catalog</h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCreate}>
                        <input 
                            className="rounded-xl border border-light bg-background/70 p-3"
                            placeholder="Genre Name"
                            value={createForm.genreName}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, genreName: e.target.value }))}
                            required/>
                        
                        <input 
                            className="rounded-xl border border-light bg-background/70 p-3"
                            placeholder="Genre Description"
                            value={createForm.genreDescription}
                            onChange={(e) => setCreateForm((prev) => ({ ...prev, genreDescription: e.target.value }))}
                            required/>
                        <button
                            type="submit"
                            className="rounded-xl bg-primary text-white font-semibold px-5 py-3 hover:opacity-90 transition-opacity">
                            Add Genre
                        </button>
                    </form>
                </section>  

                {/* UPDATE operation - updating existing artists in the database */}
                <section className="card p-6 mt-6">
                    <h2 className="text-2xl font-black mb-4">Update Existing Genre Details</h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleUpdate}>
                        <select
                            className="rounded-xl border border-light bg-background/70 p-3 md:col-span-2"
                            value={updateForm.genreId}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const selectedGenre = genres.find((genre) => String(genre.genreId) === selectedId);
                                if (!selectedGenre){
                                    setUpdateForm({
                                        genreId: '', 
                                        genreName: '',
                                        genreDescription: '',
                                    }); 
                                    return; 
                                }
                                setUpdateForm({
                                    genreId: selectedId,
                                    genreName: selectedGenre.genreName,
                                    genreDescription: selectedGenre.genreDescription,
                                });
                            }}
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
                            placeholder="Genre Name"
                            value={updateForm.genreName}
                            onChange={(e) => setUpdateForm((prev) => ({ ...prev, genreName: e.target.value }))}
                            required
                        />

                        <input 
                            className="rounded-xl border border-light bg-background/70 p-3"
                            placeholder="Genre Description"
                            value={updateForm.genreDescription}
                            onChange={(e) => setUpdateForm((prev) => ({ ...prev, genreDescription: e.target.value }))}
                        />
                        <button
                            type="submit"
                            className="rounded-xl bg-primary text-white font-semibold px-5 py-3 hover:opacity-90 transition-opacity">
                            Save Changes
                        </button>
                    </form>
                </section>

                {/* DELETE operation - deleting artists from the database */}
                <section className="card p-6 mt-6">
                    <h2 className="text-2xl font-black mb-4">Delete Genre from Catalog</h2>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleDelete}>
                        <select
                            className="rounded-xl border border-light bg-background/70 p-3"
                            value={deleteGenreId}
                            onChange={(e) => setDeleteGenreId(e.target.value)}
                            required
                        >
                            <option value="">Select genre to delete</option>
                            {genres.map((genre) => (
                                <option key={genre.genreId} value={genre.genreId}>
                                    {genre.genreName}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="rounded-xl bg-primary text-white font-semibold px-5 py-3 hover:bg-primary/90 transition-colors"
                        >
                            Delete Genre
                        </button>
                    </form>
                </section>
            </div>
        </div>
    )
}