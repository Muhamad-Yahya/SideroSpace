"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Database,
  GitCompareArrows,
  MessageCircleQuestion,
} from "lucide-react";
import Link from "next/link";
import {
  experimentFromContentId,
  investigationHref,
  researchHref,
} from "@/lib/research-context";

export type ExperimentResearchContent = {
  id: "flex" | "bass" | "saffire";
  identifier: string;
  scope: string;
  title: string;
  overview: string;
  objectives: string[];
  setup: string[];
  variables: {
    name: string;
    meaning: string;
    unit: string;
  }[];
  availableEvidence: string[];
  limitations: string[];
  sources: {
    type: string;
    label: string;
    href?: string;
  }[];
  note?: {
    title: string;
    body: string;
  };
};

const workflowStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
  gap: 9,
} as const;

const workflowLinkStyle = {
  display: "flex",
  minWidth: 0,
  minHeight: 48,
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  padding: "10px 12px",
  border: "1px solid #30384a",
  borderRadius: 8,
  background: "#121725",
  color: "#d7dced",
  fontSize: 11,
  fontWeight: 600,
  lineHeight: 1.4,
  textAlign: "center",
  transition:
    "border-color 160ms ease, background 160ms ease, color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
} as const;

const workflowLinkHoverStyle = {
  borderColor: "#a78bfa",
  background: "#201a31",
  color: "#fff",
  boxShadow:
    "0 0 0 1px rgba(167, 139, 250, 0.3), 0 0 22px rgba(139, 92, 246, 0.48)",
  transform: "translateY(-1px)",
} as const;

export default function ExperimentResearchContext({
  content,
  showSources = true,
}: {
  content: ExperimentResearchContent;
  showSources?: boolean;
}) {
  const [priorityLimitation, ...remainingLimitations] = content.limitations;
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [variablesOpen, setVariablesOpen] = useState(false);
  const experiment = experimentFromContentId(content.id);
  const actions = [
    {
      label: "Explore Data",
      href: investigationHref(experiment),
      icon: Database,
    },
    {
      label: "Compare Experiments",
      href: researchHref("compare", experiment),
      icon: GitCompareArrows,
    },
    {
      label: "View Research Evidence",
      href: researchHref("research", experiment),
      icon: BookOpen,
    },
    {
      label: "Ask About This Experiment",
      href: researchHref("ask", experiment),
      icon: MessageCircleQuestion,
    },
  ];

  return (
    <section
      className="experiment-research"
      data-experiment={content.id}
      id="research-context"
    >
      <header className="research-hero">
        <div className="research-hero-copy">
          <p className="research-kicker">SCIENTIFIC CONTEXT · DATA GUIDE</p>
          <h2>{content.title}</h2>
          <p className="research-overview">{content.overview}</p>
        </div>
        <dl className="research-hero-meta">
          <div>
            <dt>NASA INVESTIGATION</dt>
            <dd>{content.identifier}</dd>
          </div>
          <div>
            <dt>LOCAL DATA SCOPE</dt>
            <dd>{content.scope}</dd>
          </div>
        </dl>
      </header>

      {content.note && (
        <aside className="research-note">
          <span className="research-note-mark" aria-hidden="true">
            !
          </span>
          <div>
            <strong>{content.note.title}</strong>
            <p>{content.note.body}</p>
          </div>
        </aside>
      )}

      <nav aria-label={`${experiment} research workflow`} style={workflowStyle}>
        {actions.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            style={{
              ...workflowLinkStyle,
              ...(activeAction === label ? workflowLinkHoverStyle : {}),
            }}
            onMouseEnter={() => setActiveAction(label)}
            onMouseLeave={() => setActiveAction(null)}
            onFocus={() => setActiveAction(label)}
            onBlur={() => setActiveAction(null)}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      {experiment === "SAFFIRE-I" && (
        <p
          style={{
            margin: "-15px 0 0",
            color: "#b7a99d",
            fontSize: 11,
            lineHeight: 1.6,
          }}
        >
          SAFFIRE-I has image data and indexed evidence here, but no numeric
          table available in Compare.
        </p>
      )}

      <div className="research-overview-grid">
        <section className="research-block research-objectives">
          <div className="research-section-heading">
            <p className="research-kicker">01 · RESEARCH INTENT</p>
            <h3>Scientific objectives</h3>
          </div>
          <div className="research-objective-grid">
            {content.objectives.map((objective, index) => (
              <article className="research-objective" key={objective}>
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p>{objective}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="research-block research-setup">
          <div className="research-section-heading">
            <p className="research-kicker">02 · TEST CONFIGURATION</p>
            <h3>Experimental setup</h3>
          </div>
          <ol className="research-setup-list">
            {content.setup.map((item, index) => (
              <li key={item}>
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="research-block research-variables">
        <div className="research-section-heading research-section-heading-wide">
          <div>
            <p className="research-kicker">03 · SOURCE FIELDS</p>
            <h3>Variables available in this project</h3>
          </div>
          <div className="research-variables-summary">
            <p>
              Source field names and units are retained; undocumented details
              are identified.
            </p>
            <button
              type="button"
              className="research-variables-toggle"
              aria-expanded={variablesOpen}
              onClick={() => setVariablesOpen((open) => !open)}
            >
              <span>{content.variables.length} fields</span>
              <span>{variablesOpen ? "Hide fields" : "Show fields"}</span>
              <ChevronDown
                size={15}
                aria-hidden="true"
                className={variablesOpen ? "is-open" : undefined}
              />
            </button>
          </div>
        </div>
        {variablesOpen && (
          <div
            className="research-variable-wrap"
            role="region"
            aria-label="Variable guide"
            tabIndex={0}
          >
            <table className="research-variable-table">
              <thead>
                <tr>
                  <th scope="col">Dataset field</th>
                  <th scope="col">What it represents</th>
                  <th scope="col">Unit / interpretation</th>
                </tr>
              </thead>
              <tbody>
                {content.variables.map((variable) => (
                  <tr key={variable.name}>
                    <th scope="row">{variable.name}</th>
                    <td>{variable.meaning}</td>
                    <td>{variable.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="research-evidence-grid">
        <section className="research-block research-findings">
          <div className="research-section-heading">
            <p className="research-kicker">04 · DATA IN CONTEXT</p>
            <h3>What the available evidence can show</h3>
          </div>
          <ul className="research-evidence-list">
            {content.availableEvidence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="research-block research-limitations">
          <div className="research-section-heading">
            <p className="research-kicker">05 · INTERPRET WITH CARE</p>
            <h3>Scientific limitations</h3>
          </div>
          {priorityLimitation && (
            <p className="research-priority-caveat">{priorityLimitation}</p>
          )}
          {remainingLimitations.length > 0 && (
            <ul className="research-limitation-list">
              {remainingLimitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {showSources && <ExperimentResearchSources content={content} />}
    </section>
  );
}

export function ExperimentResearchSources({
  content,
}: {
  content: ExperimentResearchContent;
}) {
  return (
    <section className="research-block research-sources">
      <div className="research-section-heading research-section-heading-wide">
        <div>
          <p className="research-kicker">06 · TRACEABLE REFERENCES</p>
          <h3>Sources and data provenance</h3>
        </div>
      </div>
      <ul className="research-source-list">
        {content.sources.map((source, index) => (
          <li key={`${source.type}-${source.label}`}>
            <span className="research-source-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <span className="research-source-type">{source.type}</span>
              {source.href ? (
                <a
                  href={source.href}
                  target={source.href.startsWith("/") ? undefined : "_blank"}
                  rel={source.href.startsWith("/") ? undefined : "noreferrer"}
                >
                  {source.label}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ) : (
                <strong>{source.label}</strong>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
