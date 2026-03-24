import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function POST(request) {
  try {
    const cookieUserId = request.cookies.get('karaoke_user_id')?.value;
    const userId = Number(cookieUserId);

    if (!Number.isInteger(userId) || userId < 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { playlistId, songId } = await request.json();
    const numericPlaylistId = Number(playlistId);
    const numericSongId = Number(songId);

    if (!Number.isInteger(numericPlaylistId) || !Number.isInteger(numericSongId)) {
      return NextResponse.json({ error: 'Invalid playlist or song id' }, { status: 400 });
    }

    const [playlistRows] = await pool.query(
      `SELECT playlist_id
       FROM playlists
       WHERE playlist_id = ? AND user_id = ?
       LIMIT 1`,
      [numericPlaylistId, userId]
    );

    if (!playlistRows.length) {
      return NextResponse.json({ error: 'Playlist not found for this user' }, { status: 404 });
    }

    const [songRows] = await pool.query(
      `SELECT song_id
       FROM songs
       WHERE song_id = ?
       LIMIT 1`,
      [numericSongId]
    );

    if (!songRows.length) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    const [existingRows] = await pool.query(
      `SELECT 1
       FROM song_playlists
       WHERE playlist_id = ? AND song_id = ?
       LIMIT 1`,
      [numericPlaylistId, numericSongId]
    );

    if (existingRows.length) {
      return NextResponse.json({ ok: true, message: 'Song already in playlist' });
    }

    await pool.query(
      `INSERT INTO song_playlists (playlist_id, song_id)
       VALUES (?, ?)`,
      [numericPlaylistId, numericSongId]
    );

    return NextResponse.json({ ok: true, message: 'Song added to playlist' });
  } catch (error) {
    console.error('Add song route error:', error);
    return NextResponse.json({ error: 'Failed to add song to playlist' }, { status: 500 });
  }
}
