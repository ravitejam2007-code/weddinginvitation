import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WaxSeal } from './WaxSeal';
import { InvitationCard } from './InvitationCard';
import { EnvelopeLinerPattern } from './EnvelopeLinerPattern';
import { FloralSprigs } from './FloralSprigs';
import { soundEffects } from '../utils/audio';
import { fireGoldSparkles } from '../utils/confetti';
import { Sparkles, Volume2, VolumeX, Eye } from 'lucide-react';

export interface SealedEnvelopeProps {
  sealMotif?: 'ganesha' | 'monogram';
  onStateChange?: (isOpen: boolean) => void;
  onExploreSuite?: () => void;
}

export const SealedEnvelope: React.FC<SealedEnvelopeProps> = ({
  sealMotif = 'ganesha',
  onStateChange,
  onExploreSuite,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [currentMotif, setCurrentMotif] = useState<'ganesha' | 'monogram'>(sealMotif);
  const [isMuted, setIsMuted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const envelopeRef = useRef<HTMLDivElement>(null);

  // Detect system reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Sync mute state
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
  };

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
      const y = (rect.top + rect.height * 0.55) / window.innerHeight;
      fireGoldSparkles(x, y);
    } else {
      fireGoldSparkles(0.5, 0.45);
    }

    const transitionDuration = reducedMotion ? 50 : 500;

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
    <div className="sealed-envelope-experience">
      {/* Background Floral Sprigs */}
      <FloralSprigs />

      {/* Floating Controls Bar (Mute, Motif Toggle, Reduced Motion) */}
      <header className="top-utility-bar" aria-label="Invitation Options">
        <div className="utility-group">
          {/* Audio Toggle */}
          <button
            type="button"
            className="utility-btn"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute paper & seal sounds" : "Mute paper & seal sounds"}
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span className="utility-label">{isMuted ? "Sound Off" : "Sound On"}</span>
          </button>

          {/* Motif Switcher (Ganesha / Monogram) */}
          <button
            type="button"
            className="utility-btn motif-toggle-btn"
            onClick={() => setCurrentMotif((m) => (m === 'ganesha' ? 'monogram' : 'ganesha'))}
            aria-label={`Current seal emblem: ${currentMotif}. Tap to switch.`}
            title="Toggle between Ganesha motif and Family Monogram"
          >
            <Sparkles size={16} />
            <span className="utility-label">
              Seal: {currentMotif === 'ganesha' ? 'Ganesha Motif' : 'Royal Monogram'}
            </span>
          </button>

          {/* Reduced Motion Toggle */}
          <button
            type="button"
            className={`utility-btn ${reducedMotion ? 'active-utility' : ''}`}
            onClick={() => setReducedMotion((r) => !r)}
            aria-label={reducedMotion ? "Enable full animations" : "Reduce motion animations"}
            title="Toggle motion accessibility"
          >
            <Eye size={16} />
            <span className="utility-label">{reducedMotion ? "Motion: Reduced" : "Motion: Full"}</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="envelope-stage">
        {/* Instruction Header */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              className="envelope-instruction-container"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
            >
              <div className="instruction-badge">
                <span className="instruction-icon" aria-hidden="true">✉</span>
                <h2 className="instruction-text" id="envelope-prompt-text">
                  Tap the envelope to open.
                </h2>
              </div>
              <p className="instruction-sub">An auspicious celebration awaits</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The 3D Envelope Artifact */}
        <div
          ref={envelopeRef}
          className={`envelope-container ${isOpen ? 'state-opened' : 'state-sealed'} ${isOpening ? 'state-opening' : ''} ${reducedMotion ? 'reduced-motion' : ''}`}
          onClick={!isOpen ? handleOpenEnvelope : undefined}
          role={!isOpen ? "button" : "region"}
          tabIndex={!isOpen ? 0 : -1}
          aria-labelledby="envelope-prompt-text"
          onKeyDown={(e) => {
            if (!isOpen && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleOpenEnvelope();
            }
          }}
        >
          {/* Subtle desk drop shadow that expands on open */}
          <div className="envelope-cast-shadow" aria-hidden="true" />

          {/* 1. Envelope Back Shell */}
          <div className="envelope-layer-back">
            {/* 2. Inner Pattern Lining inside the pocket */}
            <div className="envelope-inner-liner">
              <EnvelopeLinerPattern />
            </div>
          </div>

          {/* 3. The Invitation Card (slips out of the pocket) */}
          <div className={`envelope-card-slot ${isOpen ? 'slot-open' : 'slot-closed'}`}>
            <InvitationCard
              isOpen={isOpen}
              onClose={handleCloseEnvelope}
              onExploreSuite={onExploreSuite}
            />
          </div>

          {/* 4. Envelope Front Pocket (Left, Right, Bottom Triangles) */}
          <div className="envelope-front-pocket" aria-hidden="true">
            {/* Left triangular side fold */}
            <div className="pocket-fold pocket-fold-left" />
            {/* Right triangular side fold */}
            <div className="pocket-fold pocket-fold-right" />
            {/* Bottom triangular upward fold */}
            <div className="pocket-fold pocket-fold-bottom" />
            {/* Front gold embossed deckle edge line */}
            <div className="pocket-gold-accent" />
          </div>

          {/* 5. Envelope Top Flap (Triangular flap that hinges open in 3D) */}
          <div className="envelope-flap-hinge" aria-hidden="true">
            <div className="flap-front">
              {/* Sage green outer flap triangle */}
              <div className="flap-triangle-sage" />
            </div>
            <div className="flap-back">
              {/* Inner Jaali gold damask lining revealed when flap folds backwards */}
              <div className="flap-triangle-liner">
                <EnvelopeLinerPattern />
              </div>
            </div>
          </div>

          {/* 6. Wax Seal Element */}
          <div className="envelope-wax-seal-anchor">
            <WaxSeal
              isOpen={isOpen}
              isOpening={isOpening}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEnvelope(e);
              }}
              motif={currentMotif}
              disabled={isOpen}
            />
          </div>
        </div>

        {/* Post-open helper message */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="open-state-helper"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <button
                type="button"
                className="btn-replay-envelope"
                onClick={handleCloseEnvelope}
                title="Close and seal the envelope again"
              >
                <span>Tap here to close &amp; seal envelope</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
