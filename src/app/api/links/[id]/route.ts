import { NextRequest, NextResponse } from 'next/server';
import { deleteLink, getLinkById } from '@/lib/database';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Link ID is required'
      }, { status: 400 });
    }

    const deleted = deleteLink(id);

    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Link not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Link deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete link'
    }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Link ID is required'
      }, { status: 400 });
    }

    const link = getLinkById(id);

    if (!link) {
      return NextResponse.json({
        success: false,
        error: 'Link not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      link
    });

  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch link'
    }, { status: 500 });
  }
}