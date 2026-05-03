
import { User } from "../types/user";

type StatsSectionProps = {
  users: User[];
  communitySongCount: number;
};

export default function StatsSection({ users, communitySongCount }: StatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <div className="card p-8 text-center">
        <div className="text-4xl font-black text-primary mb-3">{users.length}</div>
        <div className="text-lg font-bold text-foreground mb-2">Friends</div>
      </div>
      <div className="card p-8 text-center">
        <div className="text-4xl font-black text-primary mb-3">
          {users.reduce((sum, user) => sum + (Number(user.playlistsCount) || 0), 0)}
        </div>
        <div className="text-lg font-bold text-foreground mb-2">Total Playlists</div>
      </div>
      <div className="card p-8 text-center">
        <div className="text-4xl font-black text-primary mb-3">{communitySongCount}</div>
        <div className="text-lg font-bold text-foreground mb-2"> Karaoke Interest Songs</div>
      </div>
    </div>
  );
}