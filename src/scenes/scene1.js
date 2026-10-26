/**
 * Scene 1 — Royal 3D Lotus Invitation Card & Intentional Title Screen
 * Authentic Royal Indian Wedding Experience — Sneha & Dipak
 * High-Performance 60FPS Edition with Zero-CPU-Blur Particle Engine
 */

import './scene1.css';
import { gsap } from 'gsap';

/** @type {boolean} */
let isOpen = false;

/** @type {boolean} */
let inTitleStage = false;

/** @type {boolean} */
let isTransitioning = false;

/** @type {boolean} */
let isDestroyed = false;

/** @type {gsap.Context | null} */
let gsapCtx = null;

/** @type {number[]} */
let activeTimers = [];

/** @type {number} */
let animFrameId = 0;

/** @type {CanvasRenderingContext2D | null} */
let bgCtx = null;

/** @type {CanvasRenderingContext2D | null} */
let fgCtx = null;

/** @type {Array<Object>} */
let lightStreams = [];

/** @type {Array<Object>} */
let sparkles = [];

/** @type {Array<Object>} */
let petals = [];

/** @type {Array<Object>} */
let burstParticles = [];

/** @type {Function | null} */
let cleanupListeners = null;

function addSafeTimer(fn, delay) {
  const id = window.setTimeout(fn, delay);
  activeTimers.push(id);
  return id;
}

function clearAllTimers() {
  activeTimers.forEach((id) => clearTimeout(id));
  activeTimers = [];
}

// ─── Web Audio API: Royal Harmonic Sparkle Chime ─────────────────────────────

function playRoyalSparkleChime(isOpening = true) {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return;
    const ctx = new AudioCtxClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const notes = isOpening
      ? [523.25, 659.25, 783.99, 1046.5, 1318.5] // C5, E5, G5, C6, E6
      : [1046.5, 783.99, 659.25, 523.25];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.075);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.075);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + idx * 0.075 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.075 + 1.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.075);
      osc.stop(ctx.currentTime + idx * 0.075 + 1.15);
    });
  } catch {
    // Autoplay fallback
  }
}

// ─── Burst Particles on Wax Seal Click ───────────────────────────────────────

function spawnSealBurstParticles(cw, ch) {
  const cx = cw * 0.5;
  const cy = ch * 0.5;
  for (let i = 0; i < 48; i++) {
    const angle = (Math.PI * 2 * i) / 48 + (Math.random() - 0.5) * 0.25;
    const speed = Math.random() * 5.5 + 2;
    burstParticles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: Math.random() * 3 + 1.2,
      life: 1.0,
      decay: Math.random() * 0.02 + 0.014,
    });
  }
}

// ─── Offscreen Pre-rendered Sprites for Zero-Allocation 60 FPS Drawing ──────────

let cachedPetalSprite = null;
let cachedGoldSparkle = null;
let cachedAmberSparkle = null;

function getCachedPetalSprite() {
  if (cachedPetalSprite) return cachedPetalSprite;
  cachedPetalSprite = document.createElement('canvas');
  cachedPetalSprite.width = 48;
  cachedPetalSprite.height = 48;
  const c = cachedPetalSprite.getContext('2d');
  c.translate(24, 24);
  const grad = c.createRadialGradient(0, 0, 1, 0, 0, 18);
  grad.addColorStop(0, 'rgba(255, 185, 205, 0.92)');
  grad.addColorStop(0.6, 'rgba(235, 65, 110, 0.85)');
  grad.addColorStop(1, 'rgba(150, 15, 50, 0.25)');
  c.fillStyle = grad;
  c.beginPath();
  c.moveTo(0, -18 * 0.6);
  c.bezierCurveTo(18 * 0.8, -18 * 0.6, 18 * 0.9, 18 * 0.5, 0, 18 * 0.7);
  c.bezierCurveTo(-18 * 0.9, 18 * 0.5, -18 * 0.8, -18 * 0.6, 0, -18 * 0.6);
  c.fill();
  return cachedPetalSprite;
}

function getSparkleSprite(hue) {
  if (hue === 43 && cachedGoldSparkle) return cachedGoldSparkle;
  if (hue !== 43 && cachedAmberSparkle) return cachedAmberSparkle;

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const c = canvas.getContext('2d');
  const cx = 16, cy = 16, r = 7;

  // Outer glow aura
  c.beginPath();
  c.arc(cx, cy, r * 2, 0, Math.PI * 2);
  c.fillStyle = `hsla(${hue}, 100%, 75%, 0.25)`;
  c.fill();

  // Inner bright core
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.fillStyle = `hsla(${hue}, 100%, 85%, 0.95)`;
  c.fill();

  // Highlight center
  c.beginPath();
  c.arc(cx, cy, r * 0.4, 0, Math.PI * 2);
  c.fillStyle = '#ffffff';
  c.fill();

  if (hue === 43) cachedGoldSparkle = canvas;
  else cachedAmberSparkle = canvas;
  return canvas;
}

// ─── GPU-Accelerated Swirling Ribbon ─────────────────────────────────────────

function drawSwirlingGoldenRibbon(ctx, stream, time, cw, ch) {
  const centerX = cw * 0.5;
  const centerY = ch * 0.5;
  const rx = Math.min(cw, 950) * stream.radiusX;
  const ry = Math.min(ch, 720) * stream.radiusY;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(stream.tilt);

  const segments = 24;
  const arcLen = 2.6;
  const headAngle = time * stream.speed + stream.phase;

  // Pass 1: Soft Outer Glow (Batched single path stroke)
  ctx.beginPath();
  for (let i = 0; i <= segments; i += 2) {
    const frac = i / segments;
    const t = headAngle - (1 - frac) * arcLen;
    const wave = Math.sin(t * 3 + time * 0.02) * 18;
    const x = Math.cos(t) * rx;
    const y = Math.sin(t) * ry + wave;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'hsla(42, 100%, 75%, 0.20)';
  ctx.lineWidth = stream.width * 2.2;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Pass 2: Sharp Vibrant Metallic Core (Batched single path stroke)
  ctx.beginPath();
  for (let i = 0; i <= segments; i++) {
    const frac = i / segments;
    const t = headAngle - (1 - frac) * arcLen;
    const wave = Math.sin(t * 3 + time * 0.02) * 18;
    const x = Math.cos(t) * rx;
    const y = Math.sin(t) * ry + wave;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'hsla(42, 100%, 80%, 0.75)';
  ctx.lineWidth = stream.width;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();
}

function drawRosePetal(ctx, p) {
  const sprite = getCachedPetalSprite();
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  const s = p.size;
  ctx.drawImage(sprite, -s, -s, s * 2, s * 2);
  ctx.restore();
}

// ─── Stage Transitions ───────────────────────────────────────────────────────

function showWeddingTitleStage() {
  if (inTitleStage || isTransitioning || isDestroyed) return;
  inTitleStage = true;

  const envelopeStage = document.getElementById('scene-1-envelope-stage');
  const titleStage = document.getElementById('wedding-title-stage');

  if (titleStage) {
    titleStage.setAttribute('aria-hidden', 'false');
    titleStage.classList.add('active');
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    if (envelopeStage) envelopeStage.classList.add('fading');
  } else {
    const tl = gsap.timeline();
    if (envelopeStage) {
      tl.to(envelopeStage, { opacity: 0, scale: 1.03, duration: 0.7, ease: 'power2.inOut' });
    }
    tl.fromTo('.wedding-title-badge', { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.3')
      .fromTo('.wedding-title-divider', { opacity: 0, scaleX: 0.5 }, { opacity: 1, scaleX: 1, duration: 0.7, ease: 'power2.out' }, '-=0.4')
      .fromTo('.wedding-title-main', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
      .fromTo('.wedding-title-sub', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
      .fromTo('.wedding-title-lotus', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.4');
  }

  // Display Wedding Title Screen comfortably for ~3.8 seconds, then advance
  addSafeTimer(() => {
    if (!isTransitioning && !isDestroyed) {
      proceedToScene2();
    }
  }, 3800);
}

function returnToEnvelopeStage() {
  if (!inTitleStage || isTransitioning || isDestroyed) return;
  inTitleStage = false;
  clearAllTimers();

  const envelopeStage = document.getElementById('scene-1-envelope-stage');
  const titleStage = document.getElementById('wedding-title-stage');

  if (titleStage) {
    titleStage.classList.remove('active');
    titleStage.setAttribute('aria-hidden', 'true');
    gsap.to(titleStage, { opacity: 0, duration: 0.4, ease: 'power2.out' });
  }

  if (envelopeStage) {
    envelopeStage.classList.remove('fading');
    gsap.to(envelopeStage, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
  }
}

function proceedToScene2() {
  if (isTransitioning || isDestroyed) return;
  isTransitioning = true;

  const titleStage = document.getElementById('wedding-title-stage');
  if (titleStage) {
    const titleCard = titleStage.querySelector('.wedding-title-card');
    if (titleCard) {
      titleCard.classList.add('fading-out');
    }
    titleStage.classList.add('transitioning-out');
  }

  const flare = document.getElementById('scene1-flare');
  if (flare) {
    flare.classList.add('radiate');
  }

  addSafeTimer(() => {
    if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
      window.sceneManager.goToScene(2);
    } else {
      window.dispatchEvent(new CustomEvent('scene:navigate', { detail: { scene: 2 } }));
    }
  }, 400);
}

// ─── Scene 1 Component HTML ──────────────────────────────────────────────────

export function createScene1() {
  return `
    <section id="scene-1" class="scene scene-1 active" aria-label="Scene 1: Royal 3D Lotus Wedding Invitation">

      <!-- STAGE 1: 3D Royal Envelope Opening Stage -->
      <div id="scene-1-envelope-stage" class="scene-1-envelope-stage">
        <!-- Fallback backdrop gradient while image loads -->
        <div class="scene-backdrop"></div>

        <!-- LAYER 1: Palace Sunset Background Image -->
        <div class="scene-1-layer scene-1-layer--bg" aria-hidden="true">
          <picture>
            <source srcset="/assets/scene-1/s1_background.webp" type="image/webp" />
            <img
              src="/assets/scene-1/s1_background.png"
              onerror="this.onerror=null;this.src='/s1_background.png';"
              alt="Royal Palace Courtyard"
              class="scene-1-img scene-1-img--bg"
              loading="eager"
              decoding="async"
              draggable="false"
            />
          </picture>
        </div>

        <!-- Atmospheric Sunset Vignette for depth and contrast -->
        <div class="scene-1-vignette" aria-hidden="true"></div>

        <!-- LAYER 2: Petals Frame Overlay -->
        <div class="scene-1-layer scene-1-layer--petals" aria-hidden="true">
          <picture>
            <source srcset="/assets/scene-1/s1_petals_overlay.webp" type="image/webp" />
            <img
              src="/assets/scene-1/s1_petals_overlay.png"
              onerror="this.onerror=null;this.src='/s1_petals_overlay.png';"
              alt=""
              class="scene-1-img scene-1-img--petals"
              loading="eager"
              decoding="async"
              draggable="false"
            />
          </picture>
        </div>

        <!-- Background Particle Canvas (Behind Envelope) -->
        <canvas id="scene1-bg-canvas" class="canvas-bg-particles" aria-hidden="true"></canvas>

        <!-- Master Shared SVG Definitions -->
        <svg style="position: absolute; width: 0; height: 0; pointer-events: none;" aria-hidden="true">
          <defs>
            <linearGradient id="goldFoilMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#8a5205" />
              <stop offset="18%" stop-color="#e5b246" />
              <stop offset="34%" stop-color="#fff4b8" />
              <stop offset="50%" stop-color="#c98a1c" />
              <stop offset="68%" stop-color="#f7cf68" />
              <stop offset="85%" stop-color="#fff3b0" />
              <stop offset="100%" stop-color="#784402" />
            </linearGradient>

            <linearGradient id="goldFoilHorizontal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#734102" />
              <stop offset="22%" stop-color="#f5c95c" />
              <stop offset="45%" stop-color="#fff6c2" />
              <stop offset="65%" stop-color="#bf8013" />
              <stop offset="85%" stop-color="#f5cb62" />
              <stop offset="100%" stop-color="#6b3b00" />
            </linearGradient>

            <radialGradient id="goldHighlightRadial" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#fff8d1" />
              <stop offset="30%" stop-color="#f2bd46" />
              <stop offset="68%" stop-color="#b5760e" />
              <stop offset="100%" stop-color="#593200" />
            </radialGradient>

            <radialGradient id="velvetTopFlap" cx="50%" cy="22%" r="75%">
              <stop offset="0%" stop-color="#ad1727" />
              <stop offset="45%" stop-color="#7d0915" />
              <stop offset="82%" stop-color="#4d0209" />
              <stop offset="100%" stop-color="#2e0004" />
            </radialGradient>

            <radialGradient id="velvetBottomFlap" cx="50%" cy="78%" r="75%">
              <stop offset="0%" stop-color="#96111f" />
              <stop offset="50%" stop-color="#690610" />
              <stop offset="85%" stop-color="#3f0208" />
              <stop offset="100%" stop-color="#240003" />
            </radialGradient>

            <radialGradient id="velvetLeftFlap" cx="20%" cy="50%" r="75%">
              <stop offset="0%" stop-color="#8f0f1d" />
              <stop offset="55%" stop-color="#5e050e" />
              <stop offset="100%" stop-color="#2b0004" />
            </radialGradient>

            <radialGradient id="velvetRightFlap" cx="80%" cy="50%" r="75%">
              <stop offset="0%" stop-color="#9e1322" />
              <stop offset="55%" stop-color="#690711" />
              <stop offset="100%" stop-color="#2e0004" />
            </radialGradient>

            <pattern id="royalDamaskPattern" width="92" height="92" patternUnits="userSpaceOnUse">
              <path
                d="M0,46 L46,0 M46,92 L92,46 M0,46 L46,92 M46,0 L92,46"
                stroke="rgba(255, 200, 95, 0.14)"
                stroke-width="0.7"
                fill="none"
              />
              <g stroke="url(#goldFoilMain)" fill="none" opacity="0.78">
                <circle cx="46" cy="46" r="14" stroke-width="0.9" stroke-dasharray="2 1.5" />
                <circle cx="46" cy="46" r="4" fill="url(#goldFoilMain)" opacity="0.85" />
                <path d="M46,24 C51,33 51,39 46,46 C41,39 41,33 46,24 Z" stroke-width="1" fill="rgba(245, 190, 70, 0.15)" />
                <path d="M46,68 C51,59 51,53 46,46 C41,53 41,59 46,68 Z" stroke-width="1" fill="rgba(245, 190, 70, 0.15)" />
                <path d="M24,46 C33,51 39,51 46,46 C39,41 33,41 24,46 Z" stroke-width="1" fill="rgba(245, 190, 70, 0.15)" />
                <path d="M68,46 C59,51 53,51 46,46 C53,41 59,41 68,46 Z" stroke-width="1" fill="rgba(245, 190, 70, 0.15)" />
                <path d="M30,30 C38,34 42,38 46,46 C38,42 34,38 30,30 Z" stroke-width="0.9" />
                <path d="M62,30 C54,34 50,38 46,46 C54,42 58,38 62,30 Z" stroke-width="0.9" />
                <path d="M30,62 C38,58 42,54 46,46 C38,50 34,54 30,62 Z" stroke-width="0.9" />
                <path d="M62,62 C54,58 50,54 46,46 C54,50 58,54 62,62 Z" stroke-width="0.9" />

                <path d="M0,18 C14,18 22,28 18,38 C15,45 6,42 9,35 C11,30 18,32 24,46" stroke-width="1.1" />
                <path d="M92,18 C78,18 70,28 74,38 C77,45 86,42 83,35 C81,30 74,32 68,46" stroke-width="1.1" />
                <path d="M0,74 C14,74 22,64 18,54 C15,47 6,50 9,57 C11,62 18,60 24,46" stroke-width="1.1" />
                <path d="M92,74 C78,74 70,64 74,54 C77,47 86,50 83,57 C81,62 74,60 68,46" stroke-width="1.1" />

                <path d="M18,0 C18,14 28,22 38,18 C45,15 42,6 35,9 C30,11 32,18 46,24" stroke-width="1.1" />
                <path d="M74,0 C74,14 64,22 54,18 C47,15 50,6 57,9 C62,11 60,18 46,24" stroke-width="1.1" />
                <path d="M18,92 C18,78 28,70 38,74 C45,77 42,86 35,83 C30,81 32,74 46,68" stroke-width="1.1" />
                <path d="M74,92 C74,78 64,70 54,74 C47,77 50,86 57,83 C62,81 60,74 46,68" stroke-width="1.1" />

                <circle cx="46" cy="14" r="1.5" fill="#fff0a8" />
                <circle cx="46" cy="78" r="1.5" fill="#fff0a8" />
                <circle cx="14" cy="46" r="1.5" fill="#fff0a8" />
                <circle cx="78" cy="46" r="1.5" fill="#fff0a8" />
                <circle cx="23" cy="23" r="1.3" fill="#ffd970" />
                <circle cx="69" cy="23" r="1.3" fill="#ffd970" />
                <circle cx="23" cy="69" r="1.3" fill="#ffd970" />
                <circle cx="69" cy="69" r="1.3" fill="#ffd970" />
              </g>
            </pattern>

            <pattern id="zariBrocadePattern" width="32" height="32" patternUnits="userSpaceOnUse">
              <rect width="32" height="32" fill="url(#goldFoilMain)" />
              <path d="M0,16 Q8,4 16,16 T32,16" stroke="#5e0811" stroke-width="2.2" fill="none" />
              <path d="M0,16 Q8,28 16,16 T32,16" stroke="#5e0811" stroke-width="2.2" fill="none" />
              <path d="M0,16 Q8,6 16,16 T32,16" stroke="#fff6c4" stroke-width="1.1" fill="none" />
              <circle cx="8" cy="16" r="2.6" fill="#700914" />
              <circle cx="8" cy="16" r="1.3" fill="#fff5b8" />
              <circle cx="24" cy="16" r="2.6" fill="#700914" />
              <circle cx="24" cy="16" r="1.3" fill="#fff5b8" />
              <circle cx="16" cy="7" r="1.5" fill="#6b0712" />
              <circle cx="16" cy="25" r="1.5" fill="#6b0712" />
            </pattern>
          </defs>
        </svg>

        <!-- Main 3D Interactive Envelope Rig -->
        <div class="stage-3d">
          <div
            id="envelope-float-rig"
            class="envelope-float-rig"
            role="button"
            tabindex="0"
            aria-label="Click the Golden Lotus Wax Seal to open the invitation"
          >
            <div class="envelope-back-glow"></div>
            <div class="envelope-drop-shadow"></div>

            <div class="envelope-3d">
              <div class="envelope-back-plate">
                <svg viewBox="0 0 560 370" preserveAspectRatio="none" style="opacity: 0.55;">
                  <rect width="560" height="370" fill="url(#royalDamaskPattern)" />
                  <rect
                    x="6"
                    y="6"
                    width="548"
                    height="358"
                    fill="none"
                    stroke="url(#goldFoilMain)"
                    stroke-width="2"
                    stroke-dasharray="6 4"
                  />
                </svg>
              </div>

              <!-- Royal Invitation Card -->
              <div id="invitation-card-3d" class="invitation-card-3d">
                <svg style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;" viewBox="0 0 500 330" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M14,55 C14,25 25,14 55,14 L14,14 Z" fill="#b87d14" opacity="0.25" />
                  <path d="M16,68 C22,34 34,22 68,16" stroke="#b87d14" stroke-width="2" fill="none" />
                  <circle cx="24" cy="24" r="3.5" fill="#9c6208" />

                  <path d="M486,55 C486,25 475,14 445,14 L486,14 Z" fill="#b87d14" opacity="0.25" />
                  <path d="M484,68 C478,34 466,22 432,16" stroke="#b87d14" stroke-width="2" fill="none" />
                  <circle cx="476" cy="24" r="3.5" fill="#9c6208" />

                  <path d="M14,275 C14,305 25,316 55,316 L14,316 Z" fill="#b87d14" opacity="0.25" />
                  <path d="M16,262 C22,296 34,308 68,314" stroke="#b87d14" stroke-width="2" fill="none" />
                  <circle cx="24" cy="306" r="3.5" fill="#9c6208" />

                  <path d="M486,275 C486,305 475,316 445,316 L486,316 Z" fill="#b87d14" opacity="0.25" />
                  <path d="M484,262 C478,296 466,308 432,314" stroke="#b87d14" stroke-width="2" fill="none" />
                  <circle cx="476" cy="306" r="3.5" fill="#9c6208" />
                </svg>

                <div style="position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center;">
                  <svg class="card-crest-lotus" viewBox="0 0 80 45" fill="currentColor" aria-hidden="true">
                    <path d="M40,5 C45,16 47,26 40,36 C33,26 35,16 40,5 Z" />
                    <path d="M40,36 C28,25 22,15 26,9 C33,13 36,24 40,36 Z" opacity="0.85" />
                    <path d="M40,36 C52,25 58,15 54,9 C47,13 44,24 40,36 Z" opacity="0.85" />
                    <path d="M40,36 C22,31 12,24 12,17 C21,18 31,26 40,36 Z" opacity="0.7" />
                    <path d="M40,36 C58,31 68,24 68,17 C59,18 49,26 40,36 Z" opacity="0.7" />
                  </svg>
                  <p class="card-blessing-text">|| Shree Ganeshaya Namah ||</p>
                </div>

                <div style="position: relative; z-index: 10; margin-top: auto; margin-bottom: auto; padding-top: 4px; padding-bottom: 4px;">
                  <p class="card-occasion-title">Royal Wedding Invitation</p>
                  <h1 class="card-couple-names">Sneha &amp; Dipak</h1>
                  <p class="card-subtitle-msg">
                    Cordially invite you and your family to grace the auspicious celebration of their union
                  </p>
                </div>

                <div class="card-footer-info">
                  <div class="card-footer-date">Sunday, 29 November 2026 • 7:00 PM</div>
                  <div style="color: #b45309;">✦</div>
                  <div class="card-footer-venue">Sethjees Banquet, Maniktala, Kanchrapara</div>
                </div>
              </div>

              <!-- Left Flap -->
              <div class="flap-layer flap-left">
                <svg viewBox="0 0 560 370" preserveAspectRatio="none">
                  <defs>
                    <clipPath id="leftFlapClip">
                      <polygon points="0,0 305,192 0,370" />
                    </clipPath>
                  </defs>
                  <g clip-path="url(#leftFlapClip)">
                    <polygon points="0,0 305,192 0,370" fill="url(#velvetLeftFlap)" />
                    <rect width="560" height="370" fill="url(#royalDamaskPattern)" />
                    <line x1="0" y1="0" x2="305" y2="192" stroke="url(#zariBrocadePattern)" stroke-width="28" />
                    <line x1="0" y1="0" x2="305" y2="192" stroke="url(#goldFoilMain)" stroke-width="3.5" />
                    <line x1="-11" y1="0" x2="294" y2="192" stroke="url(#goldFoilMain)" stroke-width="1.5" stroke-dasharray="3 3" />
                    <line x1="0" y1="370" x2="305" y2="192" stroke="url(#zariBrocadePattern)" stroke-width="28" />
                    <line x1="0" y1="370" x2="305" y2="192" stroke="url(#goldFoilMain)" stroke-width="3.5" />
                  </g>
                </svg>
              </div>

              <!-- Right Flap -->
              <div class="flap-layer flap-right">
                <svg viewBox="0 0 560 370" preserveAspectRatio="none">
                  <defs>
                    <clipPath id="rightFlapClip">
                      <polygon points="560,0 265,192 560,370" />
                    </clipPath>
                  </defs>
                  <g clip-path="url(#rightFlapClip)">
                    <polygon points="560,0 265,192 560,370" fill="url(#velvetRightFlap)" />
                    <rect width="560" height="370" fill="url(#royalDamaskPattern)" />
                    <line x1="560" y1="0" x2="265" y2="192" stroke="url(#zariBrocadePattern)" stroke-width="28" />
                    <line x1="560" y1="0" x2="265" y2="192" stroke="url(#goldFoilMain)" stroke-width="3.5" />
                    <line x1="560" y1="370" x2="265" y2="192" stroke="url(#zariBrocadePattern)" stroke-width="32" />
                    <line x1="560" y1="370" x2="265" y2="192" stroke="url(#goldFoilMain)" stroke-width="3.5" />
                    <line x1="560" y1="355" x2="276" y2="184" stroke="#fff3b0" stroke-width="1.3" stroke-dasharray="4 3" opacity="0.85" />
                  </g>
                </svg>
              </div>

              <!-- Bottom Flap -->
              <div class="flap-layer flap-bottom">
                <svg viewBox="0 0 560 370" preserveAspectRatio="none">
                  <defs>
                    <clipPath id="bottomFlapClip">
                      <polygon points="0,370 292,175 560,370" />
                    </clipPath>
                  </defs>
                  <g clip-path="url(#bottomFlapClip)">
                    <polygon points="0,370 292,175 560,370" fill="url(#velvetBottomFlap)" />
                    <rect width="560" height="370" fill="url(#royalDamaskPattern)" />
                    <line x1="0" y1="370" x2="292" y2="175" stroke="url(#zariBrocadePattern)" stroke-width="42" />
                    <line x1="0" y1="370" x2="292" y2="175" stroke="url(#goldFoilMain)" stroke-width="4.5" />
                    <line x1="16" y1="378" x2="304" y2="185" stroke="url(#goldFoilMain)" stroke-width="2.2" />
                    <line x1="12" y1="375" x2="300" y2="182" stroke="#fff5bd" stroke-width="1.4" stroke-dasharray="3 3" />
                    <line x1="560" y1="370" x2="292" y2="175" stroke="url(#zariBrocadePattern)" stroke-width="40" />
                    <line x1="560" y1="370" x2="292" y2="175" stroke="url(#goldFoilMain)" stroke-width="4.5" />
                    <line x1="544" y1="378" x2="280" y2="185" stroke="url(#goldFoilMain)" stroke-width="2.2" />
                    <line x1="548" y1="375" x2="284" y2="182" stroke="#fff5bd" stroke-width="1.4" stroke-dasharray="3 3" />
                  </g>
                </svg>
              </div>

              <!-- Top 3D Hinged Flap -->
              <div class="flap-top-hinge">
                <div class="flap-top-front">
                  <svg viewBox="0 0 560 370" preserveAspectRatio="none">
                    <defs>
                      <clipPath id="topFlapClip">
                        <polygon points="0,0 560,0 292,202" />
                      </clipPath>
                    </defs>
                    <g clip-path="url(#topFlapClip)">
                      <polygon points="0,0 560,0 292,202" fill="url(#velvetTopFlap)" />
                      <rect width="560" height="370" fill="url(#royalDamaskPattern)" />
                      <g transform="translate(285, 85)" stroke="url(#goldFoilMain)" fill="none" opacity="0.9">
                        <path d="M0,-48 C18,-25 22,-5 0,22 C-22,-5 -18,-25 0,-48 Z" stroke-width="1.8" fill="rgba(255, 200, 80, 0.14)" />
                        <path d="M-45,-12 C-20,-28 -8,-15 0,22 C-22,12 -38,2 -45,-12 Z" stroke-width="1.5" />
                        <path d="M45,-12 C20,-28 8,-15 0,22 C22,12 38,2 45,-12 Z" stroke-width="1.5" />
                        <path d="M-78,6 C-55,-20 -25,-10 -12,18" stroke-width="1.4" />
                        <path d="M78,6 C55,-20 25,-10 12,18" stroke-width="1.4" />
                        <circle cx="0" cy="-14" r="4" fill="#fff3a8" />
                        <circle cx="-28" cy="-4" r="2.8" fill="#ffd86b" />
                        <circle cx="28" cy="-4" r="2.8" fill="#ffd86b" />
                      </g>
                      <line x1="0" y1="0" x2="292" y2="202" stroke="url(#zariBrocadePattern)" stroke-width="42" />
                      <line x1="0" y1="0" x2="292" y2="202" stroke="url(#goldFoilMain)" stroke-width="5" />
                      <line x1="14" y1="-8" x2="304" y2="192" stroke="url(#goldFoilMain)" stroke-width="2.4" />
                      <line x1="10" y1="-5" x2="300" y2="195" stroke="#fff6c2" stroke-width="1.5" stroke-dasharray="3.5 3" />

                      <line x1="560" y1="0" x2="292" y2="202" stroke="url(#zariBrocadePattern)" stroke-width="46" />
                      <line x1="560" y1="0" x2="292" y2="202" stroke="url(#goldFoilMain)" stroke-width="5" />
                      <line x1="544" y1="-8" x2="278" y2="192" stroke="url(#goldFoilMain)" stroke-width="2.5" />
                      <line x1="548" y1="-5" x2="282" y2="195" stroke="#fff8d4" stroke-width="1.6" stroke-dasharray="3.5 3" />
                    </g>
                  </svg>
                </div>

                <div class="flap-top-back">
                  <svg viewBox="0 0 560 370" preserveAspectRatio="none">
                    <defs>
                      <clipPath id="topFlapBackClip">
                        <polygon points="0,370 560,370 292,168" />
                      </clipPath>
                    </defs>
                    <g clip-path="url(#topFlapBackClip)">
                      <polygon points="0,370 560,370 292,168" fill="url(#velvetBottomFlap)" />
                      <rect width="560" height="370" fill="url(#royalDamaskPattern)" opacity="0.75" />
                      <line x1="0" y1="370" x2="292" y2="168" stroke="url(#zariBrocadePattern)" stroke-width="38" />
                      <line x1="560" y1="370" x2="292" y2="168" stroke="url(#zariBrocadePattern)" stroke-width="38" />
                      <line x1="0" y1="370" x2="292" y2="168" stroke="url(#goldFoilMain)" stroke-width="4" />
                      <line x1="560" y1="370" x2="292" y2="168" stroke="url(#goldFoilMain)" stroke-width="4" />
                    </g>
                  </svg>
                </div>
              </div>

              <div class="gold-specular-overlay"></div>

              <div
                id="seal-assembly"
                class="seal-assembly"
                role="button"
                tabindex="0"
                aria-label="Open Royal Lotus Wax Seal"
              >
                <div class="seal-pulse-ring"></div>

                <div class="tassel-pendulum">
                  <svg width="76" height="118" viewBox="0 0 76 118" fill="none">
                    <defs>
                      <linearGradient id="tasselSilkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#704203" />
                        <stop offset="22%" stop-color="#e3ad3b" />
                        <stop offset="48%" stop-color="#fff4b8" />
                        <stop offset="72%" stop-color="#c48616" />
                        <stop offset="100%" stop-color="#522e00" />
                      </linearGradient>
                      <radialGradient id="goldBeadGrad" cx="35%" cy="30%" r="65%">
                        <stop offset="0%" stop-color="#fff9d6" />
                        <stop offset="35%" stop-color="#f5c34e" />
                        <stop offset="75%" stop-color="#b3740c" />
                        <stop offset="100%" stop-color="#4d2b00" />
                      </radialGradient>
                    </defs>
                    <path d="M38,0 L38,16" stroke="url(#tasselSilkGrad)" stroke-width="5" stroke-linecap="round" />
                    <ellipse cx="38" cy="18" rx="9" ry="7" fill="url(#goldBeadGrad)" />
                    <path d="M26,28 C26,21 50,21 50,28 L53,37 C53,40 23,40 23,37 Z" fill="url(#goldBeadGrad)" stroke="#5c3400" stroke-width="0.8" />
                    <rect x="23" y="35" width="30" height="4.5" rx="2.2" fill="url(#tasselSilkGrad)" stroke="#693b00" stroke-width="0.7" />
                    <path d="M25,39 L10,104 C26,112 50,112 66,104 L51,39 Z" fill="url(#tasselSilkGrad)" />
                    <g stroke="#5e3400" stroke-width="0.75" opacity="0.65">
                      <line x1="27" y1="40" x2="14" y2="105" />
                      <line x1="30" y1="40" x2="20" y2="107" />
                      <line x1="33" y1="40" x2="26" y2="108" />
                      <line x1="36" y1="40" x2="32" y2="109" />
                      <line x1="38" y1="40" x2="38" y2="110" />
                      <line x1="40" y1="40" x2="44" y2="109" />
                      <line x1="43" y1="40" x2="50" y2="108" />
                      <line x1="46" y1="40" x2="56" y2="107" />
                      <line x1="49" y1="40" x2="62" y2="105" />
                    </g>
                    <g stroke="#fff8c9" stroke-width="0.9" opacity="0.75">
                      <line x1="31" y1="40" x2="22" y2="106" />
                      <line x1="35" y1="40" x2="30" y2="108" />
                      <line x1="39" y1="40" x2="40" y2="109" />
                      <line x1="44" y1="40" x2="52" y2="107" />
                    </g>
                  </svg>
                </div>

                <svg class="wax-seal-svg" viewBox="0 0 140 140">
                  <defs>
                    <linearGradient id="moltenGoldRim" x1="15%" y1="10%" x2="85%" y2="90%">
                      <stop offset="0%" stop-color="#fff8c4" />
                      <stop offset="22%" stop-color="#f5c651" />
                      <stop offset="48%" stop-color="#c48312" />
                      <stop offset="72%" stop-color="#ffdf7d" />
                      <stop offset="90%" stop-color="#875102" />
                      <stop offset="100%" stop-color="#4f2c00" />
                    </linearGradient>
                    <linearGradient id="goldBevelInner" x1="85%" y1="85%" x2="15%" y2="15%">
                      <stop offset="0%" stop-color="#fff4b5" />
                      <stop offset="45%" stop-color="#b8760b" />
                      <stop offset="100%" stop-color="#4a2600" />
                    </linearGradient>
                    <radialGradient id="rubyWaxPool" cx="38%" cy="32%" r="68%">
                      <stop offset="0%" stop-color="#e32229" />
                      <stop offset="35%" stop-color="#b30912" />
                      <stop offset="75%" stop-color="#750208" />
                      <stop offset="100%" stop-color="#3d0003" />
                    </radialGradient>
                    <linearGradient id="embossedLotusGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#fff9cf" />
                      <stop offset="35%" stop-color="#f7c954" />
                      <stop offset="70%" stop-color="#bd7d11" />
                      <stop offset="100%" stop-color="#693e00" />
                    </linearGradient>
                  </defs>

                  <path
                    d="
                      M 70,9
                      C 80,9 84,15 92,14
                      C 101,13 108,16 113,24
                      C 118,32 115,39 120,46
                      C 125,54 131,60 130,70
                      C 129,80 123,84 123,93
                      C 123,102 122,110 114,116
                      C 106,122 99,119 91,123
                      C 83,127 79,132 70,131
                      C 61,132 57,127 49,123
                      C 41,119 34,122 26,116
                      C 18,110 17,102 17,93
                      C 17,84 11,80 10,70
                      C 9,60 15,54 20,46
                      C 25,39 22,32 27,24
                      C 32,16 39,13 48,14
                      C 56,15 60,9 70,9 Z
                    "
                    fill="url(#moltenGoldRim)"
                    stroke="#593200"
                    stroke-width="1.2"
                  />

                  <path
                    d="M 27,26 C 32,18 39,15 48,16 C 56,17 60,11 70,11 C 80,11 84,17 92,16 C 100,15 106,18 111,25"
                    fill="none"
                    stroke="#fffbe0"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    opacity="0.8"
                  />

                  <circle cx="70" cy="70" r="46" fill="url(#goldBevelInner)" />
                  <circle cx="70" cy="70" r="42" fill="url(#rubyWaxPool)" stroke="url(#moltenGoldRim)" stroke-width="2" />
                  <path d="M 38,54 A 36,36 0 0,1 96,42" fill="none" stroke="rgba(255, 220, 210, 0.38)" stroke-width="3.5" stroke-linecap="round" />

                  <g transform="translate(70, 73)" filter="drop-shadow(0px 3px 3px rgba(35,0,2,0.85))">
                    <path d="M-2,12 C-18,12 -31,5 -34,-5 C-22,-7 -12,0 -2,12 Z" fill="rgba(180,25,35,0.55)" stroke="url(#embossedLotusGold)" stroke-width="2.4" stroke-linejoin="round" />
                    <path d="M2,12 C18,12 31,5 34,-5 C22,-7 12,0 2,12 Z" fill="rgba(180,25,35,0.55)" stroke="url(#embossedLotusGold)" stroke-width="2.4" stroke-linejoin="round" />
                    <path d="M-1,11 C-16,3 -26,-9 -23,-21 C-11,-16 -5,-4 -1,11 Z" fill="rgba(195,30,40,0.65)" stroke="url(#embossedLotusGold)" stroke-width="2.5" stroke-linejoin="round" />
                    <path d="M1,11 C16,3 26,-9 23,-21 C11,-16 5,-4 1,11 Z" fill="rgba(195,30,40,0.65)" stroke="url(#embossedLotusGold)" stroke-width="2.5" stroke-linejoin="round" />
                    <path d="M0,10 C-12,-2 -16,-18 -11,-29 C-3,-21 -1,-8 0,10 Z" fill="rgba(215,35,45,0.75)" stroke="url(#embossedLotusGold)" stroke-width="2.5" stroke-linejoin="round" />
                    <path d="M0,10 C12,-2 16,-18 11,-29 C3,-21 1,-8 0,10 Z" fill="rgba(215,35,45,0.75)" stroke="url(#embossedLotusGold)" stroke-width="2.5" stroke-linejoin="round" />
                    <path d="M0,11 C-9,-3 -9,-22 0,-34 C9,-22 9,-3 0,11 Z" fill="rgba(225,40,50,0.85)" stroke="url(#embossedLotusGold)" stroke-width="2.7" stroke-linejoin="round" />
                    <line x1="0" y1="-26" x2="0" y2="6" stroke="url(#embossedLotusGold)" stroke-width="1.6" stroke-linecap="round" />
                    <path d="M-12,15 Q0,19 12,15" fill="none" stroke="url(#embossedLotusGold)" stroke-width="2.3" stroke-linecap="round" />
                    <line x1="0" y1="12" x2="0" y2="21" stroke="url(#embossedLotusGold)" stroke-width="2.5" stroke-linecap="round" />
                    <circle cx="0" cy="-38" r="2" fill="#fff7c2" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <canvas id="scene1-fg-canvas" class="canvas-fg-particles" aria-hidden="true"></canvas>

        <div id="envelope-hint" class="envelope-hint-pill" aria-live="polite">
          ✦ Click Wax Seal to Open ✦
        </div>
      </div>

      <!-- STAGE 2: INTENTIONAL WEDDING TITLE SCREEN -->
      <div id="wedding-title-stage" class="scene-1-title-stage" aria-hidden="true" role="button" tabindex="0" aria-label="Click to proceed to Ganesh Ji blessings">
        <div class="title-stage-bg"></div>
        <div class="title-stage-rays" aria-hidden="true"></div>

        <div class="wedding-title-card">
          <div class="wedding-title-badge">
            <span class="wedding-title-sparkle" aria-hidden="true">✦</span>
            <span class="wedding-title-eyebrow">YOU'RE INVITED</span>
            <span class="wedding-title-sparkle" aria-hidden="true">✦</span>
          </div>

          <div class="wedding-title-divider" aria-hidden="true">
            <svg width="220" height="24" viewBox="0 0 220 24" fill="none">
              <path d="M0 12H85M135 12H220" stroke="url(#titleGoldLine)" stroke-width="1.2" stroke-linecap="round"/>
              <path d="M110 3L118 12L110 21L102 12L110 3Z" fill="url(#titleGoldDiamond)" stroke="url(#titleGoldLine)" stroke-width="1"/>
              <circle cx="95" cy="12" r="2.5" fill="#f5cf68"/>
              <circle cx="125" cy="12" r="2.5" fill="#f5cf68"/>
              <defs>
                <linearGradient id="titleGoldLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="transparent"/>
                  <stop offset="50%" stop-color="#f5cf68"/>
                  <stop offset="100%" stop-color="transparent"/>
                </linearGradient>
                <linearGradient id="titleGoldDiamond" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#fff4d1"/>
                  <stop offset="100%" stop-color="#d4af37"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h2 class="wedding-title-main">THE GRAND WEDDING CELEBRATION</h2>

          <p class="wedding-title-sub">
            As two hearts unite in a beautiful journey of love and togetherness
          </p>

          <div class="wedding-title-lotus" aria-hidden="true">🪷</div>
        </div>
      </div>

      <div id="scene1-flare" class="scene-1-golden-flare" aria-hidden="true"></div>

    </section>
  `;
}

// ─── Scene 1 State Reset ─────────────────────────────────────────────────────

export function resetScene1State() {
  clearAllTimers();
  isOpen = false;
  inTitleStage = false;
  isTransitioning = false;
  burstParticles = [];

  const envelopeStage = document.getElementById('scene-1-envelope-stage');
  const envelopeRig = document.getElementById('envelope-float-rig');
  const sealBtn = document.getElementById('seal-assembly');
  const topFlap = document.querySelector('.flap-top-hinge');
  const card = document.querySelector('.invitation-card-3d');
  const hintPill = document.getElementById('envelope-hint');
  const titleStage = document.getElementById('wedding-title-stage');
  const flare = document.getElementById('scene1-flare');

  // 1. Reset Envelope Stage
  if (envelopeStage) {
    envelopeStage.classList.remove('fading');
    gsap.set(envelopeStage, { clearProps: 'all' });
    envelopeStage.style.opacity = '1';
    envelopeStage.style.transform = '';
    envelopeStage.style.pointerEvents = 'auto';
  }

  // 2. Reset Envelope Rig
  if (envelopeRig) {
    envelopeRig.classList.remove('envelope-open');
    envelopeRig.style.transform = '';
    const specularOverlay = envelopeRig.querySelector('.gold-specular-overlay');
    if (specularOverlay) {
      specularOverlay.style.setProperty('--shimmer-x', '50%');
      specularOverlay.style.setProperty('--shimmer-y', '50%');
    }
  }

  // 3. Reset Wax Seal Assembly
  if (sealBtn) {
    gsap.set(sealBtn, { clearProps: 'all' });
    sealBtn.style.transform = '';
    sealBtn.style.opacity = '1';
    sealBtn.style.display = 'block';
    sealBtn.style.pointerEvents = 'auto';
  }

  // 4. Reset Top Flap Hinge
  if (topFlap) {
    gsap.set(topFlap, { clearProps: 'all' });
    topFlap.style.transform = '';
  }

  // 5. Reset 3D Invitation Card
  if (card) {
    gsap.set(card, { clearProps: 'all' });
    card.style.transform = '';
  }

  // 6. Reset Envelope Hint Pill
  if (hintPill) {
    gsap.set(hintPill, { clearProps: 'all' });
    hintPill.style.opacity = '1';
    hintPill.style.transform = '';
    hintPill.style.pointerEvents = 'auto';
  }

  // 7. Reset Title Stage & all children
  if (titleStage) {
    titleStage.classList.remove('active', 'transitioning-out', 'fading-out');
    titleStage.setAttribute('aria-hidden', 'true');
    gsap.set(titleStage, { clearProps: 'all' });
    titleStage.style.opacity = '0';
    titleStage.style.pointerEvents = 'none';

    const titleCard = titleStage.querySelector('.wedding-title-card');
    if (titleCard) {
      titleCard.classList.remove('fading-out');
      gsap.set(titleCard, { clearProps: 'all' });
    }

    const titleChildren = titleStage.querySelectorAll(
      '.wedding-title-badge, .wedding-title-divider, .wedding-title-main, .wedding-title-sub, .wedding-title-lotus'
    );
    titleChildren.forEach((el) => {
      gsap.set(el, { clearProps: 'all' });
    });
  }

  // 8. Reset Flare
  if (flare) {
    flare.classList.remove('radiate');
    gsap.set(flare, { clearProps: 'all' });
  }
}

// ─── Scene 1 Initialization & Lifecycle ──────────────────────────────────────

export function initScene1() {
  if (cleanupListeners) {
    cleanupListeners();
    cleanupListeners = null;
  }
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = 0;
  }
  if (gsapCtx) {
    gsapCtx.revert();
    gsapCtx = null;
  }

  isDestroyed = false;
  resetScene1State();

  const envelopeRig = document.getElementById('envelope-float-rig');
  const sealBtn = document.getElementById('seal-assembly');
  const hintPill = document.getElementById('envelope-hint');
  const titleStage = document.getElementById('wedding-title-stage');
  const bgCanvas = document.getElementById('scene1-bg-canvas');
  const fgCanvas = document.getElementById('scene1-fg-canvas');

  if (!envelopeRig || !bgCanvas || !fgCanvas) return;

  const specularOverlay = envelopeRig.querySelector('.gold-specular-overlay');

  bgCtx = bgCanvas.getContext('2d');
  fgCtx = fgCanvas.getContext('2d');

  let cw = (bgCanvas.width = fgCanvas.width = window.innerWidth);
  let ch = (bgCanvas.height = fgCanvas.height = window.innerHeight);

  let resizeTimer = 0;
  const handleResize = () => {
    if (resizeTimer) cancelAnimationFrame(resizeTimer);
    resizeTimer = requestAnimationFrame(() => {
      cw = bgCanvas.width = fgCanvas.width = window.innerWidth;
      ch = bgCanvas.height = fgCanvas.height = window.innerHeight;
    });
  };
  window.addEventListener('resize', handleResize);

  // 3D Tilt Variables
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;
  let targetShimmerX = 50;
  let targetShimmerY = 50;
  let lastShimmerX = 50;
  let lastShimmerY = 50;
  let floatPhase = 0;

  // Lightweight pointer tracking
  const handlePointerMove = (clientX, clientY) => {
    const normX = (clientX / window.innerWidth) * 2 - 1;
    const normY = (clientY / window.innerHeight) * 2 - 1;

    targetRotY = normX * 8.5;
    targetRotX = -normY * 6.5;

    targetShimmerX = Math.round(50 + normX * 38);
    targetShimmerY = Math.round(50 + normY * 38);
  };

  const onMouseMove = (e) => handlePointerMove(e.clientX, e.clientY);
  const onTouchMove = (e) => {
    if (e.touches && e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });

  // Light Ribbon Streams orbiting envelope
  lightStreams = [
    { radiusX: 0.36, radiusY: 0.23, speed: 0.012, phase: 0, tilt: -0.28, fg: true, width: 3.2 },
    { radiusX: 0.42, radiusY: 0.27, speed: 0.009, phase: 2.1, tilt: -0.18, fg: false, width: 2.6 },
    { radiusX: 0.31, radiusY: 0.21, speed: 0.015, phase: 4.2, tilt: -0.35, fg: true, width: 2.2 },
  ];

  // Golden Sparkles (Adaptive count: 28 on mobile, 55 on desktop)
  sparkles = [];
  const isMobileScreen = window.innerWidth < 640;
  const SPARKLE_COUNT = isMobileScreen ? 28 : 55;
  for (let i = 0; i < SPARKLE_COUNT; i++) {
    sparkles.push({
      x: Math.random() * cw,
      y: Math.random() * ch,
      r: Math.random() * 2.2 + 0.8,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.45 - 0.15,
      alpha: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.03 + 0.012,
      fg: Math.random() > 0.45,
      hue: Math.random() > 0.25 ? 43 : 18,
    });
  }

  // Drifting Rose Petals (Adaptive count: 7 on mobile, 14 on desktop)
  petals = [];
  const PETAL_COUNT = isMobileScreen ? 7 : 14;
  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push({
      x: Math.random() * cw,
      y: Math.random() * ch,
      size: Math.random() * 10 + 7,
      vx: Math.random() * 0.5 + 0.2,
      vy: Math.random() * 0.4 + 0.2,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.018,
      swayPhase: Math.random() * Math.PI * 2,
      fg: i % 3 === 0,
    });
  }

  // Ultra-Smooth 60fps Loop
  let frameTick = 0;
  const animateLoop = () => {
    if (isDestroyed) return;

    frameTick++;
    floatPhase += 0.02;

    currentRotX += (targetRotX - currentRotX) * 0.08;
    currentRotY += (targetRotY - currentRotY) * 0.08;

    const floatY = Math.sin(floatPhase) * 5;

    if (envelopeRig) {
      envelopeRig.style.transform = `translate3d(0,${floatY.toFixed(1)}px,0) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;

      if (specularOverlay && (lastShimmerX !== targetShimmerX || lastShimmerY !== targetShimmerY)) {
        lastShimmerX = targetShimmerX;
        lastShimmerY = targetShimmerY;
        specularOverlay.style.setProperty('--shimmer-x', `${targetShimmerX}%`);
        specularOverlay.style.setProperty('--shimmer-y', `${targetShimmerY}%`);
      }
    }

    if (bgCtx && fgCtx) {
      bgCtx.clearRect(0, 0, cw, ch);
      fgCtx.clearRect(0, 0, cw, ch);

      // Light Streams (Batched continuous path strokes)
      lightStreams.forEach((stream) => {
        const targetCtx = stream.fg ? fgCtx : bgCtx;
        drawSwirlingGoldenRibbon(targetCtx, stream, frameTick, cw, ch);
      });

      // Sparkles (Hardware Accelerated Fast Sprite Blitting)
      const goldSprite = getSparkleSprite(43);
      const amberSprite = getSparkleSprite(18);

      sparkles.forEach((s) => {
        s.x += s.vx + Math.sin(frameTick * 0.01 + s.y * 0.01) * 0.2;
        s.y += s.vy;
        s.alpha += s.twinkleSpeed;

        if (s.y < -10) s.y = ch + 10;
        if (s.x < -10) s.x = cw + 10;
        if (s.x > cw + 10) s.x = -10;

        const opacity = (Math.sin(s.alpha) * 0.5 + 0.5) * 0.9;
        const ctx = s.fg ? fgCtx : bgCtx;
        const sprite = s.hue === 43 ? goldSprite : amberSprite;

        ctx.globalAlpha = opacity;
        const size = s.r * 3.8;
        ctx.drawImage(sprite, s.x - size * 0.5, s.y - size * 0.5, size, size);
      });

      // Drifting Rose Petals (Pre-rendered Offscreen Sprite)
      petals.forEach((p) => {
        p.swayPhase += 0.02;
        p.x += p.vx + Math.sin(p.swayPhase) * 0.45;
        p.y += p.vy;
        p.rot += p.vRot;

        if (p.y > ch + 25) {
          p.y = -25;
          p.x = Math.random() * cw;
        }
        if (p.x > cw + 25) p.x = -25;

        const ctx = p.fg ? fgCtx : bgCtx;
        drawRosePetal(ctx, p);
      });

      // Seal Click Burst Particles (Hardware Accelerated Sprite Blit)
      if (burstParticles.length > 0) {
        for (let i = burstParticles.length - 1; i >= 0; i--) {
          const bp = burstParticles[i];
          bp.x += bp.vx;
          bp.y += bp.vy;
          bp.vx *= 0.96;
          bp.vy *= 0.96;
          bp.life -= bp.decay;

          if (bp.life <= 0) {
            burstParticles.splice(i, 1);
            continue;
          }

          fgCtx.globalAlpha = bp.life;
          const size = bp.r * bp.life * 3.6;
          fgCtx.drawImage(goldSprite, bp.x - size * 0.5, bp.y - size * 0.5, size, size);
        }
      }

      bgCtx.globalAlpha = 1.0;
      fgCtx.globalAlpha = 1.0;
    }

    animFrameId = requestAnimationFrame(animateLoop);
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    animFrameId = requestAnimationFrame(animateLoop);
  }

  // Scoped GSAP Animations for Scene 1
  gsapCtx = gsap.context(() => {
    if (!prefersReducedMotion) {
      gsap.fromTo('#envelope-float-rig',
        { opacity: 0, scale: 0.93, y: 22 },
        { opacity: 1, scale: 1, y: 0, duration: 1.05, ease: 'power2.out' }
      );
      gsap.fromTo('#envelope-hint',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'power2.out' }
      );
    }
  }, '#scene-1');

  // Envelope Open Toggle Handler
  const handleEnvelopeClick = (e) => {
    if (e) {
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      if (e.type === 'keydown') e.preventDefault();
      e.stopPropagation();
    }

    if (isOpen) {
      if (!inTitleStage) {
        showWeddingTitleStage();
      }
      return;
    }

    isOpen = true;
    envelopeRig.classList.add('envelope-open');

    playRoyalSparkleChime(true);
    spawnSealBurstParticles(cw, ch);

    if (hintPill) {
      gsap.to(hintPill, { opacity: 0, duration: 0.35, pointerEvents: 'none' });
    }

    if (!prefersReducedMotion) {
      const openTl = gsap.timeline();
      openTl.to('#seal-assembly', {
        scale: 0.82,
        duration: 0.16,
        ease: 'power1.inOut'
      })
      .to('#seal-assembly', {
        scale: 0,
        opacity: 0,
        duration: 0.38,
        ease: 'back.in(1.8)'
      })
      .to('.flap-top-hinge', {
        rotateX: -180,
        duration: 1.15,
        ease: 'power2.inOut'
      }, '-=0.1')
      .to('.invitation-card-3d', {
        y: '-48%',
        scale: 1.02,
        duration: 1.25,
        ease: 'power2.out'
      }, '-=0.6');
    }

    // Phase 2: After user admires opened envelope (~2.6s),
    // smoothly crossfade to the Wedding Title Screen
    addSafeTimer(() => {
      showWeddingTitleStage();
    }, 2600);
  };

  const handleTitleClick = (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    if (e.type === 'keydown') e.preventDefault();
    proceedToScene2();
  };

  if (sealBtn) {
    sealBtn.addEventListener('click', handleEnvelopeClick);
    sealBtn.addEventListener('keydown', handleEnvelopeClick);
  }

  envelopeRig.addEventListener('click', handleEnvelopeClick);
  envelopeRig.addEventListener('keydown', handleEnvelopeClick);

  // Title Stage click / tap / keyboard to advance immediately
  if (titleStage) {
    titleStage.addEventListener('click', handleTitleClick);
    titleStage.addEventListener('keydown', handleTitleClick);
  }

  // Mouse wheel scroll to advance or go back
  const handleWheel = (e) => {
    if (e.deltaY > 30) {
      if (isOpen && !inTitleStage) {
        showWeddingTitleStage();
      } else if (inTitleStage) {
        proceedToScene2();
      }
    } else if (e.deltaY < -30) {
      if (inTitleStage) {
        returnToEnvelopeStage();
      }
    }
  };
  window.addEventListener('wheel', handleWheel, { passive: true });

  // Touch swipe up/down
  let touchStartY = 0;
  const onTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) touchStartY = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (deltaY > 50) {
        if (isOpen && !inTitleStage) {
          showWeddingTitleStage();
        } else if (inTitleStage) {
          proceedToScene2();
        }
      } else if (deltaY < -50) {
        if (inTitleStage) {
          returnToEnvelopeStage();
        }
      }
    }
  };
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });

  cleanupListeners = () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('wheel', handleWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchend', onTouchEnd);

    if (sealBtn) {
      sealBtn.removeEventListener('click', handleEnvelopeClick);
      sealBtn.removeEventListener('keydown', handleEnvelopeClick);
    }
    if (envelopeRig) {
      envelopeRig.removeEventListener('click', handleEnvelopeClick);
      envelopeRig.removeEventListener('keydown', handleEnvelopeClick);
    }
    if (titleStage) {
      titleStage.removeEventListener('click', handleTitleClick);
      titleStage.removeEventListener('keydown', handleTitleClick);
    }
  };
}

export function destroyScene1() {
  isDestroyed = true;
  clearAllTimers();
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = 0;
  }
  if (cleanupListeners) {
    cleanupListeners();
    cleanupListeners = null;
  }
  sparkles = [];
  petals = [];
  burstParticles = [];
  lightStreams = [];
  bgCtx = null;
  fgCtx = null;
  if (gsapCtx) {
    gsapCtx.revert();
    gsapCtx = null;
  }
  resetScene1State();
}
