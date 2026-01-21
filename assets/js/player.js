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
 * - assets/audio/vance-s{NN}-intro.wav
 * - assets/audio/s{N}_warmup.wav
 * - assets/audio/s{N}_coaching.wav
 * - assets/audio/vance-s{NN}-outro.wav
 * - assets/audio/s{N}_music_bed.wav
 */

var currentSession = null;
var phase = 'ready'; // ready | intro | warmup | coaching | outro | fading | done

var intro = null;
var warmup = null;
var coaching = null;
var outro = null;
var music = null;

var player = document.getElementById('player');
var sessionTitle = document.getElementById('session-title');
var phaseDisplay = document.getElementById('phase');
var btnPlay = document.getElementById('btn-play');
var btnStop = document.getElementById('btn-stop');
var sessionCards = document.querySelectorAll('.session-card:not(.locked)');

// Session card click handlers
sessionCards.forEach(function(card) {
  card.addEventListener('click', function(e) {
    if (this.classList.contains('locked')) return;
    var sessionNum = parseInt(this.getAttribute('data-session'));
    loadSession(sessionNum, true);
  });
});

function loadSession(num, autoPlay) {
  stopAll();
  currentSession = num;
  
  var padded = num < 10 ? '0' + num : '' + num;
  
  intro = new Audio('assets/audio/vance-s' + padded + '-intro.wav');
  warmup = new Audio('assets/audio/s' + num + '_warmup.wav');
  coaching = new Audio('assets/audio/s' + num + '_coaching.wav');
  outro = new Audio('assets/audio/vance-s' + padded + '-outro.wav');
  music = new Audio('assets/audio/s' + num + '_music_bed.wav');
  
  music.loop = true;
  music.volume = 0.08; // Quiet, like a jukebox across the room
  
  // Wire up the sequence
  intro.addEventListener('ended', onIntroEnd);
  warmup.addEventListener('ended', onWarmupEnd);
  coaching.addEventListener('ended', onCoachingEnd);
  outro.addEventListener('ended', onOutroEnd);
  
  // Get session name from card
  var card = document.querySelector('.session-card[data-session="' + num + '"]');
  var name = card ? card.querySelector('.session-name').textContent : '';
  sessionTitle.textContent = num + ' — ' + name;

  phaseDisplay.textContent = 'Ready';
  phase = 'ready';
  player.classList.remove('hidden');
  btnPlay.disabled = false;

  if (autoPlay) {
    startSession();
  }
}

function startSession() {
  if (phase === 'ready') {
    phase = 'intro';
    phaseDisplay.textContent = 'Intro';
    intro.play();
    btnPlay.disabled = true;
  }
}

function onIntroEnd() {
  phase = 'warmup';
  phaseDisplay.textContent = 'Warmup';
  warmup.play();
  music.play();
}

function onWarmupEnd() {
  phase = 'coaching';
  phaseDisplay.textContent = 'Training';
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
  fadeOutMusic();
}

function fadeOutMusic() {
  var fadeTime = 4000;
  var steps = 40;
  var stepTime = fadeTime / steps;
  var startVolume = music.volume;
  var volumeStep = startVolume / steps;

  var fade = setInterval(function() {
    if (music.volume > volumeStep) {
      music.volume -= volumeStep;
    } else {
      clearInterval(fade);
      music.pause();
      music.volume = 0.08;
      phase = 'done';
      phaseDisplay.textContent = 'Complete';
      btnPlay.disabled = true;
      
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
}

btnPlay.addEventListener('click', function() {
  startSession();
});

btnStop.addEventListener('click', function() {
  stopAll();
  phaseDisplay.textContent = 'Stopped';
  btnPlay.disabled = false;
});

// Auto-load session 1 on page load
loadSession(1);
