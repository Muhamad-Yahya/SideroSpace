"use client";

import { Orbit, FileText, Image as ImageIcon, BookOpen } from "lucide-react";

const metrics = [
  {
    tag: "TELEMETRY [1]",
    value: "3",
    label: "Investigations",
    detail: "FLEX · BASS-II · SAFFIRE-I",
    icon: Orbit,
    accent: "text-blue-400",
  },
  {
    tag: "TELEMETRY [2]",
    value: "403",
    label: "Experimental Records",
    detail: "274 FLEX + 129 BASS-II records",
    icon: FileText,
    accent: "text-sky-400",
  },
  {
    tag: "TELEMETRY [3]",
    value: "764",
    label: "SAFFIRE-I Frames",
    detail: "Pre-test flow-visualization imagery",
    icon: ImageIcon,
    accent: "text-cyan-400",
  },
  {
    tag: "TELEMETRY [4]",
    value: "352",
    label: "Indexed Evidence Passages",
    detail: "Across three selected investigations",
    icon: BookOpen,
    accent: "text-indigo-400",
  },
];

export default function SpaceTelemetryMetrics() {
  return (
    <section className="relative w-full py-16 border-y border-white/[0.08] bg-[#020512]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-blue-400">
            Project Overview
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Understanding Fire Beyond Earth
          </h2>
        </div>

        {/* 4 Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-400/40 hover:bg-blue-950/20 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400" />
                      </span>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                        {item.tag}
                      </span>
                    </div>
                    <Icon className={`h-4 w-4 ${item.accent} transition-transform group-hover:scale-110`} />
                  </div>

                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
                      {item.value}
                    </span>
                  </div>

                  <div className="mt-2 text-sm font-semibold text-slate-200">
                    {item.label}
                  </div>
                </div>

                <div className="mt-4 border-t border-white/[0.06] pt-3 text-xs font-mono text-slate-400">
                  {item.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
