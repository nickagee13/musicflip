# PWA Icons

This directory should contain PWA icons referenced in `manifest.json`.

## Required Icon Sizes
- icon-72x72.png
- icon-96x96.png  
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## How to Generate Icons

### Option 1: Online PWA Icon Generator
1. Go to [favicon.io/favicon-generator](https://favicon.io/favicon-generator/)
2. Use these settings:
   - Text: "MF" or music note symbol
   - Background: #1DB584 (MusicFlip primary color)
   - Font: SF Pro or similar
3. Download and extract all sizes to this directory

### Option 2: Figma/Design Tool
Create a 512x512 icon design with:
- Background: Linear gradient (#1DB584 to #1DB954)
- Icon: Music note or "MF" text in white
- Border radius: 20% for modern app icon look
- Export at all required sizes

### Option 3: Simple Placeholder (Temporary)
For development, you can use any 512x512 image and resize it:
```bash
# If you have ImageMagick installed
convert your-icon.png -resize 192x192 icon-192x192.png
convert your-icon.png -resize 512x512 icon-512x512.png
# etc for all sizes
```

## Icon Design Guidelines
- Use MusicFlip brand colors (#1DB584 primary)
- Include music-related imagery (notes, headphones, etc.)
- Ensure good contrast and readability at small sizes
- Follow platform icon guidelines (rounded corners, proper padding)
- Consider both light and dark themes

The app will work without icons, but they greatly improve the PWA experience when users install the app on their devices.