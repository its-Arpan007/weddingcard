import React, { useState } from 'react';
import { Sparkles, ArrowDown } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingData';

interface Scene1Props {
  onEnvelopeOpened: () => void;
  onNextScene: () => void;
}

export const Scene1Envelope: React.FC<Scene1Props> = ({ onEnvelopeOpened, onNextScene }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSealGlowing, setIsSealGlowing] = useState(false);
  const [burstActive, setBurstActive] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpen) return;

    // Step 1: Wax seal pulses with golden light
    setIsSealGlowing(true);

    if (navigator.vibrate) {
      navigator.vibrate(60);
    }

    // Step 2: Flap rotates open in 3D & Inner Card slides up
    setTimeout(() => {
      setIsOpen(true);
      setBurstActive(true);
      onEnvelopeOpened();
    }, 450);

    // Step 3: Transition to Scene 2
    setTimeout(() => {
      onNextScene();
    }, 1800);
  };

  return (
    <section id="scene-1" className="scene-container" aria-label="Scene 1: Envelope Opening">
      {/* Background: Luminous Royal Palace & Lotus Pond with Diyas */}
      <div
        className="scene-bg-layer"
        style={{
          backgroundImage: `url('/assets/scene1_palace_pond.jpg')`,
          transform: isOpen ? 'scale(1.03)' : 'scale(1)',
        }}
      />
      <div className="scene-overlay-gradient" />

      {/* Main Content */}
      <div className="scene-content">
        {/* Top Header Tag */}
        <div className="mb-2 flex flex-col items-center text-center max-w-2xl mx-auto px-4">
          <div
            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full mb-1.5"
            style={{
              background: 'rgba(74, 14, 28, 0.85)',
              border: '1.5px solid rgba(245, 207, 104, 0.7)',
              boxShadow: '0 0 25px rgba(245, 207, 104, 0.35)',
            }}
          >
            <span style={{ fontSize: '1rem' }}>🪷</span>
            <span className="font-classic text-xs tracking-widest uppercase text-gold-solid font-bold">
              The Royal Wedding Invitation
            </span>
            <span style={{ fontSize: '1rem' }}>🪷</span>
          </div>

          <h1
            className="font-royal text-3xl sm:text-4xl lg:text-5xl text-gold-gradient tracking-wide"
            style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)' }}
          >
            {WEDDING_CONFIG.couple.brideFirstName} & {WEDDING_CONFIG.couple.groomFirstName}
          </h1>
          <p
            className="font-editorial italic text-xs sm:text-sm mt-1 font-medium"
            style={{ color: '#fffdfa', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
          >
            A magical journey of sacred love and eternal togetherness
          </p>
        </div>

        {/* Real 3D Layered Envelope Stage */}
        <div className="envelope-3d-scene" onClick={handleOpenEnvelope}>
          <div className={`envelope-wrapper ${isOpen ? 'is-open' : ''}`}>
            {/* 1. Envelope Back Interior with silk lining */}
            <div className="envelope-back">
              <div
                style={{
                  position: 'absolute',
                  inset: '10px',
                  border: '1px dashed rgba(245, 207, 104, 0.3)',
                  borderRadius: '6px',
                }}
              />
            </div>

            {/* 2. Inner Invitation Card that physically emerges UP */}
            <div className="envelope-inner-card">
              <div className="corner-ornament top-left" style={{ borderColor: '#c49a2a', width: '16px', height: '16px' }} />
              <div className="corner-ornament top-right" style={{ borderColor: '#c49a2a', width: '16px', height: '16px' }} />
              
              <span className="font-devanagari text-xs font-bold" style={{ color: '#781229' }}>
                ॥ श्री गणेशाय नमः ॥
              </span>

              <h2
                className="font-calligraphy text-3xl sm:text-4xl my-1 leading-tight"
                style={{ color: '#781229' }}
              >
                Sneha & Dipak
              </h2>

              <p className="font-classic text-[11px] font-bold uppercase tracking-wider" style={{ color: '#8c5a10' }}>
                29 November 2026
              </p>
              <p className="font-editorial italic text-[10px]" style={{ color: '#4a0e1c' }}>
                Sethjees Banquet, Kanchrapara
              </p>
            </div>

            {/* 3. Solid Seamless Front Pocket with Royal Velvet Texture & Gold Filigree */}
            <div className="envelope-pocket-front">
              {/* Ornate Gold Corner Filigree */}
              <div className="corner-ornament bottom-left" style={{ borderColor: '#f5cf68', width: '22px', height: '22px' }} />
              <div className="corner-ornament bottom-right" style={{ borderColor: '#f5cf68', width: '22px', height: '22px' }} />

              {/* Royal Floral Damask Pattern Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: '8px',
                  border: '1.5px solid rgba(212, 175, 55, 0.55)',
                  borderRadius: '6px',
                  background: 'radial-gradient(ellipse at 50% 80%, rgba(120, 18, 41, 0.3) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Subtle Gold Lotus Emblem on Pocket */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: 'rgba(245, 207, 104, 0.75)',
                  fontSize: '1.25rem',
                  letterSpacing: '0.2em',
                }}
              >
                🪷
              </div>
            </div>

            {/* 4. 3D Hinged Top Triangular Flap with Gold Border */}
            <div className="envelope-top-flap">
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                  borderTop: '2px solid #f5cf68',
                  background: 'linear-gradient(175deg, #781229 0%, #4a0a18 100%)',
                  boxShadow: 'inset 0 2px 10px rgba(255, 240, 150, 0.3)',
                }}
              />
            </div>

            {/* 5. Gold Lotus Wax Seal & Hanging Tassel */}
            <button
              type="button"
              className={`wax-seal ${isSealGlowing ? 'is-glowing' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEnvelope();
              }}
              title="Click to break seal and open the royal invitation"
              aria-label="Open wedding invitation"
            >
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  backgroundImage: `url('/assets/wax_seal_lotus.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '2.5px solid #f5cf68',
                  boxShadow: isSealGlowing
                    ? '0 0 45px rgba(255, 240, 150, 1), 0 0 80px rgba(212, 175, 55, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.9)'
                    : '0 0 20px rgba(212, 175, 55, 0.6), inset 0 0 10px rgba(0,0,0,0.5)',
                  transition: 'all 0.4s ease',
                }}
              />
              <span
                style={{
                  fontSize: '9px',
                  color: '#fffdfa',
                  fontFamily: 'var(--font-serif-classic)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  position: 'absolute',
                  bottom: '6px',
                  fontWeight: 700,
                  textShadow: '0 1px 4px #000',
                }}
              >
                OPEN
              </span>
              <div className="seal-tassel" />
            </button>
          </div>
        </div>

        {/* Clear Interaction Controls — Matches Storyboard Panel 04 */}
        {!isOpen ? (
          <div className="text-center mt-5">
            <button
              onClick={handleOpenEnvelope}
              className="btn-royal-gold text-xs sm:text-sm py-3 px-8 inline-flex items-center gap-2.5 cursor-pointer shadow-lg hover:scale-105 transition-all"
              style={{
                boxShadow: '0 0 30px rgba(245, 207, 104, 0.65), 0 8px 25px rgba(0,0,0,0.6)',
              }}
            >
              <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>👆</span>
              <span className="font-royal tracking-widest text-sm font-bold">Click to Open</span>
              <Sparkles size={16} />
            </button>
            <p
              className="text-xs tracking-wider uppercase font-classic font-semibold mt-2.5"
              style={{ color: '#f5cf68', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
            >
              Tap the golden wax seal or button to open
            </p>
          </div>
        ) : (
          <div className="text-center mt-5">
            <button
              onClick={onNextScene}
              className="btn-royal-gold text-xs sm:text-sm py-2.5 px-6 inline-flex items-center gap-2"
            >
              <span>Proceed to Divine Blessings</span>
              <ArrowDown size={14} />
            </button>
          </div>
        )}

        {/* Golden Light Burst Flash Effect */}
        <div className={`golden-light-burst ${burstActive ? 'active' : ''}`} />
      </div>
    </section>
  );
};
