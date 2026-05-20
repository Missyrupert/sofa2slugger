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
      "No gym, no bag, no audience. Session 1 starts with the base: feet under you, hands home, breath steady.",
    coachLesson:
      "Build stance, guard, breath, small steps, and the first front-hand touch before the jab arrives.",
    narratorClose:
      "You now know where home is. Simple is where the work becomes repeatable.",
    nextTeaser:
      "Next, the front hand leaves home for the first real punch: the jab.",
    voiceNotes: ["Narrator lowers uncertainty and frames the start.", "Coach stays slow, precise, and spacious."],
    scriptPath: "docs/session-01-script-v2.md",
    finalAudioFile: "/audio/session01.final.mp3",
  },
  2: {
    sessionId: 2,
    narratorIntro:
      "Coming back matters. Session 2 gives the base its first useful punch: the jab.",
    coachLesson:
      "Teach front-hand path, shoulder cover, home position, step jab, and double jab.",
    narratorClose:
      "The hand went out and came home. That homecoming matters.",
    nextTeaser:
      "Next, the back hand joins the line with the cross.",
    voiceNotes: ["Narrator marks the value of coming back.", "Coach keeps the jab small enough to trust."],
    scriptPath: "docs/session-02-script-v2.md",
    finalAudioFile: "/audio/session02.final.mp3",
  },
  3: {
    sessionId: 3,
    narratorIntro:
      "The back hand tempts beginners to force power. Session 3 slows the cross down before it gets heavy.",
    coachLesson:
      "Teach back heel turn, hip rotation, protected chin, cross home, and the first one-two rhythm.",
    narratorClose:
      "The cross is a turn, structure, and bodyweight through a straight line. Balance comes first.",
    nextTeaser:
      "Next, jab and cross become the one-two, and the lesson becomes what happens after.",
    voiceNotes: ["Narrator warns against forced power.", "Coach cues turn and home."],
    scriptPath: "docs/session-03-script-v2.md",
    finalAudioFile: "/audio/session03.final.mp3",
  },
  4: {
    sessionId: 4,
    narratorIntro:
      "Session 4 turns jab and cross into the one-two, then teaches the user to leave with shape intact.",
    coachLesson:
      "Build one-two rhythm, hand recovery, step-back exits, and small side exits.",
    narratorClose:
      "Work done. Hands home. Leave the line. Punch, protect, leave.",
    nextTeaser:
      "Next, the first curved punch arrives: the hook.",
    voiceNotes: ["Narrator frames consequence after attack.", "Coach makes exits feel mandatory."],
    scriptPath: "docs/session-04-script-v2.md",
    finalAudioFile: "/audio/session04.final.mp3",
  },
  5: {
    sessionId: 5,
    narratorIntro:
      "Session 5 keeps the hook compact: a short turn, a controlled shape, and a hand that comes home.",
    coachLesson:
      "Teach front hook, hip turn, guard recovery, cross-to-hook linking, and one-two-hook flow.",
    narratorClose:
      "The hook is a turn, not a swing. Short beats wide, and control beats looking busy.",
    nextTeaser:
      "Next, the punch comes through the middle with the uppercut.",
    voiceNotes: ["Narrator sets a corrective tone.", "Coach keeps hooks short and safe."],
    scriptPath: "docs/session-05-script-v2.md",
    finalAudioFile: "/audio/session05.final.mp3",
  },
  6: {
    sessionId: 6,
    narratorIntro:
      "Session 6 completes the basic punch family with the uppercut: close work, small work, controlled work.",
    coachLesson:
      "Teach front and back uppercuts, small level change, elbow position, and uppercut-hook flow.",
    narratorClose:
      "The basic punch family is now present: jab, cross, hook, uppercut. Not mastered. Met.",
    nextTeaser:
      "Next, the course turns to defence, because punching is only half the story.",
    voiceNotes: ["Narrator marks a milestone.", "Coach prevents scooping and over-lifting."],
    scriptPath: "docs/session-06-script-v2.md",
    finalAudioFile: "/audio/session06.final.mp3",
  },
  7: {
    sessionId: 7,
    narratorIntro:
      "Session 7 introduces defence as staying available, not hiding.",
    coachLesson:
      "Teach guard, catch, slip left, slip right, and simple defensive answers after punches.",
    narratorClose:
      "Defence can be active without being dramatic. Sometimes the win is staying covered and still being there.",
    nextTeaser:
      "Next, the feet take the lesson further with movement and angles.",
    voiceNotes: ["Narrator makes defence feel calm and strong.", "Coach keeps defensive moves small and directional."],
    scriptPath: "docs/session-07-script-v2.md",
    finalAudioFile: "/audio/session07.final.mp3",
  },
  8: {
    sessionId: 8,
    narratorIntro:
      "Session 8 is about moving without abandoning yourself.",
    coachLesson:
      "Teach forward and back movement, side steps, angles, exits, and base recovery.",
    narratorClose:
      "The room did not need to be big. The movement needed to be clean.",
    nextTeaser:
      "Next, attack and defence start working together.",
    voiceNotes: ["Narrator makes footwork feel essential.", "Coach keeps movement patient and practical."],
    scriptPath: "docs/session-08-script-v2.md",
    finalAudioFile: "/audio/session08.final.mp3",
  },
  9: {
    sessionId: 9,
    narratorIntro:
      "Session 9 connects the pieces: throw, protect, move, reset.",
    coachLesson:
      "Teach linked attacks, defensive answers, exits, and short exchange patterns.",
    narratorClose:
      "You began building exchanges. One clean moment, then the next.",
    nextTeaser:
      "Next, you learn to change the pace without losing control.",
    voiceNotes: ["Narrator marks the course turning point.", "Coach keeps combinations short and purposeful."],
    scriptPath: "docs/session-09-script-v2.md",
    finalAudioFile: "/audio/session09.final.mp3",
  },
  10: {
    sessionId: 10,
    narratorIntro:
      "Session 10 teaches rhythm and pace: lighter work, short bursts, breath, and reset.",
    coachLesson:
      "Teach light pace, short lifts, active recovery, pace changes, and controlled tempo rounds.",
    narratorClose:
      "You can raise the pace without letting the pace own you.",
    nextTeaser:
      "Next, those pieces become the structure of a round.",
    voiceNotes: ["Narrator adds energy without hype.", "Coach keeps pace language clear, not gimmicky."],
    scriptPath: "docs/session-10-script-v2.md",
    finalAudioFile: "/audio/session10.final.mp3",
  },
  11: {
    sessionId: 11,
    narratorIntro:
      "Session 11 builds the round as moments: an exchange, a breath, a reset, a decision.",
    coachLesson:
      "Build straight-punch, inside-work, defence, movement, pace, and combined blocks.",
    narratorClose:
      "Longer work becomes manageable one piece at a time.",
    nextTeaser:
      "Next, you complete your first full guided shadowboxing round.",
    voiceNotes: ["Narrator makes this feel like preparation for the finish.", "Coach names blocks clearly."],
    scriptPath: "docs/session-11-script-v2.md",
    finalAudioFile: "/audio/session11.final.mp3",
  },
  12: {
    sessionId: 12,
    narratorIntro:
      "Session 12 brings the course together: not perfectly, not for show, but earned.",
    coachLesson:
      "Guide the full round using stance, jab, cross, hooks, uppercuts, defence, movement, pace, and resets.",
    narratorClose:
      "You completed Sofa2Slugger. You listened, moved, came back, and finished.",
    nextTeaser:
      "The course is complete. Make the base cleaner, make the round calmer, make it yours.",
    voiceNotes: ["Narrator gives earned payoff.", "Coach leaves more space during the full round."],
    scriptPath: "docs/session-12-script-v2.md",
    finalAudioFile: "/audio/session12.final.mp3",
  },
};

export function getSessionProduction(sessionId: number): SessionProduction | undefined {
  return SESSION_PRODUCTION[sessionId];
}
