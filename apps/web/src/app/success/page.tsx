"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { unlockAllSessions } from "@/lib/storage";

export default function SuccessPage() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      // Sets s2s_unlocked, s2s_premium_access, s2s_full_access for compatibility
      unlockAllSessions();
      setUnlocked(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="slugger-ring flex min-h-[70vh] flex-col items-center justify-center gap-6 p-6 text-center text-[var(--slugger-bone)] md:p-10">
      <CheckCircle className="h-16 w-16 text-[#8dc7a3]" strokeWidth={1.5} />
      <h1 className="text-4xl font-black uppercase tracking-tight">
        All rounds unlocked
      </h1>
      <p className="max-w-md text-[var(--slugger-panel)]">
        {unlocked
          ? "You now have lifetime access to all 12 rounds. Train whenever you want."
          : "Setting up your access..."}
      </p>
      <Link
        href="/gym"
        className="mt-4 bg-[var(--slugger-brass)] px-8 py-4 font-black uppercase tracking-wide text-[var(--slugger-bone)] transition hover:bg-[var(--slugger-action-hot)]"
      >
        Go to the card
      </Link>
    </div>
  );
}
