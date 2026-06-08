import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Headphones,
  Play,
  Dumbbell,
} from "lucide-react";
import { EmailCapture } from "@/components/email-capture";
import { SESSIONS } from "@/lib/sessions";
import { HomeResumeCta } from "@/components/home-resume-cta";
import { IntroAudioPlayer } from "@/components/audio/IntroAudioPlayer";

const journey = [
  {
    title: "Stand up",
    body: "Round one teaches the base: stance, guard, breathing, and calm movement.",
    href: "/session/1",
    action: "Start Round 1 free",
  },
  {
    title: "Move privately",
    body: "Headphones on, no bag, no mirror, no audience. Just a private at-home round.",
    href: "/session/1",
    action: "Press play",
  },
  {
    title: "Earn the card",
    body: "If Round 1 clicks, the rest of the course builds toward a complete shadowboxing round.",
    href: "/gym",
    action: "View course",
  },
] as const;

const included = [
  "Round 1 free",
  "Rounds 2-12 optional",
  "One payment",
  "No subscription",
] as const;

export default function HomePage() {
  return (
    <div className="bg-[var(--slugger-paper)] text-[var(--slugger-ink)] min-h-screen">
      <section className="relative overflow-hidden bg-[var(--slugger-black)] text-[var(--slugger-bone)] border-b border-white/5">
        <div className="absolute inset-0 slugger-hero-grid opacity-50" />
        <div className="absolute bottom-[-28%] left-[8%] h-72 w-72 rounded-full bg-[var(--slugger-brass)]/15 blur-3xl" />
        <div className="relative grid min-h-[calc(100vh-96px)] lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex flex-col justify-between px-5 py-7 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-[var(--slugger-action-hot)]">
              <span className="slugger-phone-pulse flex h-9 w-9 items-center justify-center bg-[var(--slugger-steel)] text-[var(--slugger-bone)]">
                <Dumbbell className="h-4 w-4" />
              </span>
              Start Round 1 free
            </div>

            <div className="my-12 max-w-3xl lg:my-16">
              <h1 className="font-display text-5xl font-black uppercase leading-[0.82] tracking-tighter sm:text-7xl xl:text-8xl bg-gradient-to-r from-white via-[var(--slugger-bone)] to-[var(--slugger-action-hot)] bg-clip-text text-transparent">
                Sofa2Slugger
              </h1>
              <p className="mt-6 max-w-2xl text-2xl font-black leading-8 text-[var(--slugger-bone)] sm:text-3xl">
                No gym. No mirror. No camera.
              </p>
              <p className="mt-5 max-w-xl text-base leading-7 text-[var(--slugger-muted)]">
                Audio-guided beginner boxing at home. Headphones on, stand up,
                and follow the first private round. Try it first. Upgrade only
                if you want Round 2.
              </p>
              <HomeResumeCta />

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/session/1"
                  data-analytics-event="round_1_clicked"
                  data-analytics-label="hero_cta"
                  data-analytics-source="homepage"
                  data-analytics-round-id="1"
                  data-analytics-session-id="1"
                  className="inline-flex min-h-14 items-center justify-center gap-3 bg-[var(--slugger-brass)] px-6 py-4 text-sm font-black uppercase text-[var(--slugger-black)] transition hover:bg-[var(--slugger-action-hot)] shadow-lg shadow-[var(--slugger-brass)]/20"
                >
                  <Play className="h-5 w-5" fill="currentColor" />
                  Start Round 1 free
                </Link>
                <Link
                  href="#intro-audio"
                  className="inline-flex min-h-14 items-center justify-center gap-3 border border-white/10 px-6 py-4 text-sm font-black uppercase text-[var(--slugger-bone)] transition hover:bg-white/5"
                >
                  Intro, if you want it
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="grid max-w-xl grid-cols-3 border border-white/5 bg-white/[0.03] backdrop-blur">
              <Metric value="Free" label="Round 1" />
              <Metric value="12" label="Guided rounds" />
              <Metric value="No" label="Kit or camera" />
            </div>
          </div>

          <div className="flex items-center justify-center px-5 pb-8 sm:px-8 lg:px-8 lg:py-10">
            <div className="slugger-glow relative w-full max-w-[480px] bg-gradient-to-b from-[#182025] to-[var(--slugger-black)] p-3 border border-white/5 rounded-lg">
              <img
                src="/images/hero-sofa-to-slugger-v1.png"
                alt="A hooded person sitting on a sofa, looking down at a glowing phone on the floor."
                className="h-auto w-full object-contain rounded"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--slugger-black)]/30 to-transparent pointer-events-none rounded" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-[var(--slugger-paper)] px-5 py-7 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <EmailCapture source="homepage" variant="dark" />
        </div>
      </section>

      <section
        id="intro-audio"
        className="border-y border-white/5 bg-[var(--slugger-panel)] px-5 py-8 sm:px-8 lg:px-10"
      >
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slugger-brass)]">
              Before round one
            </p>
            <h2 className="font-display mt-3 text-3xl font-black uppercase leading-none text-[var(--slugger-bone)]">
              Optional intro. Round 1 is ready.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--slugger-muted)]">
              A quick intro to understand what Sofa2Slugger is, what it
              is not, and why the first beginner boxing win is simply standing up.
            </p>
          </div>
          <IntroAudioPlayer src="/audio/course-intro.chill-ska-warm-6x.mp3" />
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-10 bg-[var(--slugger-paper)]">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 md:grid-cols-3">
            {journey.map((step, index) => (
              <Link
                key={step.title}
                href={step.href}
                className="group flex min-h-56 flex-col justify-between border border-white/5 bg-[var(--slugger-panel)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--slugger-brass)]/30 hover:shadow-2xl hover:shadow-black/50 hover:bg-[var(--slugger-panel)]/90"
              >
                <div>
                  <span className="inline-flex h-8 w-8 items-center justify-center bg-[var(--slugger-brass)] text-sm font-black text-[var(--slugger-black)] rounded-full">
                    {index + 1}
                  </span>
                  <h2 className="font-display mt-5 text-2xl font-black uppercase leading-6 text-[var(--slugger-bone)]">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--slugger-muted)]">
                    {step.body}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase text-[var(--slugger-action-hot)]">
                  {step.action}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slugger-brass)]">
                The fight card
              </p>
              <h2 className="font-display mt-3 text-5xl font-black uppercase leading-none tracking-tight text-[var(--slugger-bone)]">
                Twelve short rounds. One earned path.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--slugger-muted)]">
                The course turns a normal room into a simple training sequence:
                base, straight punches, inside work, defense, movement, then a
                first full shadowboxing round.
              </p>
              <ul className="mt-6 grid gap-3 text-sm font-bold text-[var(--slugger-bone)]">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--slugger-signal)]" />
                  Round 1 is free.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--slugger-signal)]" />
                  Audio leads, the screen supports.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--slugger-signal)]" />
                  Beginner-safe without pretending boxing is soft.
                </li>
              </ul>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {SESSIONS.map((session) => (
                <Link
                  key={session.id}
                  href={session.isFree ? `/session/${session.id}` : "/gym"}
                  data-analytics-event={
                    session.id === 1 ? "round_1_clicked" : undefined
                  }
                  data-analytics-label={
                    session.id === 1 ? "homepage_round_card" : undefined
                  }
                  data-analytics-source={session.id === 1 ? "homepage" : undefined}
                  data-analytics-round-id={session.id === 1 ? "1" : undefined}
                  data-analytics-session-id={session.id === 1 ? "1" : undefined}
                  className="group/session flex min-h-44 flex-col items-start justify-between border border-white/5 bg-[var(--slugger-panel)] p-5 transition-all duration-300 hover:border-[var(--slugger-brass)]/30 hover:bg-[var(--slugger-charcoal)] hover:shadow-xl"
                >
                  <div>
                    <span className="flex h-8 w-8 items-center justify-center bg-[var(--slugger-black)] border border-[var(--slugger-border)] text-xs font-black text-[var(--slugger-brass)] rounded-full">
                      {session.id.toString().padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 font-black uppercase leading-5 text-[var(--slugger-bone)]">
                      {session.shortTitle}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--slugger-muted)]">
                      {session.summary}
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase text-[var(--slugger-action-hot)] opacity-0 transition group-hover/session:opacity-100">
                    {session.isFree ? "Start free" : "View round"}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <section className="mt-16 border border-[var(--slugger-brass)]/30 bg-gradient-to-br from-[var(--slugger-panel)] to-[var(--slugger-black)] p-6 text-[var(--slugger-bone)] shadow-2xl relative overflow-hidden rounded">
            <div className="absolute inset-0 bg-radial-gradient(circle at 80% 20%, rgba(184, 149, 93, 0.05), transparent 40%) pointer-events-none" />
            <div className="relative grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slugger-action-hot)]">
                  After Round 1
                </p>
                <h2 className="font-display mt-3 text-3xl font-black uppercase leading-tight sm:text-4xl text-[var(--slugger-bone)]">
                  Round 1 is free. Start today for the rest.
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-[var(--slugger-muted)]">
                  If the first round gives you something useful, unlock rounds
                  2-12 for {"\u00a34.99"}. One payment. No subscription.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
                <p className="font-display text-5xl font-black leading-none text-[var(--slugger-action-hot)]">
                  {"\u00a34.99"}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-black uppercase text-[var(--slugger-muted)]">
                  {included.map((item) => (
                    <span
                      key={item}
                      className="border border-white/5 bg-black/20 px-2 py-2 text-center"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <Link
                  href="/gym"
                  className="inline-flex min-h-12 items-center justify-center gap-3 bg-[var(--slugger-brass)] px-5 py-3 text-sm font-black uppercase text-[var(--slugger-black)] transition hover:bg-[var(--slugger-action-hot)] sm:col-span-2 shadow-lg shadow-[var(--slugger-brass)]/20"
                >
                  See rounds 2-12
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-white/5 p-4 last:border-r-0">
      <p className="text-3xl font-black text-[var(--slugger-bone)]">{value}</p>
      <p className="mt-1 text-xs font-black uppercase text-[var(--slugger-muted)]">
        {label}
      </p>
    </div>
  );
}

