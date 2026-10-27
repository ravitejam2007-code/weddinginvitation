import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const MusicPlayer: React.FC = () => {
  const { isPlaying, isAvailable, error, togglePlay } = useMusic();

  return (
    <div className="floating-music-controller" aria-label="Celebratory Wedding Music">
      <button
        type="button"
        className={`music-pill-button ${isPlaying ? 'music-playing' : 'music-paused'}`}
        onClick={togglePlay}
        disabled={!isAvailable}
        title={error || (isPlaying ? 'Pause wedding music' : 'Play wedding music')}
        aria-pressed={isPlaying}
        aria-label={error || (isPlaying ? 'Pause wedding music' : isAvailable ? 'Play wedding music' : 'Wedding music unavailable')}
      >
        <span className="music-icon-wrap">
          {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </span>
        <span className="music-label">
          {isPlaying ? 'Pause Music' : isAvailable ? 'Play Music' : 'Music Unavailable'}
        </span>
        {isPlaying && (
          <div className="music-equalizer" aria-hidden="true">
            <span className="eq-bar eq-1" />
            <span className="eq-bar eq-2" />
            <span className="eq-bar eq-3" />
            <span className="eq-bar eq-4" />
          </div>
        )}
      </button>
      {error && <span className="music-error-message" role="status">{error}</span>}
    </div>
  );
};
