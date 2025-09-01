import { useEffect } from 'react'
import { Settings, Moon, Sun } from 'lucide-react'

interface SettingsProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  autoDetect: boolean;
  setAutoDetect: (value: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (value: boolean) => void;
  openLinksInNewTab: boolean;
  setOpenLinksInNewTab: (value: boolean) => void;
  autoClearInput: boolean;
  setAutoClearInput: (value: boolean) => void;
  showPlatformIcons: boolean;
  setShowPlatformIcons: (value: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (value: boolean) => void;
}

export default function SettingsMenu(props: SettingsProps) {
  const {
    theme, setTheme, autoDetect, setAutoDetect, showNotifications, setShowNotifications,
    openLinksInNewTab, setOpenLinksInNewTab, autoClearInput, setAutoClearInput,
    showPlatformIcons, setShowPlatformIcons, settingsOpen, setSettingsOpen
  } = props;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsOpen && !(event.target as Element).closest('.settings-container')) {
        setSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [settingsOpen, setSettingsOpen])

  return (
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
  )
}