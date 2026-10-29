import { useEffect, useState } from 'react';
import { SealedEnvelope } from './components/SealedEnvelope';
import { InvitationSuite } from './components/InvitationSuite';
import { FallingPetals } from './components/FallingPetals';
import { wedding } from './data/wedding';
import './styles/tokens.css';
import './styles/envelope.css';
import './styles/suite.css';

export function App() {
  const [isInvitationOpen, setIsInvitationOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('open') === 'true' || window.location.hash.length > 0;
    }
    return false;
  });

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
    if (opened) {
      setTimeout(() => {
        const el = document.getElementById('main-announcement-suite');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1200);
    }
  };

  const handleExploreSuite = () => {
    setIsInvitationOpen(true);
    setTimeout(() => {
      const el = document.getElementById('main-announcement-suite');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div className={`app-root ${isInvitationOpen ? 'invitation-active' : ''}`}>
      {/* Soft Falling Flower Petals Overlay from Reference Video */}
      <FallingPetals enabled={true} />

      {/* 1. Hero Opening Screen with Gatefold / Full-Screen Palace Doors */}
      <section className="envelope-hero-viewport" aria-label="Sealed Wedding Envelope">
        <SealedEnvelope
          initialOpen={isInvitationOpen}
          onStateChange={handleEnvelopeStateChange}
          onExploreSuite={handleExploreSuite}
        />
      </section>

      {/* 2. Continuous Invitation Suite */}
      {isInvitationOpen && (
        <section id="main-announcement-suite" className="suite-content-section" aria-label="Wedding Invitation Suite">
          <InvitationSuite />
        </section>
      )}
    </div>
  );
}

export default App;
