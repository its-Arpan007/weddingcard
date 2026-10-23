import React from 'react';
import { ChevronDown, Sparkles, Heart } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingData';
import { RoyalBrideSilhouette, RoyalGroomSilhouette, OrnatePortraitFrame } from './RoyalSvgIcons';

interface Scene5Props {
  onNextScene: () => void;
  onOpenRSVP: () => void;
}

export const Scene5Family: React.FC<Scene5Props> = ({ onNextScene, onOpenRSVP }) => {
  return (
    <section id="scene-5" className="scene-container" aria-label="Scene 5: Family Details">
      {/* Background: Symmetrical royal pavilion terrace with lake reflections */}
      <div
        className="scene-bg-layer"
        style={{
          backgroundImage: `url('/assets/scene5_family_pavilion.jpg')`,
        }}
      />
      <div className="scene-overlay-gradient" />

      {/* Main Content */}
      <div className="scene-content">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-2 max-w-lg mx-auto px-4">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full mb-1"
            style={{
              background: 'rgba(74, 14, 28, 0.75)',
              border: '1px solid rgba(212, 175, 55, 0.55)',
            }}
          >
            <Sparkles size={12} style={{ color: '#f6e27a' }} />
            <span className="font-classic text-[11px] tracking-widest uppercase text-gold-solid">
              Two Families United by Love
            </span>
            <Sparkles size={12} style={{ color: '#f6e27a' }} />
          </div>
          <h2 className="font-royal text-xl sm:text-2xl text-gold-gradient tracking-wide">
            With Blessings of Our Families
          </h2>
          <p className="font-editorial italic text-xs mt-0.5 max-w-md mx-auto" style={{ color: '#ede3d5' }}>
            Bound together by tradition, respect, and eternal familial joy
          </p>
        </div>

        {/* Symmetrical Family Presentation Arches flanking central palace vista */}
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 lg:gap-8 w-full max-w-4xl mb-2">
          {/* Left Side: Bride's Family (Sinha Parivaar) */}
          <div className="family-arch-frame text-center flex-1">
            {/* Top Floral & Arch Emblem */}
            <div
              className="w-10 h-10 mx-auto mb-1 rounded-full flex items-center justify-center border-2 border-gold-bright"
              style={{
                background: 'radial-gradient(circle, #721422 0%, #300610 100%)',
                boxShadow: '0 0 16px rgba(212, 175, 55, 0.5)',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🪷</span>
            </div>

            <div
              className="inline-block px-3 py-0.5 rounded-full text-[10px] font-classic uppercase tracking-widest font-bold text-gold-deep mb-1.5"
              style={{ background: 'rgba(212, 175, 55, 0.18)', border: '1px solid rgba(212, 175, 55, 0.4)' }}
            >
              Bride's Family
            </div>

            <h3 className="font-royal text-lg sm:text-xl text-gold-deep mb-0.5 font-bold">
              Sinha Parivaar
            </h3>

            {/* Parents' Names */}
            <div className="my-1.5 py-1.5 border-t border-b border-gold-deep/20">
              <p className="font-classic text-xs sm:text-sm font-bold" style={{ color: '#3a0612' }}>
                {WEDDING_CONFIG.parents.bride.father}
              </p>
              <span className="text-[10px] text-gold-deep block my-0.5 font-bold">&</span>
              <p className="font-classic text-xs sm:text-sm font-bold" style={{ color: '#3a0612' }}>
                {WEDDING_CONFIG.parents.bride.mother}
              </p>
            </div>

            {/* Daughter Highlight */}
            <div className="mt-1">
              <p className="font-editorial italic text-[11px] tracking-wider uppercase mb-0.5 font-semibold" style={{ color: '#684534' }}>
                Daughter :
              </p>
              <h4
                className="font-calligraphy text-3xl sm:text-4xl my-0.5 leading-tight"
                style={{
                  color: '#781229',
                  textShadow: '0 1px 4px rgba(120, 18, 41, 0.2)',
                }}
              >
                {WEDDING_CONFIG.couple.brideFirstName}
              </h4>
            </div>

            {/* Royal Bride Silhouette in Ornate Frame */}
            <OrnatePortraitFrame title="Sneha Sinha" subtitle="The Cherished Bride">
              <RoyalBrideSilhouette size={72} />
            </OrnatePortraitFrame>
          </div>

          {/* Right Side: Groom's Family (Prasad Parivaar) */}
          <div className="family-arch-frame text-center flex-1">
            {/* Top Floral & Arch Emblem */}
            <div
              className="w-10 h-10 mx-auto mb-1 rounded-full flex items-center justify-center border-2 border-gold-bright"
              style={{
                background: 'radial-gradient(circle, #721422 0%, #300610 100%)',
                boxShadow: '0 0 16px rgba(212, 175, 55, 0.5)',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🪷</span>
            </div>

            <div
              className="inline-block px-3 py-0.5 rounded-full text-[10px] font-classic uppercase tracking-widest font-bold text-gold-deep mb-1.5"
              style={{ background: 'rgba(212, 175, 55, 0.18)', border: '1px solid rgba(212, 175, 55, 0.4)' }}
            >
              Groom's Family
            </div>

            <h3 className="font-royal text-lg sm:text-xl text-gold-deep mb-0.5 font-bold">
              Prasad Parivaar
            </h3>

            {/* Parents' Names */}
            <div className="my-1.5 py-1.5 border-t border-b border-gold-deep/20">
              <p className="font-classic text-xs sm:text-sm font-bold" style={{ color: '#3a0612' }}>
                {WEDDING_CONFIG.parents.groom.father}
              </p>
              <span className="text-[10px] text-gold-deep block my-0.5 font-bold">&</span>
              <p className="font-classic text-xs sm:text-sm font-bold" style={{ color: '#3a0612' }}>
                {WEDDING_CONFIG.parents.groom.mother}
              </p>
            </div>

            {/* Son Highlight */}
            <div className="mt-1">
              <p className="font-editorial italic text-[11px] tracking-wider uppercase mb-0.5 font-semibold" style={{ color: '#684534' }}>
                Son :
              </p>
              <h4
                className="font-calligraphy text-3xl sm:text-4xl my-0.5 leading-tight"
                style={{
                  color: '#781229',
                  textShadow: '0 1px 4px rgba(120, 18, 41, 0.2)',
                }}
              >
                {WEDDING_CONFIG.couple.groomFirstName}
              </h4>
            </div>

            {/* Royal Groom Silhouette in Ornate Frame */}
            <OrnatePortraitFrame title="Dipak Prasad" subtitle="The Cherished Groom">
              <RoyalGroomSilhouette size={72} />
            </OrnatePortraitFrame>
          </div>
        </div>

        {/* Central Pathway & Blessing RSVP button */}
        <div className="flex flex-col items-center gap-1.5">
          <button onClick={onOpenRSVP} className="btn-royal-gold text-xs py-1.5 px-5 inline-flex items-center gap-1.5">
            <Heart size={13} fill="#380711" />
            <span>Send Warm Wishes to Both Families</span>
          </button>

          {/* Scroll hint to Scene 6 */}
          <div className="scroll-hint mt-1" onClick={onNextScene} role="button" tabIndex={0}>
            <span>Scroll to Baraat Procession & Grand Finale</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
    </section>
  );
};
