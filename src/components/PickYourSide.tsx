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
            <span className="team-emoji" aria-hidden="true">🌸</span>
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
            <span className="team-emoji" aria-hidden="true">🍨</span>
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
                : `Team Groom — ${wedding.couple.groomName}! 🍨`}
            </strong>
          </p>
        </div>
      )}
    </section>
  );
};
