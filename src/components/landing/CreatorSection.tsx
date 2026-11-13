"use client";

import Image from "next/image";
import Link from "next/link";
import { Code2, Sparkles, ArrowUpRight } from "lucide-react";

export default function CreatorSection() {
  return (
    <section id="creator" className="relative w-full py-18 lg:py-24 border-t border-white/[0.08] bg-[#020614]">
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        {/* Section Eyebrow & Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3.5 py-1 text-xs font-mono text-blue-300">
            <Code2 className="h-3.5 w-3.5 text-blue-400" />
            <span>PROJECT CREATOR &amp; DEVELOPER</span>
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            About the Creator
          </h2>
        </div>

        {/* 2-Column Left/Right Card */}
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/25 bg-gradient-to-b from-[#081329]/90 to-[#020617]/95 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_0_40px_rgba(59,130,246,0.15)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Creator Image */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative aspect-square w-full max-w-[280px] sm:max-w-[320px] overflow-hidden rounded-2xl border-2 border-blue-400/30 bg-blue-950/40 shadow-[0_0_30px_rgba(59,130,246,0.25)] group">
                <Image
                  src="/images/ME.webp"
                  alt="SideroSpace Creator"
                  fill
                  sizes="(max-width: 768px) 280px, 320px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-blue-200 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                    Developer
                  </span>
                  <span className="text-slate-400">Space Apps 2026</span>
                </div>
              </div>
            </div>

            {/* Right Column: Bio & Information */}
            <div className="md:col-span-7 flex flex-col justify-center text-center md:text-left">
              <div className="inline-flex items-center justify-center md:justify-start gap-2 text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                <span>NASA Space Apps Challenge 2026</span>
              </div>

              <h3 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Muhammad Yahya
              </h3>

              <h4 className="mt-1 text-xl sm:text-2xl font-bold text-slate-200 tracking-tight">
                Computer Science Student &amp; Software Engineer
              </h4>

              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Hi, I’m a computer science student and software engineer with a strong interest in developing data-driven applications, scientific visualization tools, and research software.
              </p>

              <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                I created SideroSpace independently for the NASA Space Apps Challenge 2026 (&ldquo;Flame in Freefall&rdquo;) to transform complex microgravity combustion flight archives from FLEX, BASS-II, and SAFFIRE-I into an accessible, structured research intelligence platform.
              </p>

              {/* Focus tags */}
              <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-2 font-mono text-[11px]">
                <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-slate-300">
                  Full-Stack Engineering
                </span>
                <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-slate-300">
                  Scientific Data Modeling
                </span>
                <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-slate-300">
                  UI/UX &amp; Telemetry Design
                </span>
              </div>

              {/* Action Links */}
              <div className="mt-7 flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-5 border-t border-white/[0.08]">
                {/* LinkedIn Link (Placeholder URL) */}
                <Link
                  href="https://www.linkedin.com/in/muhamad-yahya/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/15 px-5 py-2.5 text-xs font-mono font-semibold text-blue-200 hover:border-blue-300 hover:bg-blue-500/25 hover:text-white transition-all shadow-sm"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-blue-400">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
                  </svg>
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                {/* GitHub Repository */}
                <Link
                  href="https://github.com/Muhamad-Yahya/SideroSpace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs font-mono font-medium text-slate-300 hover:border-white/30 hover:bg-white/[0.08] hover:text-white transition-all"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                    <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76 1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.13 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
                  </svg>
                  <span>GitHub Repository ↗</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
