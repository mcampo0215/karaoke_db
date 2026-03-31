import { User } from "../types/user";
import UserCard from "./UserCard";

type UserGridProps = {
    users: User[];
    expandedUserId: number | null;
    loadingPlaylistsUserId: number | null;
    playlistsErrorByUserId: Record<number, string>;
    playlistsByUserId: Record<number, string[]>;
    onToggle: (userId: number) => void;
};

export default function UsersGrid({
    users,
    expandedUserId,
    loadingPlaylistsUserId,
    playlistsErrorByUserId,
    playlistsByUserId,
    onToggle,
}: UserGridProps) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
            {users.map((user, index) => {
                //const fullSongs = fullSongsByUser[user.id] || [];
                //const extraSongs = fullSongs.filter((song) => !user.topSongs.includes(song));
                const playlists = playlistsByUserId[user.id] || [];

                return (
                    <UserCard
                        key={user.id}
                        user={user}
                        index={index}
                        expanded={expandedUserId === user.id}
                        loadingSongs={loadingPlaylistsUserId === user.id}
                        songsError={playlistsErrorByUserId[user.id]}
                        playlists={playlists}
                        onToggle={onToggle}
                    />
                );
            })}
        </div>
    );
}