import React from 'react';
import { GaneshaMotif } from './GaneshaMotif';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { formatWeddingDate, formatWeddingTime, wedding } from '../data/wedding';

interface InvitationCardProps {
  onClose?: () => void;
  isOpen: boolean;
  onExploreSuite?: () => void;
  className?: string;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  onClose,
  isOpen,
  onExploreSuite,
  className = '',
}) => {
  return (
    <article
      className={`invitation-card-container ${isOpen ? 'card-open' : 'card-closed'} ${className}`}
      aria-label={`Wedding Invitation Card for ${wedding.couple.brideName} and ${wedding.couple.groomName}`}
    >
      <div className="invitation-card-inner deckled-paper">
        {/* Thin Decorative Double Gold Border & Filigree Corners */}
        <div className="card-ornate-frame" aria-hidden="true">
          <div className="corner-filigree top-left">
            <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
              <path d="M2 38 L2 2 L38 2" stroke="#d4af37" strokeWidth="1.2" />
              <path d="M6 34 L6 6 L34 6" stroke="#d4af37" strokeWidth="0.6" strokeDasharray="2 2" />
              <path d="M6 6 C12 12, 18 10, 22 4 C16 10, 10 16, 4 22" stroke="#c46d4c" strokeWidth="1" />
              <circle cx="22" cy="4" r="1.5" fill="#d4af37" />
              <circle cx="4" cy="22" r="1.5" fill="#d4af37" />
              <circle cx="14" cy="14" r="2" fill="#fad674" />
            </svg>
          </div>

          <div className="corner-filigree top-right">
            <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
              <path d="M38 38 L38 2 L2 2" stroke="#d4af37" strokeWidth="1.2" />
              <path d="M34 34 L34 6 L6 6" stroke="#d4af37" strokeWidth="0.6" strokeDasharray="2 2" />
              <path d="M34 6 C28 12, 22 10, 18 4 C24 10, 30 16, 36 22" stroke="#c46d4c" strokeWidth="1" />
              <circle cx="18" cy="4" r="1.5" fill="#d4af37" />
              <circle cx="36" cy="22" r="1.5" fill="#d4af37" />
              <circle cx="26" cy="14" r="2" fill="#fad674" />
            </svg>
          </div>

          <div className="corner-filigree bottom-left">
            <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
              <path d="M2 2 L2 38 L38 38" stroke="#d4af37" strokeWidth="1.2" />
              <path d="M6 6 L6 34 L34 34" stroke="#d4af37" strokeWidth="0.6" strokeDasharray="2 2" />
              <path d="M6 34 C12 28, 18 30, 22 36 C16 30, 10 24, 4 18" stroke="#c46d4c" strokeWidth="1" />
              <circle cx="22" cy="36" r="1.5" fill="#d4af37" />
              <circle cx="4" cy="18" r="1.5" fill="#d4af37" />
              <circle cx="14" cy="26" r="2" fill="#fad674" />
            </svg>
          </div>

          <div className="corner-filigree bottom-right">
            <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
              <path d="M38 2 L38 38 L2 38" stroke="#d4af37" strokeWidth="1.2" />
              <path d="M34 6 L34 34 L6 34" stroke="#d4af37" strokeWidth="0.6" strokeDasharray="2 2" />
              <path d="M34 34 C28 28, 22 30, 18 36 C24 30, 30 24, 36 18" stroke="#c46d4c" strokeWidth="1" />
              <circle cx="18" cy="36" r="1.5" fill="#d4af37" />
              <circle cx="36" cy="18" r="1.5" fill="#d4af37" />
              <circle cx="26" cy="26" r="2" fill="#fad674" />
            </svg>
          </div>
        </div>

        {/* Card Header & Sacred Invocation */}
        <header className="card-header reveal-item-1">
          <div className="shree-ganesha-badge">
            <GaneshaMotif size={32} embossed={true} />
            <span className="shloka-text">|| श्री गणेशाय नमः ||</span>
          </div>
        </header>

        {/* Illustrated Portrait from Reference Video */}
        <div className="card-portrait-feature reveal-item-2">
          <img
            src="/images/couple_portrait.jpg"
            alt={`${wedding.couple.brideName} and ${wedding.couple.groomName} in traditional wedding attire`}
            className="card-portrait-thumb"
          />
        </div>

        {/* Main Announcement Content */}
        <div className="card-body">
          <div className="reveal-item-2">
            <p className="invitation-lead-text">
              Together with their families
            </p>

            <div className="family-introduction-block">
              <span className="family-names">{wedding.families.bride.parents}</span>
              <span className="family-ampersand">&amp;</span>
              <span className="family-names">{wedding.families.groom.parents}</span>
            </div>

            <p className="invitation-request-phrase">
              cordially request the honor of your presence to celebrate the wedding ceremony of their children
            </p>
          </div>

          {/* Couple Names (Serif & Calligraphic Type) */}
          <div className="couple-announcement-wrap reveal-item-3">
            <div className="bride-callout">
              <h1 className="couple-name bride-name">{wedding.couple.brideName}</h1>
              <p className="couple-lineage">Daughter of {wedding.families.bride.parents}</p>
            </div>

            <div className="calligraphic-ampersand" aria-hidden="true">
              &amp;
            </div>

            <div className="groom-callout">
              <h1 className="couple-name groom-name">{wedding.couple.groomName}</h1>
              <p className="couple-lineage">Son of {wedding.families.groom.parents}</p>
            </div>
          </div>

          {/* Wedding Announcement Details */}
          <div className="wedding-announcement-box reveal-item-4">
            <div className="announcement-divider-line" aria-hidden="true" />
            
            <p className="announcement-celebration-tag">AT THEIR WEDDING CELEBRATION</p>
            <p className="announcement-time-line">From {formatWeddingTime(wedding.ceremony.startTime)} onwards</p>
            <p className="announcement-date-highlight">{formatWeddingDate(wedding.ceremony.date)}</p>
            
            <div className="announcement-venue-row">
              <span className="venue-pin-icon" aria-hidden="true">📍</span>
              <span className="announcement-venue-name">Venue: {wedding.venue.name}</span>
            </div>

            <div className="announcement-divider-line" aria-hidden="true" />
          </div>

          {/* Transition Button to Main Suite */}
          <div className="card-scroll-guide reveal-item-5">
            <button
              type="button"
              className="btn-scroll-to-suite"
              onClick={onExploreSuite}
              title="Continue to full wedding festivities, itinerary and RSVP"
            >
              <span>SEE ALL CELEBRATIONS</span>
              <ChevronDown size={15} className="bounce-arrow" />
            </button>

            {onClose && (
              <button
                type="button"
                className="btn-reseal-small"
                onClick={onClose}
                title="Close and seal invitation"
              >
                <RotateCcw size={12} />
                <span>Re-seal</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer Blessing */}
        <footer className="card-footer-mini">
          <span className="mini-hashtag">{wedding.couple.hashtag}</span>
        </footer>
      </div>
    </article>
  );
};
