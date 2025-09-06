import { NextRequest, NextResponse } from 'next/server';
import { createLink, getAllLinks } from '@/lib/database';
import { CreateLinkRequest, CreateLinkResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateLinkRequest;
    const { originalUrl, title } = body;

    if (!originalUrl) {
      return NextResponse.json({
        success: false,
        error: 'Original URL is required'
      } as CreateLinkResponse, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Invalid URL format'
      } as CreateLinkResponse, { status: 400 });
    }

    const link = createLink(originalUrl, title);

    return NextResponse.json({
      success: true,
      link
    } as CreateLinkResponse);

  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create link'
    } as CreateLinkResponse, { status: 500 });
  }
}

export async function GET() {
  try {
    const links = getAllLinks();
    
    return NextResponse.json({
      success: true,
      links
    });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch links'
    }, { status: 500 });
  }
}