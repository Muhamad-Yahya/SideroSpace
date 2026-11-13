import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Atom,
  BookOpen,
  Check,
  CircleAlert,
  CircleHelp,
  Database,
  Eye,
  FileSearch,
  Flame,
  FlaskConical,
  GitCompareArrows,
  Layers3,
  MessageCircleQuestion,
  Microscope,
  ShieldCheck,
  Waves,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { askQuestions } from "@/lib/ask-knowledge";
import type { DashboardAnalytics } from "@/lib/dashboard-analytics";
import ResearchAnalytics from "@/components/ResearchAnalytics";

const experimentQuestions = [
  "flex-04",
  "bass-02",
  "saffire-01",
].map((id) => {
  const question = askQuestions.find((item) => item.id === id);
  if (!question) throw new Error(`Missing curated research question: ${id}`);
  return question;
});

const featuredFindings = [
  {
    title: "Microgravity changes combustion transport",
    summary:
      "FLEX droplet and BASS-II solid-fuel research show why gravity-dependent transport matters; each result remains specific to its test setup.",
    experiments: ["FLEX", "BASS-II"],
    href: "/insights?tab=conclusions",
    linkLabel: "Read cross-study conclusion",
    icon: Atom,
  },
  {
    title: "Airflow is a key experimental variable",
    summary:
      "BASS-II and SAFFIRE-I investigated forced flow alongside flame behavior, spread, or extinction in distinct configurations.",
    experiments: ["BASS-II", "SAFFIRE-I"],
    href: "/insights?finding=5",
    linkLabel: "Read full finding",
    icon: Wind,
  },
  {
    title: "Visible extinction may not end all combustion",
    summary:
      "FLEX reported low-temperature combustion behavior after visible flame disappearance in certain larger heptane droplet tests.",
    experiments: ["FLEX"],
    href: "/insights?finding=2",
    linkLabel: "Read full finding",
    icon: Flame,
  },
  {
    title: "Oxygen alone does not determine flammability",
    summary:
      "Material, geometry, and airflow also matter; BASS-II and SAFFIRE-I studied different solid-fuel scales and conditions.",
    experiments: ["BASS-II", "SAFFIRE-I"],
    href: "/insights?finding=12",
    linkLabel: "Read full finding",
    icon: Layers3,
  },
];

const dashboardConclusions = [
  {
    title: "Transport changes in microgravity",
    description:
      "Gravity-dependent transport influences the conditions observed in droplet and solid-fuel experiments.",
    experiments: "FLEX · BASS-II",
  },
  {
    title: "Forced convection matters",
    description:
      "Airflow direction and velocity are important variables for flame behavior in these studies.",
    experiments: "BASS-II · SAFFIRE-I",
  },
  {
    title: "Scale changes the research question",
    description:
      "Small droplets or rods cannot represent every feature of large-scale fabric fires.",
    experiments: "FLEX · BASS-II · SAFFIRE-I",
  },
  {
    title: "Multiple signals provide context",
    description:
      "Optical, gas, and thermal observations can reveal different aspects of combustion.",
    experiments: "FLEX · BASS-II · SAFFIRE-I",
  },
];

const researchApplications = [
  {
    title: "Material qualification research",
    description:
      "Study representative materials, dimensions, oxygen levels, and ventilation conditions.",
    experiments: "BASS-II · SAFFIRE-I",
    icon: ShieldCheck,
  },
  {
    title: "Ventilation system research",
    description:
      "Investigate how local airflow direction and velocity relate to flame behavior.",
    experiments: "BASS-II · SAFFIRE-I",
    icon: Wind,
  },
  {
    title: "Multi-sensor fire detection",
    description:
      "Evaluate optical, thermal, and gas measurements together in experimental settings.",
    experiments: "FLEX · BASS-II",
    icon: Eye,
  },
  {
    title: "Fire suppression research",
    description:
      "Use oxygen-limit and inert-gas experiments to frame further suppression studies.",
    experiments: "FLEX",
    icon: Flame,
  },
];

function ExperimentVisual({
  values,
  image,
}: {
  values?: number[];
  image?: boolean;
}) {
  if (image) {
    return (
      <div className="experiment-card-image">
        <Image
          src="/data/saffire/f1c1/F1C1-1465936971405.jpeg"
          alt="First available frame from the SAFFIRE-I F1C1 pre-test sequence"
          width={1280}
          height={920}
          sizes="(max-width: 760px) 100vw, 33vw"
        />
        <span>F1C1 · PRE-TEST SEQUENCE</span>
      </div>
    );
  }

  const max = Math.max(...(values ?? [0]), 1);
  return (
    <div
      className="experiment-card-visual"
      aria-label="Miniature data distribution derived from the integrated dataset"
      role="img"
    >
      <div className="experiment-visual-topline">
        <span>{values?.length ? "RECORDED DATA" : "DATA VIEW"}</span>
        <span>PSI TABLE</span>
      </div>
      <div className="experiment-visual-bars" aria-hidden="true">
        {(values ?? []).map((value, index) => (
          <span
            key={`${index}-${value}`}
            style={{ height: `${Math.max(7, (value / max) * 100)}%` }}
          />
        ))}
      </div>
      <div className="experiment-visual-axis">
        <span>LOW</span>
        <span>HIGH</span>
      </div>
    </div>
  );
}

function ExperimentCard({
  code,
  name,
  title,
  description,
  href,
  metric,
  metricLabel,
  source,
  tone,
  icon: Icon,
  values,
  image,
}: {
  code: string;
  name: string;
  title: string;
  description: string;
  href: string;
  metric: string;
  metricLabel: string;
  source: string;
  tone: "violet" | "cyan" | "ember";
  icon: LucideIcon;
  values?: number[];
  image?: boolean;
}) {
  return (
    <article className={`experiment-card experiment-card-${tone}`}>
      <ExperimentVisual values={values} image={image} />
      <div className="experiment-card-content">
        <div className="experiment-card-title-row">
          <div className="experiment-card-icon">
            <Icon size={18} aria-hidden="true" />
          </div>
          <span className="experiment-card-code">{code}</span>
        </div>
        <p className="experiment-card-name">{name}</p>
        <h3>{title}</h3>
        <p className="experiment-card-description">{description}</p>
        <div className="experiment-card-metric">
          <strong>{metric}</strong>
          <span>{metricLabel}</span>
        </div>
        <div className="experiment-card-footer">
          <span>{source}</span>
          <Link href={href} aria-label={`Explore ${name}`}>
            Explore experiment <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function MissionIntelligenceDashboard({
  analytics,
}: {
  analytics: DashboardAnalytics;
}) {
  const topFuel = analytics.flex.fuels
    .map(({ label }) => label)
    .join(" and ");
  const outcomeSummary = analytics.flex.outcomes
    .map(({ label, count }) => `${label} (${count})`)
    .join(", ");

  return (
    <main className="research-dashboard">
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <h1>
            Understanding fire
            <br />
            <span>beyond Earth.</span>
          </h1>
          <p className="dashboard-hero-description">
            Explore NASA&apos;s microgravity combustion research, compare
            experimental conditions, and trace evidence relevant to safer human
            space exploration.
          </p>
          <div className="dashboard-hero-actions">
            <a className="dashboard-primary-action" href="#experiments">
              Explore experiments <ArrowDownRight size={16} aria-hidden="true" />
            </a>
            <Link className="dashboard-secondary-action" href="/compare">
              Compare research <GitCompareArrows size={16} aria-hidden="true" />
            </Link>
            <Link className="dashboard-secondary-action" href="/ask">
              Ask SideroSpace
              <MessageCircleQuestion size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <figure className="dashboard-hero-visual">
          <Image
            src="/images/Earth22.webp"
            alt="Earth"
            fill
            preload
            sizes="(max-width: 760px) 100vw, 35vw"
            className="dashboard-hero-image"
          />
        </figure>
      </section>

      <section className="dashboard-section" id="experiments">
        <div className="dashboard-section-heading">
          <div>
            <p className="section-kicker">Integrated investigations</p>
            <h2>Explore the Experiments</h2>
          </div>
          <p>
            Three selected investigations connect droplet combustion, solid
            material research, and spacecraft fire-safety imagery.
          </p>
        </div>
        <div className="experiment-card-grid">
          <ExperimentCard
            code="PSI-69 · LIQUID FUEL"
            name="FLEX"
            title="Flame Extinguishment Experiment"
            description="The integrated table records droplet tests across initial oxygen and ambient pressure, with fuel, droplet-size, burning-rate and test-end fields."
            href="/flex"
            metric={analytics.flex.rows.toLocaleString()}
            metricLabel="table rows · FLEX dataset"
            source="Source table: PSI-69"
            tone="violet"
            icon={Waves}
            values={analytics.flex.oxygen.bins.map(({ count }) => count)}
          />
          <ExperimentCard
            code="PSI-25 · SOLID MATERIALS"
            name="BASS-II"
            title="Burning and Suppression of Solids"
            description="The integrated table includes tested-material descriptions and calibrated initial/final gas measurements; source documents describe controlled-flow flame-spread research."
            href="/bass-ii"
            metric={analytics.bass.distinctMaterialLabels.toLocaleString()}
            metricLabel={`normalized material labels · ${analytics.bass.rows.toLocaleString()} table rows`}
            source="Source table: PSI-25"
            tone="cyan"
            icon={FlaskConical}
            values={analytics.bass.materials.map(({ count }) => count)}
          />
          <ExperimentCard
            code="PSI SOURCE IMAGERY · F1C1"
            name="SAFFIRE-I"
            title="Spacecraft Fire Safety Demonstration"
            description="The current local asset set is a pre-test flow-visualization sequence. It is not the sample-burning footage or a measured flame-spread dataset."
            href="/saffire"
            metric={analytics.saffire.frames.toLocaleString()}
            metricLabel="available JPEG frames · F1C1"
            source="Available imagery: F1C1 sequence"
            tone="ember"
            icon={Flame}
            image
          />
        </div>
      </section>

      <section className="dashboard-section insights-featured" id="featured-insights">
        <div className="dashboard-section-heading">
          <div>
            <p className="section-kicker">Evidence-backed research</p>
            <h2>What NASA&apos;s Experiments Reveal</h2>
          </div>
          <p>
            Concise interpretations linked to the detailed findings. Results
            remain tied to their specific fuels, geometries, and test conditions.
          </p>
        </div>
        <div className="featured-insight-grid">
          {featuredFindings.map(({ title, summary, experiments, href, linkLabel, icon: Icon }) => (
            <Link
              className="featured-insight-card"
              href={href}
              key={title}
            >
              <span className="featured-insight-icon"><Icon size={18} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{summary}</p>
              <span className="featured-insight-tags">
                {experiments.map((experiment) => <i key={experiment}>{experiment}</i>)}
              </span>
              <span className="featured-insight-link">
                {linkLabel} <ArrowRight size={14} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-section research-spotlight">
        <div className="spotlight-illustration" aria-label="Scientific illustration of a droplet and flame" role="img">
          <div className="spotlight-orbit spotlight-orbit-one" />
          <div className="spotlight-orbit spotlight-orbit-two" />
          <div className="spotlight-droplet" />
          <Flame size={44} aria-hidden="true" />
          <span>FLEX · DROPLET COMBUSTION</span>
        </div>
        <div className="spotlight-copy">
          <p className="section-kicker">Research spotlight · FLEX</p>
          <h2>A flame can disappear without all combustion ending</h2>
          <p>
            In certain larger heptane droplet tests, FLEX reported low-temperature
            combustion behavior after the visible flame disappeared. That
            observation is specific to the tested droplets; it does not mean
            visible extinction always leaves combustion ongoing.
          </p>
          <Link href="/insights?finding=2">
            Explore the FLEX evidence <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="dashboard-section conclusions-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="section-kicker">Across distinct experiments</p>
            <h2>Key Research Conclusions</h2>
          </div>
          <p>
            These are research-level conclusions, not universal safety rules or
            claims that the experiments are interchangeable.
          </p>
        </div>
        <div className="dashboard-conclusion-grid">
          {dashboardConclusions.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <small>{item.experiments}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-section applications-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="section-kicker">Potential directions for further study</p>
            <h2>Where Can This Research Be Applied?</h2>
          </div>
          <Link href="/insights?tab=applications">
            View research applications <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="dashboard-application-grid">
          {researchApplications.map(({ title, description, experiments, icon: Icon }) => (
            <article key={title}>
              <Icon size={18} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
              <small>{experiments}</small>
            </article>
          ))}
        </div>
        <p className="dashboard-application-caveat">
          <CircleAlert size={15} aria-hidden="true" />
          These are potential research applications—not validated spacecraft
          safety procedures, certified design recommendations, or substitutes
          for formal testing.
        </p>
      </section>

      <section className="dashboard-section safety-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="section-kicker">From experiments to mission context</p>
            <h2>Fire safety relevance</h2>
          </div>
          <p>
            Research evidence can inform questions for spacecraft, lunar
            habitats, and pressurized rovers; it does not by itself certify a
            design or operational procedure.
          </p>
        </div>
        <div className="safety-grid">
          <article>
            <div className="safety-icon safety-icon-prevention">
              <ShieldCheck size={19} aria-hidden="true" />
            </div>
            <span>01 · PREVENTION</span>
            <h3>Materials &amp; ignition conditions</h3>
            <p>
              FLEX and BASS-II provide selected records related to fuel,
              material, oxygen, and pressure conditions. Use the source
              documentation to understand each variable before applying it to
              material screening.
            </p>
            <Link href="/compare">
              Compare available conditions <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </article>
          <article>
            <div className="safety-icon safety-icon-detection">
              <Microscope size={19} aria-hidden="true" />
            </div>
            <span>02 · DETECTION</span>
            <h3>Evidence boundary</h3>
            <p>
              No dedicated smoke/aerosol detection-response dataset is
              integrated in the current selection. Detector performance cannot
              be compared from these tables.
            </p>
            <Link href="/research">
              Search available sources <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </article>
          <article>
            <div className="safety-icon safety-icon-suppression">
              <Flame size={19} aria-hidden="true" />
            </div>
            <span>03 · SUPPRESSION</span>
            <h3>Extinguishment &amp; spread</h3>
            <p>
              FLEX records distinct test-end labels, while BASS-II sources
              document flame-spread and extinction research. Their outcomes and
              variables are not interchangeable.
            </p>
            <Link href="/ask">
              Ask about the evidence <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </article>
        </div>
      </section>

      <ResearchAnalytics analytics={analytics} />

      <section className="dashboard-section intelligence-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="section-kicker">Evidence-backed observations</p>
            <h2>Research Intelligence</h2>
          </div>
          <p>
            Direct observations from currently integrated tables. These
            descriptive facts are not causal findings or safety certification.
          </p>
        </div>
        <div className="intelligence-grid">
          <article className="intelligence-item">
            <span className="intelligence-index">01 / OBSERVED DATA</span>
            <h3>FLEX records multiple fuel and test-end labels.</h3>
            <p>
              The PSI-69 table lists {topFuel || "fuel labels"} and the
              recorded test-end categories {outcomeSummary || "in its source"}.
              The labels are preserved as recorded, without assigning extra
              physical meaning.
            </p>
            <Link href="/flex">
              Inspect FLEX records <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </article>
          <article className="intelligence-item">
            <span className="intelligence-index">02 / OBSERVED DATA</span>
            <h3>BASS-II material representation is varied.</h3>
            <p>
              The integrated BASS-II table contains{" "}
              {analytics.bass.distinctMaterialLabels} whitespace-normalized
              material descriptions across {analytics.bass.rows} table rows.
              Distinct descriptions are not necessarily unique material
              families.
            </p>
            <Link href="/bass-ii">
              Inspect BASS-II records <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </article>
          <article className="intelligence-item">
            <span className="intelligence-index">03 / EVIDENCE LIMIT</span>
            <h3>Not every investigation has the same measurements.</h3>
            <p>
              Oxygen measurements are present in the FLEX and BASS-II tables;
              the current SAFFIRE F1C1 asset is image-sequence data. A blank
              field or absent measurement is not a zero.
            </p>
            <Link href="/compare">
              Review comparable fields <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </article>
        </div>
        <div className="intelligence-source-note">
          <BookOpen size={15} aria-hidden="true" />
          These observations are calculated from the integrated PSI-69 FLEX
          and PSI-25 BASS-II tables. Search indexed source passages for
          investigation documentation and citations.
          <Link href="/research">Open Research Library</Link>
        </div>
      </section>

      <section className="dashboard-section coverage-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="section-kicker">What is — and is not — here</p>
            <h2>Research coverage &amp; gaps</h2>
          </div>
          <p>
            The broader NASA research landscape includes investigations beyond
            the selected datasets integrated in this workspace.
          </p>
        </div>
        <div className="coverage-table-wrap">
          <table className="coverage-table">
            <thead>
              <tr>
                <th scope="col">Investigation</th>
                <th scope="col">Integrated source</th>
                <th scope="col">Available in this dataset</th>
                <th scope="col">Important boundary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row"><Waves size={16} /> FLEX</th>
                <td>PSI-69 table</td>
                <td>Fuel, pressure, initial oxygen, droplet size, burning rate, test-end labels</td>
                <td>Some measurement fields are missing; inspect per-field coverage.</td>
              </tr>
              <tr>
                <th scope="row"><FlaskConical size={16} /> BASS-II</th>
                <td>PSI-25 table and indexed source documents</td>
                <td>Material descriptions and calibrated initial/final gas measurements</td>
                <td>Do not assume FLEX-specific variables exist in this table.</td>
              </tr>
              <tr>
                <th scope="row"><Flame size={16} /> SAFFIRE-I</th>
                <td>F1C1 pre-test image sequence</td>
                <td>Available camera frames with source timestamps</td>
                <td>This sequence is not sample-burning footage or outcome measurements.</td>
              </tr>
              <tr className="coverage-not-integrated">
                <th scope="row"><CircleHelp size={16} /> Broader studies</th>
                <td>SAME, SAME-R, ACME and others</td>
                <td>Not represented as integrated datasets here</td>
                <td>The index covers selected sources only—not the full PSI database.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="coverage-footnote">
          Counts and summaries above refer to their named record type: table
          rows, image frames, or indexed text passages.
        </p>
      </section>

      <section className="dashboard-section discovery-section" id="discover">
        <div className="dashboard-section-heading">
          <div>
            <p className="section-kicker">Explore by research question</p>
            <h2>Research discovery</h2>
          </div>
          <p>
            Start with a curated question or explore the indexed source
            collection. No activity history or popularity metrics are assumed.
          </p>
        </div>
        <div className="discovery-grid">
          {experimentQuestions.map((question) => (
            <Link
              key={question.id}
              href="/ask"
              className="curated-question"
            >
              <span>{question.experiment}</span>
              <strong>{question.question}</strong>
              <span className="curated-question-action">
                Explore in Ask SideroSpace <ArrowUpRight size={14} aria-hidden="true" />
              </span>
            </Link>
          ))}
          <Link href="/research" className="discovery-library-link">
            <div><FileSearch size={20} aria-hidden="true" /></div>
            <strong>Browse source documents</strong>
            <span>Search indexed NASA research passages and follow their provenance.</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="dashboard-ask-cta">
        <div className="ask-cta-symbol"><MessageCircleQuestion size={22} aria-hidden="true" /></div>
        <div>
          <p className="section-kicker">Evidence-first research support</p>
          <h2>Have a research question?</h2>
          <p>
            Explore NASA combustion investigations, inspect experimental
            conditions, and trace answers to indexed source material.
          </p>
        </div>
        <Link href="/ask">
          Ask SideroSpace <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <footer className="dashboard-footer">
        <span><Database size={14} aria-hidden="true" /> SELECTED INTEGRATED RESEARCH</span>
        <span>
          <Check size={14} aria-hidden="true" /> Source labels and record types preserved
        </span>
        <Link href="/research">Review indexed evidence <ArrowUpRight size={13} aria-hidden="true" /></Link>
      </footer>
    </main>
  );
}
