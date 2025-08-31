import { useState, useEffect } from 'react'
import { Settings, X, Moon, Sun, Music, Apple, Play, Package, Waves, Music2, Music3 } from 'lucide-react'
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
  type: 'song', // 'song' or 'album'
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
  { id: 'amazonMusic', name: 'Amazon Music', logo: amazonMusicLogo, color: '#FF9900' },
  { id: 'tidal', name: 'Tidal', logo: tidalLogo, color: '#00D4AA' },
  { id: 'deezer', name: 'Deezer', logo: deezerLogo, color: '#FEAA2D' }
]

type DetectedPlatform = {
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  logo: string;
  color: string;
  bgColor: string;
} | null;

function App() {
  const [inputLink, setInputLink] = useState('')
  const [isConverted, setIsConverted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null)
  const [detectedPlatform, setDetectedPlatform] = useState<DetectedPlatform>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [autoDetect, setAutoDetect] = useState(true)
  const [showNotifications, setShowNotifications] = useState(true)
  const [openLinksInNewTab, setOpenLinksInNewTab] = useState(true)
  const [autoClearInput, setAutoClearInput] = useState(false)
  const [showPlatformIcons, setShowPlatformIcons] = useState(true)
  const [originalPlatform, setOriginalPlatform] = useState<DetectedPlatform>(null)

  // Initialize theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsOpen && !(event.target as Element).closest('.settings-container')) {
        setSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [settingsOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputLink.trim()) return
    
    setIsLoading(true)
    // Store the detected platform for the result section
    setOriginalPlatform(detectedPlatform)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsConverted(true)
      if (autoClearInput) {
        setInputLink('')
        setDetectedPlatform(null)
      }
    }, 2000)
  }

  const handleReset = () => {
    setInputLink('')
    setIsConverted(false)
    setIsLoading(false)
    setCopiedPlatform(null)
    setDetectedPlatform(null)
    setOriginalPlatform(null)
  }

  const handleClear = () => {
    setInputLink('')
    setDetectedPlatform(null)
  }

  const detectPlatform = (url: string): DetectedPlatform => {
    if (!url) return null;
    
    if (url.includes('spotify.com')) {
      return { name: 'Spotify', icon: Music, logo: spotifyLogo, color: '#1DB954', bgColor: '#f0fff4' };
    } else if (url.includes('music.apple.com') || url.includes('itunes.apple.com')) {
      return { name: 'Apple Music', icon: Apple, logo: appleMusicLogo, color: '#FC3C44', bgColor: '#fff5f5' };
    } else if (url.includes('music.youtube.com') || url.includes('youtube.com')) {
      return { name: 'YouTube Music', icon: Play, logo: youtubeMusicLogo, color: '#FF0000', bgColor: '#fff5f5' };
    } else if (url.includes('music.amazon.com') || url.includes('amazon.com')) {
      return { name: 'Amazon Music', icon: Package, logo: amazonMusicLogo, color: '#FF9900', bgColor: '#fffbf0' };
    } else if (url.includes('tidal.com') || url.includes('listen.tidal.com')) {
      return { name: 'Tidal', icon: Waves, logo: tidalLogo, color: '#00D4AA', bgColor: '#f0fffe' };
    } else if (url.includes('deezer.com')) {
      return { name: 'Deezer', icon: Music2, logo: deezerLogo, color: '#FEAA2D', bgColor: '#fffcf5' };
    }
    return null;
  };

  const copyPlatformLink = (platform: string, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedPlatform(platform)
    // Reset the copied state after 2.5 seconds
    setTimeout(() => setCopiedPlatform(null), 2500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputLink(value);
    setDetectedPlatform(detectPlatform(value));
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputLink.trim()) {
      e.preventDefault()
      const formEvent = {
        preventDefault: () => {}
      } as React.FormEvent<HTMLFormElement>;
      handleSubmit(formEvent)
    }
  }

  return (
    <div>
      {/* Settings Menu */}
      <div className="settings-container">
        <button 
          className={`settings-button ${settingsOpen ? 'open' : ''}`}
          onClick={() => setSettingsOpen(!settingsOpen)}
          title="Settings"
        >
          <div className="settings-icon">
            <Settings size={20} />
          </div>
        </button>
        
        <div className={`settings-dropdown ${settingsOpen ? 'open' : ''}`}>
          {/* Theme Selection */}
          <div className="settings-section">
            <label className="settings-label">Theme</label>
            <div className="settings-group">
              <button 
                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                <Moon size={16} />
                <span>Dark</span>
              </button>
              <button 
                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                <Sun size={16} />
                <span>Light</span>
              </button>
            </div>
          </div>
          
          {/* Auto-detect Platform */}
          <div className="settings-section">
            <div className="settings-toggle">
              <span className="settings-toggle-label">Auto-detect Platform</span>
              <div 
                className={`toggle-switch ${autoDetect ? 'active' : ''}`}
                onClick={() => setAutoDetect(!autoDetect)}
              />
            </div>
          </div>
          
          {/* Show Copy Notifications */}
          <div className="settings-section">
            <div className="settings-toggle">
              <span className="settings-toggle-label">Copy Notifications</span>
              <div 
                className={`toggle-switch ${showNotifications ? 'active' : ''}`}
                onClick={() => setShowNotifications(!showNotifications)}
              />
            </div>
          </div>
          
          {/* Open Links in New Tab */}
          <div className="settings-section">
            <div className="settings-toggle">
              <span className="settings-toggle-label">Open Links in New Tab</span>
              <div 
                className={`toggle-switch ${openLinksInNewTab ? 'active' : ''}`}
                onClick={() => setOpenLinksInNewTab(!openLinksInNewTab)}
              />
            </div>
          </div>
          
          {/* Auto Clear Input */}
          <div className="settings-section">
            <div className="settings-toggle">
              <span className="settings-toggle-label">Auto-clear Input After Convert</span>
              <div 
                className={`toggle-switch ${autoClearInput ? 'active' : ''}`}
                onClick={() => setAutoClearInput(!autoClearInput)}
              />
            </div>
          </div>
          
          {/* Show Platform Icons */}
          <div className="settings-section">
            <div className="settings-toggle">
              <span className="settings-toggle-label">Show Platform Logos</span>
              <div 
                className={`toggle-switch ${showPlatformIcons ? 'active' : ''}`}
                onClick={() => setShowPlatformIcons(!showPlatformIcons)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <span className="logo-icon">
              <Music size={24} />
            </span>
            MusicFlip
          </h1>
          <p className="tagline">Share music across all platforms</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <div className={`card ${originalPlatform ? `platform-${originalPlatform.name.toLowerCase().replace(/\s+/g, '')}` : ''}`}>
          {originalPlatform && (
            <style>{`
              .card.platform-${originalPlatform.name.toLowerCase().replace(/\s+/g, '')}::before {
                background: linear-gradient(90deg, ${originalPlatform.color}, ${originalPlatform.color}) !important;
              }
            `}</style>
          )}
          {/* Input Section */}
          {!isLoading && !isConverted && (
            <div className="input-section">
              <h2 className="section-title">Paste any music link</h2>
              <p className="section-description">
                Convert Spotify, Apple Music, YouTube links into universal ones that work for everyone
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                  <input 
                    type="url" 
                    className={`link-input ${inputLink ? 'has-content' : ''}`}
                    placeholder="https://open.spotify.com/track/..."
                    value={inputLink}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    autoComplete="off"
                  />
                  <button 
                    type="button" 
                    className="clear-btn" 
                    onClick={handleClear}
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <button 
                  type="submit" 
                  className="convert-btn" 
                  disabled={!inputLink.trim()}
                >
                  Convert
                </button>
              </form>
              
              {detectedPlatform && autoDetect && (
                <div className="platform-detected">
                  <div className={`platform-badge ${detectedPlatform.name.toLowerCase().replace(/\s+/g, '')}`}>
                    {showPlatformIcons ? (
                      <img 
                        src={detectedPlatform.logo} 
                        alt={`${detectedPlatform.name} logo`}
                        style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                      />
                    ) : (
                      <detectedPlatform.icon size={16} />
                    )}
                    <span>{detectedPlatform.name} detected</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading Section */}
          {isLoading && (
            <div className="loading-container active">
              <div className="music-bars">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
              <p className="loading-text">Finding your music across platforms...</p>
            </div>
          )}

          {/* Result Section */}
          {isConverted && !isLoading && (
            <div className="result-section active">
              <div className="track-preview">
                <div className="album-art">
                  {dummyConversion.albumArt.includes('placeholder') ? (
                    <Music3 size={36} />
                  ) : (
                    <img 
                      src={dummyConversion.albumArt} 
                      alt="Album art"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                    />
                  )}
                </div>
                <div className="track-info">
                  {dummyConversion.type === 'song' && (
                    <div className="track-title">{dummyConversion.songTitle}</div>
                  )}
                  <div className="track-artist">{dummyConversion.artist}</div>
                  <div className="track-album">{dummyConversion.album}</div>
                </div>
              </div>

              <p className="section-description">
                Click any platform to copy its link to your clipboard
              </p>

              <div className="platforms-grid">
                {platforms.map((platform) => {
                  const linkKey = platform.id as keyof typeof dummyConversion.platformLinks;
                  const link = dummyConversion.platformLinks[linkKey];
                  const isCopied = copiedPlatform === platform.id;
                  
                  return (
                    <button
                      key={platform.id}
                      onClick={() => copyPlatformLink(platform.id, link)}
                      className={`platform-btn ${platform.id} ${isCopied ? 'copied' : ''}`}
                      title={`Copy ${platform.name} link`}
                    >
                      <div className="platform-icon">
                        {showPlatformIcons ? (
                          <img 
                            src={platform.logo} 
                            alt={`${platform.name} logo`} 
                            className="platform-logo"
                          />
                        ) : (
                          <div className="platform-icon-fallback">
                            {platform.id === 'spotify' && <Music size={40} />}
                            {platform.id === 'apple' && <Apple size={40} />}
                            {platform.id === 'youtube' && <Play size={40} />}
                            {platform.id === 'amazonMusic' && <Package size={40} />}
                            {platform.id === 'tidal' && <Waves size={40} />}
                            {platform.id === 'deezer' && <Music2 size={40} />}
                          </div>
                        )}
                      </div>
                      <span className="platform-name">{platform.name}</span>
                    </button>
                  );
                })}
              </div>

              <button onClick={handleReset} className="reset-btn">
                Convert Another Song
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 MusicFlip. Share music, not frustration.</p>
      </footer>
    </div>
  )
}

export default App