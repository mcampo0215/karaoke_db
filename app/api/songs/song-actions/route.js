import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

// This route is for handling CRUD operations on songs in the catalog (Create, Update, Delete)

export async function POST(request) {
    try {
        const { action, songData } = await request.json();

        if (action === 'create') {
            const { songName, artistId, genreId, duration, releaseYear } = songData;
            const [result] = await pool.query(
                `INSERT INTO songs (song_title, artist_id, genre_id, duration, releaseYear) VALUES (?, ?, ?, ?, ?)`,
                [songName, artistId, genreId, duration, releaseYear]
            );
            return NextResponse.json({ message: 'Song created successfully', songId: result.insertId });
        }
        // UPDATE operation here serve for both songs table and song_playlists table 
        // song edits will happen in the song table, but with the song_id it will be shared to song_playlists
        // that is why song_playlists table in the front end also edit song details 
        else if (action === 'update') {
            const { songId, songName, artistId, genreId, duration, releaseYear } = songData;
            await pool.query(
                `UPDATE songs SET song_title = ?, artist_id = ?, genre_id = ?, duration = ?, releaseYear = ? WHERE song_id = ?`,  
                [songName, artistId, genreId, duration, releaseYear, songId]
            );
            return NextResponse.json({ message: 'Song updated successfully' });
        }
        else if (action === 'delete') {
            const { songId } = songData;
            await pool.query(`DELETE FROM songs WHERE song_id = ?`, [songId]);
            return NextResponse.json({ message: 'Song deleted successfully' });
        }
        else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    }
    catch (error) {
        console.error('Song actions route error: ', error);
        return NextResponse.json(
            { error: error?.sqlMessage || error?.message || 'Failed to perform song action' },
            { status: 500 }
        );
    }   
}                            