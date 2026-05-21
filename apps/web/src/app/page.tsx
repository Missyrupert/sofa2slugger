import Image from "next/image";
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
    title: "Hear the frame",
    body: "The intro tells you what this is, what it is not, and how to train safely.",
    href: "#intro-audio",
    action: "Play intro",
  },
  {
    title: "Try Round 1",
    body: "Start with stance, guard, breathing, and enough movement to feel the idea click.",
    href: "/session/1",
    action: "Start free",
  },
  {
    title: "Unlock the card",
    body: "Rounds 2-12 build punches, defense, rhythm, movement, and one complete round.",
    href: "/gym",
    action: "See rounds",
  },
] as const;

const included = [
  "Round 1 free",
  "12 audio-led rounds",
  "Lifetime access",
  "No subscription",
] as const;

const price = "\u00a39.99";

export default function HomePage() {
  return (
    <div className="max-w-full overflow-x-hidden bg-[var(--slugger-paper)] text-[var(--slugger-ink)]">
      <section className="relative overflow-hidden bg-[var(--slugger-black)] text-[var(--slugger-bone)]">
        <div className="absolute inset-0 slugger-hero-grid opacity-70" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          <div className="flex max-w-full flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.14em] text-[var(--slugger-action-hot)] sm:tracking-[0.2em]">
            <span className="slugger-phone-pulse flex h-9 w-9 items-center justify-center bg-[var(--slugger-steel)] text-[var(--slugger-bone)]">
              <Dumbbell className="h-4 w-4" />
            </span>
            Beginner audio boxing
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end xl:grid-cols-[minmax(0,1fr)_410px]">
            <div className="min-w-0">
              <h1 className="slugger-hero-title font-black uppercase tracking-normal">
                Sofa2Slugger
              </h1>
              <p className="slugger-hero-lead mt-5 max-w-3xl font-black text-[var(--slugger-bone)]">
                No gym. No bag. No audience.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--slugger-panel)] sm:text-lg sm:leading-8">
                Twelve private audio sessions that teach you to stand, move,
                guard, and finish a round from the room you are already in.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/session/1"
                  className="inline-flex min-h-14 w-full items-center justify-center gap-3 bg-[var(--slugger-bone)] px-6 py-4 text-sm font-black uppercase text-[var(--slugger-ink)] transition hover:bg-white sm:w-auto"
                >
                  <Play className="h-5 w-5" fill="currentColor" />
                  Start Round 1 free
                </Link>
                <Link
                  href="/gym"
                  className="inline-flex min-h-14 w-full items-center justify-center gap-3 border border-white/18 px-6 py-4 text-sm font-black uppercase text-[var(--slugger-bone)] transition hover:bg-white/10 sm:w-auto"
                >
                  Full course {price}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <aside className="border border-white/14 bg-white/[0.07] p-4 backdrop-blur lg:p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-action-hot)]">
                Launch price
              </p>
              <p className="mt-2 text-4xl font-black leading-none text-[var(--slugger-bone)]">
                {price}
              </p>
              <p className="mt-3 text-sm font-bold leading-6 text-[var(--slugger-panel)]">
                Pay once for rounds 2-12. Round 1 stays free, so nobody has to buy blind.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-black uppercase text-[var(--slugger-panel)]/82">
                {included.map((item) => (
                  <span key={item} className="border border-white/10 px-2 py-2 text-center">
                    {item}
                  </span>
                ))}
              </div>
            </aside>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_410px]">
            <div className="grid w-full grid-cols-3 border border-white/14 bg-white/[0.06] backdrop-blur lg:max-w-2xl">
              <Metric value="Free" label="Round 1" />
              <Metric value={price} label="Full card" />
              <Metric value="No" label="Kit needed" />
            </div>
            <div className="slugger-glow relative w-full bg-[var(--slugger-black)] p-2">
              <Image
                src="/images/hero-sofa-to-slugger-v1.png"
                alt="A hooded person sitting on a sofa, looking down at a glowing phone on the floor."
                width={1200}
                height={900}
                priority
                unoptimized
                className="h-auto max-h-72 w-full object-contain lg:max-h-64"
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

      <section className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-3 md:grid-cols-3">
            {journey.map((step, index) => (
              <Link
                key={step.title}
                href={step.href}
                className="group flex min-h-44 flex-col justify-between border border-[var(--slugger-ink)]/14 bg-[var(--slugger-bone)] p-5 transition hover:-translate-y-1 hover:border-[var(--slugger-brass)] hover:shadow-xl hover:shadow-black/10"
              >
                <div>
                  <span className="inline-flex h-9 w-9 items-center justify-center bg-[var(--slugger-ink)] text-sm font-black text-[var(--slugger-bone)]">
                    {index + 1}
                  </span>
                  <h2 className="mt-4 text-2xl font-black uppercase leading-6">
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

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
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
      <p className="text-2xl font-black sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs font-black uppercase text-[var(--slugger-panel)]/60">
        {label}
      </p>
    </div>
  );
}