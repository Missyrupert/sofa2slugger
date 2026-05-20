"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, Headphones, ListChecks } from "lucide-react";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { Session1CompleteModal } from "@/components/session1-complete-modal";
import { UnlockModal } from "@/components/unlock-modal";
import { getSessionAudioPath } from "@/content/audioMap";
import { SESSIONS, formatDuration, getSession } from "@/lib/sessions";
import { SAFETY_NOTES } from "@/lib/product";
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
  const [showUnlock, setShowUnlock] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const sessionId = parseInt(params.id as string, 10);
  const session = getSession(sessionId);
  const src = getSessionAudioPath(sessionId);
  const nextSession = SESSIONS.find((item) => item.id === sessionId + 1);

  useEffect(() => {
    if (!session) return;
    const id = window.setTimeout(() => {
      const hasAccess = hasUnlockedAll();
      setUnlocked(hasAccess);
      if (!session.isFree && !hasAccess) {
        router.replace("/gym");
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, [session, router]);

  if (!session) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 p-10 text-center">
        <p className="text-lg font-black uppercase text-[var(--slugger-ink)]">
          Round not found.
        </p>
        <Link href="/gym" className="font-black uppercase text-[var(--slugger-brass)]">
          Back to Gym
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[var(--slugger-paper)] text-[var(--slugger-ink)]">
      <section className="border-b border-[var(--slugger-ink)]/12 bg-[var(--slugger-bone)] px-5 py-6 sm:px-8 lg:px-12">
        <Link
          href="/gym"
          className="inline-flex w-fit items-center gap-2 text-sm font-black uppercase tracking-wide text-[var(--slugger-muted)] transition hover:text-[var(--slugger-ink)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Course
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--slugger-brass)]">
              Round {sessionId.toString().padStart(2, "0")} / {SESSIONS.length}
            </p>
            <h1 className="mt-3 max-w-4xl text-5xl font-black uppercase leading-[0.88] sm:text-7xl">
              {session.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--slugger-muted)]">
              {session.summary}
            </p>
          </div>

          <div className="border border-[var(--slugger-ink)]/14 bg-[var(--slugger-ink)] p-5 text-[var(--slugger-bone)]">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-action-hot)]">
              Coach cue
            </p>
            <p className="mt-3 text-xl font-black leading-7">{session.audioCue}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="border-t border-white/14 pt-3">
                <dt className="inline-flex items-center gap-2 text-xs font-bold uppercase text-white/44">
                  <Clock3 className="h-4 w-4" />
                  Time
                </dt>
                <dd className="mt-1 font-black">{formatDuration(session.durationSec)}</dd>
              </div>
              <div className="border-t border-white/14 pt-3">
                <dt className="inline-flex items-center gap-2 text-xs font-bold uppercase text-white/44">
                  <ListChecks className="h-4 w-4" />
                  Focus
                </dt>
                <dd className="mt-1 font-black">{session.focus}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_330px] lg:items-start">
          <div className="slugger-ring border border-white/10 bg-[var(--slugger-ink)] p-5 text-[var(--slugger-bone)] shadow-2xl shadow-black/15 sm:p-6">
            {completed ? (
              <div className="flex min-h-80 flex-col items-center justify-center gap-4 text-center">
                <CheckCircle2 className="h-14 w-14 text-[var(--slugger-signal)]" />
                <div>
                  <p className="text-3xl font-black uppercase text-[var(--slugger-bone)]">Round complete</p>
                  <p className="mt-2 text-[var(--slugger-panel)]">Round logged. Keep coming back.</p>
                </div>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/gym"
                    className="bg-[var(--slugger-bone)] px-5 py-3 text-sm font-black uppercase tracking-wide text-[var(--slugger-ink)]"
                  >
                    Back to course
                  </Link>
                  {nextSession && (nextSession.isFree || unlocked) && (
                    <Link
                      href={`/session/${nextSession.id}`}
                      className="bg-[var(--slugger-brass)] px-5 py-3 text-sm font-black uppercase tracking-wide text-[var(--slugger-bone)]"
                    >
                      Next round
                    </Link>
                  )}
                  {nextSession && !nextSession.isFree && !unlocked && (
                    <button
                      type="button"
                      onClick={() => setShowUnlock(true)}
                      className="bg-[var(--slugger-brass)] px-5 py-3 text-sm font-black uppercase tracking-wide text-[var(--slugger-bone)]"
                    >
                      Unlock next rounds
                    </button>
                  )}
                </div>
              </div>
            ) : src ? (
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
              <div className="flex min-h-80 flex-col items-center justify-center gap-5 text-center">
                <span className="flex h-16 w-16 items-center justify-center bg-[var(--slugger-ink)] text-[var(--slugger-bone)]">
                  <Headphones className="h-8 w-8" />
                </span>
                <div>
                  <p className="text-2xl font-black uppercase">Audio in production</p>
                  <p className="mt-2 max-w-md text-[var(--slugger-muted)]">
                    This round is being prepared for the final audio pass.
                  </p>
                </div>
              </div>
            )}
          </div>

          <aside className="grid gap-4">
            {sessionId === 1 && (
              <div className="border-t border-[var(--slugger-ink)]/16 pt-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-brass)]">
                  Course intro
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--slugger-muted)]">
                  New here? Let the narrator set the frame before the coach starts the base.
                </p>
                <audio
                  controls
                  preload="metadata"
                  src="/audio/course-intro.chill-ska-warm-6x.mp3"
                  className="mt-3 w-full"
                />
              </div>
            )}

            <div className="border-t border-[var(--slugger-ink)]/16 pt-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-brass)]">
                Before play
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--slugger-muted)]">
                Start the audio, then let the screen go quiet. The coach will tell you what to do and when to move.
              </p>
              <ul className="mt-4 grid gap-2 text-sm font-bold leading-6 text-[var(--slugger-muted)]">
                {SAFETY_NOTES.map((note) => (
                  <li key={note} className="border-l-4 border-[var(--slugger-brass)] pl-3">
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[var(--slugger-ink)]/16 pt-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-brass)]">
                Skills
              </p>
              <ul className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-[var(--slugger-muted)]">
                {session.skills.map((skill) => (
                  <li key={skill} className="border border-[var(--slugger-ink)]/12 px-3 py-2">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[var(--slugger-ink)]/16 pt-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-brass)]">
                Program
              </p>
              <div className="mt-3 grid gap-1">
                {SESSIONS.map((item) => {
                  const accessible = item.isFree || unlocked;
                  const className = `grid grid-cols-[42px_1fr] gap-3 border px-3 py-3 text-left transition ${
                    item.id === sessionId
                      ? "border-[var(--slugger-brass)] bg-[var(--slugger-bone)]"
                      : "border-[var(--slugger-ink)]/10 hover:bg-[var(--slugger-bone)]"
                  }`;
                  const content = (
                    <>
                      <span className="text-sm font-black text-[var(--slugger-ink)]/42">
                        {item.id.toString().padStart(2, "0")}
                      </span>
                      <span className="font-black uppercase leading-tight text-[var(--slugger-ink)]">
                        {item.shortTitle}
                      </span>
                    </>
                  );

                  if (accessible) {
                    return (
                      <Link key={item.id} href={`/session/${item.id}`} className={className}>
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setShowUnlock(true)}
                      className={className}
                    >
                      {content}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {showUnlock && <UnlockModal onClose={() => setShowUnlock(false)} />}

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