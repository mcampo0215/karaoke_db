import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET(request) {
    try {
        const userIdCookie = request.cookies.get('karaoke_user_id');
        const userId = userIdCookie?.value;

        if (!userId) {
            return NextResponse.json(
                { error: 'Not logged in' },
                { status: 401 }
            );
        }

        const [rows] = await pool.query(
            `SELECT email_address, username FROM USERS
            WHERE user_id = ?`,
            [userId]
        );

        if (!rows.length) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                ok: true,
                user: rows[0],
            },
            { status: 200 }
        );
    }

    catch (error) {
        console.error('User info route error: ', error);
        return NextResponse.json({ error: 'Failed to fetch user info' }, { status: 500 })
    };
}

export async function DELETE(request) {
    try {
        const userIdCookie = request.cookies.get('karaoke_user_id');
        const userId = Number(userIdCookie?.value);

        if (!userId) {
            return NextResponse.json(
                { error: 'Not logged in' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const username = body.username;

        const [rows] = await pool.query(
            `SELECT * FROM users
            WHERE username = ?`,
            [username]
        );

        if (!userId) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const [result] = await pool.query(
            `DELETE FROM users
            WHERE username = ?`,
            [username]
        )

        return NextResponse.json(
            {message: 'User deleted'},
            {status: 200}
        );
    }
    catch (error) {
        console.log('Error deleting user: ', error);
        return NextResponse.json({error: 'Failed to delete user account'}, {status: 500});
    }
}
export async function PATCH(request) {

    try {
        const userIdCookie = request.cookies.get('karaoke_user_id');
        const userId = Number(userIdCookie?.value);

        if (!userId) {
            return NextResponse.json(
                { error: 'Not logged in' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const newUsername = body.username;

        const [existing] = await pool.query(
            `SELECT user_id FROM users
            WHERE username = ?`,
            [newUsername]
        )

        if (existing.length > 0) {
            return NextResponse.json(
                { error: 'Username already taken' },
                { status: 409 }
            );
        }

        const [result] = await pool.query(
            `UPDATE users
            SET username = ?
            WHERE user_id = ?`,
            [newUsername, userId]
        );

        return NextResponse.json(
            {
                ok: true,
                message: 'Username sucessfully updated'
            },
            { status: 200 }
        )
    }
    catch (error) {
        console.error('User update failed: ', error);
        return NextResponse.json({ error: 'Failed to update username' }, { status: 500 });
    }
}