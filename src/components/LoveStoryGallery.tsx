import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Sparkles, 
  Heart, 
  Music
} from 'lucide-react';
import { useMusic } from '../context/useMusic';
import { formatWeddingDateShort, wedding } from '../data/wedding';

interface StoryPhoto {
  id: string;
  src: string;
  alt: string;
  chapter: string;
  date: string;
  title: string;
  caption: string;
  aspect: 'portrait' | 'landscape' | 'square';
  rotationDeg: number;
}

const storyPhotos: StoryPhoto[] = [
  {
    id: 'first-meet',
    src: '/images/love_story_first_meet.jpg',
    alt: `${wedding.couple.brideName} and ${wedding.couple.groomName} smiling warmly over coffee at The Bougainvillea Cafe in Hyderabad with blossoming pink flowers`,
    chapter: 'Chapter I',
    date: 'Hyderabad • Autumn 2023',
    title: 'Where It All Began',
    caption: 'A chance meeting over warm Irani chai turned into hours of shared laughter, quiet comfort, and conversations that felt like coming home.',
    aspect: 'landscape',
    rotationDeg: -1.2,
  },
  {
    id: 'proposal',
    src: '/images/love_story_proposal.jpg',
    alt: `${wedding.couple.groomName} kneeling and proposing with a ring to ${wedding.couple.brideName} on a candlelit lakeside palace terrace in Hyderabad at twilight with palace lights`,
    chapter: 'Chapter II',
    date: 'Lakeside Palace • Winter 2024',
    title: 'The Sunset Promise',
    caption: 'Beneath a violet twilight sky reflected on tranquil waters, surrounded by warm fairy lights and rose petals, forever began.',
    aspect: 'landscape',
    rotationDeg: 1.5,
  },
  {
    id: 'engagement',
    src: '/images/love_story_engagement.jpg',
    alt: `${wedding.couple.brideName} in a blush pink saree and ${wedding.couple.groomName} in traditional sherwani exchanging engagement rings amidst family blessings, brass lamps, and marigold garlands`,
    chapter: 'Chapter III',
    date: 'Heritage Courtyard • Spring 2025',
    title: 'Two Families, One Heart',
    caption: `With the heartfelt blessings of ${wedding.families.bride.parents} and ${wedding.families.groom.parents}, two souls and two families were joyfully united.`,
    aspect: 'landscape',
    rotationDeg: -1.0,
  },
  {
    id: 'wedding-portrait',
    src: '/images/couple_portrait.jpg',
    alt: `Original watercolor portrait of bride ${wedding.couple.brideName} in crimson silk saree and groom ${wedding.couple.groomName} in gold-embroidered festive attire`,
    chapter: 'Chapter IV',
    date: `${wedding.venue.name} • ${formatWeddingDateShort(wedding.ceremony.date)}`,
    title: 'The Road to Muhurtham',
    caption: 'Counting down each precious moment until the sacred sacred fire is lit, ready to take our seven auspicious steps into eternity.',
    aspect: 'portrait',
    rotationDeg: 1.2,
  },
];

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const LoveStoryGallery: React.FC = () => {
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    progressPercent, 
    isMuted, 
    trackTitle, 
    trackArtist, 
    togglePlay, 
    seek, 
    toggleMute 
  } = useMusic();

  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const triggerButtonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  // Keyboard navigation for accessible lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activePhotoIdx === null) return;

      if (e.key === 'Escape') {
        setActivePhotoIdx(null);
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIdx((prev) => (prev !== null ? (prev + 1) % storyPhotos.length : null));
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIdx((prev) => (prev !== null ? (prev - 1 + storyPhotos.length) % storyPhotos.length : null));
      }
    },
    [activePhotoIdx]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Focus trap / restore focus when lightbox opens / closes
  useEffect(() => {
    if (activePhotoIdx !== null) {
      document.body.style.overflow = 'hidden';
      lightboxRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activePhotoIdx]);

  // Progress Bar Seek Interaction
  const handleSeekFromEvent = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seek(ratio * duration);
  };

  const handleProgressBarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    handleSeekFromEvent(e);

    const onMouseMove = (moveEvent: MouseEvent) => {
      handleSeekFromEvent(moveEvent);
    };

    const onMouseUp = () => {
      setIsScrubbing(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleCloseLightbox = () => {
    const lastIdx = activePhotoIdx;
    setActivePhotoIdx(null);
    if (lastIdx !== null && triggerButtonRefs.current[lastIdx]) {
      triggerButtonRefs.current[lastIdx]?.focus();
    }
  };

  return (
    <section className="love-story-section" aria-labelledby="love-story-heading">
      {/* Botanical Sprig Top Flourish */}
      <div className="story-botanical-header-flourish" aria-hidden="true">
        <svg viewBox="0 0 160 40" width="120" height="30" fill="none">
          <path
            d="M10 20 C40 10, 60 30, 80 20 C100 10, 120 30, 150 20"
            stroke="#688467"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="80" cy="20" r="3" fill="#d4af37" />
          <circle cx="50" cy="16" r="2" fill="#688467" />
          <circle cx="110" cy="16" r="2" fill="#688467" />
          <path d="M75 14 C78 17, 82 17, 85 14" stroke="#d4af37" strokeWidth="1" />
        </svg>
      </div>

      <header className="love-story-header">
        <span className="love-story-tag">MOMENTS &amp; MEMORIES</span>
        <h2 id="love-story-heading" className="love-story-title">
          Our Love Story
        </h2>
        <div className="love-story-divider" aria-hidden="true" />
        <p className="love-story-subtitle">
          Small keepsakes of laughter, promises under the stars, and the beautiful path leading to our wedding day
        </p>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MINIMALIST WEDDING MUSIC PLAYER (CONFIRMED TRACK)
          ───────────────────────────────────────────────────────────── */}
      <div className="minimalist-music-player-card deckled-paper" aria-label="Traditional Wedding Music Player">
        <div className="player-hairline-frame" aria-hidden="true" />

        <div className="player-inner-content">
          {/* Left: Play/Pause Button & Visualizer */}
          <div className="player-control-col">
            <button
              type="button"
              className={`player-play-btn ${isPlaying ? 'is-playing' : ''}`}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause wedding music' : 'Play traditional wedding music'}
              title={isPlaying ? 'Pause music' : 'Play music'}
            >
              {isPlaying ? (
                <Pause size={18} className="player-play-icon" />
              ) : (
                <Play size={18} className="player-play-icon play-offset" />
              )}
            </button>

            {/* Subtle animated equalizer bars */}
            <div className={`player-eq-bars ${isPlaying ? 'eq-active' : ''}`} aria-hidden="true">
              <span className="eq-bar bar-1" />
              <span className="eq-bar bar-2" />
              <span className="eq-bar bar-3" />
              <span className="eq-bar bar-4" />
            </div>
          </div>

          {/* Center: Track Metadata & Progress Scrubber */}
          <div className="player-track-col">
            <div className="player-track-info-row">
              <div className="player-title-stack">
                <span className="player-track-badge">CONFIRMED CEREMONIAL RAGA</span>
                <h4 className="player-track-title">{trackTitle}</h4>
                <p 
                  className="player-track-artist" 
                  dangerouslySetInnerHTML={{ __html: trackArtist }} 
                />
              </div>

              {/* Mute/Volume Toggle */}
              <button
                type="button"
                className={`player-mute-btn ${isMuted ? 'muted' : ''}`}
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute music' : 'Mute music'}
                title={isMuted ? 'Unmute music' : 'Mute music'}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>

            {/* Interactive Progress Scrubber Bar */}
            <div className="player-scrubber-row">
              <span className="player-time-text">{formatTime(currentTime)}</span>

              <div
                ref={progressBarRef}
                className={`player-progress-bar-track ${isScrubbing ? 'scrubbing' : ''}`}
                role="slider"
                tabIndex={0}
                aria-label="Audio progress slider"
                aria-valuemin={0}
                aria-valuemax={duration}
                aria-valuenow={Math.round(currentTime)}
                aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                onMouseDown={handleProgressBarMouseDown}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') seek(currentTime + 5);
                  if (e.key === 'ArrowLeft') seek(currentTime - 5);
                }}
              >
                <div 
                  className="player-progress-bar-fill" 
                  style={{ width: `${progressPercent}%` }} 
                />
                <div 
                  className="player-progress-handle" 
                  style={{ left: `${progressPercent}%` }} 
                />
              </div>

              <span className="player-time-text">{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <div className="player-footnote-hint">
          <Music size={11} className="player-note-icon" />
          <span>Press play to accompany the love story with acoustic shehnai and sitar</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          STAGGERED EDITORIAL PHOTO PRINTS GALLERY
          ───────────────────────────────────────────────────────────── */}
      <div className="staggered-editorial-gallery" role="region" aria-label="Our Love Story Photo Prints">
        {storyPhotos.map((photo, idx) => {
          const isOdd = idx % 2 !== 0;

          return (
            <article
              key={photo.id}
              className={`photo-print-card print-${photo.aspect} ${isOdd ? 'print-offset-alt' : ''}`}
              style={{
                transform: `rotate(${photo.rotationDeg}deg)`,
              }}
            >
              {/* Decorative Paper Tape / Corner Clip */}
              <div className="print-tape-accent" aria-hidden="true" />

              {/* The Photo Print Frame */}
              <button
                type="button"
                ref={(el) => {
                  triggerButtonRefs.current[idx] = el;
                }}
                className="print-photo-button"
                onClick={() => setActivePhotoIdx(idx)}
                aria-label={`Open photograph: ${photo.title} (${photo.chapter}) in full-screen lightbox`}
              >
                <div className="print-image-container">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="print-img"
                  />
                  <div className="print-hover-overlay" aria-hidden="true">
                    <span className="overlay-pill">
                      <Maximize2 size={13} />
                      <span>View Print</span>
                    </span>
                  </div>
                </div>
              </button>

              {/* Stationery Caption under photo print */}
              <div className="print-caption-block">
                <div className="print-meta-row">
                  <span className="print-chapter-tag">{photo.chapter}</span>
                  <span className="print-date-tag">{photo.date}</span>
                </div>
                <h3 className="print-title">{photo.title}</h3>
                <p className="print-caption-text">{photo.caption}</p>
              </div>

              {/* Subtle Botanical corner illustration */}
              <div className="print-bottom-flourish" aria-hidden="true">
                <Heart size={10} className="print-heart-icon" />
              </div>
            </article>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ACCESSIBLE LIGHTBOX MODAL
          ───────────────────────────────────────────────────────────── */}
      {activePhotoIdx !== null && (
        <div
          ref={lightboxRef}
          className="accessible-lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo Lightbox: ${storyPhotos[activePhotoIdx].title}`}
          tabIndex={-1}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseLightbox();
            }
          }}
        >
          <div className="lightbox-dialog-window">
            {/* Top Toolbar */}
            <div className="lightbox-toolbar">
              <span className="lightbox-counter">
                Photo {activePhotoIdx + 1} of {storyPhotos.length}
              </span>

              <button
                type="button"
                className="lightbox-close-btn"
                onClick={handleCloseLightbox}
                aria-label="Close photo lightbox (Escape)"
                autoFocus
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Stage with Nav Arrows */}
            <div className="lightbox-main-stage">
              <button
                type="button"
                className="lightbox-nav-btn btn-prev"
                onClick={() =>
                  setActivePhotoIdx(
                    (prev) => (prev !== null ? (prev - 1 + storyPhotos.length) % storyPhotos.length : 0)
                  )
                }
                aria-label="Previous photo (Left Arrow)"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="lightbox-image-wrapper">
                <img
                  src={storyPhotos[activePhotoIdx].src}
                  alt={storyPhotos[activePhotoIdx].alt}
                  className="lightbox-large-img"
                />
              </div>

              <button
                type="button"
                className="lightbox-nav-btn btn-next"
                onClick={() =>
                  setActivePhotoIdx(
                    (prev) => (prev !== null ? (prev + 1) % storyPhotos.length : 0)
                  )
                }
                aria-label="Next photo (Right Arrow)"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Caption Card */}
            <div className="lightbox-caption-card">
              <div className="lightbox-caption-inner">
                <div className="lightbox-meta-badge">
                  <Sparkles size={12} className="meta-star" />
                  <span>{storyPhotos[activePhotoIdx].chapter} &bull; {storyPhotos[activePhotoIdx].date}</span>
                </div>
                <h3 className="lightbox-photo-title">{storyPhotos[activePhotoIdx].title}</h3>
                <p className="lightbox-photo-description">
                  {storyPhotos[activePhotoIdx].caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
