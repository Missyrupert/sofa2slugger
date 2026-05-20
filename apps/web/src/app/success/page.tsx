"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Headphones, ShieldCheck } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { unlockAllSessions } from "@/lib/storage";

export default function SuccessPage() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      // Sets s2s_unlocked, s2s_premium_access, s2s_full_access for compatibility.
      unlockAllSessions();
      trackEvent("purchase_success");
      setUnlocked(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="bg-[var(--slugger-paper)] px-5 py-8 text-[var(--slugger-ink)] sm:px-8 lg:px-10">
      <section className="slugger-ring grid min-h-[70vh] grid-cols-1 gap-8 border border-black/10 p-6 text-[var(--slugger-bone)] md:p-10 lg:grid-cols-[1.1fr_360px] lg:items-center">
        <div>
          <CheckCircle
            className="h-14 w-14 text-[#8dc7a3]"
            strokeWidth={1.5}
          />
          <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-[var(--slugger-action-hot)]">
            Sofa2Slugger unlocked
          </p>
          <h1 className="mt-3 max-w-2xl text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl">
            You are in.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--slugger-panel)]">
            {unlocked
              ? "All 12 rounds are now open in this browser. Start where the card tells you, replay what needs work, and keep the coach in your ear when you need the structure."
              : "Setting up your access..."}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/gym"
              className="inline-flex min-h-12 items-center justify-center bg-[var(--slugger-brass)] px-6 py-3 text-sm font-black uppercase tracking-wide text-[var(--slugger-bone)] transition hover:bg-[var(--slugger-action-hot)]"
            >
              Go to the card
            </Link>
            <Link
              href="/session/2"
              className="inline-flex min-h-12 items-center justify-center border border-white/18 px-6 py-3 text-sm font-black uppercase tracking-wide text-[var(--slugger-bone)] transition hover:border-[var(--slugger-action-hot)] hover:text-[var(--slugger-action-hot)]"
            >
              Start Round 2
            </Link>
          </div>
        </div>

        <aside className="border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-start gap-3">
            <Headphones className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--slugger-action-hot)]" />
            <div>
              <h2 className="text-sm font-black uppercase tracking-wide">
                What happens now
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--slugger-panel)]">
                Work through the rounds in order first. After that, repeat any
                round that feels useful.
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-start gap-3 border-t border-white/10 pt-5">
            <ShieldCheck className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--slugger-action-hot)]" />
            <div>
              <h2 className="text-sm font-black uppercase tracking-wide">
                Access note
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--slugger-panel)]">
                Your unlock is saved in this browser. If anything looks wrong,
                email sofa2slugger@gmail.com and we will sort it.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
