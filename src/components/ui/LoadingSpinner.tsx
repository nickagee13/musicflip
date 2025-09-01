export default function LoadingSpinner() {
  return (
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
  )
}