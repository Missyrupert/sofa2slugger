"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, BarChart3, HelpCircle, Home } from "lucide-react";

const MAIN_NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/gym", label: "Gym", icon: Dumbbell },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/corner", label: "Corner", icon: HelpCircle },
] as const;

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavVariant = "sidebar" | "bottom";

export function Nav({ variant = "sidebar" }: { variant?: NavVariant }) {
  const pathname = usePathname();

  if (variant === "bottom") {
    return (
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#11100e]/15 bg-[#eee5d8]/95 shadow-[0_-12px_36px_rgba(0,0,0,0.12)] backdrop-blur md:hidden"
        aria-label="Main navigation"
      >
        <ul className="grid grid-cols-4 px-1 py-2">
          {MAIN_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href, pathname);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-md px-2 py-2 text-[11px] font-black uppercase transition ${
                    active
                      ? "bg-[#11100e] text-[#fbf3e7]"
                      : "text-[#675f55] hover:bg-black/5 hover:text-[#11100e]"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-6 w-6" strokeWidth={2} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav
      className="flex flex-col gap-1 p-3"
      aria-label="Main navigation"
    >
      {MAIN_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(href, pathname);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-black uppercase tracking-wide transition ${
              active
                ? "bg-[#c7563f] text-[#fbf3e7] shadow-lg shadow-[#c7563f]/20"
                : "text-[#fbf3e7]/60 hover:bg-white/8 hover:text-[#fbf3e7]"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
