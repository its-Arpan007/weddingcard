/**
 * Scene 2 — Divine Ganesh Ji Reveal
 *
 * Authentic 5-Layer Indian Temple Sanctuary Experience:
 * Layer 1: Palace Sunset Background (s2_background.png)
 * Layer 2: Ornate Temple Arch & Architectural Columns (s2_temple_arch.png)
 * Layer 3: Hanging Bells & Floral Garlands (s2_bells_garlands.png)
 * Layer 4: Central Focal Point — Lord Ganesha on Golden Pedestal (s2_ganesh_pedestal.png)
 * Layer 5: Foreground Tiered Marble Steps with Glowing Diyas (s2_diya_foreground.png)
 * Layer 6: Ambient Golden Stardust & Floating Rose Petals
 * Layer 7: Sacred Sanskrit Invocation & Devotional Blessing Plaque
 */

import './scene2.css';

/** @type {number[]} */
let activeTimers = [];

/** @type {number} */
let particleAnimFrame = 0;

/** @type {Array<Object>} */
let ambientParticles = [];

/** @type {CanvasRenderingContext2D | null} */
let particleCtx = null;

function addSafeTimer(fn, delay) {
  const id = window.setTimeout(fn, delay);
  activeTimers.push(id);
  return id;
}

function clearAllTimers() {
  activeTimers.forEach((id) => clearTimeout(id));
  activeTimers = [];
}

// ─── Ambient Golden Particles & Drifting Petals ──────────────────────────────

function createParticle(canvas) {
  const isPetal = Math.random() > 0.72;
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: isPetal ? Math.random() * 4 + 2.5 : Math.random() * 2 + 0.6,
    speedX: (Math.random() - 0.5) * (isPetal ? 0.35 : 0.2),
    speedY: isPetal ? Math.random() * 0.45 + 0.2 : -(Math.random() * 0.3 + 0.1),
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
  const count = Math.min(35, Math.floor((canvas.width * canvas.height) / 28000));
  ambientParticles = [];
  for (let i = 0; i < count; i++) {
    ambientParticles.push(createParticle(canvas));
  }
}

function updateParticles(canvas) {
  for (const p of ambientParticles) {
    p.x += p.speedX;
    p.y += p.speedY;
    p.pulse += p.pulseSpeed;
    if (p.isPetal) p.rotation += p.rotSpeed;

    // Wrap around smoothly
    if (p.y < -15) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
    if (p.y > canvas.height + 15) { p.y = -10; p.x = Math.random() * canvas.width; }
    if (p.x < -15) p.x = canvas.width + 10;
    if (p.x > canvas.width + 15) p.x = -10;
  }
}

function drawParticles(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of ambientParticles) {
    const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
    ctx.save();
    if (p.isPetal) {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 1.4, p.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${alpha})`;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${alpha})`;
      ctx.fill();

      // Soft glow aura
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${alpha * 0.15})`;
      ctx.fill();
    }
    ctx.restore();
  }
}

function resizeCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.scale(dpr, dpr);
  return ctx;
}

// ─── Scene 2 Component Markup ────────────────────────────────────────────────

export function createScene2() {
  return `
    <section id="scene-2" class="scene scene-2" aria-label="Scene 2: Ganesh Ji Reveal">

      <!-- ==============================================
           LAYER 1: Palace Sunset Background
           ============================================== -->
      <div class="scene-2-layer scene-2-layer--bg" aria-hidden="true">
        <img
          src="/assets/scene-2/s2_background.png"
          alt=""
          class="scene-2-img scene-2-img--bg"
          loading="eager"
          draggable="false"
        />
      </div>

      <!-- Atmospheric Sunset Vignette -->
      <div class="scene-2-vignette" aria-hidden="true"></div>

      <!-- ==============================================
           LAYER 2: Temple Arch and Architectural Frame
           ============================================== -->
      <div class="scene-2-layer scene-2-layer--arch" aria-hidden="true">
        <img
          src="/assets/scene-2/s2_temple_arch.png"
          alt=""
          class="scene-2-img scene-2-img--arch"
          loading="eager"
          draggable="false"
        />
      </div>

      <!-- ==============================================
           LAYER 3: Celestial Halo Mandala behind Deity
           ============================================== -->
      <div class="scene-2-halo-wrap" aria-hidden="true">
        <div class="scene-2-halo-glow"></div>
        <svg
          class="scene-2-halo-svg"
          viewBox="0 0 400 400"
          width="380"
          height="380"
        >
          <defs>
            <linearGradient id="ganeshGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fff7d6" />
              <stop offset="40%" stop-color="#f5cf68" />
              <stop offset="70%" stop-color="#d4af37" />
              <stop offset="100%" stop-color="#996515" />
            </linearGradient>
            <radialGradient id="ganeshSunburst" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="rgba(255, 245, 210, 0.9)" />
              <stop offset="50%" stop-color="rgba(245, 207, 104, 0.45)" />
              <stop offset="100%" stop-color="rgba(140, 90, 16, 0)" />
            </radialGradient>
          </defs>

          <!-- 24 Divine Radiant Rays -->
          ${Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x2 = 200 + 190 * Math.cos(angle);
            const y2 = 200 + 190 * Math.sin(angle);
            return `<line x1="200" y1="200" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="url(#ganeshGoldGrad)" stroke-width="1.2" stroke-dasharray="4 6" opacity="0.6"/>`;
          }).join('')}

          <!-- Concentric Sacred Circles -->
          <circle cx="200" cy="200" r="185" fill="none" stroke="url(#ganeshGoldGrad)" stroke-width="2" stroke-dasharray="3 3" opacity="0.7" />
          <circle cx="200" cy="200" r="170" fill="none" stroke="url(#ganeshGoldGrad)" stroke-width="1.5" />
          <circle cx="200" cy="200" r="145" fill="none" stroke="url(#ganeshGoldGrad)" stroke-width="2.5" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="url(#ganeshGoldGrad)" stroke-width="1.5" stroke-dasharray="5 3" />
          <circle cx="200" cy="200" r="80" fill="none" stroke="url(#ganeshGoldGrad)" stroke-width="2" />
          <circle cx="200" cy="200" r="60" fill="url(#ganeshSunburst)" stroke="url(#ganeshGoldGrad)" stroke-width="1.5" />

          <!-- 16 Outer Sacred Lotus Petals -->
          ${Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 22.5 * Math.PI) / 180;
            const x = 200 + 145 * Math.cos(angle);
            const y = 200 + 145 * Math.sin(angle);
            const rot = i * 22.5 + 90;
            return `<path d="M 0,0 C -12,-20 -15,-40 0,-55 C 15,-40 12,-20 0,0 Z" transform="translate(${x.toFixed(1)}, ${y.toFixed(1)}) rotate(${rot.toFixed(1)})" fill="rgba(245, 207, 104, 0.18)" stroke="url(#ganeshGoldGrad)" stroke-width="1.5" />`;
          }).join('')}

          <!-- 12 Inner Sacred Lotus Petals -->
          ${Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x = 200 + 80 * Math.cos(angle);
            const y = 200 + 80 * Math.sin(angle);
            const rot = i * 30 + 90;
            return `<path d="M 0,0 C -8,-14 -10,-28 0,-38 C 10,-28 8,-14 0,0 Z" transform="translate(${x.toFixed(1)}, ${y.toFixed(1)}) rotate(${rot.toFixed(1)})" fill="rgba(255, 247, 214, 0.28)" stroke="url(#ganeshGoldGrad)" stroke-width="1.5" />`;
          }).join('')}
        </svg>
      </div>

      <!-- ==============================================
           LAYER 4: Hanging Bells and Floral Garlands
           ============================================== -->
      <div class="scene-2-layer scene-2-layer--bells" aria-hidden="true">
        <img
          src="/assets/scene-2/s2_bells_garlands.png"
          alt=""
          class="scene-2-img scene-2-img--bells"
          loading="eager"
          draggable="false"
        />
      </div>

      <!-- ==============================================
           LAYER 5: Central Deity — Lord Ganesha on Pedestal
           ============================================== -->
      <div class="scene-2-layer scene-2-layer--ganesh" role="img" aria-label="Lord Ganesha seated on an ornate golden lotus pedestal in temple sanctuary">
        <img
          src="/assets/scene-2/s2_ganesh_pedestal.png"
          alt="Lord Ganesha"
          class="scene-2-img scene-2-img--ganesh"
          loading="eager"
          draggable="false"
        />
        <div class="scene-2-pedestal-glow" aria-hidden="true"></div>
      </div>

      <!-- ==============================================
           LAYER 6: Foreground Tiered Steps with Glowing Diyas
           ============================================== -->
      <div class="scene-2-layer scene-2-layer--diya" aria-hidden="true">
        <img
          src="/assets/scene-2/s2_diya_foreground.png"
          alt=""
          class="scene-2-img scene-2-img--diya"
          loading="eager"
          draggable="false"
        />
        <!-- Ambient warm flicker across foreground lamps -->
        <div class="scene-2-diya-flicker-layer" aria-hidden="true"></div>
      </div>

      <!-- Ambient Golden Particles & Drifting Petals Canvas -->
      <canvas id="scene2-particles" class="scene-2-particles-canvas" aria-hidden="true"></canvas>

      <!-- ==============================================
           LAYER 7: Auspicious Header & Devotional Plaque
           ============================================== -->
      <div class="scene-2-content">

        <!-- Top Auspicious Inscription -->
        <header class="scene-2-header">
          <div class="scene-2-badge">
            <span class="scene-2-sparkle" aria-hidden="true">✦</span>
            <span class="scene-2-badge-text">Divine Auspicious Invocation</span>
            <span class="scene-2-sparkle" aria-hidden="true">✦</span>
          </div>

          <h2 class="scene-2-title">॥ श्री गणेशाय नमः ॥</h2>
        </header>

        <!-- Unobstructed central viewing zone for Lord Ganesha deity -->
        <div class="scene-2-deity-zone" aria-hidden="true"></div>

        <!-- Bottom Devotional Shloka & English Blessing Plaque -->
        <footer class="scene-2-plaque">
          <div class="scene-2-plaque-tag">
            <span aria-hidden="true">🪷</span>
            <span>Mangal Aashirvaad</span>
            <span aria-hidden="true">🪷</span>
          </div>

          <p class="scene-2-shloka">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।&#10;निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥</p>

          <div class="scene-2-divider" aria-hidden="true"></div>

          <p class="scene-2-blessing">
            “May Lord Ganesha bless this new journey with happiness, prosperity and endless love.”
          </p>

          <div class="scene-2-scroll-hint" role="button" tabindex="0" aria-label="Continue to Scene 3">
            <span>Scroll to Open Royal Curtains &amp; Reveal Invitation</span>
            <span class="scene-2-arrow" aria-hidden="true">▾</span>
          </div>
        </footer>

      </div>

      <!-- Incoming Golden Light Transition Bloom -->
      <div class="scene-2-golden-bloom" aria-hidden="true"></div>

    </section>
  `;
}

// ─── Scene 2 Lifecycle & Interaction ─────────────────────────────────────────

export function initScene2() {
  clearAllTimers();

  const scene2 = document.getElementById('scene-2');
  if (!scene2) return;

  scene2.classList.add('active');

  // Fade out incoming golden light bloom
  const bloom = scene2.querySelector('.scene-2-golden-bloom');
  if (bloom) {
    addSafeTimer(() => {
      bloom.classList.add('dissolve');
    }, 50);
  }

  // Initialize ambient particle canvas
  const particleCanvas = document.getElementById('scene2-particles');
  if (particleCanvas) {
    particleCtx = resizeCanvas(particleCanvas);
    initParticles(particleCanvas);

    const animationLoop = () => {
      if (particleCtx && particleCanvas) {
        updateParticles(particleCanvas);
        drawParticles(particleCtx, particleCanvas);
      }
      particleAnimFrame = requestAnimationFrame(animationLoop);
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      animationLoop();
    }
  }

  // Handle scroll or click hint to progress to Scene 3
  const scrollHint = scene2.querySelector('.scene-2-scroll-hint');
  const handleProceed = () => {
    if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
      window.sceneManager.goToScene(3);
    } else {
      window.dispatchEvent(new CustomEvent('scene:navigate', { detail: { scene: 3 } }));
    }
  };

  if (scrollHint) {
    scrollHint.addEventListener('click', handleProceed);
    scrollHint.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleProceed();
      }
    });
  }

  // Also support mousewheel scroll down to advance to Scene 3
  let scrollTimeout = null;
  const handleWheel = (e) => {
    if (e.deltaY > 30) {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          handleProceed();
        }, 150);
      }
    }
  };
  window.addEventListener('wheel', handleWheel, { passive: true });
  activeTimers.push(scrollTimeout);
  window._scene2WheelHandler = handleWheel;
}

export function destroyScene2() {
  clearAllTimers();
  cancelAnimationFrame(particleAnimFrame);
  ambientParticles = [];
  if (window._scene2WheelHandler) {
    window.removeEventListener('wheel', window._scene2WheelHandler);
    window._scene2WheelHandler = null;
  }
}
