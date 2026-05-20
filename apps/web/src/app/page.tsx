import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Headphones,
  Play,
  ShieldCheck,
} from "lucide-react";
import { SESSIONS } from "@/lib/sessions";
import { FoundingListenerForm } from "@/components/founding-listener-form";
import {
  BEST_FOR,
  COURSE_PRICE_CONTEXT,
  COURSE_PRICE_LABEL,
  COURSE_PRICE_NOTE,
  COURSE_PROMISES,
  NOT_FOR,
  SAFETY_NOTES,
} from "@/lib/product";

const promises = [
  "No gym. No bag. No audience.",
  "Built for people who have never boxed.",
  "Audio leads. The screen stays out of the way.",
] as const;

const principles = [
  {
    title: "Private",
    body: "You do the work in a normal room, without a mirror, a class, or anyone watching you learn.",
  },
  {
    title: "Progressive",
    body: "The course starts with stance and guard, then builds toward a complete guided shadowboxing round.",
  },
  {
    title: "Calm",
    body: "This is not about fast hands or trying to look dangerous. It is balance, breath, guard, and composure.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="max-w-full overflow-x-hidden bg-[var(--slugger-paper)] text-[var(--slugger-ink)]">
      <section className="relative min-h-[min(100vh,900px)] overflow-hidden bg-[var(--slugger-black)] text-[var(--slugger-bone)]">
        <Image
          src="/images/hero-sofa-to-slugger-v1.png"
          alt="A person sitting on a sofa with boxing wraps nearby and a phone on the floor."
          fill
          priority
          sizes="100vw"
          className="object-cover object-[36%_50%] opacity-[0.62]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/76 via-black/56 to-black/18" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--slugger-black)] to-transparent" />

        <div className="relative flex min-h-[min(100vh,900px)] items-end px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-full pb-4 sm:max-w-5xl lg:pb-10">
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--slugger-action-hot)]">
              <ShieldCheck className="h-4 w-4" />
              No gym. No bag. No audience.
            </p>
            <h1 className="slugger-hero-title mt-5 max-w-full font-black uppercase tracking-normal">
              Sofa2Slugger
            </h1>
            <p className="mt-6 max-w-2xl text-xl font-black leading-8 text-[var(--slugger-bone)] sm:text-3xl sm:leading-10">
              Beginner audio boxing from your own room.
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/72">
              Twelve private sessions that teach you to stand, move, guard, and finish a round. Start where you are. Put your headphones in. Let the coach do the rest.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/session/1"
                className="inline-flex min-h-14 w-full items-center justify-center gap-3 bg-[var(--slugger-bone)] px-6 py-4 text-sm font-black uppercase text-[var(--slugger-ink)] transition hover:bg-white sm:w-auto"
              >
                <Play className="h-5 w-5" fill="currentColor" />
                Start free round
              </Link>
              <Link
                href="#intro-audio"
                className="inline-flex min-h-14 w-full items-center justify-center gap-3 border border-white/24 px-6 py-4 text-sm font-black uppercase text-[var(--slugger-bone)] transition hover:bg-white/10 sm:w-auto"
              >
                Hear the idea
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="mt-8 grid max-w-3xl gap-2 sm:grid-cols-3">
              {promises.map((item) => (
                <div key={item} className="border border-white/14 bg-black/24 px-4 py-3 text-sm font-bold text-white/78 backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--slugger-black)] px-5 py-10 text-[var(--slugger-bone)] sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {principles.map((item) => (
            <div key={item.title} className="border-t border-white/18 pt-5">
              <h2 className="text-2xl font-black uppercase leading-none">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/62">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="intro-audio"
        className="border-b border-[var(--slugger-ink)]/12 bg-[var(--slugger-paper)] px-5 py-10 sm:px-8 lg:px-12"
      >
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--slugger-brass)]">
              Before round one
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none sm:text-5xl">
              Listen first. Then move.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--slugger-muted)]">
              A short course intro sets the frame: what this is, what it is not, and why the first win is simply standing up.
            </p>
          </div>
          <div className="border border-[var(--slugger-ink)]/14 bg-[var(--slugger-ink)] p-5 text-[var(--slugger-bone)]">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center bg-[var(--slugger-steel)]">
                <Headphones className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black uppercase">Course intro</p>
                <p className="text-xs font-bold uppercase text-white/48">
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

      <section className="border-b border-[var(--slugger-ink)]/12 bg-[var(--slugger-bone)] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--slugger-brass)]">
              What you get
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none sm:text-5xl">
              A complete beginner course. Not another fitness feed.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--slugger-muted)]">
              Sofa2Slugger is built to be listened to, not watched. The screen gets you started, then the coach takes over.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-[var(--slugger-ink)]/14 bg-[var(--slugger-paper)] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-brass)]">
                {COURSE_PRICE_CONTEXT}
              </p>
              <p className="mt-2 text-5xl font-black leading-none">{COURSE_PRICE_LABEL}</p>
              <p className="mt-3 text-sm font-bold leading-6 text-[var(--slugger-muted)]">
                Pay once. No subscription. Replay any round whenever you need the work.
              </p>
              <p className="mt-3 border-t border-[var(--slugger-ink)]/10 pt-3 text-xs font-bold uppercase leading-5 text-[var(--slugger-muted)]">
                {COURSE_PRICE_NOTE}
              </p>
            </div>
            <div className="border border-[var(--slugger-ink)]/14 bg-[var(--slugger-paper)] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-brass)]">
                Included
              </p>
              <ul className="mt-3 grid gap-2 text-sm font-bold leading-6 text-[var(--slugger-muted)]">
                {COURSE_PROMISES.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--slugger-signal)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-[var(--slugger-ink)]/14 bg-[var(--slugger-paper)] p-5 sm:col-span-2">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slugger-brass)]">
                Safety without drama
              </p>
              <ul className="mt-3 grid gap-2 text-sm font-bold leading-6 text-[var(--slugger-muted)] sm:grid-cols-3">
                {SAFETY_NOTES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="border-b border-[var(--slugger-ink)]/12 bg-[var(--slugger-paper)] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <div className="border-t border-[var(--slugger-ink)]/16 pt-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--slugger-brass)]">
              Who it is for
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase leading-none sm:text-4xl">
              Quietly capable people. Or people who want to feel that way again.
            </h2>
            <ul className="mt-5 grid gap-3 text-sm font-bold leading-6 text-[var(--slugger-muted)]">
              {BEST_FOR.map((item) => (
                <li key={item} className="border-l-4 border-[var(--slugger-signal)] pl-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-[var(--slugger-ink)]/16 pt-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--slugger-brass)]">
              What it is not
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase leading-none sm:text-4xl">
              No fight club theatre. No screen addiction. No false promises.
            </h2>
            <ul className="mt-5 grid gap-3 text-sm font-bold leading-6 text-[var(--slugger-muted)]">
              {NOT_FOR.map((item) => (
                <li key={item} className="border-l-4 border-[var(--slugger-brass)] pl-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="border-b border-[var(--slugger-ink)]/12 bg-[var(--slugger-paper)] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--slugger-brass)]">
              Launch list
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none sm:text-5xl">
              Become a founding listener.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--slugger-muted)]">
              Join the early list, try the free first round, and help shape the version we put properly into the world.
            </p>
          </div>
          <FoundingListenerForm />
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
            <div className="lg:sticky lg:top-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--slugger-brass)]">
                The course
              </p>
              <h2 className="mt-3 text-4xl font-black uppercase leading-none sm:text-5xl">
                From sofa to first round.
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--slugger-muted)]">
                Round 1 is free. The full course unlocks as one paid programme, built to be replayed whenever you need the work.
              </p>
              <ul className="mt-6 grid gap-3 text-sm font-bold text-[var(--slugger-charcoal)]">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--slugger-signal)]" />
                  Stance, guard, punches, defence, movement, and a full guided round.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--slugger-signal)]" />
                  Made for beginners without pretending beginners are fragile.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--slugger-signal)]" />
                  Pay once. No subscription. No recurring fees.
                </li>
              </ul>
              <Link
                href="/gym"
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--slugger-ink)] px-5 py-3 text-sm font-black uppercase text-[var(--slugger-bone)] transition hover:bg-[var(--slugger-brass)]"
              >
                View all rounds
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="border-y border-[var(--slugger-ink)]/14">
              {SESSIONS.map((session) => (
                <Link
                  key={session.id}
                  href={session.isFree ? `/session/${session.id}` : "/gym"}
                  className="grid gap-3 border-b border-[var(--slugger-ink)]/10 bg-[var(--slugger-paper)] px-0 py-5 transition last:border-b-0 hover:bg-[var(--slugger-bone)] sm:grid-cols-[72px_1fr_auto] sm:items-center sm:px-4"
                >
                  <span className="text-3xl font-black leading-none text-[var(--slugger-ink)]/34">
                    {session.id.toString().padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl font-black uppercase leading-6 text-[var(--slugger-ink)]">
                      {session.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[var(--slugger-muted)]">
                      {session.summary}
                    </p>
                  </div>
                  <span className="text-xs font-black uppercase tracking-wide text-[var(--slugger-brass)]">
                    {session.isFree ? "Free" : session.intensity}
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
