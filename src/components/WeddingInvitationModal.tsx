import React from 'react';
import { X, Calendar, MapPin } from 'lucide-react';
import { downloadEventCalendar } from '../data/events';
import { formatWeddingDate, getWeddingEvent, wedding } from '../data/wedding';
import { GaneshaMotif } from './GaneshaMotif';

interface WeddingInvitationModalProps {
  onClose: () => void;
}

export const WeddingInvitationModal: React.FC<WeddingInvitationModalProps> = ({ onClose }) => {
  const event = getWeddingEvent('wedding');

  return (
    <div className="ceremony-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="wedding-modal-title">
      <div className="ceremony-modal-card deckled-paper wedding-preview-modal-card">
        {/* Top bar with close button */}
        <div className="modal-top-bar">
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Close wedding preview"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Inner Content */}
        <div className="revealed-content-frame wedding-modal-frame">
          <div className="wedding-modal-ornate-header">
            <GaneshaMotif size={36} embossed={true} />
            <span className="shloka-mini">|| श्री गणेशाय नमः ||</span>
          </div>

          <div className="wedding-modal-portrait-wrap">
            <img
              src={event.image}
              alt={`${wedding.couple.brideName} and ${wedding.couple.groomName} in wedding attire`}
              className="ceremony-artwork-img wedding-portrait-featured"
            />
          </div>

          <div className="ceremony-details-sheet">
            <span className="ceremony-date-badge">{formatWeddingDate(event.date).toUpperCase()}</span>
            <h3 id="wedding-modal-title" className="ceremony-modal-title">{event.title}</h3>
            <p className="ceremony-tamil-title">The Sacred Muhurtham &amp; Saptapadi</p>

            {/* Couple Callout */}
            <div className="modal-couple-names-row">
              <span className="modal-couple-name">{wedding.couple.brideName}</span>
              <span className="modal-couple-amp">&amp;</span>
              <span className="modal-couple-name">{wedding.couple.groomName}</span>
            </div>

            <p className="modal-parents-sub">
              D/o {wedding.families.bride.parents} &bull; S/o {wedding.families.groom.parents}
            </p>

            <blockquote className="ceremony-modal-quote">
              &ldquo;{event.quote}&rdquo;
            </blockquote>

            <div className="wedding-modal-meta-grid">
              <div className="modal-meta-cell">
                <span className="meta-cell-label">TIME</span>
                <span className="meta-cell-val">6:00 PM Onwards</span>
              </div>
              <div className="modal-meta-cell">
                <span className="meta-cell-label">VENUE</span>
                <span className="meta-cell-val">{wedding.venue.name}</span>
              </div>
              <div className="modal-meta-cell">
                <span className="meta-cell-label">DRESS CODE</span>
                <span className="meta-cell-val">Traditional Royal Silk</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="wedding-modal-actions">
              <button
                type="button"
                className="btn-modal-action-primary"
                onClick={() => downloadEventCalendar(event as unknown as Parameters<typeof downloadEventCalendar>[0])}
              >
                <Calendar size={15} />
                <span>+ Add to Calendar</span>
              </button>

              <a
                href={wedding.venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-modal-action-secondary"
              >
                <MapPin size={15} />
                <span>View Venue Map</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
