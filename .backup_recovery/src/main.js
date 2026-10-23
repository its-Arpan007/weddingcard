/**
 * Main Entry Point — Indian Wedding Invitation
 * Six-Scene Cinematic Experience
 */

import './style.css';
import { initSceneManager } from './sceneManager.js';

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSceneManager);
} else {
  initSceneManager();
}
