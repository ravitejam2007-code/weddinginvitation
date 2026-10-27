import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { weddingEvents } from '../data/events';
import { EventCard } from './EventCard';
import { GuestInformation } from './GuestInformation';
import { LoveStoryGallery } from './LoveStoryGallery';
import { HaldiScratchReveal } from './HaldiScratchReveal';
import { MehndiTraceReveal } from './MehndiTraceReveal';
import { SangeetDholReveal } from './SangeetDholReveal';
import { PickYourSide } from './PickYourSide';
import { CountdownTimer } from './CountdownTimer';
import { RsvpForm } from './RsvpForm';
import { formatWeddingDate, formatWeddingDateShort, formatWeddingTime, wedding } from '../data/wedding';

interface InvitationSuiteProps {
  onScrollToTimeline?: () => void;
}

export const InvitationSuite: React.FC<InvitationSuiteProps> = () => {
  const [activeModal, setActiveModal] = useState<'haldi' | 'mehndi' | 'sangeet' | null>(null);
  const [selectedSide, setSelectedSide] = useState<'bride' | 'groom' | null>('bride');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <article className="invitation-suite-container">
      {/* 1. Spacious Hero Section: Couple and Family Introduction */}
      <section className="hero-ceremony-card deckled-paper" aria-label="Couple and Family Introduction">
        <div className="hero-card-ornate-border" aria-hidden="true" />
        
        {/* Sacred Invocation */}
        <div className="hero-sacred-badge">
          <span className="shloka-mini">|| श्री गणेशाय नमः ||</span>
        </div>

        {/* Family Introduction (Understated, Confirmed Spellings) */}
        <header className="hero-family-intro">
          <p className="hero-intro-lead">Together with their families</p>
          <div className="hero-parents-grid">
            {wedding.confirmation.familyNames ? (
              <>
                <span className="hero-parent-name">{wedding.families.bride.invitationLine}</span>
                <span className="hero-parent-amp">&amp;</span>
                <span className="hero-parent-name">{wedding.families.groom.invitationLine}</span>
              </>
            ) : (
              <span className="hero-parent-name">With their families</span>
            )}
          </div>
          <p className="hero-intro-sub">
            cordially invite you to celebrate the joyous union and wedding of their children
          </p>
        </header>

        {/* Dominant Couple Name Typography (Serif & Calligraphic) */}
        <div className="hero-dominant-couple-names">
          <div className="hero-name-block">
            <h1 className="hero-couple-title">{wedding.couple.brideName}</h1>
            {wedding.confirmation.familyNames && <span className="hero-lineage-subtitle">{wedding.families.bride.lineage}</span>}
          </div>

          <div className="hero-calligraphic-amp" aria-hidden="true">
            &amp;
          </div>

          <div className="hero-name-block">
            <h1 className="hero-couple-title">{wedding.couple.groomName}</h1>
            {wedding.confirmation.familyNames && <span className="hero-lineage-subtitle">{wedding.families.groom.lineage}</span>}
          </div>
        </div>

        {/* Central Original Hand-Painted Illustrated Portrait */}
        <div className="hero-portrait-container">
          <div className="portrait-deckled-matte">
            <img
              src="/images/couple_portrait.jpg"
              alt={`Original hand-painted watercolor portrait of ${wedding.couple.brideName} and ${wedding.couple.groomName} in traditional wedding attire`}
              className="hero-portrait-img"
            />
          </div>
        </div>

        {/* Understated Wedding Announcement Details */}
        <div className="hero-announcement-understated">
          <div className="hero-divider-flourish" aria-hidden="true" />
          <p className="announcement-ceremony-type">THE WEDDING CELEBRATION</p>
          <div className="announcement-date-venue-row">
            <span className="announcement-date-text">
              {wedding.confirmation.weddingDateTime ? formatWeddingDate(wedding.ceremony.date) : 'Date to be confirmed'}
            </span>
            <span className="announcement-bullet" aria-hidden="true">&bull;</span>
            <span className="announcement-time-text">
              {wedding.confirmation.weddingDateTime ? `From ${formatWeddingTime(wedding.ceremony.startTime)} Onwards` : 'Time to be confirmed'}
            </span>
          </div>
          <p className="announcement-venue-text">
            {wedding.confirmation.venue ? wedding.venue.name : 'Venue to be confirmed'}
          </p>
          <div className="hero-divider-flourish" aria-hidden="true" />

          <button
            type="button"
            className="btn-see-celebrations"
            onClick={() => scrollToSection('festivities-timeline')}
          >
            <span>SEE ALL CELEBRATIONS</span>
            <ChevronDown size={15} />
          </button>
        </div>
      </section>

      {/* 2. Warm Welcome & Metadata Badges Section (From Video 00:05) */}
      <section className="warm-welcome-section">
        <span className="welcome-tag">YOU ARE WARMLY INVITED</span>
        <div className="welcome-couple-title">
          <span className="welcome-name">{wedding.couple.brideName}</span>
          <span className="welcome-amp">&amp;</span>
          <span className="welcome-name">{wedding.couple.groomName}</span>
        </div>
        <p className="welcome-parents-line">
          {wedding.confirmation.familyNames
            ? `D/o ${wedding.families.bride.parents} • S/o ${wedding.families.groom.parents}`
            : 'Family details to be confirmed'}
        </p>

        {/* When & Where Badges */}
        <div className="metadata-badges-row">
          <div className="meta-badge-box">
            <span className="meta-badge-label">WHEN</span>
            <span className="meta-badge-value">
              {wedding.confirmation.weddingDateTime ? formatWeddingDateShort(wedding.ceremony.date) : 'To be confirmed'}
            </span>
          </div>

          <div className="meta-badge-divider" aria-hidden="true" />

          <div className="meta-badge-box">
            <span className="meta-badge-label">WHERE</span>
            <span className="meta-badge-value">
              {wedding.confirmation.venue ? wedding.venue.name : 'To be confirmed'}
            </span>
          </div>
        </div>

        {/* Wedding Hashtag Badge */}
        <div className="wedding-hashtag-pill">
          <span>{wedding.couple.hashtag}</span>
        </div>
      </section>

      {/* 3. The Festivities Timeline: Reusable Event Cards with Alternating Layout */}
      <section id="festivities-timeline" className="festivities-section" aria-label="Wedding Itinerary and Timeline">
        <div className="festivities-header">
          <span className="festivities-sub-tag">
            {wedding.confirmation.eventSchedule ? 'FOUR DAYS OF CELEBRATION' : 'ITINERARY PENDING'}
          </span>
          <h2 className="festivities-heading">
            {wedding.confirmation.eventSchedule ? 'The Festivities' : 'Ceremony Schedule To Be Confirmed'}
          </h2>
          {!wedding.confirmation.eventSchedule && (
            <p className="festivities-intro-sub">The hosts will share ceremony dates and times once confirmed.</p>
          )}
        </div>

        {/* The Timeline Suite with Central Spine & Alternating Cards on Desktop */}
        {wedding.confirmation.eventSchedule && wedding.confirmation.eventContent && <div className="wedding-timeline-suite">
          <div className="timeline-central-vine-spine" aria-hidden="true" />
          
          <div className="timeline-cards-flow">
            {weddingEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onTriggerReveal={(id) => {
                  if (id === 'haldi') setActiveModal('haldi');
                  else if (id === 'mehndi') setActiveModal('mehndi');
                  else if (id === 'sangeet') setActiveModal('sangeet');
                }}
              />
            ))}
          </div>
        </div>}
      </section>

      {/* 4. Dress Code & Guest Information Collection */}
      <GuestInformation />

      {/* 5. Music and Love Story Gallery */}
      {wedding.confirmation.galleryContent && <LoveStoryGallery />}

      {/* 6. "Pick Your Side" Friendly Rivalry (From Video 00:54) */}
      <PickYourSide
        selectedSide={selectedSide}
        onSelectSide={(side) => setSelectedSide(side)}
      />

      {/* 5. Live Muhurtham Countdown (From Video 00:58) */}
      <CountdownTimer />

      {/* 6. RSVP Form with WhatsApp Integration (From Video 01:04) */}
      <RsvpForm selectedTeam={selectedSide} />

      {/* 7. Auspicious Closing Footer & Final Thank You Message */}
      <footer className="auspicious-suite-footer" aria-label="Closing Wedding Blessings">
        <div className="sacred-om-badge" aria-hidden="true">
          <span className="sacred-om-char">ॐ</span>
          <div className="sacred-flame-leaf" />
        </div>

        <span className="footer-eyebrow-tag">WITH LOVE &amp; GRATITUDE</span>
        <h3 className="footer-couple-signature">{wedding.couple.brideName} &amp; {wedding.couple.groomName}</h3>

        <div className="footer-parents-row">
          <span>{wedding.confirmation.familyNames ? wedding.families.bride.parents : 'Family details to be confirmed'}</span>
          <span className="footer-dot" aria-hidden="true">&bull;</span>
          <span>{wedding.confirmation.familyNames ? wedding.families.groom.parents : 'Family details to be confirmed'}</span>
        </div>

        <div className="footer-divider-ornament" aria-hidden="true" />

        <p className="footer-thank-you-message">
          &ldquo;Thank you from the bottom of our hearts for being part of our lives, our story, 
          and our joy. Your prayers and presence illuminate our celebration, and we look forward
          to sharing this special day with you.&rdquo;
        </p>

        <div className="footer-hashtag-pill">
          <span>{wedding.couple.hashtag}</span>
        </div>

        <div className="footer-date-line">
          <span>
            {wedding.confirmation.weddingDateTime ? formatWeddingDateShort(wedding.ceremony.date) : 'Date to be confirmed'}
            {' • '}
            {wedding.confirmation.venue ? wedding.venue.name : 'Venue to be confirmed'}
          </span>
        </div>

        <div className="footer-made-with-love">
          <span>MADE WITH LOVE &bull; WEDDING INVITATION SUITE ❤️</span>
        </div>
      </footer>

      {/* Interactive Modals */}
      {activeModal === 'haldi' && (
        <HaldiScratchReveal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'mehndi' && (
        <MehndiTraceReveal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'sangeet' && (
        <SangeetDholReveal onClose={() => setActiveModal(null)} />
      )}
    </article>
  );
};
