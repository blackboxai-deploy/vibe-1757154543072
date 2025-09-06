import { NextRequest, NextResponse } from 'next/server';
import { getLinkById, getClicksForLink } from '@/lib/database';
import { LinkStats, ClickRecord } from '@/types';

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

    const clicks = getClicksForLink(id);
    
    // Generate statistics
    const stats: LinkStats = generateLinkStats(link, clicks);

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching link stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch link statistics'
    }, { status: 500 });
  }
}

function generateLinkStats(link: any, clicks: ClickRecord[]): LinkStats {
  const totalClicks = clicks.length;
  const uniqueIPs = new Set(clicks.map(click => click.ipAddress)).size;
  
  // Clicks by country
  const clicksByCountry: { [country: string]: number } = {};
  clicks.forEach(click => {
    const country = click.country || 'Unknown';
    clicksByCountry[country] = (clicksByCountry[country] || 0) + 1;
  });

  // Clicks by date (last 30 days)
  const clicksByDate: { date: string; clicks: number }[] = [];
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  last30Days.forEach(date => {
    const dayClicks = clicks.filter(click => 
      click.timestamp.toISOString().split('T')[0] === date
    ).length;
    clicksByDate.push({ date, clicks: dayClicks });
  });

  // Top referrers
  const referrerCounts: { [referrer: string]: number } = {};
  clicks.forEach(click => {
    const referrer = click.referrer || 'Direct';
    referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
  });

  const topReferrers = Object.entries(referrerCounts)
    .map(([referrer, clicks]) => ({ referrer, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  // Device breakdown
  const deviceBreakdown = {
    desktop: clicks.filter(click => click.device.device === 'Desktop').length,
    mobile: clicks.filter(click => click.device.device === 'Mobile').length,
    tablet: clicks.filter(click => click.device.device === 'Tablet').length,
  };

  // Recent clicks (last 10)
  const recentClicks = clicks.slice(0, 10);

  return {
    link,
    totalClicks,
    uniqueClicks: uniqueIPs,
    clicksByCountry,
    clicksByDate,
    topReferrers,
    deviceBreakdown,
    recentClicks
  };
}