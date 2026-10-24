/**
 * Scene 4 — Wedding Events & Countdown
 *
 * Cinematic Indian Wedding Celebration & Itinerary
 * Layered Architecture:
 * Layer 1: Palace Garden Sunset Background (s4_bg_desktop.webp / png)
 * Layer 2: Decorative Floral Framing Pillars (s4_flower_pillars_alpha.webp / png)
 * Layer 3: Grand Carved Marble Mandap with Sacred Fire & Lit Diyas (s4_mandap_01.webp / png)
 * Layer 4: Ambient Floating Rose Petals & Golden Sparkles Canvas
 * Layer 5: Content Interface — Title, Live Countdown, 3 Event Cards & Save the Date Actions
 * Layer 6: Incoming Light Bloom for Scene 3 Continuity
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar.js';
import './scene4.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Verified Wedding Events Data Source (Source of Truth)
 * Exactly three ceremonies: Tilak, Matkor, Shaadi
 * Sourced strictly from original invitation text and verified venue details
 */
export const WEDDING_EVENTS = [
  {
    id: 'tilak',
    badge: 'Auspicious Beginning',
    name: 'Tilak',
    date: '27 November 2026',
    dateISO: '2026-11-27',
    venue: 'Swarna Bhobon',
    venueAddress: 'Swarna Bhobon',
    mapUrl: 'https://maps.app.goo.gl/oKkuRcKUejScfrzj8',
    mapLabel: 'View location of Tilak ceremony at Swarna Bhobon on Google Maps',
    icon: '✨',
  },
  {
    id: 'matkor',
    badge: 'Traditional Ritual',
    name: 'Matkor',
    date: '28 November 2026',
    dateISO: '2026-11-28',
    venue: 'At home',
    venueAddress: 'At home',
    mapUrl: 'https://maps.app.goo.gl/yXkeEQSZUPhdMXee7',
    mapLabel: 'View location of Matkor ceremony At home on Google Maps',
    icon: '🪔',
  },
  {
    id: 'shaadi',
    badge: 'The Holy Matrimony',
    name: 'Shaadi',
    date: '29 November 2026',
    dateISO: '2026-11-29',
    time: { start: '19:00', end: '23:00', display: '7:00 PM onwards' },
    venue: 'Sethjee’s Banquet',
    venueAddress: 'Sethjee’s Banquet, Maniktala, Kanchrapara',
    mapUrl: 'https://www.google.com/maps/place/Sethjee%E2%80%99s+Banquet/@22.9439432,88.4413581,17z/data=!3m1!4b1!4m6!3m5!1s0x39f895aa58a18ea9:0x4af002a6bd41fac!8m2!3d22.9439432!4d88.443933!16s%2Fg%2F11xcz9l0n?utm_source=chatgpt.com',
    mapLabel: 'View location of Shaadi wedding ceremony at Sethjee’s Banquet on Google Maps',
    icon: '💍',
  },
];

/**
 * Target Wedding Date: 29 November 2026 in Asia/Kolkata timezone (+05:30)
 * Date-only target: Start of 29 November 2026 IST
 */
const TARGET_WEDDING_DATE = new Date('2026-11-29T00:00:00+05:30').getTime();

/** @type {number[]} */
let activeTimers = [];

/** @type {number | null} */
let countdownInterval = null;

/** @type {number} */
let particleAnimFrame = 0;

/** @type {Array<Object>} */
let ambientParticles = [];

/** @type {CanvasRenderingContext2D | null} */
let particleCtx = null;

/** @type {boolean} */
let isTransitioning = false;

/** @type {gsap.Context | null} */
let gsapCtx = null;

// Stored listeners for explicit cleanup
let resizeHandler = null;
let activeCalDocClickHandler = null;
let activeCalDocKeyHandler = null;

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
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

// ─── Ambient Particle System (Golden Sparkles & Floating Rose Petals) ────────

function createParticle(canvas) {
  const isPetal = Math.random() > 0.72;
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: isPetal ? Math.random() * 4.5 + 2.5 : Math.random() * 2.2 + 0.6,
    speedX: (Math.random() - 0.5) * (isPetal ? 0.35 : 0.2),
    speedY: isPetal ? Math.random() * 0.45 + 0.25 : -(Math.random() * 0.3 + 0.1),
    opacity: Math.random() * 0.5 + 0.2,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.02 + 0.008,
    isPetal,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.02,
    color: isPetal
      ? `rgba(${220 + Math.floor(Math.random() * 25)}, ${35 + Math.floor(Math.random() * 25)}, ${50 + Math.floor(Math.random() * 20)}, `
      : `rgba(245, 207, 104, `,
  };
}

function initParticles(canvas) {
  ambientParticles = [];
  const count = window.innerWidth < 640 ? 25 : 45;
  for (let i = 0; i < count; i++) {
    ambientParticles.push(createParticle(canvas));
  }
}

function updateParticles(canvas) {
  for (let i = 0; i < ambientParticles.length; i++) {
    const p = ambientParticles[i];
    p.x += p.speedX;
    p.y += p.speedY;
    p.pulse += p.pulseSpeed;
    p.rotation += p.rotSpeed;

    if (p.x < -10) p.x = canvas.width + 10;
    if (p.x > canvas.width + 10) p.x = -10;
    if (p.y < -10) p.y = canvas.height + 10;
    if (p.y > canvas.height + 10) p.y = -10;
  }
}

function drawParticles(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < ambientParticles.length; i++) {
    const p = ambientParticles[i];
    const alpha = p.opacity * (0.65 + 0.35 * Math.sin(p.pulse));

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    if (p.isPetal) {
      ctx.fillStyle = `${p.color}${alpha})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 1.3, p.size * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = `${p.color}${alpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Soft glow aura
      ctx.fillStyle = `${p.color}${alpha * 0.25})`;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
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

// ─── Live Wedding Countdown Engine ──────────────────────────────────────────

function formatTwoDigits(n) {
  return String(Math.max(0, Math.floor(n))).padStart(2, '0');
}

function updateCountdownDOM() {
  const now = Date.now();
  const diff = TARGET_WEDDING_DATE - now;

  const daysEl = document.getElementById('s4-cd-days');
  const hoursEl = document.getElementById('s4-cd-hours');
  const minsEl = document.getElementById('s4-cd-minutes');
  const secsEl = document.getElementById('s4-cd-seconds');
  const statusEl = document.getElementById('s4-cd-status');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  if (diff <= 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minsEl.textContent = '00';
    secsEl.textContent = '00';
    if (statusEl) {
      statusEl.textContent = 'The Wedding Celebrations Have Begun! 🎉';
      statusEl.classList.add('celebrating');
    }
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  const formattedD = formatTwoDigits(d);
  const formattedH = formatTwoDigits(h);
  const formattedM = formatTwoDigits(m);
  const formattedS = formatTwoDigits(s);

  if (daysEl.textContent !== formattedD) daysEl.textContent = formattedD;
  if (hoursEl.textContent !== formattedH) hoursEl.textContent = formattedH;
  if (minsEl.textContent !== formattedM) minsEl.textContent = formattedM;
  if (secsEl.textContent !== formattedS) secsEl.textContent = formattedS;
}

function startCountdown() {
  updateCountdownDOM();
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = window.setInterval(updateCountdownDOM, 1000);
}

// ─── HTML Template Creation ──────────────────────────────────────────────────

export function createScene4() {
  return `
    <section id="scene-4" class="scene scene-4" aria-label="Wedding Events and Countdown">

      <!-- Layer 1: Palace Garden Sunset Background -->
      <div class="scene-4-bg-layer" aria-hidden="true">
        <picture class="scene-4-bg-picture">
          <source srcset="/assets/scene-4/s4_bg_desktop.webp" type="image/webp" />
          <img
            src="/assets/scene-4/s4_bg_desktop.png"
            width="1024"
            height="576"
            alt=""
            class="scene-4-bg-img"
            draggable="false"
          />
        </picture>
        <div class="scene-4-bg-vignette"></div>
      </div>

      <!-- Layer 2: Decorative Floral Framing Pillars (Outer Framing) -->
      <div class="scene-4-pillars-layer" aria-hidden="true">
        <div class="scene-4-pillar scene-4-pillar--left">
          <picture>
            <source srcset="/assets/scene-4/s4_flower_pillars_alpha.webp" type="image/webp" />
            <img
              src="/assets/scene-4/s4_flower_pillars_alpha.png"
              width="540"
              height="960"
              alt=""
              draggable="false"
            />
          </picture>
        </div>
        <div class="scene-4-pillar scene-4-pillar--right">
          <picture>
            <source srcset="/assets/scene-4/s4_flower_pillars_alpha.webp" type="image/webp" />
            <img
              src="/assets/scene-4/s4_flower_pillars_alpha.png"
              width="540"
              height="960"
              alt=""
              draggable="false"
            />
          </picture>
        </div>
      </div>

      <!-- Layer 3: Grand Carved Marble Mandap Centerpiece -->
      <div class="scene-4-mandap-layer" aria-hidden="true">
        <picture class="scene-4-mandap-picture">
          <source srcset="/assets/scene-4/s4_mandap_01.webp" type="image/webp" />
          <img
            src="/assets/scene-4/s4_mandap_01.png"
            width="960"
            height="809"
            alt=""
            class="scene-4-mandap-img"
            draggable="false"
          />
        </picture>
        <div class="scene-4-mandap-glow"></div>
      </div>

      <!-- Layer 4: Ambient Floating Rose Petals & Golden Sparkles Canvas -->
      <canvas id="scene4-particles" class="scene-4-particles" aria-hidden="true"></canvas>

      <!-- Layer 5: Scrollable Content Container -->
      <div class="scene-4-scroll-container">
        <div class="scene-4-content-wrap">

          <!-- A. Devotional Badge & Main Header -->
          <header class="scene-4-header scene-4-anim-item scene-4-anim-1">
            <span class="scene-4-devotional-tag">॥ शुभ विवाह उत्सव ॥</span>
            <h1 class="scene-4-title">Wedding Celebrations</h1>
            <div class="scene-4-ornament-divider" aria-hidden="true">
              <span class="scene-4-divider-line"></span>
              <span class="scene-4-divider-gem">❖</span>
              <span class="scene-4-divider-line"></span>
            </div>
            <p class="scene-4-subtitle">
              With joyous hearts, we invite you to be part of our holy ceremonies &amp; celebrations
            </p>
          </header>

          <!-- B. Live Wedding Countdown Timer Ribbon -->
          <section
            class="scene-4-countdown-card scene-4-anim-item scene-4-anim-2"
            aria-label="Live Wedding Countdown to Sunday, 29 November 2026"
          >
            <div class="scene-4-countdown-header">
              <span class="scene-4-countdown-icon" aria-hidden="true">⏳</span>
              <span class="scene-4-countdown-title">Counting Down to the Auspicious Day</span>
            </div>

            <div id="scene-4-countdown-grid" class="scene-4-countdown-grid">
              <div class="scene-4-countdown-unit">
                <span id="s4-cd-days" class="scene-4-countdown-val">00</span>
                <span class="scene-4-countdown-lbl">DAYS</span>
              </div>
              <span class="scene-4-countdown-sep" aria-hidden="true">:</span>
              <div class="scene-4-countdown-unit">
                <span id="s4-cd-hours" class="scene-4-countdown-val">00</span>
                <span class="scene-4-countdown-lbl">HOURS</span>
              </div>
              <span class="scene-4-countdown-sep" aria-hidden="true">:</span>
              <div class="scene-4-countdown-unit">
                <span id="s4-cd-minutes" class="scene-4-countdown-val">00</span>
                <span class="scene-4-countdown-lbl">MINUTES</span>
              </div>
              <span class="scene-4-countdown-sep" aria-hidden="true">:</span>
              <div class="scene-4-countdown-unit">
                <span id="s4-cd-seconds" class="scene-4-countdown-val">00</span>
                <span class="scene-4-countdown-lbl">SECONDS</span>
              </div>
            </div>

            <p id="s4-cd-status" class="scene-4-countdown-status" aria-live="polite">
              Target: 29 November 2026 • Kolkata Time
            </p>
          </section>

          <!-- C. The Three Wedding Event Cards with Save the Date -->
          <main class="scene-4-events-grid" role="list" aria-label="Schedule of Wedding Events">
            ${WEDDING_EVENTS.map(
    (event, idx) => `
              <article
                class="scene-4-event-card scene-4-anim-item scene-4-anim-card scene-4-card-${idx + 1}"
                role="listitem"
                id="event-${event.id}"
              >
                <div class="scene-4-card-inner">
                  
                  <div class="scene-4-card-badge-wrap">
                    <span class="scene-4-card-badge">${event.badge}</span>
                  </div>

                  <div class="scene-4-card-icon-wrap" aria-hidden="true">
                    <span class="scene-4-card-icon">${event.icon}</span>
                  </div>

                  <h2 class="scene-4-event-title">${event.name}</h2>

                  <div class="scene-4-event-detail-row">
                    <svg class="scene-4-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <time datetime="${event.dateISO}" class="scene-4-event-date">${event.date}</time>
                  </div>

                  ${event.time ? `
                    <div class="scene-4-event-detail-row scene-4-event-time-row">
                      <svg class="scene-4-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span class="scene-4-event-time">${event.time.display}</span>
                    </div>
                  ` : ''}

                  <div class="scene-4-event-detail-row">
                    <svg class="scene-4-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span class="scene-4-event-venue">${event.venue}</span>
                  </div>

                  <!-- Actions: View Location & Save the Date -->
                  <div class="scene-4-card-actions">
                    <a
                      href="${event.mapUrl}"
                      data-url="${event.mapUrl}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="scene-4-action-btn scene-4-map-btn"
                      aria-label="${event.mapLabel}"
                    >
                      <svg class="scene-4-btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span>Location</span>
                      <span class="scene-4-btn-arrow" aria-hidden="true">↗</span>
                    </a>

                    <!-- Save the Date Dropdown -->
                    <div class="scene-4-cal-dropdown">
                      <button
                        type="button"
                        id="save-date-btn-${event.id}"
                        class="scene-4-action-btn scene-4-cal-btn"
                        aria-haspopup="true"
                        aria-expanded="false"
                        aria-controls="cal-menu-${event.id}"
                        aria-label="Save ${event.name} date to your calendar"
                        data-event-id="${event.id}"
                      >
                        <svg class="scene-4-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                          <path d="M12 14v4"></path>
                          <path d="M10 16h4"></path>
                        </svg>
                        <span>Save Date</span>
                        <span class="scene-4-cal-caret" aria-hidden="true">▾</span>
                      </button>

                      <div
                        id="cal-menu-${event.id}"
                        class="scene-4-cal-menu"
                        role="menu"
                        aria-label="Calendar options for ${event.name}"
                      >
                        <a
                          href="${getGoogleCalendarUrl(event)}"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="scene-4-cal-item scene-4-cal-item-link"
                          role="menuitem"
                          aria-label="Add ${event.name} to Google Calendar (opens in new tab)"
                        >
                          <span class="scene-4-cal-item-icon" aria-hidden="true">📅</span>
                          <span class="scene-4-cal-item-text">
                            <strong>Google Calendar</strong>
                            <small>Open in new tab</small>
                          </span>
                          <span class="scene-4-cal-item-arrow" aria-hidden="true">↗</span>
                        </a>

                        <button
                          type="button"
                          class="scene-4-cal-item scene-4-cal-item-btn"
                          role="menuitem"
                          data-action="download-ics"
                          data-event-id="${event.id}"
                          aria-label="Download calendar file (.ics) for Apple Calendar, Outlook, and other apps"
                        >
                          <span class="scene-4-cal-item-icon" aria-hidden="true">📥</span>
                          <span class="scene-4-cal-item-text">
                            <strong>Download .ICS</strong>
                            <small>Apple, Outlook, etc.</small>
                          </span>
                        </button>
                      </div>
                    </div>

                  </div>

                  <!-- Decorative Antique-Gold Corner Accents -->
                  <div class="scene-4-corner scene-4-corner--tl" aria-hidden="true"></div>
                  <div class="scene-4-corner scene-4-corner--tr" aria-hidden="true"></div>
                  <div class="scene-4-corner scene-4-corner--bl" aria-hidden="true"></div>
                  <div class="scene-4-corner scene-4-corner--br" aria-hidden="true"></div>
                </div>
              </article>
            `
  ).join('')}
          </main>

          <!-- D. Footer Action & Scene 5 Handoff -->
          <footer class="scene-4-cta-wrap scene-4-anim-item scene-4-anim-5">
            <button
              id="scene-4-next-btn"
              class="scene-4-cta-btn"
              type="button"
              aria-label="Proceed to Family Details"
            >
              <span>Meet the Families</span>
              <span class="scene-4-cta-arrow" aria-hidden="true">▾</span>
            </button>
            <span class="scene-4-scroll-hint" aria-hidden="true">Scroll down or click to continue</span>
          </footer>

        </div>
      </div>

      <!-- Incoming Transition Light Bloom for Scene 3 Continuity -->
      <div class="scene-4-incoming-bloom" aria-hidden="true"></div>

    </section>
  `;
}

// ─── Scene 4 Lifecycle & Interaction ─────────────────────────────────────────

export function initScene4() {
  clearAllTimers();
  isTransitioning = false;

  const scene4 = document.getElementById('scene-4');
  if (!scene4) return;

  scene4.classList.remove('phase-a', 'phase-b', 'phase-c', 'phase-d', 'phase-settled');
  scene4.classList.add('active');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── GSAP Scoped Entrance Timeline & Parallax ─────────────────────────────
  if (gsapCtx) {
    gsapCtx.revert();
    gsapCtx = null;
  }

  gsapCtx = gsap.context(() => {
    if (prefersReducedMotion) {
      gsap.set(
        ['.scene-4-bg-img', '.scene-4-pillar', '.scene-4-mandap-img', '.scene-4-anim-item', '.scene-4-event-card'],
        { opacity: 1, y: 0, x: 0, scale: 1 }
      );
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.fromTo('.scene-4-bg-img', { scale: 1.04, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 1.1 }, 0)
      .fromTo('.scene-4-pillar--left', { x: -25, opacity: 0 }, { x: 0, opacity: 0.78, duration: 0.9 }, 0.15)
      .fromTo('.scene-4-pillar--right', { x: 25, opacity: 0 }, { x: 0, opacity: 0.78, duration: 0.9 }, 0.15)
      .fromTo('.scene-4-mandap-img', { y: 35, opacity: 0, scale: 0.96 }, { y: 0, opacity: 0.88, scale: 1, duration: 1 }, 0.2)
      .fromTo('.scene-4-header', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, 0.35)
      .fromTo('.scene-4-countdown-card', { y: 22, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.7 }, 0.48)
      .fromTo('.scene-4-event-card', { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.14, duration: 0.75 }, 0.6)
      .fromTo('.scene-4-cta-wrap', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.9);

    // Subtle scroll parallax for the background architectural layers
    const scrollContainer = scene4.querySelector('.scene-4-scroll-container');
    if (scrollContainer) {
      ScrollTrigger.create({
        trigger: '.scene-4-content-wrap',
        scroller: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          gsap.to('.scene-4-mandap-img', { y: self.progress * 38, overwrite: 'auto', duration: 0.15 });
          gsap.to('.scene-4-pillar', { y: self.progress * 20, overwrite: 'auto', duration: 0.15 });
        },
      });
    }
  }, scene4);

  // Start live wedding countdown
  startCountdown();

  // Dissolve incoming golden bloom smoothly
  const bloom = scene4.querySelector('.scene-4-incoming-bloom');
  if (bloom) {
    addSafeTimer(() => {
      bloom.classList.add('dissolved');
    }, 60);
  }

  // Initialize ambient particle canvas
  const canvas = document.getElementById('scene4-particles');
  if (canvas) {
    particleCtx = resizeCanvas(canvas);
    initParticles(canvas);

    const animationLoop = () => {
      if (particleCtx && canvas) {
        updateParticles(canvas);
        drawParticles(particleCtx, canvas);
      }
      particleAnimFrame = requestAnimationFrame(animationLoop);
    };

    if (!prefersReducedMotion) {
      animationLoop();
    }

    resizeHandler = () => {
      if (canvas) {
        particleCtx = resizeCanvas(canvas);
        initParticles(canvas);
      }
    };
    window.addEventListener('resize', resizeHandler, { passive: true });
  }

  // ─── Save the Date Dropdown and Download Interactivity ─────────────────────
  const closeAllCalMenus = () => {
    const openMenus = scene4.querySelectorAll('.scene-4-cal-dropdown.open');
    openMenus.forEach((drop) => {
      drop.classList.remove('open');
      const btn = drop.querySelector('.scene-4-cal-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  };

  const calButtons = scene4.querySelectorAll('.scene-4-cal-btn');
  calButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = btn.closest('.scene-4-cal-dropdown');
      if (!dropdown) return;

      const isAlreadyOpen = dropdown.classList.contains('open');
      closeAllCalMenus();

      if (!isAlreadyOpen) {
        dropdown.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Handle .ICS file downloads
  const icsDownloadButtons = scene4.querySelectorAll('[data-action="download-ics"]');
  icsDownloadButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const eventId = btn.getAttribute('data-event-id');
      const eventData = WEDDING_EVENTS.find((ev) => ev.id === eventId);
      if (eventData) {
        downloadIcsFile(eventData);
      }
      closeAllCalMenus();
    });
  });

  // Close menus on outside click & Escape key
  activeCalDocClickHandler = (e) => {
    if (!e.target.closest('.scene-4-cal-dropdown')) {
      closeAllCalMenus();
    }
  };
  activeCalDocKeyHandler = (e) => {
    if (e.key === 'Escape') {
      closeAllCalMenus();
    }
  };
  document.addEventListener('click', activeCalDocClickHandler);
  document.addEventListener('keydown', activeCalDocKeyHandler);

  // ─── Google Maps Link Click & Keydown Handlers ─────────────────────────────
  const mapButtons = scene4.querySelectorAll('.scene-4-map-btn');
  mapButtons.forEach((btn) => {
    const handleOpenMap = (e) => {
      e.stopPropagation();
      const url = btn.getAttribute('data-url') || btn.getAttribute('href');
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      e.preventDefault();
    };
    btn.addEventListener('click', handleOpenMap);
  });

  // ─── Scene 5 Navigation Handoff ───────────────────────────────────────────
  const proceedToScene5 = () => {
    if (isTransitioning) return;
    isTransitioning = true;
    if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
      window.sceneManager.goToScene(5);
    } else {
      window.dispatchEvent(new CustomEvent('scene:navigate', { detail: { scene: 5 } }));
    }
    addSafeTimer(() => {
      isTransitioning = false;
    }, 1500);
  };

  const nextBtn = document.getElementById('scene-4-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', proceedToScene5);
    nextBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        proceedToScene5();
      }
    });
  }

  // ─── Natural Scroll & Touch Transition (Down -> Scene 5, Up -> Scene 3) ───
  let wheelTimer = null;
  const wheelHandler = (e) => {
    if (isTransitioning) return;
    const scrollContainer = scene4.querySelector('.scene-4-scroll-container');
    const isAtBottom = scrollContainer
      ? scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 25
      : true;
    const isAtTop = scrollContainer ? scrollContainer.scrollTop <= 10 : true;

    if (e.deltaY > 35 && isAtBottom) {
      if (!wheelTimer) {
        wheelTimer = setTimeout(() => {
          if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
            window.sceneManager.goToScene(5);
          } else {
            window.dispatchEvent(new CustomEvent('scene:navigate', { detail: { scene: 5 } }));
          }
          wheelTimer = null;
        }, 150);
      }
    } else if (e.deltaY < -35 && isAtTop) {
      if (!wheelTimer) {
        wheelTimer = setTimeout(() => {
          if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
            window.sceneManager.goToScene(3);
          } else {
            window.dispatchEvent(new CustomEvent('scene:navigate', { detail: { scene: 3 } }));
          }
          wheelTimer = null;
        }, 150);
      }
    }
  };
  window.addEventListener('wheel', wheelHandler, { passive: true });

  let touchStartY = 0;
  const touchStartHandler = (e) => {
    if (e.touches && e.touches.length > 0) touchStartY = e.touches[0].clientY;
  };
  const touchEndHandler = (e) => {
    if (e.changedTouches && e.changedTouches.length > 0 && !isTransitioning) {
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const scrollContainer = scene4.querySelector('.scene-4-scroll-container');
      const isAtBottom = scrollContainer
        ? scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 25
        : true;
      const isAtTop = scrollContainer ? scrollContainer.scrollTop <= 10 : true;

      if (deltaY > 60 && isAtBottom) {
        if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
          window.sceneManager.goToScene(5);
        } else {
          window.dispatchEvent(new CustomEvent('scene:navigate', { detail: { scene: 5 } }));
        }
      } else if (deltaY < -60 && isAtTop) {
        if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
          window.sceneManager.goToScene(3);
        } else {
          window.dispatchEvent(new CustomEvent('scene:navigate', { detail: { scene: 3 } }));
        }
      }
    }
  };
  window.addEventListener('touchstart', touchStartHandler, { passive: true });
  window.addEventListener('touchend', touchEndHandler, { passive: true });

  activeTimers.push(() => {
    window.removeEventListener('wheel', wheelHandler);
    window.removeEventListener('touchstart', touchStartHandler);
    window.removeEventListener('touchend', touchEndHandler);
  });
}

export function destroyScene4() {
  clearAllTimers();
  cancelAnimationFrame(particleAnimFrame);
  ambientParticles = [];
  isTransitioning = false;

  if (gsapCtx) {
    gsapCtx.revert();
    gsapCtx = null;
  }

  if (activeCalDocClickHandler) {
    document.removeEventListener('click', activeCalDocClickHandler);
    activeCalDocClickHandler = null;
  }
  if (activeCalDocKeyHandler) {
    document.removeEventListener('keydown', activeCalDocKeyHandler);
    activeCalDocKeyHandler = null;
  }

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }

  const scene4 = document.getElementById('scene-4');
  if (scene4) {
    scene4.classList.remove('phase-a', 'phase-b', 'phase-c', 'phase-d', 'phase-settled');
  }
}
