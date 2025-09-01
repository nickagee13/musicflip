import { Music } from 'lucide-react'

export default function Header() {
  return (
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
  )
}