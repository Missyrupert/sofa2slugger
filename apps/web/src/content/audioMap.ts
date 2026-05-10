/**
 * Maps sessionId (1..12) to audio file path.
 * Null means the redesigned course session is scripted but audio is not produced yet.
 */
export const SESSION_AUDIO_MAP: Record<number, string | null> = {
  1: "/audio/session01.music-python-chill-ska-warm-6x.mp3",
  2: "/audio/session02.music-python-chill-ska-warm-6x.mp3",
  3: "/audio/session03.music-python-chill-ska-warm-6x.mp3",
  4: "/audio/session04.music-python-chill-ska-warm-6x.mp3",
  5: "/audio/session05.music-python-chill-ska-warm-6x.mp3",
  6: "/audio/session06.music-python-chill-ska-warm-6x.mp3",
  7: "/audio/session07.music-python-chill-ska-warm-6x.mp3",
  8: "/audio/session08.music-python-chill-ska-warm-6x.mp3",
  9: "/audio/session09.music-python-chill-ska-warm-6x.mp3",
  10: "/audio/session10.music-python-chill-ska-warm-6x.mp3",
  11: "/audio/session11.music-python-chill-ska-warm-6x.mp3",
  12: "/audio/session12.music-python-chill-ska-warm-6x.mp3",
};

export function getSessionAudioPath(sessionId: number): string | null {
  return SESSION_AUDIO_MAP[sessionId] ?? null;
}
