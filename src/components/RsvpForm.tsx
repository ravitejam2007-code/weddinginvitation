import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Check, 
  Share2, 
  Edit3 
} from 'lucide-react';
import { fireGoldSparkles } from '../utils/confetti';
import { weddingEvents, downloadFullWeddingCalendar } from '../data/events';
import { formatWeddingDateShort, wedding } from '../data/wedding';

interface RsvpFormProps {
  selectedTeam: 'bride' | 'groom' | null;
}

interface RsvpSubmission {
  guestName: string;
  phone?: string;
  attending: 'yes' | 'no';
  celebrations: string[];
  guestCount: number;
  personalMessage?: string;
  selectedTeam?: 'bride' | 'groom' | null;
  submittedAt: string;
}

const RSVP_STORAGE_KEY = `${wedding.couple.slug}_wedding_rsvp`;

const isRsvpSubmission = (value: unknown): value is RsvpSubmission => {
  if (typeof value !== 'object' || value === null) return false;
  const submission = value as Record<string, unknown>;

  return (
    typeof submission.guestName === 'string' &&
    (submission.attending === 'yes' || submission.attending === 'no') &&
    Array.isArray(submission.celebrations) &&
    typeof submission.guestCount === 'number' &&
    typeof submission.submittedAt === 'string'
  );
};

const readSavedRsvp = (): RsvpSubmission | null => {
  try {
    const saved = localStorage.getItem(RSVP_STORAGE_KEY);
    if (!saved) return null;

    const parsed: unknown = JSON.parse(saved);
    return isRsvpSubmission(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const RsvpForm: React.FC<RsvpFormProps> = ({ selectedTeam }) => {
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [celebrations, setCelebrations] = useState<string[]>(() => weddingEvents.map((event) => event.title));
  const [guestCount, setGuestCount] = useState(2);
  const [personalMessage, setPersonalMessage] = useState('');
  const [submittedData, setSubmittedData] = useState<RsvpSubmission | null>(readSavedRsvp);
  const [isSubmitted, setIsSubmitted] = useState(() => submittedData !== null);

  const toggleCelebration = (ceremonyTitle: string) => {
    setCelebrations((prev) =>
      prev.includes(ceremonyTitle) ? prev.filter((c) => c !== ceremonyTitle) : [...prev, ceremonyTitle]
    );
  };

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      alert('Please enter your name before sending your RSVP.');
      return;
    }

    fireGoldSparkles(0.5, 0.75);

    const submission: RsvpSubmission = {
      guestName: guestName.trim(),
      phone: phone.trim() || undefined,
      attending,
      celebrations: attending === 'yes' ? celebrations : [],
      guestCount: attending === 'yes' ? guestCount : 0,
      personalMessage: personalMessage.trim() || undefined,
      selectedTeam,
      submittedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    try {
      localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(submission));
    } catch {
      // Ignore storage errors
    }

    setSubmittedData(submission);
    setIsSubmitted(true);

    const teamText = selectedTeam
      ? `Cheering for: ${selectedTeam === 'bride' ? `Team Bride (${wedding.couple.brideName}) 🌸` : `Team Groom (${wedding.couple.groomName}) 👑`}\n`
      : '';

    const celebrationsText = attending === 'yes' 
      ? `Celebrations Attending: ${celebrations.join(', ')}\n` 
      : '';
      
    const guestText = attending === 'yes' 
      ? `Total Guests: ${guestCount}\n` 
      : '';

    const phoneText = phone.trim() ? `Contact: ${phone.trim()}\n` : '';
    const messageText = personalMessage.trim() 
      ? `Personal Message: "${personalMessage.trim()}"\n` 
      : '';

    const messageLines = [
      `🙏 *Namaste! Wedding RSVP for ${wedding.couple.brideName} & ${wedding.couple.groomName}*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `Name: ${guestName.trim()}`,
      phoneText,
      `Attendance: ${attending === 'yes' ? '✅ Joyfully Attending!' : '💐 Regretfully Declining'}`,
      guestText,
      celebrationsText,
      teamText,
      messageText,
      `━━━━━━━━━━━━━━━━━━━━`,
      `Submitted via Digital Wedding Invitation • ${wedding.venue.name}`,
    ]
      .filter(Boolean)
      .join('\n');

    const conciergeNumber = '919876543210';
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${conciergeNumber}&text=${encodeURIComponent(messageLines)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleShareWeddingInvite = () => {
    fireGoldSparkles(0.5, 0.4);
    const shareText = [
      `✨ *Wedding Invitation: ${wedding.couple.brideName} & ${wedding.couple.groomName}* ✨`,
      `You are warmly invited to celebrate our wedding on ${formatWeddingDateShort(wedding.ceremony.date)} at ${wedding.venue.formalName}.`,
      `View our wedding suite, ceremony itinerary, attire guide, and RSVP here:`,
      window.location.href,
      `\n${wedding.couple.hashtag} 🌸`,
    ].join('\n\n');

    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappShareUrl, '_blank');
  };

  const handleEditResponse = () => {
    setIsSubmitted(false);
  };

  return (
    <section className="rsvp-final-suite-section" aria-labelledby="rsvp-section-heading">
      <article className="rsvp-stationery-card deckled-paper" aria-label="RSVP Response Card">
        <div className="card-hairline-accent" aria-hidden="true" />

        <header className="rsvp-header-content">
          <span className="rsvp-eyebrow-tag">KINDLY RESPOND</span>
          <h2 id="rsvp-section-heading" className="rsvp-main-title">
            Will you join us?
          </h2>
          <p className="rsvp-deadline-text">
            Kindly reply by <strong>{formatWeddingDateShort(wedding.rsvpDeadline)}</strong>.<br />
            Your response opens straight in WhatsApp.
          </p>

          {/* Quick Calendar & Directions Pills from Video */}
          <div className="rsvp-quick-header-actions">
            <button
              type="button"
              className="btn-rsvp-quick-cal"
              onClick={() => downloadFullWeddingCalendar()}
              title="Add all wedding ceremonies to your calendar (.ics)"
            >
              <Calendar size={13} />
              <span>+ ADD WEDDING TO CALENDAR</span>
            </button>

            <a
              href={wedding.venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-rsvp-quick-dir"
              title="Open Google Maps directions to venue"
            >
              <MapPin size={13} />
              <span>DIRECTIONS</span>
            </a>
          </div>
        </header>

        {!isSubmitted ? (
          <form onSubmit={handleWhatsAppSend} className="rsvp-form-body">
            {/* Guest Name Input */}
            <div className="form-group-block">
              <label htmlFor="guest-full-name" className="form-field-label">
                YOUR NAME <span className="field-required">*</span>
              </label>
              <input
                id="guest-full-name"
                type="text"
                className="stationery-input"
                placeholder="e.g. Lakshmi Iyer"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            </div>

            {/* Optional Phone / WhatsApp Number */}
            <div className="form-group-block">
              <label htmlFor="guest-phone" className="form-field-label">
                PHONE / WHATSAPP NUMBER <span className="field-optional">(For hospitality updates)</span>
              </label>
              <input
                id="guest-phone"
                type="tel"
                className="stationery-input"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Will You Attend Toggle */}
            <div className="form-group-block">
              <span className="form-field-label">WILL YOU ATTEND?</span>
              <div className="attendance-toggle-pill-row" role="radiogroup" aria-label="Attendance response">
                <button
                  type="button"
                  role="radio"
                  aria-checked={attending === 'yes'}
                  className={`attendance-pill-btn ${attending === 'yes' ? 'pill-active-yes' : ''}`}
                  onClick={() => setAttending('yes')}
                >
                  <Check size={14} className="pill-check-icon" />
                  <span>Joyfully yes</span>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={attending === 'no'}
                  className={`attendance-pill-btn ${attending === 'no' ? 'pill-active-no' : ''}`}
                  onClick={() => setAttending('no')}
                >
                  <span>Regretfully no</span>
                </button>
              </div>
            </div>

            {/* If Attending: Celebrations & Guest Count */}
            {attending === 'yes' && (
              <div className="attending-details-accordion">
                {/* Which Celebrations */}
                <div className="form-group-block">
                  <span className="form-field-label">WHICH CELEBRATIONS? (tap all that apply)</span>
                  <div className="ceremonies-chip-selector" role="group" aria-label="Select ceremonies">
                    {weddingEvents.map((evt) => {
                      const isChecked = celebrations.includes(evt.title);
                      return (
                        <button
                          key={evt.id}
                          type="button"
                          className={`ceremony-select-chip ${isChecked ? 'chip-selected' : ''}`}
                          onClick={() => toggleCelebration(evt.title)}
                          aria-pressed={isChecked}
                        >
                          <span className="chip-indicator">
                            {isChecked ? <Check size={12} /> : null}
                          </span>
                          <span className="chip-event-name">{evt.title.replace(' Ceremony', '').replace(' Night', '')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Guest Count Stepper */}
                <div className="form-group-block">
                  <span className="form-field-label">NUMBER OF GUESTS</span>
                  <div className="stepper-counter-row">
                    <button
                      type="button"
                      className="stepper-adjust-btn"
                      onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                      disabled={guestCount <= 1}
                      aria-label="Decrease guest count"
                    >
                      &minus;
                    </button>
                    <span className="stepper-display-value">
                      <strong>{guestCount}</strong> {guestCount === 1 ? 'Guest' : 'Guests'}
                    </span>
                    <button
                      type="button"
                      className="stepper-adjust-btn"
                      onClick={() => setGuestCount((c) => Math.min(8, c + 1))}
                      disabled={guestCount >= 8}
                      aria-label="Increase guest count"
                    >
                      &#43;
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Optional Personal Message for the Couple */}
            <div className="form-group-block">
              <label htmlFor="personal-wishes-msg" className="form-field-label">
                A MESSAGE FOR THE COUPLE <span className="field-optional">(Optional)</span>
              </label>
              <textarea
                id="personal-wishes-msg"
                rows={3}
                className="stationery-textarea"
                placeholder={`Share a heartfelt blessing or warm wish for ${wedding.couple.brideName} & ${wedding.couple.groomName}...`}
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
              />
            </div>

            {/* WhatsApp Send Action Button */}
            <div className="form-submit-actions">
              <button type="submit" className="btn-primary-whatsapp-submit">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>SEND RSVP ON WHATSAPP</span>
              </button>

              <div className="rsvp-action-secondary-row">
                <p className="call-family-note">
                  Prefer to call?{' '}
                  <a href="tel:+919876543210" className="call-family-link">
                    Call the family
                  </a>
                </p>

                <button
                  type="button"
                  className="btn-secondary-share"
                  onClick={handleShareWeddingInvite}
                  title="Share wedding invitation on WhatsApp"
                >
                  <Share2 size={13} />
                  <span>Share Invite</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="rsvp-receipt-card">
            <div className="receipt-success-badge">
              <Check size={22} className="check-gold-icon" />
            </div>

            <span className="receipt-tag">RSVP CONFIRMED &bull; SENT VIA WHATSAPP</span>
            <h3 className="receipt-guest-name">Thank You, {submittedData?.guestName}!</h3>

            <p className="receipt-note">
              {submittedData?.attending === 'yes'
                ? `We are overjoyed that you will be celebrating with us! Your RSVP for ${submittedData?.guestCount} ${submittedData?.guestCount === 1 ? 'guest' : 'guests'} has been dispatched to our hospitality concierge.`
                : 'Thank you for letting us know. You will be dearly missed, and we keep your warm blessings close to our hearts.'}
            </p>

            {submittedData?.attending === 'yes' && submittedData?.celebrations.length > 0 && (
              <div className="receipt-summary-box">
                <span className="summary-title">CEREMONIES SELECTED</span>
                <div className="summary-chips-list">
                  {submittedData.celebrations.map((c) => (
                    <span key={c} className="summary-chip">&bull; {c}</span>
                  ))}
                </div>
              </div>
            )}

            {submittedData?.personalMessage && (
              <div className="receipt-message-quote">
                <span>&ldquo;{submittedData.personalMessage}&rdquo;</span>
              </div>
            )}

            <div className="receipt-actions-row">
              <button
                type="button"
                className="btn-edit-receipt"
                onClick={handleEditResponse}
              >
                <Edit3 size={13} />
                <span>Update My RSVP</span>
              </button>

              <button
                type="button"
                className="btn-share-receipt"
                onClick={handleShareWeddingInvite}
              >
                <Share2 size={13} />
                <span>Share with Family</span>
              </button>
            </div>
          </div>
        )}
      </article>
    </section>
  );
};
