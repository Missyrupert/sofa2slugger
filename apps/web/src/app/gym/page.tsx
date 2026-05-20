"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Lock,
  Play,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import { SESSIONS, formatDuration } from "@/lib/sessions";
import { hasUnlockedAll, getCompletedSessions } from "@/lib/storage";
import { COURSE_PRICE_CONTEXT, COURSE_PRICE_LABEL } from "@/lib/product";
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
    <div className="bg-[var(--slugger-paper)] text-[var(--slugger-ink)]">
      <section className="border-b border-[var(--slugger-ink)]/12 bg-[var(--slugger-bone)] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_380px] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--slugger-brass)]">
              <ShieldCheck className="h-4 w-4" />
              Your course
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.88] sm:text-7xl">
              Start with the base. Build the round.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--slugger-muted)]">
              Round 1 is open. Rounds 2-12 unlock as one complete programme when you are ready to keep going.
            </p>
          </div>

          <div className="border border-[var(--slugger-ink)]/14 bg-[var(--slugger-ink)] p-5 text-[var(--slugger-bone)]">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-action-hot)]">
              How it works
            </p>
            <div className="mt-5 grid gap-4 text-sm font-bold text-white/70">
              <p><span className="mr-2 text-[var(--slugger-action-hot)]">01</span>Play Round 1 free.</p>
              <p><span className="mr-2 text-[var(--slugger-action-hot)]">02</span>Unlock the full course once.</p>
              <p><span className="mr-2 text-[var(--slugger-action-hot)]">03</span>Replay any round whenever you need the work.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 lg:grid-cols-[330px_1fr] lg:items-start">
            <aside className="border-t border-[var(--slugger-ink)]/16 pt-5 lg:sticky lg:top-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-brass)]">
                Course card
              </p>
              <h2 className="mt-3 text-3xl font-black uppercase leading-none">
                Twelve sessions. One path.
              </h2>
              <p className="mt-4 text-sm leading-6 text-[var(--slugger-muted)]">
                The screen is only the doorway. The work happens in your ears and your feet.
              </p>
                <div className="mt-6 grid grid-cols-3 border-y border-[var(--slugger-ink)]/12 py-4 text-center">
                <Metric value="1" label="Free" />
                <Metric value="12" label="Rounds" />
                <Metric value="0" label="Kit" />
              </div>
              {unlocked ? (
                <div className="mt-5 border border-[var(--slugger-signal)]/30 bg-[var(--slugger-signal)]/10 px-5 py-4 text-sm font-black uppercase text-[var(--slugger-ink)]">
                  All rounds unlocked
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowUnlock(true)}
                  className="mt-5 w-full bg-[var(--slugger-ink)] px-5 py-4 text-sm font-black uppercase text-[var(--slugger-bone)] transition hover:bg-[var(--slugger-brass)]"
                >
                  Unlock all rounds - {COURSE_PRICE_LABEL}
                </button>
              )}
              <p className="mt-2 text-xs font-black uppercase tracking-wide text-[var(--slugger-muted)]">
                {unlocked
                  ? "Replay any round whenever you need the work."
                  : `${COURSE_PRICE_CONTEXT}. Pay once. No subscription.`}
              </p>
            </aside>

            <div className="border-y border-[var(--slugger-ink)]/14">
              {SESSIONS.map((session) => (
                <SessionRow
                  key={session.id}
                  session={session}
                  unlocked={unlocked}
                  isCompleted={completed.includes(session.id)}
                  onLockedClick={() => setShowUnlock(true)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {showUnlock && <UnlockModal onClose={() => setShowUnlock(false)} />}
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-[var(--slugger-ink)]/12 px-2 last:border-r-0">
      <p className="text-3xl font-black leading-none">{value}</p>
      <p className="mt-1 text-[11px] font-black uppercase text-[var(--slugger-muted)]">{label}</p>
    </div>
  );
}

function SessionRow({
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

  const content = (
    <div className="grid w-full gap-4 border-b border-[var(--slugger-ink)]/10 bg-[var(--slugger-paper)] py-5 text-left transition last:border-b-0 hover:bg-[var(--slugger-bone)] sm:grid-cols-[64px_1fr_210px] sm:items-center sm:px-4">
      <div className="text-3xl font-black leading-none text-[var(--slugger-ink)]/34">
        {session.id.toString().padStart(2, "0")}
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-black uppercase leading-6 text-[var(--slugger-ink)]">
            {session.title}
          </h2>
          {isCompleted && <CheckCircle2 className="h-5 w-5 text-[var(--slugger-signal)]" />}
        </div>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--slugger-muted)]">
          {session.summary}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold uppercase text-[var(--slugger-muted)]">
          <span className="inline-flex items-center gap-1 border border-[var(--slugger-ink)]/10 px-2 py-1">
            <Clock3 className="h-3.5 w-3.5" />
            {formatDuration(session.durationSec)}
          </span>
          <span className="inline-flex items-center gap-1 border border-[var(--slugger-ink)]/10 px-2 py-1">
            <TimerReset className="h-3.5 w-3.5" />
            {session.intensity}
          </span>
        </div>
      </div>

      <div className="sm:justify-self-end">
        {accessible ? (
          <span className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[var(--slugger-ink)] px-4 py-3 text-sm font-black uppercase text-[var(--slugger-bone)] transition sm:w-auto">
            <Play className="h-4 w-4" strokeWidth={2.5} fill="currentColor" />
            {session.isFree ? "Play free" : "Play round"}
          </span>
        ) : (
          <span className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[var(--slugger-ink)]/20 px-4 py-3 text-sm font-black uppercase text-[var(--slugger-ink)] transition sm:w-auto">
            <Lock className="h-4 w-4" />
            Unlock
          </span>
        )}
      </div>
    </div>
  );

  if (accessible) {
    return <Link href={`/session/${session.id}`}>{content}</Link>;
  }

  return (
    <button type="button" onClick={onLockedClick} className="w-full">
      {content}
    </button>
  );
}