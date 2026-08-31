import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-[var(--slugger-paper)] text-[var(--slugger-ink)] min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/gym"
          className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-2 text-xs font-black uppercase tracking-wide text-white/70 transition hover:bg-[var(--slugger-bone)] hover:text-[var(--slugger-black)] rounded-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Gym
        </Link>

        <section className="mt-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-[var(--slugger-action-hot)]">
            <span className="flex h-9 w-9 items-center justify-center bg-[var(--slugger-steel)] text-[var(--slugger-bone)]">
              <Scale className="h-4 w-4" />
            </span>
            Legal
          </div>
          <h1 className="font-display mt-6 text-4xl font-black uppercase leading-none sm:text-5xl text-[var(--slugger-bone)] bg-gradient-to-r from-white to-[var(--slugger-muted)] bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-[var(--slugger-muted)] font-medium">
            Last Updated: June 2026
          </p>
        </section>

        <div className="mt-8 space-y-8 text-sm leading-7 text-[var(--slugger-muted)]">
          <section className="border border-white/5 bg-[var(--slugger-panel)] p-6 rounded shadow-lg">
            <h2 className="text-lg font-black uppercase text-[var(--slugger-bone)] tracking-tight">
              1. Physical Activity Disclaimer (Train Safely)
            </h2>
            <p className="mt-3">
              Shadowboxing and athletic drills are physically demanding. By using Sofa2Slugger, you acknowledge and agree that:
            </p>
            <ul className="mt-4 list-disc pl-5 space-y-2">
              <li>
                You are participating voluntarily and assume all responsibility for any physical injuries or health conditions.
              </li>
              <li>
                You must clear your training space of fragile objects, furniture, pets, or obstructions before hitting play.
              </li>
              <li>
                If you feel pain, chest tightness, dizziness, or shortness of breath at any point, stop immediately.
              </li>
            </ul>
          </section>

          <section className="border border-white/5 bg-[var(--slugger-panel)] p-6 rounded shadow-lg">
            <h2 className="text-lg font-black uppercase text-[var(--slugger-bone)] tracking-tight">
              2. License
            </h2>
            <p className="mt-3">
              Sofa2Slugger is a free personal training experience. You may stream and use the audio rounds in your browser for personal, non-commercial use. Re-selling, downloading for distribution, or playing the audio tracks in a commercial fitness class is strictly prohibited.
            </p>
          </section>

          <section className="border border-white/5 bg-[var(--slugger-panel)] p-6 rounded shadow-lg">
            <h2 className="text-lg font-black uppercase text-[var(--slugger-bone)] tracking-tight">
              3. Access
            </h2>
            <p className="mt-3">
              All 12 rounds are free. If you experience technical browser issues playing the audio tracks, reach out to us at{" "}
              <a
                href="mailto:sofa2slugger@gmail.com"
                className="text-[var(--slugger-brass)] font-bold hover:underline"
              >
                sofa2slugger@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
