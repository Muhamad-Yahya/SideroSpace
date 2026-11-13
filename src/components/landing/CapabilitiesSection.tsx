"use client";

import {
  BarChart3,
  Layers,
  Flame,
  Search,
  GitCompareArrows,
  Shield,
  Eye,
  FileText,
  Lightbulb,
  Database,
  Microscope,
} from "lucide-react";
import SectionReveal from "./SectionReveal";

const featured = [
  {
    icon: BarChart3,
    title: "Interactive Visualizations",
    description:
      "Recharts-powered scatter plots, time series, and distribution charts with real-time filtering, axis selection, and data point inspection.",
  },
  {
    icon: GitCompareArrows,
    title: "Cross-Investigation Comparison",
    description:
      "Compare parameters across FLEX, BASS-II, and SAFFIRE side by side. Overlay datasets to reveal patterns that span multiple experiments.",
  },
  {
    icon: Eye,
    title: "Frame-by-Frame Explorer",
    description:
      "Step through SAFFIRE flame-spread imagery with playback controls, timeline scrubbing, and frame metadata overlays.",
  },
];

const capabilities = [
  {
    icon: Flame,
    title: "Experiment Dashboards",
    description: "Dedicated pages for each investigation with contextual metadata and navigation.",
  },
  {
    icon: Search,
    title: "Research Discovery",
    description: "AI-structured research pages surface key findings, variables, and methodology.",
  },
  {
    icon: Lightbulb,
    title: "Curated Insights",
    description: "Expert-level observations connecting data patterns to combustion science.",
  },
  {
    icon: Database,
    title: "Data Tables",
    description: "Sortable, filterable tables with CSV export for every experiment dataset.",
  },
  {
    icon: Shield,
    title: "Data Integrity Tracking",
    description: "Verification metrics, source checksums, and processing transparency.",
  },
  {
    icon: Layers,
    title: "Evidence Chains",
    description: "Trace any claim back to its source data, methodology, and original NASA record.",
  },
  {
    icon: FileText,
    title: "Research Library",
    description: "Searchable archive of generated research across all experiments.",
  },
  {
    icon: Microscope,
    title: "Variable Analysis",
    description: "Examine individual experimental variables with distribution charts and statistics.",
  },
];

export default function CapabilitiesSection() {
  return (
    <section
      id="capabilities"
      className="relative bg-[#030711] py-28 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionReveal>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400/70 sm:text-xs">
              Platform Capabilities
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Built for{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                serious research
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-400">
              Every feature is designed to support rigorous scientific
              exploration — not just present data, but make it explorable.
            </p>
          </div>
        </SectionReveal>

        {/* Featured capabilities — larger cards */}
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {featured.map((cap, i) => (
            <SectionReveal key={cap.title} delay={i * 80}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-7 transition-colors duration-300 hover:border-emerald-500/20 hover:bg-white/[0.04]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500/15">
                  <cap.icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">
                  {cap.title}
                </h3>
                <p className="mt-3 text-[13px] leading-7 text-slate-400">
                  {cap.description}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* Standard capabilities — compact grid */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap, i) => (
            <SectionReveal key={cap.title} delay={i * 50}>
              <div className="flex items-start gap-4 rounded-xl border border-white/[0.04] bg-white/[0.015] p-5 transition-colors hover:border-white/[0.08]">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-slate-400">
                  <cap.icon size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-white">
                    {cap.title}
                  </h3>
                  <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                    {cap.description}
                  </p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
