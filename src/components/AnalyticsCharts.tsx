"use client";

import { LinkStats } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface AnalyticsChartsProps {
  stats: LinkStats;
}

export function AnalyticsCharts({ stats }: AnalyticsChartsProps) {
  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  // Prepare data for device breakdown pie chart
  const deviceData = [
    { name: 'Desktop', value: stats.deviceBreakdown.desktop, color: COLORS[0] },
    { name: 'Mobile', value: stats.deviceBreakdown.mobile, color: COLORS[1] },
    { name: 'Tablet', value: stats.deviceBreakdown.tablet, color: COLORS[2] },
  ].filter(item => item.value > 0);

  // Prepare data for countries (top 5)
  const countryData = Object.entries(stats.clicksByCountry)
    .map(([country, clicks]) => ({ country, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  const totalCountryClicks = countryData.reduce((sum, item) => sum + item.clicks, 0);

  return (
    <div className="space-y-8">
      {/* Clicks over time */}
      {stats.clicksByDate.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Clicks Over Time</CardTitle>
            <CardDescription>Daily click activity for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.clicksByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value) => [value, 'Clicks']}
                  />
                  <Line type="monotone" dataKey="clicks" stroke={COLORS[0]} strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        {deviceData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>Clicks by device type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Clicks']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2">
                  {deviceData.map((device, index) => (
                    <div key={device.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: device.color }}
                        />
                        <span>{device.name}</span>
                      </div>
                      <span className="font-medium">{device.value} clicks</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Countries */}
        {countryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
              <CardDescription>Clicks by visitor location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {countryData.map((item, index) => (
                  <div key={item.country} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">
                          {item.country === 'Unknown' ? 'Unknown Location' : item.country}
                        </span>
                      </div>
                      <span className="text-slate-600">
                        {item.clicks} clicks ({Math.round((item.clicks / totalCountryClicks) * 100)}%)
                      </span>
                    </div>
                    <Progress 
                      value={(item.clicks / stats.totalClicks) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top Referrers */}
      {stats.topReferrers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>Sources that drove traffic to your link</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topReferrers.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="referrer" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    formatter={(value) => value.length > 20 ? value.substring(0, 20) + '...' : value}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [value, 'Clicks']}
                    labelFormatter={(label) => `Source: ${label}`}
                  />
                  <Bar dataKey="clicks" fill={COLORS[1]} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalClicks > 0 ? Math.round((stats.uniqueClicks / stats.totalClicks) * 100) : 0}%
            </div>
            <p className="text-sm text-slate-600">Unique visitors ratio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Countries Reached</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Object.keys(stats.clicksByCountry).length}
            </div>
            <p className="text-sm text-slate-600">Geographic reach</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Referrer Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.topReferrers.length}
            </div>
            <p className="text-sm text-slate-600">Traffic sources</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}