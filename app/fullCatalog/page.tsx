'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SongCatalogSection from '../components/SongCatalogSection';
import ArtistCatalogSection from '../components/ArtistCatalogSection';  
import GenreCatalogSection from '../components/GenreCatalogSection';

export default function FullCatalogPage() {
  const router = useRouter();
  const [activeCatalog, setActiveCatalog] = useState<'songs' | 'artists' | 'genres' |null>(null);

  return (
    <div className="relative overflow-hidden bg-background w-full min-h-screen">
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}/>

      <div className="relative max-w-5xl mx-auto px-4 py-12">
        {/* top row */}
        <div className="flex items-center justify-end">
            <button 
            type="button"
            className="rounded-full border border-border bg-background/80 px-6 py-3 text-md font-semibold text-primary transition-colors hover:border-primary/40"
            onClick={() => router.push('/menu')}>
            Back to menu
            </button>
        </div>
        <div className="max-w-3xl mt-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-5 leading-tight max-w-4xl">
            Full Catalog
          </h1>
          <p className="text-lg text-muted max-w-2xl">
            This page reads songs, artists, and genres from the database.
          </p>
          <p className="text-md text-muted max-w-2xl">
            Additionally, you can click into the "Actions" button to perform CRUD operations on the database.          
          </p>
        </div>

        {/* Options to pick from - Songs | Artists | Genres */}
        <div className="relative left-1/2 -translate-x-1/2 w-screen px-6 md:px-12">
           <h3 className="mt-6 text-center text-5xl md:text-6xl font-extrabold tracking-tight text-purple-600">
          Choose an option to view: 
          </h3>
        </div>

        {/* Songs */}
        
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 py-10">
          <button type="button" aria-pressed={activeCatalog === 'songs'}
            className={
              activeCatalog === 'songs'
                ? 'rounded-full bg-indigo-400 px-10 py-5 text-xl text-gray-900 ring-4 ring-indigo-200 shadow-lg transition-colors'
                : 'rounded-full bg-indigo-50 px-10 py-5 text-xl text-gray-900 hover:bg-indigo-300 transition-colors'
            }
            onClick={() => setActiveCatalog('songs')}>
            Songs
          </button>
          
          {/*Artists*/}
          <button type="button" aria-pressed={activeCatalog === 'artists'} 
          className={
              activeCatalog === 'artists'
                ? 'rounded-full bg-indigo-400 px-10 py-5 text-xl text-gray-900 ring-4 ring-indigo-200 shadow-lg transition-colors'
                : 'rounded-full bg-indigo-50 px-10 py-5 text-xl text-gray-900 hover:bg-indigo-300 transition-colors'
            }
            onClick={() => setActiveCatalog('artists')}>
            Artists
          </button>

          <button type="button"  aria-pressed={activeCatalog === 'genres'} 
            className={
              activeCatalog === 'genres'
                ? 'rounded-full bg-indigo-400 px-10 py-5 text-xl text-gray-900 ring-4 ring-indigo-200 shadow-lg transition-colors'
                : 'rounded-full bg-indigo-50 px-10 py-5 text-xl text-gray-900 hover:bg-indigo-300 transition-colors'
            }
            onClick={() => setActiveCatalog('genres')}>
            Genres
          </button>

        </div>
        <div className="border border-gray-100"> </div>  

        {activeCatalog === 'songs' && (
          <div className="mt-10">
            <h4 className="mb-4 text-center text-md font-bold text-muted">
              The KARAOKE button will add the song to the community playlist for next karaoke event.
            </h4>
            <SongCatalogSection showHeader={false} compact />
          </div>
        )}

        {activeCatalog === 'artists' && (
          <div className="mt-10">
            <ArtistCatalogSection showHeader={false} compact />
          </div>
        )}

        {activeCatalog === 'genres' && (
          <div className="mt-10">
            <GenreCatalogSection showHeader={false} compact />
          </div>
        )}

      </div>
    </div>
  );
}