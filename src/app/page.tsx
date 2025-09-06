"use client";

import { useState, useEffect } from 'react';
import { TrackingLink } from '@/types';
import { LinkCreationForm } from '@/components/LinkCreationForm';
import { LinkList } from '@/components/LinkList';
import { StatsOverview } from '@/components/StatsOverview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HomePage() {
  const [links, setLinks] = useState<TrackingLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalClicks, setTotalClicks] = useState(0);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      const data = await response.json();
      if (data.success) {
        setLinks(data.links);
        setTotalClicks(data.links.reduce((sum: number, link: TrackingLink) => sum + link.clickCount, 0));
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkCreated = (newLink: TrackingLink) => {
    setLinks(prev => [newLink, ...prev]);
  };

  const handleLinkDeleted = (linkId: string) => {
    setLinks(prev => prev.filter(link => link.id !== linkId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Track Your Links with Precision
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Create tracking links and get detailed analytics about your visitors' locations, 
          devices, and behavior patterns.
        </p>
      </div>

      {/* Stats Overview */}
      <StatsOverview totalLinks={links.length} totalClicks={totalClicks} />

      {/* Main Content */}
      <Tabs defaultValue="create" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Link</TabsTrigger>
          <TabsTrigger value="manage">Manage Links</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Tracking Link</CardTitle>
              <CardDescription>
                Enter the URL you want to track and get detailed analytics about your visitors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LinkCreationForm onLinkCreated={handleLinkCreated} />
            </CardContent>
          </Card>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-xl">🌍</span>
                </div>
                <CardTitle className="text-lg">Location Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Get detailed geographic information about your visitors including country, 
                  region, and city data.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">📊</span>
                </div>
                <CardTitle className="text-lg">Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Monitor clicks in real-time with detailed breakdowns by device, 
                  browser, and referrer sources.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-xl">🔒</span>
                </div>
                <CardTitle className="text-lg">Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  We respect privacy and only collect necessary data for analytics. 
                  No personal information is stored.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Tracking Links</CardTitle>
              <CardDescription>
                Manage and view analytics for all your tracking links.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LinkList 
                links={links} 
                onLinkDeleted={handleLinkDeleted}
                onRefresh={fetchLinks}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}