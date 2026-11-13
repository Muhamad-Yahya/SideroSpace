"use client";

import Image from "next/image";
import SectionReveal from "./SectionReveal";

export default function ChallengeSection() {
  return (
    <section className="relative overflow-hidden bg-[#030711] py-28 sm:py-36 lg:py-44">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/microgravity-flame.webp"
          alt="Microgravity flame experiment showing spherical combustion behavior"
          fill
          sizes="100vw"
          className="object-cover opacity-[0.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030711] via-[#030711]/60 to-[#030711]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <SectionReveal>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-400/70 sm:text-xs">
            The Challenge
          </p>
          <h2 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Fire behaves differently{" "}
            <span className="bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent">
              beyond Earth
            </span>
          </h2>
        </SectionReveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionReveal delay={100}>
            <p className="text-base leading-8 text-slate-400 sm:text-lg sm:leading-9">
              Without gravity, flames don&apos;t rise. They expand into
              spherical shapes, alter heat transfer patterns, and change how
              gases circulate around burning materials. These fundamental
              differences make terrestrial fire safety models unreliable for
              spacecraft design.
            </p>
            <p className="mt-6 text-base leading-8 text-slate-400 sm:text-lg sm:leading-9">
              NASA&apos;s microgravity combustion experiments — conducted aboard
              the International Space Station — produce data that cannot be
              replicated on Earth. Understanding this data is essential for
              the safety of long-duration space missions.
            </p>
          </SectionReveal>

          <SectionReveal delay={200}>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  value: "0g",
                  label: "Microgravity",
                  desc: "Near-weightless environment alters flame dynamics",
                },
                {
                  value: "360°",
                  label: "Spherical Flames",
                  desc: "Without buoyancy, flames expand in all directions",
                },
                {
                  value: "3",
                  label: "ISS Experiments",
                  desc: "FLEX, BASS-II, and SAFFIRE-I investigations",
                },
                {
                  value: "1,167+",
                  label: "Data Records",
                  desc: "Across CSV datasets and image frames",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
                >
                  <div className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-orange-300/80">
                    {stat.label}
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-slate-500">
                    {stat.desc}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
