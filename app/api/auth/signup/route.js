import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

// POST request for user signup - creates a new user account with the provided email, username, password, first name, and last name.
export async function POST(request) {
    try {
        const body = await request.json();
        const email = body.email?.trim();
        const username = body.username?.trim();
        const password = body.password?.trim();
        const first_name = body.first_name?.trim();
        const last_name = body.last_name?.trim();

        if (!email || !username || !password || !first_name || !last_name) {
            return NextResponse.json(
                {error: 'Email, username, password, first name, and last name are required'},
                {status: 400}
            );
        }

        const [existing] = await pool.query(
            'SELECT user_id FROM users WHERE username = ?', [username]
        );
        if (existing.length > 0) {
            return NextResponse.json(
                {error: 'Username already exists'},
                {status: 400}
            )
        }

        await pool.query(
            'INSERT INTO users(email_address, username, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
            [email, username, password, first_name, last_name]
        );

        return NextResponse.json(
            {message: 'Account created'},
            {status: 201}
        );
    }
    catch (error) {
        console.error('Signup route error:', error);
        return NextResponse.json({error: 'Sign up failed'}, {status: 500});
    }
}
