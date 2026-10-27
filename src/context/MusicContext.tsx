import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

interface MusicContextType {
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

const MusicContext = createContext<MusicContextType | null>(null);

const TRACK_DURATION = 150; // 2 minutes 30 seconds

// Auspicious Indian Wedding Raga (Yaman / Kalyani pentatonic notes)
const ragaScale = [
  261.63, // C4 (Sa)
  293.66, // D4 (Re)
  329.63, // E4 (Ga)
  369.99, // F#4 (Teevra Ma)
  392.00, // G4 (Pa)
  440.00, // A4 (Dha)
  493.88, // B4 (Ni)
  523.25, // C5 (Taar Sa)
  587.33, // D5 (Taar Re)
];

const melodyNotes: { pitchIdx: number; duration: number }[] = [
  { pitchIdx: 0, duration: 1.2 },
  { pitchIdx: 1, duration: 0.6 },
  { pitchIdx: 2, duration: 1.0 },
  { pitchIdx: 3, duration: 0.6 },
  { pitchIdx: 4, duration: 1.5 },
  { pitchIdx: 4, duration: 0.8 },
  { pitchIdx: 5, duration: 0.6 },
  { pitchIdx: 4, duration: 0.8 },
  { pitchIdx: 3, duration: 0.6 },
  { pitchIdx: 2, duration: 1.2 },
  { pitchIdx: 1, duration: 0.8 },
  { pitchIdx: 0, duration: 2.0 },
  // Second phrase
  { pitchIdx: 2, duration: 0.8 },
  { pitchIdx: 4, duration: 0.8 },
  { pitchIdx: 6, duration: 1.0 },
  { pitchIdx: 7, duration: 1.6 },
  { pitchIdx: 8, duration: 0.6 },
  { pitchIdx: 7, duration: 1.0 },
  { pitchIdx: 5, duration: 0.8 },
  { pitchIdx: 4, duration: 1.4 },
  { pitchIdx: 2, duration: 0.8 },
  { pitchIdx: 1, duration: 1.0 },
  { pitchIdx: 0, duration: 2.2 },
];

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const loopTimeoutRef = useRef<number | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
        masterGainRef.current = audioCtxRef.current.createGain();
        masterGainRef.current.gain.setValueAtTime(0.7, audioCtxRef.current.currentTime);
        masterGainRef.current.connect(audioCtxRef.current.destination);
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playNote = useCallback((ctx: AudioContext, freq: number, startTime: number, duration: number) => {
    if (!masterGainRef.current) return;

    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.006, startTime + duration * 0.4);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 0.5, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, startTime);
    filter.frequency.linearRampToValueAtTime(1200, startTime + duration);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.09, startTime + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);

    osc.start(startTime);
    osc.stop(startTime + duration);
    subOsc.start(startTime);
    subOsc.stop(startTime + duration);
  }, []);

  const startMusicLoop = useCallback(() => {
    initAudio();
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;

    const now = ctx.currentTime;
    let timeOffset = now + 0.1;

    // Tanpura Drone in Sa and Pa
    const droneSa = ctx.createOscillator();
    const dronePa = ctx.createOscillator();
    const droneGain = ctx.createGain();
    const droneFilter = ctx.createBiquadFilter();

    droneSa.type = 'sine';
    droneSa.frequency.setValueAtTime(130.81, now);
    dronePa.type = 'sine';
    dronePa.frequency.setValueAtTime(196.00, now);

    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(500, now);

    droneGain.gain.setValueAtTime(0.001, now);
    droneGain.gain.linearRampToValueAtTime(0.035, now + 1.5);

    droneSa.connect(droneFilter);
    dronePa.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(masterGainRef.current);

    droneSa.start(now);
    dronePa.start(now);

    melodyNotes.forEach((item) => {
      const freq = ragaScale[item.pitchIdx];
      playNote(ctx, freq, timeOffset, item.duration);
      timeOffset += item.duration * 0.92;
    });

    const totalMelodyDuration = timeOffset - now;

    droneGain.gain.setValueAtTime(0.035, now + totalMelodyDuration - 1.0);
    droneGain.gain.exponentialRampToValueAtTime(0.001, now + totalMelodyDuration);
    droneSa.stop(now + totalMelodyDuration);
    dronePa.stop(now + totalMelodyDuration);

    if (isPlayingRef.current) {
      loopTimeoutRef.current = window.setTimeout(() => {
        if (isPlayingRef.current) {
          startMusicLoop();
        }
      }, (totalMelodyDuration - 0.4) * 1000);
    }
  }, [playNote]);

  const stopMusic = useCallback(() => {
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  // Update progress timer smoothly
  const tickProgress = useCallback(() => {
    if (!isPlayingRef.current) return;
    const now = performance.now();
    const delta = (now - lastTimeRef.current) / 1000;
    lastTimeRef.current = now;

    setCurrentTime((prev) => {
      const next = prev + delta;
      if (next >= TRACK_DURATION) {
        return 0;
      }
      return next;
    });

    animFrameRef.current = requestAnimationFrame(tickProgress);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopMusic();
    } else {
      initAudio();
      isPlayingRef.current = true;
      setIsPlaying(true);
      lastTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(tickProgress);
      startMusicLoop();
    }
  }, [isPlaying, startMusicLoop, stopMusic, tickProgress]);

  const seek = useCallback((targetSeconds: number) => {
    const clamped = Math.max(0, Math.min(TRACK_DURATION, targetSeconds));
    setCurrentTime(clamped);
    if (isPlayingRef.current) {
      // Re-trigger loop from current
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
      startMusicLoop();
    }
  }, [startMusicLoop]);

  const toggleMute = useCallback(() => {
    if (!masterGainRef.current || !audioCtxRef.current) return;
    if (isMuted) {
      masterGainRef.current.gain.setValueAtTime(0.7, audioCtxRef.current.currentTime);
      setIsMuted(false);
    } else {
      masterGainRef.current.gain.setValueAtTime(0.0001, audioCtxRef.current.currentTime);
      setIsMuted(true);
    }
  }, [isMuted]);

  useEffect(() => {
    return () => {
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const progressPercent = (currentTime / TRACK_DURATION) * 100;

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTime,
        duration: TRACK_DURATION,
        progressPercent,
        isMuted,
        trackTitle: 'Auspicious Shehnai & Sitar Raga',
        trackArtist: 'Raag Yaman &bull; Classical Kalyani Wedding Serenade',
        togglePlay,
        seek,
        toggleMute,
      }}
    >
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
