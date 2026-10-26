/**
 * Main Entry Point — Indian Wedding Invitation
 * Six-Scene Cinematic Experience
 */

import './style.css';
import { initSceneManager } from './sceneManager.js';
import { initAudioManager } from './audioManager.js';

function startApp() {
  initSceneManager();
  initAudioManager();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}

