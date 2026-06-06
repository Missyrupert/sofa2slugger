/**
 * Maps sessionId (1..12) to the assembled course audio.
 * These files include the narrator intro, coach-led round, narrator outro, and next-session handover.
 */
export const SESSION_AUDIO_MAP: Record<number, string | null> = {
  1: "/audio/session01.v3.no-bells.music.mp3",
  2: "/audio/session02.v3.no-bells.music.mp3",
  3: "/audio/session03.v3.no-bells.music.mp3",
  4: "/audio/session04.v3.no-bells.music.mp3",
  5: "/audio/session05.v3.no-bells.music.mp3",
  6: "/audio/session06.v3.no-bells.music.mp3",
  7: "/audio/session07.v3.no-bells.music.mp3",
  8: "/audio/session08.v3.no-bells.music.mp3",
  9: "/audio/session09.v3.no-bells.music.mp3",
  10: "/audio/session10.v3.no-bells.music.mp3",
  11: "/audio/session11.v3.no-bells.music.mp3",
  12: "/audio/session12.v3.no-bells.music.mp3",
};

export function getSessionAudioPath(sessionId: number): string | null {
  return SESSION_AUDIO_MAP[sessionId] ?? null;
}
