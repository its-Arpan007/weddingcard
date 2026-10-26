/**
 * Royal Background Music Manager
 * Songs: "Aaj Se Teri" (Pad Man) & "Kudmayi" (Rocky Aur Rani Kii Prem Kahaani)
 * Continuous, Uniform, Seamless, and Resilient Across All Scene Transitions
 */

import './audio.css';

const PLAYLIST = [
  {
    id: 'aaj-se-teri',
    title: 'Aaj Se Teri',
    film: 'Pad Man',
    artist: 'Arijit Singh',
    src: '/assets/audio/aaj_se_teri.mp3',
  },
  {
    id: 'kudmayi',
    title: 'Kudmayi',
    film: 'Rocky Aur Rani',
    artist: 'Shahid Mallya',
    src: '/assets/audio/kudmayi.mp3',
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
 * Updates UI with current track info and playback state
 */
function updateUI() {
  if (!musicContainer) return;
  const track = PLAYLIST[currentTrackIndex];

  if (trackNameEl) {
    trackNameEl.textContent = track.title;
  }

  const speakerBtn = musicContainer.querySelector('.royal-music-btn');

  if (isPlaying && !audioElement.paused) {
    musicContainer.classList.remove('muted');
    musicContainer.classList.add('playing');
    if (speakerBtn) {
      speakerBtn.setAttribute('aria-label', `Mute music (Playing: ${track.title})`);
      speakerBtn.setAttribute('title', `Mute music (Playing: ${track.title})`);
    }
    if (tooltipEl) {
      tooltipEl.textContent = `Playing: ${track.title} • Click to Mute`;
    }
  } else {
    musicContainer.classList.remove('playing');
    musicContainer.classList.add('muted');
    if (speakerBtn) {
      speakerBtn.setAttribute('aria-label', `Play music (${track.title})`);
      speakerBtn.setAttribute('title', `Play music (${track.title})`);
    }
    if (tooltipEl) {
      tooltipEl.textContent = `Muted (${track.title}) • Click to Play`;
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
  audioElement.volume = 0;
  audioElement.setAttribute('aria-hidden', 'true');
  document.body.appendChild(audioElement);

  // Automatically advance to next song when current finishes
  audioElement.addEventListener('ended', () => {
    nextTrack();
  });

  // 2. Speaker Controller & Playlist Container
  musicContainer = document.createElement('div');
  musicContainer.id = 'royal-music-container';
  musicContainer.className = 'royal-music-container muted';

  musicContainer.innerHTML = `
    <!-- Song Info & Next Track Switcher Pill -->
    <div class="royal-music-pill" role="status" aria-live="polite">
      <span class="royal-music-track-note" aria-hidden="true">♪</span>
      <span class="royal-music-track-name">${PLAYLIST[0].title}</span>
      <button
        type="button"
        class="royal-music-skip-btn"
        aria-label="Skip to next song"
        title="Switch Song (Aaj Se Teri / Kudmayi)"
      >
        ⏭
      </button>
    </div>

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

    <div class="royal-music-tooltip" aria-hidden="true">Playing: Aaj Se Teri • Click to Mute</div>
  `;

  document.body.appendChild(musicContainer);

  trackNameEl = musicContainer.querySelector('.royal-music-track-name');
  tooltipEl = musicContainer.querySelector('.royal-music-tooltip');
  const speakerBtn = musicContainer.querySelector('.royal-music-btn');
  const skipBtn = musicContainer.querySelector('.royal-music-skip-btn');
  const pillEl = musicContainer.querySelector('.royal-music-pill');

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

  // 4. Skip Button Click (Switches between Aaj Se Teri and Kudmayi)
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextTrack();
    });
  }

  // Clicking pill also skips to next track
  if (pillEl) {
    pillEl.addEventListener('click', (e) => {
      // If clicking inside skipBtn, let skipBtn handle it
      if (e.target.closest('.royal-music-skip-btn')) return;
      nextTrack();
    });
    pillEl.style.cursor = 'pointer';
    pillEl.setAttribute('title', 'Click to switch between Aaj Se Teri & Kudmayi');
  }

  // 5. Autoplay on initial load (if allowed by browser policy)
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
