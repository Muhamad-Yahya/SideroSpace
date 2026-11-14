"use client";

import { ArrowRight, ExternalLink, Orbit } from "lucide-react";
import Link from "next/link";
import DashboardEntryLink from "./DashboardEntryLink";

export default function CosmicLaunchCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-[#020512] py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/images/sat.webp')" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#020512]/70 via-[#020512]/55 to-[#020512]/85"
      />
      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight uppercase">
          Ready to Explore the Research?
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          Explore selected microgravity combustion datasets, compare available experimental information, and follow research evidence through SideroSpace.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <DashboardEntryLink
            className="group relative flex items-center gap-3 rounded-full bg-blue-500 px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-blue-400/40 transition-all duration-300 hover:bg-blue-400 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]"
          >
            <Orbit className="h-4 w-4" />
            <span>Visit Project</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </DashboardEntryLink>

          <Link
            href="https://github.com/Muhamad-Yahya/SideroSpace"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-slate-200 backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-white hover:scale-[1.02]"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View GitHub</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
