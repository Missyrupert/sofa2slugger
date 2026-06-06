"use client";

import { FormEvent, useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { getStoredAttribution } from "@/lib/attribution";

type EmailCaptureProps = {
  source: "homepage" | "round_1_complete";
  variant?: "light" | "dark";
};

export function EmailCapture({
  source,
  variant = "light",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    trackEvent("email_capture_viewed", { source });
  }, [source]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          page: window.location.pathname,
          attribution: getStoredAttribution(),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        trackEvent("email_submit_failed", {
          source,
          reason: data.error ?? "unknown_error",
        });
        setStatus("error");
        setMessage(data.error ?? "That did not work. Please try again.");
        return;
      }

      trackEvent("email_submitted", {
        source,
        storage_mode: data.mode ?? "configured_destination",
      });
      setStatus("success");
      setMessage(data.message ?? "Done! Your Reset Plan is downloading.");
      setEmail("");

      // Trigger automatic browser download of the PDF
      const link = document.createElement("a");
      link.href = "/downloads/sofa2slugger-reset-plan.pdf";
      link.setAttribute("download", "sofa2slugger-reset-plan.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      trackEvent("email_submit_failed", {
        source,
        reason: "network_error",
      });
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const dark = variant === "dark";

  return (
    <div
      className={`border rounded p-4 sm:p-5 shadow-lg ${
        dark
          ? "border-white/5 bg-[var(--slugger-panel)] text-[var(--slugger-bone)]"
          : "border-[var(--slugger-ink)]/14 bg-[var(--slugger-bone)] text-[var(--slugger-ink)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${
            dark
              ? "bg-[var(--slugger-black)] border border-white/5 text-[var(--slugger-brass)]"
              : "bg-[var(--slugger-ink)] text-[var(--slugger-bone)]"
          }`}
        >
          <Mail className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-black uppercase leading-tight tracking-tight">
            Want the beginner reset plan?
          </h2>
          <p
            className={`mt-2 text-sm leading-6 ${
              dark ? "text-[var(--slugger-muted)]" : "text-[var(--slugger-muted)]"
            }`}
          >
            Enter your email and I&apos;ll send you the 3-step Sofa2Slugger Reset Plan to stance, guard, and breathing baseline.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]"
      >
        <label className="sr-only" htmlFor={`email-capture-${source}`}>
          Email address
        </label>
        <input
          id={`email-capture-${source}`}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          placeholder="you@example.com"
          className={`min-h-12 w-full border px-4 text-sm font-bold outline-none rounded-sm ${
            dark
              ? "border-white/10 bg-black/30 text-[var(--slugger-bone)] placeholder:text-white/20 focus:border-[var(--slugger-brass)]"
              : "border-[var(--slugger-ink)]/18 bg-white text-[var(--slugger-ink)] placeholder:text-[var(--slugger-muted)]/60 focus:border-[var(--slugger-brass)]"
          }`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`min-h-12 px-5 py-3 text-sm font-black uppercase transition disabled:opacity-60 rounded-sm cursor-pointer ${
            dark
              ? "bg-[var(--slugger-brass)] text-[var(--slugger-black)] hover:bg-[var(--slugger-action-hot)] shadow-lg shadow-[var(--slugger-brass)]/15"
              : "bg-[var(--slugger-ink)] text-[var(--slugger-bone)] hover:bg-[var(--slugger-brass)]"
          }`}
        >
          {status === "loading" ? "Sending..." : "Send me the reset plan"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-3 text-sm font-bold ${
            status === "success"
              ? "text-[var(--slugger-signal)]"
              : "text-[var(--slugger-action-hot)]"
          }`}
        >
          {status === "success" ? (
            <span>
              {message}{" "}
              <a
                href="/downloads/sofa2slugger-reset-plan.pdf"
                download
                className="underline hover:text-[var(--slugger-brass)] ml-1"
              >
                Click here to download manually.
              </a>
            </span>
          ) : (
            message
          )}
        </p>
      )}
    </div>
  );
}
