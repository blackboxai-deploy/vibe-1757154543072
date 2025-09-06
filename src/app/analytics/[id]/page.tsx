"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LinkStats } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';
import { RecentClicksList } from '@/components/RecentClicksList';
import { formatDistanceToNow } from 'date-fns';

export default function AnalyticsPage() {
  const params = useParams();
  const [stats, setStats] = useState<LinkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, [params.id]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/links/${params.id}/stats`);
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      } else {
        setError(data.error || 'Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You might want to add a toast here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getTrackingUrl = (shortCode: string) => {
    return `${window.location.origin}/track/${shortCode}`;
  };

  const formatDate = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-xl font-bold text-red-800 mb-2">Error Loading Analytics</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const { link } = stats;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            ← Back to Dashboard
          </Button>
          <Badge variant={link.isActive ? 'default' : 'secondary'}>
            {link.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">
            {link.title}
          </h1>
          <p className="text-slate-600 break-all">
            Target: {link.originalUrl}
          </p>
        </div>

        {/* Tracking URL */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Tracking URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-2 bg-white border border-blue-200 rounded text-sm font-mono break-all">
                {getTrackingUrl(link.shortCode)}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(getTrackingUrl(link.shortCode))}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <span className="text-2xl">👆</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks}</div>
            <p className="text-xs text-slate-600">All-time clicks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <span className="text-2xl">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueClicks}</div>
            <p className="text-xs text-slate-600">Unique IP addresses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <span className="text-2xl">📅</span>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{formatDate(link.createdAt)}</div>
            <p className="text-xs text-slate-600">Link creation date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Click</CardTitle>
            <span className="text-2xl">🕒</span>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {link.lastClicked ? formatDate(link.lastClicked) : 'Never'}
            </div>
            <p className="text-xs text-slate-600">Most recent activity</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <AnalyticsCharts stats={stats} />

      {/* Recent Clicks */}
      <RecentClicksList clicks={stats.recentClicks} />
    </div>
  );
}