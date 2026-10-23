/**
 * Scene 4 — Wedding Events & Countdown
 *
 * Cinematic Indian Wedding Celebration & Itinerary
 * Layered Architecture:
 * Layer 1: Palace Garden Sunset Background (s4_bg_desktop.png)
 * Layer 2: Decorative Floral Framing Pillars (s4_flower_pillars_alpha.png)
 * Layer 3: Grand Carved Marble Mandap with Sacred Fire & Lit Diyas (s4_mandap_01.png)
 * Layer 4: Ambient Floating Rose Petals & Golden Sparkles Canvas
 * Layer 5: Content Interface — Title, Live Countdown, 3 Event Cards & Navigation CTA
 * Layer 6: Incoming Light Bloom for Scene 3 Continuity
 */

import './scene4.css';

/**
 * Verified Wedding Events Data Source (Source of Truth)
 * Exactly three events: Tilak, Matkor, Shaadi
 */
export const WEDDING_EVENTS = [
  {
    id: 'tilak',
    badge: 'Auspicious Beginning',
    name: 'Tilak',
    date: '27 November 2026',
    dateISO: '2026-11-27',
    venue: 'Swarna Bhobon',
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
    venue: 'Sethjee’s Banquet',
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

// Stored listeners for explicit cleanup
let resizeHandler = null;

function addSafeTimer(fn, delay) {
  const id = window.setTimeout(fn, delay);
  activeTimers.push(id);
  return id;
}

function clearAllTimers() {
  activeTimers.forEach((item) => {
    if (typeof item === 'function') {
      try { item(); } catch (_) {}
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
  const count = window.innerWidth < 640 ? 30 : 55;
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
      ctx.shadowColor = 'rgba(245, 207, 104, 0.8)';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
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
        <img
          src="/assets/scene-4/s4_bg_desktop.png"
          alt=""
          class="scene-4-bg-img"
          draggable="false"
        />
        <div class="scene-4-bg-vignette"></div>
      </div>

      <!-- Layer 2: Decorative Floral Framing Pillars (Outer Framing) -->
      <div class="scene-4-pillars-layer" aria-hidden="true">
        <div class="scene-4-pillar scene-4-pillar--left">
          <img src="/assets/scene-4/s4_flower_pillars_alpha.png" alt="" draggable="false" />
        </div>
        <div class="scene-4-pillar scene-4-pillar--right">
          <img src="/assets/scene-4/s4_flower_pillars_alpha.png" alt="" draggable="false" />
        </div>
      </div>

      <!-- Layer 3: Grand Carved Marble Mandap Centerpiece -->
      <div class="scene-4-mandap-layer" aria-hidden="true">
        <img
          src="/assets/scene-4/s4_mandap_01.png"
          alt=""
          class="scene-4-mandap-img"
          draggable="false"
        />
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

          <!-- C. The Three Wedding Event Cards -->
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

                  <div class="scene-4-event-detail-row">
                    <svg class="scene-4-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span class="scene-4-event-venue">${event.venue}</span>
                  </div>

                  <div class="scene-4-card-action">
                    <a
                      href="${event.mapUrl}"
                      data-url="${event.mapUrl}"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="scene-4-map-btn"
                      aria-label="${event.mapLabel}"
                    >
                      <svg class="scene-4-map-pin-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span>View Location</span>
                      <span class="scene-4-map-arrow" aria-hidden="true">↗</span>
                    </a>
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

  if (prefersReducedMotion) {
    scene4.classList.add('phase-a', 'phase-b', 'phase-c', 'phase-d', 'phase-settled');
  } else {
    // Phase A: Background reveal (0-200ms)
    addSafeTimer(() => {
      scene4.classList.add('phase-a');
    }, 60);

    // Phase B: Architectural mandap & pillars reveal (300ms)
    addSafeTimer(() => {
      scene4.classList.add('phase-b');
    }, 300);

    // Phase C: Coordinated event cards sequence (600ms)
    addSafeTimer(() => {
      scene4.classList.add('phase-c');
    }, 600);

    // Phase D: Countdown & ambient details (850ms)
    addSafeTimer(() => {
      scene4.classList.add('phase-d');
    }, 850);

    // Phase E: Settled stable scene (1300ms)
    addSafeTimer(() => {
      scene4.classList.add('phase-settled');
    }, 1300);
  }

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

  // ─── Dedicated Google Maps Link Click & Keydown Handlers ─────────────────
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

  // ─── Natural Scroll & Touch Transition to Scene 5 ─────────────────────────
  let wheelTimer = null;
  const wheelHandler = (e) => {
    if (e.deltaY > 35 && !isTransitioning) {
      const scrollContainer = scene4.querySelector('.scene-4-scroll-container');
      const isAtBottom = scrollContainer
        ? scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 25
        : true;

      if (isAtBottom && !wheelTimer) {
        wheelTimer = setTimeout(() => {
          if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
            window.sceneManager.goToScene(5);
          } else {
            window.dispatchEvent(new CustomEvent('scene:navigate', { detail: { scene: 5 } }));
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
      if (deltaY > 60 && isAtBottom) {
        if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
          window.sceneManager.goToScene(5);
        } else {
          window.dispatchEvent(new CustomEvent('scene:navigate', { detail: { scene: 5 } }));
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

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }

  const scene4 = document.getElementById('scene-4');
  if (scene4) {
    scene4.classList.remove('phase-a', 'phase-b', 'phase-c', 'phase-d', 'phase-settled');
  }
}
