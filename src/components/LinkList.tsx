"use client";

import { useState } from 'react';
import { TrackingLink } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface LinkListProps {
  links: TrackingLink[];
  onLinkDeleted: (linkId: string) => void;
  onRefresh: () => void;
}

export function LinkList({ links, onLinkDeleted, onRefresh }: LinkListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleDelete = async (linkId: string) => {
    setDeletingId(linkId);
    
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        onLinkDeleted(linkId);
        toast.success('Link deleted successfully');
      } else {
        toast.error('Failed to delete link');
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link');
    } finally {
      setDeletingId(null);
    }
  };

  const getTrackingUrl = (shortCode: string) => {
    return `${window.location.origin}/track/${shortCode}`;
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-slate-400 text-2xl">🔗</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No tracking links yet</h3>
        <p className="text-slate-600 mb-6">Create your first tracking link to start collecting analytics.</p>
        <Button onClick={onRefresh} variant="outline">
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {links.length} Link{links.length !== 1 ? 's' : ''}
        </h3>
        <Button onClick={onRefresh} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {links.map((link) => (
          <Card key={link.id} className="transition-all hover:shadow-md">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {link.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mt-1">
                      {link.originalUrl}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Badge variant={link.isActive ? 'default' : 'secondary'}>
                      {link.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {link.clickCount > 0 && (
                      <Badge variant="outline">
                        {link.clickCount} clicks
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Tracking URL */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded text-xs font-mono break-all">
                      {getTrackingUrl(link.shortCode)}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(getTrackingUrl(link.shortCode))}
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Created:</span>
                    <p className="text-slate-900 font-medium">
                      {formatDate(link.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Clicks:</span>
                    <p className="text-slate-900 font-medium">
                      {link.clickCount}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Last Click:</span>
                    <p className="text-slate-900 font-medium">
                      {link.lastClicked ? formatDate(link.lastClicked) : 'Never'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Code:</span>
                    <p className="text-slate-900 font-medium font-mono">
                      {link.shortCode}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <a
                      href={`/analytics/${link.id}`}
                      className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      View Analytics
                    </a>
                    <a
                      href={getTrackingUrl(link.shortCode)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      Test Link
                    </a>
                  </div>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(link.id)}
                    disabled={deletingId === link.id}
                  >
                    {deletingId === link.id ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}