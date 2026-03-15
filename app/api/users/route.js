import {NextResponse} from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
    try {
        //all users
        const[users] = await pool.query(
            `SELECT u.user_id AS id,
                CONCAT(u.first_name, ' ', u.last_name) AS name,
                COUNT(ki.song_id) AS songsCount
            FROM users u
            LEFT JOIN karaoke_interest ki ON u.user_id = ki.user_id
            GROUP BY u.user_id`
        );

        //all song titles
        const [songs] = await pool.query(
            `SELECT p.user_id, s.song_title
            FROM playlists p
            JOIN song_playlists sp ON sp.playlist_id = p.playlist_id
            JOIN songs s ON s.song_id = sp.song_id
            ORDER BY p.user_id, s.song_id`
        );

        //top 3 songs per user
        const topSongsByUser = new Map();
        for (const row of songs) {
            const userId = Number(row.user_id);
            const title = row.song_title;

            if (!topSongsByUser.has(userId)) topSongsByUser.set(userId, []);
            const list = topSongsByUser.get(userId);

            if (list.length < 3 && !list.includes(title)) {
                list.push(title);
            }
        }

        const payload = users.map((u) => ({
            id: Number(u.id),
            name: u.name,
            songsCount: Number(u.songsCount),
            topSongs: topSongsByUser.get(Number(u.id)) || [],
        }));
        
        return NextResponse.json(payload);
    }
    catch (error) {
        console.error('Database error: ', error);
        return NextResponse.json({error: 'Failed to fetch users'}, {status: 500});
    }
}