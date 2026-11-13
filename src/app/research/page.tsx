
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  FileText,
  Database,
  ExternalLink,
  ArrowUpRight,
  ShieldCheck,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  getExperimentId,
  getSearchParam,
  parseExperimentContext,
  researchHref,
} from "@/lib/research-context";
import {
  setResearchSearchParams,
  replaceResearchSearchParam,
  setResearchSearchParam,
  useResearchUrl,
} from "@/lib/use-research-url";

type Experiment = "SAFFIRE-I" | "FLEX" | "BASS-II";

type ResearchSource = {
  title: string;
  experiment: Experiment;
  type: "Technical report" | "Dataset record" | "Experiment documentation";
  description: string;
  href: string;
  local?: boolean;
  evidence: string;
};

type EvidencePassage = {
  id: string;
  experiment: string;
  source: string;
  source_type: string;
  page: number | null;
  chunk: number;
  text: string;
};

type EvidenceIndex = {
  generated_at_utc?: string;
  index_version?: number;
  summary?: {
    passages_indexed?: number;
    pdf_files_scanned?: number;
    zip_archives_scanned?: number;
    text_files_scanned?: number;
    extraction_errors?: number;
    experiments?: string[];
  };
  passages: EvidencePassage[];
  limitations?: string[];
};

const sources: ResearchSource[] = [
  {
    title: "Spacecraft Fire Safety Experiment-I",
    experiment: "SAFFIRE-I",
    type: "Dataset record",
    description:
      "Official NASA Physical Sciences Informatics record for the first Spacecraft Fire Safety experiment.",
    href: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-98",
    evidence: "Experiment identity and source provenance",
  },
  {
    title: "SAFFIRE-I Operations",
    experiment: "SAFFIRE-I",
    type: "Technical report",
    description:
      "Local reference document for understanding the experiment's operational context and procedures.",
    href: "/data/research/SAFFIRE-I%20Operations.pdf",
    local: true,
    evidence: "Experimental context and documented conditions",
  },
  {
    title: "SAFFIRE-I Image Directory Nomenclature",
    experiment: "SAFFIRE-I",
    type: "Experiment documentation",
    description:
      "Reference for interpreting image-directory naming conventions in the SAFFIRE-I image collection.",
    href: "/data/research/SAFFIRE-I%20Image%20Directory%20Nomenclature.pdf",
    local: true,
    evidence: "Image identifiers and naming conventions",
  },
  {
    title: "Flame Extinguishment Experiment",
    experiment: "FLEX",
    type: "Dataset record",
    description:
      "NASA PSI record associated with the Flame Extinguishment Experiment.",
    href: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-69",
    evidence: "FLEX experiment metadata and source record",
  },
  {
    title: "Burning and Suppression of Solids-II",
    experiment: "BASS-II",
    type: "Dataset record",
    description:
      "NASA PSI record for research into the burning and suppression of solid materials.",
    href: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-25",
    evidence: "BASS-II experiment metadata and source record",
  },
];

const experiments = ["All", "SAFFIRE-I", "FLEX", "BASS-II"] as const;
const types = [
  "All types",
  "Dataset record",
  "Technical report",
  "Experiment documentation",
] as const;

function rankPassage(passage: EvidencePassage, query: string) {
  const terms = [...new Set(
    query.toLowerCase().match(/[a-z0-9]+(?:[-'][a-z0-9]+)*/g) ?? []
  )].filter((term) => term.length > 1);

  if (terms.length === 0) return 0;

  const text = passage.text.toLowerCase();
  const title = passage.source.toLowerCase();
  let score = 0;

  for (const term of terms) {
    if (title.includes(term)) score += 5;

    const matches = text.split(term).length - 1;
    score += Math.min(matches, 8) * 2;

    if (text.startsWith(term)) score += 1;
  }

  // Prefer passages containing the complete query phrase.
  if (text.includes(query.toLowerCase().trim())) score += 8;

  return score;
}

function highlightTerms(text: string, query: string) {
  const terms = [...new Set(
    query.toLowerCase().match(/[a-z0-9]+(?:[-'][a-z0-9]+)*/g) ?? []
  )].filter((term) => term.length > 1);

  if (terms.length === 0) return text;

  const escaped = terms
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const expression = new RegExp(`(${escaped.join("|")})`, "gi");
  return text.split(expression).map((part, index) =>
    terms.includes(part.toLowerCase()) ? (
      <mark key={`${index}-${part}`}>{part}</mark>
    ) : (
      part
    )
  );
}


function getSourceLink(passage: EvidencePassage) {
  const source = passage.source.toLowerCase();

  if (source.includes("saffire-i operations.pdf")) {
    return {
      href: "/data/research/SAFFIRE-I%20Operations.pdf",
      label: "Open original PDF",
      isPdf: true,
    };
  }

  if (source.includes("saffire-i image directory nomenclature.pdf")) {
    return {
      href: "/data/research/SAFFIRE-I%20Image%20Directory%20Nomenclature.pdf",
      label: "Open original PDF",
      isPdf: true,
    };
  }

  if (
    source.includes("flex") ||
    passage.experiment === "FLEX"
  ) {
    return {
      href: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-69",
      label: "Open NASA source record",
      isPdf: false,
    };
  }

  if (
    source.includes("bass") ||
    passage.experiment === "BASS-II"
  ) {
    return {
      href: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-25",
      label: "Open NASA source record",
      isPdf: false,
    };
  }

  return {
    href: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-98",
    label: "Open NASA source record",
    isPdf: false,
  };
}


export default function ResearchLibraryPage() {
  const search = useResearchUrl();
  const context = parseExperimentContext(search);
  const query = getSearchParam(search, "q") ?? "";
  const experiment = getExperimentId(search) ?? "All";
  const requestedType = getSearchParam(search, "type");
  const type =
    types.find((item) => item === requestedType) ?? "All types";

  const [index, setIndex] = useState<EvidenceIndex | null>(null);
  const [indexError, setIndexError] = useState("");
  const [loadingIndex, setLoadingIndex] = useState(true);
  const [showAllMatches, setShowAllMatches] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadIndex() {
      try {
        setLoadingIndex(true);
        setIndexError("");

        const response = await fetch(
          "/data/research/evidence-index.json",
          { signal: controller.signal, cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(`Index request failed (${response.status}).`);
        }

        const data: EvidenceIndex = await response.json();

        if (!Array.isArray(data.passages)) {
          throw new Error("The evidence index has no valid passages array.");
        }

        setIndex(data);
      } catch (error) {
        if (controller.signal.aborted) return;

        setIndexError(
          error instanceof Error
            ? error.message
            : "Unable to load the evidence index."
        );
      } finally {
        if (!controller.signal.aborted) setLoadingIndex(false);
      }
    }

    loadIndex();
    return () => controller.abort();
  }, []);

  const filteredSources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sources.filter((source) => {
      const matchesExperiment =
        experiment === "All" || source.experiment === experiment;
      const matchesType = type === "All types" || source.type === type;

      const searchableText = [
        source.title,
        source.experiment,
        source.type,
        source.description,
        source.evidence,
      ].join(" ").toLowerCase();

      return (
        matchesExperiment &&
        matchesType &&
        (!normalizedQuery || searchableText.includes(normalizedQuery))
      );
    });
  }, [query, experiment, type]);

  const evidenceResults = useMemo(() => {
    if (!index || !query.trim()) return [];

    return index.passages
      .filter((passage) =>
        experiment === "All" || passage.experiment === experiment
      )
      .map((passage) => ({
        passage,
        score: rankPassage(passage, query.trim()),
      }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  }, [index, query, experiment]);

  const visibleResults = showAllMatches
    ? evidenceResults
    : evidenceResults.slice(0, 8);

  function resetFilters() {
    setResearchSearchParams([
      ["experiment", null],
      ["q", null],
      ["type", null],
    ]);
    setShowAllMatches(false);
  }

  return (
    <main className="research-library">
      <header className="research-hero">
        <div className="research-hero-content">
          <div>
            <h1>Research Library</h1>
            <p>
              Search NASA records and indexed source passages across the
              research workspace. Follow every match back to its document and
              page context.
            </p>
          </div>
          <figure className="research-hero-visual">
            <Image
              src="/images/c22.webp"
              alt="Spacecraft imagery representing the research library"
              fill
              preload
              sizes="(max-width: 640px) 100vw, 32vw"
              className="research-hero-image"
            />
            <span className="research-hero-image-tint" aria-hidden="true" />
          </figure>
        </div>

        <p className="research-hero-note">
          Source excerpts are evidence to review—not independently verified
          findings or generated conclusions.
        </p>

        <div className="research-stats">
          <div>
            <strong>{sources.length.toString().padStart(2, "0")}</strong>
            <span>Source records</span>
          </div>
          <div>
            <strong>
              {index?.summary?.experiments?.length?.toString().padStart(2, "0") ?? "—"}
            </strong>
            <span>Experiments indexed</span>
          </div>
          <div>
            <strong>
              {index?.summary?.passages_indexed?.toLocaleString() ?? "—"}
            </strong>
            <span>Indexed passages</span>
          </div>
        </div>
      </header>

      {context.status === "valid" && (
        <nav className="research-context-nav" aria-label="Investigation context">
          <strong>Evidence filtered to {context.experiment}</strong>
          <Link href={researchHref("compare", context.experiment)}>Compare data</Link>
          <Link href={researchHref("ask", context.experiment)}>Ask about it</Link>
          <Link href={context.experiment === "FLEX" ? "/flex" : context.experiment === "BASS-II" ? "/bass-ii" : "/saffire"}>
            Investigation page
          </Link>
        </nav>
      )}
      {context.status === "invalid" && (
        <div className="research-context-warning" role="status">
          Unknown investigation “{context.value}”. Showing evidence across all
          investigations.{" "}
          <button
            type="button"
            onClick={() => setResearchSearchParam("experiment", null)}
          >
            Clear invalid filter
          </button>
        </div>
      )}

      <section className="research-controls">
        <label className="research-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => {
              replaceResearchSearchParam("q", event.target.value || null);
              setShowAllMatches(false);
            }}
            placeholder="Search actual NASA document text..."
            aria-label="Search research documents and evidence"
          />
          {query && (
            <button type="button" onClick={() => replaceResearchSearchParam("q", null)}>
              Clear
            </button>
          )}
        </label>

        <div className="research-filter-row">
          <div className="research-filter-group">
            <span>EXPERIMENT</span>
            <div className="research-chips">
              {experiments.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={experiment === item ? "active" : ""}
                  onClick={() =>
                    setResearchSearchParam(
                      "experiment",
                      item === "All" ? null : item,
                    )
                  }
                  aria-pressed={experiment === item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <label className="research-type-filter">
            <span>DOCUMENT TYPE</span>
            <select
              value={type}
              onChange={(event) =>
                setResearchSearchParam(
                  "type",
                  event.target.value === "All types" ? null : event.target.value,
                )
              }
            >
              {types.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="evidence-search-section">
        <div className="evidence-section-heading">
          <div>
            <span className="research-kicker">PASSAGE RETRIEVAL</span>
            <h2>Search within the evidence</h2>
            <p>
              Results are ranked by text matches. They are source excerpts,
              not automatically verified scientific conclusions.
            </p>
          </div>
          <div className="evidence-engine-icon">
            <ShieldCheck size={22} />
          </div>
        </div>

        {loadingIndex && (
          <div className="evidence-status">
            <LoaderCircle size={18} className="evidence-spinner" />
            Loading indexed NASA documents…
          </div>
        )}

        {!loadingIndex && indexError && (
          <div className="evidence-status evidence-status-error">
            <AlertCircle size={18} />
            <div>
              <strong>Evidence index unavailable</strong>
              <p>{indexError}</p>
              <p>
                Check that <code>public/data/research/evidence-index.json</code>
                exists and reload this page.
              </p>
            </div>
          </div>
        )}

        {!loadingIndex && index && !query.trim() && (
          <div className="evidence-empty-prompt">
            <Search size={22} />
            <div>
              <strong>Ask a question by searching for its key terms</strong>
              <p>
                Try <button type="button" onClick={() => replaceResearchSearchParam("q", "airflow")}>airflow</button>,
                {" "}<button type="button" onClick={() => replaceResearchSearchParam("q", "flame spread")}>flame spread</button>,
                {" "}<button type="button" onClick={() => replaceResearchSearchParam("q", "extinguishment")}>extinguishment</button>,
                or <button type="button" onClick={() => replaceResearchSearchParam("q", "camera")}>camera</button>.
              </p>
            </div>
          </div>
        )}

        {!loadingIndex && index && query.trim() && (
          <>
            <div className="evidence-results-meta">
              <span>
                <strong>{evidenceResults.length}</strong> matching passages
              </span>
              <span>
                Ranked by keyword relevance · Up to 50 matches shown
              </span>
            </div>

            
{evidenceResults.length === 0 ? (
  <div className="research-empty">
    <Search size={24} />
    <h3>No passages matched</h3>
    <p>
      Try different terms or select another experiment.
      A missing match does not mean the subject is absent
      from NASA research.
    </p>
  </div>
) : (
  <div className="evidence-result-list">
    {visibleResults.map(({ passage, score }) => (
      <details
        className="evidence-result-card"
        key={passage.id}
      >
        <summary className="evidence-result-summary">
          <div className="evidence-result-main">
            <div className="evidence-result-top">
              <span className="research-experiment-tag">
                {passage.experiment}
              </span>
              <span className="evidence-score">
                {score} relevance points
              </span>
            </div>

            <strong className="evidence-result-title">
              {passage.source}
            </strong>

            <span className="evidence-result-location">
              {passage.source_type}
              {passage.page != null
                ? ` · PDF page ${passage.page}`
                : ""}
              {` · Passage ${passage.chunk}`}
            </span>

            <span className="evidence-result-preview">
              {highlightTerms(
                passage.text.length > 190
                  ? `${passage.text.slice(0, 190).trimEnd()}…`
                  : passage.text,
                query
              )}
            </span>
          </div>

          <span className="evidence-expand-label">
            <span className="evidence-expand-closed">
              View passage
            </span>
            <span className="evidence-expand-open">
              Hide passage
            </span>
            <ArrowUpRight size={16} />
          </span>
        </summary>

     
<div className="evidence-expanded-content">
  <div className="evidence-reader-header">
    <div className="evidence-reader-heading">
      <span className="research-kicker">SOURCE EVIDENCE</span>
      <h4>Retrieved passage</h4>
      <p>
        Extracted text from the indexed source document.
      </p>
    </div>

    <div className="evidence-reader-badge">
      <ShieldCheck size={15} />
      Source attributed
    </div>
  </div>

  <div className="evidence-reader-meta">
    <div className="evidence-meta-item">
      <span>EXPERIMENT</span>
      <strong>{passage.experiment}</strong>
    </div>

    <div className="evidence-meta-item">
      <span>SOURCE TYPE</span>
      <strong>{passage.source_type}</strong>
    </div>

    <div className="evidence-meta-item">
      <span>LOCATION</span>
      <strong>
        {passage.page != null
          ? `PDF page ${passage.page}`
          : `Passage ${passage.chunk}`}
      </strong>
    </div>
  </div>

  <div className="evidence-document-panel">
    
<div className="evidence-document-toolbar">
  <div className="evidence-document-file">
    <FileText size={17} />
    <span>{passage.source}</span>
  </div>

  <div className="evidence-toolbar-actions">
    <span className="evidence-extract-label">
      EXTRACTED TEXT
    </span>

    {(() => {
      const sourceLink = getSourceLink(passage);

      const href =
        sourceLink.isPdf && passage.page != null
          ? `${sourceLink.href}#page=${passage.page}`
          : sourceLink.href;

      return (
        <a
          className="evidence-open-source"
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          {sourceLink.label}
          <ExternalLink size={14} />
        </a>
      );
    })()}
  </div>
</div>


    <div className="evidence-document-body">
      <div className="evidence-document-line" />
      <div className="evidence-document-text">
        {highlightTerms(passage.text, query)}
      </div>
    </div>
  </div>

  <div className="evidence-reader-footer">
    <ShieldCheck size={16} />
    <div>
      <strong>Evidence, not an automatic conclusion</strong>
      <p>
        This passage was retrieved by keyword matching. Read it
        in context before using it to support a scientific claim.
        The displayed page number refers to the extracted PDF page.
      </p>
    </div>
  </div>
</div>

      </details>
    ))}
  </div>
)}


            {evidenceResults.length > 8 && (
              <button
                type="button"
                className="evidence-show-more"
                onClick={() => setShowAllMatches((value) => !value)}
              >
                {showAllMatches ? "Show top 8 matches" : `Show all ${evidenceResults.length} matches`}
                <ArrowUpRight size={15} />
              </button>
            )}
          </>
        )}

        {index?.limitations && (
          <details className="evidence-limitations">
            <summary>Index coverage and limitations</summary>
            <ul>
              {index.limitations.map((limitation) => (
                <li key={limitation}>{limitation}</li>
              ))}
            </ul>
            <p>
              Index generated:{" "}
              {index.generated_at_utc
                ? new Date(index.generated_at_utc).toLocaleString()
                : "timestamp not available"}
            </p>
          </details>
        )}
      </section>

      <div className="research-results-heading">
        <div>
          <span className="research-kicker">SOURCE CATALOG</span>
          <h2>Source records</h2>
        </div>
        <span className="research-result-count">
          {filteredSources.length} {filteredSources.length === 1 ? "source" : "sources"}
        </span>
      </div>

      <section className="research-source-grid">
        {filteredSources.map((source) => (
          <article className="research-source-card" key={source.title}>
            <div className="research-card-top">
              <div className="research-document-icon">
                {source.type === "Dataset record"
                  ? <Database size={21} />
                  : <FileText size={21} />}
              </div>
              <span className="research-experiment-tag">{source.experiment}</span>
            </div>

            <div className="research-card-content">
              <span className="research-document-type">{source.type}</span>
              <h3>{source.title}</h3>
              <p>{source.description}</p>
            </div>

            <div className="research-evidence">
              <span>RELEVANCE</span>
              <p>{source.evidence}</p>
            </div>

            <a
              className="research-source-link"
              href={source.href}
              target={source.local ? undefined : "_blank"}
              rel={source.local ? undefined : "noreferrer"}
            >
              {source.local ? "Open local document" : "Open source record"}
              <ArrowUpRight size={16} />
            </a>
          </article>
        ))}
      </section>

      {filteredSources.length === 0 && (
        <div className="research-empty">
          <Search size={24} />
          <h3>No matching source records</h3>
          <p>Try a different search term or reset your filters.</p>
          <button type="button" onClick={resetFilters}>Reset filters</button>
        </div>
      )}

      <footer className="research-library-note">
        <ExternalLink size={16} />
        <p>
          Source records link to NASA PSI. Local documents open from the
          SideroSpace public research directory. Passage matches retain source
          filenames and extracted PDF page positions.
        </p>
      </footer>
    </main>
  );
}
