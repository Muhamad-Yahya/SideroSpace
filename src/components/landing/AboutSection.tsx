"use client";

import Image from "next/image";
import SectionReveal from "./SectionReveal";

export default function AboutSection() {
  return (
    <section id="about" className="relative bg-[#030711] py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image side */}
          <SectionReveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.06]">
              <Image
                src="/images/orbital-station.jpg"
                alt="International Space Station — orbital laboratory for combustion research"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030711]/60 to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-[#030711]/70 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-blue-300/80 backdrop-blur-md">
                ISS Research Platform
              </div>
            </div>
          </SectionReveal>

          {/* Text side */}
          <SectionReveal delay={150}>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400/70 sm:text-xs">
              About SideroSpace
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Turning space research into{" "}
              <span className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent">
                accessible scientific insight
              </span>
            </h2>
            <p className="mt-7 text-base leading-8 text-slate-400">
              SideroSpace is an independently developed research intelligence
              platform that aggregates, processes, and visualizes data from
              NASA&apos;s microgravity combustion experiments conducted aboard
              the International Space Station.
            </p>
            <p className="mt-5 text-base leading-8 text-slate-400">
              The platform transforms raw CSV datasets and experimental image
              sequences into interactive explorations — making complex
              scientific data approachable for researchers, students, and
              anyone curious about fire safety in space.
            </p>

            <div className="mt-10 flex flex-col gap-5 border-t border-white/[0.06] pt-8">
              {[
                {
                  title: "Independent Development",
                  desc: "Not affiliated with NASA. Built as an educational research tool using publicly available data.",
                },
                {
                  title: "Data Aggregation",
                  desc: "Combines multiple experiment datasets into a unified analytical environment with cross-investigation comparison.",
                },
                {
                  title: "Open Source",
                  desc: "Fully transparent codebase. Every data transformation and visualization method can be inspected and verified.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400/60" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[13px] leading-6 text-slate-500">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
