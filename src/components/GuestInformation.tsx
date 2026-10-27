import React, { useState } from 'react';
import { formatWeddingDate, getWeddingEvent, wedding } from '../data/wedding';
import { 
  Sparkles, 
  HeartHandshake, 
  Info, 
  Gift, 
  Camera, 
  Car, 
  Wind, 
  Check, 
  Copy, 
  ChevronRight, 
  ChevronLeft,
  Shirt,
  Calendar
} from 'lucide-react';

interface ColorSwatch {
  name: string;
  hex: string;
}

interface DressCodeCeremony {
  id: string;
  ceremony: string;
  date: string;
  themeTitle: string;
  dressCodeLabel: string;
  colors: ColorSwatch[];
  description: string;
  attireSuggestions: string;
  specialNote?: string;
}

const ceremoniesDressCode: DressCodeCeremony[] = [
  {
    id: 'haldi',
    ceremony: getWeddingEvent('haldi').title,
    date: formatWeddingDate(getWeddingEvent('haldi').date),
    themeTitle: 'Sunshine Yellows & Playful Rose Accents',
    dressCodeLabel: 'TRADITIONAL HALDI FESTIVE',
    colors: [
      { name: 'Turmeric Gold', hex: '#F59E0B' },
      { name: 'Marigold Yellow', hex: '#FBBF24' },
      { name: 'Blush Rose Pink', hex: '#F472B6' },
      { name: 'Ivory Cream', hex: '#FEF3C7' },
    ],
    description:
      'Bright, celebratory shades honoring the sacred turmeric ritual. Flowing and easy silhouettes are recommended — prepare for joyful flower petals and turmeric splashes!',
    attireSuggestions:
      'Gentlemen: Turmeric yellow or off-white kurtas with churidar/dhoti. Ladies: Yellow or floral lehengas, breezy anarkalis, or lightweight cotton-silk sarees.',
    specialNote:
      'Family Confirmed Note: Yellow with playful pink accents is especially encouraged for Haldi!',
  },
  {
    id: 'mehndi',
    ceremony: getWeddingEvent('mehndi').title,
    date: formatWeddingDate(getWeddingEvent('mehndi').date),
    themeTitle: 'Garden Botanical Pastels & Soft Florals',
    dressCodeLabel: 'PASTEL BOTANICAL & FLORAL',
    colors: [
      { name: 'Sage Green', hex: '#688467' },
      { name: 'Blush Rose', hex: '#FDA4AF' },
      { name: 'Mint Leaf', hex: '#A7F3D0' },
      { name: 'Peach Bloom', hex: '#FED7AA' },
    ],
    description:
      'Soft earthy pastels harmonizing with lush royal garden lawns and intricate henna artistry. Comfortable sleeve cuts are ideal for guests wishing to apply mehndi.',
    attireSuggestions:
      'Gentlemen: Pastel Nehru jackets over crisp linen/silk kurtas. Ladies: Botanical printed lehengas, pastel shararas, or layered floral anarkalis with elbow-friendly sleeves.',
  },
  {
    id: 'sangeet',
    ceremony: getWeddingEvent('sangeet').title,
    date: formatWeddingDate(getWeddingEvent('sangeet').date),
    themeTitle: 'Royal Indo-Western & Evening Glitz',
    dressCodeLabel: 'ROYAL INDO-WESTERN & GLAMOUR',
    colors: [
      { name: 'Midnight Navy', hex: '#1E3A8A' },
      { name: 'Emerald Velvet', hex: '#065F46' },
      { name: 'Burnished Gold', hex: '#D4AF37' },
      { name: 'Deep Plum', hex: '#581C87' },
    ],
    description:
      'A dazzling evening of music, dance performances, and high-energy celebrations. Rich jewel tones, shimmering accents, and contemporary Indo-Western silhouettes.',
    attireSuggestions:
      'Gentlemen: Sharp royal bandhgalas, tuxedos, or tailored Indo-Western jackets. Ladies: Sequinned lehengas, cocktail pre-draped sarees, or modern evening gowns ready for dancing.',
  },
  {
    id: 'wedding',
    ceremony: getWeddingEvent('wedding').title,
    date: formatWeddingDate(getWeddingEvent('wedding').date),
    themeTitle: 'Sacred Heritage Silk & Royal Temple Attire',
    dressCodeLabel: 'HERITAGE SOUTH INDIAN & ROYAL FORMAL',
    colors: [
      { name: 'Kumkum Crimson', hex: '#991B1B' },
      { name: 'Temple Gold Zari', hex: '#D4AF37' },
      { name: 'Pavitra Off-White', hex: '#FFFBEB' },
      { name: 'Royal Rani Pink', hex: '#BE185D' },
    ],
    description:
      'Classic, sacred South Indian wedding ceremonial attire honoring centuries of heritage, Vedic mantras, and holy vows in an auspicious temple ambiance.',
    attireSuggestions:
      'Gentlemen: Pure silk Veshti (dhoti) with gold zari border and matching Angavastram, or classic raw silk sherwanis. Ladies: Traditional Kanjeevaram silk sarees with temple borders and heritage gold jewelry.',
  },
];

/** Reusable Floral & Gold Corner Frame matching EventCard.tsx */
const CardFloralFrame: React.FC = () => (
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
);

/** Ceremony-Specific Fashion Sketch Line Artwork */
const CeremonyFashionSketch: React.FC<{ ceremonyId: string }> = ({ ceremonyId }) => {
  switch (ceremonyId) {
    case 'haldi':
      return (
        <svg viewBox="0 0 160 120" className="fashion-sketch-svg" fill="none" aria-hidden="true">
          {/* Subtle paper backdrop aura */}
          <ellipse cx="80" cy="60" rx="70" ry="50" fill="rgba(245, 158, 11, 0.05)" />
          {/* Men's Kurta & Stole silhouette (Left) */}
          <g transform="translate(18, 15)">
            <circle cx="25" cy="8" r="5" stroke="#d97706" strokeWidth="1.2" fill="#fef3c7" />
            {/* Kurta body */}
            <path
              d="M16 18 L34 18 L38 42 L34 85 L16 85 L12 42 Z"
              stroke="#d97706"
              strokeWidth="1.3"
              fill="rgba(251, 191, 36, 0.16)"
            />
            {/* Mandarin collar & buttons */}
            <path d="M25 18 L25 45" stroke="#b45309" strokeWidth="1" strokeDasharray="2 2" />
            {/* Churidar */}
            <path d="M18 85 L20 102 M32 85 L30 102" stroke="#d97706" strokeWidth="1.2" />
            {/* Rose Pink Accent Stole */}
            <path
              d="M17 22 Q12 45 15 70 Q18 75 22 74 Q20 50 21 22 Z"
              fill="rgba(244, 114, 182, 0.28)"
              stroke="#f472b6"
              strokeWidth="1"
            />
          </g>
          {/* Ladies' Lehenga & Floral Jewelry (Right) */}
          <g transform="translate(85, 12)">
            <circle cx="32" cy="8" r="5" stroke="#d97706" strokeWidth="1.2" fill="#fef3c7" />
            {/* Choli */}
            <path
              d="M22 18 C26 15 38 15 42 18 L44 34 L20 34 Z"
              stroke="#d97706"
              strokeWidth="1.3"
              fill="rgba(251, 191, 36, 0.2)"
            />
            {/* Flared Lehenga with Marigold pleats */}
            <path
              d="M21 39 C28 41 36 41 43 39 L58 100 C40 105 24 105 6 100 Z"
              stroke="#d97706"
              strokeWidth="1.3"
              fill="rgba(245, 158, 11, 0.12)"
            />
            {/* Pink Lehenga hem border */}
            <path
              d="M8 96 C24 101 40 101 56 96"
              stroke="#f472b6"
              strokeWidth="2.5"
            />
            {/* Dupatta drape */}
            <path
              d="M24 20 Q48 40 52 80"
              stroke="#f472b6"
              strokeWidth="1.2"
              strokeDasharray="3 2"
            />
            {/* Floral hair/jewelry accent */}
            <circle cx="37" cy="6" r="1.5" fill="#f59e0b" />
            <circle cx="39" cy="8" r="1.5" fill="#f472b6" />
          </g>
        </svg>
      );

    case 'mehndi':
      return (
        <svg viewBox="0 0 160 120" className="fashion-sketch-svg" fill="none" aria-hidden="true">
          <ellipse cx="80" cy="60" rx="70" ry="50" fill="rgba(104, 132, 103, 0.05)" />
          {/* Men's Nehru Jacket / Kurta (Left) */}
          <g transform="translate(20, 15)">
            <circle cx="24" cy="8" r="5" stroke="#688467" strokeWidth="1.2" fill="#ecfdf5" />
            {/* Nehru Jacket over Kurta */}
            <path
              d="M14 18 L34 18 L37 60 L11 60 Z"
              stroke="#688467"
              strokeWidth="1.3"
              fill="rgba(104, 132, 103, 0.2)"
            />
            <path d="M24 18 L24 60" stroke="#4a5f49" strokeWidth="1" strokeDasharray="2 2" />
            {/* Pocket floral sprig */}
            <circle cx="18" cy="30" r="1.5" fill="#fda4af" />
            <path d="M18 31 L18 34" stroke="#688467" strokeWidth="0.8" />
            {/* Kurta hem below jacket */}
            <path d="M12 60 L12 85 L36 85 L36 60" stroke="#688467" strokeWidth="1" />
            <path d="M18 85 L19 102 M30 85 L29 102" stroke="#688467" strokeWidth="1.2" />
          </g>
          {/* Ladies' Flowing Anarkali with Botanical hem (Right) */}
          <g transform="translate(85, 12)">
            <circle cx="30" cy="8" r="5" stroke="#688467" strokeWidth="1.2" fill="#ecfdf5" />
            {/* Bodice */}
            <path
              d="M20 18 C24 16 36 16 40 18 L43 36 L17 36 Z"
              stroke="#688467"
              strokeWidth="1.3"
              fill="rgba(253, 164, 175, 0.2)"
            />
            {/* Floor length Anarkali flare */}
            <path
              d="M18 38 C24 40 36 40 42 38 L56 102 C36 106 24 106 4 102 Z"
              stroke="#688467"
              strokeWidth="1.3"
              fill="rgba(167, 243, 208, 0.15)"
            />
            {/* Soft Botanical embroidered hem */}
            <path
              d="M6 98 Q18 94 30 98 Q42 102 54 98"
              stroke="#688467"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
            {/* Sheer Dupatta */}
            <path
              d="M21 20 Q8 50 12 85 Q16 88 20 85 Q18 52 23 20 Z"
              fill="rgba(253, 164, 175, 0.22)"
              stroke="#fda4af"
              strokeWidth="0.9"
            />
          </g>
        </svg>
      );

    case 'sangeet':
      return (
        <svg viewBox="0 0 160 120" className="fashion-sketch-svg" fill="none" aria-hidden="true">
          <ellipse cx="80" cy="60" rx="70" ry="50" fill="rgba(30, 58, 138, 0.05)" />
          {/* Men's Royal Bandhgala (Left) */}
          <g transform="translate(20, 14)">
            <circle cx="24" cy="8" r="5" stroke="#1e3a8a" strokeWidth="1.2" fill="#eff6ff" />
            {/* Structured Bandhgala Jacket */}
            <path
              d="M13 18 L35 18 L38 68 L10 68 Z"
              stroke="#1e3a8a"
              strokeWidth="1.3"
              fill="rgba(30, 58, 138, 0.2)"
            />
            {/* Gold metallic buttons & pocket square */}
            <path d="M24 18 L24 68" stroke="#d4af37" strokeWidth="1.2" />
            <circle cx="24" cy="24" r="1.2" fill="#d4af37" />
            <circle cx="24" cy="32" r="1.2" fill="#d4af37" />
            <circle cx="24" cy="40" r="1.2" fill="#d4af37" />
            <path d="M16 28 L20 28 L19 25 Z" fill="#d4af37" stroke="#b45309" strokeWidth="0.5" />
            {/* Trousers */}
            <path d="M15 68 L16 104 M33 68 L32 104" stroke="#1e3a8a" strokeWidth="1.4" />
          </g>
          {/* Ladies' Glamorous Sequin Lehenga (Right) */}
          <g transform="translate(85, 12)">
            <circle cx="30" cy="8" r="5" stroke="#d4af37" strokeWidth="1.2" fill="#eff6ff" />
            {/* Sweetheart Blouse */}
            <path
              d="M21 18 C25 22 35 22 39 18 L42 34 L18 34 Z"
              stroke="#d4af37"
              strokeWidth="1.3"
              fill="rgba(212, 175, 55, 0.2)"
            />
            {/* Chevron Sequin Tiered Lehenga */}
            <path
              d="M19 38 C25 40 35 40 41 38 L58 102 C38 107 22 107 2 102 Z"
              stroke="#1e3a8a"
              strokeWidth="1.3"
              fill="rgba(30, 58, 138, 0.15)"
            />
            {/* Gold Chevron Sequin lines */}
            <path d="M12 60 L30 65 L48 60" stroke="#d4af37" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M8 80 L30 86 L52 80" stroke="#d4af37" strokeWidth="1.2" strokeDasharray="3 2" />
            {/* Cape drape */}
            <path
              d="M39 20 C46 45 52 75 56 95"
              stroke="#d4af37"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          </g>
        </svg>
      );

    case 'wedding':
    default:
      return (
        <svg viewBox="0 0 160 120" className="fashion-sketch-svg" fill="none" aria-hidden="true">
          <ellipse cx="80" cy="60" rx="70" ry="50" fill="rgba(153, 27, 27, 0.05)" />
          {/* Men's Pure Silk Veshti & Angavastram (Left) */}
          <g transform="translate(18, 14)">
            <circle cx="24" cy="8" r="5" stroke="#b45309" strokeWidth="1.2" fill="#fffbeb" />
            {/* Silk Kurta / Angavastram shoulder fold */}
            <path
              d="M14 18 L34 18 L37 55 L11 55 Z"
              stroke="#991b1b"
              strokeWidth="1.2"
              fill="rgba(255, 251, 235, 0.7)"
            />
            {/* Draped Angavastram with Gold Temple Border */}
            <path
              d="M13 18 L22 55 L28 55 L18 18 Z"
              fill="rgba(212, 175, 55, 0.3)"
              stroke="#d4af37"
              strokeWidth="1"
            />
            {/* Traditional Silk Veshti (Dhoti) with Gold Zari Border */}
            <path
              d="M12 56 L36 56 L37 104 L11 104 Z"
              stroke="#b45309"
              strokeWidth="1.2"
              fill="rgba(255, 251, 235, 0.85)"
            />
            {/* Gold Zari Hem Border */}
            <path d="M11 100 L37 100" stroke="#d4af37" strokeWidth="3" />
            {/* Gold Central Pleat line */}
            <path d="M24 56 L24 100" stroke="#d4af37" strokeWidth="1.2" />
          </g>
          {/* Ladies' Kanjeevaram Saree & Temple Jewelry (Right) */}
          <g transform="translate(85, 12)">
            <circle cx="32" cy="8" r="5" stroke="#991b1b" strokeWidth="1.2" fill="#fffbeb" />
            {/* Temple Jhumka hints */}
            <circle cx="26" cy="11" r="1.2" fill="#d4af37" />
            <circle cx="38" cy="11" r="1.2" fill="#d4af37" />
            {/* Blouse with Zari sleeves */}
            <path
              d="M23 18 C27 21 37 21 41 18 L44 34 L20 34 Z"
              stroke="#991b1b"
              strokeWidth="1.3"
              fill="rgba(153, 27, 27, 0.25)"
            />
            <path d="M20 28 L23 28 M41 28 L44 28" stroke="#d4af37" strokeWidth="1.5" />
            {/* Kanjeevaram Silk Saree Pleats */}
            <path
              d="M21 38 C28 40 36 40 43 38 L54 104 C38 108 26 108 10 104 Z"
              stroke="#991b1b"
              strokeWidth="1.3"
              fill="rgba(153, 27, 27, 0.15)"
            />
            {/* Broad Temple Zari Border at hem */}
            <path d="M10 99 C25 104 39 104 54 99" stroke="#d4af37" strokeWidth="3.5" />
            {/* Rich Zari Pallu draped across shoulder */}
            <path
              d="M22 20 Q35 45 42 75 Q45 80 49 76 Q45 45 38 19 Z"
              fill="rgba(212, 175, 55, 0.4)"
              stroke="#d4af37"
              strokeWidth="1.2"
            />
            {/* Kamarbandh (Gold waist belt) */}
            <path d="M21 44 C28 47 36 47 43 44" stroke="#d4af37" strokeWidth="1.5" />
          </g>
        </svg>
      );
  }
};

export const GuestInformation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dresscode' | 'hostmessage' | 'guidance'>('dresscode');
  const [selectedCeremonyIdx, setSelectedCeremonyIdx] = useState<number>(0);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => {
      setCopiedHex(null);
    }, 2000);
  };

  const currentCeremony = ceremoniesDressCode[selectedCeremonyIdx];

  const handleNextCeremony = () => {
    setSelectedCeremonyIdx((prev) => (prev + 1) % ceremoniesDressCode.length);
  };

  const handlePrevCeremony = () => {
    setSelectedCeremonyIdx((prev) => (prev - 1 + ceremoniesDressCode.length) % ceremoniesDressCode.length);
  };

  return (
    <section className="guest-info-section" aria-labelledby="guest-info-heading">
      {/* Section Header */}
      <div className="guest-info-header">
        <span className="guest-info-tag">USEFUL INFORMATION</span>
        <h2 id="guest-info-heading" className="guest-info-title">
          Dress Code &amp; Guest Guide
        </h2>
        <div className="guest-info-divider-flourish" aria-hidden="true" />
        <p className="guest-info-subtitle">
          A matching stationery collection for confirmed attire guidance, family wishes, and guest information
        </p>
      </div>

      {/* Main Stationery Collection Tabs */}
      <div className="info-tabs-nav" role="tablist" aria-label="Stationery card categories">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'dresscode'}
          className={`info-tab-btn ${activeTab === 'dresscode' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('dresscode')}
        >
          <Sparkles size={14} className="tab-icon" />
          <span className="tab-label">Event Dress Code</span>
          <span className="tab-badge">4 Events</span>
        </button>

        {wedding.confirmation.familyNames && <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'hostmessage'}
          className={`info-tab-btn ${activeTab === 'hostmessage' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('hostmessage')}
        >
          <HeartHandshake size={14} className="tab-icon" />
          <span className="tab-label">Host Message</span>
          <span className="tab-badge">From Families</span>
        </button>}

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'guidance'}
          className={`info-tab-btn ${activeTab === 'guidance' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('guidance')}
        >
          <Info size={14} className="tab-icon" />
          <span className="tab-label">Guest Instructions</span>
          <span className="tab-badge">Host details pending</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 1: EVENT DRESS CODE CARD
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'dresscode' && (
        <article className="info-stationery-card deckled-paper" role="tabpanel" aria-label="Dress Code Card">
          <CardFloralFrame />

          <div className="card-inner-pad">
            {!wedding.confirmation.dressCodes ? (
              <div className="guidance-bottom-note">
                <p className="bottom-note-text">Ceremony dates, dress codes, and color guidance will be published after host confirmation.</p>
              </div>
            ) : (
            <>
            {/* Ceremony Selector Pills */}
            <div className="dresscode-subnav-pills" role="tablist" aria-label="Choose ceremony for attire">
              {ceremoniesDressCode.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  className={`dresscode-pill-selector ${selectedCeremonyIdx === idx ? 'pill-selected' : ''}`}
                  onClick={() => setSelectedCeremonyIdx(idx)}
                  role="tab"
                  aria-selected={selectedCeremonyIdx === idx}
                >
                  <span className="pill-dot" style={{ backgroundColor: item.colors[0].hex }} />
                  <span>{item.ceremony.replace(' Ceremony', '')}</span>
                </button>
              ))}
            </div>

            {/* Ceremony Showcase Card Details */}
            <div className="dresscode-showcase-box">
              <header className="showcase-header">
                <div className="showcase-meta-row">
                  <span className="showcase-ceremony-tag">{currentCeremony.ceremony.toUpperCase()}</span>
                  <span className="showcase-date-pill">
                    <Calendar size={11} />
                    <span>{currentCeremony.date}</span>
                  </span>
                </div>

                <h3 className="showcase-theme-title">{currentCeremony.themeTitle}</h3>
                
                <div className="dresscode-badge-banner">
                  <Shirt size={13} className="banner-icon" />
                  <span className="banner-text">{currentCeremony.dressCodeLabel}</span>
                </div>

                <p className="showcase-desc">{currentCeremony.description}</p>
              </header>

              {/* Suggested Color Palette Swatches */}
              <div className="palette-section">
                <div className="palette-header-row">
                  <span className="palette-label">SUGGESTED COLOR PALETTE</span>
                  <span className="palette-hint">Tap any color to copy hex code</span>
                </div>

                <div className="color-swatches-row" role="list">
                  {currentCeremony.colors.map((c) => {
                    const isCopied = copiedHex === c.hex;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        className="swatch-item-btn"
                        onClick={() => handleCopyHex(c.hex)}
                        title={`Copy ${c.name} (${c.hex})`}
                      >
                        <span
                          className="swatch-circle"
                          style={{ backgroundColor: c.hex }}
                        >
                          <span className="swatch-copy-hover">
                            {isCopied ? <Check size={12} color="#fff" /> : <Copy size={11} color="#fff" />}
                          </span>
                        </span>
                        <span className="swatch-name">{c.name}</span>
                        <span className="swatch-hex">
                          {isCopied ? 'Copied!' : c.hex}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Attire Silhouette Advice & Fashion Sketch */}
              <div className="attire-advice-card">
                <div className="fashion-sketch-box" aria-hidden="true">
                  <CeremonyFashionSketch ceremonyId={currentCeremony.id} />
                  <span className="sketch-caption">Attire Silhouette Inspiration</span>
                </div>

                <div className="attire-text-col">
                  <div className="advice-eyebrow">
                    <Shirt size={13} />
                    <span>WHAT TO WEAR</span>
                  </div>
                  <p className="advice-body">{currentCeremony.attireSuggestions}</p>

                  {/* Confirmed Handwritten Haldi Note */}
                  {currentCeremony.specialNote && (
                    <div className="advice-special-note">
                      <div className="note-icon-wrap">
                        <Sparkles size={14} className="note-star-icon" />
                      </div>
                      <div className="note-text-wrap">
                        <strong className="note-title">Handwritten Note Confirmed by Family:</strong>
                        <p className="note-content">{currentCeremony.specialNote}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Next/Prev Ceremony Navigation */}
              <div className="ceremony-stepper-footer">
                <button
                  type="button"
                  className="stepper-arrow-btn"
                  onClick={handlePrevCeremony}
                  aria-label="Previous ceremony attire"
                >
                  <ChevronLeft size={14} />
                  <span>Previous Event</span>
                </button>

                <span className="stepper-counter-text">
                  {selectedCeremonyIdx + 1} of {ceremoniesDressCode.length} Ceremonies
                </span>

                <button
                  type="button"
                  className="stepper-arrow-btn"
                  onClick={handleNextCeremony}
                  aria-label="Next ceremony attire"
                >
                  <span>Next Event</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            </>
            )}
          </div>
        </article>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CARD 2: HOST FAMILY MESSAGE CARD
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'hostmessage' && wedding.confirmation.familyNames && (
        <article className="info-stationery-card deckled-paper host-card-paper" role="tabpanel" aria-label="Host Message Card">
          <CardFloralFrame />

          <div className="card-inner-pad host-message-layout">
            <div className="host-invitation-crest" aria-hidden="true">
              <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
                <circle cx="32" cy="32" r="30" stroke="#d4af37" strokeWidth="1.2" fill="rgba(250, 246, 238, 0.95)" />
                <circle cx="32" cy="32" r="26" stroke="#688467" strokeWidth="0.8" strokeDasharray="3 2" />
                <path d="M32 14 L35 24 L45 27 L37 34 L39 44 L32 39 L25 44 L27 34 L19 27 L29 24 Z" fill="rgba(212, 175, 55, 0.25)" stroke="#d4af37" strokeWidth="1" />
                <circle cx="32" cy="28" r="4" fill="#d4af37" />
              </svg>
            </div>

            <span className="host-eyebrow">A NOTE FROM OUR HEARTS</span>
            <h3 className="host-message-title">With Warmest Gratitude</h3>

            <div className="host-families-header">
              <div className="family-col">
                <span className="family-role">Bride's Parents</span>
                <span className="family-title">{wedding.confirmation.familyNames ? wedding.families.bride.parents : 'Family details to be confirmed'}</span>
              </div>

              <div className="family-amp" aria-hidden="true">&amp;</div>

              <div className="family-col">
                <span className="family-role">Groom's Parents</span>
                <span className="family-title">{wedding.confirmation.familyNames ? wedding.families.groom.parents : 'Family details to be confirmed'}</span>
              </div>
            </div>

            <div className="host-letter-divider" aria-hidden="true" />

            <div className="host-letter-body">
              <p>
                &ldquo;Dearest family, elders, and cherished friends &mdash; our children, 
                <strong> {wedding.couple.brideName} &amp; {wedding.couple.groomName}</strong>, embark on a sacred journey of companionship,
                friendship, and eternal love.
              </p>
              <p>
                Your prayers, blessings, and warm presence mean the world to both our families. Whether you
                are traveling from afar or joining locally, we await
                the joy and honor of welcoming you with open arms and heartfelt celebrations.&rdquo;
              </p>
            </div>

            {/* Dedicated Hospitality & Concierge Card */}
            <div className="host-hospitality-card">
              <div className="hospitality-icon-wrap" aria-hidden="true">
                <Car size={20} className="hospitality-car-icon" />
              </div>

              <div className="hospitality-content">
                <span className="hospitality-title">GUEST INFORMATION</span>
                <p className="hospitality-text">
                  Accommodation, travel, and contact details will be added after the hosts confirm those arrangements.
                </p>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* ─────────────────────────────────────────────────────────────
          CARD 3: CONFIRMED GUEST INSTRUCTIONS CARD
          ───────────────────────────────────────────────────────────── */}
      {activeTab === 'guidance' && (
        <article className="info-stationery-card deckled-paper" role="tabpanel" aria-label="Guest Instructions Card">
          <CardFloralFrame />

          <div className="card-inner-pad">
            <header className="guidance-header">
              <span className="guidance-eyebrow">GUEST INSTRUCTIONS</span>
              <h3 className="guidance-main-title">Useful Details for Your Comfort</h3>
              <p className="guidance-sub">
                Gentle reminders curated to ensure you and your loved ones have a delightful and effortless experience
              </p>
            </header>

            <div className="guidance-items-grid">
              {/* Item 1: Blessings Only */}
              <div className="guidance-box">
                <div className="guidance-icon-circle" aria-hidden="true">
                  <Gift size={18} className="guide-icon" />
                </div>
                <div className="guidance-content">
                  <h4 className="guidance-item-title">Blessings Only</h4>
                  <p className="guidance-item-text">
                    Your loving presence and sacred blessings are the most precious gifts we could ask for.
                    {wedding.confirmation.giftPreference ? ' Please follow the hosts’ confirmed gift guidance.' : ' Gift preferences are still to be confirmed with the hosts.'}
                  </p>
                </div>
              </div>

              {/* Item 2: Photography & Sacred Pheras */}
              <div className="guidance-box">
                <div className="guidance-icon-circle" aria-hidden="true">
                  <Camera size={18} className="guide-icon" />
                </div>
                <div className="guidance-content">
                  <h4 className="guidance-item-title">Cherish the Moments</h4>
                  <p className="guidance-item-text">
                    Please follow the hosts’ guidance on photography during each ceremony.
                  </p>
                </div>
              </div>

              {/* Item 3: Complimentary Valet Parking */}
              <div className="guidance-box">
                <div className="guidance-icon-circle" aria-hidden="true">
                  <Car size={18} className="guide-icon" />
                </div>
                <div className="guidance-content">
                  <h4 className="guidance-item-title">Travel &amp; Parking</h4>
                  <p className="guidance-item-text">
                    Parking and arrival arrangements will be shared after the hosts confirm them.
                  </p>
                </div>
              </div>

              {/* Item 4: Hyderabad Winter Weather Comfort */}
              <div className="guidance-box">
                <div className="guidance-icon-circle" aria-hidden="true">
                  <Wind size={18} className="guide-icon" />
                </div>
                <div className="guidance-content">
                  <h4 className="guidance-item-title">Winter Evening Comfort</h4>
                  <p className="guidance-item-text">
                    Weather and outdoor arrangements have not been confirmed. Check local forecasts closer to the event.
                  </p>
                </div>
              </div>
            </div>

            {/* Helpful helpline note */}
            <div className="guidance-bottom-note">
              <span className="bottom-note-text">
                Need any special assistance or accessibility arrangements during the events? 
                Please reach out to our guest coordinator desk on WhatsApp or at the hospitality desk.
              </span>
            </div>
          </div>
        </article>
      )}
    </section>
  );
};
