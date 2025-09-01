import { useState, useEffect } from 'react'
import { Settings, X, Moon, Sun, Music, Apple, Play, Package, Waves, Music2, Music3, Share } from 'lucide-react'
import './App.css'

// Import services
import { convertMusicLink, isSupportedMusicUrl, detectPlatformFromUrl, getPlatformColor } from './lib/songlink-api'
import { useShareTarget, useWebShare } from './hooks/useShareTarget'

// Import streaming service logos
import spotifyLogo from './assets/streaming-services-logos/spotify-logo.png'
import appleMusicLogo from './assets/streaming-services-logos/apple-music-logo.png'
import youtubeMusicLogo from './assets/streaming-services-logos/youtube-music-logo.png'
import amazonMusicLogo from './assets/streaming-services-logos/amazon-music-logo.png'
import tidalLogo from './assets/streaming-services-logos/tidal-logo.png'
import deezerLogo from './assets/streaming-services-logos/deezer-logo.png'

// Platform configuration with logos
const platforms = [
  { id: 'spotify', name: 'Spotify', logo: spotifyLogo, color: '#1DB954' },
  { id: 'apple', name: 'Apple Music', logo: appleMusicLogo, color: '#FA243C' },
  { id: 'youtube', name: 'YouTube Music', logo: youtubeMusicLogo, color: '#FF0000' },
  { id: 'amazonMusic', name: 'Amazon Music', logo: amazonMusicLogo, color: '#1eadc5' },
  { id: 'tidal', name: 'Tidal', logo: tidalLogo, color: '#00D4AA' },
  { id: 'deezer', name: 'Deezer', logo: deezerLogo, color: '#A238FF' }
]

type DetectedPlatform = {
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  logo: string;
  color: string;
  bgColor: string;
} | null;

interface ConversionResult {
  track: {
    title: string;
    artist: string;
    artwork_url?: string;
  };
  platformLinks: { [platform: string]: string };
  originalPlatform: string;
  fromCache: boolean;
}

function App() {
  const [inputLink, setInputLink] = useState('')
  const [isConverted, setIsConverted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null)
  const [detectedPlatform, setDetectedPlatform] = useState<DetectedPlatform>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [autoDetect, setAutoDetect] = useState(true)
  const [showNotifications, setShowNotifications] = useState(true)
  const [openLinksInNewTab, setOpenLinksInNewTab] = useState(true)
  const [autoClearInput, setAutoClearInput] = useState(false)
  const [showPlatformIcons, setShowPlatformIcons] = useState(true)
  
  // Share target integration
  const { sharedUrl, isFromShare, isSupported: isSharedUrlSupported, clearShareData } = useShareTarget()
  const { isShareSupported, shareConversion } = useWebShare()

  // Initialize theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Handle shared URLs from Web Share Target API
  useEffect(() => {
    if (sharedUrl) {
      if (isSharedUrlSupported) {
        setInputLink(sharedUrl)
        setDetectedPlatform(detectPlatform(sharedUrl))
        if (isFromShare) {
          // Show a notification that the link was received
          if (showNotifications) {
            console.log('Received shared music link:', sharedUrl)
          }
        }
      } else {
        setError('This link is not from a supported music platform')
      }
      clearShareData()
    }
  }, [sharedUrl, isSharedUrlSupported, isFromShare, showNotifications, clearShareData])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputLink.trim()) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Validate the URL first
      if (!isSupportedMusicUrl(inputLink.trim())) {
        throw new Error('Please enter a valid music link from Spotify, Apple Music, YouTube Music, or other supported platforms')
      }

      // Get conversion result
      const result = await convertMusicLink(inputLink.trim())
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to convert music link')
      }

      // Transform API result to match our interface
      const conversionData = {
        track: {
          title: result.data.title,
          artist: result.data.artist,
          artwork_url: result.data.albumArt,
        },
        platformLinks: result.data.platformLinks,
        originalPlatform: result.data.originalPlatform,
        fromCache: false,
      }

      setConversionResult(conversionData)
      setIsConverted(true)

      if (autoClearInput) {
        setInputLink('')
        setDetectedPlatform(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setInputLink('')
    setIsConverted(false)
    setIsLoading(false)
    setConversionResult(null)
    setError(null)
    setCopiedPlatform(null)
    setDetectedPlatform(null)
  }

  const handleClear = () => {
    setInputLink('')
    setDetectedPlatform(null)
    setError(null)
  }

  const detectPlatform = (url: string): DetectedPlatform => {
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
  };

  const copyPlatformLink = async (platform: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedPlatform(platform)
      
      if (showNotifications) {
        console.log(`Copied ${platform} link to clipboard`)
      }
      
      // Reset the copied state after 2.5 seconds
      setTimeout(() => setCopiedPlatform(null), 2500)
    } catch (err) {
      console.error('Failed to copy link:', err)
      setError('Failed to copy link to clipboard')
    }
  }

  const handleShareConversion = async () => {
    if (!conversionResult || !isShareSupported) return

    const shared = await shareConversion({
      title: conversionResult.track.title,
      artist: conversionResult.track.artist,
      originalPlatform: conversionResult.originalPlatform,
      platformLinks: conversionResult.platformLinks,
    })

    if (!shared) {
      // Fallback: copy to clipboard
      const shareText = `🎵 ${conversionResult.track.title} by ${conversionResult.track.artist}\n\nListen on any platform: ${window.location.href}`
      try {
        await navigator.clipboard.writeText(shareText)
        if (showNotifications) {
          console.log('Conversion details copied to clipboard')
        }
      } catch (err) {
        console.error('Failed to copy or share:', err)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputLink(value);
    setDetectedPlatform(detectPlatform(value));
    setError(null); // Clear any previous errors
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
        <div className={`card ${conversionResult ? `platform-${conversionResult.originalPlatform.toLowerCase().replace(/\s+/g, '')}` : ''}`}>
          {conversionResult && (
            <style>{`
              .card.platform-${conversionResult.originalPlatform.toLowerCase().replace(/\s+/g, '')}::before {
                background: linear-gradient(90deg, ${getPlatformColor(conversionResult.originalPlatform)}, ${getPlatformColor(conversionResult.originalPlatform)}) !important;
              }
            `}</style>
          )}
          
          {/* Error Display */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => setError(null)}>
                <X size={16} />
              </button>
            </div>
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
              <p className="loading-text">
                Finding your music across platforms...
              </p>
            </div>
          )}

          {/* Result Section */}
          {isConverted && !isLoading && conversionResult && (
            <div className="result-section active">
              <div className="track-preview">
                <div className="album-art">
                  {conversionResult.track.artwork_url ? (
                    <img 
                      src={conversionResult.track.artwork_url} 
                      alt="Album art"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                    />
                  ) : (
                    <Music3 size={36} />
                  )}
                </div>
                <div className="track-info">
                  <div className="track-title">{conversionResult.track.title}</div>
                  <div className="track-artist">{conversionResult.track.artist}</div>
                </div>
              </div>

              <div className="result-actions">
                <p className="section-description">
                  Click any platform to copy its link to your clipboard
                </p>
                
                {isShareSupported && (
                  <button 
                    className="share-btn" 
                    onClick={handleShareConversion}
                    title="Share conversion"
                  >
                    <Share size={16} />
                    Share All Links
                  </button>
                )}
              </div>

              <div className="platforms-grid">
                {platforms.map((platform) => {
                  const link = conversionResult.platformLinks[platform.id];
                  const isCopied = copiedPlatform === platform.id;
                  
                  if (!link) return null;

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