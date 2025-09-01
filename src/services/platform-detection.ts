import type { DetectedPlatform } from '../types'
import { detectPlatformFromUrl, getPlatformColor } from '../services/api/songlink-api'
import { Music, Apple, Play, Package, Waves, Music2 } from 'lucide-react'

// Import streaming service logos
import spotifyLogo from '../assets/streaming-services-logos/spotify-logo.png'
import appleMusicLogo from '../assets/streaming-services-logos/apple-music-logo.png'
import youtubeMusicLogo from '../assets/streaming-services-logos/youtube-music-logo.png'
import amazonMusicLogo from '../assets/streaming-services-logos/amazon-music-logo.png'
import tidalLogo from '../assets/streaming-services-logos/tidal-logo.png'
import deezerLogo from '../assets/streaming-services-logos/deezer-logo.png'

export function detectPlatform(url: string): DetectedPlatform {
  if (!url) return null;
  
  const platform = detectPlatformFromUrl(url);
  const color = getPlatformColor(platform);
  
  if (platform === 'spotify') {
    return { name: 'Spotify', icon: Music, logo: spotifyLogo, color, bgColor: '#f0fff4' };
  } else if (platform === 'apple') {
    return { name: 'Apple Music', icon: Apple, logo: appleMusicLogo, color, bgColor: '#fff5f5' };
  } else if (platform === 'youtube') {
    return { name: 'YouTube Music', icon: Play, logo: youtubeMusicLogo, color, bgColor: '#fff5f5' };
  } else if (platform === 'amazonMusic') {
    return { name: 'Amazon Music', icon: Package, logo: amazonMusicLogo, color, bgColor: '#fffbf0' };
  } else if (platform === 'tidal') {
    return { name: 'Tidal', icon: Waves, logo: tidalLogo, color, bgColor: '#f0fffe' };
  } else if (platform === 'deezer') {
    return { name: 'Deezer', icon: Music2, logo: deezerLogo, color, bgColor: '#fffcf5' };
  }
  return null;
}