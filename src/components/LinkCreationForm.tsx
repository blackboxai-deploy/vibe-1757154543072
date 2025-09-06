"use client";

import { useState } from 'react';
import { TrackingLink } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface LinkCreationFormProps {
  onLinkCreated: (link: TrackingLink) => void;
}

export function LinkCreationForm({ onLinkCreated }: LinkCreationFormProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<TrackingLink | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalUrl) {
      toast.error('Please enter a valid URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(originalUrl);
    } catch {
      toast.error('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl,
          title: title || undefined,
        }),
      });

      const data = await response.json();

      if (data.success && data.link) {
        setCreatedLink(data.link);
        onLinkCreated(data.link);
        toast.success('Tracking link created successfully!');
        
        // Clear form
        setOriginalUrl('');
        setTitle('');
      } else {
        toast.error(data.error || 'Failed to create tracking link');
      }
    } catch (error) {
      console.error('Error creating link:', error);
      toast.error('Failed to create tracking link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const getTrackingUrl = (shortCode: string) => {
    return `${window.location.origin}/track/${shortCode}`;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="originalUrl">Target URL *</Label>
          <Input
            id="originalUrl"
            type="url"
            placeholder="https://example.com"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
            className="w-full"
          />
          <p className="text-sm text-slate-500">
            The URL you want to track. Make sure to include http:// or https://
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title (optional)</Label>
          <Input
            id="title"
            type="text"
            placeholder="My Campaign Link"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
          <p className="text-sm text-slate-500">
            A custom title to help you identify this link
          </p>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating Link...</span>
            </div>
          ) : (
            'Create Tracking Link'
          )}
        </Button>
      </form>

      {createdLink && (
        <Card className="bg-green-50 border-green-200 animate-slide-up">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-green-800">Link Created Successfully!</h3>
                <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  New
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-green-700">Tracking URL:</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 p-2 bg-white border border-green-200 rounded text-sm font-mono break-all">
                      {getTrackingUrl(createdLink.shortCode)}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(getTrackingUrl(createdLink.shortCode))}
                      className="border-green-300 text-green-700 hover:bg-green-100"
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-green-700">Original URL:</Label>
                    <p className="text-green-600 truncate">{createdLink.originalUrl}</p>
                  </div>
                  <div>
                    <Label className="text-green-700">Short Code:</Label>
                    <p className="text-green-600 font-mono">{createdLink.shortCode}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-green-200">
                  <p className="text-xs text-green-600">
                    Share this tracking link to start collecting analytics data. 
                    View detailed statistics in the "Manage Links" tab.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}