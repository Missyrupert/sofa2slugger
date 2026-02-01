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
    // Stop any current playback
    audioElement.pause();
    audioElement.currentTime = 0;
    
    // Set source to final mix file (with cache-busting)
    audioElement.src = '/audio/session01.final.mp3?v=' + Date.now();
    
    // Remove all existing source elements and add fresh one
    while (audioElement.firstChild) {
      audioElement.removeChild(audioElement.firstChild);
    }
    var source = document.createElement('source');
    source.src = '/audio/session01.final.mp3?v=' + Date.now();
    source.type = 'audio/mpeg';
    audioElement.appendChild(source);
    
    // Force reload
    audioElement.load();
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
