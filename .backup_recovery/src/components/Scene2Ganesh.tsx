import React from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingData';
import { SacredLotusMandala } from './RoyalSvgIcons';

interface Scene2Props {
  onNextScene: () => void;
}

export const Scene2Ganesh: React.FC<Scene2Props> = ({ onNextScene }) => {
  return (
    <section id="scene-2" className="scene-container" aria-label="Scene 2: Ganesh Ji Reveal">
      {/* Background: Majestic Temple Sanctuary with Lord Ganesha */}
      <div
        className="scene-bg-layer"
        style={{
          backgroundImage: `url('/assets/scene2_ganesh_divine.jpg')`,
        }}
      />
      <div className="scene-overlay-gradient" />

      {/* Radiant Celestial Halo Mandala — Positioned behind Ganesha's crown aura without obstructing deity */}
      <div
        style={{
          position: 'absolute',
          top: '36%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '380px',
          height: '380px',
          opacity: 0.38,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <SacredLotusMandala size={380} showOm={false} />
      </div>

      {/* Main Content — Perfectly framed with Lord Ganesha as unobstructed centerpiece */}
      <div
        className="scene-content max-w-4xl flex flex-col justify-between"
        style={{ height: '100%', maxHeight: '88vh', zIndex: 10 }}
      >
        {/* Top Auspicious Inscription */}
        <div className="flex flex-col items-center text-center pt-1">
          <div
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full mb-1"
            style={{
              background: 'rgba(58, 6, 18, 0.85)',
              border: '1.5px solid rgba(245, 207, 104, 0.7)',
              boxShadow: '0 0 25px rgba(245, 207, 104, 0.4)',
            }}
          >
            <Sparkles size={13} style={{ color: '#f5cf68' }} />
            <span className="font-classic text-xs tracking-widest uppercase text-gold-solid font-bold">
              Divine Auspicious Invocation
            </span>
            <Sparkles size={13} style={{ color: '#f5cf68' }} />
          </div>

          <h2
            className="font-devanagari text-2xl sm:text-3xl text-gold-gradient tracking-wide"
            style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.9)' }}
          >
            ॥ श्री गणेशाय नमः ॥
          </h2>
        </div>

        {/* Spacious Clear Zone for Lord Ganesha Deity Focal Point */}
        <div className="flex-1" style={{ minHeight: '180px' }} />

        {/* Bottom Devotional Shloka & English Blessing Plaque */}
        <div
          className="p-4 sm:p-5 rounded-2xl w-full max-w-xl mx-auto text-center"
          style={{
            background: 'rgba(22, 3, 9, 0.92)',
            border: '1.5px solid #d4af37',
            boxShadow: '0 15px 45px rgba(0, 0, 0, 0.9), 0 0 25px rgba(212, 175, 55, 0.3)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <p
            className="font-devanagari text-sm sm:text-base leading-relaxed text-gold-solid font-medium"
            style={{ letterSpacing: '0.04em' }}
          >
            {WEDDING_CONFIG.invitationText.blessingText}
          </p>

          <div className="w-20 h-0.5 mx-auto my-2" style={{ background: 'var(--color-gold-shimmer)' }} />

          <p className="font-editorial italic text-xs sm:text-sm leading-relaxed" style={{ color: '#fef5db' }}>
            "{WEDDING_CONFIG.invitationText.ganeshBlessingEnglish}"
          </p>

          {/* Scroll hint to Scene 3 */}
          <div
            className="scroll-hint mt-2 pt-1 border-t border-gold-deep/20"
            onClick={onNextScene}
            role="button"
            tabIndex={0}
            style={{ marginTop: '0.75rem' }}
          >
            <span style={{ fontSize: '0.75rem' }}>Scroll to Open Royal Curtains & Reveal Invitation</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
    </section>
  );
};
