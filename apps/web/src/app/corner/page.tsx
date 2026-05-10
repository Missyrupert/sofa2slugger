"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Mail, ShieldCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const FAQS = [
  {
    q: "What do I need to get started?",
    a: "A little floor space, comfortable clothes, and enough room to move your arms. No bag, gloves, or gym membership required.",
  },
  {
    q: "How long are the rounds?",
    a: "Most rounds are compact enough to start easily and useful enough to repeat.",
  },
  {
    q: "Is Round 1 really free?",
    a: "Yes. No sign-up, no email, and no card details. Start Round 1 whenever you are ready.",
  },
  {
    q: "What do I get for £9.99?",
    a: "Lifetime access to rounds 2 through 12 in this browser. No subscription and no recurring charge.",
  },
  {
    q: "Can I replay rounds?",
    a: "Yes. Replays are part of the point. You can come back to the foundations or repeat harder rounds as often as you like.",
  },
  {
    q: "Do I need boxing experience?",
    a: "No. The first round starts with stance and guard, then the program builds from there.",
  },
  {
    q: "Will this make me a boxer?",
    a: "It will give you a cleaner foundation and better movement habits. For sparring or competition, train with a qualified local coach.",
  },
  {
    q: "I have a question not listed here.",
    a: "Email hello@sofa2slugger.com and we will get back to you.",
  },
];

export default function CornerPage() {
  return (
    <div className="flex flex-col bg-[#eee5d8] px-5 py-8 text-[#11100e] sm:px-8 lg:px-10">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <section className="slugger-ring border border-black/10 p-6 text-[#fbf3e7] sm:p-8">
          <p className="text-sm font-black uppercase text-[#f0a086]">
            The Corner
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl">
            Clear answers before you start swinging.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#d8cbbb]">
            Sofa2Slugger is a compact audio training program for beginners who
            want structure, technique, and a reason to move today.
          </p>
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <CornerBadge icon={ShieldCheck} label="Beginner safe" />
            <CornerBadge icon={Sparkles} label="No equipment" />
            <CornerBadge icon={Mail} label="Human support" />
          </div>
        </section>

        <section className="border border-black/10 bg-[#fbf3e7]/78 p-6">
          <h2 className="text-xl font-black uppercase tracking-tight text-[#11100e]">
            Contact
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#5f574f]">
            Questions, access issues, feedback, or something that needs a closer
            look.
          </p>
          <a
            href="mailto:hello@sofa2slugger.com"
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#c7563f] px-5 py-3 text-sm font-black uppercase tracking-wide text-[#fbf3e7] transition hover:bg-[#f07a55]"
          >
            <Mail className="h-4 w-4" />
            Email us
          </a>
        </section>
      </div>

      <section className="mt-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase text-[#9c4b39]">FAQ</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-[#11100e]">
              What people ask first.
            </h2>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CornerBadge({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-bold text-white/78">
      <Icon className="h-4 w-4 text-[#f0a086]" />
      {label}
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-black/10 bg-[#fbf3e7]/78">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex min-h-16 w-full items-center justify-between gap-4 px-4 py-4 text-left"
      >
        <span className="text-sm font-black uppercase leading-5 text-[#11100e]">
          {question}
        </span>
        {open ? (
          <ChevronUp className="h-5 w-5 flex-shrink-0 text-[#7c7469]" />
        ) : (
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-[#7c7469]" />
        )}
      </button>
      {open && (
        <div className="border-t border-black/8 px-4 pb-4 pt-3">
          <p className="text-sm leading-6 text-[#5f574f]">{answer}</p>
        </div>
      )}
    </div>
  );
}
