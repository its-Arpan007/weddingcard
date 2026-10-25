/**
 * Scene 3 — The Grand Invitation Reveal
 *
 * Cinematic Indian Wedding Invitation Reveal
 * Six-Layer Visual Architecture:
 * Layer 1: Sunset Palace Courtyard & Lake Background (s3_palace_sunset.webp / jpg)
 * Layer 2: Ornate Carved Wedding Arch with Brass Lanterns & Rose Garlands (s3_ornate_arch.webp / png)
 * Layer 3: Royal Velvet Tied-Back Curtains with Tassels
 * Layer 4: Symmetrical Golden Peacocks on Marble Pedestals with Lit Deepams (s3_peacocks.webp / png)
 * Layer 5: Ambient Golden Sparkles & Floating Rose Petals Canvas
 * Layer 6: The Grand Invitation Scroll Card (Real HTML & CSS typography)
 * Layer 7: Incoming Golden Light Bloom for Scene 2 Continuity
 */

import './scene3.css';
import { gsap } from 'gsap';

/** @type {number[]} */
let activeTimers = [];

/** @type {gsap.Context | null} */
let gsapCtx = null;

/** @type {number} */
let particleAnimFrame = 0;

/** @type {Array<Object>} */
let ambientParticles = [];

/** @type {CanvasRenderingContext2D | null} */
let particleCtx = null;

/** @type {boolean} */
let isTransitioning = false;

function addSafeTimer(fn, delay) {
  const id = window.setTimeout(fn, delay);
  activeTimers.push(id);
  return id;
}

function clearAllTimers() {
  activeTimers.forEach((id) => clearTimeout(id));
  activeTimers = [];
}

// ─── Ambient Particle System (Golden Sparkles & Floating Rose Petals) ────────

function createParticle(canvas) {
  const isPetal = Math.random() > 0.72;
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: isPetal ? Math.random() * 4.5 + 2.5 : Math.random() * 2.2 + 0.6,
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
  ambientParticles = [];
  const count = window.innerWidth < 640 ? 30 : 60;
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
      ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Core sparkle
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
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}

// ─── Scene 3 Component Markup ────────────────────────────────────────────────

export function createScene3() {
  return `
    <section id="scene-3" class="scene scene-3" aria-label="Scene 3: The Grand Invitation Reveal">

      <!-- ==============================================
           LAYER 1: Sunset Palace Courtyard & Lake
           ============================================== -->
      <div class="scene-3-bg-wrap" aria-hidden="true">
        <picture>
          <source srcset="/assets/scene-3/s3_palace_sunset.webp" type="image/webp" />
          <img
            src="/assets/scene-3/s3_palace_sunset.jpg"
            alt=""
            class="scene-3-bg-img"
            loading="eager"
            decoding="async"
            width="1024"
            height="576"
            draggable="false"
          />
        </picture>
      </div>

      <!-- Atmospheric warm sunset vignette -->
      <div class="scene-3-vignette" aria-hidden="true"></div>

      <!-- ==============================================
           LAYER 2: Ornate Carved Wedding Arch
           ============================================== -->
      <div class="scene-3-arch-wrap" aria-hidden="true">
        <picture>
          <source srcset="/assets/scene-3/s3_ornate_arch.webp" type="image/webp" />
          <img
            src="/assets/scene-3/s3_ornate_arch.png"
            alt=""
            class="scene-3-arch-img"
            loading="eager"
            decoding="async"
            width="1024"
            height="576"
            draggable="false"
          />
        </picture>
      </div>

      <!-- ==============================================
           LAYER 4: Royal Peacocks on Marble Pedestals
           ============================================== -->
      <div class="scene-3-peacocks-wrap" aria-hidden="true">
        <picture>
          <source srcset="/assets/scene-3/s3_peacocks.webp" type="image/webp" />
          <img
            src="/assets/scene-3/s3_peacocks.png"
            alt=""
            class="scene-3-peacocks-img"
            loading="eager"
            decoding="async"
            width="1024"
            height="576"
            draggable="false"
          />
        </picture>
      </div>

      <!-- ==============================================
           LAYER 5: Ambient Floating Particles Canvas
           ============================================== -->
      <canvas id="scene3-particles" class="scene-3-particles-canvas" aria-hidden="true"></canvas>

      <!-- ==============================================
           LAYER 6: The Grand Invitation Card
           ============================================== -->
      <div class="scene-3-card-container">
        <article class="scene-3-card" role="region" aria-label="Wedding Invitation of Sneha Sinha and Dipak Prasad">
          <div class="scene-3-card-inner">

            <!-- Corner filigree anchored directly inside inner border -->
            <svg class="scene-3-corner-ornament scene-3-corner--tl" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M2,2 L14,2 C14,5 11,8 8,8 C5,8 5,11 5,14 L2,14 Z M4,4 L4,8 C6,8 8,6 8,4 Z" />
            </svg>
            <svg class="scene-3-corner-ornament scene-3-corner--tr" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M2,2 L14,2 C14,5 11,8 8,8 C5,8 5,11 5,14 L2,14 Z M4,4 L4,8 C6,8 8,6 8,4 Z" />
            </svg>
            <svg class="scene-3-corner-ornament scene-3-corner--bl" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M2,2 L14,2 C14,5 11,8 8,8 C5,8 5,11 5,14 L2,14 Z M4,4 L4,8 C6,8 8,6 8,4 Z" />
            </svg>
            <svg class="scene-3-corner-ornament scene-3-corner--br" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M2,2 L14,2 C14,5 11,8 8,8 C5,8 5,11 5,14 L2,14 Z M4,4 L4,8 C6,8 8,6 8,4 Z" />
            </svg>

            <!-- A. Devotional Heading -->
            <header class="scene-3-devotional scene-3-fade-item">
              <img
                src="/assets/scene-3/s3_lotus_motif_gold.png"
                alt=""
                class="scene-3-lotus-motif"
                aria-hidden="true"
              />
              <h2 class="scene-3-shree-ganesh">॥ श्री गणेशाय नमः ॥</h2>
              <p class="scene-3-shloka">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥</p>
            </header>

            <div class="scene-3-divider scene-3-fade-item" aria-hidden="true">
              <span class="scene-3-divider-line"></span>
              <span class="scene-3-divider-icon">✦ 🪷 ✦</span>
              <span class="scene-3-divider-line"></span>
            </div>

            <!-- B. Invitation Heading -->
            <p class="scene-3-heading scene-3-fade-item">YOU ARE CORDIALLY INVITED</p>

            <!-- C. Couple's Names — Dominant Focal Point -->
            <div class="scene-3-couple scene-3-fade-item">
              <h1 class="scene-3-name scene-3-bride">Sneha Sinha</h1>
              <span class="scene-3-ampersand" aria-hidden="true">&amp;</span>
              <h1 class="scene-3-name scene-3-groom">Dipak Prasad</h1>
            </div>

            <!-- D. Invitation Message -->
            <p class="scene-3-message scene-3-fade-item">
              “With the blessings of our families, we invite you to celebrate the wedding of Sneha Sinha and Dipak Prasad and to join us in this beautiful occasion of love and togetherness.”
            </p>

            <!-- E. Wedding Date Badge -->
            <div class="scene-3-date-badge scene-3-fade-item">
              <span class="scene-3-date-icon" aria-hidden="true">📅</span>
              <span class="scene-3-date-text">Sunday, 29 November 2026</span>
            </div>

            <!-- F. Venue Details -->
            <div class="scene-3-venue scene-3-fade-item">
              <h3 class="scene-3-venue-name">Sethjees Banquet</h3>
              <p class="scene-3-venue-loc">Maniktala, Kanchrapara</p>
            </div>

            <!-- G. Family Details (Balanced Two-Column Layout) -->
            <div class="scene-3-families scene-3-fade-item">
              <div class="scene-3-family-col">
                <span class="scene-3-family-label">Bride’s Parents</span>
                <span class="scene-3-parent-name">Shri Prabhat Kumar Sinha</span>
                <span class="scene-3-parent-name">Smt. Rita Sinha</span>
              </div>
              <div class="scene-3-family-col">
                <span class="scene-3-family-label">Groom’s Parents</span>
                <span class="scene-3-parent-name">Shri Suresh Prasad</span>
                <span class="scene-3-parent-name">Smt. Lilawati Devi</span>
              </div>
            </div>

            <!-- Action CTA & Scene 4 Handoff -->
            <div class="scene-3-cta-wrap scene-3-fade-item">
              <button
                id="scene-3-next-btn"
                class="scene-3-cta-btn"
                type="button"
                aria-label="View Wedding Celebrations and Event Details"
              >
                <span>View Celebrations &amp; Events</span>
                <span class="scene-3-cta-arrow" aria-hidden="true">▾</span>
              </button>
              <span class="scene-3-scroll-hint" aria-hidden="true">Scroll or click to view celebrations</span>
            </div>

          </div>
        </article>
      </div>

      <!-- ==============================================
           THE ROYAL VELVET CURTAINS (Parting Open)
           ============================================== -->
      <div class="scene-3-curtains" aria-hidden="true">
        <div class="scene-3-curtain-crevice"></div>
        <div class="scene-3-curtain-panel scene-3-curtain-panel--left">
          <picture>
            <source srcset="/assets/scene-3/s3_curtain_closed_left.webp" type="image/webp" />
            <img
              src="/assets/scene-3/s3_curtain_closed_left.png"
              alt=""
              loading="eager"
              decoding="async"
              width="800"
              height="1160"
              draggable="false"
            />
          </picture>
        </div>
        <div class="scene-3-curtain-panel scene-3-curtain-panel--right">
          <picture>
            <source srcset="/assets/scene-3/s3_curtain_closed_right.webp" type="image/webp" />
            <img
              src="/assets/scene-3/s3_curtain_closed_right.png"
              alt=""
              loading="eager"
              decoding="async"
              width="800"
              height="1160"
              draggable="false"
            />
          </picture>
        </div>
      </div>

      <!-- Incoming Golden Light Transition Bloom for Scene 2 Continuity -->
      <div class="scene-3-incoming-bloom" aria-hidden="true"></div>

    </section>
  `;
}

let hasRevealedScene3 = false;
let scene3ResizeHandler = null;

// ─── Scene 3 Lifecycle & Interaction ─────────────────────────────────────────

export function initScene3() {
  clearAllTimers();

  const scene3 = document.getElementById('scene-3');
  if (!scene3) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (hasRevealedScene3) {
    // Curtains have already opened; keep them gracefully parted
    scene3.classList.add('curtains-open', 'card-revealed');
    gsap.set('.scene-3-curtains', { display: 'none' });
    gsap.set('.scene-3-card-container', { opacity: 1, y: 0, scale: 1 });
    gsap.set('.scene-3-peacocks-wrap', { opacity: 1, scale: 1, y: 0 });
    gsap.set('.scene-3-fade-item', { opacity: 1, y: 0 });
  } else {
    // First time entering Scene 3
    scene3.classList.remove('curtains-open', 'card-revealed');
    gsap.set('.scene-3-curtains', { display: 'block' });
    gsap.set('.scene-3-curtain-panel--left', { xPercent: 0 });
    gsap.set('.scene-3-curtain-panel--right', { xPercent: 0 });
    gsap.set('.scene-3-curtain-crevice', { opacity: 1 });

    gsapCtx = gsap.context(() => {
      if (prefersReducedMotion) {
        scene3.classList.add('curtains-open', 'card-revealed');
        gsap.set('.scene-3-curtains', { display: 'none' });
        gsap.set('.scene-3-card-container', { opacity: 1, y: 0, scale: 1 });
        gsap.set('.scene-3-peacocks-wrap', { opacity: 1, scale: 1, y: 0 });
        gsap.set('.scene-3-fade-item', { opacity: 1, y: 0 });
        hasRevealedScene3 = true;
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          scene3.classList.add('curtains-open', 'card-revealed');
          hasRevealedScene3 = true;
        },
      });

      // Part the velvet curtains gracefully
      tl.to('.scene-3-curtain-crevice', {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
      }, 0.05)
      .to('.scene-3-curtain-panel--left', {
        xPercent: -105,
        duration: 1.25,
        ease: 'power2.inOut',
      }, 0.1)
      .to('.scene-3-curtain-panel--right', {
        xPercent: 105,
        duration: 1.25,
        ease: 'power2.inOut',
      }, 0.1)
      .set('.scene-3-curtains', { display: 'none' })
      .fromTo('.scene-3-peacocks-wrap',
        { opacity: 0, scale: 0.94, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power2.out' },
        0.35
      )
      .fromTo('.scene-3-card-container',
        { opacity: 0, y: 24, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.95, ease: 'power2.out' },
        0.45
      )
      .fromTo('.scene-3-fade-item',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out' },
        0.75
      );
    }, scene3);
  }

  // Dissolve incoming golden bloom smoothly
  const bloom = scene3.querySelector('.scene-3-incoming-bloom');
  if (bloom) {
    addSafeTimer(() => {
      bloom.classList.add('dissolved');
    }, 60);
  }

  // Initialize ambient particle canvas
  const canvas = document.getElementById('scene3-particles');
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

    scene3ResizeHandler = () => {
      if (canvas) {
        particleCtx = resizeCanvas(canvas);
        initParticles(canvas);
      }
    };
    window.addEventListener('resize', scene3ResizeHandler, { passive: true });
  }

  // Handle Handoff to Scene 4
  const proceedToScene4 = () => {
    if (window.sceneManager && window.sceneManager.isTransitioning()) return;
    if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
      window.sceneManager.goToScene(4, 'down');
    } else {
      window.dispatchEvent(new CustomEvent('scene:navigate', { detail: { scene: 4, direction: 'down' } }));
    }
  };

  // Handle Return to Scene 2
  const proceedToScene2 = () => {
    if (window.sceneManager && window.sceneManager.isTransitioning()) return;
    if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
      window.sceneManager.goToScene(2, 'up');
    } else {
      window.dispatchEvent(new CustomEvent('scene:navigate', { detail: { scene: 2, direction: 'up' } }));
    }
  };

  const nextBtn = document.getElementById('scene-3-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', proceedToScene4);
    nextBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        proceedToScene4();
      }
    });
  }

  // Support mousewheel scroll with card overscroll safety buffer
  let cardOverscrollY = 0;
  let overscrollResetTimer = null;

  window._scene3WheelHandler = (e) => {
    if (window.sceneManager && window.sceneManager.isTransitioning()) return;

    const card = scene3.querySelector('.scene-3-card');
    if (!card) return;

    const isScrollable = card.scrollHeight > card.clientHeight + 15;
    const isAtBottom = isScrollable
      ? card.scrollTop + card.clientHeight >= card.scrollHeight - 12
      : true;
    const isAtTop = isScrollable
      ? card.scrollTop <= 6
      : true;

    // If card is scrollable and scrolling within content, permit natural internal scroll
    if (isScrollable) {
      if ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && !isAtTop)) {
        cardOverscrollY = 0;
        return;
      }
    }

    cardOverscrollY += e.deltaY;

    if (overscrollResetTimer) clearTimeout(overscrollResetTimer);
    overscrollResetTimer = setTimeout(() => {
      cardOverscrollY = 0;
    }, 220);

    // Scroll Down -> Scene 4 (require deliberate overscroll: 60px)
    if (e.deltaY > 0 && isAtBottom && cardOverscrollY >= 60) {
      cardOverscrollY = 0;
      proceedToScene4();
    }
    // Scroll Up -> Scene 2 (require deliberate overscroll: -60px)
    else if (e.deltaY < 0 && isAtTop && cardOverscrollY <= -60) {
      cardOverscrollY = 0;
      proceedToScene2();
    }
  };
  window.addEventListener('wheel', window._scene3WheelHandler, { passive: true });

  // Support mobile touch swipe with internal card scroll awareness
  let touchStartY = 0;
  let touchStartX = 0;

  window._scene3TouchStartHandler = (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    }
  };

  window._scene3TouchEndHandler = (e) => {
    if (window.sceneManager && window.sceneManager.isTransitioning()) return;
    if (e.changedTouches && e.changedTouches.length > 0) {
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const deltaX = Math.abs(touchStartX - e.changedTouches[0].clientX);

      if (Math.abs(deltaY) < deltaX || Math.abs(deltaY) < 55) return;

      const card = scene3.querySelector('.scene-3-card');
      const isScrollable = card ? card.scrollHeight > card.clientHeight + 15 : false;
      const isAtBottom = card && isScrollable
        ? card.scrollTop + card.clientHeight >= card.scrollHeight - 12
        : true;
      const isAtTop = card && isScrollable
        ? card.scrollTop <= 6
        : true;

      if (deltaY > 55 && isAtBottom) {
        proceedToScene4();
      } else if (deltaY < -55 && isAtTop) {
        proceedToScene2();
      }
    }
  };

  window.addEventListener('touchstart', window._scene3TouchStartHandler, { passive: true });
  window.addEventListener('touchend', window._scene3TouchEndHandler, { passive: true });
}

export function destroyScene3() {
  clearAllTimers();
  cancelAnimationFrame(particleAnimFrame);
  ambientParticles = [];

  if (window._scene3WheelHandler) {
    window.removeEventListener('wheel', window._scene3WheelHandler);
    window._scene3WheelHandler = null;
  }
  if (window._scene3TouchStartHandler) {
    window.removeEventListener('touchstart', window._scene3TouchStartHandler);
    window._scene3TouchStartHandler = null;
  }
  if (window._scene3TouchEndHandler) {
    window.removeEventListener('touchend', window._scene3TouchEndHandler);
    window._scene3TouchEndHandler = null;
  }
  if (scene3ResizeHandler) {
    window.removeEventListener('resize', scene3ResizeHandler);
    scene3ResizeHandler = null;
  }

  // Keep curtains and elements revealed so returning backwards is instant and clean
}
