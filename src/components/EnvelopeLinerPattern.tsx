import React from 'react';

export const EnvelopeLinerPattern: React.FC = () => {
  return (
    <svg className="envelope-liner-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <pattern
          id="royalJaaliPattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          {/* Subtle Sage Liner Backing */}
          <rect width="40" height="40" fill="#475c46" />

          {/* Golden Jaali Diamond Grid */}
          <path
            d="M20 0 L40 20 L20 40 L0 20 Z"
            fill="none"
            stroke="#d4af37"
            strokeWidth="0.8"
            opacity="0.35"
          />

          {/* Floral Petal Floret in Diamond Center */}
          <circle cx="20" cy="20" r="3.2" fill="none" stroke="#fad674" strokeWidth="0.75" opacity="0.6" />
          <circle cx="20" cy="20" r="1.2" fill="#fad674" opacity="0.75" />

          <path
            d="M20 14 C19 17 21 17 20 14 M20 26 C19 23 21 23 20 26 M14 20 C17 19 17 21 14 20 M26 20 C23 19 23 21 26 20"
            stroke="#fad674"
            strokeWidth="0.6"
            opacity="0.5"
          />

          {/* Corner Florets */}
          <circle cx="0" cy="0" r="2" fill="none" stroke="#d4af37" strokeWidth="0.6" opacity="0.4" />
          <circle cx="40" cy="0" r="2" fill="none" stroke="#d4af37" strokeWidth="0.6" opacity="0.4" />
          <circle cx="0" cy="40" r="2" fill="none" stroke="#d4af37" strokeWidth="0.6" opacity="0.4" />
          <circle cx="40" cy="40" r="2" fill="none" stroke="#d4af37" strokeWidth="0.6" opacity="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#royalJaaliPattern)" />
    </svg>
  );
};
