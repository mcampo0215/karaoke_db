import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request) {
  try {
    const cookieUserId = request.cookies.get('karaoke_user_id')?.value;
    const userId = Number(cookieUserId);

    if (!Number.isInteger(userId) || userId < 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [userRows] = await pool.query(
      `SELECT user_id, username, first_name
       FROM users
       WHERE user_id = ?
       LIMIT 1`,
      [userId]
    );

    if (!userRows.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userRows[0];
    const userData = {
      user: {
        id: user.user_id,
        username: user.username,
        name: `${user.first_name}`,
      },
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return NextResponse.json({ error: 'Failed to fetch menu data' }, { status: 500 });
  }
}   