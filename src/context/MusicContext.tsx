import React, { createContext, useContext, useRef, useState } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progressPercent: number;
  isMuted: boolean;
  isAvailable: boolean;
  error: string;
  trackTitle: string;
  trackArtist: string;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  toggleMute: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);
const trackUrl = import.meta.env.VITE_WEDDING_MUSIC_URL?.trim() ?? '';

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState('');

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !trackUrl) {
      setError('Wedding music is unavailable until an approved audio track is configured.');
      return;
    }

    if (audio.paused) {
      void audio.play().then(() => setError('')).catch(() => {
        setIsPlaying(false);
        setError('The audio could not be played. Check the media URL and try again.');
      });
    } else {
      audio.pause();
    }
  };

  const seek = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, seconds));
    setCurrentTime(audio.currentTime);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) audioRef.current.muted = nextMuted;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTime,
        duration,
        progressPercent,
        isMuted,
        isAvailable: Boolean(trackUrl),
        error,
        trackTitle: 'Wedding Music',
        trackArtist: '',
        togglePlay,
        seek,
        toggleMute,
      }}
    >
      <audio
        ref={audioRef}
        src={trackUrl || undefined}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onDurationChange={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        onError={() => {
          setIsPlaying(false);
          setError('The configured audio track could not be loaded.');
        }}
      />
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
