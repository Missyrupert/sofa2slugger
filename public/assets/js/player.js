/**
 * Sofa2Slugger Session Player
 * Session 1: Single audio file playback
 */

// DOM elements
var player = document.getElementById('player');
var sessionTitle = document.getElementById('session-title');
var audioElement = document.getElementById('session1-audio');

// Function to show Session 1 player and ensure audio loads
function showSession1Player() {
  player.classList.remove('hidden');
  sessionTitle.textContent = 'Session 1 — Where It Begins';

  // Load and play the audio
  if (audioElement) {
    // Set source to final mix file
    audioElement.src = '/audio/session01.final.mp3';

    // Load and attempt to play
    audioElement.load();
    audioElement.play().catch(function(err) {
      console.log('Auto-play blocked, user must click play:', err);
    });
  }
}

// Session card click handlers
document.querySelectorAll('.session-card').forEach(function(card) {
  card.addEventListener('click', function() {
    var num = parseInt(this.getAttribute('data-session'));
    if (num === 1) {
      showSession1Player();
    }
  });
});

document.querySelectorAll('.session-play').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    var num = parseInt(this.getAttribute('data-session'));
    if (num === 1) {
      showSession1Player();
    }
  });
});
