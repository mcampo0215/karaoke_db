import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

// Fetch the list of artists for the catalog page - READ operation 
export async function GET(request) {
    try {
        const [rows] = await pool.query(
            `SELECT
               artist_id AS artistId,
               artist_stage_name AS artistStageName,
               birthdate,
               country_of_origin AS countryOrigin,
               GetArtistSongCount(artist_id) AS artistSongCount
            FROM artists
            ORDER BY artist_id`
        );

        return NextResponse.json({ artists: rows });
    }
    catch (error) {
        console.error('Artist catalog route error: ', error);
        return NextResponse.json({ error: 'Failed to fetch artist catalog' }, { status: 500 });
    }
}