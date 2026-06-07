"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain,
  ArrowRight,
  Shield,
  Dumbbell,
  Compass,
  Zap,
  Activity,
  Footprints,
  Maximize2,
  Volume2,
  VolumeX,
  Play,
  X,
  type LucideIcon,
} from "lucide-react";

type Category = "All" | "Stance & Guard" | "Punches" | "Defense" | "Movement" | "Concepts";

interface GlossaryTerm {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  category: Exclude<Category, "All">;
  icon: LucideIcon;
  what: string;
  how: string;
  why: string;
  when: string;
  visualLabel: string;
}

const CATEGORIES: Category[] = ["All", "Stance & Guard", "Punches", "Defense", "Movement", "Concepts"];

const TERMS: GlossaryTerm[] = [
  {
    id: "stance",
    num: "01",
    title: "The Stance",
    subtitle: "Your athletic foundation",
    category: "Stance & Guard",
    icon: Footprints,
    what: "The fundamental athletic posture that serves as the launching pad and safe recovery zone for all offense and defense.",
    how: "Place feet shoulder-width apart. Orthodox fighters step the right foot back (Southpaws step the left back) at a 45-degree angle. Keep knees soft, weight balanced 50/50, and hands protecting your face.",
    why: "Provides optimal balance, multidirectional agility, and minimizes the target area you expose to your opponent.",
    when: "Maintain this posture constantly. Every step, punch, or defensive slip must end with a clean reset back to your stance.",
    visualLabel: "Stance Footprints & Center of Gravity Alignment Grid"
  },
  {
    id: "guard",
    num: "02",
    title: "The High Guard",
    subtitle: "Your defensive shield",
    category: "Stance & Guard",
    icon: Shield,
    what: "The basic hand position that shields your chin, temple, and torso from incoming attacks.",
    how: "Glue your rear knuckles to your chin and lead knuckles to your cheekbone. Keep your elbows tucked tight against your ribs. Look forward over your hands.",
    why: "Blocks straight punches and hooks to the head while keeping your elbows in position to absorb body shots.",
    when: "Your hands must instantly return to this home position the millisecond a punch is retracted.",
    visualLabel: "High Guard Frontal Shield & Elbow Protection Zones"
  },
  {
    id: "jab",
    num: "03",
    title: "The Jab (1)",
    subtitle: "Speed, range, and setup",
    category: "Punches",
    icon: Zap,
    what: "The straight punch thrown with your lead hand.",
    how: "Shoot your lead fist straight out from your chin, rotating your wrist so the palm faces down at impact. Tuck your chin behind your lead shoulder and snap the hand back home.",
    why: "It measures distance, blinds the opponent, sets up combinations, and keeps you safe behind your shoulder.",
    when: "Use it constantly to start combinations, range-find, and disrupt your opponent's rhythm.",
    visualLabel: "Lead Straight Line Punch Trajectory & Shoulder Cover"
  },
  {
    id: "cross",
    num: "04",
    title: "The Cross (2)",
    subtitle: "Power, rotation, and extension",
    category: "Punches",
    icon: Dumbbell,
    what: "The straight punch thrown with your rear hand.",
    how: "Pivot on the ball of your rear foot, turning your hip and shoulder forward. Drive your rear fist straight out, keeping your lead hand glued to your cheek.",
    why: "Delivers maximum straight-line power by transferring kinetic force from the ground through your rotating hips.",
    when: "Throw it immediately following a jab (the One-Two) once the lead hand has established the correct range.",
    visualLabel: "Rear Heel Pivot & Kinetic Rotation Path"
  },
  {
    id: "hooks",
    num: "05",
    title: "The Hooks (3 & 4)",
    subtitle: "Rotational inside punches",
    category: "Punches",
    icon: Compass,
    what: "Curved horizontal punches thrown with either the lead or rear hand.",
    how: "Pivot your lead/rear heel while rotating your hips. Keep your arm bent at a 90-degree angle, elbow raised parallel to the floor, knuckles facing out or down.",
    why: "Bypasses the opponent's guard by hitting from a horizontal angle, targeting the cheekbone or liver.",
    when: "Best thrown at close range, or following straight punches to force the guard to open wide.",
    visualLabel: "90-degree Hook Arc & Hip Pivot Indicator"
  },
  {
    id: "uppercuts",
    num: "06",
    title: "The Uppercuts (5 & 6)",
    subtitle: "Tight vertical punches",
    category: "Punches",
    icon: Maximize2,
    what: "Upward vertical punches thrown inside.",
    how: "Sink slightly into your knees, turn your palm up, and drive the fist upward in a tight loop through the middle. Keep the opposite hand high.",
    why: "Targets the chin or solar plexus when the opponent is ducking, leaning forward, or holding a wide guard.",
    when: "Inside fighting range, particularly against a shell-guarding or leaning opponent.",
    visualLabel: "Upward Vertical Fist Loop & Level-Change Marker"
  },
  {
    id: "slip",
    num: "07",
    title: "The Slip",
    subtitle: "Head movement defense",
    category: "Defense",
    icon: Shield,
    what: "Displacing your head side-to-side to let incoming straight punches pass over your shoulder.",
    how: "Bend your knees slightly and rotate your shoulders. Move your head just 2-3 inches outside the path of the incoming straight punch. Keep your hands up.",
    why: "Evades straight punches cleanly without stepping away, keeping you in perfect range to counter-punch.",
    when: "React to incoming straight jabs and crosses.",
    visualLabel: "Defensive Corridor Slipped Head Vector (Left/Right)"
  },
  {
    id: "roll",
    num: "08",
    title: "The Roll (Bob and Weave)",
    subtitle: "Duck and escape hooks",
    category: "Defense",
    icon: Compass,
    what: "Moving your head in a circular path under and around curved punches.",
    how: "Drop your level by bending your knees. Transfer your weight from one foot to the other in a 'U' shape, ducking under the punch, and rise back into your stance.",
    why: "Allows you to slip underneath horizontal hooks, shifting you to your opponent's blind side (flank).",
    when: "Use when an opponent swings wide hooks at your head.",
    visualLabel: "U-Shaped Trajectory Path Under Hook Sweeps"
  },
  {
    id: "pivot",
    num: "09",
    title: "The Pivot",
    subtitle: "Creating angles of movement",
    category: "Movement",
    icon: Footprints,
    what: "Rotating your stance to change direction and angle without taking steps.",
    how: "Push off your rear foot, swing your heels 45 to 90 degrees around your lead foot, and plant back into your stance.",
    why: "Safely gets you off the opponent's direct line of attack and creates new angles for punches.",
    when: "Immediately after combinations to 'exit' the line, or when cornered.",
    visualLabel: "Angle Foot Rotation Arc & Escape Direction Arrow"
  },
  {
    id: "reset",
    num: "10",
    title: "The Reset",
    subtitle: "Form and balance check",
    category: "Concepts",
    icon: Activity,
    what: "Taking a brief beat to recover posture, guard, and breathing.",
    how: "Step back, lower your shoulders, draw your hands home, and take a deep nose breath to reset your stance.",
    why: "Prevents rushing, keeps you balanced, and maintains technical discipline under fatigue.",
    when: "After every sequence of combinations or defensive slips.",
    visualLabel: "Postural Neutral Alignment & Guard Return Reset"
  },
  {
    id: "active-rest",
    num: "11",
    title: "Active Rest",
    subtitle: "Energy management",
    category: "Concepts",
    icon: Brain,
    what: "Managing your energy during a round while maintaining defensive awareness.",
    how: "Bounce gently in your stance or step lightly while keeping your guard high and taking slow, controlled breaths.",
    why: "Keeps you moving and safe while your muscles recover, avoiding static targets.",
    when: "Between combinations or during slower blocks of a round.",
    visualLabel: "Pacing Amplitude Curve: Peak Effort vs. Recovery"
  }
];

export default function FightIQPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

  const filteredTerms = SELECTED_TERMS(selectedCategory);

  function SELECTED_TERMS(cat: Category) {
    if (cat === "All") return TERMS;
    return TERMS.filter((t) => t.category === cat);
  }

  return (
    <div className="bg-[var(--slugger-paper)] text-[var(--slugger-ink)] min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[var(--slugger-black)] text-[var(--slugger-bone)] px-5 py-12 sm:px-8 lg:px-10 border-b border-white/5">
        <div className="absolute inset-0 slugger-hero-grid opacity-30" />
        <div className="relative max-w-4xl">
          <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-[var(--slugger-action-hot)]">
            <span className="flex h-9 w-9 items-center justify-center bg-[var(--slugger-steel)] text-[var(--slugger-bone)]">
              <Brain className="h-4 w-4" />
            </span>
            Fight IQ
          </div>
          <h1 className="font-display mt-6 text-4xl font-black uppercase leading-none sm:text-5xl lg:text-6xl bg-gradient-to-r from-white to-[var(--slugger-muted)] bg-clip-text text-transparent">
            Course Glossary
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--slugger-muted)] font-medium">
            Sofa2Slugger is entirely audio-led. This page serves as a structured text reference of the terms, punches, and movements coached during the 12 rounds. 
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="px-5 pt-8 sm:px-8 lg:px-10">
        <div className="flex flex-wrap gap-2 pb-2 max-w-6xl mx-auto border-b border-white/5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition rounded-sm border cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[var(--slugger-brass)] text-[var(--slugger-black)] border-[var(--slugger-brass)] shadow-lg shadow-[var(--slugger-brass)]/15"
                  : "border-white/5 bg-white/[0.03] text-[var(--slugger-muted)] hover:bg-white/5 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Glossary Terms List */}
      <section className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8">
            {filteredTerms.length > 0 ? (
              filteredTerms.map((term) => (
                <GlossaryTermCard key={term.id} term={term} />
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-white/5 bg-[var(--slugger-panel)]">
                <p className="font-bold text-[var(--slugger-muted)]">No terms found in this category.</p>
              </div>
            )}
          </div>

          {/* Quick Call to Action */}
          <section className="mt-14 border border-white/5 bg-[var(--slugger-panel)] p-6 text-[var(--slugger-bone)] rounded shadow-lg">
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slugger-action-hot)]">
                  Ready to train?
                </p>
                <h2 className="mt-3 text-2xl font-black uppercase leading-tight sm:text-3xl">
                  Hear how this sounds in a round
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--slugger-muted)]">
                  Session 1 walks you through stance, breathing, and guard setup inside a free, guided shadowboxing round.
                </p>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/session/1"
                  className="inline-flex min-h-12 items-center justify-center gap-3 bg-[var(--slugger-brass)] px-6 py-3 text-sm font-black uppercase text-[var(--slugger-black)] transition hover:bg-[var(--slugger-action-hot)] w-full sm:w-auto shadow-lg shadow-[var(--slugger-brass)]/15 rounded-sm cursor-pointer"
                >
                  Start Round 1 Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function GlossaryTermCard({ term }: { term: GlossaryTerm }) {
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  // Stance, Guard, and Jab are vertical (720x1280)
  const isVerticalVideo = ["stance", "guard", "jab"].includes(term.id);
  const [isVideoVertical, setIsVideoVertical] = useState(isVerticalVideo);

  const hasVideo = ["stance", "guard", "jab", "cross", "hooks", "uppercuts", "slip", "roll", "pivot"].includes(term.id);
  const videoUrl = hasVideo ? `/videos/${term.id}.mp4` : undefined;

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.videoHeight > video.videoWidth) {
      setIsVideoVertical(true);
    }
  };

  const showVideo = videoUrl && !videoError;

  return (
    <div className={`border border-white/5 bg-[var(--slugger-panel)] p-5 lg:p-6 rounded shadow-lg transition duration-200 hover:border-white/10 ${
      showVideo ? "grid gap-6 md:grid-cols-[1.2fr_0.8fr]" : "block"
    }`}>
      {/* Detail Breakdown */}
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center bg-[var(--slugger-black)] border border-white/5 text-xs font-black text-[var(--slugger-brass)] rounded-sm">
              {term.num}
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/5 px-2.5 py-1 text-[var(--slugger-muted)] border border-white/5 rounded-sm">
              {term.category}
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-black uppercase leading-tight text-[var(--slugger-bone)]">
            {term.title}
          </h2>
          <p className="text-xs font-bold uppercase text-[var(--slugger-muted)] mt-0.5">
            {term.subtitle}
          </p>

          <div className={`mt-6 grid gap-4 text-sm leading-relaxed ${
            showVideo ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          }`}>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[var(--slugger-brass)] block mb-1">What is it:</span>
              <p className="text-[var(--slugger-bone)]/85">{term.what}</p>
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[var(--slugger-brass)] block mb-1">How to do it:</span>
              <p className="text-[var(--slugger-bone)]/85">{term.how}</p>
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[var(--slugger-brass)] block mb-1">Why it works:</span>
              <p className="text-[var(--slugger-bone)]/85">{term.why}</p>
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[var(--slugger-brass)] block mb-1">When to use it:</span>
              <p className="text-[var(--slugger-bone)]/85">{term.when}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Themed Visual Box / Looping Video */}
      {showVideo && (
        <div className={`relative border border-white/10 bg-[var(--slugger-black)] overflow-hidden w-full flex flex-col items-center justify-center rounded-sm transition-all duration-300 ${
          isVideoVertical ? "aspect-[3/4] md:max-h-[280px]" : "aspect-video"
        }`}>
          {isPlaying ? (
            <>
              <video
                src={videoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onLoadedMetadata={handleLoadedMetadata}
                onError={() => setVideoError(true)}
                className="absolute inset-0 w-full h-full object-contain opacity-90"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMuted(!isMuted);
                }}
                className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center bg-[var(--slugger-black)]/85 hover:bg-[var(--slugger-black)] border border-white/10 rounded-full text-[var(--slugger-bone)] transition shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                title={isMuted ? "Unmute sound" : "Mute sound"}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-[var(--slugger-muted)]" />
                ) : (
                  <Volume2 className="h-4 w-4 text-[var(--slugger-brass)]" />
                )}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPlaying(false);
                }}
                className="absolute top-3 left-3 z-10 flex h-9 w-9 items-center justify-center bg-[var(--slugger-black)]/85 hover:bg-[var(--slugger-black)] border border-white/10 rounded-full text-[var(--slugger-bone)] transition shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                title="Stop video"
              >
                <X className="h-4 w-4 text-[var(--slugger-muted)]" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center group cursor-pointer transition focus:outline-none"
            >
              {/* Trainer Watermark Background */}
              <img
                src="/images/trainer_base.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-10 transition duration-300 group-hover:opacity-15 group-hover:scale-105"
              />
              {/* Radial Gradient overlay to make the center stand out */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--slugger-black)] via-[var(--slugger-black)]/45 to-transparent" />
              
              {/* Play button overlay */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--slugger-brass)] text-[var(--slugger-black)] transition duration-300 group-hover:bg-[var(--slugger-action-hot)] group-hover:scale-110 shadow-lg shadow-[var(--slugger-brass)]/20">
                  <Play className="h-6 w-6 fill-current ml-0.5" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-[var(--slugger-bone)] group-hover:text-[var(--slugger-brass)] transition duration-200">
                  Watch Demo
                </span>
                {isVideoVertical && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--slugger-muted)] -mt-1 bg-white/5 px-2 py-0.5 rounded-sm border border-white/5">
                    Vertical Video
                  </span>
                )}
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
