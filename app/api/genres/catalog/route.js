import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

// Fetch genres for song CRUD forms - READ operations 
export async function GET() {
    try {
        const [rows] = await pool.query(
            `SELECT
                genre_id AS genreId,
                genre_name AS genreName, 
                genre_description AS genreDescription
             FROM genres
             ORDER BY genreName`
        );

        return NextResponse.json({ genres: rows });
    } catch (error) {
        console.error('Genre catalog route error: ', error);
        return NextResponse.json({ error: 'Failed to fetch genre catalog' }, { status: 500 });
    }
}
