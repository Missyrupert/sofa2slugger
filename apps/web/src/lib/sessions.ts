/**
 * Session metadata for the 12-session Sofa2Slugger fundamentals course.
 * Durations match the current generated audio masters.
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
  milestone: "Base" | "Straight Punches" | "Inside Work" | "Defense" | "Movement" | "Full Round";
  intensity: "Base" | "Build" | "Burn";
  durationSec: number;
  isFree: boolean;
};

export const SESSIONS: Session[] = [
  {
    id: 1,
    title: "The Base",
    shortTitle: "Base",
    summary: "Set your stance, guard, breathing, and first calm movement pattern.",
    goal: "Know where home is before throwing real punches.",
    focus: "Stance and guard",
    skills: ["Orthodox or southpaw stance", "High guard", "Small steps", "Breathing rhythm"],
    audioCue: "Hands home. Chin tucked. Feet under you.",
    milestone: "Base",
    intensity: "Base",
    durationSec: 558,
    isFree: true,
  },
  {
    id: 2,
    title: "The Jab",
    shortTitle: "Jab",
    summary: "Build the lead hand as your measuring stick: touch, return, reset.",
    goal: "Throw a clean jab without reaching or losing guard.",
    focus: "Lead hand",
    skills: ["Lead hand path", "Shoulder cover", "Return to guard", "Step jab"],
    audioCue: "Touch and home.",
    milestone: "Straight Punches",
    intensity: "Base",
    durationSec: 664,
    isFree: false,
  },
  {
    id: 3,
    title: "The Cross",
    shortTitle: "Cross",
    summary: "Add the rear straight with hip rotation, balance, and a protected chin.",
    goal: "Use the floor for power without falling through the punch.",
    focus: "Rear hand",
    skills: ["Rear heel turn", "Hip rotation", "Rear hand return", "Jab-cross"],
    audioCue: "Turn, touch, return.",
    milestone: "Straight Punches",
    intensity: "Base",
    durationSec: 556,
    isFree: false,
  },
  {
    id: 4,
    title: "The One-Two and Exit",
    shortTitle: "One-Two",
    summary: "Link jab and cross, then leave the line before admiring the work.",
    goal: "Build the first real combination with a safe exit.",
    focus: "Straight combo",
    skills: ["One-two rhythm", "Guard recovery", "Step out", "Pivot out"],
    audioCue: "Punch, protect, leave.",
    milestone: "Straight Punches",
    intensity: "Build",
    durationSec: 599,
    isFree: false,
  },
  {
    id: 5,
    title: "Hooks",
    shortTitle: "Hooks",
    summary: "Learn compact hooks as turns, not wild swings.",
    goal: "Throw short curved punches while staying balanced.",
    focus: "Curved punches",
    skills: ["Lead hook", "Rear hook", "Hip turn", "Hook after cross"],
    audioCue: "Turn the body. Bring the hand home.",
    milestone: "Inside Work",
    intensity: "Build",
    durationSec: 618,
    isFree: false,
  },
  {
    id: 6,
    title: "Uppercuts",
    shortTitle: "Uppercuts",
    summary: "Build compact upward punches through the middle without standing tall.",
    goal: "Add inside punches without opening the chin.",
    focus: "Inside punches",
    skills: ["Lead uppercut", "Rear uppercut", "Small level change", "Elbows close"],
    audioCue: "Stay compact. Up the middle. Home.",
    milestone: "Inside Work",
    intensity: "Build",
    durationSec: 728,
    isFree: false,
  },
  {
    id: 7,
    title: "Basic Defense",
    shortTitle: "Defense",
    summary: "Catch, parry, slip, and roll without panic or over-movement.",
    goal: "Stay safe and available for the next move.",
    focus: "Defensive shapes",
    skills: ["Catch", "Parry", "Slip left", "Slip right", "Roll"],
    audioCue: "Small move, clean shape.",
    milestone: "Defense",
    intensity: "Build",
    durationSec: 667,
    isFree: false,
  },
  {
    id: 8,
    title: "Footwork and Angles",
    shortTitle: "Footwork",
    summary: "Move without crossing your feet or letting your hands drift.",
    goal: "Keep the base under you while changing position.",
    focus: "Movement",
    skills: ["Forward and back", "Side steps", "Push from the floor", "Pivot"],
    audioCue: "Feet under you.",
    milestone: "Movement",
    intensity: "Build",
    durationSec: 633,
    isFree: false,
  },
  {
    id: 9,
    title: "Attack and Defense",
    shortTitle: "Attack-Defense",
    summary: "Build defense into combinations so every attack has a reset.",
    goal: "Stop freezing after punches.",
    focus: "Defensive combinations",
    skills: ["Jab-cross-slip", "Jab-cross-roll", "Hook-roll-hook", "Exit after work"],
    audioCue: "Every attack has a receipt.",
    milestone: "Defense",
    intensity: "Burn",
    durationSec: 595,
    isFree: false,
  },
  {
    id: 10,
    title: "Rhythm and Tempo",
    shortTitle: "Tempo",
    summary: "Change gears with light touches, bursts, active rest, and breathing.",
    goal: "Learn to manage effort instead of rushing everything.",
    focus: "Pace control",
    skills: ["Light rhythm", "Fast bursts", "Active rest", "Bell awareness"],
    audioCue: "Find the gear. Breathe on the shot.",
    milestone: "Movement",
    intensity: "Burn",
    durationSec: 614,
    isFree: false,
  },
  {
    id: 11,
    title: "Round Builder",
    shortTitle: "Round Builder",
    summary: "Work through timed blocks that prepare you for a complete round.",
    goal: "Understand a round as small moments you can manage.",
    focus: "Round structure",
    skills: ["30-second blocks", "Combination flow", "Defensive exits", "Movement resets"],
    audioCue: "Win the moment. Reset. Win the next.",
    milestone: "Full Round",
    intensity: "Burn",
    durationSec: 520,
    isFree: false,
  },
  {
    id: 12,
    title: "First Full Round",
    shortTitle: "Full Round",
    summary: "Complete a guided shadowboxing round using the whole course.",
    goal: "Finish a structured round with composure and clean resets.",
    focus: "Full round",
    skills: ["Stance", "Punches", "Defense", "Footwork", "Active rest", "Reset under fatigue"],
    audioCue: "You finished the round. Now make it cleaner.",
    milestone: "Full Round",
    intensity: "Burn",
    durationSec: 616,
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
