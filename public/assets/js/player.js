/**
 * Sofa2Slugger Session Player
 * Audio player with play/pause, skip back 15s, stop controls
 * Handles premium access for sessions 2-10
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

// Sessions with audio available (session 10 coming soon)
var AVAILABLE_SESSIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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

function getSessionAudioPath(sessionNum) {
  return '/audio/session' + padSessionNum(sessionNum) + '.final.mp3';
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
    // Scroll to make it visible
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
      // Status stays "Free"
    } else if (num === 10) {
      // Session 10 - Coming Soon (no audio yet)
      card.classList.add('locked');
      card.classList.add('coming-soon');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Soon';
      }
      if (statusEl) {
        statusEl.textContent = 'Coming Soon';
        statusEl.classList.remove('session-locked');
        statusEl.classList.add('session-unlocked');
      }
    } else if (premium && isSessionAvailable(num)) {
      // Sessions 2-9 for premium users
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
      // Sessions 2-9 for non-premium users - LOCKED
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
        // Mark as heard
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

  currentSession = sessionNum;

  // Update UI
  sessionNumber.textContent = sessionNum;
  sessionTitle.textContent = SESSION_NAMES[sessionNum] || 'Session ' + sessionNum;

  // Load audio for the selected session
  var audioSrc = getSessionAudioPath(sessionNum);
  audioElement.src = audioSrc;
  audioElement.load();

  // Reset UI
  progressBar.value = 0;
  currentTimeEl.textContent = '0:00';
  durationEl.textContent = '0:00';
  playpauseIcon.innerHTML = '&#9654;';

  // Show player (slide up)
  player.classList.remove('hidden');

  // Auto-play
  audioElement.play().catch(function(err) {
    console.log('Auto-play blocked:', err);
  });
}

function hidePlayer() {
  audioElement.pause();
  audioElement.currentTime = 0;
  player.classList.add('hidden');
  currentSession = null;
}

function togglePlayPause() {
  if (audioElement.paused) {
    audioElement.play();
  } else {
    audioElement.pause();
  }
}

function skipBack15() {
  audioElement.currentTime = Math.max(0, audioElement.currentTime - 15);
}

function stopAudio() {
  audioElement.pause();
  audioElement.currentTime = 0;
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
});

audioElement.addEventListener('pause', function() {
  playpauseIcon.innerHTML = '&#9654;';
});

audioElement.addEventListener('ended', function() {
  playpauseIcon.innerHTML = '&#9654;';
  progressBar.value = 0;
  currentTimeEl.textContent = '0:00';

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
    // Show success message (optional)
    console.log('Payment successful! All sessions unlocked.');
  }
}

// ============================================
// INITIALIZE
// ============================================
checkPaymentSuccess();
initManifesto();
updateSessionCards();
