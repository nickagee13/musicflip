import { useState, useEffect } from 'react'
import './styles/App.css'

// Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ErrorMessage from './components/ui/ErrorMessage'
import LoadingSpinner from './components/ui/LoadingSpinner'
import SettingsMenu from './components/features/Settings'
import MusicInput from './components/features/MusicInput'
import ConversionResult from './components/features/ConversionResult'

// Services and utilities
import { convertMusicLink, isSupportedMusicUrl, getPlatformColor } from './services/api/songlink-api'
import { useShareTarget, useWebShare } from './hooks/useShareTarget'
import { detectPlatform } from './services/platform-detection'

// Types
import type { ConversionResult as ConversionResultType, DetectedPlatform } from './types'

function App() {
  const [inputLink, setInputLink] = useState('')
  const [isConverted, setIsConverted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [conversionResult, setConversionResult] = useState<ConversionResultType | null>(null)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputLink.trim()) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      if (!isSupportedMusicUrl(inputLink.trim())) {
        throw new Error('Please enter a valid music link from Spotify, Apple Music, YouTube Music, or other supported platforms')
      }

      const result = await convertMusicLink(inputLink.trim())
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to convert music link')
      }

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

  const copyPlatformLink = async (platform: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedPlatform(platform)
      
      if (showNotifications) {
        console.log(`Copied ${platform} link to clipboard`)
      }
      
      setTimeout(() => setCopiedPlatform(null), 1000)
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
    setError(null);
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
      <SettingsMenu
        theme={theme}
        setTheme={setTheme}
        autoDetect={autoDetect}
        setAutoDetect={setAutoDetect}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        openLinksInNewTab={openLinksInNewTab}
        setOpenLinksInNewTab={setOpenLinksInNewTab}
        autoClearInput={autoClearInput}
        setAutoClearInput={setAutoClearInput}
        showPlatformIcons={showPlatformIcons}
        setShowPlatformIcons={setShowPlatformIcons}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
      />

      <Header />

      <main className="container">
        <div className={`card ${conversionResult ? `platform-${conversionResult.originalPlatform.toLowerCase().replace(/\s+/g, '')}` : ''}`}>
          {conversionResult && (
            <style>{`
              .card.platform-${conversionResult.originalPlatform.toLowerCase().replace(/\s+/g, '')}::before {
                background: linear-gradient(90deg, ${getPlatformColor(conversionResult.originalPlatform)}, ${getPlatformColor(conversionResult.originalPlatform)}) !important;
              }
            `}</style>
          )}
          
          {error && (
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          )}

          {!isLoading && !isConverted && (
            <MusicInput
              inputLink={inputLink}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onClear={handleClear}
              onKeyPress={handleKeyPress}
              detectedPlatform={detectedPlatform}
              autoDetect={autoDetect}
              showPlatformIcons={showPlatformIcons}
            />
          )}

          {isLoading && <LoadingSpinner />}

          {isConverted && !isLoading && conversionResult && (
            <ConversionResult
              result={conversionResult}
              copiedPlatform={copiedPlatform}
              onCopyPlatformLink={copyPlatformLink}
              onReset={handleReset}
              onShare={handleShareConversion}
              isShareSupported={isShareSupported}
              showPlatformIcons={showPlatformIcons}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App