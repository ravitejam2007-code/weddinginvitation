import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { fireGoldSparkles } from '../utils/confetti';
import { formatWeddingDate, getWeddingEvent, wedding } from '../data/wedding';

interface SangeetDholRevealProps {
  onClose: () => void;
}

export const SangeetDholReveal: React.FC<SangeetDholRevealProps> = ({ onClose }) => {
  const event = getWeddingEvent('sangeet');
  const [tapCount, setTapCount] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const targetBeats = 5;

  // Synthesize authentic Indian Dhol percussion beat (Dha / Ge / Na)
  const playDholBeat = (pitch: number) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      // Base thud (Ge)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

      oscGain.gain.setValueAtTime(0.45, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);

      // Treble snap (Ta/Na)
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'sine';
      snapOsc.frequency.setValueAtTime(pitch * 2.8, now);
      snapOsc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

      snapGain.gain.setValueAtTime(0.3, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.08);
    } catch {
      // Audio fails gracefully
    }
  };

  const handleDholTap = () => {
    if (isRevealed) return;

    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 140);

    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    // Varied beat pitch for rhythmic groove
    const pitches = [130, 165, 140, 180, 220];
    playDholBeat(pitches[(nextCount - 1) % pitches.length]);

    if (nextCount >= targetBeats) {
      handleCompleteReveal();
    }
  };

  const handleCompleteReveal = () => {
    setIsRevealed(true);
    fireGoldSparkles(0.5, 0.45);
  };

  return (
    <div className="ceremony-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sangeet-modal-title">
      <div className="ceremony-modal-card deckled-paper">
        {/* Minimal Modal Close Button */}
        <div className="modal-top-bar">
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Revealed Content Underneath */}
        <div className="revealed-content-frame">
          <img
            src={event.image}
            alt={`${event.title} with ${wedding.couple.brideName} & ${wedding.couple.groomName}`}
            className="ceremony-artwork-img"
          />

          <div className="ceremony-details-sheet">
            <span className="ceremony-date-badge">{formatWeddingDate(event.date).toUpperCase()}</span>
            <h3 id="sangeet-modal-title" className="ceremony-modal-title">{event.title}</h3>
            <p className="ceremony-tamil-title">An evening of song</p>
            <p className="ceremony-modal-time">{event.startTime} Onwards • {wedding.venue.name}</p>
            <blockquote className="ceremony-modal-quote">
              &ldquo;Music, dance and the whole family on its feet.&rdquo;
            </blockquote>
            <div className="ceremony-dress-hint">
              <span>Dress Code:</span> Royal Indo-Western &amp; Glitz
            </div>
          </div>
        </div>

        {/* Interactive Dhol Drum Layer from Reference Video frame_31 */}
        {!isRevealed && (
          <div className="dhol-interaction-overlay">
            <div className="dhol-center-stage">
              {/* Dhol Drum Vector Graphic */}
              <button
                type="button"
                className={`dhol-drum-button ${isBouncing ? 'dhol-bounce' : ''}`}
                onClick={handleDholTap}
                aria-label="Tap the dhol to the beat"
              >
                <svg
                  viewBox="0 0 220 160"
                  className="dhol-svg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="dholWoodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#d97706" />
                      <stop offset="50%" stopColor="#92400e" />
                      <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>
                    <radialGradient id="dholLeatherGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fef3c7" />
                      <stop offset="70%" stopColor="#fde68a" />
                      <stop offset="100%" stopColor="#d97706" />
                    </radialGradient>
                  </defs>

                  {/* Dhol Barrel */}
                  <ellipse cx="110" cy="80" rx="75" ry="54" fill="url(#dholWoodGrad)" stroke="#451a03" strokeWidth="3" />

                  {/* Dhol Drum Heads (Left and Right) */}
                  <ellipse cx="40" cy="80" rx="18" ry="46" fill="url(#dholLeatherGrad)" stroke="#78350f" strokeWidth="2.5" />
                  <ellipse cx="180" cy="80" rx="18" ry="46" fill="url(#dholLeatherGrad)" stroke="#78350f" strokeWidth="2.5" />

                  {/* Tuning Ropes / Straps (Zig-zag) */}
                  <path
                    d="M 40 40 L 110 30 L 180 40 L 110 60 L 40 80 L 110 100 L 180 80 L 110 130 L 40 120 M 180 120 L 110 100"
                    stroke="#fef08a"
                    strokeWidth="2.2"
                    fill="none"
                    opacity="0.9"
                  />

                  {/* Festive Tassels */}
                  <circle cx="110" cy="140" r="6" fill="#ef4444" />
                  <circle cx="95" cy="142" r="5" fill="#f59e0b" />
                  <circle cx="125" cy="142" r="5" fill="#10b981" />
                </svg>

                <span className="dhol-tap-label">Tap the dhol</span>
              </button>

              {/* Rhythm Beat Progress Dots from Video */}
              <div className="dhol-beat-dots" aria-label={`Beat ${tapCount} of ${targetBeats}`}>
                {Array.from({ length: targetBeats }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`beat-dot ${idx < tapCount ? 'dot-active' : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom instruction matching frame_31 */}
            <div className="dhol-bottom-caption">
              <span>TAP THE DHOL TO THE BEAT</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
