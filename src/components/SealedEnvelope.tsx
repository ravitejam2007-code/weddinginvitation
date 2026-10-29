import React, { useState, useRef, useEffect } from 'react';
import { InvitationCard } from './InvitationCard';
import { ToranMotif } from './ToranMotif';
import { soundEffects } from '../utils/audio';
import { fireGoldSparkles } from '../utils/confetti';
import { wedding } from '../data/wedding';

export interface SealedEnvelopeProps {
  initialOpen?: boolean;
  onStateChange?: (isOpen: boolean) => void;
  onExploreSuite?: () => void;
  sealMotif?: string;
}

export const SealedEnvelope: React.FC<SealedEnvelopeProps> = ({
  initialOpen = false,
  onStateChange,
  onExploreSuite,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [prevInitialOpen, setPrevInitialOpen] = useState(initialOpen);
  if (initialOpen !== prevInitialOpen) {
    setPrevInitialOpen(initialOpen);
    if (initialOpen) {
      setIsOpen(true);
    }
  }
  const [isOpening, setIsOpening] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const envelopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Open gesture handler
  const handleOpenEnvelope = (e?: React.MouseEvent | React.TouchEvent) => {
    if (isOpen || isOpening) return;

    setIsOpening(true);

    // Play sounds
    soundEffects.playWaxBreak();
    setTimeout(() => {
      soundEffects.playPaperRustle();
    }, 280);

    // Trigger gold sparkle particles
    if (e && 'clientX' in e && window.innerWidth > 0) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      fireGoldSparkles(x, y);
    } else if (envelopeRef.current) {
      const rect = envelopeRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height * 0.5) / window.innerHeight;
      fireGoldSparkles(x, y);
    } else {
      fireGoldSparkles(0.5, 0.5);
    }

    const transitionDuration = reducedMotion ? 50 : 650;

    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
      onStateChange?.(true);
    }, transitionDuration);
  };

  // Close / Re-seal envelope
  const handleCloseEnvelope = () => {
    if (!isOpen) return;
    soundEffects.playPaperRustle();
    setIsOpen(false);
    setIsOpening(false);
    onStateChange?.(false);
  };

  return (
    <div className={`sealed-envelope-experience ${isOpen ? 'is-opened-view' : 'is-sealed-view'}`}>
      {/* Main Interactive Full-Screen Palace Gate Stage */}
      <main className="envelope-stage">
        {/* The 3D Full-Screen Gatefold / Palace Doors */}
        <div
          ref={envelopeRef}
          className={`royal-gate-container ${isOpen ? 'state-opened' : 'state-sealed'} ${isOpening ? 'state-opening' : ''} ${reducedMotion ? 'reduced-motion' : ''}`}
          onClick={!isOpen ? handleOpenEnvelope : undefined}
          role={!isOpen ? "button" : "region"}
          tabIndex={!isOpen ? 0 : -1}
          aria-label={`Wedding Invitation Gate for ${wedding.couple.brideName} & ${wedding.couple.groomName}. Tap to open.`}
          onKeyDown={(e) => {
            if (!isOpen && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleOpenEnvelope();
            }
          }}
        >
          {/* Marigold Toran Garland across top edge of entire screen */}
          <div className="royal-gate-toran-bar" aria-hidden="true">
            <ToranMotif height={52} />
          </div>

          {/* Inside Layer: The Royal Invitation Card */}
          <div className={`royal-gate-inner-card ${isOpen ? 'card-revealed' : 'card-hidden'}`}>
            <InvitationCard
              isOpen={isOpen}
              onClose={handleCloseEnvelope}
              onExploreSuite={onExploreSuite}
            />
          </div>

          {/* Left Door / Gatefold Panel */}
          <div className="royal-gate-door gate-door-left" aria-hidden="true">
            <div className="gate-door-panel-texture">
              <div className="door-gold-border" />
              <div className="door-corner-accent top-left" />
              <div className="door-corner-accent bottom-left" />
            </div>
          </div>

          {/* Right Door / Gatefold Panel */}
          <div className="royal-gate-door gate-door-right" aria-hidden="true">
            <div className="gate-door-panel-texture">
              <div className="door-gold-border" />
              <div className="door-corner-accent top-right" />
              <div className="door-corner-accent bottom-right" />
            </div>
          </div>

          {/* Centerpiece Golden Ganesha Emblem (logoimage.png) in the green-marked place */}
          <div className={`royal-gate-seal-anchor ${isOpen ? 'seal-hidden' : 'seal-visible'}`}>
            <button
              type="button"
              className="royal-ganesha-emblem-seal"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEnvelope(e);
              }}
              aria-label="Open wedding invitation"
              title="Tap to open invitation"
            >
              <img
                src="/images/logoimage.png"
                alt="Lord Ganesha Emblem"
                className="ganesha-seal-logo-img"
              />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
