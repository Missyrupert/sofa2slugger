"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, Headphones, ListChecks } from "lucide-react";
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
    <div className="grid min-h-full grid-cols-1 lg:grid-cols-[1fr_340px]">
      <section className="slugger-ring flex flex-col px-5 py-6 text-white sm:px-8 lg:px-10">
        <Link
          href="/gym"
          className="inline-flex w-fit items-center gap-2 border border-white/12 bg-white/8 px-3 py-2 text-sm font-black uppercase tracking-wide text-white/72 transition hover:bg-[var(--slugger-bone)] hover:text-[var(--slugger-ink)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Gym
        </Link>

        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center py-10 text-center">
          <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[var(--slugger-action-hot)]">
            Round {sessionId.toString().padStart(2, "0")} / {SESSIONS.length}
          </p>
          <h1 className="text-balance mt-3 text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
            {session.title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/64">
            {session.summary}
          </p>

          <div className="mt-8 w-full border border-white/10 bg-black/25 p-5 backdrop-blur">
            {completed ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle2 className="h-14 w-14 text-[#8dc7a3]" />
                <div>
                  <p className="text-2xl font-black uppercase">
                    Round complete
                  </p>
                  <p className="mt-2 text-white/62">Good work. Keep showing up.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/gym"
                    className="bg-[var(--slugger-bone)] px-5 py-3 text-sm font-black uppercase tracking-wide text-[var(--slugger-ink)]"
                  >
                    Back to Gym
                  </Link>
                  {nextSession && (
                    <Link
                      href={`/session/${nextSession.id}`}
                      className="bg-[var(--slugger-brass)] px-5 py-3 text-sm font-black uppercase tracking-wide text-[var(--slugger-bone)]"
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
                  <span className="flex h-16 w-16 items-center justify-center bg-[var(--slugger-bone)] text-[var(--slugger-ink)]">
                    <Headphones className="h-8 w-8" />
                  </span>
                  <div>
                    <p className="text-2xl font-black uppercase">
                    Audio in production
                  </p>
                  <p className="mt-2 max-w-md text-white/62">
                      This round is ready for the two-voice audio pass: narrator intro, coach lesson, narrator close.
                    </p>
                  </div>
                  <Link
                    href="/gym"
                    className="bg-[var(--slugger-bone)] px-5 py-3 text-sm font-black uppercase tracking-wide text-[var(--slugger-ink)]"
                  >
                    Back to Gym
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <aside className="border-t border-black/10 bg-[var(--slugger-paper)] p-5 sm:p-6 lg:border-l lg:border-t-0">
        <div className="border border-black/10 bg-[var(--slugger-bone)]/78 p-5">
          <p className="text-xs font-black uppercase text-[var(--slugger-brass)]">
            Round notes
          </p>
          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center justify-between bg-[var(--slugger-paper)] px-3 py-2">
              <dt className="inline-flex items-center gap-2 font-bold text-[var(--slugger-muted)]">
                <Clock3 className="h-4 w-4" />
                Duration
              </dt>
              <dd className="font-black text-[var(--slugger-ink)]">
                {formatDuration(session.durationSec)}
              </dd>
            </div>
            <div className="flex items-center justify-between bg-[var(--slugger-paper)] px-3 py-2">
              <dt className="inline-flex items-center gap-2 font-bold text-[var(--slugger-muted)]">
                <ListChecks className="h-4 w-4" />
                Focus
              </dt>
              <dd className="font-black text-[var(--slugger-ink)]">{session.focus}</dd>
            </div>
          </dl>
          <div className="mt-4 bg-[var(--slugger-paper)] px-3 py-3">
            <p className="text-xs font-black uppercase text-[var(--slugger-muted)]">
              Cue
            </p>
            <p className="mt-1 text-sm font-bold text-[var(--slugger-ink)]">
              {session.audioCue}
            </p>
          </div>
          <div className="mt-4 bg-[var(--slugger-paper)] px-3 py-3">
            <p className="text-xs font-black uppercase text-[var(--slugger-muted)]">
              Skills
            </p>
            <ul className="mt-2 space-y-1 text-sm text-[var(--slugger-muted)]">
              {session.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4 border border-black/10 bg-[var(--slugger-bone)]/78 p-5">
          <p className="text-xs font-black uppercase text-[var(--slugger-brass)]">
            Before you press play
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--slugger-muted)]">
            Clear a little space, keep the volume comfortable, and move at the
            pace that lets you stay in control. If you lose the rhythm, pause,
            reset your stance, and start again.
          </p>
        </div>

        <div className="mt-4 border border-black/10 bg-[var(--slugger-bone)]/78 p-5">
          <p className="text-xs font-black uppercase text-[var(--slugger-brass)]">
            Program
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {SESSIONS.map((item) => (
              <Link
                key={item.id}
                href={`/session/${item.id}`}
                className={`border px-3 py-3 transition ${
                  item.id === sessionId
                    ? "border-[var(--slugger-brass)]/45 bg-[var(--slugger-brass)]/10"
                    : "border-black/8 bg-[var(--slugger-paper)]/70 hover:bg-white"
                }`}
              >
                <p className="text-xs font-black uppercase text-[var(--slugger-muted)]">
                  {item.id.toString().padStart(2, "0")} / {item.intensity}
                </p>
                <p className="mt-1 font-black uppercase leading-tight text-[var(--slugger-ink)]">
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
