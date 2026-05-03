import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request) {
  try {
    const cookieUserId = request.cookies.get('karaoke_user_id')?.value;
    const userId = Number(cookieUserId);

    if (!Number.isInteger(userId) || userId < 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [userRows] = await pool.query(
      `SELECT user_id, username, first_name, last_name
       FROM users
       WHERE user_id = ?
       LIMIT 1`,
      [userId]
    );

    if (!userRows.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const [playlistRows] = await pool.query(
      `SELECT
          p.playlist_id,
          p.playlist_name,
          p.mood_tag,
          p.created_at,
          GetPlaylistSongCount(p.playlist_id) AS song_count
       FROM playlists p
       WHERE p.user_id = ?
       ORDER BY p.created_at DESC, p.playlist_id DESC`,
      [userId]
    );

    const [topSongRows] = await pool.query(
      `SELECT
          s.song_id,
          s.song_title,
          a.artist_stage_name,
          COUNT(*) AS appearances
       FROM playlists p
       JOIN song_playlists sp ON sp.playlist_id = p.playlist_id
       JOIN songs s ON s.song_id = sp.song_id
       JOIN artists a ON a.artist_id = s.artist_id
       WHERE p.user_id = ?
       GROUP BY s.song_id, s.song_title, a.artist_stage_name
       ORDER BY appearances DESC, s.song_title ASC
       LIMIT 5`,
      [userId]
    );

    const [recentRows] = await pool.query(
      `SELECT
          s.song_id,
          s.song_title,
          a.artist_stage_name,
          MAX(s.song_id) AS latest_song_id
       FROM playlists p
       JOIN song_playlists sp ON sp.playlist_id = p.playlist_id
       JOIN songs s ON s.song_id = sp.song_id
       JOIN artists a ON a.artist_id = s.artist_id
       WHERE p.user_id = ?
       GROUP BY s.song_id, s.song_title, a.artist_stage_name
       ORDER BY latest_song_id DESC
       LIMIT 8`,
      [userId]
    );

    const user = userRows[0];

    return NextResponse.json({
      user: {
        id: Number(user.user_id),
        username: user.username,
        name: user.first_name + ' ' + user.last_name,
      },
      playlists: playlistRows.map((row) => ({
        playlistId: Number(row.playlist_id),
        playlistName: row.playlist_name,
        moodTag: row.mood_tag,
        createdAt: row.created_at,
        songCount: Number(row.song_count),
      })),
      topSongs: topSongRows.map((row) => ({
        songId: Number(row.song_id),
        title: row.song_title,
        artist: row.artist_stage_name,
        appearances: Number(row.appearances),
      })),
      recentlyViewedSongs: recentRows.map((row) => ({
        songId: Number(row.song_id),
        title: row.song_title,
        artist: row.artist_stage_name,
      })),
    });
  } catch (error) {
    console.error('Dashboard route error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}
