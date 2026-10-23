/**
 * Scene 6 — The Grand Baraat Finale
 *
 * Cinematic Indian Wedding Finale Experience:
 * - Phase A: Grand Baraat Arrival (Palace courtyard + moving baraat procession with horse & dhol)
 * - Phase B: Festive Celebration (Floating rose petals & golden spark fireworks)
 * - Phase C: Couple Reveal (Intimate portrait of Sneha Sinha & Dipak Prasad in regal attire)
 * - Phase D: Varmala Moment (Sacred varmala exchange under the mandap with cheering family)
 * - Phase E: Grand Finale & Closing Message (Night fireworks, royal closing card, stable ending)
 */

import './scene6.css';

/**
 * Storyboard Milestone Definitions
 */
export const FINALE_STAGES = [
  {
    id: 'baraat',
    tag: '॥ शुभ बारात आगमन ॥',
    title: 'The Grand Baraat Arrival',
    subtitle: 'With joyous dhol beats and dancing hearts, the groom arrives in royal splendor',
    bg: '/assets/scene-6/s6_palace_baraat_bg.jpg',
    overlay: '/assets/scene-6/s6_baraat_procession.png',
    duration: 4800,
  },
  {
    id: 'couple',
    tag: '॥ शुभ संगम ॥',
    title: 'The Royal Couple',
    subtitle: 'Two souls destined together, united in timeless love and eternal devotion',
    bg: '/assets/scene-6/s6_couple_portrait.jpg',
    duration: 4800,
  },
  {
    id: 'varmala',
    tag: '॥ वरमाला महोत्सव ॥',
    title: 'The Sacred Varmala',
    subtitle: 'Exchanging sacred vows under the auspicious mandap amidst joyous family blessings',
    bg: '/assets/scene-6/s6_varmala_mandap.jpg',
    duration: 5200,
  },
  {
    id: 'finale',
    tag: '॥ नवजीवन मङ्गलम् ॥',
    title: 'Grand Wedding Finale',
    subtitle: 'Under glittering fireworks and divine blessings, our eternal journey begins',
    bg: '/assets/scene-6/s6_grand_fireworks.jpg',
    duration: 0, // Settles permanently
  },
];

/** @type {number[]} */
let activeTimers = [];

/** @type {number} */
let particleAnimFrame = 0;

/** @type {Array<Object>} */
let ambientParticles = [];

/** @type {CanvasRenderingContext2D | null} */
let particleCtx = null;

/** @type {number} */
let currentStageIndex = 0;

/** @type {number | null} */
let stageAutoTimer = null;

// Stored handlers for clean teardown
let resizeHandler = null;
let keydownHandler = null;

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

  if (stageAutoTimer) {
    clearTimeout(stageAutoTimer);
    stageAutoTimer = null;
  }
}

// ─── Ambient Particle Engine (Fireworks Embers & Drifting Rose Petals) ───────

function createParticle(canvas) {
  const isPetal = Math.random() > 0.65;
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: isPetal ? Math.random() * 4.5 + 2.5 : Math.random() * 2.4 + 0.8,
    speedX: (Math.random() - 0.5) * (isPetal ? 0.45 : 0.3),
    speedY: isPetal ? Math.random() * 0.5 + 0.25 : -(Math.random() * 0.35 + 0.12),
    opacity: Math.random() * 0.55 + 0.25,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.025 + 0.01,
    isPetal,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.025,
    color: isPetal
      ? `rgba(${220 + Math.floor(Math.random() * 30)}, ${30 + Math.floor(Math.random() * 25)}, ${45 + Math.floor(Math.random() * 20)}, `
      : `rgba(250, 214, 115, `,
  };
}

function initParticles(canvas) {
  ambientParticles = [];
  const count = window.innerWidth < 640 ? 35 : 65;
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
      ctx.ellipse(0, 0, p.size * 1.35, p.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = `${p.color}${alpha})`;
      ctx.shadowColor = 'rgba(250, 214, 115, 0.85)';
      ctx.shadowBlur = 5;
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

// ─── Stage Switching Logic ───────────────────────────────────────────────────

function setStage(stageIndex, userTriggered = false) {
  if (stageIndex < 0 || stageIndex >= FINALE_STAGES.length) return;

  const scene6 = document.getElementById('scene-6');
  if (!scene6) return;

  currentStageIndex = stageIndex;
  const currentStage = FINALE_STAGES[stageIndex];

  // Update scene class for CSS transitions
  scene6.setAttribute('data-stage', currentStage.id);

  // Update milestone navigation pills
  const pills = scene6.querySelectorAll('.scene-6-milestone-pill');
  pills.forEach((pill, idx) => {
    if (idx === stageIndex) {
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
    } else {
      pill.classList.remove('active');
      pill.setAttribute('aria-selected', 'false');
    }
  });

  // Update stage banner text
  const tagEl = scene6.querySelector('.scene-6-stage-tag');
  const titleEl = scene6.querySelector('.scene-6-stage-title');
  const subtitleEl = scene6.querySelector('.scene-6-stage-subtitle');

  if (tagEl) tagEl.textContent = currentStage.tag;
  if (titleEl) titleEl.textContent = currentStage.title;
  if (subtitleEl) subtitleEl.textContent = currentStage.subtitle;

  // Toggle stage elements visibility
  const stageViews = scene6.querySelectorAll('.scene-6-stage-view');
  stageViews.forEach((view) => {
    const viewStage = view.getAttribute('data-view-stage');
    if (viewStage === currentStage.id) {
      view.classList.add('active');
      view.setAttribute('aria-hidden', 'false');
    } else {
      view.classList.remove('active');
      view.setAttribute('aria-hidden', 'true');
    }
  });

  // Handle auto-advancing timer
  if (stageAutoTimer) {
    clearTimeout(stageAutoTimer);
    stageAutoTimer = null;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && currentStage.duration > 0 && !userTriggered) {
    stageAutoTimer = setTimeout(() => {
      setStage(stageIndex + 1);
    }, currentStage.duration);
  }
}

// ─── HTML Template Creation ──────────────────────────────────────────────────

export function createScene6() {
  return `
    <section id="scene-6" class="scene scene-6" aria-label="Grand Baraat Finale and Closing Blessings" data-stage="baraat">

      <!-- Ambient Background Canvas for Sparkles & Floating Rose Petals -->
      <canvas id="scene6-particles" class="scene-6-particles" aria-hidden="true"></canvas>

      <!-- View 1: Grand Baraat Arrival (Palace BG + Transparent Procession Layer) -->
      <div class="scene-6-stage-view scene-6-view-baraat active" data-view-stage="baraat" aria-hidden="false">
        <div class="scene-6-bg-wrap">
          <img
            src="/assets/scene-6/s6_palace_baraat_bg.jpg"
            alt=""
            class="scene-6-bg-img"
            draggable="false"
          />
          <div class="scene-6-vignette"></div>
        </div>
        <!-- Parallax Procession Layer with Groom on Horse & Dholak Baraatis -->
        <div class="scene-6-procession-wrap" aria-hidden="true">
          <img
            src="/assets/scene-6/s6_baraat_procession.png"
            alt="The Grand Baraat procession with groom on white horse and dancing baraatis"
            class="scene-6-procession-img"
            draggable="false"
          />
        </div>
      </div>

      <!-- View 2: Royal Couple Reveal -->
      <div class="scene-6-stage-view scene-6-view-couple" data-view-stage="couple" aria-hidden="true">
        <div class="scene-6-couple-bg-wrap">
          <div class="scene-6-couple-glow" aria-hidden="true"></div>
          <div class="scene-6-couple-img-wrap">
            <img
              src="/assets/scene-6/s6_couple_portrait.jpg"
              alt="Sneha Sinha and Dipak Prasad in royal wedding attire"
              class="scene-6-couple-img"
              draggable="false"
            />
          </div>
          <div class="scene-6-couple-frame-accent" aria-hidden="true"></div>
        </div>
      </div>

      <!-- View 3: Sacred Varmala Ceremony in Mandap -->
      <div class="scene-6-stage-view scene-6-view-varmala" data-view-stage="varmala" aria-hidden="true">
        <div class="scene-6-bg-wrap">
          <img
            src="/assets/scene-6/s6_varmala_mandap.jpg"
            alt="Sacred varmala exchange ceremony under the grand floral mandap"
            class="scene-6-bg-img"
            draggable="false"
          />
          <div class="scene-6-vignette"></div>
        </div>
      </div>

      <!-- View 4: Grand Fireworks Finale with Closing Card -->
      <div class="scene-6-stage-view scene-6-view-finale" data-view-stage="finale" aria-hidden="true">
        <div class="scene-6-bg-wrap">
          <img
            src="/assets/scene-6/s6_grand_fireworks.jpg"
            alt=""
            class="scene-6-bg-img"
            draggable="false"
          />
          <div class="scene-6-vignette scene-6-vignette--finale"></div>
        </div>

        <!-- Stable Royal Closing Card (Real HTML Semantic Typography) -->
        <div class="scene-6-closing-wrap">
          <div class="scene-6-closing-card" role="region" aria-label="Closing Wedding Message">
            <div class="scene-6-closing-inner">
              <div class="scene-6-card-crest" aria-hidden="true">
                <span class="scene-6-crest-symbol">❦</span>
              </div>

              <h2 class="scene-6-closing-headline">Two Hearts. One Beautiful Journey.</h2>

              <div class="scene-6-gold-divider" aria-hidden="true">
                <span class="scene-6-divider-line"></span>
                <span class="scene-6-divider-star">✦</span>
                <span class="scene-6-divider-line"></span>
              </div>

              <p class="scene-6-closing-thanks">Thank you for being a part of our celebration.</p>
              <p class="scene-6-closing-blessing">With love and blessings,</p>

              <div class="scene-6-closing-couple">
                <span class="scene-6-couple-bride">Sneha Sinha</span>
                <span class="scene-6-couple-amp" aria-hidden="true">&amp;</span>
                <span class="scene-6-couple-groom">Dipak Prasad</span>
              </div>

              <div class="scene-6-closing-action">
                <button
                  id="scene-6-replay-btn"
                  class="scene-6-replay-btn"
                  type="button"
                  aria-label="Replay Wedding Invitation Journey from the start"
                >
                  <span class="scene-6-replay-icon" aria-hidden="true">↺</span>
                  <span>Replay Invitation</span>
                </button>
              </div>

              <!-- Antique Gold Corner Accents -->
              <div class="scene-6-corner scene-6-corner--tl" aria-hidden="true"></div>
              <div class="scene-6-corner scene-6-corner--tr" aria-hidden="true"></div>
              <div class="scene-6-corner scene-6-corner--bl" aria-hidden="true"></div>
              <div class="scene-6-corner scene-6-corner--br" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Royal Header & Milestone Navigation Bar -->
      <header class="scene-6-top-bar">
        <div class="scene-6-stage-header">
          <span class="scene-6-stage-tag">॥ शुभ बारात आगमन ॥</span>
          <h1 class="scene-6-stage-title">The Grand Baraat Arrival</h1>
          <p class="scene-6-stage-subtitle">
            With joyous dhol beats and dancing hearts, the groom arrives in royal splendor
          </p>
        </div>

        <!-- Milestone Navigator Tabs -->
        <nav class="scene-6-milestones-nav" role="tablist" aria-label="Celebration Milestones">
          <button
            class="scene-6-milestone-pill active"
            role="tab"
            aria-selected="true"
            data-index="0"
            type="button"
          >
            <span class="scene-6-pill-dot" aria-hidden="true"></span>
            <span>1. Baraat</span>
          </button>
          <button
            class="scene-6-milestone-pill"
            role="tab"
            aria-selected="false"
            data-index="1"
            type="button"
          >
            <span class="scene-6-pill-dot" aria-hidden="true"></span>
            <span>2. Couple</span>
          </button>
          <button
            class="scene-6-milestone-pill"
            role="tab"
            aria-selected="false"
            data-index="2"
            type="button"
          >
            <span class="scene-6-pill-dot" aria-hidden="true"></span>
            <span>3. Varmala</span>
          </button>
          <button
            class="scene-6-milestone-pill"
            role="tab"
            aria-selected="false"
            data-index="3"
            type="button"
          >
            <span class="scene-6-pill-dot" aria-hidden="true"></span>
            <span>4. Grand Finale</span>
          </button>
        </nav>
      </header>

      <!-- Side Navigation Chevrons for Mouse/Touch Browsing -->
      <button
        id="scene-6-prev-btn"
        class="scene-6-nav-arrow scene-6-nav-arrow--prev"
        type="button"
        aria-label="Previous milestone"
      >
        <span aria-hidden="true">‹</span>
      </button>

      <button
        id="scene-6-next-btn"
        class="scene-6-nav-arrow scene-6-nav-arrow--next"
        type="button"
        aria-label="Next milestone"
      >
        <span aria-hidden="true">›</span>
      </button>

      <!-- Incoming Transition Bloom from Scene 5 Continuity -->
      <div class="scene-6-incoming-bloom" aria-hidden="true"></div>

    </section>
  `;
}

// ─── Scene 6 Lifecycle & Interaction ─────────────────────────────────────────

export function initScene6() {
  clearAllTimers();

  const scene6 = document.getElementById('scene-6');
  if (!scene6) return;

  scene6.classList.add('active');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Dissolve incoming golden bloom smoothly
  const bloom = scene6.querySelector('.scene-6-incoming-bloom');
  if (bloom) {
    addSafeTimer(() => {
      bloom.classList.add('dissolved');
    }, 60);
  }

  // Initialize ambient particle canvas
  const canvas = document.getElementById('scene6-particles');
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

  // If reduced motion is requested, jump straight to the stable Grand Finale
  if (prefersReducedMotion) {
    setStage(3, true);
  } else {
    // Start at Stage 0 (Baraat) and begin automatic staged journey
    setStage(0, false);
  }

  // ─── Milestone Navigation Tab Listeners ────────────────────────────────────
  const pills = scene6.querySelectorAll('.scene-6-milestone-pill');
  pills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      const idx = parseInt(pill.getAttribute('data-index') || '0', 10);
      setStage(idx, true);
    });
  });

  // ─── Arrow Navigation Chevrons ───────────────────────────────────────────
  const prevBtn = document.getElementById('scene-6-prev-btn');
  const nextBtn = document.getElementById('scene-6-next-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const target = (currentStageIndex - 1 + FINALE_STAGES.length) % FINALE_STAGES.length;
      setStage(target, true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const target = (currentStageIndex + 1) % FINALE_STAGES.length;
      setStage(target, true);
    });
  }

  // ─── Keyboard Navigation (ArrowLeft / ArrowRight) ─────────────────────────
  keydownHandler = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      const target = Math.min(currentStageIndex + 1, FINALE_STAGES.length - 1);
      setStage(target, true);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      const target = Math.max(currentStageIndex - 1, 0);
      setStage(target, true);
    }
  };
  window.addEventListener('keydown', keydownHandler);

  // ─── Replay Button Handoff (Return to Scene 1) ────────────────────────────
  const replayBtn = document.getElementById('scene-6-replay-btn');
  if (replayBtn) {
    const handleReplay = (e) => {
      e.stopPropagation();
      if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
        window.sceneManager.goToScene(1);
      } else {
        window.dispatchEvent(new CustomEvent('scene:navigate', { detail: { scene: 1 } }));
      }
    };
    replayBtn.addEventListener('click', handleReplay);
    replayBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleReplay(e);
      }
    });
  }

  // ─── Mobile Swipe Gestures ───────────────────────────────────────────────
  let touchStartX = 0;
  const touchStartHandler = (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
    }
  };
  const touchEndHandler = (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      const deltaX = touchStartX - e.changedTouches[0].clientX;
      if (deltaX > 50) {
        // Swipe left -> Next stage
        const target = Math.min(currentStageIndex + 1, FINALE_STAGES.length - 1);
        setStage(target, true);
      } else if (deltaX < -50) {
        // Swipe right -> Prev stage
        const target = Math.max(currentStageIndex - 1, 0);
        setStage(target, true);
      }
    }
  };
  window.addEventListener('touchstart', touchStartHandler, { passive: true });
  window.addEventListener('touchend', touchEndHandler, { passive: true });

  activeTimers.push(() => {
    if (keydownHandler) window.removeEventListener('keydown', keydownHandler);
    window.removeEventListener('touchstart', touchStartHandler);
    window.removeEventListener('touchend', touchEndHandler);
  });
}

export function destroyScene6() {
  clearAllTimers();
  cancelAnimationFrame(particleAnimFrame);
  ambientParticles = [];

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
  if (keydownHandler) {
    window.removeEventListener('keydown', keydownHandler);
    keydownHandler = null;
  }

  const scene6 = document.getElementById('scene-6');
  if (scene6) {
    scene6.classList.remove('active');
  }
}
