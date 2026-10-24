/**
 * Scene Manager — Six-Scene Architecture
 *
 * Manages scene transitions, lifecycle (create, init, destroy),
 * and provides a global navigation API.
 * High-performance edition with zero-layout-thrash transitions.
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
const removalTimeouts = {};

/**
 * Navigate to a scene by number.
 * @param {number} sceneNum - Scene number (1-6)
 */
function goToScene(sceneNum) {
  const app = document.getElementById('app');
  if (!app) return;

  if (sceneNum === currentScene) return;

  const sceneDef = scenes[sceneNum];
  if (!sceneDef) {
    console.warn(`Scene ${sceneNum} not found.`);
    return;
  }

  // Cancel any pending DOM removal for this target scene
  if (removalTimeouts[sceneNum]) {
    clearTimeout(removalTimeouts[sceneNum]);
    delete removalTimeouts[sceneNum];
  }

  const prevSceneNum = currentScene;
  currentScene = sceneNum;

  // Check if scene DOM already exists
  let sceneEl = document.getElementById(`scene-${sceneNum}`);
  if (!sceneEl) {
    const html = sceneDef.create();
    app.insertAdjacentHTML('beforeend', html);
    sceneEl = document.getElementById(`scene-${sceneNum}`);
  }

  // Smoothly activate new scene via requestAnimationFrame
  if (sceneEl) {
    sceneEl.style.opacity = '';
    sceneEl.style.pointerEvents = '';
    sceneEl.style.transition = '';
    requestAnimationFrame(() => {
      sceneEl.classList.add('active');
    });
  }

  // Initialize the new scene
  sceneDef.init();

  // Stop previous scene's animation loops immediately to free up GPU & CPU during transition
  if (prevSceneNum && prevSceneNum !== sceneNum && scenes[prevSceneNum]) {
    try {
      scenes[prevSceneNum].destroy();
    } catch {
      // safe cleanup
    }

    const prevEl = document.getElementById(`scene-${prevSceneNum}`);
    if (prevEl) {
      prevEl.classList.remove('active');
      prevEl.style.opacity = '0';
      prevEl.style.pointerEvents = 'none';
      prevEl.style.transition = 'opacity 0.4s ease-out';
      
      const sNum = prevSceneNum;
      removalTimeouts[sNum] = setTimeout(() => {
        if (currentScene !== sNum && prevEl.parentNode) {
          prevEl.remove();
        }
        delete removalTimeouts[sNum];
      }, 420);
    }
  }
}

function prevScene() {
  if (currentScene > 1) {
    goToScene(currentScene - 1);
  }
}

function nextScene() {
  if (currentScene < 6) {
    goToScene(currentScene + 1);
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
  window.sceneManager = { goToScene, prevScene, nextScene, getCurrentScene: () => currentScene };

  // Listen for custom navigation events
  window.addEventListener('scene:navigate', (e) => {
    const { scene } = e.detail || {};
    if (scene) goToScene(scene);
  });

  // Start at Scene 1
  goToScene(1);
}
