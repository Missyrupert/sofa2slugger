/**
 * Sofa2Slugger Session Player
 * Session 1: Plays 3 files in sequence
 */

// Session 1 playlist
var playlist = [
  '/audio/s1draft.mp3',
  '/audio/s1_music_bed',
  '/audio/session-01-v2-final.mp3'
];

var currentTrack = 0;
var audio = null;
var phase = 'ready';
var isPaused = false;

// DOM elements
var player = document.getElementById('player');
var sessionTitle = document.getElementById('session-title');
var phaseDisplay = document.getElementById('phase');
var btnPlay = document.getElementById('btn-play');
var btnPause = document.getElementById('btn-pause');
var btnStop = document.getElementById('btn-stop');
var btnRewind = document.getElementById('btn-rewind');

// Load and play a track
function playTrack(index) {
  if (index >= playlist.length) {
    // All tracks done
    phase = 'done';
    phaseDisplay.textContent = 'Complete';
    showPlayButton();
    return;
  }

  currentTrack = index;
  audio = new Audio(playlist[index]);

  audio.addEventListener('ended', function() {
    playTrack(currentTrack + 1);
  });

  audio.addEventListener('error', function(e) {
    console.error('Error loading: ' + playlist[index], e);
  });

  phaseDisplay.textContent = 'Track ' + (index + 1) + ' of 3';
  audio.play();
  showPauseButton();
}

// Start session
function startSession() {
  phase = 'playing';
  currentTrack = 0;
  playTrack(0);
}

// Stop all
function stopAll() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  phase = 'ready';
  currentTrack = 0;
  isPaused = false;
  phaseDisplay.textContent = 'Ready';
}

// Show/hide buttons
function showPlayButton() {
  btnPlay.classList.remove('hidden');
  btnPause.classList.add('hidden');
}

function showPauseButton() {
  btnPlay.classList.add('hidden');
  btnPause.classList.remove('hidden');
}

// Button handlers
btnPlay.addEventListener('click', function() {
  if (phase === 'ready' || phase === 'done') {
    startSession();
  } else if (isPaused) {
    audio.play();
    isPaused = false;
    showPauseButton();
    phaseDisplay.textContent = phaseDisplay.textContent.replace(' (Paused)', '');
  }
});

btnPause.addEventListener('click', function() {
  if (audio && phase === 'playing') {
    audio.pause();
    isPaused = true;
    showPlayButton();
    phaseDisplay.textContent += ' (Paused)';
  }
});

btnStop.addEventListener('click', function() {
  stopAll();
  showPlayButton();
});

btnRewind.addEventListener('click', function() {
  if (audio && phase === 'playing') {
    audio.currentTime = Math.max(0, audio.currentTime - 15);
  }
});

// Session card click handlers
document.querySelectorAll('.session-card').forEach(function(card) {
  card.addEventListener('click', function() {
    var num = parseInt(this.getAttribute('data-session'));
    if (num === 1) {
      player.classList.remove('hidden');
      sessionTitle.textContent = 'Session 1 — Where It Begins';
      phaseDisplay.textContent = 'Ready';
      startSession();
    }
  });
});

document.querySelectorAll('.session-play').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    var num = parseInt(this.getAttribute('data-session'));
    if (num === 1) {
      player.classList.remove('hidden');
      sessionTitle.textContent = 'Session 1 — Where It Begins';
      phaseDisplay.textContent = 'Ready';
      startSession();
    }
  });
});

// Expose for timer
window.getCurrentAudio = function() {
  return audio;
};
