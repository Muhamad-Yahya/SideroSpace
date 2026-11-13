"use client";

import Image from "next/image";
import Link from "next/link";
import { Compass, Flame, Wind, ArrowRight } from "lucide-react";

export default function ZeroGPhysicsSection() {
  return (
    <section id="physics" className="relative w-full py-20 lg:py-24 border-t border-white/[0.08] bg-gradient-to-b from-[#020617] via-[#040d21] to-[#020617]">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3.5 py-1 text-xs font-mono text-blue-300">
            <Compass className="h-3.5 w-3.5 text-blue-400" />
            <span>FUNDAMENTAL FLUID DYNAMICS</span>
          </div>

          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
            Fire on Earth & in Microgravity
          </h2>

          <p className="mt-4 max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Gravity influences how hot gases move around a flame. In microgravity, buoyancy-driven flow is greatly reduced, so transport processes such as diffusion and imposed airflow become especially important to study.
          </p>
        </div>

        {/* Side-by-side Comparison Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Earth Environment Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0b1329]/80 to-[#020617]/90 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Flame className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Terrestrial combustion</h3>
                  <p className="text-[11px] font-mono text-slate-400">EARTH ENVIRONMENT</p>
                </div>
              </div>
              <span className="rounded-full border border-amber-500/30 bg-amber-950/40 px-2.5 py-1 text-[10px] font-mono text-amber-300 font-semibold">
                BUOYANCY-INFLUENCED FLOW
              </span>
            </div>

            {/* Earth Flame Image */}
            <div className="relative mt-5 aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-black">
              <Image
                src="/images/flame.jpg"
                alt="Terrestrial Candle Flame"
                fill
                className="object-cover opacity-90"
                sizes="(max-width: 768px) 100vw, 550px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Terrestrial Description */}
            <div className="mt-5 space-y-2">
              <h4 className="text-sm font-semibold text-amber-200">
                Buoyancy-Influenced Flow
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                A familiar candle flame is shaped by buoyancy: hot gases rise, helping create its characteristic upward form.
              </p>
            </div>
          </div>

          {/* Microgravity Research Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-b from-[#071733]/90 to-[#020617]/95 p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/60 hover:shadow-[0_0_35px_rgba(59,130,246,0.25)]">
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/40">
                  <Wind className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Microgravity combustion</h3>
                  <p className="text-[11px] font-mono text-blue-300">MICROGRAVITY RESEARCH</p>
                </div>
              </div>
              <span className="rounded-full border border-blue-400/40 bg-blue-950/60 px-2.5 py-1 text-[10px] font-mono text-blue-200 font-semibold">
                REDUCED BUOYANCY
              </span>
            </div>

            {/* Microgravity Flame Image with HUD Scanline & Telemetry */}
            <div className="relative mt-5 aspect-[16/9] w-full overflow-hidden rounded-xl border border-blue-500/30 bg-black">
              <Image
                src="/images/microgravity-flame.jpg"
                alt="Microgravity Flame Experiment"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 550px"
              />

              {/* HUD Scanline Beam */}
              <div
                className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-hud-scanline"
                aria-hidden="true"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

              {/* Orbital Telemetry Stamp */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded bg-black/60 px-2 py-0.5 font-mono text-[9px] text-cyan-300 backdrop-blur-sm border border-cyan-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
                </span>
                <span>ISS CIR TELEMETRY</span>
              </div>

              {/* Corner reticle marks */}
              <div className="pointer-events-none absolute top-3 right-3 text-[10px] font-mono text-cyan-400/60">
                [+]
              </div>
              <div className="pointer-events-none absolute bottom-3 right-3 text-[9px] font-mono text-slate-400">
                SPHERICAL FLAME GEOMETRY
              </div>
            </div>

            {/* Microgravity Description */}
            <div className="mt-5 space-y-2">
              <h4 className="text-sm font-semibold text-blue-200">
                Reduced Buoyancy
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Microgravity experiments allow researchers to study combustion when buoyancy-driven flow is greatly reduced. The resulting behavior depends on the fuel, atmosphere, geometry, and experimental conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-blue-500/20 bg-blue-950/20 px-6 py-4 backdrop-blur-md">
          <p className="text-xs sm:text-sm text-slate-300 font-sans">
            SideroSpace helps users explore selected NASA experiments and research evidence related to these questions.
          </p>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-mono font-semibold text-blue-300 hover:text-white shrink-0 border border-blue-500/30 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-all"
          >
            <span>Explore the Project</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
