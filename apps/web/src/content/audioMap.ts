/**
 * Maps sessionId (1..12) to the current generated v2 audio file path.
 * These are review/final-candidate mixes until the listening pass is locked.
 */
export const SESSION_AUDIO_MAP: Record<number, string | null> = {
  1: "/audio/session01.v2.no-bells.music.mp3",
  2: "/audio/session02.v2.no-bells.music.mp3",
  3: "/audio/session03.v2.no-bells.music.mp3",
  4: "/audio/session04.v2.no-bells.music.mp3",
  5: "/audio/session05.v2.no-bells.music.mp3",
  6: "/audio/session06.v2.no-bells.music.mp3",
  7: "/audio/session07.v2.no-bells.music.mp3",
  8: "/audio/session08.v2.no-bells.music.mp3",
  9: "/audio/session09.v2.no-bells.music.mp3",
  10: "/audio/session10.v2.no-bells.music.mp3",
  11: "/audio/session11.v2.no-bells.music.mp3",
  12: "/audio/session12.v2.hybrid.no-bells.music.mp3",
};

export function getSessionAudioPath(sessionId: number): string | null {
  return SESSION_AUDIO_MAP[sessionId] ?? null;
}
