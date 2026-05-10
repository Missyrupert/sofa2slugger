"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Headphones,
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

  const nextSession = useMemo(
    () => SESSIONS.find((session) => !completed.includes(session.id)) ?? SESSIONS[0],
    [completed]
  );
  const totalMinutes = Math.round(
    SESSIONS.reduce((total, session) => total + session.durationSec, 0) / 60
  );

  return (
    <div className="bg-[#eee5d8] text-[#11100e]">
      <section className="slugger-ring border-b border-white/10 px-5 py-8 text-[#fbf3e7] sm:px-8 lg:px-10">
        <div className="grid gap-7 lg:grid-cols-[1.06fr_0.94fr] lg:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#f0a086]">
              <Dumbbell className="h-4 w-4" />
              Your course
            </p>
            <h1 className="mt-3 max-w-3xl text-5xl font-black uppercase leading-[0.88] sm:text-6xl">
              Pick up where you left off.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#d8cbbb]">
              Twelve coach-led rounds. No filler, no wandering around the app.
              Press play, stand up, and move.
            </p>
          </div>
          <div className="grid grid-cols-3 border border-white/14 bg-white/7 text-center backdrop-blur">
            <Metric label="Done" value={`${completed.length}/${SESSIONS.length}`} />
            <Metric label="Audio" value={`${totalMinutes}m`} />
            <Metric label="Next" value={nextSession.id.toString().padStart(2, "0")} />
          </div>
        </div>
      </section>

      <section className="px-5 py-6 sm:px-8 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="slugger-card p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9c4b39]">
                  Up next
                </p>
                <h2 className="mt-2 text-3xl font-black uppercase leading-none">
                  Round {nextSession.id.toString().padStart(2, "0")} - {nextSession.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f574f]">
                  {nextSession.summary}
                </p>
                <p className="mt-3 text-sm font-black text-[#11100e]">
                  Corner cue: {nextSession.audioCue}
                </p>
              </div>
              <Link
                href={`/session/${nextSession.id}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#11100e] px-5 py-3 text-sm font-black uppercase text-[#fbf3e7] transition hover:bg-[#2b2925]"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                Train now
              </Link>
            </div>
          </div>

          <div className="border border-[#11100e]/14 bg-[#11100e] p-5 text-[#fbf3e7]">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center bg-[#c7563f]">
                <Headphones className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black uppercase">New here?</p>
                <p className="text-xs font-bold uppercase text-[#d8cbbb]/70">
                  Hear the course intro
                </p>
              </div>
            </div>
            <audio
              controls
              className="w-full"
              src="/audio/course-intro.chill-ska-warm-6x.mp3"
            />
          </div>
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-white/14 px-5 py-4 last:border-r-0">
      <p className="text-3xl font-black">{value}</p>
      <p className="mt-1 text-[11px] font-black uppercase text-[#d8cbbb]/62">
        {label}
      </p>
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
    <div className="group relative flex min-h-64 flex-col overflow-hidden border border-[#11100e]/14 bg-[#fbf3e7] p-5 text-left transition hover:-translate-y-1 hover:border-[#c7563f] hover:shadow-xl hover:shadow-black/10">
      <div className="absolute right-4 top-4 text-7xl font-black leading-none text-[#11100e]/5">
        {session.id.toString().padStart(2, "0")}
      </div>
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7c7469]">
            Round {session.id.toString().padStart(2, "0")}
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase leading-6">
            {session.title}
          </h2>
        </div>
        {isCompleted ? (
          <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-[#5f7467]" />
        ) : accessible ? (
          <span className="bg-[#11100e] px-3 py-1 text-[11px] font-black uppercase text-[#fbf3e7]">
            {session.isFree ? "Free" : "Open"}
          </span>
        ) : (
          <Lock className="h-5 w-5 flex-shrink-0 text-[#7c7469]" />
        )}
      </div>

      <p className="relative mt-4 flex-1 text-sm leading-6 text-[#5f574f]">
        {session.summary}
      </p>

      <div className="relative mt-5 grid grid-cols-2 gap-2 text-xs font-bold uppercase text-[#675f55]">
        <span className="inline-flex items-center gap-2 bg-[#eee5d8] px-3 py-2">
          <Clock3 className="h-4 w-4" />
          {formatDuration(session.durationSec)}
        </span>
        <span className="inline-flex items-center gap-2 bg-[#eee5d8] px-3 py-2">
          <TimerReset className="h-4 w-4" />
          {session.intensity}
        </span>
      </div>

      <div className="relative mt-5">
        {accessible ? (
          <span className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[#11100e] px-4 py-3 text-sm font-black uppercase text-[#fbf3e7] transition group-hover:bg-[#c7563f]">
            <Play className="h-4 w-4" strokeWidth={2.5} fill="currentColor" />
            Play round
          </span>
        ) : (
          <span
            data-testid={`unlock-btn-${session.id}`}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[#11100e]/20 px-4 py-3 text-sm font-black uppercase text-[#11100e] transition group-hover:border-[#c7563f] group-hover:text-[#9c4b39]"
          >
            <Sparkles className="h-4 w-4" />
            Unlock full course
          </span>
        )}
      </div>
    </div>
  );

  if (accessible) {
    return <Link href={`/session/${session.id}`}>{card}</Link>;
  }

  return (
    <button type="button" onClick={onLockedClick} className="w-full">
      {card}
    </button>
  );
}
