import type { Platform } from '../types'

// Import streaming service logos
import spotifyLogo from '../assets/streaming-services-logos/spotify-logo.png'
import appleMusicLogo from '../assets/streaming-services-logos/apple-music-logo.png'
import youtubeMusicLogo from '../assets/streaming-services-logos/youtube-music-logo.png'
import amazonMusicLogo from '../assets/streaming-services-logos/amazon-music-logo.png'
import tidalLogo from '../assets/streaming-services-logos/tidal-logo.png'
import deezerLogo from '../assets/streaming-services-logos/deezer-logo.png'

export const platforms: Platform[] = [
  { id: 'spotify', name: 'Spotify', logo: spotifyLogo, color: '#1DB954' },
  { id: 'apple', name: 'Apple Music', logo: appleMusicLogo, color: '#FA243C' },
  { id: 'youtube', name: 'YouTube Music', logo: youtubeMusicLogo, color: '#FF0000' },
  { id: 'amazonMusic', name: 'Amazon Music', logo: amazonMusicLogo, color: '#1eadc5' },
  { id: 'tidal', name: 'Tidal', logo: tidalLogo, color: '#00D4AA' },
  { id: 'deezer', name: 'Deezer', logo: deezerLogo, color: '#A238FF' }
]