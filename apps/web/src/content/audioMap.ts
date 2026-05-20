/**
 * Maps sessionId (1..12) to the assembled course audio.
 * These files include the narrator intro, coach-led round, narrator outro, and next-session handover.
 */
export const SESSION_AUDIO_MAP: Record<number, string | null> = {
  1: "/audio/session01.full.mp3",
  2: "/audio/session02.full.mp3",
  3: "/audio/session03.full.mp3",
  4: "/audio/session04.full.mp3",
  5: "/audio/session05.full.mp3",
  6: "/audio/session06.full.mp3",
  7: "/audio/session07.full.mp3",
  8: "/audio/session08.full.mp3",
  9: "/audio/session09.full.mp3",
  10: "/audio/session10.full.mp3",
  11: "/audio/session11.full.mp3",
  12: "/audio/session12.full.mp3",
};

export function getSessionAudioPath(sessionId: number): string | null {
  return SESSION_AUDIO_MAP[sessionId] ?? null;
}
