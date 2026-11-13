"use client";

import Image from "next/image";
import Link from "next/link";
import SectionReveal from "./SectionReveal";

export default function InsightsSection() {
  return (
    <section className="relative overflow-hidden bg-[#030711] py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Text */}
          <SectionReveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400/70 sm:text-xs">
              Research Insights
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              From experimental observations to{" "}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                research implications
              </span>
            </h2>
            <p className="mt-7 text-base leading-8 text-slate-400">
              SideroSpace surfaces curated research findings that connect raw
              data patterns to broader scientific context. Each insight traces
              back to specific experimental evidence, maintaining full
              transparency about the source and confidence level.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { value: "30+", label: "Research insights" },
                { value: "3", label: "Investigations covered" },
                { value: "100%", label: "Source-linked claims" },
                { value: "Open", label: "Methodology" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-4 py-3"
                >
                  <div className="text-lg font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard"
              className="group mt-10 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-6 py-2.5 text-sm font-medium text-amber-100 transition-all hover:border-amber-300/40 hover:bg-amber-400/15"
            >
              Explore the Project
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </SectionReveal>

          {/* Image */}
          <SectionReveal delay={150}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.06]">
              <Image
                src="/images/spacecraft-combustion.webp"
                alt="Spacecraft combustion research — analyzing fire behavior for space safety"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030711]/60 to-transparent" />
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
