import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(
      `SELECT user_id, username, first_name, last_name
       FROM users
       WHERE username = ? AND password = ?
       LIMIT 1`,
      [username, password]
    );

    if (!rows.length) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = rows[0];
    const response = NextResponse.json({
      ok: true,
      user: {
        id: Number(user.user_id),
        username: user.username,
        name: user.first_name + ' ' + user.last_name,
      },
    });

    response.cookies.set('karaoke_user_id', String(user.user_id), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login route error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}