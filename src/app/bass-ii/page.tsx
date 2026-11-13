
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  ChevronLeft,
  ChevronRight,
  Database,
  FlaskConical,
  Search,
} from "lucide-react";
import ExperimentResearchContext, {
  ExperimentResearchSources,
} from "@/components/ExperimentResearchContext";
import { bassResearchContent } from "@/lib/experiment-research-content";

type Experiment = Record<string, string>;

const COLUMNS = {
  test: "Test #",
  date: "Date",
  fuel: "Fuel Sample Material",
  sample: "Sample #",
  initialO2: "Calibrated  initial O2 % by vol ",
  finalO2: "Calibrated final O2 % by vol",
  initialCO2: "Initial CO2 % by vol",
  finalCO2: "Final CO2 % by vol",
  initialCO: "Initial CO (ppm)",
  finalCO: "Final CO (ppm)",
  frames: "Total Frames Shot",
  fan: "Fan display",
  air: "Air display",
};

function numberValue(value: string | undefined): number | null {
  if (value === undefined || value.trim() === "") return null;

  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function formatValue(value: number | null, suffix = "") {
  if (value === null) return "—";
  return `${Number(value.toFixed(3))}${suffix}`;
}

function getMissingCount(rows: Experiment[]) {
  return rows.reduce((total, row) => {
    return (
      total +
      Object.values(row).filter(
        (value) => value === undefined || value.trim() === ""
      ).length
    );
  }, 0);
}

function getNumericPairs(
  rows: Experiment[],
  initialKey: string,
  finalKey: string
) {
  return rows.flatMap((row) => {
    const initial = numberValue(row[initialKey]);
    const final = numberValue(row[finalKey]);

    if (initial === null || final === null) return [];

    return [
      {
        initial,
        final,
        test: row[COLUMNS.test] || "Unknown",
        fuel: row[COLUMNS.fuel] || "Unspecified",
      },
    ];
  });
}

function exportCSV(rows: Experiment[]) {
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "siderospace-bass-ii-filtered.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function GasScatter({
  title,
  description,
  rows,
  initialKey,
  finalKey,
  unit,
}: {
  title: string;
  description: string;
  rows: Experiment[];
  initialKey: string;
  finalKey: string;
  unit: string;
}) {
  const points = useMemo(
    () => getNumericPairs(rows, initialKey, finalKey),
    [rows, initialKey, finalKey]
  );

  const values = points.flatMap((point) => [point.initial, point.final]);
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;
  const padding = (max - min) * 0.06 || 1;

  return (
    <section className="bass-card bass-chart-card">
      <div className="bass-chart-heading">
        <div>
          <p className="bass-eyebrow">RECORDED MEASUREMENTS</p>
          <h3>{title}</h3>
          <p className="bass-muted">{description}</p>
        </div>
        <span className="bass-point-count">{points.length} pairs</span>
      </div>

      <div className="bass-chart">
        {points.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 16, right: 20, bottom: 12, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bass-grid)" />
              <XAxis
                type="number"
                dataKey="initial"
                name="Initial"
                domain={[min - padding, max + padding]}
                tick={{ fill: "var(--bass-muted)", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "var(--bass-grid)" }}
                label={{
                  value: `Initial (${unit})`,
                  position: "insideBottom",
                  offset: -5,
                  fill: "var(--bass-muted)",
                  fontSize: 11,
                }}
              />
              <YAxis
                type="number"
                dataKey="final"
                name="Final"
                domain={[min - padding, max + padding]}
                tick={{ fill: "var(--bass-muted)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={48}
                label={{
                  value: `Final (${unit})`,
                  angle: -90,
                  position: "insideLeft",
                  fill: "var(--bass-muted)",
                  fontSize: 11,
                }}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  background: "var(--bass-panel)",
                  border: "1px solid var(--bass-border)",
                  borderRadius: 12,
                  color: "var(--bass-text)",
                  fontSize: 12,
                }}
                formatter={(value, name) => [
                  typeof value === "number" ? value : String(value ?? "—"),
                  String(name ?? ""),
                ]}
                labelFormatter={(_, payload) => {
                  const point = payload?.[0]?.payload;
                  return point
                    ? `Test ${point.test} · ${point.fuel}`
                    : "Experiment";
                }}
              />
              <ReferenceLine
                segment={[
                  { x: min - padding, y: min - padding },
                  { x: max + padding, y: max + padding },
                ]}
                stroke="var(--bass-reference)"
                strokeDasharray="5 5"
              />
              <Scatter
                name="Recorded pair"
                data={points}
                fill="#8b72ee"
                fillOpacity={0.78}
                r={4}
              />
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="bass-empty-chart">No complete measurement pairs for these filters.</div>
        )}
      </div>

      <div className="bass-chart-foot">
        <span>
          <span className="bass-legend-dot" />
          Each point represents one experiment with both values recorded.
        </span>
        <span>Dashed line: initial = final</span>
      </div>
    </section>
  );
}

export default function BassIIPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("all");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const response = await fetch("/data/bass-ii/bass-ii.csv");

        if (!response.ok) {
          throw new Error(`Could not load CSV (${response.status}).`);
        }

        const csv = await response.text();
        const result = Papa.parse<Experiment>(csv, {
          header: true,
          skipEmptyLines: "greedy",
        });

        if (result.errors.length > 0) {
          console.warn("BASS-II CSV parsing warnings:", result.errors.slice(0, 5));
        }

        const rows = result.data.filter(
          (row) => row[COLUMNS.test] || row[COLUMNS.fuel]
        );

        if (!cancelled) {
          setExperiments(rows);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load the dataset."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const fuelOptions = useMemo(() => {
    return [
      ...new Set(
        experiments
          .map((row) => row[COLUMNS.fuel]?.trim())
          .filter((fuel): fuel is string => Boolean(fuel))
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [experiments]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return experiments.filter((row) => {
      const matchesFuel =
        selectedFuel === "all" ||
        row[COLUMNS.fuel]?.trim() === selectedFuel;

      const matchesSearch =
        !term ||
        Object.values(row).some((value) =>
          String(value ?? "").toLowerCase().includes(term)
        );

      return matchesFuel && matchesSearch;
    });
  }, [experiments, search, selectedFuel]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedFuel]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleRows = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const missingCount = useMemo(
    () => getMissingCount(experiments),
    [experiments]
  );

  const materialCount = fuelOptions.length;

  const completeO2 = useMemo(
    () =>
      getNumericPairs(
        filtered,
        COLUMNS.initialO2,
        COLUMNS.finalO2
      ).length,
    [filtered]
  );

  const completeCO2 = useMemo(
    () =>
      getNumericPairs(
        filtered,
        COLUMNS.initialCO2,
        COLUMNS.finalCO2
      ).length,
    [filtered]
  );

  const completeCO = useMemo(
    () =>
      getNumericPairs(
        filtered,
        COLUMNS.initialCO,
        COLUMNS.finalCO
      ).length,
    [filtered]
  );

  return (
    <main className="bass-page">
      <div className="bass-shell">
        <section className="bass-hero">
          <div className="bass-hero-copy">
            <div className="bass-status">
              <span className="bass-status-dot" />
              NASA PSI DATASET · BASS-II
            </div>
            <h1>
              Explore combustion.
              <br />
              <span>Inspect the evidence.</span>
            </h1>
            <p>
              Explore recorded experiment conditions, gas measurements, and
              sample metadata from the Burning and Suppression of Solids
              experiments. Every chart uses the values available in the
              source table.
            </p>
            <div className="bass-hero-tags">
              <span><Database size={14} /> Source CSV</span>
              <span><Activity size={14} /> Gas measurements</span>
              <span><FlaskConical size={14} /> Material records</span>
            </div>
          </div>

          <figure className="bass-hero-art">
            <Image
              src="/images/spacecraft-combustion.webp"
              alt="A solid-fuel sample burning inside a spacecraft combustion test chamber"
              fill
              preload
              sizes="(max-width: 800px) 100vw, 40vw"
              className="bass-hero-image"
            />
            <div className="bass-hero-tint" aria-hidden="true" />
            <figcaption className="bass-art-caption">
              <span>BASS-II · PSI-25</span>
              <span>Burning and Suppression of Solids</span>
            </figcaption>
          </figure>
        </section>

        <ExperimentResearchContext
          content={bassResearchContent}
          showSources={false}
        />

        {error && (
          <section className="bass-error">
            <AlertTriangle size={18} />
            <div>
              <strong>Dataset could not be loaded</strong>
              <p>{error}</p>
              <small>
                Check that the file exists at public/data/bass-ii/bass-ii.csv.
              </small>
            </div>
          </section>
        )}

        <section className="bass-section" id="data-explorer">
          <div className="bass-card bass-data-card">
            <div className="bass-filters">
              <label className="bass-search">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search test, date, material, measurement..."
                />
              </label>

              <label className="bass-select-label">
                <span>Fuel material</span>
                <select
                  value={selectedFuel}
                  onChange={(event) => setSelectedFuel(event.target.value)}
                >
                  <option value="all">All material labels</option>
                  {fuelOptions.map((fuel) => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

        </section>

        <section className="bass-section">
          <div className="bass-section-heading">
            <div>
              <p className="bass-eyebrow">DATASET OVERVIEW</p>
              <h2>Experiment inventory</h2>
            </div>
            <span className="bass-source-pill">Local CSV · No live API</span>
          </div>

          <div className="bass-stats-grid">
            <article className="bass-stat">
              <div className="bass-stat-top">
                <span>Loaded experiments</span>
                <Database size={17} />
              </div>
              <strong>{loading ? "…" : experiments.length}</strong>
              <small>Records in the source table</small>
            </article>

            <article className="bass-stat">
              <div className="bass-stat-top">
                <span>Fuel labels</span>
                <FlaskConical size={17} />
              </div>
              <strong>{loading ? "…" : materialCount}</strong>
              <small>Distinct original descriptions</small>
            </article>

            <article className="bass-stat">
              <div className="bass-stat-top">
                <span>Missing fields</span>
                <AlertTriangle size={17} />
              </div>
              <strong>{loading ? "…" : missingCount}</strong>
              <small>Blank cells across loaded records</small>
            </article>

            <article className="bass-stat">
              <div className="bass-stat-top">
                <span>Visible records</span>
                <Activity size={17} />
              </div>
              <strong>{loading ? "…" : filtered.length}</strong>
              <small>After applying filters</small>
            </article>
          </div>
        </section>

        <section className="bass-section">
          <div className="bass-section-heading">
            <div>
              <p className="bass-eyebrow">MEASUREMENT ANALYSIS</p>
              <h2>Initial vs. final gas readings</h2>
              <p className="bass-muted">
                Each point is an experiment with both readings available.
                The diagonal is a visual reference, not a scientific threshold.
              </p>
            </div>
          </div>

          <div className="bass-charts-grid">
            <GasScatter
              title="Oxygen concentration"
              description="Initial and final calibrated O₂ by volume."
              rows={filtered}
              initialKey={COLUMNS.initialO2}
              finalKey={COLUMNS.finalO2}
              unit="% vol"
            />

            <GasScatter
              title="Carbon dioxide concentration"
              description="Initial and final CO₂ by volume."
              rows={filtered}
              initialKey={COLUMNS.initialCO2}
              finalKey={COLUMNS.finalCO2}
              unit="% vol"
            />

            <GasScatter
              title="Carbon monoxide concentration"
              description="Initial and final CO readings."
              rows={filtered}
              initialKey={COLUMNS.initialCO}
              finalKey={COLUMNS.finalCO}
              unit="ppm"
            />

            <section className="bass-card bass-notes-card">
              <div className="bass-notes-icon">
                <AlertTriangle size={19} />
              </div>
              <p className="bass-eyebrow">INTERPRETATION NOTE</p>
              <h3>Recorded values need context.</h3>
              <p>
                Differences between initial and final readings are descriptive.
                They do not by themselves prove that a specific fuel, setting,
                or condition caused a change.
              </p>
              <div className="bass-notes-divider" />
              <div className="bass-pair-row">
                <span>O₂ complete pairs</span>
                <strong>{completeO2}</strong>
              </div>
              <div className="bass-pair-row">
                <span>CO₂ complete pairs</span>
                <strong>{completeCO2}</strong>
              </div>
              <div className="bass-pair-row">
                <span>CO complete pairs</span>
                <strong>{completeCO}</strong>
              </div>
            </section>
          </div>
        </section>

        <section className="bass-section">
          <div className="bass-section-heading bass-table-heading">
            <div>
              <p className="bass-eyebrow">SOURCE RECORDS</p>
              <h2>Experiment explorer</h2>
              <p className="bass-muted">
                Search across fields or select an exact original material label.
              </p>
            </div>
            <button
              className="bass-export-button"
              onClick={() => exportCSV(filtered)}
              disabled={filtered.length === 0}
            >
              <ArrowDownToLine size={16} />
              Export filtered CSV
            </button>
          </div>

          <div className="bass-card bass-data-card">
            <div className="bass-results-bar">
              <span>
                Showing <strong>{filtered.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filtered.length)}</strong> of{" "}
                <strong>{filtered.length}</strong> records
              </span>
              <span>Original source values · Blank values shown as —</span>
            </div>

            <div className="bass-table-wrap">
              <table className="bass-table">
                <thead>
                  <tr>
                    <th>Test</th>
                    <th>Date</th>
                    <th>Fuel sample material</th>
                    <th>Initial O₂</th>
                    <th>Final O₂</th>
                    <th>Initial CO₂</th>
                    <th>Final CO₂</th>
                    <th>Initial CO</th>
                    <th>Final CO</th>
                    <th>Frames</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="bass-empty-table">
                        Loading BASS-II records…
                      </td>
                    </tr>
                  ) : visibleRows.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="bass-empty-table">
                        No experiments match your filters.
                      </td>
                    </tr>
                  ) : (
                    visibleRows.map((row, index) => (
                      <tr key={`${row[COLUMNS.test]}-${row[COLUMNS.sample]}-${index}`}>
                        <td><span className="bass-test-tag">{row[COLUMNS.test] || "—"}</span></td>
                        <td>{row[COLUMNS.date] || "—"}</td>
                        <td className="bass-material-cell">{row[COLUMNS.fuel] || "—"}</td>
                        <td>{formatValue(numberValue(row[COLUMNS.initialO2]))}</td>
                        <td>{formatValue(numberValue(row[COLUMNS.finalO2]))}</td>
                        <td>{formatValue(numberValue(row[COLUMNS.initialCO2]))}</td>
                        <td>{formatValue(numberValue(row[COLUMNS.finalCO2]))}</td>
                        <td>{formatValue(numberValue(row[COLUMNS.initialCO]))}</td>
                        <td>{formatValue(numberValue(row[COLUMNS.finalCO]))}</td>
                        <td>{row[COLUMNS.frames] || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="bass-pagination">
              <span>Page {safePage} of {totalPages}</span>
              <div>
                <button
                  aria-label="Previous page"
                  disabled={safePage <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>
                <button
                  aria-label="Next page"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bass-provenance">
          <div className="bass-provenance-icon"><Database size={20} /></div>
          <div>
            <p className="bass-eyebrow">DATA PROVENANCE & LIMITATIONS</p>
            <h3>Explore the dataset without overstating the evidence.</h3>
            <p>
              This explorer reads the local BASS-II experimental table placed
              in the SideroSpace public data directory. Material descriptions are
              preserved as recorded. Missing values are not imputed, and
              unusual measurements are not automatically corrected. Verify
              definitions, units, calibration, and experiment context against
              the original NASA PSI documentation before drawing conclusions.
            </p>
          </div>
        </section>

        <ExperimentResearchSources content={bassResearchContent} />

        <footer className="bass-footer">
          <span>SideroSpace · RESEARCH DATA EXPLORER</span>
          <span>NASA Space Apps Challenge 2026 · Flame in Freefall</span>
        </footer>
      </div>
    </main>
  );
}
