import React, { useState } from 'react';
import { MapPin, RotateCcw, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WEDDING_CONFIG } from '../config/weddingData';

interface Scene6Props {
  onBackToTop: () => void;
  onOpenVenue: () => void;
  onOpenRSVP: () => void;
}

export const Scene6Baraat: React.FC<Scene6Props> = ({
  onBackToTop,
  onOpenVenue,
  onOpenRSVP,
}) => {
  const [celebrated, setCelebrated] = useState(false);

  const triggerCelebration = () => {
    setCelebrated(true);

    // Left cannon
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#e7c265', '#d4af37', '#e05666', '#f19066', '#ffffff'],
    });

    // Right cannon
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#e7c265', '#d4af37', '#e05666', '#f19066', '#ffffff'],
    });

    // Center starburst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#ffd700', '#ff6b81', '#f39c12', '#fff5cc'],
      });
    }, 400);
  };

  return (
    <section id="scene-6" className="scene-container" aria-label="Scene 6: Baraat Procession and Grand Finale">
      {/* Background: Grand illuminated palace gates with fireworks and baraat celebration */}
      <div
        className="scene-bg-layer"
        style={{
          backgroundImage: `url('/assets/scene6_baraat_finale.jpg')`,
        }}
      />
      <div className="scene-overlay-gradient" />

      {/* Main Content */}
      <div className="scene-content max-w-3xl">
        {/* Celebration Tag */}
        <div className="mb-2 flex flex-col items-center text-center max-w-xl mx-auto px-4">
          <div
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full mb-1.5 cursor-pointer"
            onClick={triggerCelebration}
            style={{
              background: 'rgba(92, 14, 32, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.6)',
              boxShadow: '0 0 25px rgba(212, 175, 55, 0.4)',
            }}
            title="Click to launch celebration flower fireworks"
          >
            <Sparkles size={13} style={{ color: '#f6e27a' }} />
            <span className="font-classic text-[11px] tracking-widest uppercase text-gold-solid">
              The Grand Baraat & Finale
            </span>
            <Sparkles size={13} style={{ color: '#f6e27a' }} />
          </div>

          <h2 className="font-devanagari text-xl sm:text-3xl text-gold-gradient tracking-wide">
            आनन्दोत्सव • The Grand Vivah Celebration
          </h2>
        </div>

        {/* Final Grand Invitation Card */}
        <div
          className="royal-glass p-5 sm:p-8 rounded-2xl border-gold-ornate my-2.5 w-full text-center"
          style={{
            background: 'rgba(25, 3, 10, 0.88)',
            border: '2px solid #d4af37',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 45px rgba(212, 175, 55, 0.35)',
          }}
        >
          {/* Lotus Monogram */}
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🪷</span>

          {/* Couple Names Finale */}
          <h3
            className="font-calligraphy text-5xl sm:text-7xl my-2 leading-none"
            style={{
              color: '#fff5cc',
              textShadow: '0 0 25px rgba(246, 226, 122, 0.8)',
            }}
          >
            {WEDDING_CONFIG.couple.brideFirstName} & {WEDDING_CONFIG.couple.groomFirstName}
          </h3>

          <div className="w-24 h-0.5 mx-auto my-4" style={{ background: 'var(--color-gold-shimmer)' }} />

          <p className="font-editorial text-sm sm:text-base leading-relaxed max-w-lg mx-auto" style={{ color: '#fdf2d0' }}>
            {WEDDING_CONFIG.invitationText.finalCelebrationMessage}
          </p>

          {/* Date & Venue Confirmation */}
          <div className="my-6 py-4 border-t border-b border-gold-deep/30 space-y-1.5">
            <p className="font-royal text-lg sm:text-xl font-bold text-gold-gradient">
              {WEDDING_CONFIG.weddingDate}
            </p>
            <p className="font-classic text-xs sm:text-sm text-gold-solid">
              {WEDDING_CONFIG.weddingDay} • {WEDDING_CONFIG.events[2].time}
            </p>
            <p className="text-xs sm:text-sm font-medium mt-2" style={{ color: '#ded3c2' }}>
              {WEDDING_CONFIG.venue.name}, {WEDDING_CONFIG.venue.locality}
            </p>
          </div>

          {/* Interactive Fireworks Button */}
          <div className="mb-6">
            <button
              onClick={triggerCelebration}
              className="btn-royal-gold text-xs py-2.5 px-6 inline-flex items-center gap-2"
            >
              <Sparkles size={15} />
              <span>{celebrated ? 'Shower More Rose Petals & Fireworks ✨' : 'Celebrate with Fireworks & Petals 🎆'}</span>
            </button>
          </div>

          {/* Core Interactive Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenVenue}
              className="btn-royal-gold text-xs sm:text-sm py-3 px-6 inline-flex items-center gap-2"
            >
              <MapPin size={16} />
              <span>View Venue Map</span>
            </button>

            <button
              onClick={onOpenRSVP}
              className="btn-royal-burgundy text-xs sm:text-sm py-3 px-6 inline-flex items-center gap-2"
            >
              <Heart size={16} fill="#fdf2d0" />
              <span>Send Wedding Blessings</span>
            </button>

            <button
              onClick={onBackToTop}
              className="btn-royal-burgundy text-xs sm:text-sm py-3 px-6 inline-flex items-center gap-2"
              title="Return to the beginning of the journey"
            >
              <RotateCcw size={16} />
              <span>Back to Beginning</span>
            </button>
          </div>
        </div>

        {/* Footer Credit & Hashtag */}
        <div className="text-center mt-4">
          <p className="font-classic text-xs tracking-widest text-gold-solid/80 uppercase">
            {WEDDING_CONFIG.couple.hashtag}
          </p>
          <p className="font-editorial italic text-[11px] text-ivory/60 mt-1">
            With love, respect & heartfelt gratitude from Sinha & Prasad Families
          </p>
        </div>
      </div>
    </section>
  );
};
