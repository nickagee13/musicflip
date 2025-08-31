import { useState } from 'react'
import './App.css'

// Import streaming service logos
import spotifyLogo from './assets/streaming-services-logos/spotify-logo.png'
import appleMusicLogo from './assets/streaming-services-logos/apple-music-logo.png'
import youtubeMusicLogo from './assets/streaming-services-logos/youtube-music-logo.png'
import amazonMusicLogo from './assets/streaming-services-logos/amazon-music-logo.png'
import tidalLogo from './assets/streaming-services-logos/tidal-logo.png'
import deezerLogo from './assets/streaming-services-logos/deezer-logo.png'

// Dummy data for demonstration
const dummyConversion = {
  originalPlatform: 'Spotify',
  songTitle: 'Anti-Hero',
  artist: 'Taylor Swift',
  album: 'Midnights',
  albumArt: 'https://via.placeholder.com/200x200/1DB954/ffffff?text=🎵',
  platformLinks: {
    spotify: 'https://open.spotify.com/track/4Dvkj6JhhA12EX05fT7y2e',
    apple: 'https://music.apple.com/us/album/anti-hero/1640825011?i=1640825042',
    youtube: 'https://music.youtube.com/watch?v=b1kbLWvqugk',
    amazonMusic: 'https://music.amazon.com/albums/B0BDHBDL8V?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_zNIz3B4oHcaoz6hM2oOvwjlLt',
    tidal: 'https://listen.tidal.com/album/248197965/track/248197966',
    deezer: 'https://www.deezer.com/track/1509250742'
  }
}

// Platform configuration with logos
const platforms = [
  { id: 'spotify', name: 'Spotify', logo: spotifyLogo, color: '#1DB954' },
  { id: 'apple', name: 'Apple Music', logo: appleMusicLogo, color: '#FA243C' },
  { id: 'youtube', name: 'YouTube Music', logo: youtubeMusicLogo, color: '#FF0000' },
  { id: 'amazonMusic', name: 'Amazon Music', logo: amazonMusicLogo, color: '#FF6B35' },
  { id: 'tidal', name: 'Tidal', logo: tidalLogo, color: '#00FFFF' },
  { id: 'deezer', name: 'Deezer', logo: deezerLogo, color: '#FEAA2D' }
]

type DetectedPlatform = {
  name: string;
  icon: string;
  logo: string;
  color: string;
  bgColor: string;
} | null;

function App() {
  const [inputLink, setInputLink] = useState('')
  const [isConverted, setIsConverted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [detectedPlatform, setDetectedPlatform] = useState<DetectedPlatform>(null)
  const [inputFocused, setInputFocused] = useState(false)
  const [isValidUrl, setIsValidUrl] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputLink.trim()) return
    
    setIsLoading(true)
    setIsTransitioning(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => {
        setIsConverted(true)
        setIsTransitioning(false)
      }, 300) // Small delay for smooth transition
    }, 1500)
  }

  const handleReset = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setInputLink('')
      setIsConverted(false)
      setIsLoading(false)
      setCopiedPlatform(null)
      setIsTransitioning(false)
    }, 300)
  }

  const detectPlatform = (url: string): DetectedPlatform => {
    if (!url) return null;
    
    if (url.includes('spotify.com')) {
      return { name: 'Spotify', icon: '🎵', logo: spotifyLogo, color: '#1DB954', bgColor: '#f0fff4' };
    } else if (url.includes('music.apple.com') || url.includes('itunes.apple.com')) {
      return { name: 'Apple Music', icon: '🍎', logo: appleMusicLogo, color: '#FC3C44', bgColor: '#fff5f5' };
    } else if (url.includes('music.youtube.com') || url.includes('youtube.com')) {
      return { name: 'YouTube Music', icon: '📺', logo: youtubeMusicLogo, color: '#FF0000', bgColor: '#fff5f5' };
    } else if (url.includes('music.amazon.com') || url.includes('amazon.com')) {
      return { name: 'Amazon Music', icon: '📦', logo: amazonMusicLogo, color: '#FF9900', bgColor: '#fffbf0' };
    } else if (url.includes('tidal.com') || url.includes('listen.tidal.com')) {
      return { name: 'Tidal', icon: '🌊', logo: tidalLogo, color: '#00D4AA', bgColor: '#f0fffe' };
    } else if (url.includes('deezer.com')) {
      return { name: 'Deezer', icon: '🎶', logo: deezerLogo, color: '#FEAA2D', bgColor: '#fffcf5' };
    }
    return null;
  };

  const copyPlatformLink = (platform: string, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedPlatform(platform)
    // Reset the copied state after 2 seconds
    setTimeout(() => setCopiedPlatform(null), 2000)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">🎵 MusicFlip</h1>
          <p className="tagline">Share music across all platforms</p>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="screen-container">
            <section className={`input-section ${isConverted ? 'hidden' : 'visible'} ${isTransitioning ? 'transitioning' : ''}`}>
              <div className="hero">
                <h2>Paste any music link</h2>
                <p>Convert Spotify, Apple Music, YouTube links into universal ones that work for everyone</p>
              </div>

              <form onSubmit={handleSubmit} className="link-form">
                <div className="input-group">
                  <input
                    type="url"
                    placeholder="https://open.spotify.com/track/..."
                    value={inputLink}
                    onChange={(e) => {
                      const value = e.target.value;
                      setInputLink(value);
                      setDetectedPlatform(detectPlatform(value));
                      
                      // Simple URL validation
                      const urlPattern = /^https?:\/\/.+/;
                      setIsValidUrl(!value || urlPattern.test(value));
                    }}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    className={`link-input ${inputFocused ? 'focused' : ''} ${!isValidUrl ? 'invalid' : ''} ${detectedPlatform ? 'platform-detected-input' : ''}`}
                    style={{
                      '--platform-color': detectedPlatform?.color || '#667eea'
                    } as React.CSSProperties}
                    disabled={isLoading}
                  />
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isLoading || !inputLink.trim()}
                  >
                    {isLoading ? 'Converting...' : 'Convert'}
                  </button>
                </div>
                
                {detectedPlatform && (
                  <div className="platform-detected">
                    <div 
                      className="platform-badge animated"
                      style={{ 
                        background: detectedPlatform.color,
                        color: 'white'
                      }}
                    >
                      <img 
                        src={detectedPlatform.logo} 
                        alt={`${detectedPlatform.name} logo`}
                        className="platform-logo-small"
                      />
                      <span className="platform-text">{detectedPlatform.name} detected</span>
                    </div>
                  </div>
                )}
              </form>

              {isLoading && (
                <div className="loading">
                  <div className="enhanced-loader">
                    <div className="music-waves">
                      <div className="wave wave-1"></div>
                      <div className="wave wave-2"></div>
                      <div className="wave wave-3"></div>
                      <div className="wave wave-4"></div>
                      <div className="wave wave-5"></div>
                    </div>
                    <div className="searching-platforms">
                      <div className="platform-dot spotify-dot">
                        <img src={spotifyLogo} alt="Spotify" className="platform-dot-logo" />
                      </div>
                      <div className="platform-dot apple-dot">
                        <img src={appleMusicLogo} alt="Apple Music" className="platform-dot-logo" />
                      </div>
                      <div className="platform-dot youtube-dot">
                        <img src={youtubeMusicLogo} alt="YouTube Music" className="platform-dot-logo" />
                      </div>
                      <div className="platform-dot amazon-dot">
                        <img src={amazonMusicLogo} alt="Amazon Music" className="platform-dot-logo" />
                      </div>
                      <div className="platform-dot tidal-dot">
                        <img src={tidalLogo} alt="Tidal" className="platform-dot-logo" />
                      </div>
                      <div className="platform-dot deezer-dot">
                        <img src={deezerLogo} alt="Deezer" className="platform-dot-logo" />
                      </div>
                    </div>
                  </div>
                  <p className="loading-text">Finding your song across platforms...</p>
                  <div className="loading-progress">
                    <div className="progress-bar"></div>
                  </div>
                </div>
              )}
            </section>

            <section className={`result-section ${isConverted ? 'visible' : 'hidden'} ${isTransitioning ? 'transitioning' : ''}`}>
              <div className="conversion-result">
                <div className="track-info">
                  <img 
                    src={dummyConversion.albumArt} 
                    alt="Album art" 
                    className={`album-art ${isLoading ? 'loading' : ''}`}
                  />
                  <div className="track-details">
                    <h3 className="track-title">{dummyConversion.songTitle}</h3>
                    <p className="track-artist">{dummyConversion.artist}</p>
                    <p className="track-album">from {dummyConversion.album}</p>
                  </div>
                </div>

                <div className="platform-selection">
                  <p className="instruction-text">
                    Click any platform icon to copy its link to your clipboard:
                  </p>
                  
                  <div className="platform-icons">
                    {platforms.map((platform) => {
                      const linkKey = platform.id as keyof typeof dummyConversion.platformLinks;
                      const link = dummyConversion.platformLinks[linkKey];
                      const isCopied = copiedPlatform === platform.id;
                      
                      return (
                        <button
                          key={platform.id}
                          onClick={() => copyPlatformLink(platform.id, link)}
                          className={`platform-icon ${platform.id} ${isCopied ? 'copied' : ''}`}
                          title={`Copy ${platform.name} link`}
                        >
                          <div className="icon">
                            <img 
                              src={platform.logo} 
                              alt={`${platform.name} logo`} 
                              className="platform-logo"
                            />
                          </div>
                          <span className="platform-name">{platform.name}</span>
                          {isCopied && <span className="copied-indicator">Copied!</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button onClick={handleReset} className="reset-btn">
                  Convert Another Song
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 MusicFlip. Share music, not frustration.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
