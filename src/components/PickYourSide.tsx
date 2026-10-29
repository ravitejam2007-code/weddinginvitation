import React from 'react';
import { fireGoldSparkles } from '../utils/confetti';
import { Check } from 'lucide-react';
import { wedding } from '../data/wedding';

interface PickYourSideProps {
  selectedSide: 'bride' | 'groom' | null;
  onSelectSide: (side: 'bride' | 'groom') => void;
}

export const PickYourSide: React.FC<PickYourSideProps> = ({
  selectedSide,
  onSelectSide,
}) => {
  const handleSelect = (side: 'bride' | 'groom') => {
    onSelectSide(side);
    fireGoldSparkles(side === 'bride' ? 0.35 : 0.65, 0.7);
  };

  return (
    <section className="pick-your-side-section" aria-labelledby="rivalry-heading">
      <div className="rivalry-header">
        <span className="rivalry-badge">A LITTLE FRIENDLY RIVALRY</span>
        <h2 id="rivalry-heading" className="rivalry-title">Pick your side</h2>
        <p className="rivalry-subtitle">
          Whose side are you cheering for? Tap to join &mdash; your pick rides along with your RSVP.
        </p>
      </div>

      <div className="rivalry-cards-container">
        {/* Team Bride Card */}
        <button
          type="button"
          className={`team-card team-bride-card ${selectedSide === 'bride' ? 'team-selected' : ''}`}
          onClick={() => handleSelect('bride')}
          aria-pressed={selectedSide === 'bride'}
        >
          {selectedSide === 'bride' && (
            <span className="team-status-badge">
              <Check size={12} />
              <span>YOU'RE IN</span>
            </span>
          )}
          <div className="team-avatar-wrap bride-avatar">
            {/* Traditional floral icon as in reference video */}
            <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
              <circle cx="20" cy="20" r="18" fill="#e11d48" />
              <circle cx="20" cy="20" r="15" fill="#f43f5e" />
              {/* Starry floral petals */}
              <circle cx="20" cy="20" r="3.5" fill="#ffffff" />
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <circle
                  key={deg}
                  cx={20 + 7 * Math.cos((deg * Math.PI) / 180)}
                  cy={20 + 7 * Math.sin((deg * Math.PI) / 180)}
                  r="2.5"
                  fill="#ffffff"
                  opacity="0.95"
                />
              ))}
            </svg>
          </div>
          <span className="team-label">Team Bride</span>
          <span className="team-member-name">{wedding.couple.brideName}</span>
        </button>

        <div className="rivalry-vs-badge" aria-hidden="true">
          <span>VS</span>
        </div>

        {/* Team Groom Card */}
        <button
          type="button"
          className={`team-card team-groom-card ${selectedSide === 'groom' ? 'team-selected' : ''}`}
          onClick={() => handleSelect('groom')}
          aria-pressed={selectedSide === 'groom'}
        >
          {selectedSide === 'groom' && (
            <span className="team-status-badge">
              <Check size={12} />
              <span>YOU'RE IN</span>
            </span>
          )}
          <div className="team-avatar-wrap groom-avatar">
            {/* Traditional Safa / Turban emblem as in reference video */}
            <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
              <circle cx="20" cy="20" r="18" fill="#d97706" />
              <circle cx="20" cy="20" r="15" fill="#f59e0b" />
              {/* Royal feather kalgi / crest */}
              <path
                d="M 20 8 C 22 13, 27 16, 27 21 C 27 26, 23 28, 20 28 C 17 28, 13 26, 13 21 C 13 16, 18 13, 20 8 Z"
                fill="#ffffff"
              />
              <circle cx="20" cy="21" r="2.5" fill="#b45309" />
              <circle cx="20" cy="12" r="1.5" fill="#fef08a" />
            </svg>
          </div>
          <span className="team-label">Team Groom</span>
          <span className="team-member-name">{wedding.couple.groomName}</span>
        </button>
      </div>

      {/* Confirmation feedback */}
      {selectedSide && (
        <div className="team-cheer-message">
          <p>
            You're cheering for{' '}
            <strong>
              {selectedSide === 'bride'
                ? `Team Bride — ${wedding.couple.brideName}! 🌸`
                : `Team Groom — ${wedding.couple.groomName}! 👑`}
            </strong>
          </p>
        </div>
      )}
    </section>
  );
};
