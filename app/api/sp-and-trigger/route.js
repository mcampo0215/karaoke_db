import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// This route calls the stored procedure and maps SQL trigger errors to API responses.
export async function POST(request) {
	try {
		const cookieUserId = request.cookies.get('karaoke_user_id')?.value;
		const userId = Number(cookieUserId);

		if (!Number.isInteger(userId) || userId < 1) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { songId } = await request.json();
		const numericSongId = Number(songId);

		if (!Number.isInteger(numericSongId) || numericSongId < 1) {
			return NextResponse.json({ error: 'Invalid song id' }, { status: 400 });
		}

		const [songRows] = await pool.query(
			`SELECT song_id
			 FROM songs
			 WHERE song_id = ?
			 LIMIT 1`,
			[numericSongId]
		);

		if (!songRows.length) {
			return NextResponse.json({ error: 'Song not found' }, { status: 404 });
		}

		//Stored procedure performs the insert path for karaoke interest.
		try {
			await pool.query('CALL AddSongToKaraokeInterest(?, ?)', [userId, numericSongId]);
		} catch (procError) {
			// Inner catch: handle duplicate signal thrown during the procedure insert path.
			const isDuplicateSignal =
				procError?.sqlState === '45000' ||
				procError?.code === 'ER_SIGNAL_EXCEPTION' ||
				procError?.message?.includes('already added this song');

			if (isDuplicateSignal) {
				return NextResponse.json(
					{
						error: 'This user already added this song to karaoke interest',
						source: 'trigger',
					},
					{ status: 409 }
				);
			}

			throw procError;
		}

		return NextResponse.json({ ok: true, message: 'Song added to karaoke interest' });
	} catch (error) {
		// Outer catch: preserve duplicate-to-409 mapping for any errors.
		const isDuplicateSignal =
			error?.sqlState === '45000' ||
			error?.code === 'ER_SIGNAL_EXCEPTION' ||
			error?.message?.includes('already added this song');

		if (isDuplicateSignal) {
			return NextResponse.json(
				{
					error: 'This user already added this song to karaoke interest',
					source: 'trigger',
				},
				{ status: 409 }
			);
		}

		console.error('Stored procedure route error:', error);

		return NextResponse.json(
			{ error: error?.sqlMessage || error?.message || 'Failed to add karaoke interest' },
			{ status: 500 }
		);
	}
}
