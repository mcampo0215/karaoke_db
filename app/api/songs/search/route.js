import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET(request) {
  try {
    const cookieUserId = request.cookies.get('karaoke_user_id')?.value;
    const userId = Number(cookieUserId);

    if (!Number.isInteger(userId) || userId < 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim();

    if (query.length < 2) {
      return NextResponse.json({ songs: [] });
    }

    const [rows] = await pool.query(
      `SELECT s.song_id, s.song_title, a.artist_stage_name
       FROM songs s
       JOIN artists a ON a.artist_id = s.artist_id
       WHERE s.song_title LIKE ?
       ORDER BY s.song_title ASC
       LIMIT 20`,
      [`%${query}%`]
    );

    return NextResponse.json({
      songs: rows.map((row) => ({
        songId: Number(row.song_id),
        title: row.song_title,
        artist: row.artist_stage_name,
      })),
    });
  } catch (error) {
    console.error('Song search route error:', error);
    return NextResponse.json({ error: 'Failed to search songs' }, { status: 500 });
  }
}
