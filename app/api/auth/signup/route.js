import { NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function POST(request) {
    try {
        const body = await request.json();
        const email = body.email;
        const username = body.username;
        const password = body.password;
        const first_name = body.first_name;
        const last_name = body.last_name;

        const [existing] = await pool.query(
            'SELECT user_id FROM users WHERE username = ?', [username]
        );
        if (existing.length > 0) {
            return NextResponse.json(
                {error: 'Username already exists'},
                {status: 400}
            )
        }

        const [result] = await pool.query(
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

