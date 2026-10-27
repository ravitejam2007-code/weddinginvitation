import { useEffect, useState } from 'react';
import { SealedEnvelope } from './components/SealedEnvelope';
import { InvitationSuite } from './components/InvitationSuite';
import { FallingPetals } from './components/FallingPetals';
import { MusicPlayer } from './components/MusicPlayer';
import { MusicProvider } from './context/MusicContext';
import { wedding } from './data/wedding';
import './styles/tokens.css';
import './styles/envelope.css';
import './styles/suite.css';

export function App() {
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);

  useEffect(() => {
    document.title = `Wedding Invitation | ${wedding.couple.brideName} & ${wedding.couple.groomName}`;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute(
      'content',
      `You are cordially invited to celebrate the wedding of ${wedding.couple.brideName} and ${wedding.couple.groomName}.`,
    );
  }, []);

  const handleEnvelopeStateChange = (opened: boolean) => {
    setIsInvitationOpen(opened);
    // Note: Music does NOT auto-start to respect user gesture and preference requirements
    if (opened) {
      // Smoothly transition view down to the main invitation area after the card finishes emerging
      setTimeout(() => {
        const el = document.getElementById('main-announcement-suite');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 2200);
    }
  };

  const handleExploreSuite = () => {
    const el = document.getElementById('main-announcement-suite');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <MusicProvider>
      <div className={`app-root ${isInvitationOpen ? 'invitation-active' : ''}`}>
        {/* Falling Rose, Marigold & Jasmine Petals Overlay */}
        <FallingPetals enabled={false} />

        {/* Minimalist Floating Wedding Music Controller */}
        <MusicPlayer />

        {/* 1. Hero Sealed Envelope Section (The First Impression) */}
        <section className="envelope-hero-viewport" aria-label="Sealed Wedding Envelope">
          <SealedEnvelope
            sealMotif="ganesha"
            onStateChange={handleEnvelopeStateChange}
            onExploreSuite={handleExploreSuite}
          />
        </section>

        {/* 2. Continuous Invitation Suite (Where normal page scrolling begins) */}
        {isInvitationOpen && (
          <section id="main-announcement-suite" className="suite-content-section" aria-label="Wedding Invitation Suite">
            <InvitationSuite />
          </section>
        )}
      </div>
    </MusicProvider>
  );
}

export default App;
