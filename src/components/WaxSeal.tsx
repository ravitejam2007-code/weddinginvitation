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

  // Organic wax puddle shape with 16 subtle irregularities
  const waxPuddlePath = `
    M 50 4
    C 62 3, 73 8, 82 17
    C 92 26, 96 38, 96 50
    C 97 63, 91 75, 82 84
    C 72 93, 61 97, 49 96
    C 36 96, 25 91, 16 82
    C 7 72, 3 61, 4 49
    C 3 36, 9 24, 18 16
    C 27 7, 38 4, 50 4 Z
  `;

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
      <svg
        viewBox="0 0 100 100"
        className="wax-seal-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Base Metallic Gold Wax Radial Gradient */}
          <radialGradient id="waxBaseGrad" cx="36%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#fff1ba" />
            <stop offset="22%" stopColor="#f4d16d" />
            <stop offset="50%" stopColor="#c89932" />
            <stop offset="78%" stopColor="#8f6311" />
            <stop offset="100%" stopColor="#5c3f07" />
          </radialGradient>

          {/* Rim Shading Gradient */}
          <linearGradient id="waxRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffe99c" />
            <stop offset="45%" stopColor="#d19e34" />
            <stop offset="80%" stopColor="#7c530b" />
            <stop offset="100%" stopColor="#4e3304" />
          </linearGradient>

          {/* Deep Deboss Cavity Gradient */}
          <radialGradient id="waxDebossGrad" cx="42%" cy="40%" r="58%">
            <stop offset="0%" stopColor="#f3cb62" />
            <stop offset="60%" stopColor="#ad7b1e" />
            <stop offset="100%" stopColor="#694608" />
          </radialGradient>

          {/* Wax Drop Shadow */}
          <filter id="waxShadowFilter" x="-20%" y="-15%" width="140%" height="150%">
            <feDropShadow dx="0" dy="7" stdDeviation="5" floodColor="#271802" floodOpacity="0.45" />
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
          </filter>

          {/* Inner Rim Bevel */}
          <filter id="innerRimBevel" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0.8" dy="1.2" stdDeviation="0.6" floodColor="#382203" floodOpacity="0.8" />
            <feDropShadow dx="-0.8" dy="-0.8" stdDeviation="0.5" floodColor="#fff5d1" floodOpacity="0.7" />
          </filter>
        </defs>

        {/* Outer Wax Puddle (Natural irregular melted edge) */}
        <path
          d={waxPuddlePath}
          fill="url(#waxBaseGrad)"
          filter="url(#waxShadowFilter)"
        />

        {/* Outer Wax Ridge / Rim Bevel */}
        <circle
          cx="50"
          cy="50"
          r="41"
          fill="none"
          stroke="url(#waxRimGrad)"
          strokeWidth="3.5"
          filter="url(#innerRimBevel)"
        />

        {/* Outer Wax Detail Beads (Dotted royal seal rim) */}
        <circle
          cx="50"
          cy="50"
          r="38.5"
          fill="none"
          stroke="#fff4cf"
          strokeWidth="0.75"
          strokeDasharray="1.2 2.2"
          opacity="0.85"
        />

        {/* Debossed Center Plate where the emblem sits */}
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="url(#waxDebossGrad)"
          stroke="#422904"
          strokeWidth="1.2"
        />

        {/* Inner Gold Foil Ring */}
        <circle
          cx="50"
          cy="50"
          r="32.5"
          fill="none"
          stroke="#ffefa6"
          strokeWidth="0.8"
          opacity="0.9"
        />
      </svg>

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
