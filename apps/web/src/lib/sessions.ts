/**
 * Session metadata for the 12-session Sofa2Slugger fundamentals course.
 * Durations match the current generated v2 review masters closely enough for UI display.
 */

export type Session = {
  id: number;
  title: string;
  shortTitle: string;
  summary: string;
  goal: string;
  focus: string;
  skills: string[];
  audioCue: string;
  milestone: "Base" | "Straight Punches" | "Inside Work" | "Defence" | "Movement" | "Full Round";
  intensity: "Base" | "Build" | "Burn";
  durationSec: number;
  isFree: boolean;
};

export const SESSIONS: Session[] = [
  {
    id: 1,
    title: "The Base",
    shortTitle: "Base",
    summary: "Build the base, move lightly, and finish your first small shadowboxing round.",
    goal: "Know where home is before throwing real punches.",
    focus: "Stance and guard",
    skills: ["Front-foot stance", "High guard", "Small steps", "Front-hand touch"],
    audioCue: "Hands home. Chin tucked. Feet under you.",
    milestone: "Base",
    intensity: "Base",
    durationSec: 509,
    isFree: true,
  },
  {
    id: 2,
    title: "The Jab",
    shortTitle: "Jab",
    summary: "Turn the front hand into the jab: range, rhythm, home, and reset.",
    goal: "Throw a clean jab without reaching or losing the base.",
    focus: "Front hand",
    skills: ["Front-hand path", "Shoulder cover", "Home position", "Step jab"],
    audioCue: "Jab and home.",
    milestone: "Straight Punches",
    intensity: "Base",
    durationSec: 595,
    isFree: false,
  },
  {
    id: 3,
    title: "The Cross",
    shortTitle: "Cross",
    summary: "Add the back-hand cross with hip rotation, balance, and a protected chin.",
    goal: "Use the floor for power without falling through the punch.",
    focus: "Back hand",
    skills: ["Back heel turn", "Hip rotation", "Cross home", "One-two"],
    audioCue: "Turn and home.",
    milestone: "Straight Punches",
    intensity: "Base",
    durationSec: 499,
    isFree: false,
  },
  {
    id: 4,
    title: "The One-Two and Exit",
    shortTitle: "One-Two",
    summary: "Link jab and cross, then leave the line before admiring the work.",
    goal: "Build the first real combination with a safe exit.",
    focus: "Straight combo",
    skills: ["One-two rhythm", "Guard recovery", "Step back", "Side exit"],
    audioCue: "Punch, protect, leave.",
    milestone: "Straight Punches",
    intensity: "Build",
    durationSec: 524,
    isFree: false,
  },
  {
    id: 5,
    title: "The Hook",
    shortTitle: "Hook",
    summary: "Learn the hook as a compact turn, not a wild swing.",
    goal: "Throw a short curved punch while staying balanced.",
    focus: "Curved punch",
    skills: ["Front hook", "Hip turn", "Guard recovery", "One-two-hook"],
    audioCue: "Short turn. Hand home.",
    milestone: "Inside Work",
    intensity: "Build",
    durationSec: 568,
    isFree: false,
  },
  {
    id: 6,
    title: "The Uppercut",
    shortTitle: "Uppercut",
    summary: "Build compact upward punches through the middle without standing tall.",
    goal: "Add inside punches without opening the chin.",
    focus: "Inside punches",
    skills: ["Front uppercut", "Back uppercut", "Small level change", "Elbows close"],
    audioCue: "Bend a little. Lift through the middle. Home.",
    milestone: "Inside Work",
    intensity: "Build",
    durationSec: 671,
    isFree: false,
  },
  {
    id: 7,
    title: "Defence",
    shortTitle: "Defence",
    summary: "Use guard, catch, and slips without panic or over-movement.",
    goal: "Stay safe and available for the next move.",
    focus: "Defensive shapes",
    skills: ["Guard", "Catch", "Slip left", "Slip right", "Cover after work"],
    audioCue: "Small answer. Hands home.",
    milestone: "Defence",
    intensity: "Build",
    durationSec: 610,
    isFree: false,
  },
  {
    id: 8,
    title: "Movement and Angles",
    shortTitle: "Movement",
    summary: "Move without crossing your feet or letting your hands drift.",
    goal: "Keep the base under you while changing position.",
    focus: "Movement",
    skills: ["Forward and back", "Side steps", "Angles", "Base recovery"],
    audioCue: "Move without abandoning yourself.",
    milestone: "Movement",
    intensity: "Build",
    durationSec: 566,
    isFree: false,
  },
  {
    id: 9,
    title: "Attack and Defence",
    shortTitle: "Attack-Defence",
    summary: "Link attack, cover, movement, and reset into short exchanges.",
    goal: "Stop freezing after punches.",
    focus: "Linked exchanges",
    skills: ["One-two-slip", "Cover after attack", "Exit after work", "Reset under pressure"],
    audioCue: "Throw. Protect. Move. Reset.",
    milestone: "Defence",
    intensity: "Burn",
    durationSec: 545,
    isFree: false,
  },
  {
    id: 10,
    title: "Rhythm and Pace",
    shortTitle: "Pace",
    summary: "Change the pace with light work, short lifts, active rest, and breathing.",
    goal: "Learn to manage effort instead of rushing everything.",
    focus: "Pace control",
    skills: ["Light pace", "Short lifts", "Active rest", "Clean reset"],
    audioCue: "Raise the pace without letting it own you.",
    milestone: "Movement",
    intensity: "Burn",
    durationSec: 548,
    isFree: false,
  },
  {
    id: 11,
    title: "Building a Round",
    shortTitle: "Round Build",
    summary: "Work through blocks that prepare you for a complete guided round.",
    goal: "Understand a round as small moments you can manage.",
    focus: "Round structure",
    skills: ["Straight punches", "Inside work", "Defensive exits", "Movement resets"],
    audioCue: "Win the moment. Reset. Win the next.",
    milestone: "Full Round",
    intensity: "Burn",
    durationSec: 511,
    isFree: false,
  },
  {
    id: 12,
    title: "First Full Guided Round",
    shortTitle: "Full Round",
    summary: "Complete a guided shadowboxing round using the whole course.",
    goal: "Finish a structured round with composure and clean resets.",
    focus: "Full round",
    skills: ["Stance", "Punches", "Defence", "Movement", "Active rest", "Reset under fatigue"],
    audioCue: "Make the base cleaner. Make the round calmer.",
    milestone: "Full Round",
    intensity: "Burn",
    durationSec: 527,
    isFree: false,
  },
];

export function getSession(id: number): Session | undefined {
  return SESSIONS.find((s) => s.id === id);
}

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
