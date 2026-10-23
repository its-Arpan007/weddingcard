import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, MapPin, Calendar, Sparkles } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingData';

interface Scene3Props {
  onNextScene: () => void;
  onOpenVenue: () => void;
  onOpenRSVP: () => void;
}

export const Scene3Invitation: React.FC<Scene3Props> = ({
  onNextScene,
  onOpenVenue,
  onOpenRSVP,
}) => {
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Automatically trigger smooth curtain parting when Scene 3 is viewed
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Slight delay to allow palace arch to settle, then smoothly part curtains
          setTimeout(() => {
            setCurtainsOpen(true);
          }, 400);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="scene-3" className="scene-container" aria-label="Scene 3: The Grand Invitation Reveal">
      {/* Background: Palace entrance framed by marble arches & peacocks */}
      <div
        className="scene-bg-layer"
        style={{
          backgroundImage: `url('/assets/scene3_palace_entrance.jpg')`,
        }}
      />
      <div className="scene-overlay-gradient" />

      {/* Main Content */}
      <div className="scene-content">
        {/* Curtains Stage */}
        <div ref={stageRef} className={`curtains-stage ${curtainsOpen ? 'is-open' : ''}`}>
          {/* Left Velvet Curtain Panel with Gold Trim & Tieback */}
          <div className="curtain-panel left">
            <div className="curtain-pleats" />
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '6px',
                height: '100%',
                background: 'linear-gradient(to bottom, #fff7d6, #f5cf68, #8c5a10)',
                boxShadow: '0 0 20px rgba(245, 207, 104, 0.9)',
              }}
            />
            <div className="curtain-tieback left" title="Curtain Tieback">
              <span style={{ fontSize: '11px' }}>🎗️</span>
            </div>
          </div>

          {/* Right Velvet Curtain Panel with Gold Trim & Tieback */}
          <div className="curtain-panel right">
            <div className="curtain-pleats" />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '6px',
                height: '100%',
                background: 'linear-gradient(to bottom, #fff7d6, #f5cf68, #8c5a10)',
                boxShadow: '0 0 20px rgba(245, 207, 104, 0.9)',
              }}
            />
            <div className="curtain-tieback right" title="Curtain Tieback">
              <span style={{ fontSize: '11px' }}>🎗️</span>
            </div>
          </div>

          {/* The Grand Ivory Invitation Card */}
          <div className="invitation-card-grand">
            {/* Corner Decorative Ornaments */}
            <div className="corner-ornament top-left" />
            <div className="corner-ornament top-right" />
            <div className="corner-ornament bottom-left" />
            <div className="corner-ornament bottom-right" />

            <div className="card-inner-border">
              {/* Auspicious Shloka */}
              <div className="text-center mb-2">
                <span className="font-devanagari text-lg sm:text-2xl font-bold tracking-wide" style={{ color: '#781229' }}>
                  {WEDDING_CONFIG.invitationText.shloka}
                </span>
                <div className="w-20 h-0.5 mx-auto my-1.5" style={{ background: '#d4af37' }} />
              </div>

              {/* Parents of the Bride */}
              <div className="text-center mb-2">
                <p className="font-classic text-base sm:text-2xl font-bold tracking-wide" style={{ color: '#2b030b' }}>
                  {WEDDING_CONFIG.parents.bride.father} & {WEDDING_CONFIG.parents.bride.mother}
                </p>
                <p className="font-editorial italic text-xs sm:text-sm mt-0.5 font-medium" style={{ color: '#542614' }}>
                  {WEDDING_CONFIG.invitationText.cordialMessage}
                </p>
              </div>

              {/* Couple's Names Reveal — Magnificent Prominent Calligraphy */}
              <div className="text-center my-1.5 py-0.5">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 leading-none">
                  <h3
                    className="font-calligraphy text-4xl sm:text-6xl lg:text-7xl leading-tight"
                    style={{
                      color: '#781229',
                      textShadow: '0 2px 14px rgba(120, 18, 41, 0.28)',
                    }}
                  >
                    {WEDDING_CONFIG.couple.brideFirstName}
                  </h3>
                  <span className="font-editorial italic text-xs sm:text-sm font-bold block" style={{ color: '#8c5a10' }}>
                    — with —
                  </span>
                  <h3
                    className="font-calligraphy text-4xl sm:text-6xl lg:text-7xl leading-tight"
                    style={{
                      color: '#781229',
                      textShadow: '0 2px 14px rgba(120, 18, 41, 0.28)',
                    }}
                  >
                    {WEDDING_CONFIG.couple.groomFirstName}
                  </h3>
                </div>
              </div>

              {/* Parents of the Groom */}
              <div className="text-center mb-2.5">
                <p className="font-classic text-xs sm:text-base font-bold" style={{ color: '#2b030b' }}>
                  Beloved son of {WEDDING_CONFIG.parents.groom.father} & {WEDDING_CONFIG.parents.groom.mother}
                </p>
              </div>

              {/* Date & Venue Badges */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2 pt-2 border-t border-gold-deep/20">
                <div
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                  style={{ background: 'rgba(120, 18, 41, 0.08)', border: '1.5px solid #d4af37' }}
                >
                  <Calendar size={15} style={{ color: '#781229' }} />
                  <span className="font-classic text-xs sm:text-sm font-bold" style={{ color: '#2b030b' }}>
                    {WEDDING_CONFIG.weddingDate} ({WEDDING_CONFIG.weddingDay})
                  </span>
                </div>

                <button
                  onClick={onOpenVenue}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full cursor-pointer transition-colors"
                  style={{ background: 'rgba(120, 18, 41, 0.08)', border: '1.5px solid #d4af37' }}
                  title="Click to view venue on map"
                >
                  <MapPin size={15} style={{ color: '#781229' }} />
                  <span className="font-classic text-xs sm:text-sm font-bold" style={{ color: '#2b030b' }}>
                    {WEDDING_CONFIG.venue.name}, {WEDDING_CONFIG.venue.locality}
                  </span>
                </button>
              </div>

              {/* Action Buttons on Card */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
                <button onClick={onOpenRSVP} className="btn-royal-gold text-xs sm:text-sm py-2 px-6">
                  <Sparkles size={14} />
                  <span>Send Blessings</span>
                </button>
                <button onClick={onOpenVenue} className="btn-royal-burgundy text-xs sm:text-sm py-2 px-6">
                  <span>View Venue Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Curtain Toggle & Scroll Hint */}
        <div className="mt-3 flex flex-col items-center gap-1.5">
          <button
            onClick={() => setCurtainsOpen(!curtainsOpen)}
            className="text-[11px] font-classic uppercase tracking-widest px-4 py-1 rounded-full cursor-pointer transition-all"
            style={{
              background: 'rgba(58, 6, 18, 0.85)',
              border: '1.5px solid rgba(245, 207, 104, 0.6)',
              color: '#fef5db',
            }}
          >
            {curtainsOpen ? 'Reclose Curtains' : 'Part Royal Curtains'}
          </button>

          <div className="scroll-hint mt-1" onClick={onNextScene} role="button" tabIndex={0}>
            <span>Scroll to Wedding Events & Countdown</span>
            <ChevronDown size={18} />
          </div>
        </div>
      </div>
    </section>
  );
};
