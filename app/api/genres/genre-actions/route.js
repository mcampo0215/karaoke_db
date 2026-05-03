import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

// This route is for handling CRUD operations on genres in the catalog (Create, Update, Delete)
export async function POST(request) {
    try {
        const { action, genreData } = await request.json(); 

        //create operations
        if (action === 'create'){
            const {genre_name, genre_description} = genreData;
            const [result] = await pool.query(
                `INSERT INTO genres (genre_name, genre_description) VALUES (?, ?)`,
                [genre_name, genre_description]
            );
            return NextResponse.json({message: 'Genre created successfully', genre_id: result.insertId});
        }
        //update operations
        else if (action === 'update'){
            const {genre_id, genre_name, genre_description} = genreData;
            await pool.query(
                `UPDATE genres SET genre_name = ?, genre_description = ? WHERE genre_id = ?`,  
                [genre_name, genre_description, genre_id]
            );
            return NextResponse.json({message: 'Genre updated successfully'});

        }
    
        //delete operations 
        else if (action === 'delete'){
            const {genre_id} = genreData;
            await pool.query(`DELETE FROM genres WHERE genre_id = ?`, [genre_id]);
            return NextResponse.json({ message: 'Genre deleted successfully' });
        }

        //else 
        else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        
    } catch (error) {
        console.error('Genre actions route error: ', error);
        return NextResponse.json(
            { error: error?.sqlMessage || error?.message || 'Failed to perform genre action' },
            { status: 500 }
        );
    }

}
