"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

type Session1CompleteModalProps = {
  onClose: () => void;
};

export function Session1CompleteModal({ onClose }: Session1CompleteModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in on mount
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 transition-opacity duration-500 backdrop-blur-sm ${visible ? "opacity-100" : "opacity-0"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="round1-complete-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`relative w-full max-w-xl border border-white/5 bg-[var(--slugger-panel)] p-8 text-[var(--slugger-bone)] shadow-2xl transition-all duration-500 rounded ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-[var(--slugger-muted)] transition hover:text-white cursor-pointer"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <p className="text-xs font-black uppercase tracking-widest text-[var(--slugger-action-hot)]">
          Round 1 complete
        </p>

        <h2
          id="round1-complete-title"
          className="mt-3 pr-8 text-3xl font-black uppercase tracking-tight text-[var(--slugger-bone)] text-balance bg-gradient-to-r from-white via-[var(--slugger-bone)] to-[var(--slugger-brass)] bg-clip-text text-transparent"
        >
          You stood up and finished Round 1. That is the hardest part.
        </h2>

        <p className="mt-4 leading-7 text-[var(--slugger-muted)]">
          You&apos;ve set your stance, guard, breathing, and first calm
          movement. That is the first round of the free 12-round sofa boxing
          programme. Next is The Jab. Same space, same pace.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/session/2"
            onClick={onClose}
            className="flex-1 bg-[var(--slugger-brass)] py-4 text-center font-black uppercase tracking-wide text-[var(--slugger-black)] transition hover:bg-[var(--slugger-action-hot)] shadow-lg shadow-[var(--slugger-brass)]/15 rounded-sm"
          >
            Continue to Round 2
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="border border-white/10 px-6 py-4 text-sm font-black uppercase tracking-wide text-[var(--slugger-bone)] transition hover:bg-white/5 cursor-pointer rounded-sm"
          >
            Stay here
          </button>
        </div>
        <Link
          href="/gym"
          onClick={onClose}
          className="mt-4 inline-flex w-full justify-center text-sm font-black uppercase tracking-wide text-[var(--slugger-muted)] transition hover:text-white text-center"
        >
          See the full programme
        </Link>
      </div>
    </div>
  );
}
