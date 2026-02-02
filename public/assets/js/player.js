/**
 * Sofa2Slugger Session Player
 * Audio player with voice, music, and bell synchronization
 * Handles premium access for sessions 2-10
 *
 * Audio Sources (from /audio/Golden_Box/):
 * - Voice: s1draft.mp3 through s10draft.mp3
 * - Music: session-01-music.mp3 through session-10-music.mp3
 * - Bell: bell
 *
 * Bell Rules:
 * - Session 9: 3 rounds x 1 min = bell at 0s, 60s, 120s, 180s, 240s, 300s (if audio allows)
 * - Session 10: 1 round x 3 min = bell at 0s, 180s
 */

// ============================================
// DOM ELEMENTS
// ============================================
var player = document.getElementById('player');
var sessionTitle = document.getElementById('session-title');
var sessionNumber = document.getElementById('session-number');
var audioElement = document.getElementById('session-audio');
var progressBar = document.getElementById('progress-bar');
var currentTimeEl = document.getElementById('current-time');
var durationEl = document.getElementById('duration');
var playpauseIcon = document.getElementById('playpause-icon');

// Buttons
var btnPlayPause = document.getElementById('btn-playpause');
var btnBack15 = document.getElementById('btn-back15');
var btnStop = document.getElementById('btn-stop');
var btnClosePlayer = document.getElementById('btn-close-player');
var btnPlaySession1 = document.getElementById('btn-play-session1');

// Manifesto elements
var manifestoBlock = document.getElementById('manifesto-block');
var btnManifesto = document.getElementById('btn-manifesto');
var manifestoStatus = document.getElementById('manifesto-status');
var manifestoAudio = null;
var isManifestoPlaying = false;

// ============================================
// AUDIO SYSTEM - Voice, Music, Bell
// ============================================
var musicElement = null;
var bellSound = null;
var bellTimers = [];
var musicVolume = 0.15; // Music at 15% volume behind voice

// ============================================
// CONSTANTS
// ============================================
var STORAGE_KEY_MANIFESTO_HEARD = 's2s_manifesto_heard';
var STORAGE_KEY_PAID = 's2s_premium_access';
var STORAGE_KEY_SESSION_PREFIX = 's2s_session_';

var SESSION_NAMES = {
  1: 'Where It Begins',
  2: 'Finding Your Base',
  3: 'The First Tool',
  4: 'Bringing It Through',
  5: 'Settling Into Rhythm',
  6: 'Holding Your Shape',
  7: 'Choosing When',
  8: 'Knowing the Distance',
  9: 'Staying Protected',
  10: 'The Full Round'
};

// Sessions with audio available
var AVAILABLE_SESSIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Bell timing configuration (in seconds from start)
// Session 9: 3 rounds x 1 minute each = 6 bells total
//   - Start R1 (0s), End R1 (60s), Start R2 (60.5s), End R2 (120s), Start R3 (120.5s), End R3 (180s)
// Session 10: 1 round x 3 minutes = 2 bells total
//   - Start (0s), End (180s)
var BELL_TIMES = {
  9: [0, 60, 60.5, 120, 120.5, 180],  // 6 bells: double-tap at round transitions
  10: [0, 180]  // 2 bells: start and end of 3-minute round
};

// Current session being played
var currentSession = null;

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  var mins = Math.floor(seconds / 60);
  var secs = Math.floor(seconds % 60);
  return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function isPremium() {
  return localStorage.getItem(STORAGE_KEY_PAID) === 'true';
}

function padSessionNum(num) {
  return num < 10 ? '0' + num : '' + num;
}

// Audio paths - now using Golden_Box
function getVoicePath(sessionNum) {
  return '/audio/Golden_Box/s' + sessionNum + 'draft.mp3';
}

function getMusicPath(sessionNum) {
  return '/audio/Golden_Box/session-' + padSessionNum(sessionNum) + '-music.mp3';
}

function getBellPath() {
  return '/audio/Golden_Box/bell';
}

function isSessionAvailable(sessionNum) {
  return AVAILABLE_SESSIONS.indexOf(sessionNum) !== -1;
}

function canPlaySession(sessionNum) {
  // Session 1 is always free
  if (sessionNum === 1) return true;
  // Sessions 2-10 require premium
  if (sessionNum >= 2 && sessionNum <= 10) {
    return isPremium() && isSessionAvailable(sessionNum);
  }
  return false;
}

function markSessionComplete(sessionNum) {
  localStorage.setItem(STORAGE_KEY_SESSION_PREFIX + sessionNum, 'complete');
}

function showSession1CompleteBlock() {
  var completeBlock = document.getElementById('session1-complete');
  if (completeBlock) {
    completeBlock.classList.remove('hidden');
    completeBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function hideSession1CompleteBlock() {
  var completeBlock = document.getElementById('session1-complete');
  if (completeBlock) {
    completeBlock.classList.add('hidden');
  }
}

// ============================================
// BELL SYSTEM
// ============================================
function preloadBell() {
  if (!bellSound) {
    bellSound = new Audio(getBellPath());
    bellSound.preload = 'auto';
    bellSound.volume = 0.8;
  }
}

function playBell() {
  if (bellSound) {
    // Clone the audio to allow overlapping plays if needed
    var bell = bellSound.cloneNode();
    bell.volume = 0.8;
    bell.play().catch(function(err) {
      console.log('Bell play error:', err);
    });
  }
}

function clearBellTimers() {
  bellTimers.forEach(function(timer) {
    clearTimeout(timer);
  });
  bellTimers = [];
}

function scheduleBells(sessionNum) {
  clearBellTimers();

  var times = BELL_TIMES[sessionNum];
  if (!times || times.length === 0) return;

  console.log('[Bell] Scheduling bells for session ' + sessionNum + ':', times);

  times.forEach(function(time, index) {
    var timer = setTimeout(function() {
      console.log('[Bell] Ring! (scheduled at ' + time + 's, bell #' + (index + 1) + ')');
      playBell();
    }, time * 1000);
    bellTimers.push(timer);
  });
}

// ============================================
// MUSIC SYSTEM
// ============================================
function createMusicElement(sessionNum) {
  // Clean up existing music
  if (musicElement) {
    musicElement.pause();
    musicElement.src = '';
    musicElement = null;
  }

  musicElement = new Audio(getMusicPath(sessionNum));
  musicElement.volume = musicVolume;
  musicElement.loop = true; // Loop music throughout session
  musicElement.preload = 'auto';

  return musicElement;
}

function startMusic() {
  if (musicElement) {
    musicElement.currentTime = 0;
    musicElement.play().catch(function(err) {
      console.log('Music autoplay blocked:', err);
    });
  }
}

function pauseMusic() {
  if (musicElement) {
    musicElement.pause();
  }
}

function stopMusic() {
  if (musicElement) {
    musicElement.pause();
    musicElement.currentTime = 0;
  }
}

function syncMusicToVoice() {
  // Keep music in sync with voice playback state
  if (musicElement && audioElement) {
    if (audioElement.paused) {
      musicElement.pause();
    } else {
      musicElement.play().catch(function() {});
    }
  }
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================
function updateSessionCards() {
  var premium = isPremium();

  document.querySelectorAll('.session-card').forEach(function(card) {
    var num = parseInt(card.getAttribute('data-session'));
    var btn = card.querySelector('.session-play');
    var statusEl = card.querySelector('.session-status');

    if (num === 1) {
      // Session 1 always unlocked
      card.classList.remove('locked');
      card.classList.remove('coming-soon');
      if (btn) {
        btn.disabled = false;
        btn.setAttribute('data-session', num);
        btn.textContent = 'Play';
      }
    } else if (premium && isSessionAvailable(num)) {
      // Premium users - all available sessions unlocked
      card.classList.remove('locked');
      card.classList.remove('coming-soon');
      if (btn) {
        btn.disabled = false;
        btn.setAttribute('data-session', num);
        btn.textContent = 'Play';
      }
      if (statusEl) {
        statusEl.textContent = 'Unlocked';
        statusEl.classList.remove('session-locked');
        statusEl.classList.add('session-unlocked');
      }
    } else {
      // Non-premium users - LOCKED
      card.classList.add('locked');
      card.classList.remove('coming-soon');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Unlock';
      }
      if (statusEl) {
        statusEl.textContent = 'Locked';
        statusEl.classList.add('session-locked');
        statusEl.classList.remove('session-unlocked');
      }
    }
  });

  // Update unlock CTA visibility
  var ctaUnlock = document.querySelector('.cta-unlock');
  if (ctaUnlock) {
    ctaUnlock.style.display = premium ? 'none' : 'flex';
  }

  // Hide Session 1 complete block for premium users
  if (premium) {
    hideSession1CompleteBlock();
  }
}

// ============================================
// MANIFESTO LOGIC
// ============================================
function initManifesto() {
  // Hide manifesto block for returning users
  if (localStorage.getItem(STORAGE_KEY_MANIFESTO_HEARD) === 'true') {
    if (manifestoBlock) manifestoBlock.style.display = 'none';
    return;
  }

  if (!btnManifesto) return;

  btnManifesto.addEventListener('click', function() {
    if (isManifestoPlaying) {
      // Stop manifesto
      if (manifestoAudio) {
        manifestoAudio.pause();
        manifestoAudio.currentTime = 0;
      }
      isManifestoPlaying = false;
      btnManifesto.innerHTML = '<span class="manifesto-icon">&#9654;</span><span class="manifesto-label">Play Manifesto</span>';
      manifestoStatus.textContent = '';
    } else {
      // Play manifesto
      manifestoAudio = new Audio('/audio/music/manifesto.mp3');
      manifestoAudio.play();
      isManifestoPlaying = true;
      btnManifesto.innerHTML = '<span class="manifesto-icon">&#9632;</span><span class="manifesto-label">Stop</span>';
      manifestoStatus.textContent = 'Playing...';

      manifestoAudio.addEventListener('ended', function() {
        isManifestoPlaying = false;
        btnManifesto.innerHTML = '<span class="manifesto-icon">&#9654;</span><span class="manifesto-label">Play Manifesto</span>';
        manifestoStatus.textContent = 'Ready to train? Hit Play Session 1.';
        localStorage.setItem(STORAGE_KEY_MANIFESTO_HEARD, 'true');
      });

      manifestoAudio.addEventListener('error', function() {
        isManifestoPlaying = false;
        btnManifesto.innerHTML = '<span class="manifesto-icon">&#9654;</span><span class="manifesto-label">Play Manifesto</span>';
        manifestoStatus.textContent = 'Error loading audio';
      });
    }
  });
}

// ============================================
// PLAYER FUNCTIONS
// ============================================
function showPlayer(sessionNum) {
  if (!canPlaySession(sessionNum)) {
    if (!isPremium() && sessionNum > 1) {
      // Redirect to unlock
      window.location.href = 'https://buy.stripe.com/dRm7sM73Y3E80Unctn8k801';
    }
    return;
  }

  // Stop manifesto if playing
  if (isManifestoPlaying && manifestoAudio) {
    manifestoAudio.pause();
    manifestoAudio.currentTime = 0;
    isManifestoPlaying = false;
    if (btnManifesto) {
      btnManifesto.innerHTML = '<span class="manifesto-icon">&#9654;</span><span class="manifesto-label">Play Manifesto</span>';
    }
    if (manifestoStatus) manifestoStatus.textContent = '';
  }

  // Clear any existing bell timers
  clearBellTimers();

  // Stop any existing music
  stopMusic();

  currentSession = sessionNum;

  // Update UI
  sessionNumber.textContent = sessionNum;
  sessionTitle.textContent = SESSION_NAMES[sessionNum] || 'Session ' + sessionNum;

  // Load voice audio from Golden_Box
  var voiceSrc = getVoicePath(sessionNum);
  console.log('[Player] Loading voice:', voiceSrc);
  audioElement.src = voiceSrc;
  audioElement.load();

  // Create music element for this session
  createMusicElement(sessionNum);
  console.log('[Player] Loading music:', getMusicPath(sessionNum));

  // Preload bell sound
  preloadBell();

  // Reset UI
  progressBar.value = 0;
  currentTimeEl.textContent = '0:00';
  durationEl.textContent = '0:00';
  playpauseIcon.innerHTML = '&#9654;';

  // Show player (slide up)
  player.classList.remove('hidden');

  // Auto-play
  audioElement.play().then(function() {
    // Start music when voice starts
    startMusic();
    // Schedule bells for sessions 9 and 10
    if (sessionNum === 9 || sessionNum === 10) {
      scheduleBells(sessionNum);
    }
  }).catch(function(err) {
    console.log('Auto-play blocked:', err);
  });
}

function hidePlayer() {
  audioElement.pause();
  audioElement.currentTime = 0;
  stopMusic();
  clearBellTimers();
  player.classList.add('hidden');
  currentSession = null;
}

function togglePlayPause() {
  if (audioElement.paused) {
    audioElement.play().then(function() {
      startMusic();
      // Reschedule bells from current position if session 9 or 10
      if (currentSession === 9 || currentSession === 10) {
        rescheduleRemainingBells();
      }
    });
  } else {
    audioElement.pause();
    pauseMusic();
    clearBellTimers(); // Clear timers when paused
  }
}

function rescheduleRemainingBells() {
  clearBellTimers();

  var times = BELL_TIMES[currentSession];
  if (!times) return;

  var currentTime = audioElement.currentTime;

  times.forEach(function(time, index) {
    if (time > currentTime) {
      var delay = (time - currentTime) * 1000;
      var timer = setTimeout(function() {
        console.log('[Bell] Ring! (rescheduled, bell #' + (index + 1) + ')');
        playBell();
      }, delay);
      bellTimers.push(timer);
    }
  });
}

function skipBack15() {
  audioElement.currentTime = Math.max(0, audioElement.currentTime - 15);
  // Reschedule bells after seeking
  if ((currentSession === 9 || currentSession === 10) && !audioElement.paused) {
    rescheduleRemainingBells();
  }
}

function stopAudio() {
  audioElement.pause();
  audioElement.currentTime = 0;
  stopMusic();
  clearBellTimers();
  playpauseIcon.innerHTML = '&#9654;';
}

// ============================================
// AUDIO EVENT LISTENERS
// ============================================
audioElement.addEventListener('loadedmetadata', function() {
  durationEl.textContent = formatTime(audioElement.duration);
  progressBar.max = audioElement.duration;
});

audioElement.addEventListener('timeupdate', function() {
  currentTimeEl.textContent = formatTime(audioElement.currentTime);
  progressBar.value = audioElement.currentTime;
});

audioElement.addEventListener('play', function() {
  playpauseIcon.innerHTML = '&#10074;&#10074;';
  // Ensure music is playing when voice plays
  if (musicElement && musicElement.paused) {
    musicElement.play().catch(function() {});
  }
});

audioElement.addEventListener('pause', function() {
  playpauseIcon.innerHTML = '&#9654;';
  // Pause music when voice pauses
  pauseMusic();
});

audioElement.addEventListener('ended', function() {
  playpauseIcon.innerHTML = '&#9654;';
  progressBar.value = 0;
  currentTimeEl.textContent = '0:00';

  // Stop music and clear bells
  stopMusic();
  clearBellTimers();

  // Mark session as complete
  if (currentSession) {
    markSessionComplete(currentSession);

    // Show conversion block after Session 1 for non-premium users
    if (currentSession === 1 && !isPremium()) {
      showSession1CompleteBlock();
    }
  }
});

// Progress bar scrubbing
progressBar.addEventListener('input', function() {
  audioElement.currentTime = progressBar.value;
  // Reschedule bells after seeking
  if ((currentSession === 9 || currentSession === 10) && !audioElement.paused) {
    rescheduleRemainingBells();
  }
});

// ============================================
// BUTTON EVENT LISTENERS
// ============================================
btnPlayPause.addEventListener('click', togglePlayPause);
btnBack15.addEventListener('click', skipBack15);
btnStop.addEventListener('click', stopAudio);
btnClosePlayer.addEventListener('click', hidePlayer);

// Play Session 1 CTA
if (btnPlaySession1) {
  btnPlaySession1.addEventListener('click', function() {
    showPlayer(1);
  });
}

// Session card click handlers
document.querySelectorAll('.session-card').forEach(function(card) {
  card.addEventListener('click', function() {
    var num = parseInt(this.getAttribute('data-session'));
    if (canPlaySession(num)) {
      showPlayer(num);
    }
  });
});

document.querySelectorAll('.session-play').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    var num = parseInt(this.getAttribute('data-session'));
    if (canPlaySession(num)) {
      showPlayer(num);
    }
  });
});

// ============================================
// PAYMENT SUCCESS HANDLING
// ============================================
function checkPaymentSuccess() {
  var urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('payment') === 'success') {
    localStorage.setItem(STORAGE_KEY_PAID, 'true');
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
    // Update UI
    updateSessionCards();
    console.log('Payment successful! All sessions unlocked.');
  }
}

// ============================================
// INITIALIZE
// ============================================
checkPaymentSuccess();
initManifesto();
updateSessionCards();
preloadBell(); // Preload bell sound on page load

console.log('[S2S Player] Initialized - Golden Box audio system active');
