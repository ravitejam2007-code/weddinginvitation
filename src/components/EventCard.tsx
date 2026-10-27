import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, Shirt } from 'lucide-react';
import type { WeddingEvent } from '../data/events';
import { downloadEventCalendar } from '../data/events';
import { formatWeddingDateChip } from '../data/wedding';
import { wedding } from '../data/wedding';

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

  return (
    <div
      className={`timeline-entry-row ${isEven ? 'timeline-row-even' : 'timeline-row-odd'}`}
      id={`event-${event.id}`}
    >
      {/* Central Timeline Milestone Node on Desktop / Left node on Mobile */}
      <div className="timeline-spine-node" aria-hidden="true">
        <div className="milestone-flower-bullet">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <circle cx="12" cy="12" r="5" fill="#fdfbf7" stroke="#d4af37" strokeWidth="2.5" />
            <circle cx="12" cy="12" r="2.5" fill="#688467" />
          </svg>
        </div>
        <div className="milestone-date-chip">{formatWeddingDateChip(event.calendarDate)}</div>
      </div>

      {/* The Individual Paper Stationery Card */}
      <article
        className={`event-stationery-card deckled-paper ${event.hasScratchReveal ? 'has-scratch-card' : ''}`}
        aria-label={`${event.title} - ${event.date}`}
      >
        {/* Restrained Floral & Gold Hairline Border Frame */}
        <div className="event-card-floral-frame" aria-hidden="true">
          <div className="frame-corner top-left">
            <svg viewBox="0 0 28 28" width="22" height="22" fill="none">
              <path d="M2 26 L2 2 L26 2" stroke="#d4af37" strokeWidth="0.8" />
              <path d="M4 4 C10 8, 12 6, 16 2" stroke="#688467" strokeWidth="0.9" />
              <circle cx="16" cy="2" r="1.2" fill="#d4af37" />
              <circle cx="4" cy="4" r="1.2" fill="#688467" />
            </svg>
          </div>
          <div className="frame-corner top-right">
            <svg viewBox="0 0 28 28" width="22" height="22" fill="none">
              <path d="M26 26 L26 2 L2 2" stroke="#d4af37" strokeWidth="0.8" />
              <path d="M24 4 C18 8, 16 6, 12 2" stroke="#688467" strokeWidth="0.9" />
              <circle cx="12" cy="2" r="1.2" fill="#d4af37" />
              <circle cx="24" cy="4" r="1.2" fill="#688467" />
            </svg>
          </div>
          <div className="frame-corner bottom-left">
            <svg viewBox="0 0 28 28" width="22" height="22" fill="none">
              <path d="M2 2 L2 26 L26 26" stroke="#d4af37" strokeWidth="0.8" />
              <path d="M4 24 C10 20, 12 22, 16 26" stroke="#688467" strokeWidth="0.9" />
              <circle cx="16" cy="26" r="1.2" fill="#d4af37" />
              <circle cx="4" cy="24" r="1.2" fill="#688467" />
            </svg>
          </div>
          <div className="frame-corner bottom-right">
            <svg viewBox="0 0 28 28" width="22" height="22" fill="none">
              <path d="M26 2 L26 26 L2 26" stroke="#d4af37" strokeWidth="0.8" />
              <path d="M24 24 C18 20, 16 22, 12 26" stroke="#688467" strokeWidth="0.9" />
              <circle cx="12" cy="26" r="1.2" fill="#d4af37" />
              <circle cx="24" cy="24" r="1.2" fill="#688467" />
            </svg>
          </div>
        </div>

        {/* Card Header & Small Event Illustration */}
        <div className="event-card-top-header">
          <div className="event-title-stack">
            <span className="event-date-eyebrow">
              {(wedding.confirmation.eventSchedule ? event.date : 'DATE TO BE CONFIRMED').toUpperCase()}
            </span>
            <h3 className="event-card-title">{event.title}</h3>
            {event.vernacularTitle && (
              <p className="event-card-subtitle">{event.vernacularTitle}</p>
            )}
          </div>

          {/* Small Event Artwork Illustration Thumbnail */}
          <div className="event-mini-illustration-box">
            <button
              type="button"
              className={`event-thumb-interactive-btn ${event.hasScratchReveal ? 'btn-scratch-pulse' : ''}`}
              onClick={() => onTriggerReveal?.(event.id)}
              aria-label={
                event.hasScratchReveal
                  ? `Scratch to reveal ${event.title} illustration`
                  : `View ${event.title} illustration`
              }
              title={
                event.hasScratchReveal
                  ? '✨ Scratch to reveal artwork'
                  : 'Tap to view ceremony details'
              }
            >
              <img
                src={event.image}
                alt={`${event.title} small illustration`}
                className="event-thumb-img"
              />
              {event.hasScratchReveal ? (
                <span className="thumb-scratch-overlay-pill">
                  <Sparkles size={11} />
                  <span>SCRATCH</span>
                </span>
              ) : event.interactiveActionLabel ? (
                <span className="thumb-interactive-hint-pill">
                  <span>TAP</span>
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {/* Poetic description / quote */}
        <blockquote className="event-card-quote">
          &ldquo;{event.quote}&rdquo;
        </blockquote>

        {/* Event Key Details List (Time, Venue, Dress Code) */}
        <div className="event-details-grid">
          {/* Start Time */}
          <div className="detail-item-row">
            <div className="detail-icon-wrap" aria-hidden="true">
              <Clock size={14} className="detail-icon" />
            </div>
            <div className="detail-content">
              <span className="detail-label">TIME</span>
                <span className="detail-val">
                  {wedding.confirmation.eventSchedule ? event.startTime : 'Time to be confirmed'}
                </span>
            </div>
          </div>

          {/* Venue & Location */}
          <div className="detail-item-row">
            <div className="detail-icon-wrap" aria-hidden="true">
              <MapPin size={14} className="detail-icon" />
            </div>
            <div className="detail-content">
              <span className="detail-label">VENUE</span>
              <span className="detail-val">
                {wedding.confirmation.venue ? event.venue : 'Venue to be confirmed'}
              </span>
              {wedding.confirmation.venue && <span className="detail-sub-addr">{event.venueAddress}</span>}
            </div>
          </div>

          {/* Dress Code with Muted Sage Accent */}
          <div className="detail-item-row">
            <div className="detail-icon-wrap" aria-hidden="true">
              <Shirt size={14} className="detail-icon" />
            </div>
            <div className="detail-content">
              <span className="detail-label">DRESS CODE</span>
              <span className="dress-code-pill">
                {wedding.confirmation.dressCodes ? event.dressCode : 'To be confirmed'}
              </span>
              {wedding.confirmation.dressCodes && event.dressCodeTheme && (
                <span className="detail-sub-addr">{event.dressCodeTheme}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Row: Directions, Calendar, and Optional Scratch-to-Reveal */}
        <div className="event-card-actions-row">
          {wedding.confirmation.venue && (
            <a
              href={event.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="event-action-link"
              title={`Get Google Maps directions to ${event.venue}`}
            >
              <MapPin size={13} />
              <span>Directions</span>
            </a>
          )}

          <button
            type="button"
            className="event-action-link"
            onClick={() => downloadEventCalendar(event)}
            title={`Add ${event.title} to calendar (.ics)`}
            disabled={!wedding.confirmation.eventSchedule}
          >
            <Calendar size={13} />
            <span>{wedding.confirmation.eventSchedule ? '+ Add to Calendar' : 'Calendar details pending'}</span>
          </button>

          {/* Scratch-to-reveal button for selected cards only */}
          {event.hasScratchReveal && (
            <button
              type="button"
              className="event-action-link btn-scratch-action"
              onClick={() => onTriggerReveal?.(event.id)}
              title="Open turmeric scratch-off reveal card"
            >
              <Sparkles size={13} />
              <span>Scratch to Reveal</span>
            </button>
          )}
        </div>
      </article>
    </div>
  );
};
