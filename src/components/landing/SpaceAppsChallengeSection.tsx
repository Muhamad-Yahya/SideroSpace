"use client";

import Link from "next/link";
import { Flame, Rocket, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";

export default function SpaceAppsChallengeSection() {
  return (
    <section id="challenge" className="relative w-full py-18 lg:py-24 border-t border-white/[0.08] bg-[#020512]">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Eyebrow & Title */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3.5 py-1 text-xs font-mono text-blue-300">
            <Flame className="h-3.5 w-3.5 text-blue-400" />
            <span>NASA SPACE APPS CHALLENGE 2026</span>
          </div>

          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
            Challenge: &ldquo;Flame in Freefall&rdquo;
          </h2>

          <p className="mt-4 max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Exploring how fire behaves in microgravity and how NASA research can inform future spacecraft fire-safety research.
          </p>
        </div>

        {/* Challenge Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card 1: The Challenge Objective */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-[#081226]/80 to-[#020617]/90 p-7 backdrop-blur-xl">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold">
                  Challenge Focus
                </span>
                <span className="rounded-full border border-blue-400/30 bg-blue-950/50 px-2.5 py-0.5 text-[10px] font-mono text-blue-300">
                  Microgravity Science
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-white">
                Understanding Fire in Weightlessness
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                The &ldquo;Flame in Freefall&rdquo; challenge investigates combustion dynamics in the absence of Earth&apos;s natural buoyant convection. Without gravity pulling dense, cold air down and pushing buoyant hot gases up, flames burn with altered shapes, temperatures, and transport mechanics.
              </p>

              <div className="mt-5 space-y-2 border-t border-white/[0.06] pt-4 text-xs font-mono text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>Examining buoyancy-suppressed combustion physics</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>Informing fire-prevention and material safety for future long-duration human spaceflight</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: The SideroSpace Platform Response */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-blue-500/30 bg-gradient-to-b from-[#071733]/90 to-[#020617]/95 p-7 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.12)]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-semibold">
                  Project Response
                </span>
                <span className="rounded-full border border-sky-400/30 bg-sky-950/50 px-2.5 py-0.5 text-[10px] font-mono text-sky-300">
                  SideroSpace
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-white">
                Independent Research Exploration
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                SideroSpace was created for this challenge to make selected NASA combustion datasets and peer-reviewed research accessible. The platform organizes records from three landmark experiments (FLEX, BASS-II, and SAFFIRE-I) into structured explorers and comparative tools.
              </p>

              <div className="mt-5 space-y-2 border-t border-white/[0.06] pt-4 text-xs font-mono text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" />
                  <span>Synthesizes 403 experimental records &amp; 352 evidence passages</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" />
                  <span>Educational exploration tool: not affiliated with or endorsed by NASA</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06]">
              <Link
                href="#project"
                className="flex items-center justify-between text-xs font-mono font-semibold text-blue-300 hover:text-white transition-colors"
              >
                <span>Explore Challenge Datasets Below</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
