
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Papa from "papaparse";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Database,
  Download,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { createUtf8CsvBlob, decodeCsvBytes } from "@/lib/csv-encoding";
import ExperimentResearchContext, {
  ExperimentResearchSources,
} from "@/components/ExperimentResearchContext";
import { flexResearchContent } from "@/lib/experiment-research-content";

const CSV_PATH = "/data/flex/flex.csv";

const COL = {
  test: "FLEX Test #",
  id: "FLEX Identifier",
  date: "Test Date",
  fuel: "Fuel",
  pressure: "Ambient pressure; mmHg",
  oxygen: "O initial ambient composition; mole fraction",
  diameter: "Droplet initial diameter; mm",
  extinction: "Visible flame extinction diameter; mm",
  rate: "Burning rate; mm",
  time: "Burn time; s",
  outcome: "Test end",
} as const;

type Experiment = {
  [key: string]: string;
};

function numberValue(row: Experiment, key: string): number | null {
  const raw = row[key]?.trim();
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export default function FlexExplorer() {
  const [rows, setRows] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fuel, setFuel] = useState("All");
  const [outcome, setOutcome] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch(CSV_PATH)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load the FLEX CSV.");
        return response.arrayBuffer();
      })
      .then((buffer) => {
        const text = decodeCsvBytes(new Uint8Array(buffer));
        const result = Papa.parse<Experiment>(text, {
          header: true,
          skipEmptyLines: "greedy",
          transformHeader: (header) => header.trim(),
        });

        if (result.errors.length) {
          console.warn("CSV parsing warnings:", result.errors.slice(0, 5));
        }

        const cleanRows = result.data.filter(
          (row) => row[COL.test] && row[COL.fuel]
        );

        if (!cleanRows.length) {
          throw new Error("No valid experiment records were found.");
        }

        if (!cancelled) {
          setRows(cleanRows);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unexpected data error."
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const fuels = useMemo(
    () => [...new Set(rows.map((row) => row[COL.fuel]).filter(Boolean))].sort(),
    [rows]
  );

  const outcomes = useMemo(
    () =>
      [...new Set(rows.map((row) => row[COL.outcome]).filter(Boolean))].sort(),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesFuel = fuel === "All" || row[COL.fuel] === fuel;
      const matchesOutcome =
        outcome === "All" || row[COL.outcome] === outcome;
      const matchesSearch =
        !q ||
        [
          row[COL.test],
          row[COL.id],
          row[COL.fuel],
          row[COL.outcome],
          row[COL.date],
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      return matchesFuel && matchesOutcome && matchesSearch;
    });
  }, [rows, fuel, outcome, search]);

  const ratePoints = useMemo(
    () =>
      filtered.flatMap((row) => {
        const x = numberValue(row, COL.diameter);
        const y = numberValue(row, COL.rate);
        return x === null || y === null
          ? []
          : [{ x, y, fuel: row[COL.fuel], test: row[COL.test] }];
      }),
    [filtered]
  );

  const timePoints = useMemo(
    () =>
      filtered.flatMap((row) => {
        const x = numberValue(row, COL.diameter);
        const y = numberValue(row, COL.time);
        return x === null || y === null
          ? []
          : [{ x, y, fuel: row[COL.fuel], test: row[COL.test] }];
      }),
    [filtered]
  );

  const missingRate = filtered.filter(
    (row) => numberValue(row, COL.rate) === null
  ).length;

  const missingDiameter = filtered.filter(
    (row) => numberValue(row, COL.diameter) === null
  ).length;

  const missingTime = filtered.filter(
    (row) => numberValue(row, COL.time) === null
  ).length;
  // Scientific data-integrity checks. These flag records for review;
  // they never modify or delete the original measurements.
  const integrity = useMemo(() => {
    const measurementColumns = [
      { key: COL.pressure, label: "Ambient pressure", unit: "mmHg" },
      { key: COL.diameter, label: "Initial droplet diameter", unit: "mm" },
      {
        key: COL.extinction,
        label: "Visible flame extinction diameter",
        unit: "mm",
      },
      { key: COL.rate, label: "Burning rate", unit: "source unit unverified" },
      { key: COL.time, label: "Burn time", unit: "s" },
    ];

    const missingMeasurements = measurementColumns.map((column) => {
      const count = rows.filter(
        (row) => numberValue(row, column.key) === null
      ).length;

      return {
        ...column,
        count,
        percentage: rows.length
          ? ((count / rows.length) * 100).toFixed(1)
          : "0.0",
      };
    });

    const zeroPressure = rows.filter(
      (row) => numberValue(row, COL.pressure) === 0
    );

    const highPressure = rows.filter((row) => {
      const value = numberValue(row, COL.pressure);
      return value !== null && value > 1500;
    });

    const zeroExtinction = rows.filter(
      (row) => numberValue(row, COL.extinction) === 0
    );

    const identifierCounts = new Map<string, number>();

    for (const row of rows) {
      const id = row[COL.id]?.trim();
      if (id) {
        identifierCounts.set(id, (identifierCounts.get(id) ?? 0) + 1);
      }
    }

    const duplicateIdentifiers = [...identifierCounts.entries()]
      .filter(([, count]) => count > 1)
      .map(([id, count]) => ({ id, count }));

    return {
      missingMeasurements,
      zeroPressure,
      highPressure,
      zeroExtinction,
      duplicateIdentifiers,
    };
  }, [rows]);
  const exportCsv = () => {
    const csv = Papa.unparse(filtered);
    const blob = createUtf8CsvBlob(csv);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "siderospace-flex-filtered.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const pageSize = 12;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleRows = filtered.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  useEffect(() => {
    setPage(0);
  }, [fuel, outcome, search]);

  return (
    <main className="flex-page">
      <header className="flex-topbar">
        <div className="flex-source-status">
          <span className="flex-status-dot" /> LOCAL DATASET
        </div>
      </header>

      <div className="flex-content">
        <div className="flex-eyebrow">
          <Database size={15} /> NASA EXPERIMENT DATA
        </div>
        <div className="flex-heading-row">
          <div className="flex-heading-copy">
            <h1>FLEX <span>Explorer.</span></h1>
            <p className="flex-subtitle">
              Explore recorded droplet-combustion experiments from the
              PSI-69 FLEX table.
            </p>
            <button
              className="flex-export"
              onClick={exportCsv}
              disabled={!filtered.length}
            >
              <Download size={16} /> Export filtered CSV
            </button>
          </div>
          <figure className="flex-hero-visual">
            <Image
              src="/images/flame.jpg"
              alt="A small luminous droplet flame against a dark background"
              fill
              preload
              sizes="(max-width: 700px) 100vw, 48vw"
              className="flex-hero-image"
            />
            <figcaption className="flex-hero-caption">
              <span>FLEX · PSI-69</span>
              <span>Droplet combustion</span>
            </figcaption>
          </figure>
        </div>

        {error && (
          <div className="flex-error">
            <strong>Dataset unavailable</strong>
            <p>{error}</p>
            <p>
              Check that <code>public/data/flex/flex.csv</code> exists.
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex-loading">Loading and parsing experiment records…</div>
        ) : !error ? (
          <>
            <ExperimentResearchContext
              content={flexResearchContent}
              showSources={false}
            />

            <section className="flex-filter-panel" id="data-explorer">
              <div className="flex-filter-title">
                <SlidersHorizontal size={17} />
                <strong>Filter experiments</strong>
              </div>
              <div className="flex-filters">
                <label>
                  Fuel
                  <select value={fuel} onChange={(e) => setFuel(e.target.value)}>
                    <option value="All">All fuels</option>
                    {fuels.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Test outcome
                  <select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
                    <option value="All">All outcomes</option>
                    {outcomes.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="flex-search-label">
                  Search records
                  <span className="flex-search-input">
                    <Search size={16} />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Test number, ID, fuel…"
                    />
                  </span>
                </label>
              </div>
              <p className="flex-filter-note">
                Filters apply to both charts and the experiment table.
              </p>
            </section>

            <section className="flex-chart-grid">
              <article className="flex-chart-card">
                <div className="flex-card-heading">
                  <div>
                    <span>RELATIONSHIP EXPLORER</span>
                    <h2>Droplet diameter vs. burning rate</h2>
                  </div>
                  <span className="flex-unit">mm / source unit unverified</span>
                </div>
                <p className="flex-chart-description">
                  Each point is one record with both measurements available.
                </p>
                <div className="flex-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 12, right: 18, bottom: 20, left: 4 }}>
                      <CartesianGrid stroke="#293244" strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        dataKey="x"
                        name="Initial droplet diameter"
                        unit=" mm"
                        tick={{ fill: "#9ca8bb", fontSize: 11 }}
                        label={{ value: "Initial droplet diameter (mm)", position: "insideBottom", offset: -12, fill: "#9ca8bb", fontSize: 11 }}
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        name="Recorded burning-rate field"
                        tick={{ fill: "#9ca8bb", fontSize: 11 }}
                        label={{
                          value: "Recorded burning-rate field (source unit unverified)",
                          angle: -90,
                          position: "insideLeft",
                          fill: "#9ca8bb",
                          fontSize: 11,
                        }}
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        contentStyle={{ background: "#111827", border: "1px solid #354158", borderRadius: 10, color: "#f1f5f9" }}
                        formatter={(value, name) => [String(value), String(name)]}
                        labelFormatter={(_, payload) => {
                          const p = payload?.[0]?.payload;
                          return p ? `Test ${p.test} · ${p.fuel}` : "";
                        }}
                      />
                      <Scatter name="Recorded tests" data={ratePoints} fill="#a78bfa" fillOpacity={0.8} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-chart-foot">
                  <span>{ratePoints.length} plotted records</span>
                  <span>{missingDiameter} missing diameter · {missingRate} missing rate</span>
                </div>
              </article>

              <article className="flex-chart-card">
                <div className="flex-card-heading">
                  <div>
                    <span>RELATIONSHIP EXPLORER</span>
                    <h2>Droplet diameter vs. burn time</h2>
                  </div>
                  <span className="flex-unit">mm / s</span>
                </div>
                <p className="flex-chart-description">
                  Only records with both diameter and burn time are plotted.
                </p>
                <div className="flex-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 12, right: 18, bottom: 20, left: 4 }}>
                      <CartesianGrid stroke="#293244" strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        dataKey="x"
                        name="Initial droplet diameter"
                        unit=" mm"
                        tick={{ fill: "#9ca8bb", fontSize: 11 }}
                        label={{ value: "Initial droplet diameter (mm)", position: "insideBottom", offset: -12, fill: "#9ca8bb", fontSize: 11 }}
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        name="Burn time"
                        unit=" s"
                        tick={{ fill: "#9ca8bb", fontSize: 11 }}
                        label={{ value: "Burn time (s)", angle: -90, position: "insideLeft", fill: "#9ca8bb", fontSize: 11 }}
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        contentStyle={{ background: "#111827", border: "1px solid #354158", borderRadius: 10, color: "#f1f5f9" }}
                        formatter={(value, name) => [String(value), String(name)]}
                        labelFormatter={(_, payload) => {
                          const p = payload?.[0]?.payload;
                          return p ? `Test ${p.test} · ${p.fuel}` : "";
                        }}
                      />
                      <Scatter name="Recorded tests" data={timePoints} fill="#fb923c" fillOpacity={0.8} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-chart-foot">
                  <span>{timePoints.length} plotted records</span>
                  <span>{missingDiameter} missing diameter · {missingTime} missing burn time</span>
                </div>
              </article>
            </section>

            <section className="flex-table-card">
              <div className="flex-table-heading">
                <div>
                  <span>RAW EXPERIMENT RECORDS</span>
                  <h2>Dataset catalogue</h2>
                  <p>Values are displayed as recorded; blanks remain missing.</p>
                </div>
                <span className="flex-record-count">{filtered.length} records</span>
              </div>
              <div className="flex-table-scroll">
                <table className="flex-table">
                  <thead>
                    <tr>
                      <th>Test</th>
                      <th>Identifier</th>
                      <th>Fuel</th>
                      <th>Pressure (mmHg)</th>
                      <th>Initial diameter (mm)</th>
                      <th>Burning rate (source unit unverified)</th>
                      <th>Burn time (s)</th>
                      <th>Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map((row, i) => (
                      <tr key={`${row[COL.test]}-${row[COL.id] || i}`}>
                        <td>{row[COL.test] || "—"}</td>
                        <td>{row[COL.id] || "—"}</td>
                        <td>{row[COL.fuel] || "—"}</td>
                        <td>{row[COL.pressure] || "—"}</td>
                        <td>{row[COL.diameter] || "—"}</td>
                        <td>{row[COL.rate] || "—"}</td>
                        <td>{row[COL.time] || "—"}</td>
                        <td><span className="flex-outcome">{row[COL.outcome] || "—"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!visibleRows.length && (
                  <div className="flex-empty">No records match these filters.</div>
                )}
              </div>
              <div className="flex-pagination">
                <span>
                  Showing {filtered.length ? page * pageSize + 1 : 0}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
                </span>
                <div>
                  <button disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Previous</button>
                  <span>Page {page + 1} of {pageCount}</span>
                  <button disabled={page >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}>Next</button>
                </div>
              </div>
            </section>

            <section className="flex-integrity-panel">
              <div className="flex-integrity-header">
                <div className="flex-integrity-icon">
                  <ShieldCheck size={21} />
                </div>
                <div>
                  <span className="flex-integrity-kicker">
                    DATA QUALITY / PROVENANCE
                  </span>
                  <h2>Data Integrity</h2>
                  <p>
                    Validation results for the complete loaded FLEX dataset.
                    Original measurements are preserved.
                  </p>
                </div>
              </div>

              <div className="flex-integrity-grid">
                <article className="flex-integrity-metric">
                  <span>Loaded records</span>
                  <strong>{rows.length}</strong>
                  <small>Records retained by the explorer</small>
                </article>

                <article className="flex-integrity-metric">
                  <span>Missing burning rates</span>
                  <strong>
                    {integrity.missingMeasurements.find(
                      (item) => item.key === COL.rate
                    )?.count ?? 0}
                  </strong>
                  <small>Not imputed or replaced</small>
                </article>

                <article className="flex-integrity-metric">
                  <span>Zero-pressure records</span>
                  <strong>{integrity.zeroPressure.length}</strong>
                  <small>Require source interpretation</small>
                </article>

                <article className="flex-integrity-metric">
                  <span>Repeated identifiers</span>
                  <strong>{integrity.duplicateIdentifiers.length}</strong>
                  <small>Unique test numbers are a separate check</small>
                </article>
              </div>

              <div className="flex-integrity-details">
                <h3>Missing measurements</h3>

                <div className="flex-integrity-missing-list">
                  {integrity.missingMeasurements.map((item) => (
                    <div className="flex-integrity-missing-row" key={item.key}>
                      <span>{item.label}</span>
                      <strong>
                        {item.count} / {rows.length} ({item.percentage}%)
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-integrity-details">
                <h3>Records requiring review</h3>

                <ul className="flex-integrity-warnings">
                  <li>
                    <strong>{integrity.zeroPressure.length} zero-pressure records.</strong>
                    {" "}A zero is flagged for investigation, not automatically
                    classified as missing or invalid.
                  </li>
                  <li>
                    <strong>{integrity.highPressure.length} records above 1,500 mmHg.</strong>
                    {" "}Verify the intended pressure conditions against the source.
                  </li>
                  <li>
                    <strong>{integrity.zeroExtinction.length} zero extinction-diameter records.</strong>
                    {" "}The meaning of zero needs confirmation from the dataset
                    documentation.
                  </li>
                  {integrity.duplicateIdentifiers.map((item) => (
                    <li key={item.id}>
                      <strong>{item.id}</strong> appears {item.count} times.
                      {" "}Retain both records until their meaning is verified.
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-integrity-source">
                <ShieldCheck size={17} />
                <p>
                  <strong>Reference comparison passed.</strong> The local CSV was
                  compared with the downloaded NASA reference: 274 rows and zero
                  field-level differences. This confirms agreement between those
                  files, not independent verification of every measurement.
                </p>
              </div>
            </section>

            <section className="flex-integrity">
              <ShieldCheck size={20} />
              <div>
                <strong>Research integrity and limitations</strong>
                <p>
                  Source file: PSI-69_Experimental table_FLEX.csv. Missing
                  numeric measurements are excluded from relevant charts; they
                  are not imputed. Scatter plots show observed
                  associations and do not establish causation. Verify source
                  documentation before drawing scientific conclusions.
                </p>
              </div>
            </section>

            <ExperimentResearchSources content={flexResearchContent} />
          </>
        ) : null}

        <footer className="flex-footer">
          <span>SideroSpace / FLEX EXPLORER</span>
          <Link href="/dashboard">Return to Mission Control</Link>
        </footer>
      </div>
    </main>
  );
}
