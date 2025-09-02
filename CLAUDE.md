# MusicFlip Development Context

This file helps Claude Code remember the project state between sessions.

## Project Overview
Universal music link converter (Spotify, Apple Music, YouTube Music, etc.) built with React 19, TypeScript, and Vite 7.

**App Purpose**: Makes it effortless to share music across different streaming platforms. Instead of the frustrating "I don't use that service" dead-end, MusicFlip converts any song or album link into a universal version that works for everyone, letting friends enjoy music together no matter which app they use.

## Development Role & Workflow

**My Role**: Acting as a mobile product strategist, UX/UI designer, and full-stack developer to help conceptualize, design, and code MusicFlip.

### Development Workflow Progress
1. Brainstorm basic app ideas ✅
2. Create a Vite project, then Build the basic UI only ✅
3. Set up repo on GitHub, open code in VS Code to be tweaked with Claude Code ✅
4. Create data structure and backend with Supabase ✅
5. Connect UI with backend ✅
6. Deploy working MVP ✅
7. **UI polish (current step)** 🎯

### Development Guidelines
- **Always think from three perspectives:**
  - **Strategist** → Clarify product features, roadmap, and trade-offs
  - **Designer** → Suggest clear UI/UX flows and layouts
  - **Developer** → Write clean, commented code with explanations
- **Explain reasoning step by step** when proposing solutions
- **Suggest better implementations** before writing code if they exist
- **Assume beginner level** - teach concepts as we go, not just provide code

## Current Development Status
- **Last Updated**: 2025-09-01
- **Active Branch**: main
- **Build Status**: ✅ Clean (no pending changes)

## Key Commands
```bash
npm run dev      # Start development server (localhost:5173)
npm run build    # Production build with TypeScript compilation
npm run lint     # ESLint code quality check
npm run preview  # Preview production build
```

## Architecture Notes
- **Frontend**: React 19 + TypeScript + Vite 7
- **API**: SongLink/Odesli for music platform conversion
- **Styling**: CSS with CSS Variables for theming
- **Deployment**: Netlify with serverless functions

## Project Structure
```
src/
├── components/
│   ├── features/    # ConversionResult, MusicInput, Settings
│   ├── layout/      # Header, Footer  
│   └── ui/          # ErrorMessage, LoadingSpinner
├── hooks/           # useShareTarget
├── services/        # API and platform detection
├── styles/          # CSS files
├── types/           # TypeScript definitions
└── utils/           # Utility functions
```

## Current Features
- Universal link conversion between music platforms
- Smart platform detection with visual indicators
- Web Share integration
- Dark/light theme toggle
- Responsive design
- Clipboard integration
- Error handling

## Development Context
- Recent focus: Code restructuring and documentation
- Clean codebase with no pending issues
- Professional folder organization implemented
- Animation fixes for UI components completed

## Future Development Roadmap

### 🚨 High Priority - Native Integration
- **Share Sheet Registration**: User can share directly from any music app through native iOS/Android share menu
- **URL Scheme Handling**: MusicFlip opens automatically when user taps universal music links

### 📋 Eventually Add Functionality
- **Copy/Paste Sharing Playlists**: Full playlist conversion between platforms

### 🧪 Ideas to Experiment With

#### Phase 3: Loading & State Transitions (Medium Impact)
- Enhanced music bars with beat-synchronized pulsing
- Card morphing transitions between input → loading → results states  
- Results unfold animation from loading state
- Smooth reset transitions with reverse animations

#### Phase 4: Settings Panel Polish (Medium Impact)
- Smooth slide-in panel with backdrop blur effects
- Toggle switch animations with spring physics
- Theme transition effects across entire interface
- Settings icon rotation on panel open/close

#### Phase 5: Micro-Interactions & Polish
- Button state communications across all interactive elements
- Spatial continuity through shared element transitions
- Natural movement patterns following iOS/Material Design principles
- Accessibility considerations for reduced motion

## Active Tasks
(Update this section during development sessions)

## Known Issues
(Track any blockers or technical debt here)

## Session Notes
(Add notes about what you're working on each session)

---
*This file is automatically read by Claude Code on startup to maintain context between sessions.*
### Latest Commit
b0be939 Add Claude Code session persistence system

### Latest Commit
ffddc12 Add development role and workflow context to CLAUDE.md

### Latest Commit
a5e19df Update latest commit info from git hooks
