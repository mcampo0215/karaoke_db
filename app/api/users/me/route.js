import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

// GET request for user info - retrieves the logged-in user's information based on the user ID stored in the cookie. 
// Returns the user's ID, first name, last name, email address, and username.
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
                    email: rows[0].email_address,
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

//DELETE request for user deletion - 
// deletes the logged-in user's account based on the user ID stored in the cookie and the username provided in the request body.
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
//PATCH request for user update - 
// updates the logged-in user's profile fields (username, first name, last name, and email).
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
        const requestedUsername = body.username?.trim();
        const requestedFirstName = body.first_name?.trim();
        const requestedLastName = body.last_name?.trim();
        const requestedEmail = body.email_address?.trim().toLowerCase() || body.email?.trim().toLowerCase();

        const [currentRows] = await pool.query(
            `SELECT username, first_name, last_name, email_address FROM users
            WHERE user_id = ?`,
            [userId]
        );

        if (!currentRows.length) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const currentUser = currentRows[0];

        const newUsername = requestedUsername || currentUser.username;
        const newFirstName = requestedFirstName || currentUser.first_name;
        const newLastName = requestedLastName || currentUser.last_name;
        const newEmail = requestedEmail || currentUser.email_address;

        if (!newUsername || !newFirstName || !newLastName || !newEmail) {
            return NextResponse.json(
                { error: 'Username, first name, last name, and email are required' },
                { status: 400 }
            );
        }

        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
        if (!isValidEmail) {
            return NextResponse.json(
                { error: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        if (newUsername !== currentUser.username) {
            const [existing] = await pool.query(
                `SELECT user_id FROM users
                WHERE username = ? AND user_id <> ?`,
                [newUsername, userId]
            );

            if (existing.length > 0) {
                return NextResponse.json(
                    { error: 'Username already taken' },
                    { status: 409 }
                );
            }
        }

        await pool.query(
            `UPDATE users
            SET username = ?, first_name = ?, last_name = ?, email_address = ?
            WHERE user_id = ?`,
            [newUsername, newFirstName, newLastName, newEmail, userId]
        );

        return NextResponse.json(
            {
                ok: true,
                message: 'Profile successfully updated',
                user: {
                    username: newUsername,
                    first_name: newFirstName,
                    last_name: newLastName,
                    email_address: newEmail,
                    email: newEmail,
                },
            },
            { status: 200 }
        )
    }
    catch (error) {
        console.error('User update failed: ', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
