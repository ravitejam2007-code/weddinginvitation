import React from 'react';
import { Calendar, Shirt } from 'lucide-react';
import type { WeddingEvent } from '../data/events';
import { downloadEventCalendar } from '../data/events';
import { formatWeddingDateChip } from '../data/wedding';

interface EventCardProps {
  event: WeddingEvent;
  index: number;
  onTriggerReveal?: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  index,
  onTriggerReveal,
}) => {
  const isEven = index % 2 === 0;

  // Render masked scratch card thumbnail matching reference video frame_07 & frame_29
  const renderMaskedThumbnail = (id: string, imageSrc: string) => {
    switch (id) {
      case 'haldi':
        return (
          <div className="masked-thumbnail-card haldi-mask-card">
            <div className="mask-card-garland" />
            <div className="mask-haldi-heading">
              <span className="mask-eyebrow-text">Manjal Neerattu</span>
              <span className="mask-ceremony-word">Haldi</span>
            </div>
            <img src={imageSrc} alt="Haldi ceremony" className="mask-bottom-illustration" />
            <div className="mask-card-ribbon haldi-ribbon">
              <span>RUB TO REVEAL</span>
            </div>
          </div>
        );
      case 'mehndi':
        return (
          <div className="masked-thumbnail-card mehndi-mask-card">
            <div className="mask-mehndi-body">
              <div className="mask-dashed-heart-icon">
                <svg viewBox="0 0 40 36" width="34" height="30" fill="none">
                  <path
                    d="M20 32 C10 23, 2 16, 2 9 C2 3.5, 6.5 1, 12 1 C16 1, 18.5 3, 20 5.5 C21.5 3, 24 1, 28 1 C33.5 1, 38 3.5, 38 9 C38 16, 30 23, 20 32 Z"
                    stroke="#c47151"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                </svg>
              </div>
            </div>
            <img src={imageSrc} alt="Mehndi ceremony" className="mask-bottom-illustration" />
            <div className="mask-card-ribbon mehndi-ribbon">
              <span>TRACE THE HEART</span>
            </div>
          </div>
        );
      case 'sangeet':
        return (
          <div className="masked-thumbnail-card sangeet-mask-card">
            <div className="mask-sangeet-dhol-wrap">
              <svg viewBox="0 0 100 70" width="68" height="48" fill="none">
                <defs>
                  <linearGradient id="thumbDholWoodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="60%" stopColor="#92400e" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>
                </defs>
                <ellipse cx="50" cy="35" rx="36" ry="24" fill="url(#thumbDholWoodGrad)" stroke="#fde68a" strokeWidth="1.2" />
                <ellipse cx="18" cy="35" rx="9" ry="20" fill="#fef3c7" stroke="#78350f" strokeWidth="1.2" />
                <ellipse cx="82" cy="35" rx="9" ry="20" fill="#fef3c7" stroke="#78350f" strokeWidth="1.2" />
                <path d="M 18 20 L 50 15 L 82 20 L 50 30 L 18 38 L 50 48 L 82 38" stroke="#fef08a" strokeWidth="1.4" opacity="0.9" />
                <circle cx="50" cy="56" r="3" fill="#ef4444" />
                <circle cx="43" cy="57" r="2.5" fill="#f59e0b" />
                <circle cx="57" cy="57" r="2.5" fill="#10b981" />
              </svg>
            </div>
            <div className="mask-card-ribbon sangeet-ribbon">
              <span>TAP THE DHOL</span>
            </div>
          </div>
        );
      case 'wedding':
      default:
        return (
          <div className="masked-thumbnail-card wedding-mask-card">
            <div className="mask-sacred-om">ॐ</div>
            <img src={imageSrc} alt="The Wedding ceremony" className="mask-bottom-illustration" />
            <div className="mask-card-ribbon wedding-ribbon">
              <span>VIEW INVITATION</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`timeline-entry-row ${isEven ? 'timeline-row-even' : 'timeline-row-odd'}`}
      id={`event-${event.id}`}
    >
      {/* Central Timeline Milestone Node on Desktop / Left node on Mobile */}
      <div className="timeline-spine-node" aria-hidden="true">
        <div className="milestone-flower-bullet">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <circle cx="12" cy="12" r="5.5" fill="#ffffff" stroke="#c59b27" strokeWidth="2.5" />
            <circle cx="12" cy="12" r="2.5" fill="#861633" />
          </svg>
        </div>
        <div className="milestone-date-chip">{formatWeddingDateChip(event.calendarDate)}</div>
      </div>

      {/* The Individual Paper Stationery Card */}
      <article
        className="event-stationery-card deckled-paper"
        aria-label={`${event.title} - ${event.date}`}
      >
        {/* Restrained Floral & Gold Hairline Border Frame */}
        <div className="event-card-floral-frame" aria-hidden="true">
          <div className="frame-corner top-left">
            <svg viewBox="0 0 28 28" width="22" height="22" fill="none">
              <path d="M2 26 L2 2 L26 2" stroke="#d4af37" strokeWidth="0.8" />
              <path d="M4 4 C10 8, 12 6, 16 2" stroke="#c46d4c" strokeWidth="0.9" />
              <circle cx="16" cy="2" r="1.2" fill="#d4af37" />
              <circle cx="4" cy="4" r="1.2" fill="#c46d4c" />
            </svg>
          </div>
          <div className="frame-corner top-right">
            <svg viewBox="0 0 28 28" width="22" height="22" fill="none">
              <path d="M26 26 L26 2 L2 2" stroke="#d4af37" strokeWidth="0.8" />
              <path d="M24 4 C18 8, 16 6, 12 2" stroke="#c46d4c" strokeWidth="0.9" />
              <circle cx="12" cy="2" r="1.2" fill="#d4af37" />
              <circle cx="24" cy="4" r="1.2" fill="#c46d4c" />
            </svg>
          </div>
          <div className="frame-corner bottom-left">
            <svg viewBox="0 0 28 28" width="22" height="22" fill="none">
              <path d="M2 2 L2 26 L26 26" stroke="#d4af37" strokeWidth="0.8" />
              <path d="M4 24 C10 20, 12 22, 16 26" stroke="#c46d4c" strokeWidth="0.9" />
              <circle cx="16" cy="26" r="1.2" fill="#d4af37" />
              <circle cx="4" cy="24" r="1.2" fill="#c46d4c" />
            </svg>
          </div>
          <div className="frame-corner bottom-right">
            <svg viewBox="0 0 28 28" width="22" height="22" fill="none">
              <path d="M26 2 L26 26 L2 26" stroke="#d4af37" strokeWidth="0.8" />
              <path d="M24 24 C18 20, 16 22, 12 26" stroke="#c46d4c" strokeWidth="0.9" />
              <circle cx="12" cy="26" r="1.2" fill="#d4af37" />
              <circle cx="24" cy="24" r="1.2" fill="#c46d4c" />
            </svg>
          </div>
        </div>

        {/* Card Main Body: Info on Left, Masked Scratch Preview Card on Right */}
        <div className="event-card-split-layout">
          {/* Left: Event Details */}
          <div className="event-card-left-info">
            <span className="event-date-eyebrow">{event.date.toUpperCase()}</span>
            <h3 className="event-card-title">{event.title}</h3>
            {event.vernacularTitle && (
              <p className="event-card-subtitle">{event.vernacularTitle}</p>
            )}

            <div className="event-timing-venue-line">
              <span>{event.startTime} &bull; {event.venue}</span>
            </div>

            {event.dressCode && (
              <div className="event-dress-code-badge">
                <Shirt size={13} className="dress-icon" />
                <span>Dress code: {event.dressCode}</span>
              </div>
            )}

            {/* Poetic description / quote */}
            <blockquote className="event-card-quote">
              &ldquo;{event.quote}&rdquo;
            </blockquote>

            {/* Add to Calendar Button (from video) */}
            <div className="event-calendar-btn-wrap">
              <button
                type="button"
                className="btn-add-to-calendar"
                onClick={() => downloadEventCalendar(event)}
                title={`Add ${event.title} to your calendar (.ics)`}
              >
                <Calendar size={13} />
                <span>+ ADD TO CALENDAR</span>
              </button>
            </div>
          </div>

          {/* Right: Masked Scratch Preview Card (Matching Reference Video) */}
          <div className="event-card-right-preview">
            <button
              type="button"
              className="event-preview-card-button"
              onClick={() => onTriggerReveal?.(event.id)}
              aria-label={`Open interactive card for ${event.title}`}
              title={`Tap to explore ${event.title}`}
            >
              {renderMaskedThumbnail(event.id, event.image)}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};
