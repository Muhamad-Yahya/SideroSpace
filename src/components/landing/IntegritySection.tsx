"use client";

import {
  Shield,
  Eye,
  FileCheck,
  GitBranch,
  Scale,
  BookOpen,
} from "lucide-react";
import SectionReveal from "./SectionReveal";

const principles = [
  {
    icon: Eye,
    title: "Full Transparency",
    description: "Every data transformation, processing step, and analytical method is documented and visible in the open-source codebase.",
  },
  {
    icon: FileCheck,
    title: "Source Attribution",
    description: "All datasets include provenance metadata tracing back to the original NASA experiment records and publications.",
  },
  {
    icon: GitBranch,
    title: "Open Source",
    description: "The entire platform is open source on GitHub. Anyone can inspect, verify, and contribute to the code and methodology.",
  },
  {
    icon: Scale,
    title: "Honest Limitations",
    description: "We explicitly document what the data can and cannot tell us. Uncertainty is acknowledged, not hidden.",
  },
  {
    icon: Shield,
    title: "No Overclaiming",
    description: "Research findings are presented as observations supported by data — not as definitive conclusions or engineering specifications.",
  },
  {
    icon: BookOpen,
    title: "Reproducible Analysis",
    description: "Data processing pipelines are deterministic and versioned. The same inputs always produce the same analytical outputs.",
  },
];

export default function IntegritySection() {
  return (
    <section className="relative bg-[#030711] py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionReveal>
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/15 bg-gradient-to-b from-emerald-500/[0.04] to-transparent">
            {/* Accent top border */}
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

            <div className="p-8 sm:p-12 lg:p-16">
              <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400/70 sm:text-xs">
                    Scientific Integrity
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Trust through{" "}
                    <span className="text-emerald-300">transparency</span>
                  </h2>
                </div>
                <div className="flex items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  Verified Open Source
                </div>
              </div>

              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-400">
                SideroSpace is built on the principle that scientific tools
                should be as transparent as the research they present. Every
                aspect of the platform — from data processing to visualization
                — is designed to be auditable and reproducible.
              </p>

              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {principles.map((principle, i) => (
                  <SectionReveal key={principle.title} delay={i * 60}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                        <principle.icon size={16} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-semibold text-white">
                          {principle.title}
                        </h3>
                        <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                          {principle.description}
                        </p>
                      </div>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
