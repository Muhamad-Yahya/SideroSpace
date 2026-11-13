
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Atom,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Compass,
  Database,
  ExternalLink,
  Eye,
  Flame,
  Gauge,
  Layers3,
  Lightbulb,
  Microscope,
  Search,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Wind,
  X,
} from "lucide-react";

type Experiment = "FLEX" | "BASS-II" | "SAFFIRE-I" | "Cross-experiment";
type Category =
  | "Flame behavior"
  | "Oxygen & atmosphere"
  | "Airflow & spread"
  | "Extinction & suppression"
  | "Detection & monitoring"
  | "Spacecraft safety";

type Insight = {
  id: number;
  title: string;
  category: Category;
  experiments: Experiment[];
  finding: string;
  evidence: string;
  interpretation: string;
  application: string;
  limitation: string;
  metric?: string;
  metricLabel?: string;
  priority: "High" | "Medium";
};

const insights: Insight[] = [
  {
    id: 1,
    title: "Microgravity can extend material flammability limits",
    category: "Oxygen & atmosphere",
    experiments: ["BASS-II"],
    metric: "13.6%",
    metricLabel: "O₂ concentration in a reported PMMA test",
    finding:
      "A quarter-inch PMMA rod sustained flame spread at 13.6% oxygen in a BASS-II microgravity experiment, despite a reported 16% oxygen blowoff threshold in a corresponding 1-g comparison.",
    evidence:
      "The reported difference is approximately 2.4 percentage points. It is a specific experimental comparison, not a universal adjustment factor.",
    interpretation:
      "Gravity-dependent transport and the imposed flow conditions can change the oxygen concentration at which a material sustains combustion.",
    application:
      "Spacecraft material screening should consider microgravity-relevant testing rather than relying exclusively on normal-gravity flammability results.",
    limitation:
      "The comparison concerns a particular PMMA geometry and test configuration. It cannot be generalized to every spacecraft material.",
    priority: "High",
  },
  {
    id: 2,
    title: "Visible extinction may not mean combustion has completely stopped",
    category: "Flame behavior",
    experiments: ["FLEX"],
    finding:
      "FLEX droplet experiments reported extended low-temperature combustion behavior after the visible flame disappeared, particularly in larger heptane droplets.",
    evidence:
      "The reported observations include continued droplet evolution after visible flame extinction and are discussed in relation to low-temperature chemical reactions.",
    interpretation:
      "Optical disappearance of a visible flame is not necessarily equivalent to the end of all chemical activity.",
    application:
      "Fire-monitoring systems may benefit from combining optical observations with additional temperature or chemical measurements.",
    limitation:
      "The observation concerns particular liquid-droplet experiments. It should not automatically be described as the same phenomenon as smoldering in solid materials.",
    priority: "High",
  },
  {
    id: 3,
    title: "Inert gases can shift droplet flammability limits",
    category: "Extinction & suppression",
    experiments: ["FLEX"],
    metric: "≈30%",
    metricLabel: "CO₂ condition discussed in reported comparisons",
    finding:
      "FLEX investigated how carbon dioxide and helium influence the limiting oxygen conditions for methanol and heptane droplet combustion.",
    evidence:
      "Reported comparisons include higher limiting oxygen concentrations under some inert-gas conditions. Approximate values in the research synthesis include 14% for methanol and 17% for heptane under a 30% CO₂ condition.",
    interpretation:
      "The surrounding gas composition changes the environment in which droplet combustion can be sustained.",
    application:
      "These findings can inform further investigation of inert-gas fire suppression and spacecraft atmosphere design.",
    limitation:
      "Droplet-scale limiting oxygen measurements do not directly determine the quantity of suppressant needed in a spacecraft cabin.",
    priority: "High",
  },
  {
    id: 4,
    title: "Droplet extinction depends on oxygen concentration",
    category: "Oxygen & atmosphere",
    experiments: ["FLEX"],
    finding:
      "FLEX examined the relationship between oxygen concentration and droplet flame extinction, including distinct diffusive and radiative extinction behavior.",
    evidence:
      "The experiment recorded droplet size and visible flame extinction measurements under controlled atmospheric conditions.",
    interpretation:
      "The extinction response is influenced by the balance between chemical heat release and the transport of heat and oxidizer.",
    application:
      "These measurements provide useful reference data for validating liquid-fuel combustion models under reduced-gravity conditions.",
    limitation:
      "The observed behavior is specific to the tested fuels, droplet sizes, pressures, and atmospheric compositions.",
    priority: "High",
  },
  {
    id: 5,
    title: "Airflow direction changes flame-spread behavior",
    category: "Airflow & spread",
    experiments: ["BASS-II", "SAFFIRE-I"],
    metric: "20 cm/s",
    metricLabel: "Reported SAFFIRE-I co-flow condition",
    finding:
      "Forced airflow direction is an important experimental variable in microgravity combustion. SAFFIRE-I investigated a large fabric sample under controlled co-flow ventilation, while BASS-II examined flow-dependent solid-fuel burning.",
    evidence:
      "A NASA presentation reports approximately 1.8 mm/s flame spread for the SAFFIRE-I cotton/fiberglass sample under a reported 20 cm/s co-flow condition.",
    interpretation:
      "Without normal buoyancy-driven flame movement, imposed ventilation can strongly influence flame orientation and transport of heat and reactants.",
    application:
      "Ventilation layouts, detector placement, and fire models should account for local airflow direction and speed.",
    limitation:
      "The reported spread value belongs to a particular sample and test configuration. It does not establish a universal ventilation rule.",
    priority: "High",
  },
  {
    id: 6,
    title: "Low-flow extinction and high-flow blowoff are different limits",
    category: "Extinction & suppression",
    experiments: ["BASS-II"],
    finding:
      "BASS-II research describes different flame-extinction regimes associated with low-flow and high-flow conditions.",
    evidence:
      "The reported flow-dependent behavior includes radiative quenching at sufficiently low flow and aerodynamic blowoff at sufficiently high flow in particular opposed-flow configurations.",
    interpretation:
      "A flame may cease to be sustained for different physical reasons depending on the airflow regime.",
    application:
      "Combustion models and suppression studies should distinguish heat-loss-driven extinction from aerodynamic flame blowoff.",
    limitation:
      "Reported velocity thresholds depend on fuel geometry, oxygen concentration, and flow configuration. They should not be treated as universal thresholds.",
    priority: "High",
  },
  {
    id: 7,
    title: "Fuel geometry influences flame spread",
    category: "Airflow & spread",
    experiments: ["BASS-II"],
    finding:
      "BASS-II investigated how solid-fuel dimensions and geometry affect flame spread in microgravity.",
    evidence:
      "Reported PMMA rod comparisons show differences in flame-spread behavior across rod diameters, including slower spread for larger diameters under some conditions.",
    interpretation:
      "Fuel dimensions influence heat transfer, the available burning surface, and the interaction between the flame and surrounding flow.",
    application:
      "Spacecraft material testing should include representative thicknesses, shapes, and exposed geometries rather than testing only one specimen size.",
    limitation:
      "The direction and magnitude of geometry effects depend on the specific material and experimental conditions.",
    priority: "Medium",
  },
  {
    id: 8,
    title: "Oxygen consumption can help estimate combustion heat release",
    category: "Detection & monitoring",
    experiments: ["BASS-II"],
    metric: "13.1 kJ/g",
    metricLabel: "Reported heat equivalent per gram of O₂ consumed",
    finding:
      "BASS-II used oxygen consumption measurements to estimate heat release during controlled solid-fuel combustion tests.",
    evidence:
      "The reported analysis uses an oxygen-consumption heat equivalent of approximately 13.1 kJ per gram of oxygen consumed.",
    interpretation:
      "Changes in oxygen concentration can provide information about combustion activity when combined with suitable experimental measurements.",
    application:
      "Oxygen-consumption methods can support experimental heat-release estimates and help validate combustion monitoring models.",
    limitation:
      "A controlled glovebox measurement is not equivalent to directly estimating fire power from a single oxygen sensor in a mixed, ventilated spacecraft cabin.",
    priority: "High",
  },
  {
    id: 9,
    title: "Combustion products depend on fuel and geometry",
    category: "Detection & monitoring",
    experiments: ["BASS-II"],
    finding:
      "BASS-II gas measurements included oxygen, carbon dioxide, and carbon monoxide before and after combustion tests.",
    evidence:
      "Reported analysis found that oxygen and carbon dioxide trends could be related to combustion, while CO-to-CO₂ relationships varied across some experimental geometries.",
    interpretation:
      "Combustion completeness cannot be reliably characterized using a single gas measurement in isolation.",
    application:
      "Fire-monitoring research should evaluate multiple gas signals and account for fuel type, geometry, and sensor limitations.",
    limitation:
      "The glovebox results do not establish a ready-to-deploy detection algorithm for the ISS or other spacecraft.",
    priority: "High",
  },
  {
    id: 10,
    title: "Large-scale microgravity fires require dedicated experiments",
    category: "Spacecraft safety",
    experiments: ["SAFFIRE-I"],
    metric: "≈1,200 W",
    metricLabel: "Reported average flame power estimate",
    finding:
      "SAFFIRE-I investigated a substantially larger burning fabric sample than typical small-scale combustion experiments.",
    evidence:
      "The research synthesis reports an estimated average flame power of approximately 1,200 ± 300 W for a particular SAFFIRE-I test.",
    interpretation:
      "Small-scale droplet and rod experiments cannot reproduce every feature of a large, extended fabric fire.",
    application:
      "Large-scale experiments are important for evaluating fire growth, ventilation interaction, and the performance of spacecraft fire-safety models.",
    limitation:
      "The reported power estimate belongs to one experimental configuration. It should not be treated as a representative value for all spacecraft fires.",
    priority: "High",
  },
  {
    id: 11,
    title: "Large-scale fire behavior is influenced by fuel and ventilation",
    category: "Flame behavior",
    experiments: ["SAFFIRE-I"],
    finding:
      "SAFFIRE-I studied flame growth and spread over a large cotton/fiberglass-based sample in a controlled enclosure with forced airflow.",
    evidence:
      "The experiment used a sample approximately 40.6 × 94 cm and a reported co-flow condition of approximately 20 cm/s.",
    interpretation:
      "At larger scales, fuel dimensions, ventilation, enclosure geometry, and heat transfer all influence observed fire behavior.",
    application:
      "Large-scale fire models should be validated against experiments that represent realistic fuel dimensions and airflow conditions.",
    limitation:
      "One fabric and one enclosure configuration cannot represent the full range of materials and geometries inside a spacecraft.",
    priority: "High",
  },
  {
    id: 12,
    title: "Material flammability is not determined by oxygen alone",
    category: "Oxygen & atmosphere",
    experiments: ["BASS-II", "SAFFIRE-I"],
    finding:
      "Solid-fuel combustion behavior varies with material properties, geometry, and imposed airflow as well as oxygen concentration.",
    evidence:
      "BASS-II examined multiple solid materials and specimen geometries, while SAFFIRE-I investigated large-scale fabric combustion.",
    interpretation:
      "A single oxygen threshold cannot fully describe the flammability behavior of different spacecraft materials.",
    application:
      "Material qualification should consider fuel composition, specimen geometry, ventilation, and the intended operating environment.",
    limitation:
      "Results from different experiments should not be directly compared without accounting for their different test conditions.",
    priority: "High",
  },
];

const conclusions = [
  {
    number: "01",
    title: "Microgravity changes the conditions for sustained combustion",
    text: "FLEX and BASS-II demonstrate that gravity-dependent transport affects droplet and solid-fuel combustion. Normal-gravity flammability results therefore need careful interpretation when applied to microgravity environments.",
    experiments: ["FLEX", "BASS-II"],
  },
  {
    number: "02",
    title: "Forced convection becomes a major experimental variable",
    text: "BASS-II and SAFFIRE-I show why airflow direction and velocity must be considered when studying flame orientation, spread, and extinction in microgravity.",
    experiments: ["BASS-II", "SAFFIRE-I"],
  },
  {
    number: "03",
    title: "Combustion behavior changes across experimental scales",
    text: "Droplet experiments reveal fundamental combustion mechanisms, solid-fuel tests investigate material behavior, and large-scale experiments reveal additional effects of fuel dimensions and enclosure conditions.",
    experiments: ["FLEX", "BASS-II", "SAFFIRE-I"],
  },
  {
    number: "04",
    title: "Fire detection benefits from multiple measurement methods",
    text: "Optical observations, gas measurements, and thermal measurements provide different information. Combining them can provide a more complete picture than relying on one sensor type.",
    experiments: ["FLEX", "BASS-II", "SAFFIRE-I"],
  },
  {
    number: "05",
    title: "Atmospheric composition and pressure need combined investigation",
    text: "FLEX investigated pressure and gas-composition effects on liquid droplets. Extending comparable controlled studies to representative solid materials remains important for understanding broader spacecraft flammability.",
    experiments: ["FLEX", "BASS-II"],
  },
  {
    number: "06",
    title: "Experimental findings must remain tied to their test conditions",
    text: "Fuel type, specimen size, pressure, oxygen concentration, and airflow can all differ between experiments. Cross-experiment conclusions should identify these differences rather than treating all results as directly interchangeable.",
    experiments: ["FLEX", "BASS-II", "SAFFIRE-I"],
  },
];

const applications = [
  {
    icon: Shield,
    title: "Material qualification",
    description:
      "Use microgravity-relevant evidence when evaluating material flammability. Include representative materials, dimensions, oxygen levels, and ventilation conditions.",
    source: "BASS-II · SAFFIRE-I",
  },
  {
    icon: Wind,
    title: "Ventilation planning",
    description:
      "Consider airflow direction, local velocity, and stagnant regions when developing fire-behavior models and evaluating spacecraft ventilation layouts.",
    source: "BASS-II · SAFFIRE-I",
  },
  {
    icon: Eye,
    title: "Multi-sensor fire detection",
    description:
      "Investigate combinations of optical monitoring, gas analysis, and thermal measurements to identify combustion behavior that one sensor may miss.",
    source: "FLEX · BASS-II · SAFFIRE-I",
  },
  {
    icon: Atom,
    title: "Atmosphere and suppression research",
    description:
      "Use inert-gas and oxygen-limit experiments to investigate how atmospheric composition affects combustion. Validate any suppression strategy at relevant scales.",
    source: "FLEX",
  },
  {
    icon: Gauge,
    title: "Combustion model validation",
    description:
      "Use droplet, solid-fuel, and large-scale experimental observations to test different parts of microgravity combustion models.",
    source: "FLEX · BASS-II · SAFFIRE-I",
  },
  {
    icon: Microscope,
    title: "Large-scale fire assessment",
    description:
      "Include large-fuel experiments when evaluating fire growth and enclosure effects that cannot be captured by small laboratory specimens alone.",
    source: "SAFFIRE-I",
  },
];

const applicationAccents = [
  {
    icon: "text-cyan-200",
    iconBox: "border-cyan-300/20 bg-cyan-400/10",
    glow: "from-cyan-400/[0.12]",
    line: "via-cyan-300/70",
    tag: "border-cyan-300/15 bg-cyan-300/[0.06] text-cyan-100/80",
  },
  {
    icon: "text-sky-200",
    iconBox: "border-sky-300/20 bg-sky-400/10",
    glow: "from-sky-400/[0.12]",
    line: "via-sky-300/70",
    tag: "border-sky-300/15 bg-sky-300/[0.06] text-sky-100/80",
  },
  {
    icon: "text-violet-200",
    iconBox: "border-violet-300/20 bg-violet-400/10",
    glow: "from-violet-400/[0.12]",
    line: "via-violet-300/70",
    tag: "border-violet-300/15 bg-violet-300/[0.06] text-violet-100/80",
  },
  {
    icon: "text-amber-200",
    iconBox: "border-amber-300/20 bg-amber-400/10",
    glow: "from-amber-400/[0.12]",
    line: "via-amber-300/70",
    tag: "border-amber-300/15 bg-amber-300/[0.06] text-amber-100/80",
  },
  {
    icon: "text-emerald-200",
    iconBox: "border-emerald-300/20 bg-emerald-400/10",
    glow: "from-emerald-400/[0.12]",
    line: "via-emerald-300/70",
    tag: "border-emerald-300/15 bg-emerald-300/[0.06] text-emerald-100/80",
  },
  {
    icon: "text-rose-200",
    iconBox: "border-rose-300/20 bg-rose-400/10",
    glow: "from-rose-400/[0.12]",
    line: "via-rose-300/70",
    tag: "border-rose-300/15 bg-rose-300/[0.06] text-rose-100/80",
  },
];

const researchGaps = [
  {
    title: "Multi-material fire interactions",
    description:
      "How do different spacecraft materials interact when flames spread between adjacent materials or composite structures?",
  },
  {
    title: "Low-pressure and mixed-gas environments",
    description:
      "How do pressure, oxygen concentration, carbon dioxide, and helium interact across representative solid fuels?",
  },
  {
    title: "Flow-field complexity",
    description:
      "How do turbulence, recirculation, and non-uniform ventilation affect flame spread and extinction?",
  },
  {
    title: "Scale-up validation",
    description:
      "How accurately can models developed from droplets and small solid specimens reproduce large-scale experimental behavior?",
  },
  {
    title: "Early detection of non-visible combustion",
    description:
      "Which combinations of optical, thermal, and gas measurements can identify combustion after visible flame disappearance?",
  },
  {
    title: "Material diversity",
    description:
      "How do polymers, fabrics, composites, coatings, and real spacecraft assemblies behave under comparable microgravity conditions?",
  },
];

const categories: Array<"All" | Category> = [
  "All",
  "Flame behavior",
  "Oxygen & atmosphere",
  "Airflow & spread",
  "Extinction & suppression",
  "Detection & monitoring",
  "Spacecraft safety",
];

const experiments: Array<"All" | Experiment> = [
  "All",
  "FLEX",
  "BASS-II",
  "SAFFIRE-I",
  "Cross-experiment",
];

function subscribeToLocation(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function getLocationSearch() {
  return window.location.search;
}

function getServerLocationSearch() {
  return "";
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-zinc-300">
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-violet-400">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-zinc-400">{description}</p>
    </div>
  );
}

function InsightCard({
  insight,
  onSelect,
}: {
  insight: Insight;
  onSelect: (insight: Insight) => void;
}) {
  return (
    <button
      onClick={() => onSelect(insight)}
      aria-label={`Explore finding: ${insight.title}`}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#15151f] via-[#101018] to-[#0d0d14] p-5 text-left shadow-[0_12px_36px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-[0_18px_44px_rgba(110,75,180,0.12)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-violet-500/[0.06] blur-3xl transition group-hover:bg-violet-400/[0.12]"
      />

      <div className="relative mb-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-200/80">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          {insight.category}
        </span>
        <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-1 font-mono text-[9px] text-zinc-500">
          {String(insight.id).padStart(2, "0")}
        </span>
      </div>

      {insight.metric && (
        <div className="relative mb-4 flex items-center gap-3 rounded-xl border border-violet-300/[0.10] bg-violet-400/[0.05] px-3.5 py-3">
          <p className="shrink-0 text-2xl font-semibold tracking-tight text-violet-200">
            {insight.metric}
          </p>
          <p className="border-l border-violet-200/15 pl-3 text-[10px] leading-4 text-zinc-400">
            {insight.metricLabel}
          </p>
        </div>
      )}

      <h3 className="relative text-[15px] font-semibold leading-6 text-white transition group-hover:text-violet-100">
        {insight.title}
      </h3>
      <p className="relative mt-2.5 line-clamp-3 flex-1 text-xs leading-[1.65] text-zinc-400">
        {insight.finding}
      </p>

      <div className="relative mt-5 flex flex-wrap gap-1.5">
        {insight.experiments.map((experiment) => (
          <span
            key={experiment}
            className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[9px] font-semibold tracking-wide text-zinc-400"
          >
            {experiment}
          </span>
        ))}
      </div>

      <div className="relative mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3.5">
        <span className="text-[10px] font-semibold tracking-wide text-violet-300">
          Read finding
        </span>
        <ChevronRight
          size={14}
          className="text-zinc-500 transition group-hover:translate-x-1 group-hover:text-violet-300"
        />
      </div>
    </button>
  );
}

export default function InsightsPage() {
  const locationSearch = useSyncExternalStore(
    subscribeToLocation,
    getLocationSearch,
    getServerLocationSearch
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [experiment, setExperiment] = useState("All");
  const [selected, setSelected] = useState<Insight | null>(null);
  const [activeTabOverride, setActiveTabOverride] = useState<
    "insights" | "conclusions" | "applications" | "gaps" | null
  >(null);
  const params = new URLSearchParams(locationSearch);
  const urlFinding = insights.find(
    (item) => item.id === Number(params.get("finding"))
  );
  const activeInsight = selected ?? urlFinding;
  const requestedTab = params.get("tab");
  const activeTab =
    activeTabOverride ??
    (requestedTab === "conclusions" ||
    requestedTab === "applications" ||
    requestedTab === "gaps"
      ? requestedTab
      : "insights");

  useEffect(() => {
    if (activeTab === "conclusions") {
      document
        .getElementById("research-conclusions")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeTab]);

  const filteredInsights = useMemo(() => {
    const query = search.toLowerCase().trim();

    return insights.filter((item) => {
      const matchesCategory =
        category === "All" || item.category === category;
      const matchesExperiment =
        experiment === "All" ||
        item.experiments.includes(experiment as Experiment);
      const matchesSearch =
        !query ||
        [
          item.title,
          item.finding,
          item.evidence,
          item.interpretation,
          item.application,
          item.category,
          ...item.experiments,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesExperiment && matchesSearch;
    });
  }, [search, category, experiment]);

  const closeInsight = () => {
    setSelected(null);
    if (!params.has("finding")) return;

    params.delete("finding");
    const query = params.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
    );
    window.dispatchEvent(new Event("popstate"));
  };

  return (
    <main className="min-h-screen bg-[#09090f] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-violet-700/[0.10] blur-[130px]" />
        <div className="absolute right-0 top-[700px] h-[300px] w-[400px] rounded-full bg-indigo-700/[0.06] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "linear-gradient(to bottom, black, transparent 55%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 lg:px-10">
        {/* Breadcrumb */}
        <div className="mb-12 flex items-center gap-2 text-[11px] text-zinc-500">
          <span>SideroSpace</span>
          <ChevronRight size={12} />
          <span className="text-violet-300">Research Insights</span>
        </div>

        {/* Hero */}
        <section className="relative mb-16 grid grid-cols-1 gap-8 overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-br from-[#171426] via-[#11111b] to-[#0d1018] p-7 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-14">
          <div className="absolute right-[-50px] top-[-80px] h-[350px] w-[350px] rounded-full border border-violet-400/10" />
          <div className="absolute bottom-[-100px] right-[15%] h-[220px] w-[220px] rounded-full bg-violet-600/[0.10] blur-[80px]" />

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.08] px-3 py-1.5">
              <Sparkles size={12} className="text-violet-300" />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-200">
                Research Intelligence
              </span>
            </div>

            <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              Understanding
              <br />
              <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                fire in freefall.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Explore scientific findings, experimental patterns, and
              practical implications from NASA&apos;s microgravity combustion
              research. Connecting droplet combustion, solid-fuel behavior,
              and large-scale fire experiments.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  document
                    .getElementById("research-insights")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-xs font-semibold text-white transition hover:bg-violet-400"
              >
                Explore insights
                <ArrowDownRight size={15} />
              </button>
              <button
                onClick={() => setActiveTabOverride("conclusions")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08]"
              >
                View conclusions
                <BookOpen size={14} />
              </button>
            </div>
          </div>

          <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-white/[0.12] bg-[#09090f] sm:min-h-[360px] lg:min-h-[420px]">
            <Image
              src="/images/F2.webp"
              alt="Microgravity fire research imagery"
              fill
              preload
              sizes="(max-width: 639px) calc(100vw - 100px), (max-width: 1023px) calc(100vw - 146px), (max-width: 1279px) calc((100vw - 240px) / 2), 520px"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#09090f]/35 via-transparent to-violet-950/10"
            />
          </div>

          <div className="relative col-span-full grid grid-cols-3 gap-3 border-t border-white/[0.08] pt-7 sm:gap-8">
            {[
              { value: "03", label: "Experiments" },
              { value: "12", label: "Research insights" },
              { value: "06", label: "Cross-study conclusions" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] text-zinc-500 sm:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Experiment overview */}
        <section className="mb-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-violet-400">
                Research foundation
              </p>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Three experiments. One research direction.
              </h2>
            </div>
            <span className="hidden text-[10px] text-zinc-500 sm:block">
              NASA microgravity combustion research
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                name: "FLEX",
                subtitle: "Flame Extinguishment Experiment",
                description:
                  "Liquid-droplet combustion, extinction limits, pressure, and inert-gas effects.",
                icon: Flame,
                number: "01",
                color: "text-orange-300",
              },
              {
                name: "BASS-II",
                subtitle: "Burning and Suppression of Solids",
                description:
                  "Solid-material flammability, flame spread, oxygen limits, and forced airflow.",
                icon: Activity,
                number: "02",
                color: "text-sky-300",
              },
              {
                name: "SAFFIRE-I",
                subtitle: "Spacecraft Fire Experiment",
                description:
                  "Large-scale fabric combustion, flame growth, and ventilation in microgravity.",
                icon: Layers3,
                number: "03",
                color: "text-violet-300",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-white/[0.08] bg-[#101018] p-5 transition hover:border-violet-400/30"
              >
                <div className="mb-6 flex items-center justify-between">
                  <item.icon size={22} className={item.color} />
                  <span className="text-[10px] text-zinc-600">
                    EXPERIMENT {item.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="mt-1 text-[10px] text-violet-300">
                  {item.subtitle}
                </p>
                <p className="mt-4 text-xs leading-6 text-zinc-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation tabs */}
        <section className="mb-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-400">
                Explore the research
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Choose a research view
              </h2>
            </div>
            <span className="hidden text-[10px] text-zinc-500 sm:block">
              Four perspectives on microgravity combustion
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                id: "insights",
                label: "Research insights",
                description: "Explore findings from individual experiments.",
                icon: Lightbulb,
                accent: "amber",
                image: "/images/I1.webp",
              },
              {
                id: "conclusions",
                label: "Conclusions",
                description: "See what the evidence suggests across studies.",
                icon: Compass,
                accent: "violet",
                image: "/images/I2.webp",
              },
              {
                id: "applications",
                label: "Practical applications",
                description: "Connect research to spacecraft fire safety.",
                icon: Shield,
                accent: "cyan",
                image: "/images/I3.webp",
              },
              {
                id: "gaps",
                label: "Research gaps",
                description: "Explore open questions and areas for study.",
                icon: Microscope,
                accent: "rose",
                image: "/images/i4.webp",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTabOverride(tab.id as typeof activeTab)
                }
                aria-pressed={activeTab === tab.id}
                className={`group relative flex min-h-28 items-center gap-4 overflow-hidden rounded-2xl border p-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70 sm:min-h-32 sm:p-5 ${
                  activeTab === tab.id
                    ? "border-violet-400/40 bg-gradient-to-br from-violet-500/[0.16] to-indigo-500/[0.07] text-white shadow-[0_12px_36px_rgba(124,58,237,0.12)]"
                    : "border-white/[0.08] bg-[#101018]/90 text-zinc-300 hover:border-white/[0.16] hover:bg-[#14141e]"
                }`}
              >
                <span className="pointer-events-none absolute inset-y-0 right-0 z-0 w-1/2 opacity-40 transition-opacity duration-200 group-hover:opacity-60">
                  <Image
                    src={tab.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 140px, (min-width: 640px) 25vw, 50vw"
                    className="object-cover object-center"
                  />
                </span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 z-0 bg-gradient-to-r ${
                    activeTab === tab.id
                      ? "from-[#171322] via-[#171322]/85 to-[#171322]/30"
                      : "from-[#101018] via-[#101018]/85 to-[#101018]/30"
                  }`}
                />
                <span
                  className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition sm:h-14 sm:w-14 ${
                    tab.accent === "amber"
                      ? "border-amber-300/20 bg-amber-400/10 text-amber-200"
                      : tab.accent === "violet"
                        ? "border-violet-300/20 bg-violet-400/10 text-violet-200"
                        : tab.accent === "cyan"
                          ? "border-cyan-300/20 bg-cyan-400/10 text-cyan-200"
                          : "border-rose-300/20 bg-rose-400/10 text-rose-200"
                  }`}
                >
                  <tab.icon size={25} strokeWidth={1.7} />
                </span>
                <span className="relative z-10 min-w-0">
                  <span className="block text-xs font-semibold leading-5 text-white sm:text-sm">
                    {tab.label}
                  </span>
                  <span className="mt-1 block text-[10px] leading-4 text-zinc-500 sm:text-[11px]">
                    {tab.description}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-4 bottom-0 z-10 h-px transition ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-transparent via-violet-300/70 to-transparent"
                      : "bg-transparent"
                  }`}
                />
              </button>
            ))}
          </div>
        </section>

        {/* Insights */}
        {activeTab === "insights" && (
          <section id="research-insights">
            <SectionHeading
              eyebrow="Experimental findings"
              title="Research insights"
              description="Explore findings from individual experiments, their scientific interpretation, and what they could mean for spacecraft fire-safety research."
            />

            <div className="mb-6 space-y-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search findings, materials, experiments..."
                  className="w-full rounded-xl border border-white/10 bg-[#101018] py-3.5 pl-11 pr-4 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <SlidersHorizontal size={14} className="mr-1 text-zinc-500" />
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`rounded-full border px-3 py-1.5 text-[10px] transition ${
                      category === item
                        ? "border-violet-400/40 bg-violet-500/15 text-violet-200"
                        : "border-white/[0.08] text-zinc-500 hover:border-white/20 hover:text-zinc-200"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="self-center text-[10px] text-zinc-600">
                  Experiment:
                </span>
                {experiments.map((item) => (
                  <button
                    key={item}
                    onClick={() => setExperiment(item)}
                    className={`rounded-lg px-3 py-1.5 text-[10px] transition ${
                      experiment === item
                        ? "bg-white/10 text-white"
                        : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-300"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs text-zinc-400">
                Showing{" "}
                <span className="font-semibold text-white">
                  {filteredInsights.length}
                </span>{" "}
                research findings
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setExperiment("All");
                }}
                className="text-[10px] text-violet-300 hover:text-violet-200"
              >
                Reset filters
              </button>
            </div>

            {filteredInsights.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredInsights.map((insight) => (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    onSelect={setSelected}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-[#101018] py-16 text-center">
                <Search className="mx-auto mb-3 text-zinc-600" size={24} />
                <p className="text-sm font-medium text-zinc-300">
                  No matching findings
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  Try another search term or reset the filters.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Conclusions */}
        {activeTab === "conclusions" && (
          <section id="research-conclusions" className="scroll-mt-8">
            <SectionHeading
              eyebrow="Across the experiments"
              title="What the research tells us"
              description="These conclusions connect the experimental themes across FLEX, BASS-II, and SAFFIRE-I. They are research-level interpretations, not universal safety rules."
            />

            <div className="space-y-3">
              {conclusions.map((item) => (
                <div
                  key={item.number}
                  className="group grid gap-4 rounded-2xl border border-white/[0.08] bg-[#101018] p-5 transition hover:border-violet-400/30 sm:grid-cols-[60px_1fr]"
                >
                  <div className="text-xl font-light text-violet-400/70">
                    {item.number}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-3xl text-xs leading-7 text-zinc-400">
                      {item.text}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.experiments.map((name) => (
                        <Tag key={name}>{name}</Tag>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Applications */}
        {activeTab === "applications" && (
          <section>
            <SectionHeading
              eyebrow="From research to engineering"
              title="Practical applications"
              description="Potential ways these experimental findings can inform spacecraft fire-safety research, engineering, and future testing."
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {applications.map((item, index) => {
                const accent = applicationAccents[index % applicationAccents.length];
                const Icon = item.icon;

                return (
                <div
                  key={item.title}
                  className="group relative flex min-h-[280px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#15151f] via-[#101018] to-[#0d0d14] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:shadow-[0_18px_44px_rgba(0,0,0,0.24)] sm:p-6"
                >
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-gradient-to-br ${accent.glow} to-transparent blur-2xl transition-opacity group-hover:opacity-150`}
                  />
                  <div className="relative flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${accent.iconBox} transition-transform duration-300 group-hover:scale-105`}>
                      <Icon size={22} strokeWidth={1.7} className={accent.icon} />
                    </div>
                    <span className="font-mono text-[10px] tracking-[0.18em] text-zinc-600">
                      PATHWAY {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="relative mt-6 text-base font-semibold tracking-tight text-white transition-colors group-hover:text-violet-100">
                    {item.title}
                  </h3>
                  <p className="relative mt-2.5 line-clamp-3 flex-1 text-xs leading-6 text-zinc-400">
                    {item.description}
                  </p>

                  <div className="relative mt-5 border-t border-white/[0.07] pt-4">
                    <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                      Informed by
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.source.split(" · ").map((source) => (
                        <span
                          key={source}
                          className={`rounded-md border px-2 py-1 text-[9px] font-semibold tracking-wide ${accent.tag}`}
                        >
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            <div className="mt-6 flex gap-3 rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-5">
              <CircleAlert
                size={18}
                className="mt-0.5 shrink-0 text-amber-300"
              />
              <div>
                <p className="text-xs font-semibold text-amber-200">
                  Engineering interpretation
                </p>
                <p className="mt-2 text-xs leading-6 text-zinc-400">
                  These applications are research directions informed by
                  experimental findings. They are not validated spacecraft
                  operating procedures, certified design recommendations, or
                  substitutes for formal safety testing.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Research gaps */}
        {activeTab === "gaps" && (
          <section>
            <SectionHeading
              eyebrow="Future investigations"
              title="What we still need to understand"
              description="The experiments provide important evidence, but several questions remain open before their findings can be generalized across real spacecraft environments."
            />

            <div className="grid gap-4 md:grid-cols-2">
              {researchGaps.map((gap, index) => (
                <div
                  key={gap.title}
                  className="rounded-2xl border border-white/[0.08] bg-[#101018] p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-widest text-violet-400">
                      RESEARCH GAP {String(index + 1).padStart(2, "0")}
                    </span>
                    <Microscope size={16} className="text-zinc-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">
                    {gap.title}
                  </h3>
                  <p className="mt-3 text-xs leading-7 text-zinc-400">
                    {gap.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Methodology and caveats */}
        <section className="mt-20 border-t border-white/[0.08] pt-12">
          <SectionHeading
            eyebrow="Scientific integrity"
            title="How to read these findings"
            description="Experimental results are meaningful only when their context, limitations, and supporting evidence remain visible."
          />

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Database,
                title: "Evidence first",
                text: "Findings are associated with the experiment that investigated them.",
              },
              {
                icon: BookOpen,
                title: "Context matters",
                text: "Numbers and observations belong to specific materials and test conditions.",
              },
              {
                icon: CircleAlert,
                title: "Limits are explicit",
                text: "Potential applications are separated from experimentally demonstrated results.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5"
              >
                <item.icon size={18} className="mb-4 text-violet-300" />
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs leading-6 text-zinc-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 flex flex-col justify-between gap-4 border-t border-white/[0.08] pt-7 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">
              SideroSpace
            </p>
            <p className="mt-1 text-[10px] text-zinc-600">
              Microgravity combustion research intelligence
            </p>
          </div>
          <p className="text-[10px] leading-5 text-zinc-600">
            Research synthesis for educational and scientific exploration.
            <br />
            Experimental context should be checked against original NASA sources.
          </p>
        </footer>
      </div>

      {/* Insight detail modal */}
      {activeInsight && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeInsight();
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#11111a] shadow-2xl shadow-black/50">
            <div className="sticky top-0 flex items-center justify-between border-b border-white/[0.08] bg-[#11111a]/95 p-5 backdrop-blur">
              <div className="flex flex-wrap gap-2">
                <Tag>{activeInsight.category}</Tag>
                <Tag>INSIGHT {String(activeInsight.id).padStart(2, "0")}</Tag>
              </div>
              <button
                onClick={closeInsight}
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/10 hover:text-white"
                aria-label="Close insight"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white">
                {activeInsight.title}
              </h2>

              {activeInsight.metric && (
                <div className="mt-5 rounded-xl border border-violet-400/15 bg-violet-500/[0.06] p-4">
                  <p className="text-3xl font-semibold text-violet-300">
                    {activeInsight.metric}
                  </p>
                  <p className="mt-1 text-[10px] text-zinc-500">
                    {activeInsight.metricLabel}
                  </p>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {activeInsight.experiments.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>

              <div className="mt-8 space-y-6">
                {[
                  {
                    title: "Scientific finding",
                    text: activeInsight.finding,
                    icon: Activity,
                  },
                  {
                    title: "Experimental evidence",
                    text: activeInsight.evidence,
                    icon: Database,
                  },
                  {
                    title: "Scientific interpretation",
                    text: activeInsight.interpretation,
                    icon: Atom,
                  },
                  {
                    title: "Practical application",
                    text: activeInsight.application,
                    icon: Lightbulb,
                  },
                  {
                    title: "Limitations",
                    text: activeInsight.limitation,
                    icon: CircleAlert,
                  },
                ].map((section) => (
                  <div key={section.title}>
                    <div className="mb-2 flex items-center gap-2">
                      <section.icon
                        size={14}
                        className="text-violet-300"
                      />
                      <h3 className="text-xs font-semibold text-white">
                        {section.title}
                      </h3>
                    </div>
                    <p className="pl-[22px] text-xs leading-7 text-zinc-400">
                      {section.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-white/[0.08] pt-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Supporting experiments
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeInsight.experiments.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
