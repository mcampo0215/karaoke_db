'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Genre = {
    genreId: number;
    genreName: string; 
    genreDescription: string; 
}

type GenreCatalogSectionProps = {
    showHeader?: boolean;
    compact?: boolean;
};

export default function GenreCatalogSectionProps({ showHeader = true, compact = false }: GenreCatalogSectionProps) {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();
    
    useEffect(() => {
        let ignore = false;

        async function loadGenres() {
            try {
                setLoading(true);
                setError('');

                const res = await fetch('/api/genres/catalog', { cache: 'no-store' });

                if (!res.ok) {
                    throw new Error('Failed to load genre catalog');
                }

                const data = await res.json();

                if (!ignore) {
                    setGenres(Array.isArray(data.genres) ? data.genres : []);
                }
            } catch (err: any) {
                if (!ignore) {
                    setGenres([]);
                    setError(err.message || 'Could not load the genre catalog.');
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadGenres();

        return () => {
            ignore = true;
        };
    }, []);


    //frontend 
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
                            Genre Catalog
                        </h1>
                        <p className="text-lg text-muted max-w-2xl">
                            This page reads directly from the genre table in the database.
                        </p>
                    </div>
                )}

                {loading ? (
                    <div className="card p-10 text-center text-muted">Loading genre catalog...</div>
                ) : error ? (
                    <div className="card p-10 text-center text-error">{error}</div>
                ) : genres.length === 0 ? (
                    <div className="card p-10 text-center text-muted">No genre matched your search.</div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {genres.map((genre, index) => (
                            <article key={genre.genreId} className="card p-6 flex flex-col gap-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="inline-flex items-center gap-2 rounded-full border border-light bg-background px-3 py-2 text-sm font-bold mb-3">{index + 1}</div>
                                        <h3 className="text-2xl font-black leading-tight mb-2">{genre.genreName}</h3>
                                    </div>
                                    <button
                                        type="button"
                                        className="h-14 w-14 rounded-2xl bg-primary/10 text-pink-300 grid place-items-center font-black text-xs border border-primary/20 transition-colors hover:bg-pink-200 hover:text-pink-700"
                                        onClick={() => router.push('/genreCRUD')}>
                                        Actions
                                    </button>
                                </div>
                        
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    {/* Added sm:col-span-2 here to make this box take up the full width of the grid on desktop */}
                                    <div className="sm:col-span-2 rounded-2xl border border-light bg-background/70 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-subtle mb-1">Description</p>
                                        <p className="font-semibold text-foreground">{genre.genreDescription}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}