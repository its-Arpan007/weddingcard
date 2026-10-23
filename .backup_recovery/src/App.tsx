import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FloatingPetals } from './components/FloatingPetals';
import { GoldenParticles } from './components/GoldenParticles';
import { Scene1Envelope } from './components/Scene1Envelope';
import { Scene2Ganesh } from './components/Scene2Ganesh';
import { Scene3Invitation } from './components/Scene3Invitation';
import { Scene4Events } from './components/Scene4Events';
import { Scene5Family } from './components/Scene5Family';
import { Scene6Baraat } from './components/Scene6Baraat';
import { VenueModal } from './components/VenueModal';
import { RSVPModal } from './components/RSVPModal';

export function App() {
  const [activeScene, setActiveScene] = useState<number>(1);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);

  // Active scene observer via IntersectionObserver
  useEffect(() => {
    const sceneElements = [1, 2, 3, 4, 5, 6].map((id) =>
      document.getElementById(`scene-${id}`)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.id.replace('scene-', ''));
            if (!isNaN(id)) {
              setActiveScene(id);
            }
          }
        });
      },
      {
        threshold: 0.35,
      }
    );

    sceneElements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToScene = (sceneId: number) => {
    const el = document.getElementById(`scene-${sceneId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleEnvelopeOpened = () => {
    // When envelope opens, trigger smooth transition after light flash
    setTimeout(() => {
      scrollToScene(2);
    }, 1300);
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-ivory selection:bg-burgundy selection:text-gold">
      {/* Top Floating Royal Navigation */}
      <Navbar
        activeScene={activeScene}
        onSelectScene={scrollToScene}
        onOpenVenue={() => setIsVenueModalOpen(true)}
        onOpenRSVP={() => setIsRSVPModalOpen(true)}
      />

      {/* Global Canvas Ambient Animation: Floating Rose/Marigold Petals */}
      <FloatingPetals />

      {/* Global Canvas Ambient Animation: Golden Sacred Dust */}
      <GoldenParticles />

      {/* The 6 Continuous Animated Scenes */}
      <main role="main">
        {/* Scene 1 — Envelope Opening */}
        <Scene1Envelope
          onEnvelopeOpened={handleEnvelopeOpened}
          onNextScene={() => scrollToScene(2)}
        />

        {/* Scene 2 — Ganesh Ji Reveal */}
        <Scene2Ganesh onNextScene={() => scrollToScene(3)} />

        {/* Scene 3 — The Grand Invitation Reveal */}
        <Scene3Invitation
          onNextScene={() => scrollToScene(4)}
          onOpenVenue={() => setIsVenueModalOpen(true)}
          onOpenRSVP={() => setIsRSVPModalOpen(true)}
        />

        {/* Scene 4 — Wedding Events & Countdown */}
        <Scene4Events
          onNextScene={() => scrollToScene(5)}
          onOpenVenue={() => setIsVenueModalOpen(true)}
        />

        {/* Scene 5 — Family Details */}
        <Scene5Family
          onNextScene={() => scrollToScene(6)}
          onOpenRSVP={() => setIsRSVPModalOpen(true)}
        />

        {/* Scene 6 — Baraat Procession & Grand Finale */}
        <Scene6Baraat
          onBackToTop={handleBackToTop}
          onOpenVenue={() => setIsVenueModalOpen(true)}
          onOpenRSVP={() => setIsRSVPModalOpen(true)}
        />
      </main>

      {/* Interactive Modals */}
      <VenueModal
        isOpen={isVenueModalOpen}
        onClose={() => setIsVenueModalOpen(false)}
      />

      <RSVPModal
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
      />
    </div>
  );
}

export default App;
