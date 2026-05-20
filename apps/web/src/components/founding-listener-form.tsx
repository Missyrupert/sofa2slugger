"use client";

import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type Status = "idle" | "sending" | "sent" | "error";

export function FoundingListenerForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });

      if (!response.ok) throw new Error("Form submission failed");
      trackEvent("founding_listener_submit", {
        interest: String(formData.get("interest") ?? ""),
      });
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      name="founding-listener"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="border border-[var(--slugger-ink)]/14 bg-[var(--slugger-bone)] p-5"
    >
      <input type="hidden" name="form-name" value="founding-listener" />
      <input type="hidden" name="subject" value="New Sofa2Slugger founding listener" />
      <p className="hidden">
        <label>
          Do not fill this out: <input name="bot-field" />
        </label>
      </p>

      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center bg-[var(--slugger-ink)] text-[var(--slugger-bone)]">
          <Mail className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-xl font-black uppercase leading-6">Founding listeners</h3>
          <p className="text-sm leading-6 text-[var(--slugger-muted)]">
            Get the launch price and help shape the first public version.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <label className="grid gap-1 text-sm font-bold text-[var(--slugger-muted)]">
          Email
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            className="min-h-12 border border-[var(--slugger-ink)]/18 bg-[var(--slugger-paper)] px-3 text-base font-bold text-[var(--slugger-ink)] outline-none focus:border-[var(--slugger-brass)]"
            placeholder="you@example.com"
          />
        </label>

        <label className="grid gap-1 text-sm font-bold text-[var(--slugger-muted)]">
          What made you curious?
          <select
            name="interest"
            className="min-h-12 border border-[var(--slugger-ink)]/18 bg-[var(--slugger-paper)] px-3 text-base font-bold text-[var(--slugger-ink)] outline-none focus:border-[var(--slugger-brass)]"
            defaultValue=""
          >
            <option value="" disabled>
              Choose one
            </option>
            <option value="no-gym">I hate gyms</option>
            <option value="confidence">I want to feel more capable</option>
            <option value="stress">I need a stress outlet</option>
            <option value="boxing-curious">I am curious about boxing</option>
            <option value="c25k">I liked Couch to 5K</option>
            <option value="other">Something else</option>
          </select>
        </label>

        <label className="grid gap-1 text-sm font-bold text-[var(--slugger-muted)]">
          Optional note
          <textarea
            name="note"
            rows={3}
            className="border border-[var(--slugger-ink)]/18 bg-[var(--slugger-paper)] px-3 py-3 text-base font-bold text-[var(--slugger-ink)] outline-none focus:border-[var(--slugger-brass)]"
            placeholder="What would make you try this?"
          />
        </label>

        <label className="flex gap-3 text-sm leading-6 text-[var(--slugger-muted)]">
          <input required type="checkbox" name="consent" value="yes" className="mt-1 h-4 w-4" />
          <span>Email me about Sofa2Slugger early access, launch price, and product updates.</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-5 min-h-12 w-full bg-[var(--slugger-ink)] px-5 py-3 text-sm font-black uppercase tracking-wide text-[var(--slugger-bone)] transition hover:bg-[var(--slugger-brass)] disabled:opacity-60"
      >
        {status === "sending" ? "Joining..." : "Join the founding list"}
      </button>

      {status === "sent" && (
        <p className="mt-3 text-sm font-bold text-[var(--slugger-signal)]">
          You are on the list. Round one will do the talking from here.
        </p>
      )}
      {status === "error" && (
        <p className="mt-3 text-sm font-bold text-[var(--slugger-action-hot)]">
          That did not send. Try again, or email sofa2slugger@gmail.com.
        </p>
      )}
    </form>
  );
}