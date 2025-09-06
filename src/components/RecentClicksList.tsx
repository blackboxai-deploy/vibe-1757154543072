"use client";

import { ClickRecord } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface RecentClicksListProps {
  clicks: ClickRecord[];
}

export function RecentClicksList({ clicks }: RecentClicksListProps) {
  const formatDate = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const getCountryFlag = (country?: string) => {
    if (!country || country === 'Unknown') return '🌍';
    
    // Simple country to flag mapping (you could expand this)
    const flagMap: { [key: string]: string } = {
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Japan': '🇯🇵',
      'Australia': '🇦🇺',
      'India': '🇮🇳',
      'Brazil': '🇧🇷',
      'China': '🇨🇳',
      'Russia': '🇷🇺',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Netherlands': '🇳🇱',
      'South Korea': '🇰🇷',
    };
    
    return flagMap[country] || '🌍';
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return '📱';
      case 'tablet': return '📱';
      case 'desktop': return '💻';
      default: return '🖥️';
    }
  };

  if (clicks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Clicks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-slate-400 text-2xl">👆</span>
            </div>
            <p className="text-slate-600">No clicks recorded yet</p>
            <p className="text-sm text-slate-500 mt-1">Share your tracking link to start collecting data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Clicks</CardTitle>
        <p className="text-sm text-slate-600">Latest {clicks.length} visitor interactions</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clicks.map((click, index) => (
            <div 
              key={click.id} 
              className={`p-4 rounded-lg border ${index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCountryFlag(click.country)}</span>
                      <div className="text-sm">
                        <span className="font-medium text-slate-900">
                          {click.city ? `${click.city}, ${click.country}` : click.country || 'Unknown Location'}
                        </span>
                      </div>
                    </div>
                    
                    {index === 0 && (
                      <Badge variant="default" className="text-xs">
                        Latest
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-600">
                    <div className="flex items-center space-x-1">
                      <span>{getDeviceIcon(click.device.device)}</span>
                      <span>{click.device.device}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span>🌐</span>
                      <span>{click.device.browser}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span>💻</span>
                      <span>{click.device.os}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span>🔗</span>
                      <span className="truncate">
                        {click.referrer ? (
                          click.referrer.length > 20 ? 
                            click.referrer.substring(0, 20) + '...' : 
                            click.referrer
                        ) : 'Direct'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <span className="text-xs text-slate-500 font-mono">
                      {click.ipAddress}
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-500 ml-4">
                  <div>{formatDate(click.timestamp)}</div>
                  <div className="mt-1 text-slate-400">
                    {new Date(click.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {/* Additional details for the first (latest) click */}
              {index === 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <div className="text-xs text-blue-700 space-y-1">
                    {click.latitude && click.longitude && (
                      <div>
                        📍 Coordinates: {click.latitude.toFixed(4)}, {click.longitude.toFixed(4)}
                      </div>
                    )}
                    <div className="font-mono break-all">
                      User Agent: {click.userAgent.substring(0, 100)}...
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {clicks.length >= 10 && (
          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-sm text-slate-500">
              Showing the 10 most recent clicks. Export data for complete history.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}