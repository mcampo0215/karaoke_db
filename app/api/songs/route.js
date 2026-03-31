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
            `SELECT DISTINCT playlist_name
            FROM playlists p
            WHERE p.user_id = ?
            ORDER BY playlist_name`,
            [userId]
        );
        return NextResponse.json({
            userId,
            playlists: rows.map((r) => r.playlist_name),
        });
    }
    catch (error) {
        console.error('Songs route error: ', error);
        return NextResponse.json({error: 'Failed to fetch playlists'}, {status: 500});
    }
}