import React, { useRef, useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Send, 
  Check, 
  Share2, 
  Gift, 
  Clock, 
  ExternalLink, 
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

type RsvpStatus = 'idle' | 'submitting' | 'success' | 'error' | 'whatsapp';
type RsvpFieldErrors = Partial<Record<'guestName' | 'phone' | 'celebrations' | 'personalMessage', string>>;

export const RsvpForm: React.FC<RsvpFormProps> = ({ selectedTeam }) => {
  const draftStorageKey = `${wedding.couple.slug}_rsvp_draft`;
  const receiptStorageKey = `${wedding.couple.slug}_rsvp_receipt`;
  const [initialDraft] = useState<Partial<RsvpSubmission> | null>(() => {
    try {
      const saved = localStorage.getItem(draftStorageKey);
      return saved ? JSON.parse(saved) as Partial<RsvpSubmission> : null;
    } catch {
      return null;
    }
  });
  const [guestName, setGuestName] = useState(() => initialDraft?.guestName ?? '');
  const [phone, setPhone] = useState(() => initialDraft?.phone ?? '');
  const [attending, setAttending] = useState<'yes' | 'no'>(() => initialDraft?.attending ?? 'yes');
  const [celebrations, setCelebrations] = useState<string[]>(() =>
    initialDraft?.celebrations ?? (wedding.confirmation.eventSchedule ? weddingEvents.map((event) => event.title) : []),
  );
  const [guestCount, setGuestCount] = useState(() => Math.min(8, Math.max(1, initialDraft?.guestCount ?? 2)));
  const [personalMessage, setPersonalMessage] = useState(() => initialDraft?.personalMessage ?? '');
  const [submittedData, setSubmittedData] = useState<RsvpSubmission | null>(() => {
    try {
      const saved = localStorage.getItem(receiptStorageKey);
      const receipt = saved ? JSON.parse(saved) as RsvpSubmission : null;
      return receipt && typeof receipt.guestName === 'string' ? receipt : null;
    } catch {
      return null;
    }
  });
  const [status, setStatus] = useState<RsvpStatus>(() => submittedData ? 'success' : 'idle');
  const [fieldErrors, setFieldErrors] = useState<RsvpFieldErrors>({});
  const [submissionNotice, setSubmissionNotice] = useState('');
  const [preparedWhatsAppUrl, setPreparedWhatsAppUrl] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const rsvpWhatsappNumber = import.meta.env.VITE_WEDDING_RSVP_WHATSAPP_NUMBER?.replace(/\D/g, '');
  const rsvpEndpoint = import.meta.env.VITE_WEDDING_RSVP_ENDPOINT?.trim();
  const persistDraft = (patch: Partial<RsvpSubmission>) => {
    const draft: RsvpSubmission = {
      guestName,
      phone: phone || undefined,
      attending,
      celebrations,
      guestCount,
      personalMessage: personalMessage || undefined,
      selectedTeam,
      submittedAt: new Date().toISOString(),
      ...patch,
    };
    try {
      localStorage.setItem(draftStorageKey, JSON.stringify(draft));
    } catch {
      setSubmissionNotice('Draft could not be saved in this browser.');
    }
  };

  const validateForm = (): RsvpFieldErrors => {
    const errors: RsvpFieldErrors = {};
    const normalizedName = guestName.trim();
    const normalizedPhone = phone.trim();
    const normalizedMessage = personalMessage.trim();

    if (normalizedName.length < 2) errors.guestName = 'Enter at least 2 characters for your name.';
    else if (normalizedName.length > 100) errors.guestName = 'Keep your name under 100 characters.';

    if (normalizedPhone && !/^\+?[\d\s().-]{7,20}$/.test(normalizedPhone)) {
      errors.phone = 'Enter a valid phone number or leave this optional field blank.';
    }

    if (attending === 'yes' && wedding.confirmation.eventSchedule && celebrations.length === 0) {
      errors.celebrations = 'Select at least one ceremony you plan to attend.';
    }

    if (normalizedMessage.length > 1000) errors.personalMessage = 'Keep your message under 1,000 characters.';
    return errors;
  };

  const buildSubmission = (): RsvpSubmission => ({
    guestName: guestName.trim(),
    phone: phone.trim() || undefined,
    attending,
    celebrations: attending === 'yes' && wedding.confirmation.eventSchedule ? celebrations : [],
    guestCount: attending === 'yes' ? guestCount : 0,
    personalMessage: personalMessage.trim() || undefined,
    selectedTeam,
    submittedAt: new Date().toISOString(),
  });

  const buildWhatsAppUrl = (submission: RsvpSubmission): string => {
    const message = [
      `Namaste! Wedding RSVP for ${wedding.couple.brideName} & ${wedding.couple.groomName}`,
      `Name: ${submission.guestName}`,
      submission.phone ? `Contact: ${submission.phone}` : '',
      `Attendance: ${submission.attending === 'yes' ? 'Joyfully attending' : 'Regretfully declining'}`,
      submission.attending === 'yes' && submission.celebrations.length
        ? `Ceremonies: ${submission.celebrations.join(', ')}`
        : '',
      submission.attending === 'yes' ? `Guest count: ${submission.guestCount}` : '',
      submission.selectedTeam ? `Cheering for Team ${submission.selectedTeam}` : '',
      submission.personalMessage ? `Message: ${submission.personalMessage}` : '',
    ].filter(Boolean).join('\n');
    return `https://api.whatsapp.com/send?phone=${rsvpWhatsappNumber}&text=${encodeURIComponent(message)}`;
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;
    const errors = validateForm();
    setFieldErrors(errors);
    setSubmissionNotice('');
    setPreparedWhatsAppUrl('');

    if (Object.keys(errors).length > 0) {
      setStatus('idle');
      const firstInvalidField = Object.keys(errors)[0];
      const fieldIds: Record<string, string> = {
        guestName: 'guest-full-name',
        phone: 'guest-phone',
        celebrations: 'ceremonies-chip-selector',
        personalMessage: 'personal-wishes-msg',
      };
      formRef.current?.querySelector<HTMLElement>(`#${fieldIds[firstInvalidField]}`)?.focus();
      return;
    }
    const submission = buildSubmission();
    try {
      localStorage.setItem(draftStorageKey, JSON.stringify(submission));
    } catch {
      setSubmissionNotice('Your browser could not save a draft. You can still retry submission.');
    }

    if (!rsvpEndpoint) {
      if (rsvpWhatsappNumber && rsvpWhatsappNumber.length >= 8 && rsvpWhatsappNumber.length <= 15) {
        setPreparedWhatsAppUrl(buildWhatsAppUrl(submission));
        setSubmissionNotice('No RSVP service is configured. Continue to WhatsApp to send your response; it will not be recorded as received here.');
        setStatus('idle');
      } else {
        setSubmissionNotice('RSVP submission is not configured. Your response is saved as a local draft only.');
        setStatus('error');
      }
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch(rsvpEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...submission, weddingSlug: wedding.couple.slug }),
      });

      if (!response.ok) {
        if (response.status === 400 || response.status === 422) {
          const result = await response.json().catch(() => null) as { errors?: Record<string, unknown> } | null;
          const serverErrors: RsvpFieldErrors = {};
          const allowedFields = ['guestName', 'phone', 'celebrations', 'personalMessage'] as const;
          for (const field of allowedFields) {
            const message = result?.errors?.[field];
            if (typeof message === 'string') serverErrors[field] = message;
          }
          if (Object.keys(serverErrors).length > 0) {
            setFieldErrors(serverErrors);
            const firstInvalidField = Object.keys(serverErrors)[0];
            const fieldIds: Record<string, string> = {
              guestName: 'guest-full-name',
              phone: 'guest-phone',
              celebrations: 'ceremonies-chip-selector',
              personalMessage: 'personal-wishes-msg',
            };
            formRef.current?.querySelector<HTMLElement>(`#${fieldIds[firstInvalidField]}`)?.focus();
            setStatus('idle');
            return;
          }
        }
        throw new Error(`RSVP service returned ${response.status}`);
      }

      setSubmittedData(submission);
      setStatus('success');
      try {
        localStorage.setItem(receiptStorageKey, JSON.stringify(submission));
        localStorage.removeItem(draftStorageKey);
      } catch {
        setSubmissionNotice('Your RSVP was accepted, but this browser could not save a local receipt.');
      }
      fireGoldSparkles(0.5, 0.75);
    } catch {
      setSubmissionNotice('We could not submit your RSVP. Check your connection and try again. Your details are kept as a draft.');
      setStatus('error');
      if (rsvpWhatsappNumber && rsvpWhatsappNumber.length >= 8 && rsvpWhatsappNumber.length <= 15) {
        setPreparedWhatsAppUrl(buildWhatsAppUrl(submission));
      }
    }
  };

  const openWhatsAppFallback = () => {
    if (!preparedWhatsAppUrl) return;
    window.open(preparedWhatsAppUrl, '_blank', 'noopener,noreferrer');
    setStatus('whatsapp');
  };

  const handleShareWeddingInvite = () => {
    fireGoldSparkles(0.5, 0.4);
    const shareText = [
      `✨ *Wedding Invitation: ${wedding.couple.brideName} & ${wedding.couple.groomName}* ✨`,
      `You are warmly invited to celebrate the wedding of ${wedding.couple.brideName} and ${wedding.couple.groomName}.`,
      ...(wedding.confirmation.weddingDateTime
        ? [`Date: ${formatWeddingDateShort(wedding.ceremony.date)}`]
        : []),
      ...(wedding.confirmation.venue ? [`Venue: ${wedding.venue.formalName}`] : []),
      `View our wedding suite, ceremony itinerary, attire guide, and RSVP here:`,
      window.location.href,
      `\n${wedding.couple.hashtag} 🌸`,
    ].join('\n\n');

    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappShareUrl, '_blank');
  };

  const handleEditResponse = () => {
    setStatus('idle');
    setSubmissionNotice('');
    setPreparedWhatsAppUrl('');
    setSubmittedData(null);
    try {
      localStorage.removeItem(receiptStorageKey);
    } catch {
      // Editing remains available when storage is disabled.
    }
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
            Please respond by <strong>{wedding.confirmation.rsvpDeadline ? formatWeddingDateShort(wedding.rsvpDeadline) : 'Date to be confirmed'}</strong>.<br />
            This invitation prepares an RSVP message in WhatsApp; your RSVP is only received after you send it there.
          </p>
        </header>

        {status === 'success' ? (
          <div className="rsvp-receipt-card" role="status" aria-live="polite">
            <div className="receipt-success-badge">
              <Check size={22} className="check-gold-icon" />
            </div>
            <span className="receipt-tag">RSVP RECEIVED</span>
            <h3 className="receipt-guest-name">Thank You, {submittedData?.guestName}!</h3>
            <p className="receipt-note">
              Your response was accepted by the RSVP service. This confirmation is saved in this browser.
            </p>
            <div className="receipt-footer-actions">
              <button type="button" className="btn-edit-rsvp" onClick={handleEditResponse}>
                <Edit3 size={13} />
                <span>Update response</span>
              </button>
              <button type="button" className="btn-share-receipt" onClick={handleShareWeddingInvite}>
                <Share2 size={13} />
                <span>Share Invitation</span>
              </button>
            </div>
          </div>
        ) : status === 'whatsapp' ? (
          <div className="rsvp-receipt-card" role="status" aria-live="polite">
            <span className="receipt-tag">WHATSAPP MESSAGE READY · NOT SUBMITTED</span>
            <h3 className="receipt-guest-name">Complete your RSVP in WhatsApp</h3>
            <p className="receipt-note">The hosts will receive your response only after you send the message in WhatsApp.</p>
            <div className="receipt-footer-actions">
              {preparedWhatsAppUrl && (
                <button className="btn-secondary-share" type="button" onClick={openWhatsAppFallback}>
                  <Send size={13} />
                  <span>Open WhatsApp</span>
                </button>
              )}
              <button type="button" className="btn-edit-rsvp" onClick={handleEditResponse}>
                <Edit3 size={13} />
                <span>Back to form</span>
              </button>
            </div>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleRsvpSubmit} className="rsvp-form-body" noValidate>
            {/* Guest Name Input */}
            <div className="form-group-block">
              <label htmlFor="guest-full-name" className="form-field-label">
                YOUR FULL NAME <span className="field-required">*</span>
              </label>
              <input
                id="guest-full-name"
                type="text"
                className="stationery-input"
                aria-invalid={Boolean(fieldErrors.guestName)}
                aria-describedby={fieldErrors.guestName ? 'guest-name-error' : undefined}
                placeholder="e.g., Lakshmi Iyer &amp; Family"
                value={guestName}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  setFieldErrors((previous) => ({ ...previous, guestName: undefined }));
                  persistDraft({ guestName: e.target.value });
                }}
              />
              {fieldErrors.guestName && <span id="guest-name-error" className="field-validation-error" role="alert">{fieldErrors.guestName}</span>}
            </div>

            {/* Optional Phone / WhatsApp Number */}
            <div className="form-group-block">
                <label htmlFor="guest-phone" className="form-field-label">
                YOUR PHONE / WHATSAPP NUMBER <span className="field-optional">(Optional)</span>
              </label>
              <input
                id="guest-phone"
                type="tel"
                className="stationery-input"
                aria-invalid={Boolean(fieldErrors.phone)}
                aria-describedby={fieldErrors.phone ? 'guest-phone-error' : undefined}
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setFieldErrors((previous) => ({ ...previous, phone: undefined }));
                  persistDraft({ phone: e.target.value || undefined });
                }}
              />
              {fieldErrors.phone && <span id="guest-phone-error" className="field-validation-error" role="alert">{fieldErrors.phone}</span>}
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
                  onClick={() => {
                    setAttending('yes');
                    persistDraft({ attending: 'yes' });
                  }}
                >
                  <Check size={14} className="pill-check-icon" />
                  <span>Joyfully Yes!</span>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={attending === 'no'}
                  className={`attendance-pill-btn ${attending === 'no' ? 'pill-active-no' : ''}`}
                  onClick={() => {
                    setAttending('no');
                    persistDraft({ attending: 'no' });
                  }}
                >
                  <span>Regretfully No</span>
                </button>
              </div>
            </div>

            {/* If Attending: Celebrations & Guest Count */}
            {attending === 'yes' && wedding.confirmation.eventSchedule && (
              <div className="attending-details-accordion">
                {/* Which Celebrations */}
                <div className="form-group-block">
                  <span className="form-field-label">WHICH CELEBRATIONS WILL YOU ATTEND?</span>
                  <div id="ceremonies-chip-selector" className="ceremonies-chip-selector" role="group" aria-label="Select ceremonies" tabIndex={-1}>
                    {weddingEvents.map((evt) => {
                      const isChecked = celebrations.includes(evt.title);
                      return (
                        <button
                          key={evt.id}
                          type="button"
                          className={`ceremony-select-chip ${isChecked ? 'chip-selected' : ''}`}
                          aria-pressed={isChecked}
                          onClick={() => {
                            const nextCelebrations = isChecked
                              ? celebrations.filter((title) => title !== evt.title)
                              : [...celebrations, evt.title];
                            setCelebrations(nextCelebrations);
                            persistDraft({ celebrations: nextCelebrations });
                          }}
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
                  {fieldErrors.celebrations && <span className="field-validation-error" role="alert">{fieldErrors.celebrations}</span>}
                </div>

                {/* Guest Count Stepper */}
                <div className="form-group-block">
                  <span className="form-field-label">TOTAL NUMBER OF ATTENDING GUESTS</span>
                  <div className="stepper-counter-row">
                    <button
                      type="button"
                      className="stepper-adjust-btn"
                      onClick={() => {
                        const nextCount = Math.max(1, guestCount - 1);
                        setGuestCount(nextCount);
                        persistDraft({ guestCount: nextCount });
                      }}
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
                      onClick={() => {
                        const nextCount = Math.min(8, guestCount + 1);
                        setGuestCount(nextCount);
                        persistDraft({ guestCount: nextCount });
                      }}
                      disabled={guestCount >= 8}
                      aria-label="Increase guest count"
                    >
                      &#43;
                    </button>
                  </div>
                </div>
              </div>
            )}
            {attending === 'yes' && !wedding.confirmation.eventSchedule && (
              <>
                <p className="rsvp-submission-notice" role="status">
                  Ceremony attendance choices will be available when the hosts confirm the schedule.
                </p>
                <div className="form-group-block">
                  <span className="form-field-label">TOTAL NUMBER OF ATTENDING GUESTS</span>
                  <div className="stepper-counter-row">
                    <button
                      type="button"
                      className="stepper-adjust-btn"
                      onClick={() => {
                        const nextCount = Math.max(1, guestCount - 1);
                        setGuestCount(nextCount);
                        persistDraft({ guestCount: nextCount });
                      }}
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
                      onClick={() => {
                        const nextCount = Math.min(8, guestCount + 1);
                        setGuestCount(nextCount);
                        persistDraft({ guestCount: nextCount });
                      }}
                      disabled={guestCount >= 8}
                      aria-label="Increase guest count"
                    >
                      &#43;
                    </button>
                  </div>
                </div>
              </>
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
                aria-invalid={Boolean(fieldErrors.personalMessage)}
                aria-describedby={fieldErrors.personalMessage ? 'personal-message-error' : undefined}
                placeholder={`Share a heartfelt blessing, dance song request, or warm wish for ${wedding.couple.brideName} & ${wedding.couple.groomName}...`}
                value={personalMessage}
                onChange={(e) => {
                  setPersonalMessage(e.target.value);
                  setFieldErrors((previous) => ({ ...previous, personalMessage: undefined }));
                  persistDraft({ personalMessage: e.target.value || undefined });
                }}
              />
              {fieldErrors.personalMessage && <span id="personal-message-error" className="field-validation-error" role="alert">{fieldErrors.personalMessage}</span>}
            </div>

            {/* WhatsApp handoff requires a configured public contact number. */}
            <div className="form-submit-actions">
              <button type="submit" className="btn-primary-whatsapp-submit" disabled={status === 'submitting'}>
                <Send size={16} />
                <span>{status === 'submitting' ? 'SUBMITTING RSVP…' : status === 'error' ? 'RETRY RSVP SUBMISSION' : 'SUBMIT RSVP'}</span>
              </button>
              {submissionNotice && <p className="rsvp-submission-notice" role="alert">{submissionNotice}</p>}
              {preparedWhatsAppUrl && status === 'idle' && (
                <button className="btn-secondary-share" type="button" onClick={openWhatsAppFallback}>
                  <Send size={13} />
                  <span>Continue with WhatsApp instead</span>
                </button>
              )}
              {status === 'error' && preparedWhatsAppUrl && (
                <button className="btn-secondary-share" type="button" onClick={openWhatsAppFallback}>
                  <Send size={13} />
                  <span>Continue with WhatsApp instead</span>
                </button>
              )}

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

                {rsvpWhatsappNumber && (
                  <span className="rsvp-contact-note">WhatsApp contact configured</span>
                )}
              </div>
            </div>
          </form>
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
            <h3 className="location-venue-name">
              {wedding.confirmation.venue ? wedding.venue.formalName : 'Venue to be confirmed'}
            </h3>
            <p className="location-address-line">
              {wedding.confirmation.venue ? wedding.venue.address : 'Location details will appear after host confirmation.'}
            </p>
          </div>
        </div>

        {/* Action Pills: Directions & Add to Calendar */}
        <div className="venue-action-pills-row">
          {wedding.confirmation.venue && <a
            href={wedding.venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="venue-action-btn btn-maps"
            title="Open in Google Maps"
          >
            <MapPin size={14} />
            <span>Open Google Maps Directions</span>
            <ExternalLink size={12} className="link-ext" />
          </a>}

          <button
            type="button"
            className="venue-action-btn btn-calendar-all"
            onClick={downloadFullWeddingCalendar}
            disabled={!wedding.confirmation.eventSchedule}
            title="Download full 4-day wedding calendar (.ics)"
          >
            <Calendar size={14} />
            <span>{wedding.confirmation.eventSchedule ? '+ Add All 4 Events to Calendar (.ics)' : 'Calendar details pending confirmation'}</span>
          </button>
        </div>

        {/* Ceremony-by-Ceremony Calendar Actions */}
        {wedding.confirmation.eventSchedule && <div className="ceremony-calendar-sublist">
          <span className="sublist-heading">CALENDAR REMINDER BY CEREMONY</span>
          <div className="ceremony-calendar-grid">
            {weddingEvents.map((evt) => (
              <button
                key={evt.id}
                type="button"
                className="ceremony-cal-chip"
                onClick={() => downloadEventCalendar(evt)}
                disabled={!wedding.confirmation.eventSchedule}
                title={`Download .ics reminder for ${evt.title}`}
              >
                <div className="cal-chip-icon-wrap" aria-hidden="true">
                  <Calendar size={12} />
                </div>
                <div className="cal-chip-text">
                  <span className="cal-evt-title">{evt.title}</span>
                  <span className="cal-evt-date">
                    {wedding.confirmation.eventSchedule ? `${evt.date.split(',')[0]} • ${evt.startTime}` : 'Details pending confirmation'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>}

        {/* Venue Hospitality & Valet Note */}
        {wedding.confirmation.hospitality && <div className="location-valet-note">
          <Clock size={13} className="valet-icon" />
          <span>
            {wedding.venue.hospitalityNote}
          </span>
        </div>}
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

          <span className="gift-eyebrow">A NOTE ON GIFTS</span>
          <h3 className="gift-card-title">{wedding.confirmation.giftPreference ? 'Gift Guidance' : 'To Be Confirmed'}</h3>

          <p className="gift-card-body">
            Your presence and good wishes are warmly appreciated.
          </p>

          <p className="gift-card-tradition-note">
            {wedding.confirmation.giftPreference
              ? wedding.giftPreference
              : 'Please check with the hosts for gift preferences once confirmed.'}
          </p>

          <div className="gift-blessings-divider" aria-hidden="true" />

          {wedding.confirmation.giftPreference && wedding.giftCharity && (
            <p className="gift-charity-note">{wedding.giftCharity}</p>
          )}
        </div>
      </article>
    </section>
  );
};
