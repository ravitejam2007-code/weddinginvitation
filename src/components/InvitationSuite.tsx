import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { weddingEvents } from '../data/events';
import { EventCard } from './EventCard';
import { LoveStoryGallery } from './LoveStoryGallery';
import { HaldiScratchReveal } from './HaldiScratchReveal';
import { MehndiTraceReveal } from './MehndiTraceReveal';
import { SangeetDholReveal } from './SangeetDholReveal';
import { WeddingInvitationModal } from './WeddingInvitationModal';
import { PickYourSide } from './PickYourSide';
import { CountdownTimer } from './CountdownTimer';
import { RsvpForm } from './RsvpForm';
import { formatWeddingDate, formatWeddingDateShort, formatWeddingTime, wedding } from '../data/wedding';

interface InvitationSuiteProps {
  onScrollToTimeline?: () => void;
}

export const InvitationSuite: React.FC<InvitationSuiteProps> = () => {
  const [activeModal, setActiveModal] = useState<'haldi' | 'mehndi' | 'sangeet' | 'wedding' | null>(null);
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

        {/* Family Introduction */}
        <header className="hero-family-intro">
          <p className="hero-intro-lead">Together with their families</p>
          <div className="hero-parents-grid">
            <span className="hero-parent-name">{wedding.families.bride.parents}</span>
            <span className="hero-parent-amp">&amp;</span>
            <span className="hero-parent-name">{wedding.families.groom.parents}</span>
          </div>
          <p className="hero-intro-sub">
            cordially invite you to celebrate the wedding ceremony of their children
          </p>
        </header>

        {/* Dominant Couple Name Typography */}
        <div className="hero-dominant-couple-names">
          <div className="hero-name-block">
            <h1 className="hero-couple-title">{wedding.couple.brideName}</h1>
            <span className="hero-lineage-subtitle">Daughter of {wedding.families.bride.parents}</span>
          </div>

          <div className="hero-calligraphic-amp" aria-hidden="true">
            &amp;
          </div>

          <div className="hero-name-block">
            <h1 className="hero-couple-title">{wedding.couple.groomName}</h1>
            <span className="hero-lineage-subtitle">Son of {wedding.families.groom.parents}</span>
          </div>
        </div>

        {/* Central Original Hand-Painted Illustrated Portrait from Video */}
        <div className="hero-portrait-container">
          <div className="portrait-deckled-matte">
            <img
              src="/images/couple_portrait.jpg"
              alt={`${wedding.couple.brideName} and ${wedding.couple.groomName} in traditional South Indian wedding attire`}
              className="hero-portrait-img"
            />
          </div>
        </div>

        {/* Wedding Announcement Details */}
        <div className="hero-announcement-understated">
          <div className="hero-divider-flourish" aria-hidden="true" />
          <p className="announcement-ceremony-type">THE WEDDING CELEBRATION</p>
          <div className="announcement-date-venue-row">
            <span className="announcement-date-text">{formatWeddingDate(wedding.ceremony.date)}</span>
            <span className="announcement-bullet" aria-hidden="true">&bull;</span>
            <span className="announcement-time-text">From {formatWeddingTime(wedding.ceremony.startTime)} Onwards</span>
          </div>
          <p className="announcement-venue-text">{wedding.venue.name}</p>
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
          D/o {wedding.families.bride.parents} &bull; S/o {wedding.families.groom.parents}
        </p>

        {/* When & Where Badges */}
        <div className="metadata-badges-row">
          <div className="meta-badge-box">
            <span className="meta-badge-label">WHEN</span>
            <span className="meta-badge-value">{formatWeddingDateShort(wedding.ceremony.date)}</span>
          </div>

          <div className="meta-badge-divider" aria-hidden="true" />

          <div className="meta-badge-box">
            <span className="meta-badge-label">WHERE</span>
            <span className="meta-badge-value">{wedding.venue.name}</span>
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
          <span className="festivities-sub-tag">FOUR DAYS OF CELEBRATION</span>
          <h2 className="festivities-heading">The Festivities</h2>
          <p className="festivities-intro-sub">
            Individual stationery itinerary cards for each sacred ceremony
          </p>
        </div>

        {/* The Timeline Suite with Central Spine & Alternating Cards on Desktop */}
        <div className="wedding-timeline-suite">
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
                  else if (id === 'wedding') setActiveModal('wedding');
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. "Pick Your Side" Friendly Rivalry (From Video 00:54) */}
      <PickYourSide
        selectedSide={selectedSide}
        onSelectSide={(side) => setSelectedSide(side)}
      />

      {/* 5. Live Muhurtham Countdown (From Video 00:58) */}
      <CountdownTimer />

      {/* 6. Love Story Gallery */}
      <LoveStoryGallery />

      {/* 7. RSVP Form with WhatsApp Integration (From Video 01:04) */}
      <RsvpForm selectedTeam={selectedSide} />

      {/* 10. Auspicious Closing Footer & Final Thank You Message (From Video 01:12) */}
      <footer className="auspicious-suite-footer" aria-label="Closing Wedding Blessings">
        <div className="sacred-om-badge" aria-hidden="true">
          <span className="sacred-om-char">ॐ</span>
          <div className="sacred-flame-leaf" />
        </div>

        <p className="footer-sacred-blessing-text">
          With the blessings of our elders<br />
          and the warmth of your presence.
        </p>

        <h3 className="footer-couple-signature">{wedding.couple.brideName} &amp; {wedding.couple.groomName}</h3>

        <div className="footer-parents-row">
          <span>{wedding.families.bride.parents}</span>
          <span className="footer-dot" aria-hidden="true">&bull;</span>
          <span>{wedding.families.groom.parents}</span>
        </div>

        <div className="footer-divider-ornament" aria-hidden="true" />

        <p className="footer-thank-you-message">
          &ldquo;Thank you from the bottom of our hearts for being part of our lives, our story, 
          and our joy. Your prayers and presence illuminate our celebration, and we cannot wait 
          to welcome you to Hyderabad with folded hands and warmest embrace.&rdquo;
        </p>

        <div className="footer-hashtag-pill">
          <span>{wedding.couple.hashtag}</span>
        </div>

        <div className="footer-date-line">
          <span>{formatWeddingDateShort(wedding.ceremony.date)} &bull; {wedding.venue.name}</span>
        </div>

        <div className="footer-made-with-love">
          <span>MADE WITH LOVE</span>
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
      {activeModal === 'wedding' && (
        <WeddingInvitationModal onClose={() => setActiveModal(null)} />
      )}
    </article>
  );
};
