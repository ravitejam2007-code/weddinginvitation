import React from 'react';

interface ToranMotifProps {
  className?: string;
  width?: string | number;
  height?: number;
}

export const ToranMotif: React.FC<ToranMotifProps> = ({
  className = '',
  width = '100%',
  height = 54,
}) => {
  return (
    <svg
      viewBox="0 0 600 60"
      width={width}
      height={height}
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="marigoldYellow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        <radialGradient id="marigoldOrange" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </radialGradient>
        <linearGradient id="mangoLeaf" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="60%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <linearGradient id="goldCord" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#dfba60" />
          <stop offset="50%" stopColor="#fff8db" />
          <stop offset="100%" stopColor="#c59b27" />
        </linearGradient>
      </defs>

      {/* Top golden hanging cord */}
      <line x1="0" y1="8" x2="600" y2="8" stroke="url(#goldCord)" strokeWidth="2.5" />
      <line x1="0" y1="12" x2="600" y2="12" stroke="#d97706" strokeWidth="0.8" strokeDasharray="3 3" />

      {/* Hanging drop cords with brass bells and flowers */}
      {[50, 110, 170, 230, 290, 350, 410, 470, 530, 590].map((x, i) => {
        const dropHeight = i % 2 === 0 ? 38 : 26;
        return (
          <g key={`drop-${i}`}>
            <line x1={x} y1="12" x2={x} y2={dropHeight} stroke="#dfba60" strokeWidth="1.2" />
            {/* Hanging golden bell / tassel */}
            <circle cx={x} cy={dropHeight} r="4" fill="url(#marigoldOrange)" />
            <circle cx={x} cy={dropHeight + 4} r="2.2" fill="#d4af37" />
          </g>
        );
      })}

      {/* Mango leaves hanging between flowers */}
      {[25, 85, 145, 205, 265, 325, 385, 445, 505, 565].map((x, i) => (
        <path
          key={`leaf-${i}`}
          d={`M ${x - 5} 12 C ${x - 7} 22, ${x - 2} 32, ${x} 36 C ${x + 2} 32, ${x + 7} 22, ${x + 5} 12 Z`}
          fill="url(#mangoLeaf)"
          opacity="0.92"
        />
      ))}

      {/* Garland Marigold Beads row */}
      {Array.from({ length: 25 }).map((_, i) => {
        const cx = 12 + i * 24;
        const isOrange = i % 2 === 0;
        return (
          <g key={`flower-${i}`}>
            <circle
              cx={cx}
              cy="12"
              r="7.5"
              fill={isOrange ? 'url(#marigoldOrange)' : 'url(#marigoldYellow)'}
              filter="drop-shadow(0 2px 3px rgba(0,0,0,0.15))"
            />
            {/* Inner petal highlights */}
            <circle
              cx={cx}
              cy="12"
              r="4"
              fill={isOrange ? '#ea580c' : '#fbbf24'}
              opacity="0.7"
            />
            <circle
              cx={cx}
              cy="12"
              r="1.8"
              fill="#fff"
              opacity="0.8"
            />
          </g>
        );
      })}
    </svg>
  );
};

