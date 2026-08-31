import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
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
              <Shield className="h-4 w-4" />
            </span>
            Legal
          </div>
          <h1 className="font-display mt-6 text-4xl font-black uppercase leading-none sm:text-5xl text-[var(--slugger-bone)] bg-gradient-to-r from-white to-[var(--slugger-muted)] bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-[var(--slugger-muted)] font-medium">
            Last Updated: June 2026
          </p>
        </section>

        <div className="mt-8 space-y-8 text-sm leading-7 text-[var(--slugger-muted)]">
          <section className="border border-white/5 bg-[var(--slugger-panel)] p-6 rounded shadow-lg">
            <h2 className="text-lg font-black uppercase text-[var(--slugger-bone)] tracking-tight">
              1. What Information We Collect
            </h2>
            <p className="mt-3">
              Sofa2Slugger is designed with a privacy-first approach. We collect only what is necessary to run the service:
            </p>
            <ul className="mt-4 list-disc pl-5 space-y-2">
              <li>
                <strong className="text-[var(--slugger-bone)]">Account Details:</strong> Your email address when capturing interests or during the login process.
              </li>
              <li>
                <strong className="text-[var(--slugger-bone)]">Playback Progress:</strong> Saved locally in your browser&apos;s localStorage to keep track of completed rounds and pace rates.
              </li>
            </ul>
          </section>

          <section className="border border-white/5 bg-[var(--slugger-panel)] p-6 rounded shadow-lg">
            <h2 className="text-lg font-black uppercase text-[var(--slugger-bone)] tracking-tight">
              2. How We Use Information
            </h2>
            <p className="mt-3">
              Your details are used solely to:
            </p>
            <ul className="mt-4 list-disc pl-5 space-y-2">
              <li>Send the optional reset-plan email if you ask for it.</li>
              <li>Improve page load times and app mechanics.</li>
            </ul>
          </section>

          <section className="border border-white/5 bg-[var(--slugger-panel)] p-6 rounded shadow-lg">
            <h2 className="text-lg font-black uppercase text-[var(--slugger-bone)] tracking-tight">
              3. Data Retention &amp; Sharing
            </h2>
            <p className="mt-3">
              We never sell your email or share data with advertising networks. We use Resend for transactional emails if you join the reset-plan list. Progress data resides strictly in your local browser storage.
            </p>
          </section>

          <section className="border border-white/5 bg-[var(--slugger-panel)] p-6 rounded shadow-lg">
            <h2 className="text-lg font-black uppercase text-[var(--slugger-bone)] tracking-tight">
              4. Contact Info
            </h2>
            <p className="mt-3">
              If you have any questions about this policy or request your email account deletion from our systems, please reach out to us at{" "}
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
