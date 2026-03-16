import { User } from "../types/user";
import UserCard from "./UserCard";

type UserGridProps = {
    users: User[];
    expandedUserId: number | null;
    loadingSongsUserId: number | null;
    songsErrorByUser: Record<number, string>;
    fullSongsByUser: Record<number, string[]>;
    onToggle: (userId: number) => void;
};

export default function UsersGrid({
    users,
    expandedUserId,
    loadingSongsUserId,
    songsErrorByUser,
    fullSongsByUser,
    onToggle,
}: UserGridProps) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
            {users.map((user, index) => {
                const fullSongs = fullSongsByUser[user.id] || [];
                const extraSongs = fullSongs.filter((song) => !user.topSongs.includes(song));

                return (
                    <UserCard
                        key={user.id}
                        user={user}
                        index={index}
                        expanded={expandedUserId === user.id}
                        loadingSongs={loadingSongsUserId === user.id}
                        songsError={songsErrorByUser[user.id]}
                        extraSongs={extraSongs}
                        onToggle={onToggle}
                    />
                );
            })}
        </div>
    );
}