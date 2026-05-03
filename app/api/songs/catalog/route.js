import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

// This route is for fetching the list of all songs in the catalog, along with their details  - READ operation in CRUD
export async function GET(request) {
    try {
        const [rows] = await pool.query(
            `SELECT 
                s.song_id AS songId,
                s.song_title AS songName,
                s.artist_id AS artistId,
                s.genre_id AS genreId,
                a.artist_stage_name AS artistName,
                g.genre_name AS genre,
                s.duration,
                s.releaseYear
            FROM songs s
            INNER JOIN artists a ON a.artist_id = s.artist_id
            INNER JOIN genres g ON g.genre_id = s.genre_id
            ORDER BY s.song_title`
        );

        return NextResponse.json({ songs: rows });
    }
    catch (error) {
        console.error('Song catalog route error: ', error);
        return NextResponse.json({ error: 'Failed to fetch song catalog' }, { status: 500 });
    }   
}