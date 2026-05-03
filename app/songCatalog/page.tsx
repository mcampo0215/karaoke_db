'use client';

import { useRouter } from 'next/navigation';
import SongCatalogSection from '../components/SongCatalogSection';

export default function SongCatalogPage() {
    const router = useRouter();

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

                    <button
                        type="button"
                        className="rounded-full border border-border bg-background/80 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
                        onClick={() => window.location.reload()}
                    >
                        Refresh catalog
                    </button>
                </div>
                <SongCatalogSection showHeader />
            </div>
        </div>
    );
}
