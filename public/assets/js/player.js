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

var currentSession = null;
var phase = 'ready'; // ready | intro | session | done
var isPaused = false;

var intro = null;
var sessionAudio = null;

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
  return localStorage.getItem(STORAGE_KEY_PAID) === 'true';
}

// Redirect to pricing
function showPaywall() {
  if (confirm("Sessions 2-10 are locked.\n\nUnlock full access for £9.99?")) {
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
  card.addEventListener('click', function (e) {
    var num = parseInt(this.getAttribute('data-session'));

    // Check lock state
    if (this.classList.contains('locked')) {
      showPaywall();
      return;
    }

    // Play allowed session
    loadSession(num, true);
  });
});

function loadSession(num, autoPlay) {
  stopAll();
  currentSession = num;

  var padded = num < 10 ? '0' + num : '' + num;

  // Load intro and complete session audio (includes warmup+coaching+outro with music)
  intro = new Audio('/audio/vance-s' + padded + '-intro.mp3');
  sessionAudio = new Audio('/audio/session-' + num + '-complete.mp3');

  // Wire up the sequence
  intro.addEventListener('ended', onIntroEnd);
  sessionAudio.addEventListener('ended', onSessionEnd);

  // Get session name from card
  var card = document.querySelector('.session-card[data-session="' + num + '"]');
  var name = card ? card.querySelector('.session-name').textContent : '';
  sessionTitle.textContent = 'Session ' + num + ' — ' + name;

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
    phase = 'intro';
    phaseDisplay.textContent = 'Intro';
    intro.play();
    showPauseButton();
  }
}

function getCurrentAudio() {
  switch (phase) {
    case 'intro': return intro;
    case 'session': return sessionAudio;
    default: return null;
  }
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

function onIntroEnd() {
  phase = 'session';
  phaseDisplay.textContent = 'Training';
  sessionAudio.play();
}

function onSessionEnd() {
  phase = 'done';
  phaseDisplay.textContent = 'Complete';
  showPlayButton();

  // Mark session complete
  localStorage.setItem('s2s_session_' + currentSession, 'complete');
}

function stopAll() {
  if (intro) { intro.pause(); intro.currentTime = 0; }
  if (sessionAudio) { sessionAudio.pause(); sessionAudio.currentTime = 0; }
  phase = 'ready';
  isPaused = false;
}

function skipToPrevPhase() {
  if (phase === 'ready' || phase === 'done') return;

  var current = getCurrentAudio();

  // If more than 5 seconds in, restart current phase
  if (current && current.currentTime > 5) {
    current.currentTime = 0;
    return;
  }

  // If in session phase, go back to intro
  if (phase === 'session') {
    if (current) { current.pause(); current.currentTime = 0; }
    phase = 'intro';
    phaseDisplay.textContent = 'Intro';
    intro.currentTime = 0;
    intro.play();
    if (!isPaused) showPauseButton();
    return;
  }

  // At intro, just restart
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

// Auto-load session 1 on page load
loadSession(1);
