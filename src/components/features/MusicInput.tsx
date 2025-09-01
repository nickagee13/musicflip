import { X } from 'lucide-react'
import type { DetectedPlatform } from '../../types'

interface MusicInputProps {
  inputLink: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  detectedPlatform: DetectedPlatform;
  autoDetect: boolean;
  showPlatformIcons: boolean;
}

export default function MusicInput({
  inputLink,
  onInputChange,
  onSubmit,
  onClear,
  onKeyPress,
  detectedPlatform,
  autoDetect,
  showPlatformIcons
}: MusicInputProps) {
  return (
    <div className="input-section">
      <h2 className="section-title">Paste any music link</h2>
      <p className="section-description">
        Convert Spotify, Apple Music, YouTube links into universal ones that work for everyone
      </p>
      
      <form onSubmit={onSubmit}>
        <div className="input-wrapper">
          <input 
            type="url" 
            className={`link-input ${inputLink ? 'has-content' : ''}`}
            placeholder="https://open.spotify.com/track/..."
            value={inputLink}
            onChange={onInputChange}
            onKeyDown={onKeyPress}
            autoComplete="off"
          />
          <button 
            type="button" 
            className="clear-btn" 
            onClick={onClear}
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
  )
}