"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  Waves,
  Database,
  Flame,
  GitCompareArrows,
  HelpCircle,
  BookOpen,
  Lightbulb,
  ArrowRight,
  Cpu,
} from "lucide-react";
import DashboardEntryLink from "./DashboardEntryLink";

interface SiteFeature {
  id: string;
  category: "explorers" | "analysis";
  title: string;
  route: string;
  badge: string;
  subBadge?: string;
  icon: any;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  tagColor: string;
  summary: string;
  highlights: string[];
  actionText: string;
}

const siteFeatures: SiteFeature[] = [
  {
    id: "dashboard",
    category: "analysis",
    title: "Mission Intelligence Dashboard",
    route: "/dashboard",
    badge: "Mission Overview",
    subBadge: "Three Selected Investigations",
    icon: Activity,
    accentColor: "from-blue-500 to-indigo-600",
    borderColor: "border-blue-500/30 hover:border-blue-400",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]",
    tagColor: "text-blue-300 bg-blue-950/60 border-blue-500/30",
    summary:
      "Explore dataset coverage, descriptive summaries, research findings, and links to investigation-specific tools.",
    highlights: [
      "Overview of selected investigations",
      "Data-derived summaries and charts",
      "Links to research and evidence",
    ],
    actionText: "Open Mission Dashboard",
  },
  {
    id: "flex",
    category: "explorers",
    title: "FLEX: Flame Extinguishment Experiment",
    route: "/flex",
    badge: "FLEX Dataset",
    subBadge: "274 CSV Records",
    icon: Waves,
    accentColor: "from-sky-500 to-blue-600",
    borderColor: "border-sky-500/30 hover:border-sky-400",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(14,165,233,0.25)]",
    tagColor: "text-sky-300 bg-sky-950/60 border-sky-500/30",
    summary:
      "Explore droplet-combustion records, including fuel, pressure, gas composition, droplet diameter, visible extinction diameter, recorded burning-rate values, and burn time.",
    highlights: [
      "Filter experimental records",
      "Explore charts and descriptive statistics",
      "Inspect records and export CSV data",
    ],
    actionText: "Explore FLEX Data",
  },
  {
    id: "bass",
    category: "explorers",
    title: "BASS-II: Burning and Suppression of Solids",
    route: "/bass-ii",
    badge: "BASS-II Dataset",
    subBadge: "129 CSV Records",
    icon: Database,
    accentColor: "from-amber-500 to-orange-600",
    borderColor: "border-amber-500/30 hover:border-amber-400",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]",
    tagColor: "text-amber-300 bg-amber-950/60 border-amber-500/30",
    summary:
      "Explore material and sample metadata alongside available initial and final gas measurements.",
    highlights: [
      "Filter by material",
      "Explore available gas readings",
      "Inspect records and export CSV data",
    ],
    actionText: "Explore BASS-II Data",
  },
  {
    id: "saffire",
    category: "explorers",
    title: "SAFFIRE-I: Spacecraft Fire Safety",
    route: "/saffire",
    badge: "SAFFIRE-I Image Explorer",
    subBadge: "764 Available Frames",
    icon: Flame,
    accentColor: "from-rose-500 to-red-600",
    borderColor: "border-rose-500/30 hover:border-rose-400",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(244,63,94,0.25)]",
    tagColor: "text-rose-300 bg-rose-950/60 border-rose-500/30",
    summary:
      "Browse locally available pre-test flow-visualization frames associated with SAFFIRE-I.",
    highlights: [
      "Navigate and play through frames",
      "View timestamps",
      "Download individual images",
    ],
    actionText: "Explore SAFFIRE-I Frames",
  },
  {
    id: "compare",
    category: "analysis",
    title: "Experiment Comparison",
    route: "/compare",
    badge: "Cross-Experiment Comparison",
    subBadge: "FLEX & BASS-II",
    icon: GitCompareArrows,
    accentColor: "from-violet-500 to-purple-600",
    borderColor: "border-violet-500/30 hover:border-violet-400",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]",
    tagColor: "text-violet-300 bg-violet-950/60 border-violet-500/30",
    summary:
      "Compare supported variables across FLEX and BASS-II, with dataset-specific fields shown where they are not shared.",
    highlights: [
      "Compare available shared measurements",
      "Inspect records and descriptive statistics",
      "Export comparison data",
    ],
    actionText: "Compare Experiments",
  },
  {
    id: "ask",
    category: "analysis",
    title: "Ask SideroSpace",
    route: "/ask",
    badge: "Curated Questions & Evidence Retrieval",
    icon: HelpCircle,
    accentColor: "from-teal-500 to-emerald-600",
    borderColor: "border-teal-500/30 hover:border-teal-400",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(20,184,166,0.25)]",
    tagColor: "text-teal-300 bg-teal-950/60 border-teal-500/30",
    summary:
      "Explore curated research questions and retrieve relevant passages from the indexed research evidence.",
    highlights: [
      "Browse curated questions and answers",
      "Search indexed evidence passages",
      "Review source references and excerpts",
    ],
    actionText: "Explore Research Questions",
  },
  {
    id: "research",
    category: "analysis",
    title: "Research Library",
    route: "/research",
    badge: "Research Library",
    subBadge: "5 Source Records · 352 Evidence Passages",
    icon: BookOpen,
    accentColor: "from-cyan-500 to-sky-600",
    borderColor: "border-cyan-500/30 hover:border-cyan-400",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]",
    tagColor: "text-cyan-300 bg-cyan-950/60 border-cyan-500/30",
    summary:
      "Explore indexed research documents and source excerpts, with evidence traceable to source and page information where available.",
    highlights: [
      "Search and filter indexed research documents",
      "Trace excerpts to source and page information where available",
      "Browse indexed evidence passages",
    ],
    actionText: "Browse Research Library",
  },
  {
    id: "insights",
    category: "analysis",
    title: "Insights, Conclusions & Applications",
    route: "/insights",
    badge: "Curated Research Insights",
    icon: Lightbulb,
    accentColor: "from-fuchsia-500 to-violet-600",
    borderColor: "border-fuchsia-500/30 hover:border-fuchsia-400",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(217,70,239,0.25)]",
    tagColor: "text-fuchsia-300 bg-fuchsia-950/60 border-fuchsia-500/30",
    summary:
      "Explore curated findings, cross-study conclusions, potential applications, and research gaps drawn from the indexed evidence.",
    highlights: [
      "Review research findings and supporting evidence",
      "Explore cross-study conclusions",
      "Discover potential applications and research gaps",
    ],
    actionText: "Explore Research Insights",
  },
];

export default function SiteFeaturesDeck() {
  const [activeFilter, setActiveFilter] = useState<"all" | "explorers" | "analysis">("all");

  const filteredFeatures = siteFeatures.filter((f) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "explorers") return f.category === "explorers";
    if (activeFilter === "analysis") return f.category === "analysis";
    return true;
  });

  return (
    <section id="project" className="relative w-full py-20 lg:py-28">
      <div id="features" className="absolute -top-24" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3.5 py-1 text-xs font-mono text-blue-300">
            <Cpu className="h-3.5 w-3.5 text-blue-400" />
            <span>PLATFORM CAPABILITIES & MODULES</span>
          </div>

          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Explore the SideroSpace Platform
          </h2>

          <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-300">
            SideroSpace connects selected experimental datasets and research documents with tools for exploration, comparison, and evidence retrieval.
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-md font-mono text-xs">
            <button
              onClick={() => setActiveFilter("all")}
              className={`rounded-full px-4 py-1.5 transition-all ${
                activeFilter === "all"
                  ? "bg-blue-500/30 text-blue-200 border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.3)] font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Modules (8)
            </button>
            <button
              onClick={() => setActiveFilter("explorers")}
              className={`rounded-full px-4 py-1.5 transition-all ${
                activeFilter === "explorers"
                  ? "bg-blue-500/30 text-blue-200 border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.3)] font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Data Explorers (3)
            </button>
            <button
              onClick={() => setActiveFilter("analysis")}
              className={`rounded-full px-4 py-1.5 transition-all ${
                activeFilter === "analysis"
                  ? "bg-blue-500/30 text-blue-200 border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.3)] font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Research & Analysis (5)
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-b from-[#060e22]/90 to-[#020617]/95 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${feature.borderColor} ${feature.glowColor}`}
              >
                <div>
                  {/* Top Bar: Icon + Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.accentColor} p-2.5 text-white shadow-lg`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex flex-col items-end text-right">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider ${feature.tagColor}`}
                      >
                        {feature.badge}
                      </span>
                      {feature.subBadge && (
                        <span className="mt-1 text-[11px] font-mono text-slate-400">
                          {feature.subBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-5 text-xl font-bold tracking-tight text-white group-hover:text-blue-200 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="mt-2.5 text-xs text-slate-300 leading-relaxed font-normal">
                    {feature.summary}
                  </p>

                  {/* Highlight Bullets */}
                  <div className="mt-4 space-y-1.5 border-t border-white/[0.07] pt-3">
                    {feature.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[11px] font-mono text-slate-400"
                      >
                        <span className="h-1 w-1 rounded-full bg-blue-400" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="mt-6 pt-4 border-t border-white/[0.06]">
                  <Link
                    href={feature.route}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-mono font-semibold text-slate-200 transition-all duration-200 hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-white"
                  >
                    <span>{feature.actionText}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-blue-400 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <DashboardEntryLink
            className="group inline-flex items-center gap-3 rounded-full border border-blue-300/50 bg-gradient-to-r from-blue-500/30 to-cyan-400/20 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,0.2)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-cyan-200/70 hover:shadow-[0_0_32px_rgba(59,130,246,0.4)]"
          >
            Visit Project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </DashboardEntryLink>
        </div>
      </div>
    </section>
  );
}
