import { createContext, useContext } from 'react';

export interface MusicContextType {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progressPercent: number;
  isMuted: boolean;
  trackTitle: string;
  trackArtist: string;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  toggleMute: () => void;
}

export const MusicContext = createContext<MusicContextType | null>(null);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
