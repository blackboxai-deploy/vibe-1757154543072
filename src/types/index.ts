// Data types for the link tracking system

export interface TrackingLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  title?: string;
  createdAt: Date;
  isActive: boolean;
  clickCount: number;
  lastClicked?: Date;
}

export interface ClickRecord {
  id: string;
  linkId: string;
  timestamp: Date;
  ipAddress: string;
  country?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  userAgent: string;
  referrer?: string;
  device: DeviceInfo;
}

export interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
  isMobile: boolean;
}

export interface LocationData {
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string; // IP address
}

export interface LinkStats {
  link: TrackingLink;
  totalClicks: number;
  uniqueClicks: number;
  clicksByCountry: { [country: string]: number };
  clicksByDate: { date: string; clicks: number }[];
  topReferrers: { referrer: string; clicks: number }[];
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  recentClicks: ClickRecord[];
}

export interface CreateLinkRequest {
  originalUrl: string;
  title?: string;
}

export interface CreateLinkResponse {
  success: boolean;
  link?: TrackingLink;
  error?: string;
}