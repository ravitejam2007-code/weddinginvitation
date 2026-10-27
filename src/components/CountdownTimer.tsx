import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Calendar, Clock, MapPin, Heart } from 'lucide-react';
import { fireGoldSparkles } from '../utils/confetti';
import { formatWeddingDateShort, formatWeddingTime, wedding } from '../data/wedding';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

const WEDDING_TARGET_ISO = `${wedding.ceremony.date}T${wedding.ceremony.startTime}:00+05:30`;

export const CountdownTimer: React.FC = () => {
  // Asia/Kolkata UTC timestamp
  const targetTimestamp = new Date(WEDDING_TARGET_ISO).getTime();

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = Date.now();
    const difference = targetTimestamp - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      totalMs: difference,
    };
  }, [targetTimestamp]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
  const [isPreviewWeddingDay, setIsPreviewWeddingDay] = useState(false);

  useEffect(() => {
    // If target has already been reached in real-time, no need for interval
    if (!wedding.confirmation.weddingDateTime || timeLeft.totalMs <= 0) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining.totalMs <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, timeLeft.totalMs]);

  const isWeddingDay = wedding.confirmation.weddingDateTime && (timeLeft.totalMs <= 0 || isPreviewWeddingDay);

  const handleCelebrate = () => {
    fireGoldSparkles(0.5, 0.45);
  };

  const formatPad = (num: number) => String(num).padStart(2, '0');

  return (
    <section className="countdown-section-container" aria-labelledby="countdown-heading">
      {/* Clean Ivory Stationery Card */}
      <article className="countdown-ivory-card deckled-paper" aria-live="polite">
        <div className="countdown-hairline-frame" aria-hidden="true" />

        {/* ── STATE A: ACTIVE LIVE COUNTDOWN ── */}
        {!isWeddingDay ? (
          <div className="countdown-content-pad">
            {/* Small Refined Countdown Heading */}
            <header className="countdown-card-header">
              <span className="countdown-eyebrow-tag">AWAITING THE SACRED MUHURTHAM</span>
              <h3 id="countdown-heading" className="countdown-main-heading">
                Counting Down to the Sacred Vows
              </h3>
              <div className="countdown-meta-row">
                <span className="countdown-meta-item">
                  <Calendar size={12} className="meta-icon" />
                  <span>{wedding.confirmation.weddingDateTime ? formatWeddingDateShort(wedding.ceremony.date) : 'Date to be confirmed'}</span>
                </span>
                <span className="countdown-meta-bullet" aria-hidden="true">&bull;</span>
                <span className="countdown-meta-item">
                  <Clock size={12} className="meta-icon" />
                  <span>{wedding.confirmation.weddingDateTime ? `${formatWeddingTime(wedding.ceremony.startTime)} IST (${wedding.timezone})` : 'Time to be confirmed'}</span>
                </span>
                <span className="countdown-meta-bullet" aria-hidden="true">&bull;</span>
                <span className="countdown-meta-item">
                  <MapPin size={12} className="meta-icon" />
                  <span>{wedding.confirmation.venue ? wedding.venue.name : 'Venue to be confirmed'}</span>
                </span>
              </div>
            </header>

            {/* Large Serif Numerals Grid */}
            {wedding.confirmation.weddingDateTime ? (
            <div className="countdown-serif-grid" role="timer" aria-label="Time remaining until wedding">
              {/* Days */}
              <div className="serif-time-unit">
                <span className="serif-numeral">{formatPad(timeLeft.days)}</span>
                <span className="serif-unit-label">DAYS</span>
              </div>

              <span className="serif-separator" aria-hidden="true">:</span>

              {/* Hours */}
              <div className="serif-time-unit">
                <span className="serif-numeral">{formatPad(timeLeft.hours)}</span>
                <span className="serif-unit-label">HOURS</span>
              </div>

              <span className="serif-separator" aria-hidden="true">:</span>

              {/* Minutes */}
              <div className="serif-time-unit">
                <span className="serif-numeral">{formatPad(timeLeft.minutes)}</span>
                <span className="serif-unit-label">MINUTES</span>
              </div>

              <span className="serif-separator" aria-hidden="true">:</span>

              {/* Seconds */}
              <div className="serif-time-unit">
                <span className="serif-numeral">{formatPad(timeLeft.seconds)}</span>
                <span className="serif-unit-label">SECONDS</span>
              </div>
            </div>
            ) : (
              <p className="countdown-confirmation-note">The countdown will begin once the hosts confirm the ceremony date and time.</p>
            )}

            <div className="countdown-card-footer">
              <p className="countdown-blessing-sub">
                &ldquo;Every second brings us closer to the sacred seven steps and a lifetime of devotion.&rdquo;
              </p>

              {/* State Preview Toggle for Testing / Family Review */}
              {wedding.confirmation.weddingDateTime && <button
                type="button"
                className="btn-countdown-preview-toggle"
                onClick={() => setIsPreviewWeddingDay(true)}
                title="Preview the celebratory message displayed on wedding day"
              >
                <Sparkles size={11} />
                <span>Preview Wedding-Day Message</span>
              </button>}
            </div>
          </div>
        ) : (
          /* ── STATE B: CELEBRATORY WEDDING-DAY MESSAGE ── */
          <div className="wedding-day-message-pad">
            <div className="wedding-day-shloka" aria-hidden="true">
              <span>|| शुभ विवाह &bull; श्री गणेशाय नमः ||</span>
            </div>

            <div className="wedding-day-crest-icon" aria-hidden="true">
              <Sparkles size={28} className="crest-sparkle-icon" />
            </div>

            <span className="wedding-day-tag">THE AUSPICIOUS DAY HAS ARRIVED</span>
            <h3 className="wedding-day-title">Today We Become One</h3>

            <div className="wedding-day-couple-names">
              <span className="couple-name">{wedding.couple.brideName}</span>
              <span className="couple-amp">&amp;</span>
              <span className="couple-name">{wedding.couple.groomName}</span>
            </div>

            <p className="wedding-day-body">
              The sacred Muhurtham ceremonies are underway{wedding.confirmation.venue ? <> at <strong>{wedding.venue.formalName}</strong></> : ''}.
              With the cherished blessings of our elders and the divine grace of the Almighty, 
              our celebration of love and eternal vows begins today.
            </p>

            <div className="wedding-day-actions">
              <button
                type="button"
                className="btn-shower-blessings"
                onClick={handleCelebrate}
              >
                <Heart size={14} className="heart-pulse-icon" />
                <span>Shower Flower Blessings 🌸</span>
              </button>

              {/* Toggle Back to Live Countdown */}
              <button
                type="button"
                className="btn-back-to-timer"
                onClick={() => setIsPreviewWeddingDay(false)}
              >
                <span>&larr; View Live Countdown</span>
              </button>
            </div>
          </div>
        )}
      </article>
    </section>
  );
};
