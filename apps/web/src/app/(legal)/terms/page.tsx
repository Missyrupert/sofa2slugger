const sections = [
  {
    title: "What you are buying",
    body: "Sofa2Slugger is a paid digital audio course. Round 1 is free. The paid course unlocks rounds 2 through 12 as guided audio sessions you can replay in this browser.",
  },
  {
    title: "Payment and access",
    body: "Payment is handled by Stripe. After payment, access is unlocked in the browser you used to buy. If access does not appear or you change device, email sofa2slugger@gmail.com and we will help restore access manually.",
  },
  {
    title: "Digital content",
    body: "The course is delivered as immediate digital content. Before checkout, you are asked to confirm that you understand access begins after payment.",
  },
  {
    title: "Safety",
    body: "Sofa2Slugger is not medical advice, physiotherapy, fight training, or personal coaching. Clear your space, move under control, and stop if you feel pain, dizziness, chest discomfort, or anything that feels wrong. If you are unsure whether this is suitable for you, speak to a qualified medical professional first.",
  },
  {
    title: "What this course does not promise",
    body: "The course can help you practise basic shadowboxing movement, guard, rhythm, and composure. It does not make you a competitive boxer, teach sparring, or guarantee fitness, health, confidence, or mental health outcomes.",
  },
  {
    title: "Refunds and problems",
    body: "If something is broken, unclear, or you cannot access what you paid for, email sofa2slugger@gmail.com. We want early customers treated fairly while the first public version earns its proof.",
  },
];

export default function TermsPage() {
  return (
    <main className="bg-[var(--slugger-paper)] px-5 py-10 text-[var(--slugger-ink)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--slugger-brass)]">
          Last updated 20 May 2026
        </p>
        <h1 className="mt-3 text-5xl font-black uppercase leading-none">
          Terms of service
        </h1>
        <p className="mt-5 text-base leading-7 text-[var(--slugger-muted)]">
          These starter terms are written to remove confusion before purchase.
          They should be reviewed properly before a full public launch.
        </p>

        <div className="mt-8 grid gap-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="border-t border-[var(--slugger-ink)]/14 pt-5"
            >
              <h2 className="text-xl font-black uppercase tracking-tight">
                {section.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--slugger-muted)]">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
