/**
 * Royal Background Music Manager
 * Song: Wedding Shehnai (Ustad Bismillah Khan - Mangal Parinay)
 * Continuous, Uniform, Seamless, and Resilient Across All Scene Transitions
 */

import './audio.css';

const PLAYLIST = [
  {
    id: 'wedding-shehnai',
    title: 'Wedding Shehnai',
    film: 'Mangal Parinay',
    artist: 'Ustad Bismillah Khan',
    src: '/assets/audio/wedding_shehnai.mp3',
  },
];

let currentTrackIndex = 0;
let audioElement = null;
let musicContainer = null;
let trackNameEl = null;
let tooltipEl = null;
let isPlaying = false;
let isMutedByUser = false;
let fadeInterval = null;

const TARGET_VOLUME = 0.55;

/**
 * Smoothly ramps audio volume up or down
 * @param {HTMLAudioElement} audio
 * @param {number} target
 * @param {number} durationMs
 * @param {Function} [onDone]
 */
function fadeVolume(audio, target, durationMs = 700, onDone = null) {
  if (!audio) return;
  if (fadeInterval) clearInterval(fadeInterval);

  const start = audio.volume;
  const diff = target - start;
  if (Math.abs(diff) < 0.01) {
    audio.volume = target;
    if (onDone) onDone();
    return;
  }

  const steps = 20;
  const stepTime = durationMs / steps;
  let currentStep = 0;

  fadeInterval = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps;
    // Ease-in-out curve
    const ease = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;

    const newVol = Math.max(0, Math.min(1, start + diff * ease));
    audio.volume = newVol;

    if (currentStep >= steps) {
      clearInterval(fadeInterval);
      fadeInterval = null;
      audio.volume = target;
      if (onDone) onDone();
    }
  }, stepTime);
}

/**
 * Updates UI with playback state
 */
function updateUI() {
  if (!musicContainer) return;

  const speakerBtn = musicContainer.querySelector('.royal-music-btn');

  if (isPlaying && !audioElement.paused) {
    musicContainer.classList.remove('muted');
    musicContainer.classList.add('playing');
    if (speakerBtn) {
      speakerBtn.setAttribute('aria-label', 'Mute wedding music');
      speakerBtn.setAttribute('title', 'Mute Music');
    }
    if (tooltipEl) {
      tooltipEl.textContent = 'Mute Music';
    }
  } else {
    musicContainer.classList.remove('playing');
    musicContainer.classList.add('muted');
    if (speakerBtn) {
      speakerBtn.setAttribute('aria-label', 'Play wedding music');
      speakerBtn.setAttribute('title', 'Play Music');
    }
    if (tooltipEl) {
      tooltipEl.textContent = 'Play Music';
    }
  }
}

/**
 * Loads a track from the playlist and plays it
 * @param {number} index
 * @param {boolean} autoPlay
 */
function switchTrack(index, autoPlay = true) {
  if (!audioElement) return;
  currentTrackIndex = (index + PLAYLIST.length) % PLAYLIST.length;
  const track = PLAYLIST[currentTrackIndex];

  const wasPlaying = isPlaying && !audioElement.paused;

  if (wasPlaying) {
    fadeVolume(audioElement, 0, 300, () => {
      audioElement.src = track.src;
      audioElement.currentTime = 0;
      if (autoPlay && !isMutedByUser) {
        audioElement.play().then(() => {
          isPlaying = true;
          updateUI();
          fadeVolume(audioElement, TARGET_VOLUME, 700);
        }).catch(() => {
          isPlaying = false;
          updateUI();
        });
      } else {
        isPlaying = false;
        updateUI();
      }
    });
  } else {
    audioElement.src = track.src;
    audioElement.currentTime = 0;
    if (autoPlay && !isMutedByUser) {
      playAudio();
    } else {
      updateUI();
    }
  }
}

/**
 * Attempts to play the current audio track with smooth fade-in
 */
async function playAudio() {
  if (!audioElement || isMutedByUser) return;

  try {
    if (audioElement.paused) {
      audioElement.volume = 0;
      await audioElement.play();
    }
    isPlaying = true;
    updateUI();
    fadeVolume(audioElement, TARGET_VOLUME, 800);
  } catch {
    // Autoplay prevented by browser security policy before user interaction
    isPlaying = false;
    updateUI();
  }
}

/**
 * Pauses or mutes the audio with smooth fade-out
 */
function pauseAudio() {
  if (!audioElement) return;

  fadeVolume(audioElement, 0, 350, () => {
    audioElement.pause();
    isPlaying = false;
    updateUI();
  });
}

/**
 * Toggles music playback on user interaction
 */
function toggleMusic() {
  if (!audioElement) return;

  if (isPlaying && !audioElement.paused) {
    isMutedByUser = true;
    pauseAudio();
  } else {
    isMutedByUser = false;
    playAudio();
  }
}

/**
 * Switches to next track in playlist
 */
function nextTrack() {
  switchTrack(currentTrackIndex + 1, true);
}

/**
 * Sets up the global persistent audio controller
 */
export function initAudioManager() {
  if (document.getElementById('royal-music-container')) return;

  // 1. Persistent Audio Element (Mounted directly on document.body outside #app)
  audioElement = document.createElement('audio');
  audioElement.id = 'royal-wedding-audio';
  audioElement.src = PLAYLIST[0].src;
  audioElement.preload = 'auto';
  audioElement.loop = true;
  audioElement.volume = 0;
  audioElement.setAttribute('aria-hidden', 'true');
  document.body.appendChild(audioElement);

  // Automatically replay when song finishes
  audioElement.addEventListener('ended', () => {
    audioElement.currentTime = 0;
    audioElement.play().catch(() => {});
  });

  // 2. Speaker Controller Medallion Container
  musicContainer = document.createElement('div');
  musicContainer.id = 'royal-music-container';
  musicContainer.className = 'royal-music-container muted';

  musicContainer.innerHTML = `
    <!-- Master Speaker Medallion Button -->
    <button
      id="royal-music-btn"
      class="royal-music-btn"
      type="button"
      aria-label="Play background wedding music"
      title="Play/Mute Wedding Music"
    >
      <span class="royal-music-pulse" aria-hidden="true"></span>
      <span class="royal-music-icon-wrap" aria-hidden="true">
        <!-- Playing Speaker with Audio Wave Arcs -->
        <svg class="royal-music-icon icon-playing" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fill-opacity="0.35"></polygon>
          <path class="sound-wave wave-1" d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path class="sound-wave wave-2" d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
        <!-- Muted Speaker with Cross Slash -->
        <svg class="royal-music-icon icon-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fill-opacity="0.25"></polygon>
          <line x1="22" y1="9" x2="16" y2="15"></line>
          <line x1="16" y1="9" x2="22" y2="15"></line>
        </svg>
      </span>
    </button>

    <div class="royal-music-tooltip" aria-hidden="true">Mute Music</div>
  `;

  document.body.appendChild(musicContainer);

  tooltipEl = musicContainer.querySelector('.royal-music-tooltip');
  const speakerBtn = musicContainer.querySelector('.royal-music-btn');

  // 3. Speaker Button Click / Keyboard (Toggles Mute / Unmute)
  if (speakerBtn) {
    speakerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });

    speakerBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        toggleMusic();
      }
    });
  }

  // 4. Autoplay on initial load (if allowed by browser policy)
  playAudio();

  // 6. Automatic Audio Unlock on First User Gesture anywhere on page
  // (Tapping wax seal, clicking, scrolling, or touching triggers seamless playback)
  const unlockAudioOnGesture = () => {
    if (!isMutedByUser && (!isPlaying || audioElement.paused)) {
      playAudio();
    }
  };

  const gestureEvents = ['click', 'pointerdown', 'touchstart', 'keydown'];
  gestureEvents.forEach((evt) => {
    window.addEventListener(evt, unlockAudioOnGesture, { once: true, passive: true });
  });

  // 7. Page Visibility Lifecycle (Smooth pause on background tab, resume on return)
  document.addEventListener('visibilitychange', () => {
    if (!audioElement || isMutedByUser) return;

    if (document.hidden) {
      if (isPlaying) {
        fadeVolume(audioElement, 0, 400, () => audioElement.pause());
      }
    } else {
      if (isPlaying && audioElement.paused) {
        audioElement.play().then(() => {
          fadeVolume(audioElement, TARGET_VOLUME, 700);
        }).catch(() => {});
      }
    }
  });

  // 8. Global API Exposure
  window.royalAudio = {
    play: playAudio,
    pause: pauseAudio,
    toggle: toggleMusic,
    next: nextTrack,
    switchTrack,
    getPlaylist: () => PLAYLIST,
    getCurrentTrack: () => PLAYLIST[currentTrackIndex],
    isPlaying: () => isPlaying && !audioElement.paused,
    isMuted: () => isMutedByUser,
  };

  updateUI();
}
