"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import {
  COURSE_PRICE_CONTEXT,
  COURSE_PRICE_LABEL,
  COURSE_PROMISES,
  SAFETY_NOTES,
} from "@/lib/product";
import { trackEvent } from "@/lib/analytics";

type UnlockModalProps = {
  onClose: () => void;
};

export function UnlockModal({ onClose }: UnlockModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedDigitalAccess, setAcceptedDigitalAccess] = useState(false);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  async function handleCheckout() {
    trackEvent("checkout_click", { source: "unlock_modal", price: COURSE_PRICE_LABEL });
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unlock-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto border border-white/10 bg-[var(--slugger-ink)] p-6 text-[var(--slugger-bone)] shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-[var(--slugger-panel)]/60 transition hover:text-[var(--slugger-bone)]"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <h2
          id="unlock-modal-title"
          className="pr-8 text-2xl font-black uppercase tracking-tight text-[var(--slugger-bone)]"
        >
          Unlock the full course
        </h2>
        <p className="mt-3 leading-7 text-[var(--slugger-panel)]">
          Round 1 is the proof. The full course takes that base into jabs, crosses, hooks, defence, pace, and a complete guided round.
        </p>

        <div className="mt-5 border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-action-hot)]">
            {COURSE_PRICE_CONTEXT}
          </p>
          <p className="mt-2 text-4xl font-black text-[var(--slugger-bone)]">
            {COURSE_PRICE_LABEL}
          </p>
          <p className="mt-1 text-sm font-bold text-[var(--slugger-panel)]">
            One payment. No subscription.
          </p>
        </div>

        <ul className="mt-4 space-y-2 text-sm font-semibold text-[var(--slugger-panel)]">
          {COURSE_PROMISES.map((item) => (
            <li key={item} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--slugger-action-hot)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-panel)]/70">
            Before you start
          </p>
          <ul className="mt-2 space-y-1 text-xs font-bold leading-5 text-[var(--slugger-panel)]/78">
            {SAFETY_NOTES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {error && (
          <p className="mt-3 text-sm font-bold text-[var(--slugger-action-hot)]">{error}</p>
        )}
        <label className="mt-5 flex items-start gap-3 text-xs font-bold leading-5 text-[var(--slugger-panel)]/82">
          <input
            type="checkbox"
            checked={acceptedDigitalAccess}
            onChange={(event) => setAcceptedDigitalAccess(event.target.checked)}
            className="mt-1 h-4 w-4"
          />
          I understand this is digital content with immediate access after payment.
        </label>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading || !acceptedDigitalAccess}
          className="mt-5 w-full bg-[var(--slugger-brass)] py-4 font-black uppercase tracking-wide text-[var(--slugger-bone)] transition hover:bg-[var(--slugger-action-hot)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Redirecting..." : `Unlock for ${COURSE_PRICE_LABEL}`}
        </button>
      </div>
    </div>
  );
}