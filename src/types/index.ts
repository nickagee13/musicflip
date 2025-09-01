export interface ConversionResult {
  track: {
    title: string;
    artist: string;
    artwork_url?: string;
  };
  platformLinks: { [platform: string]: string };
  originalPlatform: string;
  fromCache: boolean;
}

export interface Platform {
  id: string;
  name: string;
  logo: string;
  color: string;
}

export type DetectedPlatform = {
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  logo: string;
  color: string;
  bgColor: string;
} | null;

export interface ShareConversionData {
  title: string;
  artist: string;
  originalPlatform: string;
  platformLinks: { [platform: string]: string };
}