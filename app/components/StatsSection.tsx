
import { User } from "../types/user";

export default function StatsSection({ users }: { users: User[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <div className="card p-8 text-center">
        <div className="text-4xl font-black text-primary mb-3">{users.length}</div>
        <div className="text-lg font-bold text-foreground mb-2">Active Performers</div>
      </div>
      <div className="card p-8 text-center">
        <div className="text-4xl font-black text-primary mb-3">
          {users.reduce((sum, user) => sum + (Number(user.songsCount) || 0), 0)}
        </div>
        <div className="text-lg font-bold text-foreground mb-2">Total Songs</div>
      </div>
      <div className="card p-8 text-center">
        <div className="text-4xl font-black text-primary mb-3">24/7</div>
        <div className="text-lg font-bold text-foreground mb-2">Live Sessions</div>
      </div>
    </div>
  );
}