"use client";

import { FormEvent, useState } from "react";
import { MessageSquareHeart, Send } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { SESSIONS } from "@/lib/sessions";

type Status = "idle" | "sending" | "sent" | "error";

export function RoundFeedbackForm({ defaultRound }: { defaultRound?: number }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");

    try {
      const body = new URLSearchParams();
      data.forEach((value, key) => {
        body.append(key, String(value));
      });

      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (!response.ok) {
        throw new Error("Feedback form failed");
      }

      trackEvent("round_feedback_submit", {
        round: String(data.get("round") ?? ""),
        consent_to_quote: data.get("consent_to_quote") === "yes",
      });

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="border border-black/10 bg-[var(--slugger-bone)]/78 p-5 sm:p-6">
      <div className="max-w-xl">
        <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[var(--slugger-brass)]">
          <MessageSquareHeart className="h-4 w-4" />
          Listener notes
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-[var(--slugger-ink)]">
          Tell us what landed.
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--slugger-muted)]">
          One honest sentence from somebody who has done the work is worth more
          than a polished advert. Use this after any round that gives you a
          useful feeling, a question, or a line worth keeping.
        </p>
      </div>

      <form
        name="round-feedback"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr]"
      >
        <input type="hidden" name="form-name" value="round-feedback" />
        <input
          type="hidden"
          name="subject"
          value="New Sofa2Slugger round feedback"
        />
        <p className="hidden">
          <label>
            Do not fill this out: <input name="bot-field" />
          </label>
        </p>

        <label className="text-sm font-black uppercase text-[var(--slugger-ink)]">
          Round
          <select
            name="round"
            defaultValue={defaultRound ? String(defaultRound) : "1"}
            className="mt-2 min-h-12 w-full border border-black/12 bg-white px-3 text-sm font-bold normal-case text-[var(--slugger-ink)]"
          >
            {SESSIONS.map((session) => (
              <option key={session.id} value={session.id}>
                Round {session.id.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-black uppercase text-[var(--slugger-ink)]">
          What happened?
          <textarea
            name="quote"
            required
            minLength={12}
            rows={4}
            placeholder="What did it make you feel, notice, or want to do next?"
            className="mt-2 w-full border border-black/12 bg-white px-3 py-3 text-sm font-bold normal-case leading-6 text-[var(--slugger-ink)] placeholder:text-[var(--slugger-muted)]"
          />
        </label>

        <label className="text-sm font-black uppercase text-[var(--slugger-ink)]">
          Email optional
          <input
            type="email"
            name="email"
            placeholder="Only if you want a reply"
            className="mt-2 min-h-12 w-full border border-black/12 bg-white px-3 text-sm font-bold normal-case text-[var(--slugger-ink)] placeholder:text-[var(--slugger-muted)]"
          />
        </label>

        <div className="flex flex-col gap-3">
          <label className="flex items-start gap-3 text-sm font-bold leading-6 text-[var(--slugger-muted)]">
            <input
              type="checkbox"
              name="consent_to_quote"
              value="yes"
              className="mt-1 h-4 w-4"
            />
            You can quote this publicly if useful. We will not publish your
            email address.
          </label>
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--slugger-ink)] px-5 py-3 text-sm font-black uppercase tracking-wide text-[var(--slugger-bone)] transition hover:bg-[var(--slugger-brass)] disabled:cursor-wait disabled:opacity-70"
          >
            <Send className="h-4 w-4" />
            {status === "sending" ? "Sending" : "Send note"}
          </button>
          {status === "sent" && (
            <p className="text-sm font-bold text-[var(--slugger-signal)]">
              Got it. That is useful.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm font-bold text-[var(--slugger-action-hot)]">
              That did not send. Email sofa2slugger@gmail.com instead.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
