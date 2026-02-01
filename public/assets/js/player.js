/**
 * Sofa2Slugger Session Player
 * Audio player with play/pause, skip back 15s, stop controls
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

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  var mins = Math.floor(seconds / 60);
  var secs = Math.floor(seconds % 60);
  return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

// ============================================
// MANIFESTO LOGIC
// ============================================
function initManifesto() {
  // Hide manifesto block for returning users
  if (localStorage.getItem(STORAGE_KEY_MANIFESTO_HEARD) === 'true') {
    manifestoBlock.style.display = 'none';
    return;
  }

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
  // Stop manifesto if playing
  if (isManifestoPlaying && manifestoAudio) {
    manifestoAudio.pause();
    manifestoAudio.currentTime = 0;
    isManifestoPlaying = false;
    btnManifesto.innerHTML = '<span class="manifesto-icon">&#9654;</span><span class="manifesto-label">Play Manifesto</span>';
    manifestoStatus.textContent = '';
  }

  // Update UI
  sessionNumber.textContent = sessionNum;
  sessionTitle.textContent = SESSION_NAMES[sessionNum] || 'Session ' + sessionNum;

  // Load audio - for now only Session 1 has audio
  var audioSrc = '/audio/session01.final.mp3';
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
btnPlaySession1.addEventListener('click', function() {
  showPlayer(1);
});

// Session card click handlers
document.querySelectorAll('.session-card').forEach(function(card) {
  card.addEventListener('click', function() {
    var num = parseInt(this.getAttribute('data-session'));
    if (num === 1) {
      showPlayer(1);
    }
  });
});

document.querySelectorAll('.session-play').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    var num = parseInt(this.getAttribute('data-session'));
    if (num === 1) {
      showPlayer(1);
    }
  });
});

// ============================================
// INITIALIZE
// ============================================
initManifesto();
