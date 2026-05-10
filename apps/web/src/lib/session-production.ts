export type SessionProduction = {
  sessionId: number;
  narratorIntro: string;
  coachLesson: string;
  narratorClose: string;
  nextTeaser: string;
  voiceNotes: string[];
  scriptPath: string;
  finalAudioFile: string;
};

export const SESSION_PRODUCTION: Record<number, SessionProduction> = {
  1: {
    sessionId: 1,
    narratorIntro:
      "Every boxer starts in the same place: learning where the feet belong, where the hands return, and how to stay calm.",
    coachLesson:
      "Build stance, guard, breath, small steps, and the first lead-hand touch.",
    narratorClose:
      "You found the base. It may feel simple, but simple is where boxing starts.",
    nextTeaser:
      "Next, the first real weapon: the jab.",
    voiceNotes: ["Narrator opens with documentary calm.", "Coach stays slow, precise, and spacious."],
    scriptPath: "docs/session-01-script-draft.md",
    finalAudioFile: "/audio/session01.final.mp3",
  },
  2: {
    sessionId: 2,
    narratorIntro:
      "The jab is more than a punch. It is range, rhythm, and the first conversation you have with distance.",
    coachLesson:
      "Teach lead-hand path, shoulder cover, return to guard, step jab, and double jab.",
    narratorClose:
      "You learned to touch and come home. That habit will protect everything that follows.",
    nextTeaser:
      "Next, the rear hand joins the line: the cross.",
    voiceNotes: ["Narrator frames the jab as identity.", "Coach repeats touch-and-home without rushing."],
    scriptPath: "docs/session-02-script-draft.md",
    finalAudioFile: "/audio/session02.final.mp3",
  },
  3: {
    sessionId: 3,
    narratorIntro:
      "The rear hand tempts beginners to force power. Today is about earning it through balance.",
    coachLesson:
      "Teach rear heel turn, hip rotation, protected chin, cross return, and jab-cross rhythm.",
    narratorClose:
      "The cross is not a reach. It is a turn, a touch, and a return.",
    nextTeaser:
      "Next, jab and cross become your first real combination.",
    voiceNotes: ["Narrator warns against forced power.", "Coach cues turn-touch-return."],
    scriptPath: "docs/session-03-script-draft.md",
    finalAudioFile: "/audio/session03.final.mp3",
  },
  4: {
    sessionId: 4,
    narratorIntro:
      "A punch is only half the habit. The other half is what you do after it lands or misses.",
    coachLesson:
      "Build one-two rhythm, hand recovery, step-back exits, and small angle exits.",
    narratorClose:
      "You learned not to admire the work. Punch, protect, leave.",
    nextTeaser:
      "Next, the first curved punch: the hook.",
    voiceNotes: ["Narrator focuses on consequence after attack.", "Coach makes exits feel mandatory."],
    scriptPath: "docs/session-04-script-draft.md",
    finalAudioFile: "/audio/session04.final.mp3",
  },
  5: {
    sessionId: 5,
    narratorIntro:
      "The hook is where beginners often swing wide. Today, it becomes compact and controlled.",
    coachLesson:
      "Teach lead hook, rear hook, hip turn, guard recovery, and cross-to-hook linking.",
    narratorClose:
      "A hook is a turn, not a wild swing. Short beats wide.",
    nextTeaser:
      "Next, the punch that comes through the middle: the uppercut.",
    voiceNotes: ["Narrator sets a corrective tone.", "Coach keeps hooks short and safe."],
    scriptPath: "docs/session-05-script-draft.md",
    finalAudioFile: "/audio/session05.final.mp3",
  },
  6: {
    sessionId: 6,
    narratorIntro:
      "Inside work is not chaos. The best short punches stay compact, protected, and balanced.",
    coachLesson:
      "Teach lead and rear uppercuts, small level change, elbow position, and uppercut-hook flow.",
    narratorClose:
      "You now have the basic punch family: jab, cross, hook, uppercut.",
    nextTeaser:
      "Next, we start learning how not to get hit.",
    voiceNotes: ["Narrator signals completion of punch family.", "Coach prevents scooping and over-lifting."],
    scriptPath: "docs/session-06-script-draft.md",
    finalAudioFile: "/audio/session06.final.mp3",
  },
  7: {
    sessionId: 7,
    narratorIntro:
      "Defense is not fear. It is composure: staying safe enough to make the next choice.",
    coachLesson:
      "Teach catch, parry, slip left, slip right, roll, and defense after jab.",
    narratorClose:
      "You learned that defense can be small, calm, and useful.",
    nextTeaser:
      "Next, the feet take over: footwork and angles.",
    voiceNotes: ["Narrator reassures.", "Coach keeps defensive moves small."],
    scriptPath: "docs/session-07-script-draft.md",
    finalAudioFile: "/audio/session07.final.mp3",
  },
  8: {
    sessionId: 8,
    narratorIntro:
      "The feet carry the boxing. When the feet are late, the hands lose their shape.",
    coachLesson:
      "Teach forward/back movement, side steps, step jab, and a small pivot.",
    narratorClose:
      "You learned to move without abandoning the base.",
    nextTeaser:
      "Next, attack and defense start working together.",
    voiceNotes: ["Narrator makes footwork feel essential.", "Coach stays patient and repetitive."],
    scriptPath: "docs/session-08-script-draft.md",
    finalAudioFile: "/audio/session08.final.mp3",
  },
  9: {
    sessionId: 9,
    narratorIntro:
      "Now the pieces begin to connect. Punches, defense, and movement become exchanges.",
    coachLesson:
      "Teach jab-cross-slip, jab-cross-roll, hook-roll-hook, exits, and a two-minute linked round.",
    narratorClose:
      "You are no longer just collecting punches. You are building exchanges.",
    nextTeaser:
      "Next, you learn to change gears.",
    voiceNotes: ["Narrator marks the course turning point.", "Coach keeps combinations short."],
    scriptPath: "docs/session-09-script-draft.md",
    finalAudioFile: "/audio/session09.final.mp3",
  },
  10: {
    sessionId: 10,
    narratorIntro:
      "Good shadowboxing has gears. The work is not to sprint. The work is to control the pace.",
    coachLesson:
      "Teach light rhythm, burst gear, active rest, gear changes, and a two-minute tempo round.",
    narratorClose:
      "You learned to work, breathe, reset, and go again.",
    nextTeaser:
      "Next, those gears become the structure of a round.",
    voiceNotes: ["Narrator adds energy but stays composed.", "Coach uses sparse gear commands."],
    scriptPath: "docs/session-10-script-draft.md",
    finalAudioFile: "/audio/session10.final.mp3",
  },
  11: {
    sessionId: 11,
    narratorIntro:
      "A round is not one long panic. It is made of moments, and moments can be managed.",
    coachLesson:
      "Build straight-punch, inside-work, defense, movement, and combined blocks.",
    narratorClose:
      "You learned the shape of a round: win the moment, reset, win the next.",
    nextTeaser:
      "Next, you complete your first full guided round.",
    voiceNotes: ["Narrator makes this feel like pre-fight preparation.", "Coach names blocks clearly."],
    scriptPath: "docs/session-11-script-draft.md",
    finalAudioFile: "/audio/session11.final.mp3",
  },
  12: {
    sessionId: 12,
    narratorIntro:
      "The course has brought you from the base to this: a complete guided round.",
    coachLesson:
      "Guide the full round using stance, jab, cross, hooks, uppercuts, defense, footwork, rhythm, and resets.",
    narratorClose:
      "You finished the round. The work now is to make it cleaner.",
    nextTeaser:
      "Replay the course. Sharpen the habits. Make the round cleaner.",
    voiceNotes: ["Narrator gives earned payoff.", "Coach leaves more space during the full round."],
    scriptPath: "docs/session-12-script-draft.md",
    finalAudioFile: "/audio/session12.final.mp3",
  },
};

export function getSessionProduction(sessionId: number): SessionProduction | undefined {
  return SESSION_PRODUCTION[sessionId];
}
