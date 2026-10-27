import React, { useState } from 'react';
import { GaneshaMotif } from './GaneshaMotif';
import { MonogramMotif } from './MonogramMotif';

interface WaxSealProps {
  isOpen: boolean;
  isOpening?: boolean;
  onClick: (e: React.MouseEvent | React.TouchEvent) => void;
  motif?: 'ganesha' | 'monogram';
  size?: number;
  className?: string;
  disabled?: boolean;
}

export const WaxSeal: React.FC<WaxSealProps> = ({
  isOpen,
  isOpening = false,
  onClick,
  motif = 'ganesha',
  size = 76,
  className = '',
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);


  return (
    <button
      type="button"
      className={`wax-seal-button ${isHovered ? 'is-hovered' : ''} ${isPressed ? 'is-pressed' : ''} ${isOpening ? 'is-breaking' : ''} ${isOpen ? 'is-open' : ''} ${className}`}
      onClick={onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => !disabled && setIsPressed(true)}
      onTouchEnd={(e) => {
        setIsPressed(false);
        onClick(e);
      }}
      disabled={disabled}
      aria-label={isOpen ? "Wax seal opened" : "Tap the wax seal to open the envelope"}
      aria-expanded={isOpen}
      style={{
        width: size,
        height: size,
      }}
    >
      <img className="wax-seal-svg" src="/images/illustrations/wax-seal-base.svg" alt="" />

      {/* Central Emblem Motif */}
      <div className="seal-emblem-wrapper">
        {motif === 'ganesha' ? (
          <GaneshaMotif size={size * 0.62} embossed={true} />
        ) : (
          <MonogramMotif size={size * 0.62} />
        )}
      </div>

      {/* Glint Shimmer Sheen Layer */}
      <div className="wax-seal-glint" aria-hidden="true" />
    </button>
  );
};
