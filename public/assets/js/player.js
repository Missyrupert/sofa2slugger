/**
 * Sofa2Slugger Session Player
 *
 * Audio flow per session:
 * 1. Vance intro (no music)
 * 2. Warmup (music starts quietly underneath)
 * 3. Coaching (music continues)
 * 4. Vance outro (music continues)
 * 5. Music fades out 4 seconds after outro ends
 *
 * Audio file naming convention:
 * - /audio/vance-s{NN}-intro.wav
 * - /audio/s{N}_warmup.wav
 * - /audio/s{N}_coaching.wav
 * - /audio/vance-s{NN}-outro.wav
 *
 * Music bed mapping:
 * - Sessions 1-4:  s1_music_bed.wav
 * - Sessions 5-7:  s2_music_bed.wav
 * - Sessions 8-10: s3_music_bed.wav
 */

var currentSession = null;
var phase = 'ready'; // ready | intro | warmup | coaching | outro | fading | done
var isPaused = false;

var intro = null;
var warmup = null;
var coaching = null;
var outro = null;
var music = null;

var player = document.getElementById('player');
var sessionTitle = document.getElementById('session-title');
var phaseDisplay = document.getElementById('phase');
var btnPlay = document.getElementById('btn-play');
var btnPause = document.getElementById('btn-pause');
var btnStop = document.getElementById('btn-stop');
var btnPrev = document.getElementById('btn-prev');
var btnNext = document.getElementById('btn-next');

// Music bed mapping: which music file to use for each session
function getMusicBedNum(sessionNum) {
  if (sessionNum <= 4) return 1;
  if (sessionNum <= 7) return 2;
  return 3;
}

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
  var musicBedNum = getMusicBedNum(num);

  intro = new Audio('/audio/vance-s' + padded + '-intro.wav');
  warmup = new Audio('/audio/s' + num + '_warmup.wav');
  coaching = new Audio('/audio/s' + num + '_coaching.wav');
  outro = new Audio('/audio/vance-s' + padded + '-outro.wav');
  music = new Audio('/audio/s' + musicBedNum + '_music_bed.wav');

  music.loop = true;
  music.volume = 0.08;

  // Wire up the sequence
  intro.addEventListener('ended', onIntroEnd);
  warmup.addEventListener('ended', onWarmupEnd);
  coaching.addEventListener('ended', onCoachingEnd);
  outro.addEventListener('ended', onOutroEnd);

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
    case 'warmup': return warmup;
    case 'coaching': return coaching;
    case 'outro': return outro;
    default: return null;
  }
}

function pausePlayback() {
  if (isPaused || phase === 'ready' || phase === 'done' || phase === 'fading') return;

  var current = getCurrentAudio();
  if (current) current.pause();
  if (music && phase !== 'intro') music.pause();

  isPaused = true;
  showPlayButton();
  phaseDisplay.textContent = phaseDisplay.textContent.replace(' (Paused)', '') + ' (Paused)';
}

function resumePlayback() {
  if (!isPaused) return;

  var current = getCurrentAudio();
  if (current) current.play();
  if (music && phase !== 'intro') music.play();

  isPaused = false;
  showPauseButton();
  phaseDisplay.textContent = phaseDisplay.textContent.replace(' (Paused)', '');
}

function onIntroEnd() {
  phase = 'warmup';
  phaseDisplay.textContent = 'Warmup';
  warmup.play();
  music.play();
}

function onWarmupEnd() {
  phase = 'coaching';
  phaseDisplay.textContent = 'Coaching';
  coaching.play();
}

function onCoachingEnd() {
  phase = 'outro';
  phaseDisplay.textContent = 'Closing';
  outro.play();
}

function onOutroEnd() {
  phase = 'fading';
  phaseDisplay.textContent = 'Finishing...';
  showPlayButton();
  btnPlay.disabled = true;
  fadeOutMusic();
}

function fadeOutMusic() {
  var fadeTime = 4000;
  var steps = 40;
  var stepTime = fadeTime / steps;
  var startVolume = music.volume;
  var volumeStep = startVolume / steps;

  var fade = setInterval(function () {
    if (music.volume > volumeStep) {
      music.volume -= volumeStep;
    } else {
      clearInterval(fade);
      music.pause();
      music.volume = 0.08;
      phase = 'done';
      phaseDisplay.textContent = 'Complete';
      btnPlay.disabled = false;

      // Mark session complete
      localStorage.setItem('s2s_session_' + currentSession, 'complete');
    }
  }, stepTime);
}

function stopAll() {
  if (intro) { intro.pause(); intro.currentTime = 0; }
  if (warmup) { warmup.pause(); warmup.currentTime = 0; }
  if (coaching) { coaching.pause(); coaching.currentTime = 0; }
  if (outro) { outro.pause(); outro.currentTime = 0; }
  if (music) { music.pause(); music.currentTime = 0; music.volume = 0.08; }
  phase = 'ready';
  isPaused = false;
}

function skipToPrevPhase() {
  if (phase === 'ready' || phase === 'done' || phase === 'fading') return;

  var current = getCurrentAudio();

  // If more than 3 seconds in, restart current phase
  if (current && current.currentTime > 3) {
    current.currentTime = 0;
    return;
  }

  // Otherwise go to previous phase
  var phases = ['intro', 'warmup', 'coaching', 'outro'];
  var idx = phases.indexOf(phase);
  if (idx <= 0) {
    // At intro, just restart
    if (current) current.currentTime = 0;
    return;
  }

  // Stop current
  if (current) { current.pause(); current.currentTime = 0; }

  // Go to previous
  var prevPhase = phases[idx - 1];
  phase = prevPhase;

  var labels = { intro: 'Intro', warmup: 'Warmup', coaching: 'Coaching', outro: 'Closing' };
  phaseDisplay.textContent = labels[phase];

  var prevAudio = getCurrentAudio();
  if (prevAudio) prevAudio.play();

  // Handle music
  if (phase === 'intro' && music) {
    music.pause();
    music.currentTime = 0;
  }

  if (!isPaused) showPauseButton();
}

function skipToNextPhase() {
  if (phase === 'ready' || phase === 'done' || phase === 'fading') return;

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
