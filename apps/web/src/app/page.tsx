import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Headphones,
  Play,
  Dumbbell,
} from "lucide-react";
import { SESSIONS, formatDuration } from "@/lib/sessions";

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
  const totalSeconds = SESSIONS.reduce(
    (total, session) => total + session.durationSec,
    0
  );
  const totalMinutes = Math.round(totalSeconds / 60);

  return (
    <div className="bg-[#eee5d8] text-[#11100e]">
      <section className="relative overflow-hidden bg-[#0d0c0b] text-[#fbf3e7]">
        <div className="absolute inset-0 slugger-hero-grid opacity-70" />
        <div className="absolute bottom-[-28%] left-[8%] h-72 w-72 rounded-full bg-[#c7563f]/20 blur-3xl" />
        <div className="relative grid min-h-[calc(100vh-96px)] lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex flex-col justify-between px-5 py-7 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-[#f0a086]">
              <span className="slugger-phone-pulse flex h-9 w-9 items-center justify-center bg-[#c7563f] text-[#fbf3e7]">
                <Dumbbell className="h-4 w-4" />
              </span>
              Audio boxing for the living room
            </div>

            <div className="my-12 max-w-3xl lg:my-16">
              <h1 className="text-6xl font-black uppercase leading-[0.82] tracking-normal sm:text-7xl xl:text-8xl">
                Sofa
                <span className="mx-3 inline-flex translate-y-[-0.05em] items-center justify-center bg-[#c7563f] px-3 py-1 text-[0.68em] italic leading-none text-[#fbf3e7] shadow-[6px_6px_0_#fbf3e7]">
                  2
                </span>
                Slugger
              </h1>
              <p className="mt-6 max-w-2xl text-3xl font-black leading-9 text-[#fbf3e7] sm:text-4xl">
                Stop scrolling. Stand up. Round one starts in your living room.
              </p>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#d8cbbb]">
                A cinematic audio boxing course for beginners. No bag, no gym,
                no audience. Press play, follow the coach, and build the first
                round from the room you are already in.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/session/1"
                  className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#fbf3e7] px-6 py-4 text-sm font-black uppercase text-[#11100e] transition hover:bg-white"
                >
                  <Play className="h-5 w-5" fill="currentColor" />
                  Start Round 1
                </Link>
                <Link
                  href="#intro-audio"
                  className="inline-flex min-h-14 items-center justify-center gap-3 border border-white/18 px-6 py-4 text-sm font-black uppercase text-[#fbf3e7] transition hover:bg-white/10"
                >
                  Hear the idea
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="grid max-w-xl grid-cols-3 border border-white/14 bg-white/[0.06] backdrop-blur">
              <Metric value="12" label="Rounds" />
              <Metric value={`${totalMinutes}`} label="Minutes" />
              <Metric value="0" label="Kit" />
            </div>
          </div>

          <div className="flex items-center px-5 pb-8 sm:px-8 lg:px-8 lg:py-10">
            <div className="slugger-glow relative w-full bg-[#090908] p-2">
              <Image
                src="/images/hero-sofa-to-slugger-v1.png"
                alt="A hooded person sitting on a sofa, looking down at a glowing phone on the floor."
                width={1792}
                height={1024}
                priority
                className="h-auto w-full object-contain"
              />
              <div className="absolute bottom-5 left-5 border border-white/12 bg-[#0d0c0b]/88 px-4 py-3 backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f0a086]">
                  Start where you are
                </p>
                <p className="mt-1 text-sm font-bold text-[#fbf3e7]/78">
                  A guided first step into boxing basics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="intro-audio"
        className="border-y border-[#11100e]/12 bg-[#fbf3e7] px-5 py-8 sm:px-8 lg:px-10"
      >
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9c4b39]">
              Before round one
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none">
              Listen first. Then move.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#5f574f]">
              Two and a half minutes to understand what Sofa2Slugger is, what it
              is not, and why the first win is simply standing up.
            </p>
          </div>
          <div className="border border-[#11100e]/14 bg-[#11100e] p-4 text-[#fbf3e7]">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center bg-[#c7563f]">
                <Headphones className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black uppercase">Course intro</p>
                <p className="text-xs font-bold uppercase text-[#d8cbbb]/70">
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
                className="group flex min-h-56 flex-col justify-between border border-[#11100e]/14 bg-[#fbf3e7] p-5 transition hover:-translate-y-1 hover:border-[#c7563f] hover:shadow-xl hover:shadow-black/10"
              >
                <div>
                  <span className="inline-flex h-9 w-9 items-center justify-center bg-[#11100e] text-sm font-black text-[#fbf3e7]">
                    {index + 1}
                  </span>
                  <h2 className="mt-5 text-2xl font-black uppercase leading-6">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#5f574f]">
                    {step.body}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase text-[#9c4b39]">
                  {step.action}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9c4b39]">
                The fight card
              </p>
              <h2 className="mt-3 text-5xl font-black uppercase leading-none">
                Twelve short rounds. One earned path.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#5f574f]">
                The course turns a normal room into a simple training sequence:
                base, straight punches, inside work, defense, movement, then a
                first full shadowboxing round.
              </p>
              <ul className="mt-5 grid gap-2 text-sm font-bold text-[#2b2925]">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#5f7467]" />
                  Round 1 is free.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#5f7467]" />
                  Audio leads, the screen supports.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#5f7467]" />
                  Beginner-safe without pretending boxing is soft.
                </li>
              </ul>
            </div>

            <div className="grid gap-2">
              {SESSIONS.slice(0, 6).map((session) => (
                <Link
                  key={session.id}
                  href={session.isFree ? `/session/${session.id}` : "/gym"}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border border-[#11100e]/12 bg-[#fbf3e7] px-4 py-4 transition hover:border-[#c7563f] hover:bg-white"
                >
                  <span className="flex h-11 w-11 items-center justify-center bg-[#11100e] text-sm font-black text-[#fbf3e7]">
                    {session.id.toString().padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-black uppercase leading-5">
                      {session.shortTitle}
                    </h3>
                    <p className="mt-1 text-sm text-[#675f55]">
                      {session.summary}
                    </p>
                  </div>
                  <span className="hidden items-center gap-1 text-xs font-black uppercase text-[#675f55] sm:inline-flex">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatDuration(session.durationSec)}
                  </span>
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
      <p className="mt-1 text-xs font-black uppercase text-[#d8cbbb]/60">
        {label}
      </p>
    </div>
  );
}
