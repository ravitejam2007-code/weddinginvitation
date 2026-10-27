import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Send, 
  Phone, 
  Check, 
  Share2, 
  Gift, 
  Clock, 
  ExternalLink, 
  MessageSquare, 
  Edit3 
} from 'lucide-react';
import { fireGoldSparkles } from '../utils/confetti';
import { weddingEvents, downloadEventCalendar, downloadFullWeddingCalendar } from '../data/events';
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

export const RsvpForm: React.FC<RsvpFormProps> = ({ selectedTeam }) => {
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [celebrations, setCelebrations] = useState<string[]>(() => weddingEvents.map((event) => event.title));
  const [guestCount, setGuestCount] = useState(2);
  const [personalMessage, setPersonalMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<RsvpSubmission | null>(null);

  // Check localStorage for existing submission on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('saanvi_vihaan_wedding_rsvp');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSubmittedData(parsed);
        setIsSubmitted(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

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

    // Save to localStorage for real verified receipt
    try {
      localStorage.setItem('saanvi_vihaan_wedding_rsvp', JSON.stringify(submission));
    } catch {
      // Ignore storage errors
    }

    setSubmittedData(submission);
    setIsSubmitted(true);

    // Build real WhatsApp submission payload
    const teamText = selectedTeam
      ? `Cheering for: ${selectedTeam === 'bride' ? `Team Bride (${wedding.couple.brideName}) 🌸` : `Team Groom (${wedding.couple.groomName}) 🍨`}\n`
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

    // Real Destination: Dispatch directly to Wedding Concierge on WhatsApp
    const conciergeNumber = '919876543210';
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${conciergeNumber}&text=${encodeURIComponent(messageLines)}`;
    
    // Open in new tab
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
      {/* ─────────────────────────────────────────────────────────────
          CARD 1: RSVP CARD (WITH REAL DESTINATION & OPTIONAL MESSAGE)
          ───────────────────────────────────────────────────────────── */}
      <article className="rsvp-stationery-card deckled-paper" aria-label="RSVP Response Card">
        <div className="card-hairline-accent" aria-hidden="true" />

        <header className="rsvp-header-content">
          <span className="rsvp-eyebrow-tag">KINDLY RESPOND</span>
          <h2 id="rsvp-section-heading" className="rsvp-main-title">
            Will You Join Us?
          </h2>
          <p className="rsvp-deadline-text">
            Please respond by <strong>{formatWeddingDateShort(wedding.rsvpDeadline)}</strong>.<br />
            Your response is dispatched directly to our family concierge desk on WhatsApp.
          </p>
        </header>

        {!isSubmitted ? (
          <form onSubmit={handleWhatsAppSend} className="rsvp-form-body">
            {/* Guest Name Input */}
            <div className="form-group-block">
              <label htmlFor="guest-full-name" className="form-field-label">
                YOUR FULL NAME <span className="field-required">*</span>
              </label>
              <input
                id="guest-full-name"
                type="text"
                className="stationery-input"
                placeholder="e.g., Lakshmi Iyer &amp; Family"
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
                  <span>Joyfully Yes!</span>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={attending === 'no'}
                  className={`attendance-pill-btn ${attending === 'no' ? 'pill-active-no' : ''}`}
                  onClick={() => setAttending('no')}
                >
                  <span>Regretfully No</span>
                </button>
              </div>
            </div>

            {/* If Attending: Celebrations & Guest Count */}
            {attending === 'yes' && (
              <div className="attending-details-accordion">
                {/* Which Celebrations */}
                <div className="form-group-block">
                  <span className="form-field-label">WHICH CELEBRATIONS WILL YOU ATTEND?</span>
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
                          <span className="chip-event-name">{evt.title}</span>
                          <span className="chip-date-sub">{evt.date.split(',')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Guest Count Stepper */}
                <div className="form-group-block">
                  <span className="form-field-label">TOTAL NUMBER OF ATTENDING GUESTS</span>
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
                placeholder={`Share a heartfelt blessing, dance song request, or warm wish for ${wedding.couple.brideName} & ${wedding.couple.groomName}...`}
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
              />
            </div>

            {/* Real Submission Action Buttons */}
            <div className="form-submit-actions">
              <button type="submit" className="btn-primary-whatsapp-submit">
                <Send size={16} />
                <span>DISPATCH RSVP ON WHATSAPP</span>
              </button>

              <div className="rsvp-action-secondary-row">
                {/* Share invite on WhatsApp */}
                <button
                  type="button"
                  className="btn-secondary-share"
                  onClick={handleShareWeddingInvite}
                  title="Share wedding invitation on WhatsApp with friends and family"
                >
                  <Share2 size={13} />
                  <span>Share Invitation</span>
                </button>

                {/* Direct Call Concierge Desk */}
                <a href="tel:+919876543210" className="btn-secondary-call" title="Call the wedding hospitality concierge">
                  <Phone size={13} />
                  <span>Helpline: +91 98765 43210</span>
                </a>
              </div>
            </div>
          </form>
        ) : (
          /* Verified Submission Receipt Display (Real destination feedback) */
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
                <MessageSquare size={13} className="quote-icon" />
                <p>&ldquo;{submittedData.personalMessage}&rdquo;</p>
              </div>
            )}

            <div className="receipt-footer-actions">
              <button
                type="button"
                className="btn-edit-rsvp"
                onClick={handleEditResponse}
              >
                <Edit3 size={13} />
                <span>Update / Resend RSVP</span>
              </button>

              <button
                type="button"
                className="btn-share-receipt"
                onClick={handleShareWeddingInvite}
              >
                <Share2 size={13} />
                <span>Share Invitation</span>
              </button>
            </div>
          </div>
        )}
      </article>

      {/* ─────────────────────────────────────────────────────────────
          CARD 2: CEREMONY LOCATION & CALENDAR ACTIONS CARD
          ───────────────────────────────────────────────────────────── */}
      <article className="location-stationery-card deckled-paper" aria-label="Ceremony Location & Calendar Card">
        <div className="card-hairline-accent" aria-hidden="true" />

        <div className="location-header-row">
          <div className="location-icon-box" aria-hidden="true">
            <MapPin size={22} className="loc-pin-icon" />
          </div>

          <div className="location-title-stack">
            <span className="location-eyebrow">CELEBRATION VENUE</span>
            <h3 className="location-venue-name">{wedding.venue.formalName}</h3>
            <p className="location-address-line">
              {wedding.venue.address}
            </p>
          </div>
        </div>

        {/* Action Pills: Directions & Add to Calendar */}
        <div className="venue-action-pills-row">
          <a
            href={wedding.venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="venue-action-btn btn-maps"
            title="Open in Google Maps"
          >
            <MapPin size={14} />
            <span>Open Google Maps Directions</span>
            <ExternalLink size={12} className="link-ext" />
          </a>

          <button
            type="button"
            className="venue-action-btn btn-calendar-all"
            onClick={downloadFullWeddingCalendar}
            title="Download full 4-day wedding calendar (.ics)"
          >
            <Calendar size={14} />
            <span>+ Add All 4 Events to Calendar (.ics)</span>
          </button>
        </div>

        {/* Ceremony-by-Ceremony Calendar Actions */}
        <div className="ceremony-calendar-sublist">
          <span className="sublist-heading">CALENDAR REMINDER BY CEREMONY</span>
          <div className="ceremony-calendar-grid">
            {weddingEvents.map((evt) => (
              <button
                key={evt.id}
                type="button"
                className="ceremony-cal-chip"
                onClick={() => downloadEventCalendar(evt)}
                title={`Download .ics reminder for ${evt.title}`}
              >
                <div className="cal-chip-icon-wrap" aria-hidden="true">
                  <Calendar size={12} />
                </div>
                <div className="cal-chip-text">
                  <span className="cal-evt-title">{evt.title}</span>
                  <span className="cal-evt-date">{evt.date.split(',')[0]} &bull; {evt.startTime}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Venue Hospitality & Valet Note */}
        <div className="location-valet-note">
          <Clock size={13} className="valet-icon" />
          <span>
            Complimentary valet parking and chauffeur lounges are arranged at the <strong>Palace Porch</strong> for all functions.
          </span>
        </div>
      </article>

      {/* ─────────────────────────────────────────────────────────────
          CARD 3: OPTIONAL GIFT INFORMATION CARD
          ───────────────────────────────────────────────────────────── */}
      <article className="gift-info-stationery-card deckled-paper" aria-label="Gift Information Card">
        <div className="card-hairline-accent" aria-hidden="true" />

        <div className="gift-card-inner">
          <div className="gift-icon-wrap" aria-hidden="true">
            <Gift size={20} className="gift-gold-icon" />
          </div>

          <span className="gift-eyebrow">YOUR PRESENCE IS OUR PRESENT</span>
          <h3 className="gift-card-title">Blessings Only</h3>

          <p className="gift-card-body">
            The greatest gift you can bring to our wedding is your heartfelt love, joyous presence, 
            and cherished blessings as we embark on this sacred journey together.
          </p>

          <p className="gift-card-tradition-note">
            In honoring our families&rsquo; traditions, we kindly and respectfully request 
            <strong> no boxed gifts</strong>.
          </p>

          <div className="gift-blessings-divider" aria-hidden="true" />

          <p className="gift-charity-note">
            If you wish to honor our union with a token of goodwill, we encourage contributing to our chosen 
            initiative supporting children&rsquo;s education in Hyderabad.
          </p>
        </div>
      </article>
    </section>
  );
};
