/**
 * Sofa2Slugger Session Player
 *
 * Audio flow per session:
 * 1. Vance intro (no music, dry)
 * 2. Complete session block (warmup + coaching + outro with music baked in)
 *    - Music fades in ~5 seconds after session starts
 *    - Music continues through outro
 *    - Music fades out ~3 seconds after final spoken word
 *
 * Audio file naming convention:
 * - /audio/vance-s{NN}-intro.mp3 (intro narration, no music)
 * - /audio/session-{N}-complete.mp3 (complete session with music baked in)
 * - /audio/manifesto.mp3 (manifesto, no music)
 */

// Private unlock hook
const params = new URLSearchParams(window.location.search);
if (params.get("unlock") === "friend") {
  localStorage.setItem("s2s_full_access", "true");
}

var currentSession = null;
var phase = 'ready'; // ready | intro | session | done
var isPaused = false;

// var intro = null; (Removed)
var sessionAudio = null;
// var outro = null; (Removed)

var player = document.getElementById('player');
var sessionTitle = document.getElementById('session-title');
var phaseDisplay = document.getElementById('phase');
var btnPlay = document.getElementById('btn-play');
var btnPause = document.getElementById('btn-pause');
var btnStop = document.getElementById('btn-stop');
var btnPrev = document.getElementById('btn-prev');
var btnNext = document.getElementById('btn-next');

// Paywall check
var STORAGE_KEY_PAID = "s2s_premium_access";
function isPremium() {
  return localStorage.getItem(STORAGE_KEY_PAID) === 'true' ||
    localStorage.getItem("s2s_full_access") === "true";
}

// Redirect to pricing
function showPaywall() {
  if (confirm("Sessions 2-10 are locked.\n\nUnlock full access for \u00A39.99?")) {
    window.location.href = "index.html#pricing";
  }
}

// Initialize Locks
function initLocks() {
  var hasAccess = isPremium();
  var allCards = document.querySelectorAll('.session-card');

  allCards.forEach(function (card) {
    var num = parseInt(card.getAttribute('data-session'));
    var btn = card.querySelector('button');

    if (num > 1) {
      if (hasAccess) {
        // Unlock
        card.classList.remove('locked');
        if (btn) btn.disabled = false;
      } else {
        // Lock (ensure state)
        card.classList.add('locked');
        if (btn) btn.disabled = true;
      }
    }
  });
}

// Run lock check immediately
initLocks();

// Re-select cards after potential unlock
var sessionCards = document.querySelectorAll('.session-card');
sessionCards.forEach(function (card) {
  // Card click (fallback/general)
  card.addEventListener('click', function (e) {
    // If we clicked a button, ignore this listener (let the button listener handle it)
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

    var num = parseInt(this.getAttribute('data-session'));
    if (this.classList.contains('locked')) {
      showPaywall();
      return;
    }
    loadSession(num, true);
  });
});

// Explicit play button handlers
document.querySelectorAll('.session-play').forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    e.stopPropagation(); // Stop bubbling to card
    var num = parseInt(this.getAttribute('data-session'));

    // Check if parent card is locked (double check)
    var card = this.closest('.session-card');
    if (card && card.classList.contains('locked')) {
      // Should be disabled, but just in case
      showPaywall();
      return;
    }

    loadSession(num, true);
  });
});

function loadSession(num, autoPlay) {
  stopAll();
  currentSession = num;

  var padded = num < 10 ? '0' + num : '' + num;

  // Load single final session file
  // Pattern: session-{NN}-final.mp3
  sessionAudio = new Audio('/audio/session-' + padded + '-final.mp3');

  // Wire up sequence (Simple 1-step)
  sessionAudio.addEventListener('ended', onSessionEnd);

  // Error handling
  sessionAudio.addEventListener('error', function (e) {
    console.error("Error playing session " + num, e);
    alert("Error loading audio. Please check connection.");
  });

  // Get session name from card
  var card = document.querySelector('.session-card[data-session="' + num + '"]');
  var name = card ? card.querySelector('.session-name').textContent : '';
  sessionTitle.textContent = 'Session ' + num + ' \u2014 ' + name;

  phaseDisplay.textContent = 'Ready';
  phase = 'ready';
  isPaused = false;
  player.classList.remove('hidden');
  showPlayButton();

  // Scroll player into view smoothly
  setTimeout(function () {
    player.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);

  if (autoPlay) {
    startSession();
  }
}

function showPlayButton() {
  btnPlay.classList.remove('hidden');
  btnPause.classList.add('hidden');
}

function showPauseButton() {
  btnPlay.classList.add('hidden');
  btnPause.classList.remove('hidden');
}

function startSession() {
  if (phase === 'ready') {
    // Single phase: Session
    phase = 'session';
    phaseDisplay.textContent = 'Training';
    sessionAudio.play();
    showPauseButton();
  }
}

function getCurrentAudio() {
  // We now only have one audio object
  return sessionAudio;
}

function pausePlayback() {
  if (isPaused || phase === 'ready' || phase === 'done') return;

  var current = getCurrentAudio();
  if (current) current.pause();

  isPaused = true;
  showPlayButton();
  phaseDisplay.textContent = phaseDisplay.textContent.replace(' (Paused)', '') + ' (Paused)';
}

function resumePlayback() {
  if (!isPaused) return;

  var current = getCurrentAudio();
  if (current) current.play();

  isPaused = false;
  showPauseButton();
  phaseDisplay.textContent = phaseDisplay.textContent.replace(' (Paused)', '');
}

// function onIntroEnd() { ... } // Removed
// function onOutroEnd() { ... } // Removed

function onSessionEnd() {
  phase = 'done';
  phaseDisplay.textContent = 'Complete';
  showPlayButton();

  // Mark session complete
  localStorage.setItem('s2s_session_' + currentSession, 'complete');

  // Analytics
  var payload = {
    event: 'session_completed',
    session_id: currentSession,
    timestamp: new Date().toISOString(),
    completed_timestamp: Date.now(),
    phase: phase
  };

  if (window.dataLayer) window.dataLayer.push(payload);
  else console.log('Analytics Event:', payload);
}

function stopAll() {
  // Analytics: session_abandoned
  // Fire only if we are actually in a playing phase and not just resetting
  if ((phase === 'intro' || phase === 'session' || phase === 'outro') && !isPaused) {
    var current = getCurrentAudio();
    var lastTime = current ? current.currentTime : 0;

    var payload = {
      event: 'session_abandoned',
      session_id: currentSession,
      timestamp: new Date().toISOString(),
      abandoned_timestamp: Date.now(),
      last_playback_position: lastTime,
      phase: phase
    };

    if (window.dataLayer) {
      window.dataLayer.push(payload);
    } else {
      console.log('Analytics Event:', payload);
    }
  }

  if (sessionAudio) { sessionAudio.pause(); sessionAudio.currentTime = 0; }
  // intro/outro objects valid no longer exist
  phase = 'ready';
  isPaused = false;
}

function skipToPrevPhase() {
  if (phase === 'ready' || phase === 'done') return;

  var current = getCurrentAudio();
  if (current) current.currentTime = 0;
}

function skipToNextPhase() {
  if (phase === 'ready' || phase === 'done') return;

  var current = getCurrentAudio();
  if (current) {
    // Trigger the ended event by jumping to end
    current.currentTime = current.duration;
  }
}

// Event listeners
btnPlay.addEventListener('click', function () {
  if (phase === 'ready' || phase === 'done') {
    if (phase === 'done') {
      loadSession(currentSession, true);
    } else {
      startSession();
    }
  } else if (isPaused) {
    resumePlayback();
  }
});

btnPause.addEventListener('click', function () {
  pausePlayback();
});

btnStop.addEventListener('click', function () {
  stopAll();
  phaseDisplay.textContent = 'Stopped';
  showPlayButton();
});

btnPrev.addEventListener('click', function () {
  skipToPrevPhase();
});

btnNext.addEventListener('click', function () {
  skipToNextPhase();
});

// Rewind 15s Logic
document.getElementById('btn-rewind').addEventListener('click', function () {
  // Prevent interaction if nothing is loaded or playing
  if (phase === 'ready' || phase === 'done') return;

  var current = getCurrentAudio();
  if (current) {
    // Capture state before rewind
    var timeBefore = current.currentTime;

    // Clamp to 0 to avoid errors
    current.currentTime = Math.max(0, current.currentTime - 15);

    // Analytics: audio_rewind_15s
    // Using simple console log as placeholder since no specific analytics provider was found in context
    // Ideally this would be: window.dataLayer.push({ ... })
    var payload = {
      event: 'audio_rewind_15s',
      session_id: currentSession,
      timestamp: new Date().toISOString(),
      current_time_before_rewind: timeBefore,
      phase: phase
    };

    // Safety check for dataLayer (GTM/GA4)
    if (window.dataLayer) {
      window.dataLayer.push(payload);
    } else {
      console.log('Analytics Event:', payload);
    }
  }
});

// Auto-load session 1 on page load
loadSession(1);
