import { NextResponse } from "next/server";
import pool from '../../../../lib/db';

export async function GET(request) {
    try {
        const {searchParams} = new URL(request.url);
        const userId = Number(searchParams.get('userId'));

        if (!Number.isInteger(userId) || userId < 1) {
            return NextResponse.json({error: 'Invalid userId'}, {})
        }
    }
    catch (error) {

    }
}