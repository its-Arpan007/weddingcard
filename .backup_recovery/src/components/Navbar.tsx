import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, MapPin, Heart, ChevronDown } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingData';
import { royalSoundtrack } from '../utils/soundtrack';

interface NavbarProps {
  activeScene: number;
  onSelectScene: (sceneId: number) => void;
  onOpenVenue: () => void;
  onOpenRSVP: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScene,
  onSelectScene,
  onOpenVenue,
  onOpenRSVP,
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Autoplay policy listener
    const handleFirstInteraction = () => {
      // Optional subtle init
    };
    window.addEventListener('click', handleFirstInteraction, { once: true });
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, []);

  const toggleMusic = () => {
    const playing = royalSoundtrack.toggle();
    setIsPlayingMusic(playing);
  };

  return (
    <header className="floating-nav" role="banner">
      {/* Couple Monogram / Hashtag */}
      <button
        onClick={() => onSelectScene(1)}
        className="flex items-center gap-2 px-2 py-1 text-left bg-transparent border-0 cursor-pointer"
        style={{ color: '#f6e27a', fontFamily: 'var(--font-serif-royal)', fontSize: '0.82rem', letterSpacing: '0.08em' }}
        title="Sneha & Dipak Wedding"
      >
        <span style={{ fontSize: '1rem' }}>🪷</span>
        <span style={{ display: 'none', minWidth: '90px' }} className="sm-inline">
          {WEDDING_CONFIG.couple.hashtag}
        </span>
      </button>

      {/* Scene Navigation Selector */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer transition-all"
          style={{
            background: 'rgba(74, 14, 28, 0.7)',
            border: '1px solid rgba(212, 175, 55, 0.5)',
            color: '#fdf2d0',
            fontFamily: 'var(--font-serif-classic)',
            fontSize: '0.78rem',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-expanded={isMenuOpen}
          aria-label="Select Wedding Scene"
        >
          <span>Scene {activeScene}</span>
          <ChevronDown size={14} style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {isMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(25, 4, 10, 0.95)',
              border: '1px solid #d4af37',
              borderRadius: '12px',
              padding: '0.4rem',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 175, 55, 0.3)',
              minWidth: '180px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              zIndex: 110,
              backdropFilter: 'blur(16px)',
            }}
          >
            {WEDDING_CONFIG.scenes.map((scene) => (
              <button
                key={scene.id}
                onClick={() => {
                  onSelectScene(scene.id);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg cursor-pointer transition-all"
                style={{
                  background: activeScene === scene.id ? 'rgba(114, 20, 34, 0.8)' : 'transparent',
                  color: activeScene === scene.id ? '#fff5cc' : '#e0d2c0',
                  border: activeScene === scene.id ? '1px solid rgba(212, 175, 55, 0.6)' : 'none',
                  fontSize: '0.76rem',
                  fontFamily: 'var(--font-serif-classic)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{scene.title}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{scene.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Music Toggle */}
      <button
        onClick={toggleMusic}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all"
        style={{
          background: isPlayingMusic ? 'rgba(102, 15, 34, 0.8)' : 'rgba(35, 8, 17, 0.6)',
          border: '1px solid rgba(212, 175, 55, 0.5)',
          color: '#fdf2d0',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-serif-classic)',
          display: 'flex',
          alignItems: 'center',
        }}
        title={isPlayingMusic ? 'Mute Shehnai & Sitar Music' : 'Play Royal Wedding Soundtrack'}
        aria-label="Toggle Royal Music"
      >
        {isPlayingMusic ? <Volume2 size={15} style={{ color: '#f6e27a' }} /> : <VolumeX size={15} style={{ color: '#a39281' }} />}
        <div className={`eq-bars ${!isPlayingMusic ? 'paused' : ''}`}>
          <div className="eq-bar"></div>
          <div className="eq-bar"></div>
          <div className="eq-bar"></div>
          <div className="eq-bar"></div>
        </div>
      </button>

      {/* Venue Shortcut */}
      <button
        onClick={onOpenVenue}
        className="px-2.5 py-1.5 rounded-full cursor-pointer transition-all"
        style={{
          background: 'rgba(35, 8, 17, 0.6)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          color: '#fdf2d0',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-serif-classic)',
        }}
        title="View Wedding Venue Details"
        aria-label="View Venue"
      >
        <MapPin size={14} style={{ color: '#f6e27a' }} />
        <span style={{ display: 'none' }} className="md-inline">Venue</span>
      </button>

      {/* RSVP / Blessings Button */}
      <button
        onClick={onOpenRSVP}
        className="px-3 py-1.5 rounded-full cursor-pointer transition-all"
        style={{
          background: 'linear-gradient(135deg, #cba135 0%, #f6e27a 100%)',
          color: '#380711',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '0.75rem',
          fontWeight: 700,
          fontFamily: 'var(--font-serif-classic)',
          letterSpacing: '0.04em',
        }}
        title="Send Wedding Blessings"
        aria-label="Send Blessings"
      >
        <Heart size={13} fill="#380711" />
        <span>RSVP</span>
      </button>
    </header>
  );
};
