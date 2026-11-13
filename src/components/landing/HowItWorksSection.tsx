"use client";

import SectionReveal from "./SectionReveal";

const stages = [
  {
    number: "01",
    title: "NASA Research Sources",
    description:
      "Raw CSV data and image sequences from FLEX, BASS-II, and SAFFIRE experiments are sourced from NASA's publicly available repositories.",
  },
  {
    number: "02",
    title: "Data Preparation",
    description:
      "Datasets are cleaned, normalized, and enriched with computed fields. Column types are inferred, units standardized, and metadata extracted.",
  },
  {
    number: "03",
    title: "Research Discovery",
    description:
      "AI-assisted research pages surface patterns, anomalies, and key findings from the processed data for each investigation.",
  },
  {
    number: "04",
    title: "Data Exploration",
    description:
      "Interactive visualizations, comparison tools, and frame-by-frame explorers let you examine the data from every angle.",
  },
  {
    number: "05",
    title: "Evidence-Based Insights",
    description:
      "Curated observations connect experimental results to broader implications for spacecraft fire safety and materials science.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="research" className="relative bg-[#030711] py-28 sm:py-36">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(139,92,246,0.04),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <SectionReveal>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-violet-400/70 sm:text-xs">
              How It Works
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              From raw data to{" "}
              <span className="bg-gradient-to-r from-violet-300 to-purple-200 bg-clip-text text-transparent">
                research insights
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-400">
              A five-stage pipeline transforms NASA experiment data into
              accessible, explorable scientific research.
            </p>
          </div>
        </SectionReveal>

        {/* Timeline */}
        <div className="mt-20">
          {/* Desktop horizontal timeline */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-0 right-0 top-6 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

              <div className="grid grid-cols-5 gap-6">
                {stages.map((stage, i) => (
                  <SectionReveal key={stage.number} delay={i * 100}>
                    <div className="relative flex flex-col items-center text-center">
                      {/* Node */}
                      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/30 bg-[#0a0e18] text-sm font-bold text-violet-300 landing-glow-node">
                        {stage.number}
                      </div>
                      <h3 className="mt-6 text-sm font-semibold text-white">
                        {stage.title}
                      </h3>
                      <p className="mt-3 text-[12px] leading-6 text-slate-500">
                        {stage.description}
                      </p>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile vertical timeline */}
          <div className="lg:hidden">
            <div className="relative border-l border-violet-500/20 pl-8">
              {stages.map((stage, i) => (
                <SectionReveal key={stage.number} delay={i * 80}>
                  <div className="relative mb-12 last:mb-0">
                    {/* Node */}
                    <div className="absolute -left-[calc(2rem+1px)] top-0 flex h-10 w-10 items-center justify-center rounded-full border border-violet-500/30 bg-[#0a0e18] text-xs font-bold text-violet-300">
                      {stage.number}
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      {stage.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-7 text-slate-500">
                      {stage.description}
                    </p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
