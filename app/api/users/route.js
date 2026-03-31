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
        
        const[playlists] = await pool.query(
            `SELECT u.user_id AS id,
                CONCAT(u.first_name, ' ', u.last_name) AS name,
                COUNT(p.playlist_id) AS playlistsCount
            FROM users u
            LEFT JOIN playlists p ON u.user_id = p.user_id
            GROUP BY u.user_id`
        );

        //all playlist names
        const [playlistRows] = await pool.query(
            `SELECT p.user_id, p.playlist_name
            FROM playlists p
            ORDER BY p.user_id, created_at DESC, p.playlist_id DESC`
        );

        //top 3 playlists per user
        const topPlaylistsByUser = new Map();
        for (const row of playlistRows) {
            const userId = Number(row.user_id);
            const name = row.playlist_name;

            if (!topPlaylistsByUser.has(userId)) topPlaylistsByUser.set(userId, []);
            const list = topPlaylistsByUser.get(userId);

            if (list.length < 3 && !list.includes(name)) {
                list.push(name);
            }
        }

        const payload = playlists.map((u) => ({
            id: Number(u.id),
            name: u.name,
            playlistsCount: Number(u.playlistsCount),
            topPlaylists: topPlaylistsByUser.get(Number(u.id)) || [],
        }));
        
        return NextResponse.json(payload);
    }
    catch (error) {
        console.error('Database error: ', error);
        return NextResponse.json({error: 'Failed to fetch users'}, {status: 500});
    }
}