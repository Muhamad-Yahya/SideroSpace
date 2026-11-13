"use client";

import Image from "next/image";
import Link from "next/link";
import SectionReveal from "./SectionReveal";

const investigations = [
  {
    id: "flex",
    name: "FLEX",
    fullName: "Flame Extinguishment Experiment",
    image: "/images/microgravity-flame.webp",
    imageAlt: "FLEX experiment — droplet combustion in microgravity",
    records: "274",
    recordType: "CSV records",
    description:
      "Isolated single-droplet combustion in microgravity. Each test burns a tiny fuel sphere and captures diameter regression, flame stand-off ratios, and radiometer traces — revealing extinction phenomena invisible in terrestrial labs.",
    detail: "Fuel types include heptane, methanol, and decane blends studied across varying pressures and atmospheric compositions.",
    href: "/flex",
    accent: "from-cyan-400/80 to-blue-500/80",
    accentBorder: "border-cyan-500/20",
  },
  {
    id: "bass-ii",
    name: "BASS-II",
    fullName: "Burning and Suppression of Solids",
    image: "/images/flame.jpg",
    imageAlt: "BASS-II experiment — solid material burning in microgravity",
    records: "129",
    recordType: "CSV records",
    description:
      "Material flammability in microgravity conditions. Tests flat and cylindrical solid samples with varying flow velocities and oxygen concentrations — mapping the boundary between burning and suppression.",
    detail: "Samples include PMMA, cotton-fiberglass blends, and Nomex across nitrogen-oxygen atmospheres.",
    href: "/bass-ii",
    accent: "from-orange-400/80 to-amber-500/80",
    accentBorder: "border-orange-500/20",
  },
  {
    id: "saffire",
    name: "SAFFIRE-I",
    fullName: "Spacecraft Fire Safety Demonstration",
    image: "/images/CRAFT.jpg",
    imageAlt: "SAFFIRE experiment — large-scale spacecraft fire test",
    records: "764",
    recordType: "image frames",
    description:
      "The largest fire ever intentionally set in space. Conducted inside an uncrewed Cygnus cargo vehicle after ISS departure, SAFFIRE-I captured flame spread across a 0.4 × 0.95 m cotton-fiberglass blend at sub-millimeter resolution.",
    detail: "Pre-test flow visualization confirms uniform air speed before ignition. Frame-by-frame analysis available.",
    href: "/saffire",
    accent: "from-red-400/80 to-rose-500/80",
    accentBorder: "border-red-500/20",
  },
];

export default function InvestigationsSection() {
  return (
    <section
      id="investigations"
      className="relative bg-[#030711] py-28 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionReveal>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-purple-400/70 sm:text-xs">
            NASA Investigations
          </p>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Three experiments.{" "}
            <span className="text-slate-500">
              Thousands of data points. One platform.
            </span>
          </h2>
        </SectionReveal>

        <div className="mt-20 flex flex-col gap-24 lg:gap-32">
          {investigations.map((inv, i) => (
            <SectionReveal key={inv.id} delay={i * 80}>
              <div
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  i % 2 === 1 ? "lg:[direction:rtl]" : ""
                }`}
              >
                {/* Image */}
                <div className={i % 2 === 1 ? "lg:[direction:ltr]" : ""}>
                  <div
                    className={`relative aspect-[16/10] overflow-hidden rounded-2xl border ${inv.accentBorder} bg-[#0a0e18]`}
                  >
                    <Image
                      src={inv.image}
                      alt={inv.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030711]/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <span
                        className={`rounded-lg bg-gradient-to-r ${inv.accent} px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white`}
                      >
                        {inv.name}
                      </span>
                      <span className="text-[10px] font-semibold text-white/60">
                        {inv.records} {inv.recordType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className={i % 2 === 1 ? "lg:[direction:ltr]" : ""}>
                  <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {inv.fullName}
                  </h3>
                  <p className="mt-5 text-base leading-8 text-slate-400">
                    {inv.description}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {inv.detail}
                  </p>
                  <Link
                    href={inv.href}
                    className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-blue-300"
                  >
                    Explore {inv.name} data
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
