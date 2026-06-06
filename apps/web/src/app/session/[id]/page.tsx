"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronDown, Clock3, Headphones, ListChecks } from "lucide-react";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { Session1CompleteModal } from "@/components/session1-complete-modal";
import { getSessionAudioPath } from "@/content/audioMap";
import { SESSIONS, formatDuration, getSession } from "@/lib/sessions";
import {
  hasSeenSession1Teaser,
  hasUnlockedAll,
  markSession1TeaserSeen,
} from "@/lib/storage";

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [showMobileProgram, setShowMobileProgram] = useState(false);

  const sessionId = parseInt(params.id as string, 10);
  const session = getSession(sessionId);
  const src = getSessionAudioPath(sessionId);
  const nextSession = SESSIONS.find((item) => item.id === sessionId + 1);

  useEffect(() => {
    if (!session) return;
    if (!session.isFree && !hasUnlockedAll()) {
      router.replace("/gym");
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 p-10 text-center bg-[var(--slugger-paper)]">
        <p className="font-display text-lg font-black uppercase text-[var(--slugger-bone)]">
          Round not found.
        </p>
        <Link href="/gym" className="font-black uppercase text-[var(--slugger-brass)] hover:text-[var(--slugger-action-hot)]">
          Back to Gym
        </Link>
      </div>
    );
  }

  return (
    <div className="grid min-h-full grid-cols-1 lg:grid-cols-[1fr_340px] bg-[var(--slugger-paper)]">
      <section className="slugger-ring flex flex-col px-5 py-6 text-white sm:px-8 lg:px-10 border-r border-white/5 justify-between">
        <Link
          href="/gym"
          className="inline-flex w-fit items-center gap-2 border border-white/12 bg-white/5 px-3 py-2 text-sm font-black uppercase tracking-wide text-white/70 transition hover:bg-[var(--slugger-bone)] hover:text-[var(--slugger-black)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Gym
        </Link>

        <div className="flex-1 flex flex-col justify-center py-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center xl:gap-12 max-w-5xl mx-auto w-full">
            {/* Session Info Details */}
            <div className="text-left flex flex-col justify-center">
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[var(--slugger-action-hot)]">
                Round {sessionId.toString().padStart(2, "0")} / {SESSIONS.length}
              </p>
              <h1 className="font-display text-balance mt-3 text-4xl font-black uppercase leading-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-white to-[var(--slugger-muted)] bg-clip-text text-transparent">
                {session.title}
              </h1>
              <p className="mt-4 text-base leading-7 text-[var(--slugger-muted)]">
                {session.summary}
              </p>
              
              <div className="hidden lg:block mt-6 border-t border-white/5 pt-6 text-xs text-[var(--slugger-muted)]">
                <p className="font-black uppercase text-[var(--slugger-brass)]">Before you press play</p>
                <p className="mt-2 leading-relaxed">
                  Clear a little space, keep the volume comfortable, and move at the
                  pace that lets you stay in control. If you lose the rhythm, pause,
                  reset your stance, and start again.
                </p>
              </div>
            </div>

            {/* Audio Player Card (Sleek Stopwatch Box) */}
            <div className="w-full border border-white/5 bg-black/30 p-6 backdrop-blur rounded flex flex-col items-center justify-center shadow-2xl">
              {completed ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <CheckCircle2 className="h-14 w-14 text-[var(--slugger-signal)]" />
                  <div>
                    <p className="font-display text-2xl font-black uppercase text-[var(--slugger-bone)]">
                      Round complete
                    </p>
                    <p className="mt-2 text-[var(--slugger-muted)]">Good work. Keep showing up.</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row mt-4">
                    <Link
                      href="/gym"
                      className="bg-[var(--slugger-bone)] px-5 py-3 text-sm font-black uppercase tracking-wide text-[var(--slugger-black)] transition hover:bg-white"
                    >
                      Back to Gym
                    </Link>
                    {nextSession && (
                      <Link
                        href={`/session/${nextSession.id}`}
                        className="bg-[var(--slugger-brass)] px-5 py-3 text-sm font-black uppercase tracking-wide text-[var(--slugger-black)] transition hover:bg-[var(--slugger-action-hot)]"
                      >
                        Next round
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                src ? (
                  <AudioPlayer
                    src={src}
                    sessionId={sessionId}
                    onComplete={() => {
                      if (
                        sessionId === 1 &&
                        !hasUnlockedAll() &&
                        !hasSeenSession1Teaser()
                      ) {
                        markSession1TeaserSeen();
                        setShowTeaser(true);
                      } else {
                        setCompleted(true);
                      }
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-5 py-10 text-center">
                    <span className="flex h-16 w-16 items-center justify-center bg-[var(--slugger-brass)] text-[var(--slugger-black)] rounded-full">
                      <Headphones className="h-8 w-8" />
                    </span>
                    <div>
                      <p className="font-display text-2xl font-black uppercase text-[var(--slugger-bone)]">
                        Audio in production
                      </p>
                      <p className="mt-2 max-w-md text-[var(--slugger-muted)] text-sm leading-6">
                        This round is ready for the two-voice audio pass: narrator intro, coach lesson, narrator close.
                      </p>
                    </div>
                    <Link
                      href="/gym"
                      className="bg-[var(--slugger-bone)] px-5 py-3 text-sm font-black uppercase tracking-wide text-[var(--slugger-black)] transition hover:bg-white"
                    >
                      Back to Gym
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <aside className="border-t border-white/5 bg-[var(--slugger-paper)] p-5 sm:p-6 lg:border-l lg:border-l-white/5 lg:border-t-0">
        <div className="border border-white/5 bg-[var(--slugger-panel)] p-5 rounded">
          <p className="text-xs font-black uppercase text-[var(--slugger-brass)]">
            Round notes
          </p>
          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center justify-between bg-[var(--slugger-black)] px-3 py-2 border border-white/[0.02]">
              <dt className="inline-flex items-center gap-2 font-bold text-[var(--slugger-muted)]">
                <Clock3 className="h-4 w-4 text-[var(--slugger-brass)]" />
                Duration
              </dt>
              <dd className="font-black text-[var(--slugger-bone)]">
                {formatDuration(session.durationSec)}
              </dd>
            </div>
            <div className="flex items-center justify-between bg-[var(--slugger-black)] px-3 py-2 border border-white/[0.02]">
              <dt className="inline-flex items-center gap-2 font-bold text-[var(--slugger-muted)]">
                <ListChecks className="h-4 w-4 text-[var(--slugger-brass)]" />
                Focus
              </dt>
              <dd className="font-black text-[var(--slugger-bone)]">{session.focus}</dd>
            </div>
          </dl>
          <div className="mt-4 bg-[var(--slugger-black)] px-3 py-3 border border-white/[0.02]">
            <p className="text-xs font-black uppercase text-[var(--slugger-muted)]">
              Cue
            </p>
            <p className="mt-1 text-sm font-bold text-[var(--slugger-bone)]">
              {session.audioCue}
            </p>
          </div>
          <div className="mt-4 bg-[var(--slugger-black)] px-3 py-3 border border-white/[0.02]">
            <p className="text-xs font-black uppercase text-[var(--slugger-muted)]">
              Skills
            </p>
            <ul className="mt-2 space-y-1 text-sm text-[var(--slugger-muted)]">
              {session.skills.map((skill) => (
                <li key={skill} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[var(--slugger-brass)] rounded-full" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 border border-white/5 bg-[var(--slugger-panel)] p-5 rounded">
          <p className="text-xs font-black uppercase text-[var(--slugger-brass)]">
            Before you press play
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--slugger-muted)] font-medium">
            Clear a little space, keep the volume comfortable, and move at the
            pace that lets you stay in control. If you lose the rhythm, pause,
            reset your stance, and start again.
          </p>
        </div>

        <div className="mt-4 border border-white/5 bg-[var(--slugger-panel)] p-5 rounded">
          <p className="text-xs font-black uppercase text-[var(--slugger-brass)]">
            Program
          </p>
          <button
            type="button"
            onClick={() => setShowMobileProgram((value) => !value)}
            className="mt-3 flex w-full items-center justify-between bg-[var(--slugger-black)] px-3 py-3 text-left text-sm font-black uppercase text-[var(--slugger-bone)] lg:hidden border border-white/[0.02]"
          >
            View course
            <ChevronDown
              className={`h-4 w-4 transition ${showMobileProgram ? "rotate-180" : ""}`}
            />
          </button>
          <div className={`mt-4 flex-col gap-2 lg:flex ${showMobileProgram ? "flex" : "hidden"}`}>
            {SESSIONS.map((item) => (
              <Link
                key={item.id}
                href={`/session/${item.id}`}
                className={`border px-3 py-3 transition rounded ${
                  item.id === sessionId
                    ? "border-[var(--slugger-brass)] bg-[var(--slugger-brass)]/10"
                    : "border-white/5 bg-[var(--slugger-paper)] hover:bg-[var(--slugger-charcoal)]"
                }`}
              >
                <p className="text-[10px] font-black uppercase text-[var(--slugger-muted)]">
                  {item.id.toString().padStart(2, "0")} / {item.intensity}
                </p>
                <p className="mt-1 font-black uppercase leading-tight text-[var(--slugger-bone)]">
                  {item.shortTitle}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {showTeaser && (
        <Session1CompleteModal
          onClose={() => {
            setShowTeaser(false);
            setCompleted(true);
          }}
        />
      )}
    </div>
  );
}
