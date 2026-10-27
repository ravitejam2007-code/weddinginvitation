import React from 'react';

interface FloralSprigsProps {
  className?: string;
}

export const FloralSprigs: React.FC<FloralSprigsProps> = ({ className = '' }) => {
  return (
    <div className={`floral-sprigs-container ${className}`} aria-hidden="true">
      {/* Top Left Botanical Branch */}
      <svg
        className="botanical-branch botanical-top-left"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="leafSageGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9db79a" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#5d755c" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="leafSageGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b4c8b2" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6e876d" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="goldVeinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fae298" />
            <stop offset="100%" stopColor="#c89c37" />
          </linearGradient>
        </defs>

        {/* Main Arching Stem */}
        <path
          d="M10 230 C40 180 80 130 180 60 C210 40 230 20 235 10"
          stroke="#4e634d"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Golden Secondary Whisps */}
        <path
          d="M30 200 C60 160 110 130 190 90"
          stroke="url(#goldVeinGrad)"
          strokeWidth="1.2"
          strokeDasharray="2 3"
          opacity="0.85"
        />

        {/* Leaves along branch */}
        {/* Leaf 1 */}
        <g transform="translate(45, 175) rotate(-35)">
          <path d="M0 0 C-12 -25 0 -48 24 -36 C24 -12 12 0 0 0 Z" fill="url(#leafSageGrad1)" />
          <path d="M0 0 C6 -18 16 -30 24 -36" stroke="url(#goldVeinGrad)" strokeWidth="0.8" />
        </g>

        {/* Leaf 2 */}
        <g transform="translate(85, 140) rotate(25)">
          <path d="M0 0 C12 -28 32 -32 30 -10 C24 8 10 5 0 0 Z" fill="url(#leafSageGrad2)" />
          <path d="M0 0 C14 -12 24 -18 30 -10" stroke="url(#goldVeinGrad)" strokeWidth="0.8" />
        </g>

        {/* Leaf 3 */}
        <g transform="translate(120, 105) rotate(-40)">
          <path d="M0 0 C-14 -24 -6 -44 18 -38 C18 -15 8 0 0 0 Z" fill="url(#leafSageGrad1)" />
          <path d="M0 0 C4 -16 12 -28 18 -38" stroke="url(#goldVeinGrad)" strokeWidth="0.8" />
        </g>

        {/* Leaf 4 */}
        <g transform="translate(155, 75) rotate(30)">
          <path d="M0 0 C14 -22 28 -24 24 -6 C18 6 8 4 0 0 Z" fill="url(#leafSageGrad2)" />
          <path d="M0 0 C10 -10 18 -14 24 -6" stroke="url(#goldVeinGrad)" strokeWidth="0.8" />
        </g>

        {/* Leaf 5 - delicate tip */}
        <g transform="translate(195, 45) rotate(-20)">
          <path d="M0 0 C-8 -18 2 -32 16 -24 C14 -8 6 0 0 0 Z" fill="url(#leafSageGrad1)" />
          <path d="M0 0 C4 -10 10 -18 16 -24" stroke="url(#goldVeinGrad)" strokeWidth="0.6" />
        </g>

        {/* Small cream and blush blooms */}
        <g transform="translate(94 130)">
          <ellipse cx="0" cy="-4" rx="2.5" ry="4" fill="#fffdf9" />
          <ellipse cx="3.8" cy="-1.2" rx="2.5" ry="4" transform="rotate(72 3.8 -1.2)" fill="#fffdf9" />
          <ellipse cx="2.4" cy="3.2" rx="2.5" ry="4" transform="rotate(144 2.4 3.2)" fill="#fffdf9" />
          <ellipse cx="-2.4" cy="3.2" rx="2.5" ry="4" transform="rotate(216 -2.4 3.2)" fill="#fffdf9" />
          <ellipse cx="-3.8" cy="-1.2" rx="2.5" ry="4" transform="rotate(288 -3.8 -1.2)" fill="#fffdf9" />
          <circle r="1.5" fill="#d6b5ad" />
        </g>
        <g transform="translate(168 66) rotate(25)">
          <path d="M0 10 C-10 2 -7 -8 0 -12 C7 -8 10 2 0 10 Z" fill="#fffdf9" />
          <path d="M0 8 C-3 2 -2 -5 0 -9 C2 -5 3 2 0 8 Z" fill="#d6b5ad" />
          <path d="M0 -7 L0 2" stroke="#b18a4a" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </svg>

      {/* Bottom Right Botanical Branch (Mirrored and Complementary) */}
      <svg
        className="botanical-branch botanical-bottom-right"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M230 10 C200 60 160 110 60 180 C30 200 10 220 5 230"
          stroke="#4e634d"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M210 40 C180 80 130 110 50 150"
          stroke="url(#goldVeinGrad)"
          strokeWidth="1.2"
          strokeDasharray="2 3"
          opacity="0.85"
        />

        {/* Leaves */}
        <g transform="translate(195, 65) rotate(145)">
          <path d="M0 0 C-12 -25 0 -48 24 -36 C24 -12 12 0 0 0 Z" fill="url(#leafSageGrad1)" />
          <path d="M0 0 C6 -18 16 -30 24 -36" stroke="url(#goldVeinGrad)" strokeWidth="0.8" />
        </g>

        <g transform="translate(155, 100) rotate(-155)">
          <path d="M0 0 C12 -28 32 -32 30 -10 C24 8 10 5 0 0 Z" fill="url(#leafSageGrad2)" />
          <path d="M0 0 C14 -12 24 -18 30 -10" stroke="url(#goldVeinGrad)" strokeWidth="0.8" />
        </g>

        <g transform="translate(120, 135) rotate(140)">
          <path d="M0 0 C-14 -24 -6 -44 18 -38 C18 -15 8 0 0 0 Z" fill="url(#leafSageGrad1)" />
          <path d="M0 0 C4 -16 12 -28 18 -38" stroke="url(#goldVeinGrad)" strokeWidth="0.8" />
        </g>

        <g transform="translate(85, 165) rotate(-150)">
          <path d="M0 0 C14 -22 28 -24 24 -6 C18 6 8 4 0 0 Z" fill="url(#leafSageGrad2)" />
          <path d="M0 0 C10 -10 18 -14 24 -6" stroke="url(#goldVeinGrad)" strokeWidth="0.8" />
        </g>

        {/* Small blush rose and cream calla accent */}
        <g transform="translate(145 110)">
          <circle cx="0" cy="-3" r="3" fill="#d6b5ad" />
          <circle cx="3" cy="-1" r="3" fill="#ead1ca" />
          <circle cx="2" cy="3" r="3" fill="#d6b5ad" />
          <circle cx="-2" cy="3" r="3" fill="#ead1ca" />
          <circle cx="-3" cy="-1" r="3" fill="#d6b5ad" />
          <circle r="1.5" fill="#b18a4a" />
        </g>
        <g transform="translate(72 172) rotate(-35)">
          <path d="M0 10 C-9 2 -6 -8 0 -12 C6 -8 9 2 0 10 Z" fill="#fffdf9" />
          <path d="M0 8 C-2 2 -2 -5 0 -9 C2 -5 2 2 0 8 Z" fill="#ead1ca" />
          <path d="M0 -7 L0 2" stroke="#b18a4a" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
