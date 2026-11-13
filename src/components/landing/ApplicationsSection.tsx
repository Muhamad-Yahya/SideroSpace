"use client";

import {
  Rocket,
  Building2,
  ShieldCheck,
  Atom,
  Cpu,
} from "lucide-react";
import SectionReveal from "./SectionReveal";

const applications = [
  {
    icon: Rocket,
    title: "Spacecraft Fire Safety",
    description:
      "Microgravity combustion data informs the design of fire detection, suppression, and prevention systems for crewed vehicles on lunar and Mars missions.",
    accent: "text-blue-400 bg-blue-500/10",
  },
  {
    icon: Building2,
    title: "Habitat Material Selection",
    description:
      "Flammability data from BASS-II guides material choices for space habitats, identifying which fabrics and composites resist ignition in low-gravity atmospheres.",
    accent: "text-emerald-400 bg-emerald-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Fire Suppression Systems",
    description:
      "Understanding how flames spread and extinguish without buoyant convection shapes next-generation fire suppression technology for orbital environments.",
    accent: "text-orange-400 bg-orange-500/10",
  },
  {
    icon: Atom,
    title: "Combustion Science",
    description:
      "Isolated droplet burning experiments advance fundamental understanding of combustion chemistry, soot formation, and cool-flame phenomena.",
    accent: "text-violet-400 bg-violet-500/10",
  },
  {
    icon: Cpu,
    title: "Computational Models",
    description:
      "Experimental datasets serve as validation benchmarks for CFD models predicting fire behavior in reduced gravity — essential for mission planning.",
    accent: "text-cyan-400 bg-cyan-500/10",
  },
];

export default function ApplicationsSection() {
  return (
    <section className="relative bg-[#030711] py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionReveal>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400/70 sm:text-xs">
              Potential Applications
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Where this research{" "}
              <span className="bg-gradient-to-r from-blue-300 to-indigo-200 bg-clip-text text-transparent">
                matters
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-400">
              Microgravity combustion research has direct implications for
              spacecraft engineering and fire safety across multiple domains.
            </p>
          </div>
        </SectionReveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app, i) => (
            <SectionReveal
              key={app.title}
              delay={i * 60}
            >
              <div className={`rounded-2xl border border-white/[0.05] bg-white/[0.02] p-7 transition-colors hover:border-white/[0.1] ${i >= 3 ? "lg:col-span-1" : ""}`}>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${app.accent}`}
                >
                  <app.icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">
                  {app.title}
                </h3>
                <p className="mt-3 text-[13px] leading-7 text-slate-400">
                  {app.description}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={300}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-[11px] leading-6 text-slate-600">
            These represent potential research directions informed by the data.
            SideroSpace provides analytical tools — not certified engineering
            guidance. All claims should be verified against primary NASA sources.
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
