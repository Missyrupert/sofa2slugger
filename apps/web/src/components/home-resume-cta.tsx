"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { SESSIONS } from "@/lib/sessions";
import { getCompletedSessions } from "@/lib/storage";

export function HomeResumeCta() {
  const [nextRound, setNextRound] = useState<number | null>(null);

  useEffect(() => {
    const completed = getCompletedSessions();
    if (completed.length === 0) return;
    const next = SESSIONS.find((session) => !completed.includes(session.id));
    setNextRound(next?.id ?? completed[completed.length - 1]);
  }, []);

  if (!nextRound) return null;

  return (
    <Link
      href={`/session/${nextRound}`}
      className="mt-5 inline-flex min-h-12 items-center justify-center gap-3 border border-[var(--slugger-action-hot)] bg-[var(--slugger-action-hot)] px-5 py-3 text-sm font-black uppercase text-[var(--slugger-bone)] transition hover:bg-[var(--slugger-brass)]"
    >
      <Play className="h-4 w-4" fill="currentColor" />
      Continue Round {nextRound}
    </Link>
  );
}
