"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardCheck, Download, RotateCcw } from "lucide-react";
import { COURSE_INTRO_TRANSCRIPT } from "@/lib/course-intro";
import { SESSIONS, formatDuration } from "@/lib/sessions";

type RoundNote = {
  verdict: string;
  timestamps: string;
  changes: string;
};

type ReviewRound = {
  id: string;
  label: string;
  title: string;
  duration?: string;
  src: string;
  cue?: string;
  summary: string;
  transcript?: string;
};

const STORAGE_KEY = "s2s_round_review_notes_v1";
const AUDIO_VERSION = "final-polish-2026-05-20-1421";

const EMPTY_NOTE: RoundNote = {
  verdict: "",
  timestamps: "",
  changes: "",
};

function sessionAudioPath(id: number): string {
  const padded = id.toString().padStart(2, "0");
  if (id === 12) return `/audio/session${padded}.v2.hybrid.no-bells.music.mp3`;
  return `/audio/session${padded}.v2.no-bells.music.mp3`;
}

function buildRounds(): ReviewRound[] {
  return [
    {
      id: "onboarding",
      label: "Onboarding",
      title: "Course Intro",
      src: `/audio/course-intro.chill-ska-warm-6x.mp3?v=${AUDIO_VERSION}`,
      summary: "Narrator setup before the course begins.",
      transcript: COURSE_INTRO_TRANSCRIPT,
    },
    ...SESSIONS.map((session) => ({
      id: `session-${session.id.toString().padStart(2, "0")}`,
      label: `Session ${session.id}`,
      title: session.title,
      duration: formatDuration(session.durationSec),
      src: `${sessionAudioPath(session.id)}?v=${AUDIO_VERSION}`,
      cue: session.audioCue,
      summary: session.summary,
    })),
  ];
}

export default function RoundReviewPage() {
  const rounds = useMemo(() => buildRounds(), []);
  const [notes, setNotes] = useState<Record<string, RoundNote>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      /* ignore local storage issues */
    }
  }, [notes]);

  const exportText = useMemo(() => {
    return rounds
      .map((round) => {
        const note = notes[round.id] ?? EMPTY_NOTE;
        return [
          `${round.label}: ${round.title}`,
          round.duration ? `Duration: ${round.duration}` : null,
          `Verdict: ${note.verdict}`,
          `Timestamps: ${note.timestamps}`,
          `Changes: ${note.changes}`,
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n---\n\n");
  }, [notes, rounds]);

  function updateNote(roundId: string, key: keyof RoundNote, value: string) {
    setNotes((current) => ({
      ...current,
      [roundId]: {
        ...(current[roundId] ?? EMPTY_NOTE),
        [key]: value,
      },
    }));
  }

  async function copyNotes() {
    await navigator.clipboard.writeText(exportText);
  }

  function clearNotes() {
    if (!window.confirm("Clear all round review notes?")) return;
    setNotes({});
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="min-h-screen bg-[var(--slugger-paper)] px-4 py-6 text-[var(--slugger-ink)] sm:px-8 lg:px-10">
      <main className="mx-auto max-w-5xl">
        <Link
          href="/gym"
          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[var(--slugger-muted)] transition hover:text-[var(--slugger-ink)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Gym
        </Link>

        <header className="mt-6 border-b border-[var(--slugger-ink)]/14 pb-6">
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--slugger-brass)]">
            <ClipboardCheck className="h-4 w-4" />
            Latest generated masters
          </p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-5xl font-black uppercase leading-[0.9] sm:text-7xl">
                All rounds review
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--slugger-muted)]">
                One page for the onboarding clip and the latest regenerated session audio. Use this for the final listen-through before we assemble the product layer.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={copyNotes}
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-[var(--slugger-ink)] px-4 py-2 text-xs font-black uppercase text-[var(--slugger-bone)] transition hover:bg-[var(--slugger-brass)] hover:text-[var(--slugger-ink)]"
              >
                <Download className="h-4 w-4" />
                Copy notes
              </button>
              <button
                type="button"
                onClick={clearNotes}
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--slugger-ink)]/18 px-4 py-2 text-xs font-black uppercase text-[var(--slugger-ink)] transition hover:bg-[var(--slugger-bone)]"
              >
                <RotateCcw className="h-4 w-4" />
                Clear
              </button>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4">
          {rounds.map((round, index) => {
            const note = notes[round.id] ?? EMPTY_NOTE;

            return (
              <article
                key={round.id}
                className="border border-[var(--slugger-ink)]/14 bg-[var(--slugger-bone)] p-4 sm:p-5"
              >
                <div className="grid gap-4 lg:grid-cols-[1fr_1.05fr] lg:items-start">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-brass)]">
                      {index === 0 ? round.label : `${round.label} / ${round.duration}`}
                    </p>
                    <h2 className="mt-2 text-2xl font-black uppercase leading-none sm:text-3xl">
                      {round.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--slugger-muted)]">
                      {round.summary}
                    </p>
                    {round.cue && (
                      <p className="mt-3 border-l-4 border-[var(--slugger-brass)] pl-3 text-sm font-bold leading-6">
                        {round.cue}
                      </p>
                    )}
                    <audio controls preload="metadata" src={round.src} className="mt-4 w-full" />
                    <a
                      href={round.src}
                      download
                      className="mt-2 inline-flex text-xs font-black uppercase tracking-wide text-[var(--slugger-muted)] underline-offset-4 hover:text-[var(--slugger-ink)] hover:underline"
                    >
                      Download audio
                    </a>
                    {round.transcript && (
                      <details className="mt-4 border border-[var(--slugger-ink)]/12 bg-[var(--slugger-paper)] p-3">
                        <summary className="cursor-pointer text-xs font-black uppercase tracking-wide text-[var(--slugger-brass)]">
                          Show onboarding transcript
                        </summary>
                        <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-7 text-[var(--slugger-muted)]">
                          {round.transcript}
                        </p>
                      </details>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <label className="grid gap-1">
                      <span className="text-xs font-black uppercase tracking-wide text-[var(--slugger-muted)]">
                        Verdict
                      </span>
                      <textarea
                        value={note.verdict}
                        onChange={(event) => updateNote(round.id, "verdict", event.target.value)}
                        rows={2}
                        placeholder="Bank it, tweak it, or regenerate?"
                        className="border border-[var(--slugger-ink)]/14 bg-[var(--slugger-paper)] px-3 py-2 text-sm font-semibold leading-6 outline-none transition focus:border-[var(--slugger-brass)]"
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-xs font-black uppercase tracking-wide text-[var(--slugger-muted)]">
                        Timestamp notes
                      </span>
                      <textarea
                        value={note.timestamps}
                        onChange={(event) => updateNote(round.id, "timestamps", event.target.value)}
                        rows={3}
                        placeholder="1:03 door line. 7:28 shouty jab. Anything useful."
                        className="border border-[var(--slugger-ink)]/14 bg-[var(--slugger-paper)] px-3 py-2 text-sm font-semibold leading-6 outline-none transition focus:border-[var(--slugger-brass)]"
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-xs font-black uppercase tracking-wide text-[var(--slugger-muted)]">
                        Required changes
                      </span>
                      <textarea
                        value={note.changes}
                        onChange={(event) => updateNote(round.id, "changes", event.target.value)}
                        rows={3}
                        placeholder="Exact script/audio changes needed."
                        className="border border-[var(--slugger-ink)]/14 bg-[var(--slugger-paper)] px-3 py-2 text-sm font-semibold leading-6 outline-none transition focus:border-[var(--slugger-brass)]"
                      />
                    </label>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}