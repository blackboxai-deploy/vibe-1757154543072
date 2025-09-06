// Mock database implementation for link tracking system
import { TrackingLink, ClickRecord, DeviceInfo, LocationData } from '@/types';

// In-memory storage (in production, use a real database)
let links: TrackingLink[] = [];
let clicks: ClickRecord[] = [];

// Utility functions
export const generateShortCode = (): string => {
  return Math.random().toString(36).substring(2, 8);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Link operations
export const createLink = (originalUrl: string, title?: string): TrackingLink => {
  if (!isValidUrl(originalUrl)) {
    throw new Error('Invalid URL provided');
  }

  const link: TrackingLink = {
    id: Math.random().toString(36).substring(2, 15),
    originalUrl,
    shortCode: generateShortCode(),
    title: title || new URL(originalUrl).hostname,
    createdAt: new Date(),
    isActive: true,
    clickCount: 0,
    lastClicked: undefined,
  };

  links.push(link);
  return link;
};

export const getLinkByShortCode = (shortCode: string): TrackingLink | null => {
  return links.find(link => link.shortCode === shortCode && link.isActive) || null;
};

export const getLinkById = (id: string): TrackingLink | null => {
  return links.find(link => link.id === id) || null;
};

export const getAllLinks = (): TrackingLink[] => {
  return [...links].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const updateLinkClickCount = (linkId: string): void => {
  const linkIndex = links.findIndex(link => link.id === linkId);
  if (linkIndex !== -1) {
    links[linkIndex].clickCount++;
    links[linkIndex].lastClicked = new Date();
  }
};

export const deleteLink = (id: string): boolean => {
  const linkIndex = links.findIndex(link => link.id === id);
  if (linkIndex !== -1) {
    links[linkIndex].isActive = false;
    return true;
  }
  return false;
};

// Click operations
export const recordClick = async (
  linkId: string,
  ipAddress: string,
  userAgent: string,
  referrer?: string
): Promise<ClickRecord> => {
  // Parse device info from user agent
  const device: DeviceInfo = parseUserAgent(userAgent);
  
  // Get location data (in a real app, this would call an external API)
  let locationData: Partial<LocationData> = {};
  
  try {
    // In production, you would call a real geolocation API
    locationData = await getLocationFromIP(ipAddress);
  } catch (error) {
    console.log('Failed to get location data:', error);
  }

  const click: ClickRecord = {
    id: Math.random().toString(36).substring(2, 15),
    linkId,
    timestamp: new Date(),
    ipAddress,
    country: locationData.country,
    city: locationData.city,
    region: locationData.regionName,
    latitude: locationData.lat,
    longitude: locationData.lon,
    userAgent,
    referrer,
    device,
  };

  clicks.push(click);
  updateLinkClickCount(linkId);
  
  return click;
};

export const getClicksForLink = (linkId: string): ClickRecord[] => {
  return clicks
    .filter(click => click.linkId === linkId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const getTotalClicks = (): number => {
  return clicks.length;
};

// Helper functions
const parseUserAgent = (userAgent: string): DeviceInfo => {
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
  const isTablet = /iPad|Tablet/.test(userAgent);
  
  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  
  let os = 'Unknown';
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';
  
  return {
    browser,
    os,
    device: isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop',
    isMobile: isMobile || isTablet,
  };
};

const getLocationFromIP = async (ipAddress: string): Promise<LocationData> => {
  // In production, you would use a real IP geolocation service
  // For demo purposes, we'll use ip-api.com
  try {
    const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    
    if (data.status === 'fail') {
      throw new Error(data.message || 'Failed to get location data');
    }
    
    return data as LocationData;
  } catch (error) {
    console.error('Error fetching location:', error);
    // Return default location data for localhost/development
    return {
      country: 'Unknown',
      countryCode: 'XX',
      region: 'XX',
      regionName: 'Unknown',
      city: 'Unknown',
      zip: '00000',
      lat: 0,
      lon: 0,
      timezone: 'UTC',
      isp: 'Unknown',
      org: 'Unknown',
      as: 'Unknown',
      query: ipAddress,
    };
  }
};