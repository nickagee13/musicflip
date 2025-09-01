import { useEffect, useState } from 'react';
import { isSupportedMusicUrl } from '../services/api/songlink-api';

interface ShareTargetData {
  sharedUrl: string | null;
  isFromShare: boolean;
  isSupported: boolean;
}

// Custom hook to handle Web Share Target API and URL parameters
export function useShareTarget() {
  const [shareData, setShareData] = useState<ShareTargetData>({
    sharedUrl: null,
    isFromShare: false,
    isSupported: false,
  });

  useEffect(() => {
    // Check URL parameters on mount
    const urlParams = new URLSearchParams(window.location.search);
    const sharedLink = urlParams.get('link') || urlParams.get('url');
    const isFromShare = urlParams.get('shared') === 'true';

    if (sharedLink) {
      const isSupported = isSupportedMusicUrl(sharedLink);
      setShareData({
        sharedUrl: sharedLink,
        isFromShare,
        isSupported,
      });

      // Clean up URL parameters after extracting the data
      if (window.history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.delete('link');
        url.searchParams.delete('url');
        url.searchParams.delete('shared');
        window.history.replaceState({}, document.title, url.toString());
      }
    }
  }, []);

  const clearShareData = () => {
    setShareData({
      sharedUrl: null,
      isFromShare: false,
      isSupported: false,
    });
  };

  return {
    ...shareData,
    clearShareData,
  };
}

// Hook for Web Share API (for sharing results)
export function useWebShare() {
  const [isShareSupported, setIsShareSupported] = useState(false);

  useEffect(() => {
    setIsShareSupported('share' in navigator);
  }, []);

  const shareConversion = async (data: {
    title: string;
    artist: string;
    originalPlatform: string;
    platformLinks: { [key: string]: string };
  }) => {
    if (!isShareSupported) {
      return false;
    }

    try {
      const shareText = `🎵 ${data.title} by ${data.artist}\n\nListen on any platform:`;
      const shareUrl = window.location.origin + `/?converted=true`;

      await navigator.share({
        title: `${data.title} - ${data.artist}`,
        text: shareText,
        url: shareUrl,
      });

      return true;
    } catch (error) {
      console.log('Share cancelled or failed:', error);
      return false;
    }
  };

  const sharePlatformLink = async (data: {
    title: string;
    artist: string;
    platform: string;
    url: string;
  }) => {
    if (!isShareSupported) {
      return false;
    }

    try {
      const shareText = `🎵 ${data.title} by ${data.artist} on ${data.platform}`;

      await navigator.share({
        title: `${data.title} - ${data.artist}`,
        text: shareText,
        url: data.url,
      });

      return true;
    } catch (error) {
      console.log('Share cancelled or failed:', error);
      return false;
    }
  };

  return {
    isShareSupported,
    shareConversion,
    sharePlatformLink,
  };
}