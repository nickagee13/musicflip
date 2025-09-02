# MusicFlip 🎵

A universal music link converter that transforms music links between platforms. Paste a link from Spotify, Apple Music, YouTube Music, or other supported platforms and get instant access to the same track on all available streaming services.

## Features

### Current Features
- **Universal Link Conversion**: Convert music links between all major streaming platforms
- **Supported Platforms**: Spotify, Apple Music, YouTube Music, Deezer, Amazon Music, Tidal, and more
- **Smart Platform Detection**: Automatically detects the source platform with visual indicators
- **Web Share Integration**: Share and receive music links directly through the browser's native share menu
- **Dark/Light Theme**: Toggle between themes with system preference support
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Clipboard Integration**: One-click copying of converted links
- **Error Handling**: Clear feedback for unsupported links and conversion failures

### Settings & Customization
- Auto-detect platform from pasted links
- Toggle notifications for copy/share actions
- Open links in new tabs
- Auto-clear input after conversion
- Show/hide platform icons

### Upcoming Features (Native Integration)
- **Share Sheet Registration**: Share directly from any music app through native iOS/Android share menu
- **URL Scheme Handling**: Automatic opening when tapping universal music links
- **Deep Linking**: Direct integration with mobile music apps

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: CSS with CSS Variables for theming
- **Icons**: Lucide React
- **API Integration**: SongLink/Odesli for music platform data
- **Deployment**: Netlify with serverless functions

## Getting Started

### Prerequisites
- Node.js (18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd musicflip
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## Project Structure

```
src/
├── components/
│   ├── features/          # Feature-specific components
│   │   ├── ConversionResult.tsx
│   │   ├── MusicInput.tsx
│   │   └── Settings.tsx
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── ui/                # Reusable UI components
│       ├── ErrorMessage.tsx
│       └── LoadingSpinner.tsx
├── hooks/                 # Custom React hooks
│   └── useShareTarget.ts
├── services/              # External services and APIs
│   ├── api/
│   └── platform-detection/
├── styles/                # CSS files
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## API Integration

MusicFlip uses the [SongLink/Odesli API](https://odesli.co/) to convert music links between platforms. The API provides:
- Track metadata (title, artist, artwork)
- Available platform links
- Platform-specific identifiers

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## Development Notes

### Web Share Target API
The app implements the Web Share Target API for receiving shared music links from other apps. This requires HTTPS and a valid web app manifest.

### Platform Detection
Smart platform detection analyzes URLs to identify the source music service and display appropriate branding/colors.

### Error Boundaries
Comprehensive error handling ensures a smooth user experience even when API calls fail or invalid links are provided.

## Browser Support

- Modern browsers with ES6+ support
- Web Share API (Chrome, Safari, Edge)
- Clipboard API for copy functionality
- CSS Custom Properties for theming

## License

MIT License - see LICENSE file for details
