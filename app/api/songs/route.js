import { NextResponse } from "next/server";
import pool from '../../../lib/db';

export async function GET(request) {
    try {
        const {searchParams} = new URL(request.url);
        const userId = Number(searchParams.get('userId'));

        if (!Number.isInteger(userId) || userId < 1) {
            return NextResponse.json({error: 'Invalid userId'}, {status: 400});
        }

        const [rows] = await pool.query(
            `SELECT DISTINCT s.song_title
            FROM playlists p
            JOIN song_playlists sp ON sp.playlist_id = p.playlist_id
            JOIN songs s ON s.song_id = sp.song_id
            WHERE p.user_id = ?
            ORDER BY s.song_title`,
            [userId]
        );

        return NextResponse.json({
            userId,
            songs: rows.map((r) => r.song_title),
        });
    }
    catch (error) {
        console.error('Songs route error: ', error);
        return NextResponse.json({error: 'Failed to fetcg songs'}, {status: 500});
    }
}