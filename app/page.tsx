'use client';
import {useRouter} from 'next/navigation';
import { useState, useEffect } from 'react';


export default function Home() {
  const router = useRouter();

  type User = {
    id: number;
    name: string;
    songsCount: number;
    topSongs: string[];
  };

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false

    async function loadUsers() {
      try {
        setLoading(true);
        setError('');

        const res = await fetch('/api/users', {cache: 'no-store'});
        if (!res.ok) {
          throw new Error('Request failed');
        }

        const data = await res.json();
        if (!ignore) {
          setUsers(Array.isArray(data) ? data : []);
        }
      }
      finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadUsers();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className = 'min-h-screen w-full bg-background text-foreground grid place-items-center'>
        <p className = 'text-lg font-semibold'>Loading performers...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className = 'min-h-screen w-full bg-background text-foreground grid place-items-center'>
        <p className = 'text-lg font-semibold'>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full bg-background text-foreground" style={{minHeight: '100vh'}}>
      {/* Modern Clean Header */}
      <div className="relative overflow-hidden bg-background w-full">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
          {/* Header Content */}
          <div className="text-center mb-12 sm:mb-16">
            {/* <div className="inline-flex items-center gap-3 bg-surface border border-border rounded-full px-6 py-3 mb-8 shadow-soft">
              <span className="text-3xl">🎤</span>
              <span className="text-primary font-bold text-sm uppercase tracking-[0.1em]">Live Karaoke Database</span>
            </div> */}

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 sm:mb-8 tracking-tight max-w-4xl mx-auto leading-tight">
              Discover Amazing
              <span className="block text-primary">Karaoke Performers</span>
            </h1>

            <p className="text-muted text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium mb-10 sm:mb-12 px-2 sm:px-0">
              Connect with talented singers, explore their signature songs, and find your next karaoke inspiration in our vibrant community
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <button className="btn btn-primary px-8 py-4 text-lg font-bold">
                Explore Performers
              </button>
              <button className="btn btn-outline px-8 py-4 text-lg font-semibold">
                Join Community
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="card p-8 text-center group hover:scale-105 transition-all">
              <div className="text-3xl sm:text-4xl font-black text-primary mb-3">{users.length}</div>
              <div className="text-lg font-bold text-foreground mb-2">Active Performers</div>
              <div className="text-sm text-muted">Talented singers from around the world</div>
            </div>

            <div className="card p-8 text-center group hover:scale-105 transition-all">
              <div className="text-3xl sm:text-4xl font-black text-primary mb-3">{users.reduce((sum, user) => sum + user.songsCount, 0)}</div>
              <div className="text-lg font-bold text-foreground mb-2">Total Songs</div>
              <div className="text-sm text-muted">Diverse collection of karaoke hits</div>
            </div>

            <div className="card p-8 text-center group hover:scale-105 transition-all">
              <div className="text-3xl sm:text-4xl font-black text-primary mb-3">24/7</div>
              <div className="text-lg font-bold text-foreground mb-2">Live Sessions</div>
              <div className="text-sm text-muted">Connect and perform anytime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20 bg-background">
        {/* Section Header */}
        <div className="mb-10 sm:mb-16 text-center">
          <div className="inline-block mb-6">
            <span className="bg-surface-elevated text-primary px-5 sm:px-8 py-3 sm:py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-[0.1em] border border-border shadow-soft">
              Featured Artists
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 tracking-tight">Meet Our Performers</h2>
          <p className="text-muted text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            Browse through our talented karaoke community and discover their most beloved performances
          </p>
        </div>

        {/* Enhanced User Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 xl:gap-8">
          {users.map((user, index) => (
            <div
              key={user.id}
              className="card p-5 sm:p-6 lg:p-8 group cursor-pointer animate-slide-up"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Enhanced User Header */}
              <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl text-center font-black mb-2 group-hover:text-primary transition-colors tracking-tight break-words">
                    {user.name}
                  </h3>
                  <p className="text-muted font-semibold flex items-center gap-2 text-sm tracking-wide">
                    <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                  </p>
                </div>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
                <div className="text-center p-4 sm:p-6 bg-background rounded-2xl border border-light group-hover:border-primary/30 transition-all">
                  <div className="text-3xl sm:text-4xl font-black text-primary mb-2 group-hover:scale-110 transition-transform tracking-tight">{user.songsCount}</div>
                  <div className="text-xs text-muted font-bold uppercase tracking-[0.1em]">Songs</div>
                </div>
                <div className="text-center p-4 sm:p-6 bg-background rounded-2xl border border-light group-hover:border-primary/30 transition-all">
                  <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">🏆</div>
                  <div className="text-xs text-muted font-bold uppercase tracking-[0.1em]">Top Rated</div>
                </div>
              </div>

              {/* Enhanced Top Songs */}
              <div className="mb-8">
                <h4 className="font-bold mb-6 text-foreground flex items-center gap-2">
                  <span className="text-primary">♪</span>
                  Signature Songs
                </h4>
                <div className="space-y-3">
                  {user.topSongs.map((song, songIndex) => (
                    <div
                      key={song}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-background hover:bg-surface-elevated border border-light hover:border-primary/40 transition-all cursor-pointer group/song relative overflow-hidden"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover/song:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                      <div className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 shrink-0 bg-surface-elevated rounded-xl flex items-center justify-center text-sm font-bold text-primary group-hover/song:bg-primary group-hover/song:text-white transition-all group-hover/song:scale-110 border border-border">
                        {songIndex + 1}
                      </div>
                      <div className="flex-1 min-w-0 relative z-10">
                        <span className="text-sm font-semibold truncate group-hover/song:text-primary transition-colors block">{song}</span>
                        <span className="text-xs text-subtle">★★★★★</span>
                      </div>
                      <div className="relative z-10 text-primary opacity-0 group-hover/song:opacity-100 transition-opacity">
                        <span className="text-sm">▶</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Action Button */}
              <button className="w-full btn btn-outline py-4 font-black text-lg relative overflow-hidden group/btn tracking-wide">
                <span className="relative z-10">View Full Playlist</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="mt-16 sm:mt-24 text-center pb-20">
          <div className="relative block w-full max-w-3xl mx-auto p-6 sm:p-8 lg:p-12 border-2 border-dashed border-border rounded-3xl hover:border-primary/50 transition-all bg-surface/50 backdrop-blur-sm group cursor-pointer overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}></div>

            <div className="relative z-10">
              <div className="text-5xl sm:text-6xl mb-6 sm:mb-8 group-hover:scale-110 transition-transform animate-float">🎵</div>
              <h3 className="text-2xl sm:text-3xl font-black mb-4 tracking-tight">Join Our Community</h3>
              <p className="text-muted mb-8 text-base sm:text-lg md:text-xl max-w-lg mx-auto leading-relaxed font-medium">
                Ready to showcase your singing talent and connect with fellow performers around the world?
              </p>
              <button 
              className="btn btn-primary px-8 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-black relative overflow-hidden group/cta tracking-wide"
              onClick={() => router.push('/login')}>
                <span className="relative z-10">Log back in</span>
                <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover/cta:scale-x-100 transition-transform duration-300 origin-center"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background filler to ensure no gaps */}
      <div className="w-full bg-background" style={{minHeight: '5vh'}}></div>
    </div>
  );
}