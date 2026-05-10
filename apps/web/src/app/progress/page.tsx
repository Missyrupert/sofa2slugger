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
    <div className="bg-[#eee5d8] px-5 py-8 text-[#11100e] sm:px-8 lg:px-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#9c4b39]">
            <Trophy className="h-4 w-4" />
            Progress
          </p>
          <h1 className="mt-2 text-5xl font-black uppercase leading-none sm:text-6xl">
            Build the habit.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#5f574f]">
            Completed rounds become part of the card. The job is not perfection:
            it is coming back and moving again.
          </p>
        </div>
        {nextSession && (
          <Link
            href={`/session/${nextSession.id}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#11100e] px-5 py-3 text-sm font-black uppercase tracking-wide text-[#fbf3e7] transition hover:bg-[#c7563f]"
          >
            <Play className="h-4 w-4" fill="currentColor" />
            Resume
          </Link>
        )}
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-[330px_1fr]">
        <section className="border border-black/10 bg-[#11100e] p-6 text-[#fbf3e7]">
          <div className="relative mx-auto flex h-52 w-52 items-center justify-center">
            <div
              className="absolute inset-0"
              style={{
                background: `conic-gradient(#c7563f ${percent}%, rgba(255,255,255,0.12) ${percent}% 100%)`,
              }}
            />
            <div className="relative flex h-40 w-40 flex-col items-center justify-center bg-[#11100e]">
              <p className="text-5xl font-black">{completed.length}</p>
              <p className="text-xs font-black uppercase text-white/48">
                of {SESSIONS.length}
              </p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <h2 className="text-xl font-black uppercase">{percent}% complete</h2>
            <p className="mt-2 text-sm leading-6 text-[#d8cbbb]">
              {nextSession
                ? `Next: Round ${nextSession.id.toString().padStart(2, "0")} - ${nextSession.title}`
                : "Course complete. Replay any round whenever you want."}
            </p>
          </div>
        </section>

        <section className="border border-black/10 bg-[#fbf3e7]/78 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-2">
            {SESSIONS.map((session) => {
              const progress = getSessionProgress(session.id);
              const done = completed.includes(session.id);
              return (
                <Link
                  key={session.id}
                  href={`/session/${session.id}`}
                  className={`grid grid-cols-[auto_1fr_auto] items-center gap-4 border p-4 transition hover:bg-white ${
                    done
                      ? "border-[#5f7467]/30 bg-[#5f7467]/10"
                      : "border-black/8 bg-[#eee5d8]/70"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="h-6 w-6 text-[#5f7467]" />
                  ) : (
                    <Circle className="h-6 w-6 text-[#b8aa98]" />
                  )}
                  <div>
                    <p className="font-black uppercase leading-tight text-[#11100e]">
                      {session.id.toString().padStart(2, "0")} {session.title}
                    </p>
                    <p className="mt-1 text-sm text-[#675f55]">
                      {done && progress.lastPlayed
                        ? `Completed ${new Date(progress.lastPlayed).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}${progress.count > 1 ? `, ${progress.count} times` : ""}`
                        : session.summary}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#7c7469]" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
