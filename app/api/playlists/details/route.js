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
  const paddedMinutes = Number.isNaN(totalMinutes) ? minutes : String(totalMinutes).padStart(2, '0');

  return `${paddedMinutes}:${seconds}`;
}

//function for reading from song-playlist table 
export async function GET(request) {
try {
const cookieUserId = request.cookies.get('karaoke_user_id')?.value;
const userId = Number(cookieUserId);

if (!Number.isInteger(userId) || userId < 1) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

const url = new URL(request.url);
const playlistIdParam = url.searchParams.get('playlistId');
const playlistId = Number(playlistIdParam);

if (!Number.isInteger(playlistId) || playlistId < 1) {
  return NextResponse.json({ error: 'Invalid playlist id' }, { status: 400 });
}

const playlistSql = [
  'SELECT',
  'p.playlist_id,',
  'p.playlist_name,',
  'p.mood_tag,',
  'p.created_at,',
  'GetPlaylistSongCount(p.playlist_id) AS song_count',
  'FROM playlists p',
  'WHERE p.playlist_id = ? AND p.user_id = ?',
  'LIMIT 1',
].join(' ');

const [playlistRows] = await pool.query(playlistSql, [playlistId, userId]);

if (!playlistRows.length) {
  return NextResponse.json(
    { error: 'Playlist not found for this user' },
    { status: 404 }
  );
}
//READ operation - Get Songs in a playlist 
const songsSql = [
  'SELECT',
  's.song_id,',
  's.song_title,',
  's.artist_id,',
  's.genre_id,',
  'a.artist_stage_name,',
  'g.genre_name,',
  's.releaseYear,',
  's.duration',
  'FROM song_playlists sp',
  'JOIN songs s ON s.song_id = sp.song_id',
  'JOIN artists a ON a.artist_id = s.artist_id',
  'JOIN genres g ON g.genre_id = s.genre_id',
  'WHERE sp.playlist_id = ?',
  'ORDER BY s.song_title ASC, s.song_id ASC',
].join(' ');

const [songRows] = await pool.query(songsSql, [playlistId]);
const [artistRows] = await pool.query(
  'SELECT artist_id, artist_stage_name FROM artists ORDER BY artist_stage_name ASC'
);
const [genreRows] = await pool.query(
  'SELECT genre_id, genre_name FROM genres ORDER BY genre_name ASC'
);

const playlist = playlistRows[0];

return NextResponse.json({
  playlist: {
    playlistId: Number(playlist.playlist_id),
    playlistName: playlist.playlist_name,
    moodTag: playlist.mood_tag,
    createdAt: playlist.created_at,
    songCount: Number(playlist.song_count),
  },
  songs: songRows.map((row) => ({
    songId: Number(row.song_id),
    title: row.song_title,
    artistId: Number(row.artist_id),
    artist: row.artist_stage_name,
    genreId: Number(row.genre_id),
    genre: row.genre_name,
    releaseYear: row.releaseYear,
    duration: formatDurationForClient(row.duration),
  })),
  artists: artistRows.map((row) => ({
    artistId: Number(row.artist_id),
    artistStageName: row.artist_stage_name,
  })),
  genres: genreRows.map((row) => ({
    genreId: Number(row.genre_id),
    genreName: row.genre_name,
  })),
});
} catch (error) {
console.error('Error fetching playlist details:', error);
return NextResponse.json(
  { error: 'An error occurred while fetching playlist details' },
  { status: 500 }
);
}
}   

export async function PUT(request) {
try {
  const cookieUserId = request.cookies.get('karaoke_user_id')?.value;
  const userId = Number(cookieUserId);

  if (!Number.isInteger(userId) || userId < 1) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const playlistId = Number(body.playlistId);
  const songId = Number(body.songId);
  const songTitle = body.songTitle?.trim();
  const artistId = Number(body.artistId);
  const genreId = Number(body.genreId);
  const releaseYear = body.releaseYear === null || body.releaseYear === undefined || body.releaseYear === ''
    ? null
    : Number(body.releaseYear);
  const duration = body.duration?.trim();
  const moodTag = body.moodTag?.trim();

  if (!Number.isInteger(playlistId) || playlistId < 1) {
    return NextResponse.json({ error: 'Invalid playlist id' }, { status: 400 });
  }

  if (!Number.isInteger(songId) || songId < 1) {
    return NextResponse.json({ error: 'Select a song to edit' }, { status: 400 });
  }

  if (!songTitle) {
    return NextResponse.json({ error: 'Song name is required' }, { status: 400 });
  }

  if (!Number.isInteger(artistId) || artistId < 1) {
    return NextResponse.json({ error: 'Artist is required' }, { status: 400 });
  }

  if (!Number.isInteger(genreId) || genreId < 1) {
    return NextResponse.json({ error: 'Genre is required' }, { status: 400 });
  }

  if (releaseYear !== null && (!Number.isInteger(releaseYear) || releaseYear < 1000 || releaseYear > 9999)) {
    return NextResponse.json({ error: 'Invalid release year' }, { status: 400 });
  }

  if (duration && !/^\d{2}:\d{2}$/.test(duration)) {
    return NextResponse.json({ error: 'Duration must be MM:SS' }, { status: 400 });
  }

  const storedDuration = duration
    ? `00:${duration}`
    : null;

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

  const [songRows] = await pool.query(
    `SELECT s.song_id
     FROM songs s
     JOIN song_playlists sp ON sp.song_id = s.song_id
     WHERE s.song_id = ? AND sp.playlist_id = ?
     LIMIT 1`,
    [songId, playlistId]
  );

  if (!songRows.length) {
    return NextResponse.json({ error: 'Song not found in this playlist' }, { status: 404 });
  }

  const [artistRows] = await pool.query(
    `SELECT artist_id
     FROM artists
     WHERE artist_id = ?
     LIMIT 1`,
    [artistId]
  );

  if (!artistRows.length) {
    return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
  }

  const [genreRows] = await pool.query(
    `SELECT genre_id
     FROM genres
     WHERE genre_id = ?
     LIMIT 1`,
    [genreId]
  );

  if (!genreRows.length) {
    return NextResponse.json({ error: 'Genre not found' }, { status: 404 });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE songs
       SET song_title = ?, artist_id = ?, genre_id = ?, releaseYear = ?, duration = ?
       WHERE song_id = ?`,
      [songTitle, artistId, genreId, releaseYear, storedDuration, songId]
    );

    await connection.query(
      `UPDATE playlists
       SET mood_tag = ?
       WHERE playlist_id = ? AND user_id = ?`,
      [moodTag || null, playlistId, userId]
    );

    await connection.commit();
  } catch (transactionError) {
    await connection.rollback();
    throw transactionError;
  } finally {
    connection.release();
  }

  return NextResponse.json({
    ok: true,
    message: 'Song details updated successfully',
  });
} catch (error) {
  console.error('Update song details route error:', error);
  return NextResponse.json({ error: 'Failed to update song details' }, { status: 500 });
}
}