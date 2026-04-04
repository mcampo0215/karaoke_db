import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function GET(request) {
    try {
        const userIdCookie = request.cookies.get('karaoke_user_id');
        const userId = Number(userIdCookie?.value);

        if (!userId) {
            return NextResponse.json(
                { error: 'Not logged in' },
                { status: 401 }
            );
        }

        const [rows] = await pool.query(
            `SELECT user_id, first_name, last_name, email_address, username FROM users
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
                user: {
                    id: Number(rows[0].user_id),
                    first_name: rows[0].first_name,
                    last_name: rows[0].last_name,
                    email_address: rows[0].email_address,
                    username: rows[0].username,
                },
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
        const username = body.username?.trim();

        if (!username) {
            return NextResponse.json(
                { error: 'Username is required' },
                { status: 400 }
            );
        }

        const [rows] = await pool.query(
            `SELECT user_id FROM users
            WHERE user_id = ? AND username = ?`,
            [userId, username]
        );

        if (!rows.length) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        await pool.query(
            `DELETE FROM users
            WHERE user_id = ?`,
            [userId]
        );

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
        const newUsername = body.username?.trim();

        if (!newUsername) {
            return NextResponse.json(
                { error: 'Username is required' },
                { status: 400 }
            );
        }

        const [currentRows] = await pool.query(
            `SELECT username FROM users
            WHERE user_id = ?`,
            [userId]
        );

        if (!currentRows.length) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (currentRows[0].username === newUsername) {
            return NextResponse.json(
                {
                    ok: true,
                    message: 'Username already matches your current one',
                    user: {
                        username: newUsername,
                    },
                },
                { status: 200 }
            );
        }

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

        await pool.query(
            `UPDATE users
            SET username = ?
            WHERE user_id = ?`,
            [newUsername, userId]
        );

        return NextResponse.json(
            {
                ok: true,
                message: 'Username successfully updated',
                user: {
                    username: newUsername,
                },
            },
            { status: 200 }
        )
    }
    catch (error) {
        console.error('User update failed: ', error);
        return NextResponse.json({ error: 'Failed to update username' }, { status: 500 });
    }
}
