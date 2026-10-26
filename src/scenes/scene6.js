/**
 * Scene 6 — The Grand Baraat & Finale
 * Royal Indian Vivah Celebration Card & Interactive Fireworks
 *
 * Replaces the multi-slide story view with the full-bleed "The Grand Vivah Celebration"
 * invitation card matching the user's selected design:
 * - Illuminated palace & baraat backdrop (/assets/scene6_baraat_finale.jpg)
 * - Header badge & regal Sanskrit title (आनन्दोत्सव • The Grand Vivah Celebration)
 * - Central royal glassmorphism invitation card with glowing pink lotus emblem
 * - Calligraphy couple name: Sneha & Dipak (Great Vibes)
 * - Event Date: 29 NOVEMBER 2026 | Auspicious Muhurat 7:00 PM Onwards
 * - Venue: Sethjees Banquet, Maniktala, Kanchrapara
 * - 4 Interactive Action Buttons:
 *   1. ✨ CELEBRATE WITH FIREWORKS & PETALS 🎆 (Interactive canvas bursts)
 *   2. 📍 VIEW VENUE MAP (Direct Google Maps navigation)
 *   3. 🕒 CELEBRATION TIMELINE (Interactive 3-day itinerary modal)
 *   4. ↺ BACK TO BEGINNING (Returns smoothly to Scene 1)
 * - Footer: #SNEHAWEDSDIPAK & Family gratitude
 */

import { gsap } from 'gsap';
import './scene6.css';

/** @type {number[]} */
let activeTimers = [];

/** @type {number} */
let particleAnimFrame = 0;

/** @type {Array<Object>} */
let ambientParticles = [];

/** @type {Array<Object>} */
let activeFireworks = [];

/** @type {CanvasRenderingContext2D | null} */
let particleCtx = null;

/** @type {gsap.Context | null} */
let gsapCtx = null;

// Stored handlers for clean teardown
let resizeHandler = null;
let keydownHandler = null;
let autoBurstTimer = null;

function addSafeTimer(fn, delay) {
  const id = window.setTimeout(fn, delay);
  activeTimers.push(id);
  return id;
}

function clearAllTimers() {
  activeTimers.forEach((item) => {
    if (typeof item === 'function') {
      try { item(); } catch {}
    } else {
      clearTimeout(item);
    }
  });
  activeTimers = [];

  if (autoBurstTimer) {
    clearInterval(autoBurstTimer);
    autoBurstTimer = null;
  }
}

// ─── Particle & Fireworks Simulation ─────────────────────────────────────────

class Spark {
  constructor(x, y, color, angle, speed, decay, gravity = 0.05, size = 2) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = decay;
    this.gravity = gravity;
    this.size = size;
    this.flicker = Math.random() * 0.2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.985;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha + (Math.random() * this.flicker - this.flicker / 2));
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Halo
    ctx.globalAlpha = Math.max(0, this.alpha * 0.3);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Rocket {
  constructor(targetX, targetY, startX, startY, colorPalette) {
    this.x = startX;
    this.y = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.palette = colorPalette;
    const dx = targetX - startX;
    const dy = targetY - startY;
    const dist = Math.hypot(dx, dy);
    const speed = 14 + Math.random() * 4;
    this.vx = (dx / dist) * speed;
    this.vy = (dy / dist) * speed;
    this.exploded = false;
    this.trail = [];
  }

  update() {
    this.trail.push({ x: this.x, y: this.y, alpha: 0.8 });
    if (this.trail.length > 8) this.trail.shift();

    this.x += this.vx;
    this.y += this.vy;

    // Check if reached apex/target
    if (this.vy < 0 && this.y <= this.targetY) {
      this.explode();
    }
  }

  explode() {
    this.exploded = true;
    const sparkCount = 65 + Math.floor(Math.random() * 35);
    const baseColor = this.palette[Math.floor(Math.random() * this.palette.length)];

    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.4;
      const speed = 2 + Math.random() * 6;
      const decay = 0.012 + Math.random() * 0.014;
      const color = Math.random() > 0.3 ? baseColor : '#ffffff';
      activeFireworks.push(new Spark(this.x, this.y, color, angle, speed, decay, 0.06, 1.8 + Math.random() * 1.5));
    }

    // Add 8-12 floral rose petals bursting outwards
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      activeFireworks.push(new Spark(this.x, this.y, '#e91e63', angle, speed, 0.008, 0.04, 3.2));
    }
  }

  draw(ctx) {
    if (this.exploded) return;
    ctx.save();
    for (let i = 0; i < this.trail.length; i++) {
      const pt = this.trail[i];
      ctx.globalAlpha = (i / this.trail.length) * 0.6;
      ctx.fillStyle = '#ffdf7a';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff4cc';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const FIREWORK_PALETTES = [
  ['#ffd700', '#ffae19', '#fff2a1', '#ffffff'],
  ['#ff4b72', '#ff8da1', '#ffd700', '#ffffff'],
  ['#e066ff', '#b388ff', '#ffeb3b', '#ffffff'],
  ['#00e5ff', '#80d8ff', '#ffd700', '#ffffff'],
  ['#ff9100', '#ff3d00', '#ffe57f', '#ffffff'],
];

export function triggerFireworksBurst(count = 3) {
  const canvas = document.getElementById('scene6-particles');
  if (!canvas) return;

  const width = canvas.clientWidth || window.innerWidth;
  const height = canvas.clientHeight || window.innerHeight;

  for (let i = 0; i < count; i++) {
    addSafeTimer(() => {
      const targetX = width * (0.15 + Math.random() * 0.7);
      const targetY = height * (0.15 + Math.random() * 0.35);
      const startX = width * (0.3 + Math.random() * 0.4);
      const startY = height + 10;
      const palette = FIREWORK_PALETTES[Math.floor(Math.random() * FIREWORK_PALETTES.length)];
      activeFireworks.push(new Rocket(targetX, targetY, startX, startY, palette));
    }, i * 260);
  }
}

function initAmbientParticles(width, height) {
  ambientParticles = [];
  const count = Math.min(Math.floor((width * height) / 24000), 45);

  for (let i = 0; i < count; i++) {
    const isPetal = Math.random() > 0.65;
    ambientParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: isPetal ? 3 + Math.random() * 3.5 : 1 + Math.random() * 2,
      isPetal,
      color: isPetal
        ? (Math.random() > 0.4 ? 'rgba(233, 30, 99, ' : 'rgba(255, 64, 129, ')
        : (Math.random() > 0.5 ? 'rgba(255, 215, 0, ' : 'rgba(255, 240, 180, '),
      vx: (Math.random() - 0.4) * 0.4,
      vy: isPetal ? 0.4 + Math.random() * 0.6 : -0.2 - Math.random() * 0.35,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      opacity: 0.3 + Math.random() * 0.5,
      pulse: Math.random() * Math.PI * 2,
    });
  }
}

function updateAndDrawParticles(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);

  // 1. Ambient Particles (Floating Rose Petals & Golden Embers)
  for (let i = 0; i < ambientParticles.length; i++) {
    const p = ambientParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotSpeed;
    p.pulse += 0.03;

    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;
    if (p.y < -10) p.y = height + 10;
    if (p.y > height + 10) p.y = -10;

    const alpha = p.opacity * (0.65 + 0.35 * Math.sin(p.pulse));

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    if (p.isPetal) {
      ctx.fillStyle = `${p.color}${alpha})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 1.35, p.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = `${p.color}${alpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Soft gold glow
      ctx.fillStyle = `${p.color}${alpha * 0.3})`;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 2. Active Fireworks Rockets & Burst Sparks
  for (let i = activeFireworks.length - 1; i >= 0; i--) {
    const item = activeFireworks[i];
    item.update();
    item.draw(ctx);

    if ((item instanceof Rocket && item.exploded) || (item instanceof Spark && item.alpha <= 0)) {
      activeFireworks.splice(i, 1);
    }
  }
}

function resizeCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  canvas.width = (rect.width || window.innerWidth) * dpr;
  canvas.height = (rect.height || window.innerHeight) * dpr;
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.scale(dpr, dpr);
  return ctx;
}

// ─── Scene 6 DOM Construction ────────────────────────────────────────────────

export function createScene6() {
  return `
    <div id="scene-6" class="scene scene-6" role="region" aria-label="The Grand Baraat and Vivah Celebration Finale">
    <!-- Royal Illuminated Palace & Fireworks Backdrop -->
    <div class="scene-6-bg-wrap">
      <img
        src="/assets/scene6_baraat_finale.jpg"
        alt="Royal palace illuminated at night with wedding baraat celebration and fireworks"
        class="scene-6-bg-img"
        loading="eager"
        decoding="async"
      />
      <div class="scene-6-vignette" aria-hidden="true"></div>
      <div class="scene-6-lantern-glow" aria-hidden="true"></div>
    </div>

    <!-- Celebration Ambient Canvas (Embers, Rose Petals, Fireworks Rockets) -->
    <canvas id="scene6-particles" class="scene-6-particles" aria-hidden="true"></canvas>

    <!-- Top Header Ribbon & Title -->
    <header class="scene-6-header">
      <div class="scene-6-badge" aria-label="Ceremony title">
        <span class="badge-flourish">❦</span>
        <span class="badge-text">THE GRAND BARAAT &amp; FINALE</span>
        <span class="badge-flourish">❦</span>
      </div>
      <h2 class="scene-6-title">आनन्दोत्सव • The Grand Vivah Celebration</h2>
    </header>

    <!-- Center Royal Glassmorphic Invitation Card -->
    <main class="scene-6-card-wrapper">
      <article class="scene-6-card" aria-labelledby="scene6-couple-heading">
        <!-- Pink Lotus Emblem -->
        <div class="scene-6-lotus-wrap" aria-hidden="true">
          <svg class="scene-6-lotus-icon" viewBox="0 0 64 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="s6LotusCenter" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ff7ebd" />
                <stop offset="100%" stop-color="#d81b60" />
              </linearGradient>
              <linearGradient id="s6LotusSide" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#f48fb1" />
                <stop offset="100%" stop-color="#ad1457" />
              </linearGradient>
              <linearGradient id="s6LotusGold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ffe082" />
                <stop offset="100%" stop-color="#ffb300" />
              </linearGradient>
              <filter id="s6LotusGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <g filter="url(#s6LotusGlow)">
              <!-- Outer Side Petals -->
              <path d="M12 36C8 30 8 20 18 16C22 22 24 30 24 36C20 37 15 37 12 36Z" fill="url(#s6LotusSide)" opacity="0.85" />
              <path d="M52 36C56 30 56 20 46 16C42 22 40 30 40 36C44 37 49 37 52 36Z" fill="url(#s6LotusSide)" opacity="0.85" />
              <!-- Mid Petals -->
              <path d="M18 37C15 28 17 14 26 8C29 17 30 28 29 37C25 38 21 38 18 37Z" fill="url(#s6LotusCenter)" opacity="0.95" />
              <path d="M46 37C49 28 47 14 38 8C35 17 34 28 35 37C39 38 43 38 46 37Z" fill="url(#s6LotusCenter)" opacity="0.95" />
              <!-- Center Crown Petal -->
              <path d="M32 2C27 12 26 26 29 38C31 39 33 39 35 38C38 26 37 12 32 2Z" fill="url(#s6LotusCenter)" />
              <!-- Golden Base Calyx -->
              <path d="M22 38C26 43 38 43 42 38C38 40 26 40 22 38Z" fill="url(#s6LotusGold)" />
              <circle cx="32" cy="35" r="2" fill="#ffffff" opacity="0.95" />
              <circle cx="28" cy="36" r="1.3" fill="#ffe082" />
              <circle cx="36" cy="36" r="1.3" fill="#ffe082" />
            </g>
          </svg>
        </div>

        <!-- Calligraphy Couple Name -->
        <h1 id="scene6-couple-heading" class="scene-6-couple-name">Sneha &amp; Dipak</h1>

        <!-- Invitation Intro Text -->
        <p class="scene-6-invitation-text">Together with our families, we invite you and your family to celebrate our wedding.</p>

        <!-- Date & Auspicious Muhurat -->
        <div class="scene-6-date-container">
          <time datetime="2026-11-29" class="scene-6-date-val">29 NOVEMBER 2026</time>
          <div class="scene-6-muhurat-val">SUNDAY • AUSPICIOUS MUHURAT 7:00 PM ONWARDS</div>
        </div>

        <!-- Venue Location -->
        <div class="scene-6-venue-val">
          Sethjees Banquet, Maniktala, Kanchrapara
        </div>

        <!-- Interactive Action Buttons -->
        <div class="scene-6-actions">
          <!-- Button 1: Celebrate with Fireworks & Petals (Full-width shimmering gold button) -->
          <button
            id="scene6-btn-fireworks"
            type="button"
            class="scene-6-btn scene-6-btn-gold scene-6-btn-full"
            aria-label="Celebrate with fireworks and flower petals"
          >
            <span class="btn-sparkle" aria-hidden="true">✨</span>
            <span class="btn-text">CELEBRATE WITH FIREWORKS &amp; PETALS</span>
            <span class="btn-firework" aria-hidden="true">🎆</span>
          </button>

          <!-- Dual Button Row: Venue Map & Celebration Timeline -->
          <div class="scene-6-btn-row">
            <!-- Button 2: View Venue Map (External Google Maps link) -->
            <a
              id="scene6-btn-map"
              href="https://www.google.com/maps/place/Sethjee%E2%80%99s+Banquet/@22.9439432,88.4413581,17z/data=!3m1!4b1!4m6!3m5!1s0x39f895aa58a18ea9:0x4af002a6bd41fac!8m2!3d22.9439432!4d88.443933!16s%2Fg%2F11xcz9l0n?utm_source=chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              class="scene-6-btn scene-6-btn-gold scene-6-btn-half"
              aria-label="Open venue map in Google Maps"
            >
              <span class="btn-icon" aria-hidden="true">📍</span>
              <span class="btn-text">VIEW VENUE MAP</span>
            </a>

            <!-- Button 3: Celebration Timeline (Modal popup) -->
            <button
              id="scene6-btn-timeline"
              type="button"
              class="scene-6-btn scene-6-btn-wine scene-6-btn-half"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-label="Open wedding celebration timeline"
            >
              <span class="btn-icon" aria-hidden="true">🕒</span>
              <span class="btn-text">CELEBRATION TIMELINE</span>
            </button>
          </div>

          <!-- Button 4: Back to Beginning (Single centered button) -->
          <button
            id="scene6-btn-replay"
            type="button"
            class="scene-6-btn scene-6-btn-replay"
            aria-label="Return to beginning of the wedding card"
          >
            <span class="btn-icon" aria-hidden="true">↺</span>
            <span class="btn-text">BACK TO BEGINNING</span>
          </button>
        </div>
      </article>
    </main>

    <!-- Bottom Footer Gratitude & Hashtag -->
    <footer class="scene-6-footer">
      <div class="scene-6-hashtag">#SNEHAWEDSDIPAK</div>
      <p class="scene-6-gratitude">With love, respect &amp; heartfelt gratitude from Sinha &amp; Prasad Families</p>
    </footer>

    <!-- Celebration Timeline Modal Popup -->
    <div id="scene6-timeline-modal" class="scene-6-modal" role="dialog" aria-modal="true" aria-labelledby="scene6-modal-title" hidden>
      <div class="scene-6-modal-backdrop" aria-hidden="true"></div>
      <div class="scene-6-modal-card">
        <button id="scene6-modal-close" class="scene-6-modal-close" type="button" aria-label="Close timeline popup">✕</button>

        <div class="scene-6-modal-header">
          <div class="scene-6-modal-badge">॥ शुभ मंगल विवाह ॥</div>
          <h3 id="scene6-modal-title" class="scene-6-modal-heading">Celebration Itinerary</h3>
          <p class="scene-6-modal-sub">Three days of joyous celebrations, sacred ceremonies &amp; eternal memories</p>
        </div>

        <div class="scene-6-timeline-list">
          <!-- Day 1: Tilak Ceremony -->
          <div class="scene-6-timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <span class="timeline-tag">DAY 1 • AUSPICIOUS BEGINNING</span>
              <h4 class="timeline-item-title">Tilak Ceremony</h4>
              <div class="timeline-meta">
                <span>📅 Friday, 27 November 2026</span>
                <span>🕕 6:00 PM Onwards</span>
              </div>
              <p class="timeline-desc">Sacred acceptance, family blessing exchange, traditional shagun rituals and dinner.</p>
              <div class="timeline-venue">📍 Swarna Bhobon</div>
            </div>
          </div>

          <!-- Day 2: Mati Matkor & Haldi -->
          <div class="scene-6-timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <span class="timeline-tag">DAY 2 • SACRED TRADITIONS</span>
              <h4 class="timeline-item-title">Mati Matkor &amp; Haldi</h4>
              <div class="timeline-meta">
                <span>📅 Saturday, 28 November 2026</span>
                <span>🕓 4:30 PM Onwards for Mati Matkor &amp; 7:30 PM Onwards for Haldi</span>
              </div>
              <p class="timeline-desc">Earthen soil prayer (Matkor Puja), holy turmeric bath (Haldi)</p>
              <div class="timeline-venue">📍 In House, Kanchrapara</div>
            </div>
          </div>

          <!-- Day 3: The Grand Vivah -->
          <div class="scene-6-timeline-item active">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <span class="timeline-tag">DAY 3 • THE WEDDING DAY</span>
              <h4 class="timeline-item-title">The Grand Vivah</h4>
              <div class="timeline-meta">
                <span>📅 Sunday, 29 November 2026</span>
                <span>🕖 Auspicious Muhurat 7:00 PM Onwards</span>
              </div>
              <p class="timeline-desc">Royal Baraat arrival, joyous Varmala under the starry canopy, sacred Saat Phere and celebratory banquet.</p>
              <div class="timeline-venue">📍 Sethjees Banquet, Maniktala, Kanchrapara</div>
            </div>
          </div>
        </div>

        <div class="scene-6-modal-footer">
          <button id="scene6-modal-goto-events" class="scene-6-modal-btn" type="button">
            View Complete Event Gallery →
          </button>
        </div>
      </div>
    </div>
  </div>
  `;
}

// ─── Scene 6 Lifecycle Initialization ────────────────────────────────────────

export function initScene6() {
  const scene6 = document.getElementById('scene-6');
  if (!scene6) return;

  const canvas = document.getElementById('scene6-particles');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Setup Canvas Context and Particle System
  if (canvas) {
    particleCtx = resizeCanvas(canvas);
    const rect = canvas.getBoundingClientRect();
    initAmbientParticles(rect.width || window.innerWidth, rect.height || window.innerHeight);

    let lastTime = 0;
    const renderLoop = (time) => {
      if (!particleCtx || !canvas) return;
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;

      // Throttle rendering if needed
      updateAndDrawParticles(particleCtx, width, height);
      particleAnimFrame = requestAnimationFrame(renderLoop);
    };

    particleAnimFrame = requestAnimationFrame(renderLoop);

    resizeHandler = () => {
      if (canvas) {
        particleCtx = resizeCanvas(canvas);
        const w = canvas.clientWidth || window.innerWidth;
        const h = canvas.clientHeight || window.innerHeight;
        initAmbientParticles(w, h);
      }
    };
    window.addEventListener('resize', resizeHandler, { passive: true });
  }

  // 2. Initial Subtle Firework Celebration & Periodic Gentle Bursts
  if (!prefersReducedMotion) {
    addSafeTimer(() => {
      triggerFireworksBurst(3);
    }, 600);

    // Auto-launch gentle firework every 7 seconds
    autoBurstTimer = window.setInterval(() => {
      if (document.hidden) return;
      triggerFireworksBurst(1 + Math.floor(Math.random() * 2));
    }, 7000);
  }

  // 3. Interactive Buttons Wiring
  const fireworksBtn = document.getElementById('scene6-btn-fireworks');
  if (fireworksBtn) {
    fireworksBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Button bounce micro-animation
      gsap.fromTo(fireworksBtn, { scale: 0.95 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
      // Dazzling multi-firework celebration
      triggerFireworksBurst(5);
    });
  }

  // Timeline Modal Handling
  const timelineBtn = document.getElementById('scene6-btn-timeline');
  const modal = document.getElementById('scene6-timeline-modal');
  const modalCloseBtn = document.getElementById('scene6-modal-close');
  const modalBackdrop = modal ? modal.querySelector('.scene-6-modal-backdrop') : null;
  const gotoEventsBtn = document.getElementById('scene6-modal-goto-events');

  const openTimelineModal = () => {
    if (!modal) return;
    modal.hidden = false;
    modal.classList.add('open');
    if (timelineBtn) timelineBtn.setAttribute('aria-expanded', 'true');

    if (!prefersReducedMotion) {
      gsap.fromTo(
        '.scene-6-modal-card',
        { opacity: 0, y: 30, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  };

  const closeTimelineModal = () => {
    if (!modal) return;
    if (!prefersReducedMotion) {
      gsap.to('.scene-6-modal-card', {
        opacity: 0,
        y: 20,
        scale: 0.96,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          modal.hidden = true;
          modal.classList.remove('open');
          if (timelineBtn) timelineBtn.setAttribute('aria-expanded', 'false');
        },
      });
    } else {
      modal.hidden = true;
      modal.classList.remove('open');
      if (timelineBtn) timelineBtn.setAttribute('aria-expanded', 'false');
    }
  };

  if (timelineBtn) {
    timelineBtn.addEventListener('click', openTimelineModal);
  }
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeTimelineModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeTimelineModal);
  }
  if (gotoEventsBtn) {
    gotoEventsBtn.addEventListener('click', () => {
      closeTimelineModal();
      if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
        window.sceneManager.goToScene(4, 'up');
      }
    });
  }

  // Keyboard accessibility for modal (ESC to close)
  keydownHandler = (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) {
      closeTimelineModal();
    }
  };
  window.addEventListener('keydown', keydownHandler);

  // Button 4: Back to Beginning
  const replayBtn = document.getElementById('scene6-btn-replay');
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeTimelineModal();
      if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
        window.sceneManager.goToScene(1, 'up');
      }
    });
  }

  // 4. GSAP Entrance Animation
  if (!prefersReducedMotion) {
    gsapCtx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.scene-6-bg-img',
        { scale: 1.08, opacity: 0.6 },
        { scale: 1, opacity: 1, duration: 1.6, ease: 'power2.out' },
        0
      )
        .fromTo(
          '.scene-6-header',
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          0.3
        )
        .fromTo(
          '.scene-6-card',
          { y: 35, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.15)' },
          0.5
        )
        .fromTo(
          ['.scene-6-lotus-wrap', '.scene-6-couple-name', '.scene-6-invitation-text', '.scene-6-date-container', '.scene-6-venue-val'],
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          0.75
        )
        .fromTo(
          ['.scene-6-btn-full', '.scene-6-btn-row', '.scene-6-btn-replay'],
          { opacity: 0, y: 18, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.1 },
          1.0
        )
        .fromTo(
          '.scene-6-footer',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7 },
          1.2
        );
    }, scene6);
  }
}

// ─── Scene 6 Lifecycle Teardown ──────────────────────────────────────────────

export function destroyScene6() {
  if (particleAnimFrame) {
    cancelAnimationFrame(particleAnimFrame);
    particleAnimFrame = 0;
  }

  clearAllTimers();

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }

  if (keydownHandler) {
    window.removeEventListener('keydown', keydownHandler);
    keydownHandler = null;
  }

  if (gsapCtx) {
    gsapCtx.revert();
    gsapCtx = null;
  }

  const scene6 = document.getElementById('scene-6');
  if (scene6) {
    gsap.set(scene6, { clearProps: 'opacity,scale,transform' });
  }

  ambientParticles = [];
  activeFireworks = [];
  particleCtx = null;
}
