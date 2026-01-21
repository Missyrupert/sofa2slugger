/**
 * Session 1 Player
 * Flow: warmup -> coaching + music -> music fades -> done
 */

var warmup = new Audio('assets/audio/s1_warmup.wav');
var coaching = new Audio('assets/audio/s1_coaching.wav');
var music = new Audio('assets/audio/s1_music_bed.wav');

music.loop = true;
music.volume = 0.15; // Quiet, background level

var btnPlay = document.getElementById('btn-play');
var btnPause = document.getElementById('btn-pause');
var btnRestart = document.getElementById('btn-restart');
var status = document.getElementById('status');

var phase = 'ready'; // ready | warmup | coaching | fading | done

// When warmup ends, start coaching + music together
warmup.addEventListener('ended', function() {
  phase = 'coaching';
  status.textContent = 'Coaching';
  coaching.play();
  music.play();
});

// When coaching ends, fade out music
coaching.addEventListener('ended', function() {
  phase = 'fading';
  status.textContent = 'Finishing...';
  fadeOutMusic();
});

btnPlay.addEventListener('click', function() {
  btnPlay.disabled = true;
  btnPause.disabled = false;
  btnRestart.disabled = false;

  if (phase === 'ready' || phase === 'done') {
    phase = 'warmup';
    status.textContent = 'Warmup';
    warmup.play();
  } else if (phase === 'warmup') {
    warmup.play();
  } else if (phase === 'coaching') {
    coaching.play();
    music.play();
  }
});

btnPause.addEventListener('click', function() {
  btnPlay.disabled = false;
  btnPause.disabled = true;
  warmup.pause();
  coaching.pause();
  music.pause();
  status.textContent = 'Paused';
});

btnRestart.addEventListener('click', function() {
  warmup.pause();
  coaching.pause();
  music.pause();
  warmup.currentTime = 0;
  coaching.currentTime = 0;
  music.currentTime = 0;
  music.volume = 0.15;
  phase = 'ready';
  status.textContent = 'Ready';
  btnPlay.disabled = false;
  btnPause.disabled = true;
  btnRestart.disabled = true;
});

function fadeOutMusic() {
  var fadeTime = 4000;
  var steps = 40;
  var stepTime = fadeTime / steps;
  var volumeStep = music.volume / steps;

  var fade = setInterval(function() {
    if (music.volume > volumeStep) {
      music.volume -= volumeStep;
    } else {
      clearInterval(fade);
      music.pause();
      music.volume = 0.15;
      phase = 'done';
      status.textContent = 'Complete';
      btnPlay.disabled = true;
      btnPause.disabled = true;
    }
  }, stepTime);
}
