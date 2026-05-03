import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

//function to perform DELETE operation on song-playlist table
export async function DELETE(request) {
  try {
    const cookieUserId = request.cookies.get('karaoke_user_id')?.value;
    const userId = Number(cookieUserId);

    if (!Number.isInteger(userId) || userId < 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const playlistId = Number(body.playlistId);
    const songId = Number(body.songId);

    if (!Number.isInteger(playlistId) || playlistId < 1 || !Number.isInteger(songId) || songId < 1) {
      return NextResponse.json({ error: 'Invalid playlist or song id' }, { status: 400 });
    }

    const [playlistRows] = await pool.query(
      `SELECT playlist_id
       FROM playlists
       WHERE playlist_id = ? AND user_id = ?
       LIMIT 1`,
      [playlistId, userId]
    );

    if (!playlistRows.length) {
      return NextResponse.json({ error: 'Playlist not found for this user' }, { status: 404 });
    }

    const [existingRows] = await pool.query(
      `SELECT 1
       FROM song_playlists
       WHERE playlist_id = ? AND song_id = ?
       LIMIT 1`,
      [playlistId, songId]
    );

    if (!existingRows.length) {
      return NextResponse.json({ error: 'Song not found in this playlist' }, { status: 404 });
    }
    //DELETE from song-playlist
    await pool.query(
      `DELETE FROM song_playlists
       WHERE playlist_id = ? AND song_id = ?`,
      [playlistId, songId]
    );

    return NextResponse.json({ ok: true, message: 'Song removed from playlist' });
  } catch (error) {
    console.error('Remove song route error:', error);
    return NextResponse.json({ error: 'Failed to remove song from playlist' }, { status: 500 });
  }
}