import React from 'react';
import { wedding } from '../data/wedding';

interface MonogramMotifProps {
  className?: string;
  size?: number;
  initials?: string;
}

export const MonogramMotif: React.FC<MonogramMotifProps> = ({
  className = '',
  size = 40,
  initials = `${wedding.couple.brideName.charAt(0)} & ${wedding.couple.groomName.charAt(0)}`,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`Family monogram ${initials}`}
      role="img"
    >
      <defs>
        <linearGradient id="monogramGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8e1" />
          <stop offset="35%" stopColor="#f3d489" />
          <stop offset="70%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#aa8323" />
        </linearGradient>

        <filter id="monogramBevel" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0.6" dy="0.9" stdDeviation="0.4" floodColor="#3a0510" floodOpacity="0.8" />
          <feDropShadow dx="-0.4" dy="-0.5" stdDeviation="0.3" floodColor="#ffe8ad" floodOpacity="0.5" />
        </filter>
      </defs>

      <g filter="url(#monogramBevel)">
        {/* Ornate crest / laurel ring */}
        <circle cx="50" cy="50" r="41" stroke="url(#monogramGoldGrad)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.85" />
        <circle cx="50" cy="50" r="37" stroke="url(#monogramGoldGrad)" strokeWidth="0.8" opacity="0.65" />

        {/* Small royal crown at top */}
        <path
          d="M44 26 L46 21 L50 24 L54 21 L56 26 Z"
          fill="url(#monogramGoldGrad)"
        />
        <circle cx="46" cy="19" r="1.1" fill="url(#monogramGoldGrad)" />
        <circle cx="50" cy="22" r="1.2" fill="url(#monogramGoldGrad)" />
        <circle cx="54" cy="19" r="1.1" fill="url(#monogramGoldGrad)" />

        {/* Monogram typography */}
        <text
          x="50"
          y="57"
          textAnchor="middle"
          fontFamily="'Cinzel', 'Cormorant Garamond', serif"
          fontSize="23"
          fontWeight="700"
          fontStyle="italic"
          fill="url(#monogramGoldGrad)"
          letterSpacing="1"
        >
          {initials}
        </text>

        {/* Small decorative flourishes under text */}
        <path
          d="M36 67 C44 69 46 65 50 67 C54 65 56 69 64 67"
          stroke="url(#monogramGoldGrad)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="50" cy="71" r="1.3" fill="url(#monogramGoldGrad)" />
      </g>
    </svg>
  );
};
