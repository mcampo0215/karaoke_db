import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// This route is to display the View I made in in SQL called community_top_songs which is a view of all the songs that are in the karaoke interest table in the database

// This is the view query that I made in SQL to get the top songs in the karaoke interest table in the database:
// Adding it here for reference, but it is also in the SQL workbench database as a view called community_top_songs
/*
CREATE VIEW community_top_songs AS
SELECT 
    s.song_title,
    a.artist_stage_name,
    COUNT(DISTINCT ki.user_id) AS like_count
FROM songs s
JOIN artists a 
    ON a.artist_id = s.artist_id
JOIN karaoke_interest ki 
    ON ki.song_id = s.song_id
GROUP BY 
    s.song_id, 
    s.song_title, 
    a.artist_stage_name
ORDER BY like_count DESC;
*/

export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT
          song_title,
          artist_stage_name,
          like_count
       FROM community_top_songs
       ORDER BY like_count DESC`
    );

    const communitySongCount = rows.length;

    return NextResponse.json({
      communitySongCount,
      songs: rows.map((row) => ({
        songTitle: row.song_title,
        artistStageName: row.artist_stage_name,
        likeCount: Number(row.like_count),
      })),
    });
  } catch (error) {
    console.error('Community view route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community view data' },
      { status: 500 }
    );
  }
}