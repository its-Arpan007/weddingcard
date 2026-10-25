/**
 * Scene Manager — Six-Scene Architecture
 *
 * Manages scene transitions, lifecycle (create, init, destroy),
 * and provides a global navigation API with ultra-smooth kinetic transitions,
 * directional slide-and-fade physics, and momentum-damping gesture protection.
 */

import { createScene1, initScene1, destroyScene1 } from './scenes/scene1.js';
import { createScene2, initScene2, destroyScene2 } from './scenes/scene2.js';
import { createScene3, initScene3, destroyScene3 } from './scenes/scene3.js';
import { createScene4, initScene4, destroyScene4 } from './scenes/scene4.js';
import { createScene5, initScene5, destroyScene5 } from './scenes/scene5.js';
import { createScene6, initScene6, destroyScene6 } from './scenes/scene6.js';

const scenes = {
  1: { create: createScene1, init: initScene1, destroy: destroyScene1 },
  2: { create: createScene2, init: initScene2, destroy: destroyScene2 },
  3: { create: createScene3, init: initScene3, destroy: destroyScene3 },
  4: { create: createScene4, init: initScene4, destroy: destroyScene4 },
  5: { create: createScene5, init: initScene5, destroy: destroyScene5 },
  6: { create: createScene6, init: initScene6, destroy: destroyScene6 },
};

let currentScene = null;
let isNavigating = false;
let navigationCooldownTimer = null;
let inertiaUnlockTimer = null;

/**
 * Returns whether a transition or cooldown is currently active.
 * @returns {boolean}
 */
export function isTransitioning() {
  return isNavigating;
}

/**
 * Navigate to a scene by number with directional kinetic slide-and-fade.
 * @param {number} sceneNum - Scene number (1-6)
 * @param {'down'|'up'|null} forcedDirection - Direction of travel ('down' | 'up')
 */
export function goToScene(sceneNum, forcedDirection = null) {
  const app = document.getElementById('app');
  if (!app) return;

  if (sceneNum === currentScene || isNavigating) return;

  const targetDef = scenes[sceneNum];
  if (!targetDef) {
    console.warn(`Scene ${sceneNum} not found.`);
    return;
  }

  const prevSceneNum = currentScene;
  const direction = forcedDirection || (prevSceneNum && sceneNum < prevSceneNum ? 'up' : 'down');

  isNavigating = true;
  currentScene = sceneNum;

  // Clear any existing cooldown timers
  if (navigationCooldownTimer) clearTimeout(navigationCooldownTimer);
  if (inertiaUnlockTimer) clearTimeout(inertiaUnlockTimer);

  // Ensure target DOM element exists
  let targetEl = document.getElementById(`scene-${sceneNum}`);
  if (!targetEl) {
    const content = targetDef.create();
    if (typeof content === 'string') {
      app.insertAdjacentHTML('beforeend', content);
    } else if (content instanceof Node) {
      app.appendChild(content);
    }
    targetEl = document.getElementById(`scene-${sceneNum}`);
  }

  const prevEl = prevSceneNum ? document.getElementById(`scene-${prevSceneNum}`) : null;

  if (!prevEl) {
    // Initial load on page start (Scene 1)
    if (targetEl) {
      targetEl.classList.remove('enter-from-down', 'enter-from-up', 'exit-up', 'exit-down');
      targetEl.classList.add('active');
    }
    try {
      targetDef.init(direction);
    } catch (err) {
      console.error(`Error initializing scene ${sceneNum}:`, err);
    }
    isNavigating = false;
    return;
  }

  // Directional positioning classes for smooth kinetic gliding
  const enterClass = direction === 'down' ? 'enter-from-down' : 'enter-from-up';
  const exitClass = direction === 'down' ? 'exit-up' : 'exit-down';

  // Position target scene off-screen in preparation
  targetEl.classList.remove('active', 'exit-up', 'exit-down', 'enter-from-down', 'enter-from-up');
  targetEl.classList.add(enterClass);

  // Force layout flush so the browser establishes the starting transform
  void targetEl.offsetWidth;

  // Next frame: smoothly transition both scenes simultaneously
  requestAnimationFrame(() => {
    // Outgoing scene slides and fades away smoothly
    prevEl.classList.remove('active');
    prevEl.classList.add(exitClass);

    // Incoming scene glides into place
    targetEl.classList.remove(enterClass);
    targetEl.classList.add('active');

    // Initialize incoming scene
    try {
      targetDef.init(direction);
    } catch (err) {
      console.error(`Error initializing scene ${sceneNum}:`, err);
    }
  });

  // After CSS visual transition completes (700ms):
  navigationCooldownTimer = setTimeout(() => {
    if (prevEl && prevSceneNum !== currentScene) {
      prevEl.classList.remove('exit-up', 'exit-down');
      // Cleanly suspend outgoing scene's animation loops (keeping DOM rendered & intact)
      if (scenes[prevSceneNum] && typeof scenes[prevSceneNum].destroy === 'function') {
        try {
          scenes[prevSceneNum].destroy();
        } catch {
          // safe cleanup
        }
      }
    }

    // Cooldown lock window: absorb residual wheel momentum or touch bounce (200ms)
    inertiaUnlockTimer = setTimeout(() => {
      isNavigating = false;
    }, 200);
  }, 720);
}

export function prevScene() {
  if (currentScene > 1 && !isNavigating) {
    goToScene(currentScene - 1, 'up');
  }
}

export function nextScene() {
  if (currentScene < 6 && !isNavigating) {
    goToScene(currentScene + 1, 'down');
  }
}

/**
 * Initialize the scene manager.
 * Starts at Scene 1 by default.
 */
export function initSceneManager() {
  const app = document.getElementById('app');
  if (!app) return;

  // Expose global API
  window.sceneManager = {
    goToScene,
    prevScene,
    nextScene,
    getCurrentScene: () => currentScene,
    isTransitioning: () => isNavigating,
  };

  // Listen for custom navigation events
  window.addEventListener('scene:navigate', (e) => {
    const { scene, direction } = e.detail || {};
    if (scene) goToScene(scene, direction);
  });

  // Start at Scene 1
  goToScene(1);
}
