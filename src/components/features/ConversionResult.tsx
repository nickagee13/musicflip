import { Music3, Share, Music, Apple, Play, Package, Waves, Music2 } from 'lucide-react'
import type { ConversionResult as ConversionResultType } from '../../types'
import { platforms } from '../../constants/platforms'

interface ConversionResultProps {
  result: ConversionResultType;
  copiedPlatform: string | null;
  onCopyPlatformLink: (platform: string, url: string) => void;
  onReset: () => void;
  onShare: () => void;
  isShareSupported: boolean;
  showPlatformIcons: boolean;
}

export default function ConversionResult({
  result,
  copiedPlatform,
  onCopyPlatformLink,
  onReset,
  onShare,
  isShareSupported,
  showPlatformIcons
}: ConversionResultProps) {
  return (
    <div className="result-section active">
      <div className="track-preview">
        <div className="album-art">
          {result.track.artwork_url ? (
            <img 
              src={result.track.artwork_url} 
              alt="Album art"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
            />
          ) : (
            <Music3 size={36} />
          )}
        </div>
        <div className="track-info">
          <div className="track-title">{result.track.title}</div>
          <div className="track-artist">{result.track.artist}</div>
        </div>
      </div>

      <div className="result-actions">
        <p className="section-description">
          Click any platform to copy its link to your clipboard
        </p>
        
        {isShareSupported && (
          <button 
            className="share-btn" 
            onClick={onShare}
            title="Share conversion"
          >
            <Share size={16} />
            Share All Links
          </button>
        )}
      </div>

      <div className="platforms-grid">
        {platforms.map((platform) => {
          const link = result.platformLinks[platform.id];
          const isCopied = copiedPlatform === platform.id;
          
          if (!link) return null;

          return (
            <button
              key={platform.id}
              onClick={() => onCopyPlatformLink(platform.id, link)}
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

      <button onClick={onReset} className="reset-btn">
        Convert Another Song
      </button>
    </div>
  )
}