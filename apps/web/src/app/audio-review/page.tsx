"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardCheck, Download, RotateCcw } from "lucide-react";
import { SESSIONS, formatDuration } from "@/lib/sessions";

type ReviewNote = {
  overall: string;
  pace: string;
  confusing: string;
  boring: string;
  glitch: string;
  bestLine: string;
  beginner: string;
  change: string;
};

type ReviewItem = {
  id: string;
  label: string;
  title: string;
  duration?: string;
  summary: string;
  cue?: string;
  src: string;
  fileNote: string;
};

const NOTE_FIELDS: Array<{ key: keyof ReviewNote; label: string; placeholder: string }> = [
  { key: "overall", label: "Overall", placeholder: "How did this feel as a user?" },
  { key: "pace", label: "Too slow / right / too fast", placeholder: "Pace, spacing, urgency, breathing room..." },
  { key: "confusing", label: "Any confusing instruction", placeholder: "Anything unclear, contradictory, or too technical?" },
  { key: "boring", label: "Any dead or boring space", placeholder: "Where did attention drop?" },
  { key: "glitch", label: "Any weird voice / glitch", placeholder: "Timestamp and what happened." },
  { key: "bestLine", label: "Best line", placeholder: "Anything worth protecting?" },
  { key: "beginner", label: "Would a beginner keep up", placeholder: "Yes/no and why." },
  { key: "change", label: "Change needed", placeholder: "Keep, tweak, or regenerate?" },
];

const EMPTY_NOTE: ReviewNote = {
  overall: "",
  pace: "",
  confusing: "",
  boring: "",
  glitch: "",
  bestLine: "",
  beginner: "",
  change: "",
};

const STORAGE_KEY = "s2s_audio_review_notes_v2";

function buildReviewItems(): ReviewItem[] {
  return [
    {
      id: "onboarding",
      label: "Onboarding",
      title: "Course Intro",
      summary: "The narrator sets the scene before Round 1.",
      src: "/audio/course-intro.chill-ska-warm-6x.mp3",
      fileNote: "Onboarding clip with narrator and music.",
    },
    ...SESSIONS.map((session) => {
      const padded = session.id.toString().padStart(2, "0");
      return {
        id: `session-${padded}`,
        label: `Session ${padded}`,
        title: session.title,
        duration: formatDuration(session.durationSec),
        summary: session.summary,
        cue: session.audioCue,
        src: `/audio/full-review/session${padded}.full-review.mp3`,
        fileNote: "Full review assembly: narrator intro, coach round, narrator close, and teaser where relevant.",
      };
    }),
  ];
}

export default function AudioReviewPage() {
  const [notes, setNotes] = useState<Record<string, ReviewNote>>({});
  const reviewItems = useMemo(() => buildReviewItems(), []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setNotes(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      /* ignore */
    }
  }, [notes]);

  const exportText = useMemo(() => {
    return reviewItems.map((item) => {
      const note = notes[item.id] ?? EMPTY_NOTE;
      return [
        `${item.label}: ${item.title}`,
        item.duration ? `Duration: ${item.duration}` : null,
        `Overall: ${note.overall}`,
        `Too slow / right / too fast: ${note.pace}`,
        `Any confusing instruction: ${note.confusing}`,
        `Any dead or boring space: ${note.boring}`,
        `Any weird voice/glitch: ${note.glitch}`,
        `Best line: ${note.bestLine}`,
        `Would a beginner keep up: ${note.beginner}`,
        `Change needed: ${note.change}`,
      ].filter(Boolean).join("\n");
    }).join("\n\n---\n\n");
  }, [notes, reviewItems]);

  function updateNote(itemId: string, key: keyof ReviewNote, value: string) {
    setNotes((current) => ({
      ...current,
      [itemId]: {
        ...(current[itemId] ?? EMPTY_NOTE),
        [key]: value,
      },
    }));
  }

  async function copyNotes() {
    await navigator.clipboard.writeText(exportText);
  }

  function clearNotes() {
    const confirmed = window.confirm("Clear all saved review notes?");
    if (!confirmed) return;
    setNotes({});
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="bg-[var(--slugger-paper)] px-5 py-8 text-[var(--slugger-ink)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[var(--slugger-muted)] transition hover:text-[var(--slugger-ink)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>

        <section className="mt-8 grid gap-6 border-b border-[var(--slugger-ink)]/14 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--slugger-brass)]">
              <ClipboardCheck className="h-4 w-4" />
              Full product audio review
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.88] sm:text-7xl">
              Onboarding. Rounds. Notes.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--slugger-muted)]">
              This page plays the onboarding clip and full review assemblies for all 12 sessions, including narrator framing. Notes save in this browser automatically.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <button
              type="button"
              onClick={copyNotes}
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--slugger-ink)] px-5 py-3 text-sm font-black uppercase text-[var(--slugger-bone)] transition hover:bg-[var(--slugger-brass)]"
            >
              <Download className="h-4 w-4" />
              Copy notes
            </button>
            <button
              type="button"
              onClick={clearNotes}
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-[var(--slugger-ink)]/18 px-5 py-3 text-sm font-black uppercase text-[var(--slugger-ink)] transition hover:bg-[var(--slugger-bone)]"
            >
              <RotateCcw className="h-4 w-4" />
              Clear notes
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-6">
          {reviewItems.map((item) => {
            const note = notes[item.id] ?? EMPTY_NOTE;

            return (
              <article
                key={item.id}
                className="border border-[var(--slugger-ink)]/14 bg-[var(--slugger-bone)] p-5 sm:p-6"
              >
                <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-brass)]">
                      {item.label}{item.duration ? ` / ${item.duration}` : ""}
                    </p>
                    <h2 className="mt-2 text-3xl font-black uppercase leading-none">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--slugger-muted)]">
                      {item.summary}
                    </p>
                    {item.cue && (
                      <p className="mt-4 border-l-4 border-[var(--slugger-brass)] pl-3 text-sm font-bold leading-6 text-[var(--slugger-ink)]">
                        {item.cue}
                      </p>
                    )}
                    <audio controls preload="metadata" className="mt-5 w-full" src={item.src} />
                    <p className="mt-2 text-xs font-bold uppercase text-[var(--slugger-muted)]">
                      {item.fileNote}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {NOTE_FIELDS.map((field) => (
                      <label key={field.key} className="grid gap-1">
                        <span className="text-xs font-black uppercase tracking-wide text-[var(--slugger-muted)]">
                          {field.label}
                        </span>
                        <textarea
                          value={note[field.key]}
                          onChange={(event) => updateNote(item.id, field.key, event.target.value)}
                          rows={field.key === "overall" || field.key === "change" ? 3 : 2}
                          placeholder={field.placeholder}
                          className="border border-[var(--slugger-ink)]/14 bg-[var(--slugger-paper)] px-3 py-3 text-sm font-semibold leading-6 text-[var(--slugger-ink)] outline-none transition focus:border-[var(--slugger-brass)]"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}