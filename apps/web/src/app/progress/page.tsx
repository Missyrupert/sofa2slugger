"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Play, Trophy } from "lucide-react";
import { SESSIONS } from "@/lib/sessions";
import { getCompletedSessions, getSessionProgress } from "@/lib/storage";

export default function ProgressPage() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setCompleted(getCompletedSessions());
      setMounted(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const nextSession = SESSIONS.find((s) => !completed.includes(s.id));
  const percent = mounted ? Math.round((completed.length / SESSIONS.length) * 100) : 0;

  return (
    <div className="bg-[var(--slugger-paper)] px-5 py-8 text-[var(--slugger-ink)] sm:px-8 lg:px-10 min-h-screen">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[var(--slugger-brass)]">
            <Trophy className="h-4 w-4" />
            Progress
          </p>
          <h1 className="font-display mt-2 text-5xl font-black uppercase leading-none sm:text-6xl bg-gradient-to-r from-white to-[var(--slugger-muted)] bg-clip-text text-transparent">
            Your round card.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--slugger-muted)]">
            Completed rounds appear here when the audio finishes. It is your
            record of what you have done, and where to go next.
          </p>
        </div>
        {nextSession && (
          <Link
            href={`/session/${nextSession.id}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--slugger-brass)] px-5 py-3 text-sm font-black uppercase tracking-wide text-[var(--slugger-black)] transition hover:bg-[var(--slugger-action-hot)] shadow-lg shadow-[var(--slugger-brass)]/15 rounded-sm"
          >
            <Play className="h-4 w-4" fill="currentColor" />
            Continue
          </Link>
        )}
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-[330px_1fr]">
        <section className="border border-white/5 bg-[var(--slugger-panel)] p-6 text-[var(--slugger-bone)] rounded flex flex-col items-center justify-center shadow-lg">
          <div className="relative mx-auto flex h-52 w-52 items-center justify-center rounded-full overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: `conic-gradient(var(--slugger-brass) ${percent}%, rgba(255,255,255,0.06) ${percent}% 100%)`,
              }}
            />
            <div className="relative flex h-40 w-40 flex-col items-center justify-center bg-[var(--slugger-black)] rounded-full border border-white/5">
              <p className="text-5xl font-black text-[var(--slugger-bone)]">{completed.length}</p>
              <p className="text-xs font-black uppercase text-[var(--slugger-muted)]">
                of {SESSIONS.length}
              </p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <h2 className="text-xl font-black uppercase text-[var(--slugger-bone)]">{percent}% complete</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--slugger-muted)]">
              {nextSession
                ? `Next: Round ${nextSession.id.toString().padStart(2, "0")} - ${nextSession.title}`
                : "Course complete. Replay any round whenever you want."}
            </p>
          </div>
        </section>

        <section className="border border-white/5 bg-[var(--slugger-panel)] p-4 sm:p-5 rounded shadow-lg">
          <div className="grid grid-cols-1 gap-2">
            {SESSIONS.map((session) => {
              const progress = getSessionProgress(session.id);
              const done = completed.includes(session.id);
              return (
                <Link
                  key={session.id}
                  href={`/session/${session.id}`}
                  className={`grid grid-cols-[auto_1fr_auto] items-center gap-4 border p-4 transition rounded-sm cursor-pointer ${
                    done
                      ? "border-[var(--slugger-signal)]/30 bg-[var(--slugger-signal)]/10 hover:bg-[var(--slugger-signal)]/15"
                      : "border-white/5 bg-[var(--slugger-paper)]/50 hover:bg-[var(--slugger-paper)]/80"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="h-6 w-6 text-[var(--slugger-signal)] flex-shrink-0" />
                  ) : (
                    <Circle className="h-6 w-6 text-white/20 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-black uppercase leading-tight text-[var(--slugger-bone)]">
                      {session.id.toString().padStart(2, "0")} {session.title}
                    </p>
                    <p className="mt-1 text-sm text-[var(--slugger-muted)] leading-relaxed">
                      {done && progress.lastPlayed
                        ? `Completed ${new Date(progress.lastPlayed).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}${progress.count > 1 ? `, ${progress.count} times` : ""}`
                        : session.summary}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[var(--slugger-muted)] flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
