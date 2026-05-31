"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Lock,
  Play,
  Sparkles,
  TimerReset,
  Dumbbell,
} from "lucide-react";
import { SESSIONS, formatDuration } from "@/lib/sessions";
import { hasUnlockedAll, getCompletedSessions } from "@/lib/storage";
import { UnlockModal } from "@/components/unlock-modal";

export default function GymPage() {
  const [showUnlock, setShowUnlock] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setUnlocked(hasUnlockedAll());
      setCompleted(getCompletedSessions());
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="max-w-full overflow-x-hidden bg-[var(--slugger-paper)] pb-8 text-[var(--slugger-ink)] md:pb-0">
      <section className="slugger-ring border-b border-white/10 px-5 py-8 text-[var(--slugger-bone)] sm:px-8 lg:px-10">
        <div className="grid gap-7 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[var(--slugger-action-hot)]">
              <Dumbbell className="h-4 w-4" />
              Your course
            </p>
            <h1 className="mt-3 max-w-full break-words text-4xl font-black uppercase leading-[0.92] sm:max-w-3xl sm:text-5xl lg:text-6xl">
              Take it one round at a time.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--slugger-panel)]">
              The Base is open now. Rounds 2-12 unlock together when you are ready to build steady momentum.
            </p>
          </div>
          <div className="border border-white/14 bg-white/[0.05] p-5 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-action-hot)]">
              How it opens
            </p>
            <div className="mt-4 grid gap-3 text-sm font-bold text-[var(--slugger-panel)]">
              <p>
                <span className="mr-2 text-[var(--slugger-action-hot)]">
                  01
                </span>
                Round 1 is free.
              </p>
              <p>
                <span className="mr-2 text-[var(--slugger-action-hot)]">
                  02
                </span>
                The full course unlocks with one payment.
              </p>
              <p>
                <span className="mr-2 text-[var(--slugger-action-hot)]">
                  03
                </span>
                Your completed rounds appear on Progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-6 sm:px-8 lg:px-10">
        <div className="slugger-card p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-brass)]">
            Course card
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase leading-none">
            Start where you are.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--slugger-muted)]">
            Round 1 is your starting point. The other rounds show the path
            ahead: fundamentals, defense, movement, rhythm, and steady flow.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SESSIONS.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              unlocked={unlocked}
              isCompleted={completed.includes(session.id)}
              onLockedClick={() => setShowUnlock(true)}
            />
          ))}
        </div>
      </section>

      {showUnlock && <UnlockModal onClose={() => setShowUnlock(false)} />}
    </div>
  );
}

function SessionCard({
  session,
  unlocked,
  isCompleted,
  onLockedClick,
}: {
  session: (typeof SESSIONS)[0];
  unlocked: boolean;
  isCompleted: boolean;
  onLockedClick: () => void;
}) {
  const accessible = session.isFree || unlocked;

  const card = (
    <div className="group relative flex min-h-64 flex-col overflow-hidden border border-[var(--slugger-ink)]/14 bg-[var(--slugger-bone)] p-5 text-left transition hover:-translate-y-1 hover:border-[var(--slugger-brass)] hover:shadow-xl hover:shadow-black/10">
      <div className="absolute right-4 top-4 text-7xl font-black leading-none text-[var(--slugger-ink)]/5">
        {session.id.toString().padStart(2, "0")}
      </div>
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slugger-muted)]">
            Round {session.id.toString().padStart(2, "0")}
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase leading-6">
            {session.title}
          </h2>
        </div>
        {isCompleted ? (
          <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-[var(--slugger-signal)]" />
        ) : accessible ? (
          <span className="bg-[var(--slugger-ink)] px-3 py-1 text-[11px] font-black uppercase text-[var(--slugger-bone)]">
            {session.isFree ? "Free" : "Open"}
          </span>
        ) : (
          <Lock className="h-5 w-5 flex-shrink-0 text-[var(--slugger-muted)]" />
        )}
      </div>

      <p className="relative mt-4 flex-1 text-sm leading-6 text-[var(--slugger-muted)]">
        {session.summary}
      </p>

      <div className="relative mt-5 grid grid-cols-2 gap-2 text-xs font-bold uppercase text-[var(--slugger-muted)]">
        <span className="inline-flex items-center gap-2 bg-[var(--slugger-paper)] px-3 py-2">
          <Clock3 className="h-4 w-4" />
          {formatDuration(session.durationSec)}
        </span>
        <span className="inline-flex items-center gap-2 bg-[var(--slugger-paper)] px-3 py-2">
          <TimerReset className="h-4 w-4" />
          {session.intensity}
        </span>
      </div>

      <div className="relative mt-5">
        {accessible ? (
          <span className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[var(--slugger-ink)] px-4 py-3 text-sm font-black uppercase text-[var(--slugger-bone)] transition group-hover:bg-[var(--slugger-brass)]">
            <Play className="h-4 w-4" strokeWidth={2.5} fill="currentColor" />
            Play round
          </span>
        ) : (
          <span
            data-testid={`unlock-btn-${session.id}`}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[var(--slugger-ink)]/20 px-4 py-3 text-sm font-black uppercase text-[var(--slugger-ink)] transition group-hover:border-[var(--slugger-brass)] group-hover:text-[var(--slugger-brass)]"
          >
            <Sparkles className="h-4 w-4" />
            Unlock full course
          </span>
        )}
      </div>
    </div>
  );

  if (accessible) {
    return (
      <Link
        href={`/session/${session.id}`}
        data-analytics-event={
          session.id === 1 ? "Start Round 1 clicked" : undefined
        }
        data-analytics-label={session.id === 1 ? "gym_round_card" : undefined}
      >
        {card}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onLockedClick}
      data-analytics-event="Unlock full course clicked"
      data-analytics-label={`locked_round_${session.id}`}
      className="w-full"
    >
      {card}
    </button>
  );
}
