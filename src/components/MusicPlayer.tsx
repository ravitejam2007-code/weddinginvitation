import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useMusic } from '../context/useMusic';

export const MusicPlayer: React.FC = () => {
  const { isPlaying, togglePlay } = useMusic();

  return (
    <div className="floating-music-controller" aria-label="Celebratory Wedding Music">
      <button
        type="button"
        className={`music-pill-button ${isPlaying ? 'music-playing' : 'music-paused'}`}
        onClick={togglePlay}
        title={isPlaying ? "Pause wedding music" : "Play traditional wedding music"}
        aria-pressed={isPlaying}
      >
        <span className="music-icon-wrap">
          {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </span>
        <span className="music-label">
          {isPlaying ? "Shehnai & Sitar" : "Play Music"}
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
    </div>
  );
};
