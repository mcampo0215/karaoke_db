'use client';
import {useRouter} from 'next/navigation';

const mockUsers = [
  {
    id: 1,
    name: "Emma Thompson",
    songsCount: 23,
    topSongs: ["Bohemian Rhapsody", "Don't Stop Believin'", "Sweet Caroline"]
  },
  {
    id: 2,
    name: "Jake Martinez",
    songsCount: 18,
    topSongs: ["Mr. Brightside", "Livin' on a Prayer", "Don't Stop Me Now"]
  },
  {
    id: 3,
    name: "Sophia Chen",
    songsCount: 31,
    topSongs: ["Rolling in the Deep", "Someone Like You", "Shallow"]
  },
  {
    id: 4,
    name: "Alex Rivera",
    songsCount: 27,
    topSongs: ["Uptown Funk", "Can't Stop the Feeling", "Happy"]
  },
  {
    id: 5,
    name: "Maya Patel",
    songsCount: 15,
    topSongs: ["Shape of You", "Perfect", "Thinking Out Loud"]
  },
  {
    id: 6,
    name: "Chris Johnson",
    songsCount: 22,
    topSongs: ["Wonderwall", "Champagne Supernova", "Don't Look Back in Anger"]
  },
  {
    id: 7,
    name: 'Ashley Peralta',
    songsCount: 22,
    topSongs: ['Pensandote', 'KEKE', 'Marvins Room']
  },
  {
    id: 8,
    name: 'Matthew Campoverde',
    songsCount: 5,
    topSongs: ['I Want It That Way', 'Toxic', 'Genie in a Bottle'],
  }
];

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen w-full bg-background text-foreground" style={{minHeight: '100vh'}}>
      {/* Modern Clean Header */}
      <div className="relative overflow-hidden bg-background w-full">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          {/* Header Content */}
          <div className="text-center mb-16">
            {/* <div className="inline-flex items-center gap-3 bg-surface border border-border rounded-full px-6 py-3 mb-8 shadow-soft">
              <span className="text-3xl">🎤</span>
              <span className="text-primary font-bold text-sm uppercase tracking-[0.1em]">Live Karaoke Database</span>
            </div> */}

            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight max-w-4xl mx-auto leading-tight">
              Discover Amazing
              <span className="block text-primary">Karaoke Performers</span>
            </h1>

            <p className="text-muted text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium mb-12">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card p-8 text-center group hover:scale-105 transition-all">
              <div className="text-4xl font-black text-primary mb-3">{mockUsers.length}</div>
              <div className="text-lg font-bold text-foreground mb-2">Active Performers</div>
              <div className="text-sm text-muted">Talented singers from around the world</div>
            </div>

            <div className="card p-8 text-center group hover:scale-105 transition-all">
              <div className="text-4xl font-black text-primary mb-3">{mockUsers.reduce((sum, user) => sum + user.songsCount, 0)}</div>
              <div className="text-lg font-bold text-foreground mb-2">Total Songs</div>
              <div className="text-sm text-muted">Diverse collection of karaoke hits</div>
            </div>

            <div className="card p-8 text-center group hover:scale-105 transition-all">
              <div className="text-4xl font-black text-primary mb-3">24/7</div>
              <div className="text-lg font-bold text-foreground mb-2">Live Sessions</div>
              <div className="text-sm text-muted">Connect and perform anytime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-20 bg-background">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="inline-block mb-6">
            <span className="bg-surface-elevated text-primary px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.1em] border border-border shadow-soft">
              Featured Artists
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Meet Our Performers</h2>
          <p className="text-muted text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            Browse through our talented karaoke community and discover their most beloved performances
          </p>
        </div>

        {/* Enhanced User Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {mockUsers.map((user, index) => (
            <div
              key={user.id}
              className="card p-8 group cursor-pointer animate-slide-up"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Enhanced User Header */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl ring-4 ring-primary/20 ring-offset-4 ring-offset-surface overflow-hidden relative">
                    <img
                      alt={user.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm animate-pulse-slow">🎵</span>
                  </div>
                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-success rounded-full border-2 border-white group-hover:scale-125 transition-transform"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black mb-2 group-hover:text-primary transition-colors tracking-tight">
                    {user.name}
                  </h3>
                  <p className="text-muted font-semibold flex items-center gap-2 text-sm tracking-wide">
                    <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                  </p>
                </div>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center p-6 bg-background rounded-2xl border border-light group-hover:border-primary/30 transition-all">
                  <div className="text-4xl font-black text-primary mb-2 group-hover:scale-110 transition-transform tracking-tight">{user.songsCount}</div>
                  <div className="text-xs text-muted font-bold uppercase tracking-[0.1em]">Songs</div>
                </div>
                <div className="text-center p-6 bg-background rounded-2xl border border-light group-hover:border-primary/30 transition-all">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🏆</div>
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
                      className="flex items-center gap-4 p-4 rounded-xl bg-background hover:bg-surface-elevated border border-light hover:border-primary/40 transition-all cursor-pointer group/song relative overflow-hidden"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover/song:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                      <div className="relative z-10 w-10 h-10 bg-surface-elevated rounded-xl flex items-center justify-center text-sm font-bold text-primary group-hover/song:bg-primary group-hover/song:text-white transition-all group-hover/song:scale-110 border border-border">
                        {songIndex + 1}
                      </div>
                      <div className="flex-1 relative z-10">
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
        <div className="mt-24 text-center pb-20">
          <div className="relative inline-block p-12 border-2 border-dashed border-border rounded-3xl hover:border-primary/50 transition-all bg-surface/50 backdrop-blur-sm group cursor-pointer overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}></div>

            <div className="relative z-10">
              <div className="text-6xl mb-8 group-hover:scale-110 transition-transform animate-float">🎵</div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">Join Our Community</h3>
              <p className="text-muted mb-8 text-xl max-w-lg mx-auto leading-relaxed font-medium">
                Ready to showcase your singing talent and connect with fellow performers around the world?
              </p>
              <button 
              className="btn btn-primary px-12 py-4 text-xl font-black relative overflow-hidden group/cta tracking-wide"
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