import React from 'react';

interface GaneshaMotifProps {
  className?: string;
  size?: number;
  color?: string;
  embossed?: boolean;
}

export const GaneshaMotif: React.FC<GaneshaMotifProps> = ({
  className = '',
  size = 40,
  color = 'currentColor',
  embossed = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Lord Ganesha Motif"
      role="img"
    >
      <defs>
        {/* Gold metallic gradient */}
        <linearGradient id="ganeshaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff3bf" />
          <stop offset="35%" stopColor="#dfba60" />
          <stop offset="70%" stopColor="#b28221" />
          <stop offset="100%" stopColor="#fae49d" />
        </linearGradient>

        {/* Emboss drop shadow & highlight */}
        {embossed && (
          <filter id="ganeshaBevel" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0.6" dy="0.9" stdDeviation="0.4" floodColor="#4a3205" floodOpacity="0.75" />
            <feDropShadow dx="-0.5" dy="-0.6" stdDeviation="0.3" floodColor="#fff8db" floodOpacity="0.65" />
          </filter>
        )}
      </defs>

      <g filter={embossed ? 'url(#ganeshaBevel)' : undefined}>
        {/* Aureole / Halo Sunburst Rays */}
        <circle cx="50" cy="50" r="42" stroke={embossed ? 'url(#ganeshaGoldGrad)' : color} strokeWidth="1.2" strokeDasharray="1.5 2.5" opacity="0.8" />
        <circle cx="50" cy="50" r="38" stroke={embossed ? 'url(#ganeshaGoldGrad)' : color} strokeWidth="0.8" opacity="0.6" />

        {/* Mukut / Crown */}
        <path
          d="M44 26 L50 17 L56 26 L52 28 L50 21 L48 28 Z"
          fill={embossed ? 'url(#ganeshaGoldGrad)' : color}
        />
        <circle cx="50" cy="15.5" r="1.8" fill={embossed ? 'url(#ganeshaGoldGrad)' : color} />

        {/* Sacred Forehead Tilak (Trishul shape) */}
        <path
          d="M48.5 29 C48.5 31 51.5 31 51.5 29 L51.5 34 C51.5 35 48.5 35 48.5 34 Z"
          fill={embossed ? 'url(#ganeshaGoldGrad)' : color}
        />
        <circle cx="50" cy="36" r="1" fill="#c0392b" />

        {/* Ganesha Head & Trunk contour (Single graceful auspicious stroke) */}
        <path
          d="M43 31 C39 31 34 35 34 42 C34 49 40 50 44 48 C43 55 45 64 48 68 C50 71 54 71 55 68 C56 65 54 62 52 62 C49 62 48 56 48 50 C54 50 63 46 64 38 C65 33 60 29 55 29"
          stroke={embossed ? 'url(#ganeshaGoldGrad)' : color}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Modak / Sweet in Trunk tip */}
        <circle cx="56.5" cy="65.5" r="2.2" fill={embossed ? 'url(#ganeshaGoldGrad)' : color} />

        {/* Large Ears */}
        {/* Right Ear */}
        <path
          d="M58 33 C67 33 71 39 69 46 C67 51 62 50 60 48"
          stroke={embossed ? 'url(#ganeshaGoldGrad)' : color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Left Ear */}
        <path
          d="M41 33 C33 33 29 39 31 46 C33 51 38 50 40 48"
          stroke={embossed ? 'url(#ganeshaGoldGrad)' : color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Graceful Ganesha Eye */}
        <path
          d="M52 39 C53.5 37.5 56 37.5 57 39 C55.5 40 53.5 40 52 39 Z"
          fill={embossed ? 'url(#ganeshaGoldGrad)' : color}
        />
        <circle cx="54.5" cy="38.7" r="0.6" fill="#2d1d05" />

        {/* Tusk */}
        <path
          d="M57 47 L61 49"
          stroke={embossed ? 'url(#ganeshaGoldGrad)' : color}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
