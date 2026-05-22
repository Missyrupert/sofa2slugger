"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Session1CompleteModalProps = {
  onClose: () => void;
};

export function Session1CompleteModal({ onClose }: Session1CompleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Something went wrong");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="teaser-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`relative w-full max-w-2xl border border-white/10 bg-[var(--slugger-ink)] p-8 text-[var(--slugger-bone)] shadow-2xl transition-all duration-500 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-[var(--slugger-panel)]/60 transition hover:text-[var(--slugger-bone)]"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <p className="text-sm font-black uppercase tracking-wide text-[var(--slugger-action-hot)]">
          Round 1 complete
        </p>

        <h2
          id="teaser-modal-title"
          className="mt-3 pr-8 text-3xl font-black uppercase tracking-tight text-[var(--slugger-bone)]"
        >
          You finished round one.
        </h2>

        <p className="mt-4 leading-7 text-[var(--slugger-panel)]">
          That was just the warm-up. Rounds 2-12 take you from jabs and crosses
          through to full round work: proper technique, real combinations, and
          rounds that actually make you sweat.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-[var(--slugger-bone)]">
            <span className="font-black text-[var(--slugger-action-hot)]">
              02
            </span>{" "}
            The Jab
          </div>
          <div className="flex items-center gap-2 text-[var(--slugger-bone)]">
            <span className="font-black text-[var(--slugger-action-hot)]">
              03
            </span>{" "}
            The Cross
          </div>
          <div className="flex items-center gap-2 text-[var(--slugger-bone)]">
            <span className="font-black text-[var(--slugger-action-hot)]">
              04
            </span>{" "}
            One-Two &amp; Exit
          </div>
          <div className="flex items-center gap-2 text-[var(--slugger-bone)]">
            <span className="font-black text-[var(--slugger-action-hot)]">
              05
            </span>{" "}
            Hooks
          </div>
          <div className="flex items-center gap-2 text-[var(--slugger-bone)]">
            <span className="font-black text-[var(--slugger-action-hot)]">
              06
            </span>{" "}
            Uppercuts
          </div>
          <div className="flex items-center gap-2 text-[var(--slugger-bone)]">
            <span className="font-black text-[var(--slugger-action-hot)]">
              07
            </span>{" "}
            Basic Defense
          </div>
          <div className="flex items-center gap-2 text-[var(--slugger-bone)]">
            <span className="font-black text-[var(--slugger-action-hot)]">
              08
            </span>{" "}
            Footwork &amp; Angles
          </div>
          <div className="flex items-center gap-2 text-[var(--slugger-bone)]">
            <span className="font-black text-[var(--slugger-action-hot)]">
              09
            </span>{" "}
            Attack &amp; Defense
          </div>
          <div className="flex items-center gap-2 text-[var(--slugger-panel)]">
            <span className="font-black text-[var(--slugger-action-hot)]/70">
              10
            </span>{" "}
            Rhythm &amp; Tempo
          </div>
          <div className="flex items-center gap-2 text-[var(--slugger-panel)]">
            <span className="font-black text-[var(--slugger-action-hot)]/70">
              11
            </span>{" "}
            Round Builder
          </div>
          <div className="flex items-center gap-2 text-[var(--slugger-panel)]">
            <span className="font-black text-[var(--slugger-action-hot)]/70">
              12
            </span>{" "}
            First Full Round
          </div>
        </div>

        <p className="mt-6 text-xs font-bold uppercase text-[var(--slugger-panel)]/68">
          One payment. No subscription. Train whenever you want.
        </p>

        {error && (
          <p className="mt-3 text-sm font-bold text-[var(--slugger-action-hot)]">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            data-analytics-event="Unlock full course clicked"
            data-analytics-label="round_1_complete_modal_checkout"
            className="flex-1 bg-[var(--slugger-brass)] py-4 font-black uppercase tracking-wide text-[var(--slugger-bone)] transition hover:bg-[var(--slugger-action-hot)] disabled:opacity-50"
          >
            {loading ? "Redirecting..." : "Unlock full course - £9.99"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="border border-white/15 px-6 py-4 text-sm font-black uppercase tracking-wide text-[var(--slugger-panel)] transition hover:bg-[var(--slugger-bone)] hover:text-[var(--slugger-ink)]"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
