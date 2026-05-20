import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Headphones,
  Play,
  Dumbbell,
} from "lucide-react";
import { SESSIONS } from "@/lib/sessions";

const journey = [
  {
    title: "Listen first",
    body: "A short intro sets the course, the promise, and the limits before you train.",
    href: "#intro-audio",
    action: "Play intro",
  },
  {
    title: "Stand up",
    body: "Round one teaches the base: stance, guard, breathing, and calm movement.",
    href: "/session/1",
    action: "Start free",
  },
  {
    title: "Earn the card",
    body: "Twelve rounds build from awkward first movement to a complete shadowboxing round.",
    href: "/gym",
    action: "View course",
  },
] as const;

export default function HomePage() {
  return (
    <div className="max-w-full overflow-x-hidden bg-[var(--slugger-paper)] text-[var(--slugger-ink)]">
      <section className="relative overflow-hidden bg-[var(--slugger-black)] text-[var(--slugger-bone)]">
        <div className="absolute inset-0 slugger-hero-grid opacity-70" />
        <div className="absolute bottom-[-28%] left-[8%] h-72 w-72 rounded-full bg-[var(--slugger-brass)]/20 blur-3xl" />
        <div className="relative grid max-w-full lg:min-h-[calc(100vh-96px)] lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex min-w-0 flex-col justify-between px-5 py-7 sm:px-8 lg:px-10">
            <div className="flex max-w-full flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em] text-[var(--slugger-action-hot)] sm:tracking-[0.22em]">
              <span className="slugger-phone-pulse flex h-9 w-9 items-center justify-center bg-[var(--slugger-steel)] text-[var(--slugger-bone)]">
                <Dumbbell className="h-4 w-4" />
              </span>
              Private audio boxing for beginners
            </div>

            <div className="my-12 max-w-full lg:my-16 lg:max-w-3xl">
              <h1 className="slugger-hero-title max-w-full font-black uppercase tracking-normal">
                Sofa2Slugger
              </h1>
              <p className="slugger-hero-lead mt-6 max-w-2xl font-black text-[var(--slugger-bone)]">
                Less watching. More moving. Round one starts where you are.
              </p>
              <p className="mt-5 max-w-xl text-base leading-7 text-[var(--slugger-panel)]">
                A cinematic audio boxing course for beginners. No bag, no gym,
                no audience. Press play, follow the coach, and build the first
                round from the room you are already in.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/session/1"
                  className="inline-flex min-h-14 w-full items-center justify-center gap-3 bg-[var(--slugger-bone)] px-6 py-4 text-sm font-black uppercase text-[var(--slugger-ink)] transition hover:bg-white sm:w-auto"
                >
                  <Play className="h-5 w-5" fill="currentColor" />
                  Start Round 1
                </Link>
                <Link
                  href="#intro-audio"
                  className="inline-flex min-h-14 w-full items-center justify-center gap-3 border border-white/18 px-6 py-4 text-sm font-black uppercase text-[var(--slugger-bone)] transition hover:bg-white/10 sm:w-auto"
                >
                  Hear the idea
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="grid w-full max-w-xl grid-cols-3 border border-white/14 bg-white/[0.06] backdrop-blur">
              <Metric value="Free" label="Round 1" />
              <Metric value="12" label="Guided rounds" />
              <Metric value="No" label="Kit needed" />
            </div>
          </div>

          <div className="flex min-w-0 items-center px-5 pb-8 sm:px-8 lg:px-8 lg:py-10">
            <div className="slugger-glow relative w-full max-w-full bg-[var(--slugger-black)] p-2">
              <img
                src="/images/hero-sofa-to-slugger-v1.png"
                alt="A hooded person sitting on a sofa, looking down at a glowing phone on the floor."
                className="h-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="intro-audio"
        className="border-y border-[var(--slugger-ink)]/12 bg-[var(--slugger-bone)] px-5 py-8 sm:px-8 lg:px-10"
      >
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slugger-brass)]">
              Before round one
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none">
              Listen first. Then move.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--slugger-muted)]">
              Two and a half minutes to understand what Sofa2Slugger is, what it
              is not, and why the first win is simply standing up.
            </p>
          </div>
          <div className="border border-[var(--slugger-ink)]/14 bg-[var(--slugger-ink)] p-4 text-[var(--slugger-bone)]">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center bg-[var(--slugger-steel)]">
                <Headphones className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black uppercase">Course intro</p>
                <p className="text-xs font-bold uppercase text-[var(--slugger-panel)]/70">
                  Narrator with final music bed
                </p>
              </div>
            </div>
            <audio
              controls
              className="w-full"
              src="/audio/course-intro.chill-ska-warm-6x.mp3"
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-3 md:grid-cols-3">
            {journey.map((step, index) => (
              <Link
                key={step.title}
                href={step.href}
                className="group flex min-h-56 flex-col justify-between border border-[var(--slugger-ink)]/14 bg-[var(--slugger-bone)] p-5 transition hover:-translate-y-1 hover:border-[var(--slugger-brass)] hover:shadow-xl hover:shadow-black/10"
              >
                <div>
                  <span className="inline-flex h-9 w-9 items-center justify-center bg-[var(--slugger-ink)] text-sm font-black text-[var(--slugger-bone)]">
                    {index + 1}
                  </span>
                  <h2 className="mt-5 text-2xl font-black uppercase leading-6">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--slugger-muted)]">
                    {step.body}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase text-[var(--slugger-steel)]">
                  {step.action}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slugger-brass)]">
                The fight card
              </p>
              <h2 className="mt-3 max-w-full break-words text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl">
                Twelve short rounds. One earned path.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--slugger-muted)]">
                The course turns a normal room into a simple training sequence:
                base, straight punches, inside work, defense, movement, then a
                first full shadowboxing round.
              </p>
              <ul className="mt-5 grid gap-2 text-sm font-bold text-[var(--slugger-charcoal)]">
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

            <div className="grid gap-2 sm:grid-cols-2">
              {SESSIONS.map((session) => (
                <Link
                  key={session.id}
                  href={session.isFree ? `/session/${session.id}` : "/gym"}
                  className="grid grid-cols-[auto_1fr] items-center gap-4 border border-[var(--slugger-ink)]/12 bg-[var(--slugger-bone)] px-4 py-4 transition hover:border-[var(--slugger-brass)] hover:bg-white"
                >
                  <span className="flex h-11 w-11 items-center justify-center bg-[var(--slugger-ink)] text-sm font-black text-[var(--slugger-bone)]">
                    {session.id.toString().padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-black uppercase leading-5">
                      {session.shortTitle}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--slugger-muted)]">
                      {session.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-white/12 p-4 last:border-r-0">
      <p className="text-3xl font-black">{value}</p>
      <p className="mt-1 text-xs font-black uppercase text-[var(--slugger-panel)]/60">
        {label}
      </p>
    </div>
  );
}
