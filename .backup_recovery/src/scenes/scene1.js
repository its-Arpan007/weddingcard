/**
 * Scene 1 — Royal Envelope Opening Experience & Wedding Title Reveal
 *
 * Storytelling Progression:
 * 1. Royal sealed envelope on sunset palace lake
 * 2. User click / tap / keyboard triggers envelope opening:
 *    - Wax seal dissolve
 *    - Flap open reveal with 1:1 hinge alignment
 *    - Golden inner glow radiating from inside
 *    - Restrained particle burst of golden sparkles & rose petals
 * 3. Intentional Wedding Title Screen:
 *    - YOU'RE INVITED
 *    - THE GRAND WEDDING CELEBRATION
 *    - As two hearts unite in a beautiful journey of love and togetherness
 *    (Comfortable 3.5s reading window)
 * 4. Coordinated golden-light transition into Scene 2 (Lord Ganesha reveal)
 */

import './scene1.css';

/** @type {boolean} */
let isAnimating = false;

/** @type {boolean} */
let hasOpened = false;

/** @type {number[]} */
let activeTimers = [];

/** @type {CanvasRenderingContext2D | null} */
let particleCtx = null;

/** @type {CanvasRenderingContext2D | null} */
let burstCtx = null;

/** @type {number} */
let particleAnimFrame = 0;

/** @type {Array<Object>} */
let ambientParticles = [];

/** @type {Array<Object>} */
let burstParticles = [];

function addSafeTimer(fn, delay) {
  const id = window.setTimeout(fn, delay);
  activeTimers.push(id);
  return id;
}

function clearAllTimers() {
  activeTimers.forEach((id) => clearTimeout(id));
  activeTimers = [];
}

// ─── Ambient Particle System ───────────────────────────────

function createAmbientParticle(canvas) {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2.2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.25,
    speedY: -(Math.random() * 0.35 + 0.1),
    opacity: Math.random() * 0.45 + 0.15,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.02 + 0.005,
  };
}

function initAmbientParticles(canvas) {
  const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 16000));
  ambientParticles = [];
  for (let i = 0; i < count; i++) {
    ambientParticles.push(createAmbientParticle(canvas));
  }
}

function updateAmbientParticles(canvas) {
  for (const p of ambientParticles) {
    p.x += p.speedX;
    p.y += p.speedY;
    p.pulse += p.pulseSpeed;

    // Wrap around smoothly
    if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
    if (p.x < -10) p.x = canvas.width + 10;
    if (p.x > canvas.width + 10) p.x = -10;
  }
}

function drawAmbientParticles(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of ambientParticles) {
    const alpha = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245, 207, 104, ${alpha})`;
    ctx.fill();

    // Outer aura
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245, 207, 104, ${alpha * 0.12})`;
    ctx.fill();
  }
}

// ─── Restrained Burst Particle System ───────────────────────

function createBurstParticle(cx, cy) {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 3.5 + 1.2;
  const isPetal = Math.random() > 0.65;
  return {
    x: cx,
    y: cy,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 1.2,
    size: isPetal ? Math.random() * 5 + 2.5 : Math.random() * 2.8 + 1,
    opacity: 1,
    decay: Math.random() * 0.009 + 0.006,
    gravity: 0.035,
    isPetal,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.06,
    color: isPetal
      ? `hsl(${350 + Math.random() * 15}, ${70 + Math.random() * 15}%, ${45 + Math.random() * 15}%)`
      : `rgba(245, ${200 + Math.random() * 45}, ${90 + Math.random() * 40}, 0.95)`,
  };
}

function triggerBurst(cx, cy, count = 35) {
  for (let i = 0; i < count; i++) {
    burstParticles.push(createBurstParticle(cx, cy));
  }
}

function updateBurstParticles() {
  for (let i = burstParticles.length - 1; i >= 0; i--) {
    const p = burstParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= 0.99;
    p.opacity -= p.decay;
    p.rotation += p.rotSpeed;
    if (p.opacity <= 0) burstParticles.splice(i, 1);
  }
}

function drawBurstParticles(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of burstParticles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.opacity);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    if (p.isPetal) {
      // Petal shape
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    } else {
      // Golden sparkle
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      // Glow
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 207, 104, ${p.opacity * 0.25})`;
      ctx.fill();
    }
    ctx.restore();
  }
}

// ─── Animation Loop ────────────────────────────────────────

function animationLoop() {
  const particleCanvas = document.getElementById('scene1-particles');
  const burstCanvas = document.getElementById('scene1-burst');

  if (!particleCanvas || !burstCanvas) return;

  if (particleCtx) {
    updateAmbientParticles(particleCanvas);
    drawAmbientParticles(particleCtx, particleCanvas);
  }

  if (burstCtx) {
    updateBurstParticles();
    drawBurstParticles(burstCtx, burstCanvas);
  }

  particleAnimFrame = requestAnimationFrame(animationLoop);
}

function resizeCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}

// ─── Envelope Interaction & Storytelling Transition ────────

function handleEnvelopeOpen(e) {
  // Prevent duplicate activation
  if (isAnimating || hasOpened) return;

  // Handle keyboard: only Enter or Space
  if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
  if (e.type === 'keydown') e.preventDefault();

  isAnimating = true;
  hasOpened = true;

  const wrap = document.querySelector('.scene-1-envelope-wrap');
  if (!wrap) return;

  wrap.classList.add('opening');

  // Hide CTA button smoothly
  const cta = document.querySelector('.scene-1-cta');
  if (cta) {
    cta.classList.add('hidden');
  }

  // Trigger restrained bursts from the wax seal center
  const burstCanvas = document.getElementById('scene1-burst');
  if (burstCanvas) {
    const rect = wrap.getBoundingClientRect();
    const canvasRect = burstCanvas.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - canvasRect.left;
    const cy = rect.top + rect.height * 0.642 - canvasRect.top;

    addSafeTimer(() => triggerBurst(cx, cy, 36), 550);
    addSafeTimer(() => triggerBurst(cx, cy - 35, 24), 1050);
  }

  // Phase 2: After user admires the opened envelope card (~2.2s),
  // transition smoothly into the intentional Wedding Title Screen
  addSafeTimer(() => {
    const envelopeStage = document.getElementById('scene-1-envelope-stage');
    const titleStage = document.getElementById('wedding-title-stage');

    if (envelopeStage) {
      envelopeStage.classList.add('fading');
    }

    if (titleStage) {
      titleStage.setAttribute('aria-hidden', 'false');
      titleStage.classList.add('active');
    }

    // Phase 3: Display Wedding Title Screen comfortably for ~3.6 seconds,
    // then execute coordinated soft golden bloom transition into Scene 2 (Lord Ganesha reveal)
    addSafeTimer(() => {
      // 1. Gently fade out the title card text into the light (preserves background luminosity to eliminate dark gaps)
      const titleCard = titleStage ? titleStage.querySelector('.wedding-title-card') : null;
      if (titleCard) {
        titleCard.classList.add('fading-out');
      }

      if (titleStage) {
        titleStage.classList.add('transitioning-out');
      }

      // 2. Expand warm soft golden light bloom
      const flare = document.getElementById('scene1-golden-flare');
      if (flare) {
        flare.classList.add('radiate');
      }

      // 3. Coordinate Ganesh Ji reveal immediately with the golden light
      // so Lord Ganesha emerges directly during the golden light bloom without any intermediate empty screen
      addSafeTimer(() => {
        if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
          window.sceneManager.goToScene(2);
        } else {
          window.dispatchEvent(new CustomEvent('scene:navigate', { detail: { scene: 2 } }));
        }
      }, 35);
    }, 3600);
  }, 2200);
}

// ─── Scene Setup ───────────────────────────────────────────

export function createScene1() {
  return `
    <section id="scene-1" class="scene scene-1 active" aria-label="Wedding Invitation — Scene 1: Open the Envelope">

      <!-- ==============================================
           STAGE 1: Royal Envelope Opening Stage
           ============================================== -->
      <div id="scene-1-envelope-stage" class="scene-1-envelope-stage">

        <!-- Background layers -->
        <div class="scene-1-bg">
          <div class="scene-1-bg__palace" role="img" aria-label="Sunset palace backdrop"></div>
          <div class="scene-1-bg__overlay"></div>
          <div class="scene-1-bg__vignette"></div>
        </div>

        <!-- Rose petals overlay (refined: foreground blobs softened) -->
        <div class="scene-1-petals-overlay" aria-hidden="true">
          <img src="/assets/scene-1/rose-petals.png" alt="" loading="eager" />
        </div>

        <!-- Ambient golden stardust canvas -->
        <canvas id="scene1-particles" class="scene-1-particles" aria-hidden="true"></canvas>

        <!-- Burst particles canvas -->
        <canvas id="scene1-burst" class="scene-1-burst" aria-hidden="true"></canvas>

        <!-- Main content: Title + Royal Envelope + CTA -->
        <div class="scene-1-content">

          <h1 class="scene-1-title">A Special Invitation Awaits</h1>

          <div
            class="scene-1-envelope-wrap"
            role="button"
            tabindex="0"
            aria-label="Click or press Enter to open the wedding invitation envelope"
            id="envelope-button"
          >
            <div class="scene-1-envelope">
              <img
                class="scene-1-envelope__closed"
                src="/assets/scene-1/envelope-closed.png"
                alt="Royal maroon and gold wedding envelope with wax seal"
                loading="eager"
                draggable="false"
              />
              <img
                class="scene-1-envelope__opened"
                src="/assets/scene-1/envelope-opened.png"
                alt="Opened wedding envelope revealing the gold-embossed card"
                loading="eager"
                draggable="false"
              />
              <div class="scene-1-seal-glow" aria-hidden="true"></div>
              <div class="scene-1-inner-glow" aria-hidden="true"></div>
            </div>
          </div>

          <p class="scene-1-cta" aria-live="polite">Click to Open</p>

        </div>

        <!-- Diya floral frame at base -->
        <div class="scene-1-diya-frame" aria-hidden="true">
          <img src="/assets/scene-1/diya-floral-frame.png" alt="" loading="eager" draggable="false" />
        </div>

      </div>

      <!-- ==============================================
           STAGE 2: Intentional Wedding Title Screen
           ============================================== -->
      <div id="wedding-title-stage" class="scene-1-title-stage" aria-hidden="true">
        <div class="title-stage-bg"></div>
        <div class="title-stage-rays" aria-hidden="true"></div>

        <div class="wedding-title-card">
          <!-- Eyebrow: YOU'RE INVITED -->
          <div class="wedding-title-badge">
            <span class="wedding-title-sparkle" aria-hidden="true">✦</span>
            <span class="wedding-title-eyebrow">YOU'RE INVITED</span>
            <span class="wedding-title-sparkle" aria-hidden="true">✦</span>
          </div>

          <!-- Elegant Gold Filigree Divider -->
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

          <!-- Main Celebration Heading: THE GRAND WEDDING CELEBRATION -->
          <h2 class="wedding-title-main">THE GRAND WEDDING CELEBRATION</h2>

          <!-- Supporting Sentence -->
          <p class="wedding-title-sub">
            As two hearts unite in a beautiful journey of love and togetherness
          </p>

          <!-- Lotus Flourish -->
          <div class="wedding-title-lotus" aria-hidden="true">🪷</div>
        </div>
      </div>

      <!-- Coordinated Golden Light Transition Flare -->
      <div id="scene1-golden-flare" class="scene-1-golden-flare" aria-hidden="true"></div>

    </section>
  `;
}

export function initScene1() {
  // Clear any stale timers
  clearAllTimers();

  // Reset state flags
  isAnimating = false;
  hasOpened = false;

  // Setup particle canvases
  const particleCanvas = document.getElementById('scene1-particles');
  const burstCanvas = document.getElementById('scene1-burst');

  if (particleCanvas) {
    particleCtx = resizeCanvas(particleCanvas);
    initAmbientParticles(particleCanvas);
  }

  if (burstCanvas) {
    burstCtx = resizeCanvas(burstCanvas);
  }

  // Start animation loop (respects prefers-reduced-motion)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    animationLoop();
  }

  // Bind envelope interaction
  const envelopeBtn = document.getElementById('envelope-button');
  if (envelopeBtn) {
    envelopeBtn.addEventListener('click', handleEnvelopeOpen);
    envelopeBtn.addEventListener('keydown', handleEnvelopeOpen);
  }

  // Handle resize safely with debounce
  const handleResize = () => {
    if (particleCanvas) {
      particleCtx = resizeCanvas(particleCanvas);
      initAmbientParticles(particleCanvas);
    }
    if (burstCanvas) {
      burstCtx = resizeCanvas(burstCanvas);
    }
  };

  let resizeTimeout;
  const onResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 200);
  };
  window.addEventListener('resize', onResize);

  // Make CTA blink after entrance animations complete
  addSafeTimer(() => {
    const cta = document.querySelector('.scene-1-cta');
    if (cta && !hasOpened) cta.classList.add('visible');
  }, 3500);
}

export function destroyScene1() {
  clearAllTimers();
  cancelAnimationFrame(particleAnimFrame);
  ambientParticles = [];
  burstParticles = [];
  isAnimating = false;
  hasOpened = false;
}
