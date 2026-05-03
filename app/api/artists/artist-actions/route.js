import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

// This route is for handling CRUD operations on artists in the catalog (Create, Update, Delete)
export async function POST(request) {
    try {
        const { action, artistData } = await request.json();

        if (action === 'create') {
            const artistStageName = artistData.artist_stage_name ?? artistData.artistStageName;
            const birthdate = artistData.birthdate ?? null;
            const countryOrigin = artistData.country_of_origin ?? artistData.countryOrigin ?? null;

            if (!artistStageName) {
                return NextResponse.json({ error: 'artist_stage_name is required' }, { status: 400 });
            }

            const [result] = await pool.query(
                `INSERT INTO artists (artist_stage_name, birthdate, country_of_origin) VALUES (?, ?, ?)`,
                [artistStageName, birthdate, countryOrigin]
            );
            return NextResponse.json({ message: 'Artist created successfully', artistId: result.insertId });
        }
        else if (action === 'update') {
            const artistId = artistData.artist_id ?? artistData.artistId;
            const artistStageName = artistData.artist_stage_name ?? artistData.artistStageName;
            const birthdate = artistData.birthdate ?? null;
            const countryOrigin = artistData.country_of_origin ?? artistData.countryOrigin ?? null;

            if (!artistId || !artistStageName) {
                return NextResponse.json({ error: 'artist_id and artist_stage_name are required' }, { status: 400 });
            }

            await pool.query(
                `UPDATE artists SET artist_stage_name = ?, birthdate = ?, country_of_origin = ? WHERE artist_id = ?`,
                [artistStageName, birthdate, countryOrigin, artistId]
            );
            return NextResponse.json({ message: 'Artist updated successfully' });
        }
        else if (action === 'delete') {
            const artistId = artistData.artist_id ?? artistData.artistId;
            if (!artistId) {
                return NextResponse.json({ error: 'artist_id is required' }, { status: 400 });
            }

            await pool.query(`DELETE FROM artists WHERE artist_id = ?`, [artistId]);
            return NextResponse.json({ message: 'Artist deleted successfully' });
        }
        else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    }
    catch (error) {
        console.error('Artist actions route error: ', error);
        return NextResponse.json(
            { error: error?.sqlMessage || error?.message || 'Failed to perform artist action' },
            { status: 500 }
        );
    }   
}