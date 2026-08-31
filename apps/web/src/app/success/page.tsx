import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="slugger-ring flex min-h-[70vh] flex-col items-center justify-center gap-6 p-6 text-center text-[var(--slugger-bone)] md:p-10 rounded shadow-2xl border border-white/5">
      <CheckCircle
        className="h-16 w-16 text-[var(--slugger-signal)]"
        strokeWidth={1.5}
      />
      <p className="text-xs font-black uppercase tracking-widest text-[var(--slugger-action-hot)]">
        You&apos;re in
      </p>
      <h1 className="font-display text-4xl font-black uppercase tracking-tight bg-gradient-to-r from-white via-[var(--slugger-bone)] to-[var(--slugger-brass)] bg-clip-text text-transparent">
        All 12 rounds are open
      </h1>
      <p className="max-w-md text-[var(--slugger-muted)] leading-relaxed">
        If you were sent here from checkout, you still have a path back. The
        course is free now, so there is nothing left to unlock. Head to the gym
        and pick up the next round.
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/gym"
          className="bg-[var(--slugger-brass)] px-8 py-4 font-black uppercase tracking-wide text-[var(--slugger-black)] transition hover:bg-[var(--slugger-action-hot)] shadow-lg shadow-[var(--slugger-brass)]/15 rounded-sm"
        >
          Go to the gym
        </Link>
        <Link
          href="/session/1"
          className="border border-white/10 px-8 py-4 font-black uppercase tracking-wide text-[var(--slugger-bone)] transition hover:bg-white/5 rounded-sm"
        >
          Start Round 1
        </Link>
      </div>
    </div>
  );
}
