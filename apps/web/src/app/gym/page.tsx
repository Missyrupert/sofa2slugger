"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Play,
  TimerReset,
  Dumbbell,
} from "lucide-react";
import { SESSIONS, formatDuration } from "@/lib/sessions";
import { getCompletedSessions } from "@/lib/storage";

export default function GymPage() {
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setCompleted(getCompletedSessions());
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="max-w-full overflow-x-hidden bg-[var(--slugger-paper)] pb-8 text-[var(--slugger-ink)] min-h-screen md:pb-0">
      <section className="slugger-ring border-b border-white/5 px-5 py-8 text-[var(--slugger-bone)] sm:px-8 lg:px-10">
        <div className="grid gap-7 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[var(--slugger-action-hot)]">
              <Dumbbell className="h-4 w-4" />
              Your course
            </p>
            <h1 className="font-display mt-3 max-w-full break-words text-4xl font-black uppercase leading-[0.92] sm:max-w-3xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-white to-[var(--slugger-muted)] bg-clip-text text-transparent">
              Take it one round at a time.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--slugger-muted)]">
              All 12 rounds are free. Start with The Base, then move through punches, defense, movement, and a full shadowboxing round.
            </p>
          </div>
          <div className="border border-white/5 bg-white/[0.02] p-5 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-action-hot)]">
              How it works
            </p>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-[var(--slugger-bone)]">
              <p>
                <span className="mr-2 text-[var(--slugger-brass)] font-black">
                  01
                </span>
                Every round is open.
              </p>
              <p>
                <span className="mr-2 text-[var(--slugger-brass)] font-black">
                  02
                </span>
                Audio leads. The screen supports.
              </p>
              <p>
                <span className="mr-2 text-[var(--slugger-brass)] font-black">
                  03
                </span>
                Completed rounds appear on Progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-6 sm:px-8 lg:px-10">
        <div className="border border-white/5 bg-[var(--slugger-panel)] p-5 rounded">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-brass)]">
            Course card
          </p>
          <h2 className="font-display mt-2 text-3xl font-black uppercase leading-none text-[var(--slugger-bone)]">
            Start where you are.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--slugger-muted)]">
            Round 1 is a clean starting point. The other rounds show the path
            ahead: fundamentals, defense, movement, rhythm, and steady flow.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SESSIONS.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              isCompleted={completed.includes(session.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function SessionCard({
  session,
  isCompleted,
}: {
  session: (typeof SESSIONS)[0];
  isCompleted: boolean;
}) {
  return (
    <Link
      href={`/session/${session.id}`}
      data-analytics-event={
        session.id === 1 ? "Start Round 1 clicked" : undefined
      }
      data-analytics-label={session.id === 1 ? "gym_round_card" : undefined}
    >
      <div className="group relative flex min-h-64 flex-col overflow-hidden border border-white/5 bg-[var(--slugger-panel)] p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[var(--slugger-brass)]/30 hover:shadow-xl">
        <div className="absolute right-4 top-4 text-7xl font-black leading-none text-white/[0.02]">
          {session.id.toString().padStart(2, "0")}
        </div>
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slugger-muted)]">
              Round {session.id.toString().padStart(2, "0")}
            </p>
            <h2 className="font-display mt-2 text-2xl font-black uppercase leading-6 text-[var(--slugger-bone)]">
              {session.title}
            </h2>
          </div>
          {isCompleted ? (
            <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-[var(--slugger-signal)]" />
          ) : (
            <span className="bg-[var(--slugger-brass)] px-3 py-1 text-[11px] font-black uppercase text-[var(--slugger-black)]">
              Open
            </span>
          )}
        </div>

        <p className="relative mt-4 flex-1 text-sm leading-6 text-[var(--slugger-muted)]">
          {session.summary}
        </p>

        <div className="relative mt-5 grid grid-cols-2 gap-2 text-xs font-bold uppercase text-[var(--slugger-muted)]">
          <span className="inline-flex items-center gap-2 bg-[var(--slugger-black)] px-3 py-2 border border-white/[0.02]">
            <Clock3 className="h-4 w-4 text-[var(--slugger-brass)]" />
            {formatDuration(session.durationSec)}
          </span>
          <span className="inline-flex items-center gap-2 bg-[var(--slugger-black)] px-3 py-2 border border-white/[0.02]">
            <TimerReset className="h-4 w-4 text-[var(--slugger-brass)]" />
            {session.intensity}
          </span>
        </div>

        <div className="relative mt-5">
          <span className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[var(--slugger-brass)] px-4 py-3 text-sm font-black uppercase text-[var(--slugger-black)] transition duration-300 group-hover:bg-[var(--slugger-action-hot)]">
            <Play className="h-4 w-4" strokeWidth={2.5} fill="currentColor" />
            Play round
          </span>
        </div>
      </div>
    </Link>
  );
}
