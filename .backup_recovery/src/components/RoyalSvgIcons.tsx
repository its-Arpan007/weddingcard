import React from 'react';

/**
 * Sacred Rotating Lotus Mandala with Om symbol for Scene 2 (Ganesh Ji Reveal)
 * Matches storyboard reference panels 02, 03, and 04.
 */
export const SacredLotusMandala: React.FC<{ className?: string; size?: number; showOm?: boolean }> = ({
  className = '',
  size = 380,
  showOm = true,
}) => {
  return (
    <div
      className={`sacred-mandala-wrapper ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Outer Golden Aura Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(245, 207, 104, 0.45) 0%, rgba(212, 175, 55, 0.15) 50%, transparent 75%)',
          filter: 'blur(16px)',
          animation: 'mandalaPulse 4s infinite ease-in-out',
        }}
      />

      {/* Rotating Sacred Mandala Ring */}
      <svg
        viewBox="0 0 400 400"
        width={size}
        height={size}
        className="sacred-mandala-spin"
        style={{
          position: 'absolute',
          inset: 0,
          animation: 'rotateMandala 40s linear infinite',
          filter: 'drop-shadow(0 0 14px rgba(245, 207, 104, 0.8))',
        }}
      >
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff7d6" />
            <stop offset="40%" stopColor="#f5cf68" />
            <stop offset="70%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>
          <radialGradient id="sunburst" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 245, 210, 0.9)" />
            <stop offset="50%" stopColor="rgba(245, 207, 104, 0.5)" />
            <stop offset="100%" stopColor="rgba(140, 90, 16, 0)" />
          </radialGradient>
        </defs>

        {/* Radiating 24 divine rays */}
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={`ray-${i}`}
            x1="200"
            y1="200"
            x2={200 + 190 * Math.cos((i * 15 * Math.PI) / 180)}
            y2={200 + 190 * Math.sin((i * 15 * Math.PI) / 180)}
            stroke="url(#goldGrad)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.6"
          />
        ))}

        {/* Concentric Sacred Circles */}
        <circle cx="200" cy="200" r="185" fill="none" stroke="url(#goldGrad)" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
        <circle cx="200" cy="200" r="170" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="145" fill="none" stroke="url(#goldGrad)" strokeWidth="2.5" />
        <circle cx="200" cy="200" r="120" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" strokeDasharray="5 3" />
        <circle cx="200" cy="200" r="80" fill="none" stroke="url(#goldGrad)" strokeWidth="2" />
        <circle cx="200" cy="200" r="60" fill="url(#sunburst)" stroke="url(#goldGrad)" strokeWidth="1.5" />

        {/* 16 Outer Sacred Lotus Petals */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 22.5 * Math.PI) / 180;
          const x = 200 + 145 * Math.cos(angle);
          const y = 200 + 145 * Math.sin(angle);
          const rot = (i * 22.5) + 90;
          return (
            <path
              key={`petal-outer-${i}`}
              d="M 0,0 C -12,-20 -15,-40 0,-55 C 15,-40 12,-20 0,0 Z"
              transform={`translate(${x}, ${y}) rotate(${rot})`}
              fill="rgba(245, 207, 104, 0.18)"
              stroke="url(#goldGrad)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* 12 Inner Sacred Lotus Petals */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x = 200 + 80 * Math.cos(angle);
          const y = 200 + 80 * Math.sin(angle);
          const rot = (i * 30) + 90;
          return (
            <path
              key={`petal-inner-${i}`}
              d="M 0,0 C -8,-14 -10,-28 0,-38 C 10,-28 8,-14 0,0 Z"
              transform={`translate(${x}, ${y}) rotate(${rot})`}
              fill="rgba(255, 247, 214, 0.28)"
              stroke="url(#goldGrad)"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      {/* Central Sacred Om (ॐ) Emblem - Stays Oriented Upright with Golden Glow */}
      {showOm && (
        <div
          style={{
            position: 'relative',
            zIndex: 5,
            color: '#fff7d6',
            fontSize: `${size * 0.26}px`,
            fontFamily: "'Rozha One', 'Cinzel', serif",
            fontWeight: 700,
            textShadow:
              '0 0 25px rgba(255, 240, 160, 1), 0 0 45px rgba(212, 175, 55, 0.8), 0 2px 8px rgba(0,0,0,0.8)',
            animation: 'omPulse 3s infinite ease-in-out',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          ॐ
        </div>
      )}
    </div>
  );
};

/**
 * Royal Indian Bride Silhouette in traditional bridal jewelry & chunari
 * Matches storyboard reference Scene 5 panel Close-up 3
 */
export const RoyalBrideSilhouette: React.FC<{ size?: number }> = ({ size = 110 }) => {
  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2}>
      <defs>
        <linearGradient id="brideGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff9e6" />
          <stop offset="45%" stopColor="#f5cf68" />
          <stop offset="85%" stopColor="#c49a2a" />
          <stop offset="100%" stopColor="#7a5510" />
        </linearGradient>
      </defs>
      {/* Traditional Indian Bride Profile with Maang Tikka, Jhumka, Nose Ring, and Bridal Dupatta */}
      <g fill="url(#brideGold)" opacity="0.95">
        {/* Hair bun (Juda) with floral gajra */}
        <circle cx="34" cy="42" r="14" />
        <circle cx="28" cy="42" r="8" opacity="0.6" />
        {/* Forehead & facial profile */}
        <path d="M 44,28 C 48,28 55,32 55,38 C 55,42 52,44 54,47 C 56,50 60,52 57,55 C 55,57 52,57 51,60 C 50,63 46,65 42,66 C 38,67 36,75 36,82 L 40,84 L 46,95 L 68,118 L 18,118 L 22,85 C 22,78 28,68 34,66 Z" />
        {/* Maang Tikka (forehead jewel) */}
        <circle cx="53" cy="34" r="2.5" fill="#fff" />
        <line x1="47" y1="28" x2="53" y2="34" stroke="#fff" strokeWidth="1" />
        {/* Nose Ring (Nath) */}
        <circle cx="58" cy="53" r="3.5" fill="none" stroke="#fff" strokeWidth="1.2" />
        <path d="M 58,53 Q 48,46 44,48" fill="none" stroke="#fff" strokeWidth="0.8" />
        {/* Jhumka Earring */}
        <circle cx="43" cy="50" r="1.8" fill="#fff" />
        <polygon points="41,54 45,54 43,59" fill="#fff" />
        {/* Layered Bridal Necklaces (Haar) */}
        <path d="M 39,72 Q 47,78 51,73" fill="none" stroke="#fff" strokeWidth="2" />
        <path d="M 37,78 Q 47,86 53,79" fill="none" stroke="#fff" strokeWidth="1.5" />
        {/* Saree Pallu / Bridal Chunari drape over shoulder */}
        <path
          d="M 28,45 C 16,56 12,85 14,118 L 32,118 C 30,95 32,70 36,60 Z"
          opacity="0.85"
        />
        <path
          d="M 14,118 L 86,118 C 84,106 72,96 60,94 C 54,93 48,94 44,98 L 40,118 Z"
          opacity="0.9"
        />
      </g>
    </svg>
  );
};

/**
 * Royal Indian Groom Silhouette in traditional Sherwani & Pagri (Turban) with Kalgi
 * Matches storyboard reference Scene 5 panel Close-up 3
 */
export const RoyalGroomSilhouette: React.FC<{ size?: number }> = ({ size = 110 }) => {
  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2}>
      <defs>
        <linearGradient id="groomGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff9e6" />
          <stop offset="45%" stopColor="#f5cf68" />
          <stop offset="85%" stopColor="#c49a2a" />
          <stop offset="100%" stopColor="#7a5510" />
        </linearGradient>
      </defs>
      {/* Traditional Indian Groom Profile with Pagri, Kalgi feather, and Sherwani */}
      <g fill="url(#groomGold)" opacity="0.95">
        {/* Royal Pagri (Turban) folds */}
        <path d="M 36,36 C 32,24 45,14 62,20 C 72,24 74,36 68,44 C 64,48 56,48 50,46 C 42,46 36,44 36,36 Z" />
        <path d="M 40,24 C 52,18 64,22 68,32 C 60,32 50,30 40,24 Z" opacity="0.75" />
        {/* Kalgi / Sarpech jewel & plume on Turban */}
        <polygon points="62,10 65,18 59,18" fill="#fff" />
        <path d="M 62,10 Q 64,2 69,0 Q 66,5 64,10" fill="#fff" />
        <circle cx="62" cy="20" r="2.5" fill="#fff" />
        {/* Groom Facial Profile & Jawline */}
        <path d="M 52,46 C 56,46 62,48 62,54 C 62,57 59,59 61,62 C 63,65 67,67 64,70 C 62,72 58,72 57,75 C 55,78 51,80 47,81 C 43,82 41,88 41,94 L 46,96 L 52,106 L 76,118 L 22,118 L 28,94 C 28,88 34,78 40,76 Z" />
        {/* Groom Sherwani Mandarin Collar & Stole (Dupatta) */}
        <path d="M 41,90 L 52,90 L 50,118 L 36,118 Z" opacity="0.85" />
        {/* Royal Pearl Necklace (Mala) */}
        <path d="M 42,94 Q 50,102 56,96" fill="none" stroke="#fff" strokeWidth="2" />
        <path d="M 39,100 Q 50,112 59,102" fill="none" stroke="#fff" strokeWidth="1.6" />
        {/* Broad Sherwani shoulders */}
        <path d="M 22,118 L 84,118 C 82,108 72,98 62,96 L 54,106 L 44,96 C 34,98 24,108 22,118 Z" opacity="0.9" />
      </g>
    </svg>
  );
};

/**
 * Ornate Gold Filigree Portrait Frame for Family Details
 */
export const OrnatePortraitFrame: React.FC<{
  children: React.ReactNode;
  title: string;
  subtitle: string;
}> = ({ children, title, subtitle }) => {
  return (
    <div
      className="ornate-portrait-frame-container"
      style={{
        position: 'relative',
        width: '155px',
        margin: '0.4rem auto 0.15rem auto',
      }}
    >
      {/* Outer Carved Golden Arch Frame */}
      <div
        style={{
          position: 'relative',
          padding: '8px 8px 12px 8px',
          borderRadius: '90px 90px 12px 12px',
          background: 'linear-gradient(135deg, #f5cf68 0%, #fff7d6 35%, #c49a2a 70%, #fae69e 100%)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7), 0 0 25px rgba(245, 207, 104, 0.45)',
          border: '1.5px solid #fffdfa',
        }}
      >
        {/* Arch Crest Top Ornament */}
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#781229',
            border: '2px solid #f5cf68',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#f5cf68',
            boxShadow: '0 0 10px rgba(245, 207, 104, 0.8)',
          }}
        >
          🪷
        </div>

        {/* Inner Dark Velvet Silhouette Display */}
        <div
          style={{
            borderRadius: '80px 80px 8px 8px',
            background: 'radial-gradient(circle at 50% 40%, #4a0a18 0%, #1a0208 100%)',
            border: '2px solid #c49a2a',
            padding: '14px 6px 10px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
          }}
        >
          {children}

          <span
            className="font-classic text-[11px] tracking-wider uppercase font-bold text-gold-solid mt-1.5"
            style={{ textShadow: '0 1px 4px #000' }}
          >
            {title}
          </span>
          <span className="font-editorial italic text-[10px]" style={{ color: '#fef5db' }}>
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
};
