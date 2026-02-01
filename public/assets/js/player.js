/**
 * Sofa2Slugger Session Player
 * Session 1: Single audio file playback
 */

// DOM elements
var player = document.getElementById('player');
var sessionTitle = document.getElementById('session-title');
var audioElement = document.getElementById('session1-audio');

// Session card click handlers
document.querySelectorAll('.session-card').forEach(function(card) {
  card.addEventListener('click', function() {
    var num = parseInt(this.getAttribute('data-session'));
    if (num === 1) {
      player.classList.remove('hidden');
      sessionTitle.textContent = 'Session 1 — Where It Begins';
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
    }
  });
});
