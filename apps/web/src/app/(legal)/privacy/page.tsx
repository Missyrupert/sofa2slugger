const sections = [
  {
    title: "Who we are",
    body: "Sofa2Slugger is a beginner audio shadowboxing course. You can contact us at sofa2slugger@gmail.com.",
  },
  {
    title: "What we collect",
    body: "If you join the founding list or send feedback, we collect the details you choose to provide, such as your email address, interest, note, round feedback, and permission to quote that feedback. If you buy the course, payment details are handled by Stripe. We do not store your card details on this site.",
  },
  {
    title: "How we use it",
    body: "We use your information to provide access, respond to questions, improve the product, send updates you asked for, and understand whether the course is working for real listeners.",
  },
  {
    title: "Analytics and local storage",
    body: "The site may record simple product events such as starting a round, finishing a round, joining the list, or clicking checkout. The app also uses browser storage to remember course access and completed rounds on your device.",
  },
  {
    title: "Who we share it with",
    body: "We use service providers to run the product, including Netlify for hosting and forms, Stripe for payments, and any analytics provider configured on the site. We do not sell your personal information.",
  },
  {
    title: "Your choices",
    body: "You can ask to access, correct, or delete personal information we hold about you. You can also ask us to stop sending product emails. Contact sofa2slugger@gmail.com and we will deal with it as plainly as possible.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-[var(--slugger-paper)] px-5 py-10 text-[var(--slugger-ink)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--slugger-brass)]">
          Last updated 20 May 2026
        </p>
        <h1 className="mt-3 text-5xl font-black uppercase leading-none">
          Privacy policy
        </h1>
        <p className="mt-5 text-base leading-7 text-[var(--slugger-muted)]">
          This page explains, in plain English, what Sofa2Slugger collects and
          why. It should be reviewed properly before a full public launch.
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
