import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Nav } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sofa to Slugger",
  description:
    "Audio-guided shadowboxing training for beginners. Twelve compact rounds, no equipment needed.",
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
        <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-2 py-2 md:flex-row md:gap-4 md:px-4 md:py-4">
          <aside className="hidden w-68 flex-shrink-0 flex-col overflow-hidden border border-white/10 bg-[#0f0e0c]/95 text-[#fbf3e7] shadow-2xl shadow-black/35 md:flex">
            <div className="slugger-ring-lines flex min-h-48 flex-col justify-between border-b border-white/10 p-5">
              <Link href="/" className="group flex items-center gap-3">
                <span className="slugger-phone-pulse flex h-11 w-11 items-center justify-center bg-[#c7563f] text-lg font-black italic text-[#fbf3e7] shadow-[4px_4px_0_#fbf3e7]">
                  2
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
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#f0a086]">
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
                className="flex items-center justify-between bg-[#fbf3e7] px-4 py-3 text-sm font-black uppercase tracking-wide text-[#11100e] transition hover:bg-white"
              >
                Start round 1
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden border border-white/10 bg-[#eee5d8] shadow-2xl shadow-black/35">
            <header className="flex flex-shrink-0 items-center justify-between border-b border-[#11100e]/14 bg-[#eee5d8] px-4 py-3 md:hidden">
              <Link href="/" className="flex items-center gap-2 text-base font-black uppercase tracking-tight text-[#11100e]">
                <span className="flex h-8 w-8 items-center justify-center bg-[#c7563f] text-sm italic text-[#fbf3e7]">
                  2
                </span>
                Sofa2Slugger
              </Link>
            </header>

            <main className="min-h-0 flex-1 overflow-auto pb-20 md:pb-0">
              {children}
            </main>

            <Nav variant="bottom" />
            <div className="h-16 flex-shrink-0 md:hidden" aria-hidden />
          </div>
        </div>
      </body>
    </html>
  );
}
