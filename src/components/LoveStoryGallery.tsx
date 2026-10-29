import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Sparkles, 
  Heart
} from 'lucide-react';
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

export const LoveStoryGallery: React.FC = () => {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
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
