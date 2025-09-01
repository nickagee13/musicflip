// Songlink/Odesli API integration for cross-platform music link conversion
// API Documentation: https://www.notion.so/API-d0ebe08a5e304a55928405eb682f6741

interface SonglinkResponse {
  entityUniqueId: string;
  userCountry: string;
  pageUrl: string;
  entitiesByUniqueId: {
    [key: string]: {
      id: string;
      type: 'song' | 'album';
      title?: string;
      artistName?: string;
      thumbnailUrl?: string;
      thumbnailWidth?: number;
      thumbnailHeight?: number;
      apiProvider: string;
      platforms: string[];
    };
  };
  linksByPlatform: {
    [platform: string]: {
      url: string;
      nativeAppUriMobile?: string;
      nativeAppUriDesktop?: string;
      entityUniqueId: string;
    };
  };
}

interface ConversionResult {
  success: boolean;
  data?: {
    originalPlatform: string;
    type: 'song' | 'album';
    title: string;
    artist: string;
    albumArt?: string;
    platformLinks: {
      [platform: string]: string;
    };
  };
  error?: string;
}

// Use proxy in production, direct API in development
const SONGLINK_API_BASE = import.meta.env.DEV 
  ? 'https://api.song.link/v1-alpha.1/links'
  : '/api/songlink';

// Platform mapping for consistent naming
const PLATFORM_MAPPING: { [key: string]: string } = {
  'spotify': 'spotify',
  'appleMusic': 'apple',
  'youtubeMusic': 'youtube',
  'youtube': 'youtube',
  'amazonMusic': 'amazonMusic',
  'tidal': 'tidal',
  'deezer': 'deezer',
  'soundcloud': 'soundcloud',
  'pandora': 'pandora',
  'napster': 'napster',
};

// Detect platform from URL
export function detectPlatformFromUrl(url: string): string {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('spotify.com')) return 'spotify';
  if (lowerUrl.includes('music.apple.com') || lowerUrl.includes('itunes.apple.com')) return 'apple';
  if (lowerUrl.includes('music.youtube.com')) return 'youtube';
  if (lowerUrl.includes('youtube.com')) return 'youtube';
  if (lowerUrl.includes('music.amazon.com')) return 'amazonMusic';
  if (lowerUrl.includes('tidal.com') || lowerUrl.includes('listen.tidal.com')) return 'tidal';
  if (lowerUrl.includes('deezer.com')) return 'deezer';
  if (lowerUrl.includes('soundcloud.com')) return 'soundcloud';
  
  return 'unknown';
}

// Convert music link using Songlink API
export async function convertMusicLink(originalUrl: string): Promise<ConversionResult> {
  try {
    // Validate URL
    if (!originalUrl || !originalUrl.trim()) {
      return { success: false, error: 'Please provide a valid music link' };
    }

    const originalPlatform = detectPlatformFromUrl(originalUrl);
    if (originalPlatform === 'unknown') {
      return { success: false, error: 'Unsupported music platform' };
    }

    // Call Songlink API
    const apiUrl = `${SONGLINK_API_BASE}?url=${encodeURIComponent(originalUrl)}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'MusicFlip/1.0',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'Music not found on other platforms' };
      }
      if (response.status === 429) {
        return { success: false, error: 'Too many requests. Please try again in a moment.' };
      }
      return { success: false, error: 'Unable to convert link. Please try again.' };
    }

    const data: SonglinkResponse = await response.json();

    // Extract track information
    const entityId = data.entityUniqueId;
    const entity = data.entitiesByUniqueId[entityId];

    if (!entity) {
      return { success: false, error: 'Unable to parse music information' };
    }

    // Build platform links
    const platformLinks: { [platform: string]: string } = {};
    
    // Map Songlink platform names to our platform names
    Object.entries(data.linksByPlatform).forEach(([platform, link]) => {
      const mappedPlatform = PLATFORM_MAPPING[platform];
      if (mappedPlatform) {
        platformLinks[mappedPlatform] = link.url;
      }
    });

    return {
      success: true,
      data: {
        originalPlatform,
        type: entity.type,
        title: entity.title || 'Unknown Title',
        artist: entity.artistName || 'Unknown Artist',
        albumArt: entity.thumbnailUrl,
        platformLinks,
      },
    };
  } catch (error) {
    console.error('Songlink API Error:', error);
    return { 
      success: false, 
      error: 'Network error. Please check your connection and try again.' 
    };
  }
}

// Check if URL is a supported music link
export function isSupportedMusicUrl(url: string): boolean {
  const supportedDomains = [
    'spotify.com',
    'music.apple.com',
    'itunes.apple.com',
    'music.youtube.com',
    'youtube.com',
    'music.amazon.com',
    'tidal.com',
    'listen.tidal.com',
    'deezer.com',
    'soundcloud.com',
  ];

  return supportedDomains.some(domain => url.toLowerCase().includes(domain));
}

// Get platform display name
export function getPlatformDisplayName(platform: string): string {
  const displayNames: { [key: string]: string } = {
    'spotify': 'Spotify',
    'apple': 'Apple Music',
    'youtube': 'YouTube Music',
    'amazonMusic': 'Amazon Music',
    'tidal': 'Tidal',
    'deezer': 'Deezer',
    'soundcloud': 'SoundCloud',
    'pandora': 'Pandora',
    'napster': 'Napster',
  };

  return displayNames[platform] || platform;
}

// Get platform color for UI
export function getPlatformColor(platform: string): string {
  const colors: { [key: string]: string } = {
    'spotify': '#1DB954',
    'apple': '#FA243C',
    'youtube': '#FF0000',
    'amazonMusic': '#FF9900',
    'tidal': '#00D4AA',
    'deezer': '#FEAA2D',
    'soundcloud': '#FF5722',
    'pandora': '#005483',
    'napster': '#00A0B0',
  };

  return colors[platform] || '#666666';
}