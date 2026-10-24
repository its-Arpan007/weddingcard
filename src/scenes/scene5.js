/**
 * Scene 5 — Family Details
 *
 * Cinematic Indian Wedding Family Reveal
 * Layered Architecture:
 * Layer 1: Palace Sunset Courtyard with Pool & Lamps (s5_bg_desktop.webp / png)
 * Layer 2: Grand Carved Marble Family Arch with Domed Pavilions (s5_family_arch_01.webp / png)
 * Layer 3: Ambient Floating Rose Petals & Golden Sparkles Canvas
 * Layer 4: Content Interface — Royal Header, Bride & Groom Family Panels, Blessings & CTA
 * Layer 5: Incoming Light Bloom for Scene 4 Continuity
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './scene5.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Exact Verified Family Details (Source of Truth)
 */
export const FAMILY_DATA = {
  bride: {
    role: 'The Bride',
    name: 'Sneha Sinha',
    relation: 'Daughter of:',
    father: 'Shri Prabhat Kumar Sinha',
    mother: 'Smt. Rita Sinha',
    badge: 'Sinha Family',
    emblem: '🌸',
  },
  groom: {
    role: 'The Groom',
    name: 'Dipak Prasad',
    relation: 'Son of:',
    father: 'Shri Suresh Prasad',
    mother: 'Smt. Lilawati Devi',
    badge: 'Prasad Family',
    emblem: '🪔',
  },
};

/** @type {number[]} */
let activeTimers = [];

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

// Stored resize handler for cleanup
let resizeHandler = null;

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
}

// ─── Ambient Particle System (Golden Sparkles & Floating Rose Petals) ────────

function createParticle(canvas) {
  const isPetal = Math.random() > 0.72;
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: isPetal ? Math.random() * 4.5 + 2.5 : Math.random() * 2.2 + 0.6,
    speedX: (Math.random() - 0.5) * (isPetal ? 0.35 : 0.2),
    speedY: isPetal ? Math.random() * 0.45 + 0.22 : -(Math.random() * 0.3 + 0.1),
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

// ─── HTML Template Creation ──────────────────────────────────────────────────

export function createScene5() {
  const { bride, groom } = FAMILY_DATA;

  return `
    <section id="scene-5" class="scene scene-5" aria-label="Family Details and Blessings">

      <!-- Layer 1: Palace Sunset Courtyard with Pool & Lamps -->
      <div class="scene-5-bg-layer" aria-hidden="true">
        <picture class="scene-5-bg-picture">
          <source srcset="/assets/scene-5/s5_bg_desktop.webp" type="image/webp" />
          <img
            src="/assets/scene-5/s5_bg_desktop.png"
            width="1024"
            height="576"
            alt=""
            class="scene-5-bg-img"
            draggable="false"
          />
        </picture>
        <div class="scene-5-bg-vignette"></div>
      </div>

      <!-- Layer 2: Grand Carved Marble Family Arch -->
      <div class="scene-5-arch-layer" aria-hidden="true">
        <picture class="scene-5-arch-picture">
          <source srcset="/assets/scene-5/s5_family_arch_01.webp" type="image/webp" />
          <img
            src="/assets/scene-5/s5_family_arch_01.png"
            width="960"
            height="880"
            alt=""
            class="scene-5-arch-img"
            draggable="false"
          />
        </picture>
        <div class="scene-5-arch-glow"></div>
      </div>

      <!-- Layer 3: Ambient Floating Rose Petals & Golden Sparkles Canvas -->
      <canvas id="scene5-particles" class="scene-5-particles" aria-hidden="true"></canvas>

      <!-- Layer 4: Scrollable Content Container -->
      <div class="scene-5-scroll-container">
        <div class="scene-5-content-wrap">

          <!-- A. Devotional Badge & Main Header -->
          <header class="scene-5-header scene-5-anim-item scene-5-anim-1">
            <span class="scene-5-devotional-tag">॥ कुलदेवतायै नमः ॥</span>
            <h1 class="scene-5-title">Our Beloved Families</h1>
            <div class="scene-5-ornament-divider" aria-hidden="true">
              <span class="scene-5-divider-line"></span>
              <span class="scene-5-divider-gem">❖</span>
              <span class="scene-5-divider-line"></span>
            </div>
            <p class="scene-5-subtitle">
              United in love, guided by the sacred traditions and heartfelt blessings of our elders
            </p>
          </header>

          <!-- B. Coordinated Family Panels (Two-Column Desktop, Stacked Mobile) -->
          <main class="scene-5-families-grid" role="region" aria-label="Family Information">
            
            <!-- The Bride Section -->
            <article class="scene-5-family-card scene-5-family-card--bride scene-5-anim-item scene-5-anim-2">
              <div class="scene-5-card-inner">
                <div class="scene-5-card-top-accent">
                  <span class="scene-5-family-badge">${bride.badge}</span>
                </div>

                <div class="scene-5-role-badge">
                  <span class="scene-5-role-icon" aria-hidden="true">${bride.emblem}</span>
                  <h2 class="scene-5-role-title">${bride.role}</h2>
                </div>

                <div class="scene-5-couple-name-wrap">
                  <span class="scene-5-couple-name">${bride.name}</span>
                </div>

                <div class="scene-5-relation-divider" aria-hidden="true">
                  <span class="scene-5-relation-line"></span>
                  <span class="scene-5-relation-label">${bride.relation}</span>
                  <span class="scene-5-relation-line"></span>
                </div>

                <div class="scene-5-parents-list">
                  <div class="scene-5-parent-item">
                    <span class="scene-5-parent-honorific">Shri</span>
                    <span class="scene-5-parent-name">Prabhat Kumar Sinha</span>
                  </div>
                  <span class="scene-5-parents-amp" aria-hidden="true">&amp;</span>
                  <div class="scene-5-parent-item">
                    <span class="scene-5-parent-honorific">Smt.</span>
                    <span class="scene-5-parent-name">Rita Sinha</span>
                  </div>
                </div>

                <!-- Antique Gold Corner Accents -->
                <div class="scene-5-corner scene-5-corner--tl" aria-hidden="true"></div>
                <div class="scene-5-corner scene-5-corner--tr" aria-hidden="true"></div>
                <div class="scene-5-corner scene-5-corner--bl" aria-hidden="true"></div>
                <div class="scene-5-corner scene-5-corner--br" aria-hidden="true"></div>
              </div>
            </article>

            <!-- Symmetrical Center Union Medallion -->
            <div class="scene-5-center-knot scene-5-anim-item scene-5-anim-3" aria-hidden="true">
              <div class="scene-5-knot-circle">
                <span class="scene-5-knot-glyph">❦</span>
              </div>
            </div>

            <!-- The Groom Section -->
            <article class="scene-5-family-card scene-5-family-card--groom scene-5-anim-item scene-5-anim-4">
              <div class="scene-5-card-inner">
                <div class="scene-5-card-top-accent">
                  <span class="scene-5-family-badge">${groom.badge}</span>
                </div>

                <div class="scene-5-role-badge">
                  <span class="scene-5-role-icon" aria-hidden="true">${groom.emblem}</span>
                  <h2 class="scene-5-role-title">${groom.role}</h2>
                </div>

                <div class="scene-5-couple-name-wrap">
                  <span class="scene-5-couple-name">${groom.name}</span>
                </div>

                <div class="scene-5-relation-divider" aria-hidden="true">
                  <span class="scene-5-relation-line"></span>
                  <span class="scene-5-relation-label">${groom.relation}</span>
                  <span class="scene-5-relation-line"></span>
                </div>

                <div class="scene-5-parents-list">
                  <div class="scene-5-parent-item">
                    <span class="scene-5-parent-honorific">Shri</span>
                    <span class="scene-5-parent-name">Suresh Prasad</span>
                  </div>
                  <span class="scene-5-parents-amp" aria-hidden="true">&amp;</span>
                  <div class="scene-5-parent-item">
                    <span class="scene-5-parent-honorific">Smt.</span>
                    <span class="scene-5-parent-name">Lilawati Devi</span>
                  </div>
                </div>

                <!-- Antique Gold Corner Accents -->
                <div class="scene-5-corner scene-5-corner--tl" aria-hidden="true"></div>
                <div class="scene-5-corner scene-5-corner--tr" aria-hidden="true"></div>
                <div class="scene-5-corner scene-5-corner--bl" aria-hidden="true"></div>
                <div class="scene-5-corner scene-5-corner--br" aria-hidden="true"></div>
              </div>
            </article>

          </main>

          <!-- C. Devotional Shloka & Blessing Note -->
          <div class="scene-5-blessing-quote scene-5-anim-item scene-5-anim-5">
            <p class="scene-5-shloka-text">॥ मांगल्यं तन्तुनानेन लोकजीवनहेतुना ॥</p>
            <p class="scene-5-blessing-english">
              “May their sacred bond be blessed with lifelong happiness, mutual devotion, and prosperity.”
            </p>
          </div>

          <!-- D. Footer Action & Scene 6 Handoff -->
          <footer class="scene-5-cta-wrap scene-5-anim-item scene-5-anim-6">
            <button
              id="scene-5-next-btn"
              class="scene-5-cta-btn"
              type="button"
              aria-label="Proceed to Wedding Blessings and RSVP"
            >
              <span>Send Blessings &amp; RSVP</span>
              <span class="scene-5-cta-arrow" aria-hidden="true">▾</span>
            </button>
            <span class="scene-5-scroll-hint" aria-hidden="true">Scroll down or click to continue</span>
          </footer>

        </div>
      </div>

      <!-- Incoming Transition Light Bloom for Scene 4 Continuity -->
      <div class="scene-5-incoming-bloom" aria-hidden="true"></div>

    </section>
  `;
}

// ─── Scene 5 Lifecycle & Interaction ─────────────────────────────────────────

export function initScene5() {
  clearAllTimers();
  isTransitioning = false;

  const scene5 = document.getElementById('scene-5');
  if (!scene5) return;

  scene5.classList.remove('phase-a', 'phase-b', 'phase-c', 'phase-d', 'phase-settled');
  scene5.classList.add('active');

  const scrollContainer = scene5.querySelector('.scene-5-scroll-container');
  if (scrollContainer) {
    scrollContainer.scrollTop = 0;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── GSAP Scoped Entrance Timeline & Parallax ─────────────────────────────
  if (gsapCtx) {
    gsapCtx.revert();
    gsapCtx = null;
  }

  gsapCtx = gsap.context(() => {
    if (prefersReducedMotion) {
      gsap.set(
        ['.scene-5-bg-img', '.scene-5-arch-img', '.scene-5-anim-item', '.scene-5-family-card', '.scene-5-center-knot'],
        { opacity: 1, y: 0, x: 0, scale: 1 }
      );
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.fromTo('.scene-5-bg-img', { scale: 1.04, opacity: 0.6 }, { scale: 1, opacity: 1, duration: 1.1 }, 0)
      .fromTo('.scene-5-arch-img', { y: 35, opacity: 0, scale: 0.96 }, { y: 0, opacity: 0.86, scale: 1, duration: 1 }, 0.15)
      .fromTo('.scene-5-header', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, 0.3)
      .fromTo('.scene-5-family-card--bride', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 0.45)
      .fromTo('.scene-5-family-card--groom', { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 0.45)
      .fromTo('.scene-5-center-knot', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 }, 0.6)
      .fromTo('.scene-5-blessing-quote', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.75)
      .fromTo('.scene-5-cta-wrap', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.9);

    // Subtle scroll parallax for the marble family arch
    if (scrollContainer) {
      ScrollTrigger.create({
        trigger: '.scene-5-content-wrap',
        scroller: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          gsap.to('.scene-5-arch-img', { y: self.progress * 35, overwrite: 'auto', duration: 0.15 });
        },
      });
    }
  }, scene5);

  // Dissolve incoming golden bloom smoothly
  const bloom = scene5.querySelector('.scene-5-incoming-bloom');
  if (bloom) {
    addSafeTimer(() => {
      bloom.classList.add('dissolved');
    }, 60);
  }

  // Initialize ambient particle canvas
  const canvas = document.getElementById('scene5-particles');
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

  // ─── Scene 6 Navigation Handoff ───────────────────────────────────────────
  const proceedToScene6 = () => {
    if (isTransitioning) return;
    isTransitioning = true;

    if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
      window.sceneManager.goToScene(6);
    } else {
      window.dispatchEvent(new CustomEvent('scene:navigate', { detail: { scene: 6 } }));
    }

    addSafeTimer(() => {
      isTransitioning = false;
    }, 1500);
  };

  // ─── Scene 4 Navigation Return ────────────────────────────────────────────
  const proceedToScene4 = () => {
    if (isTransitioning) return;
    isTransitioning = true;

    if (window.sceneManager && typeof window.sceneManager.goToScene === 'function') {
      window.sceneManager.goToScene(4);
    } else {
      window.dispatchEvent(new CustomEvent('scene:navigate', { detail: { scene: 4 } }));
    }

    addSafeTimer(() => {
      isTransitioning = false;
    }, 1500);
  };

  const nextBtn = document.getElementById('scene-5-next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', proceedToScene6);
    nextBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        proceedToScene6();
      }
    });
  }

  // Mousewheel scroll (Scroll Down -> Scene 6, Scroll Up -> Scene 4)
  let wheelTimer = null;
  const wheelHandler = (e) => {
    if (isTransitioning) return;
    const isAtBottom = scrollContainer
      ? scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 25
      : true;
    const isAtTop = scrollContainer ? scrollContainer.scrollTop <= 10 : true;

    if (e.deltaY > 35 && isAtBottom) {
      if (!wheelTimer) {
        wheelTimer = setTimeout(() => {
          proceedToScene6();
          wheelTimer = null;
        }, 150);
      }
    } else if (e.deltaY < -35 && isAtTop) {
      if (!wheelTimer) {
        wheelTimer = setTimeout(() => {
          proceedToScene4();
          wheelTimer = null;
        }, 150);
      }
    }
  };
  window.addEventListener('wheel', wheelHandler, { passive: true });

  // Mobile touch swipe (Swipe Up -> Scene 6, Swipe Down -> Scene 4)
  let touchStartY = 0;
  const touchStartHandler = (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartY = e.touches[0].clientY;
    }
  };
  const touchEndHandler = (e) => {
    if (e.changedTouches && e.changedTouches.length > 0 && !isTransitioning) {
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const isAtBottom = scrollContainer
        ? scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 25
        : true;
      const isAtTop = scrollContainer ? scrollContainer.scrollTop <= 10 : true;

      if (deltaY > 60 && isAtBottom) {
        proceedToScene6();
      } else if (deltaY < -60 && isAtTop) {
        proceedToScene4();
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

export function destroyScene5() {
  clearAllTimers();
  cancelAnimationFrame(particleAnimFrame);
  ambientParticles = [];
  isTransitioning = false;

  if (gsapCtx) {
    gsapCtx.revert();
    gsapCtx = null;
  }

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }

  const scene5 = document.getElementById('scene-5');
  if (scene5) {
    scene5.classList.remove('phase-a', 'phase-b', 'phase-c', 'phase-d', 'phase-settled');
  }
}
