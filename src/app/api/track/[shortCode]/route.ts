import { NextRequest, NextResponse } from 'next/server';
import { getLinkByShortCode } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const { shortCode } = params;

    if (!shortCode) {
      return NextResponse.json({
        success: false,
        error: 'Short code is required'
      }, { status: 400 });
    }

    const link = getLinkByShortCode(shortCode);

    if (!link) {
      return NextResponse.json({
        success: false,
        error: 'Link not found or inactive'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      link: {
        id: link.id,
        originalUrl: link.originalUrl,
        title: link.title,
        shortCode: link.shortCode
      }
    });

  } catch (error) {
    console.error('Error fetching link by short code:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch link'
    }, { status: 500 });
  }
}