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
  
  // Force reload the audio source to ensure latest file is loaded
  if (audioElement) {
    // Remove existing source and add fresh one to bypass cache
    var currentSrc = audioElement.currentSrc || audioElement.src;
    audioElement.src = '/audio/session01.final.mp3?' + Date.now();
    audioElement.load(); // Force reload
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
