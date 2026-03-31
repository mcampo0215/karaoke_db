import { User } from "../types/user";

type UserCardProps = {
    user: User;
    index: number;
    expanded: boolean;
    loadingSongs: boolean;
    songsError?: string;
    playlists: string[];
    onToggle: (userId: number) => void;
};

export default function UserCard({
    user,
    index,
    expanded,
    loadingSongs,
    songsError,
    playlists,
    onToggle,
}: UserCardProps) {

    return (
        <div
      className="card p-8 group cursor-pointer animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center mb-8">
        <div className="flex-1">
          <h3 className="text-2xl font-black mb-2 group-hover:text-primary transition-colors tracking-tight">
            {user.name}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="text-center p-6 bg-background rounded-2xl border border-light group-hover:border-primary/30 transition-all">
          <div className="text-4xl font-black text-primary mb-2">{user.playlistsCount}</div>
          <div className="text-xs text-muted font-bold uppercase tracking-[0.1em]">Playlists</div>
        </div>
        <div className="text-center p-6 bg-background rounded-2xl border border-light group-hover:border-primary/30 transition-all">
          <div className="text-4xl mb-2">🏆</div>
          <div className="text-xs text-muted font-bold uppercase tracking-[0.1em]">Top Rated</div>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="font-bold mb-6 text-foreground flex items-center gap-2">
          <span className="text-primary">♪</span>
          Current Playlists
        </h4>
        <div className="space-y-3">
          {user.topPlaylists.map((playlist, playlistIndex) => (
            <div key={playlist} className="flex items-center gap-4 p-4 rounded-xl bg-background border border-light">
              <div className="w-10 h-10 bg-surface-elevated rounded-xl flex items-center justify-center text-sm font-bold text-primary border border-border">
                {playlistIndex + 1}
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold block">{playlist}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="w-full btn btn-outline py-4 font-black text-lg"
        onClick={() => onToggle(user.id)}
      >
        {expanded ? 'Hide Full Playlist' : 'View Full Playlist'}
      </button>
      {expanded && (
        <div className="mt-6 border-t border-light pt-5">
          <h5 className="font-bold mb-3 text-foreground">Full Playlist</h5>
          {loadingSongs ? (
            <p className="text-sm text-muted">Loading playlists...</p>
          ) : songsError ? (
            <p className="text-sm text-error">{songsError}</p>
          ) : playlists.length > 0 ? (
            <div className="space-y-2">
              {playlists.map((playlist, i) => (
                <div key={`${playlist}-${i}`} className="text-sm p-3 rounded-lg bg-background border border-light">
                  {playlist}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No additional playlists.</p>
          )}
        </div>
      )}
    </div>
    );
}