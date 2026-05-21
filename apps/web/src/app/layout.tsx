import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Nav } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sofa2Slugger",
  description:
    "Beginner audio boxing at home. Twelve private rounds, no gym, no bag, no audience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen antialiased"
        style={{ fontFamily: "Inter, Arial, system-ui, sans-serif" }}
      >
        <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col overflow-x-hidden px-2 py-2 md:flex-row md:items-start md:gap-4 md:px-4 md:py-4">
          <aside className="hidden w-68 shrink-0 flex-col overflow-hidden border border-white/10 bg-[var(--slugger-black)]/95 text-[var(--slugger-bone)] shadow-2xl shadow-black/35 md:sticky md:top-4 md:flex md:max-h-[calc(100vh-2rem)] md:overflow-y-auto">
            <div className="slugger-ring-lines flex min-h-48 flex-col justify-between border-b border-white/10 p-5">
              <Link href="/" className="group flex items-center gap-3">
                <span className="slugger-two-mark h-11 w-14 text-sm font-black tracking-tight">
                  S2S
                </span>
                <span>
                  <span className="block text-lg font-black uppercase leading-none tracking-tight">
                    Sofa2Slugger
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase text-white/48">
                    Audio boxing at home
                  </span>
                </span>
              </Link>
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[var(--slugger-action-hot)]">
                  <ShieldCheck className="h-4 w-4" />
                  Beginner ready
                </div>
                <p className="mt-2 text-sm leading-5 text-white/68">
                  Short guided rounds that teach stance, punches, defense, and flow.
                </p>
              </div>
            </div>
            <Nav variant="sidebar" />
            <div className="mt-auto border-t border-white/10 p-4">
              <Link
                href="/session/1"
                className="flex items-center justify-between bg-[var(--slugger-bone)] px-4 py-3 text-sm font-black uppercase tracking-wide text-[var(--slugger-ink)] transition hover:bg-white"
              >
                Start round 1
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col border border-white/10 bg-[var(--slugger-paper)] shadow-2xl shadow-black/35">
            <header className="flex shrink-0 items-center justify-between border-b border-[var(--slugger-ink)]/14 bg-[var(--slugger-paper)] px-4 py-3 md:hidden">
              <Link href="/" className="flex items-center gap-2 text-base font-black uppercase tracking-tight text-[var(--slugger-ink)]">
                <span className="slugger-two-mark h-8 w-10 text-[11px]">
                  S2S
                </span>
                Sofa2Slugger
              </Link>
            </header>

            <main className="min-w-0 max-w-full flex-1 pb-24 md:pb-4">
              {children}
            </main>

            <Nav variant="bottom" />
          </div>
        </div>
      </body>
    </html>
  );
}
