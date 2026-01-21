/**
 * Vance Track Player
 * Click a track to play. Click again to stop.
 */

var audio = new Audio();
var currentTrack = null;

document.querySelectorAll('.track').forEach(function(el) {
  el.addEventListener('click', function() {
    var src = this.getAttribute('data-src');

    // If clicking the same track, toggle
    if (currentTrack === this) {
      if (audio.paused) {
        audio.play();
        this.classList.add('playing');
      } else {
        audio.pause();
        this.classList.remove('playing');
      }
      return;
    }

    // Stop previous
    if (currentTrack) {
      currentTrack.classList.remove('playing');
    }

    // Play new
    audio.src = src;
    audio.play();
    this.classList.add('playing');
    currentTrack = this;
  });
});

audio.addEventListener('ended', function() {
  if (currentTrack) {
    currentTrack.classList.remove('playing');
    currentTrack = null;
  }
});
