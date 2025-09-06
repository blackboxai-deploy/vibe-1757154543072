"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function TrackPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState('Redirecting...');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const shortCode = params.shortCode as string;
        
        if (!shortCode) {
          setError('Invalid tracking link');
          return;
        }

        // First, get the link info
        const linkResponse = await fetch(`/api/track/${shortCode}`, {
          method: 'GET',
        });

        if (!linkResponse.ok) {
          if (linkResponse.status === 404) {
            setError('This tracking link does not exist or has been deactivated.');
          } else {
            setError('Failed to process tracking link.');
          }
          return;
        }

        const linkData = await linkResponse.json();
        
        if (!linkData.success || !linkData.link) {
          setError('Invalid tracking link');
          return;
        }

        // Record the click asynchronously
        const referrer = document.referrer || undefined;
        fetch('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            linkId: linkData.link.id,
            referrer,
          }),
        }).catch(err => {
          console.error('Failed to record click:', err);
        });

        // Redirect to the original URL
        setStatus('Redirecting to destination...');
        window.location.href = linkData.link.originalUrl;

      } catch (error) {
        console.error('Error in redirect handler:', error);
        setError('An error occurred while processing the link.');
      }
    };

    handleRedirect();
  }, [params.shortCode, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-xl font-bold text-red-800 mb-2">Link Error</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">{status}</h1>
        <p className="text-slate-600 mb-6">
          Please wait while we process your request and redirect you to the destination.
        </p>
        
        <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
          <p className="font-medium mb-1">What's happening?</p>
          <ul className="text-left space-y-1">
            <li>• Recording visit analytics</li>
            <li>• Detecting your location</li>
            <li>• Preparing redirect</li>
          </ul>
        </div>

        <p className="text-xs text-slate-400 mt-4">
          If you're not redirected automatically, please check your browser settings.
        </p>
      </div>
    </div>
  );
}