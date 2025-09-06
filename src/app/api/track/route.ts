import { NextRequest, NextResponse } from 'next/server';
import { recordClick } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { linkId, referrer } = body;

    if (!linkId) {
      return NextResponse.json({
        success: false,
        error: 'Link ID is required'
      }, { status: 400 });
    }

    // Get client info from headers
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    
    // Get IP address (prioritize forwarded headers for production)
    const ipAddress = forwardedFor?.split(',')[0] || realIp || '127.0.0.1';

    // Record the click
    const click = await recordClick(linkId, ipAddress, userAgent, referrer);

    return NextResponse.json({
      success: true,
      click: {
        id: click.id,
        timestamp: click.timestamp,
        country: click.country,
        city: click.city
      }
    });

  } catch (error) {
    console.error('Error recording click:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to record click'
    }, { status: 500 });
  }
}