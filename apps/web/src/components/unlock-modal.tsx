"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type UnlockModalProps = {
  onClose: () => void;
};

export function UnlockModal({ onClose }: UnlockModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unlock-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md border border-white/10 bg-[var(--slugger-ink)] p-6 text-[var(--slugger-bone)] shadow-2xl">
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
          Get lifetime access to all 12 audio shadowboxing rounds. Pay once,
          train forever.
        </p>
        <ul className="mt-4 space-y-2 text-sm font-semibold text-[var(--slugger-panel)]">
          <li>12 progressive rounds</li>
          <li>Proper form and technique coaching</li>
          <li>No subscription, no recurring fees</li>
        </ul>
        {error && (
          <p className="mt-3 text-sm font-bold text-[var(--slugger-action-hot)]">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          data-analytics-event="Unlock full course clicked"
          data-analytics-label="unlock_modal_checkout"
          className="mt-6 w-full bg-[var(--slugger-brass)] py-4 font-black uppercase tracking-wide text-[var(--slugger-bone)] transition hover:bg-[var(--slugger-action-hot)] disabled:opacity-50"
        >
          {loading ? "Redirecting..." : "Unlock for £9.99"}
        </button>
      </div>
    </div>
  );
}
