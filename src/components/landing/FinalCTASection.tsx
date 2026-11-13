"use client";

import Image from "next/image";
import Link from "next/link";
import StarField from "./StarField";

export default function FinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-[#030711] py-32 sm:py-40 lg:py-48">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/earth-horizon.webp"
          alt="Earth's horizon viewed from space — atmospheric glow"
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030711] via-[#030711]/40 to-[#030711]" />
      </div>

      <StarField />

      {/* Glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(18,75,139,0.18),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-300/50 sm:text-xs">
          Begin Exploring
        </p>
        <h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          Explore the science of fire{" "}
          <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-white bg-clip-text text-transparent">
            beyond Earth
          </span>
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
          Dive into real NASA experiment data. Compare investigations. Trace
          evidence. Understand what fire does when gravity goes away.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#030711] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-100 hover:shadow-[0_0_40px_rgba(96,165,250,0.3)]"
          >
            Visit the Project
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

          <Link
            href="https://github.com/Muhamad-Yahya/SideroSpace"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/40 hover:bg-white/[0.09]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76 1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.13 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
            </svg>
            View on GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}
