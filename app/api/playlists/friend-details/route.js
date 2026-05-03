import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

function formatDurationForClient(duration) {
  if (!duration) {
    return null;
  }

  const [hours, minutes, seconds] = String(duration).split(':');
  if (seconds === undefined) {
    return String(duration);
  }

  const totalMinutes = Number(hours) * 60 + Number(minutes);
  const normalizedMinutes = Number.isNaN(totalMinutes)
    ? minutes
    : String(totalMinutes).padStart(2, '0');

  return `${normalizedMinutes}:${seconds}`;
}

export async function GET(request) {
  try {
    const cookieUserId = request.cookies.get('karaoke_user_id')?.value;
    const sessionUserId = Number(cookieUserId);

    if (!Number.isInteger(sessionUserId) || sessionUserId < 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const playlistId = Number(url.searchParams.get('playlistId'));

    if (!Number.isInteger(playlistId) || playlistId < 1) {
      return NextResponse.json({ error: 'Invalid playlist id' }, { status: 400 });
    }

    const [playlistRows] = await pool.query(
      `SELECT p.playlist_id, p.playlist_name, p.user_id, CONCAT(u.first_name, ' ', u.last_name) AS owner_name
       FROM playlists p
       JOIN users u ON u.user_id = p.user_id
       WHERE p.playlist_id = ?
       LIMIT 1`,
      [playlistId]
    );

    if (!playlistRows.length) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
    }

    const [songRows] = await pool.query(
      `SELECT s.song_id, s.song_title, a.artist_stage_name, g.genre_name, s.releaseYear, s.duration
       FROM song_playlists sp
       JOIN songs s ON s.song_id = sp.song_id
       JOIN artists a ON a.artist_id = s.artist_id
       JOIN genres g ON g.genre_id = s.genre_id
       WHERE sp.playlist_id = ?
       ORDER BY s.song_title ASC, s.song_id ASC`,
      [playlistId]
    );

    const playlist = playlistRows[0];

    return NextResponse.json({
      playlist: {
        playlistId: Number(playlist.playlist_id),
        playlistName: playlist.playlist_name,
        ownerId: Number(playlist.user_id),
        ownerName: playlist.owner_name,
      },
      songs: songRows.map((row) => ({
        songId: Number(row.song_id),
        title: row.song_title,
        artist: row.artist_stage_name,
        genre: row.genre_name,
        releaseYear: row.releaseYear,
        duration: formatDurationForClient(row.duration),
      })),
    });
  } catch (error) {
    console.error('Friend playlist details route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friend playlist details' },
      { status: 500 }
    );
  }
}
