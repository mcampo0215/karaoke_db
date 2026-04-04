'use client';

import { useRouter } from 'next/navigation';

export default function JoinCommunity() {
  const router = useRouter();

  return (
    <div className="mt-24 text-center pb-20">
      <div className="relative inline-block p-12 border-2 border-dashed border-border rounded-3xl hover:border-primary/50 transition-all bg-surface/50 backdrop-blur-sm group cursor-pointer overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10">
          <div className="text-6xl mb-8 group-hover:scale-110 transition-transform animate-float">🎵</div>
          <p className="text-muted mb-8 text-xl max-w-lg mx-auto leading-relaxed font-medium">
            Ready for our next karaoke night? Log back in to share and view your playlists!
          </p>
          <div className="flex flex-col items-center gap-4">
            <button
              className="btn btn-primary px-12 py-4 text-xl font-black relative overflow-hidden group/cta tracking-wide"
              onClick={() => router.push('/login')}
            >
              <span className="relative z-10">Log back in</span>
              <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover/cta:scale-x-100 transition-transform duration-300 origin-center" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-5 py-2 text-sm font-semibold text-muted shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background hover:text-primary"
              onClick={() => router.push('/signup')}
            >
              <span>Not a user?</span>
              <span className="text-primary">Sign up here</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
