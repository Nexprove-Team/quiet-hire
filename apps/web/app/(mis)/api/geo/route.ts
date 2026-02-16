import { geolocation } from '@vercel/functions';
import { type NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
    const details = geolocation(request);
    return NextResponse.json(details);
}