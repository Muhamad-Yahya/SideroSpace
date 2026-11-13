
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import {
  BarChart3,
  Database,
  Download,
  Info,
  LoaderCircle,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BASS_FINAL_OXYGEN_COLUMN,
  BASS_INITIAL_OXYGEN_COLUMN,
  FLEX_INITIAL_OXYGEN_COLUMN,
  getNumericColumnRecords,
  isVariableAvailableForDataset,
  parseCsvRows,
  resolveCompareDataset,
  resolveCsvColumn,
  type CompareDataset,
} from "@/lib/compare-data";
import { decodeCsvBytes } from "@/lib/csv-encoding";
import {
  getSearchParam,
  investigationHref,
  parseExperimentContext,
  researchHref,
} from "@/lib/research-context";
import {
  setResearchSearchParam,
  setResearchSearchParams,
  useResearchUrl,
} from "@/lib/use-research-url";

type Row = Record<string, string>;
type Dataset = CompareDataset;
type Experiment = "FLEX" | "BASS-II";

type Variable = {
  id: string;
  label: string;
  unit: string;
  description: string;
  flexColumn?: string;
  bassColumn?: string;
  flexConvert?: (n: number) => number;
  bassConvert?: (n: number) => number;
  comparable: boolean;
};

type RecordItem = {
  id: string;
  experiment: Experiment;
  fuel: string;
  value: number;
  raw: Row;
};

const variables: Variable[] = [
  {
    id: "oxygen",
    label: "Initial oxygen",
    unit: "%",
    description: "Initial oxygen concentration.",
    flexColumn: FLEX_INITIAL_OXYGEN_COLUMN,
    bassColumn: BASS_INITIAL_OXYGEN_COLUMN,
    flexConvert: (n) => n * 100,
    bassConvert: (n) => n,
    comparable: true,
  },
  {
    id: "finalOxygen",
    label: "Final oxygen",
    unit: "%",
    description: "Final calibrated oxygen concentration.",
    bassColumn: BASS_FINAL_OXYGEN_COLUMN,
    comparable: false,
  },
  {
    id: "initialCO2",
    label: "Initial CO₂",
    unit: "% by volume",
    description: "Initial carbon dioxide concentration.",
    bassColumn: "Initial CO2 % by vol",
    comparable: false,
  },
  {
    id: "finalCO2",
    label: "Final CO₂",
    unit: "% by volume",
    description: "Final carbon dioxide concentration.",
    bassColumn: "Final CO2 % by vol",
    comparable: false,
  },
  {
    id: "initialCO",
    label: "Initial carbon monoxide",
    unit: "ppm",
    description: "Initial carbon monoxide concentration.",
    bassColumn: "Initial CO (ppm)",
    comparable: false,
  },
  {
    id: "finalCO",
    label: "Final carbon monoxide",
    unit: "ppm",
    description: "Final carbon monoxide concentration.",
    bassColumn: "Final CO (ppm)",
    comparable: false,
  },
  {
    id: "burningRate",
    label: "Burning rate",
    unit: "source unit unverified",
    description: "Recorded FLEX burning-rate field. Confirm its physical unit against source documentation.",
    flexColumn: "Burning rate; mm",
    comparable: false,
  },
  {
    id: "burnTime",
    label: "Burn time",
    unit: "s",
    description: "Recorded FLEX burn time.",
    flexColumn: "Burn time; s",
    comparable: false,
  },
  {
    id: "dropletDiameter",
    label: "Initial droplet diameter",
    unit: "mm",
    description: "Initial FLEX droplet diameter.",
    flexColumn: "Droplet initial diameter; mm",
    comparable: false,
  },
  {
    id: "extinctionDiameter",
    label: "Visible flame extinction diameter",
    unit: "mm",
    description: "Recorded visible flame extinction diameter.",
    flexColumn: "Visible flame extinction diameter; mm",
    comparable: false,
  },
];

async function readCsv(
  path: string,
  expectedColumns: string[],
  encoding: string
): Promise<Row[]> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to load ${path}`);

  const contents = decodeCsvBytes(
    new Uint8Array(await response.arrayBuffer()),
    encoding
  );
  const rows = parseCsvRows(contents, path);
  const headers = Object.keys(rows[0] ?? {});
  const missingColumns = expectedColumns.filter(
    (column) => resolveCsvColumn(headers, column) === null
  );

  if (missingColumns.length > 0) {
    throw new Error(
      `Missing expected column${missingColumns.length > 1 ? "s" : ""} in ${path}: ${missingColumns.join(", ")}`
    );
  }

  return rows;
}

function format(value: number | null, digits = 3) {
  return value === null ? "—" : value.toLocaleString(undefined, {
    maximumFractionDigits: digits,
  });
}

function average(values: number[]) {
  return values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : null;
}

function median(values: number[]) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function makeBins(values: number[], count = 8) {
  if (!values.length) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = (max - min) / count || 1;

  return Array.from({ length: count }, (_, i) => {
    const lower = min + i * width;
    const upper = i === count - 1 ? max + 0.000001 : lower + width;

    return {
      range: `${format(lower, 2)}–${format(i === count - 1 ? max : upper, 2)}`,
      lower,
      upper,
    };
  });
}

function getFuel(row: Row, experiment: Experiment) {
  const raw =
    experiment === "FLEX"
      ? row["Fuel"]
      : row["Fuel Sample Material"];

  return raw?.trim() || "Not recorded";
}

const RANGE_PRESETS = [
  { label: "Any value", min: "", max: "" },
  { label: "Below 10", min: "", max: "10" },
  { label: "10–20", min: "10", max: "20" },
  { label: "20–40", min: "20", max: "40" },
  { label: "40–60", min: "40", max: "60" },
  { label: "60–80", min: "60", max: "80" },
  { label: "80 and above", min: "80", max: "" },
];

export default function ComparePage() {
  const router = useRouter();
  const urlSearch = useResearchUrl();
  const experimentContext = parseExperimentContext(urlSearch);
  const contextExperiment =
    experimentContext.status === "valid"
      ? experimentContext.experiment
      : null;
  const requestedDataset = getSearchParam(urlSearch, "dataset");
  const dataset = useMemo(
    () => resolveCompareDataset(urlSearch),
    [urlSearch],
  );
  const datasetConflict =
    (requestedDataset === "FLEX" || requestedDataset === "BASS-II") &&
    contextExperiment !== null &&
    requestedDataset !== contextExperiment;
  const requestedVariable = getSearchParam(urlSearch, "variable");
  const variableId =
    variables.some((item) => item.id === requestedVariable)
      ? requestedVariable!
      : dataset === "BASS-II"
        ? "finalOxygen"
        : dataset === "FLEX"
          ? "burnTime"
          : "oxygen";
  const fuel = getSearchParam(urlSearch, "fuel") ?? "all";
  const minimum = getSearchParam(urlSearch, "min") ?? "";
  const maximum = getSearchParam(urlSearch, "max") ?? "";
  const search = getSearchParam(urlSearch, "search") ?? "";
  const [flexRows, setFlexRows] = useState<Row[]>([]);
  const [bassRows, setBassRows] = useState<Row[]>([]);
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    let active = true;

    Promise.all([
      readCsv(
        "/data/flex/flex.csv",
        variables.flatMap((item) => item.flexColumn ?? []),
        "windows-1252"
      ),
      readCsv(
        "/data/bass-ii/bass-ii.csv",
        variables.flatMap((item) => item.bassColumn ?? []),
        "utf-8"
      ),
    ])
      .then(([flex, bass]) => {
        if (!active) return;
        setFlexRows(flex);
        setBassRows(bass);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Dataset loading failed.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const availableVariables = variables.filter((item) =>
    isVariableAvailableForDataset(item, dataset)
  );
  const variableIsAvailable = availableVariables.some(
    (item) => item.id === variableId
  );
  const activeVariableId = variableIsAvailable
    ? variableId
    : dataset === "BASS-II"
      ? "finalOxygen"
      : dataset === "FLEX"
        ? "burnTime"
        : "oxygen";

  const variable = variables.find((item) => item.id === activeVariableId)!;

  const allRecords = useMemo<RecordItem[]>(() => {
    const records: RecordItem[] = [];

    function append(rows: Row[], experiment: Experiment) {
      const column =
        experiment === "FLEX" ? variable.flexColumn : variable.bassColumn;

      const converter =
        experiment === "FLEX" ? variable.flexConvert : variable.bassConvert;

      if (!column) return;

      const numericRecords = getNumericColumnRecords(rows, column, converter);
      numericRecords.forEach(({ index, raw, value }) => {
        records.push({
          id: `${experiment}-${index}`,
          experiment,
          fuel: getFuel(raw, experiment),
          value,
          raw,
        });
      });
    }

    if (dataset !== "BASS-II") append(flexRows, "FLEX");
    if (dataset !== "FLEX") append(bassRows, "BASS-II");

    return records;
  }, [flexRows, bassRows, dataset, variable]);

  const fuels = useMemo(
    () => [...new Set(allRecords.map((record) => record.fuel))].sort(),
    [allRecords]
  );

  const filteredRecords = useMemo(() => {
    const min = minimum.trim() === "" ? null : Number(minimum);
    const max = maximum.trim() === "" ? null : Number(maximum);
    const query = search.trim().toLowerCase();
    const flexTest = search.startsWith("FLEX:")
      ? search.slice("FLEX:".length)
      : null;
    const bassTest = search.startsWith("BASS-II:")
      ? search.slice("BASS-II:".length)
      : null;

    return allRecords.filter((record) => {
      if (fuel !== "all" && record.fuel !== fuel) return false;
      if (min !== null && Number.isFinite(min) && record.value < min) return false;
      if (max !== null && Number.isFinite(max) && record.value > max) return false;

      if (flexTest !== null) {
        return (
          record.experiment === "FLEX" &&
          record.raw["FLEX Test #"]?.trim() === flexTest
        );
      }

      if (bassTest !== null) {
        return (
          record.experiment === "BASS-II" &&
          record.raw["Test #"]?.trim() === bassTest
        );
      }

      if (
        query &&
        !Object.values(record.raw).some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        )
      ) {
        return false;
      }

      return true;
    });
  }, [allRecords, fuel, minimum, maximum, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / pageSize)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedRecords = filteredRecords.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const flexValues = filteredRecords
    .filter((record) => record.experiment === "FLEX")
    .map((record) => record.value);

  const bassValues = filteredRecords
    .filter((record) => record.experiment === "BASS-II")
    .map((record) => record.value);

  const combinedValues = filteredRecords.map((record) => record.value);
  const bins = makeBins(combinedValues);

  const chartData = bins.map((bin) => {
    const count = (values: number[]) =>
      values.filter((value) => value >= bin.lower && value < bin.upper).length;

    return {
      range: bin.range,
      FLEX: count(flexValues),
      "BASS-II": count(bassValues),
      Records: count(combinedValues),
    };
  });

  const flexMissing = dataset === "BASS-II"
    ? null
    : flexRows.length - allRecords.filter((r) => r.experiment === "FLEX").length;

  const bassMissing = dataset === "FLEX"
    ? null
    : bassRows.length - allRecords.filter((r) => r.experiment === "BASS-II").length;

  const flexMean = average(flexValues);
  const bassMean = average(bassValues);
  const overallMean = average(combinedValues);
  const flexMedian = median(flexValues);
  const bassMedian = median(bassValues);

  function changeDataset(next: Dataset, recordSearch?: string | null) {
    const currentVariable = variables.find((item) => item.id === activeVariableId)!;

    const supported =
      next === "all"
        ? currentVariable.comparable
        : next === "FLEX"
          ? Boolean(currentVariable.flexColumn)
          : Boolean(currentVariable.bassColumn);

    const updates: Array<readonly [string, string | null]> = [
      ["dataset", next],
      ["fuel", null],
    ];
    if (next !== "all") updates.push(["experiment", next]);
    if (recordSearch !== undefined) updates.push(["search", recordSearch]);
    if (
      !supported ||
      !variables.some((item) => item.id === requestedVariable)
    ) {
      updates.push([
        "variable",
        next === "BASS-II" ? "finalOxygen" : next === "FLEX" ? "burnTime" : "oxygen",
      ]);
    }
    setResearchSearchParams(updates);
    setSelected(null);
    setCurrentPage(1);
  }
  
const exportFilteredRecords = () => {
  if (filteredRecords.length === 0) return;

  const rows = filteredRecords.map((record) => ({
    ExportedAt: new Date().toISOString(),
    ActiveDataset: dataset,
    SelectedMeasurement: activeVariableId,
    FuelFilter: fuel || "All fuels",
    MinimumValue: minimum || "No minimum",
    MaximumValue: maximum || "No maximum",
    DatasetSource:
      record.experiment === "FLEX"
        ? "public/data/flex/flex.csv"
        : "public/data/bass-ii/bass-ii.csv",
    ...record.raw,
  }));

  const csv = Papa.unparse(rows);
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "siderospace-filtered-records.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

  function resetFilters() {
    setResearchSearchParams([
      ["fuel", null],
      ["min", null],
      ["max", null],
      ["search", null],
    ]);
    setSelected(null);
    setCurrentPage(1);
  }

  return (
    <main className="min-h-screen bg-[#070914] px-5 py-7 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <header className="mt-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-300">
            SideroSpace / RESEARCH INTELLIGENCE
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
            Experiment <span className="text-violet-300">Analysis</span>
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            Filter real experiment records, inspect individual measurements,
            and examine descriptive evidence without confusing correlation with causation.
          </p>
          {contextExperiment === "SAFFIRE-I" ? (
            <div className="mt-5 rounded-2xl border border-orange-200/20 bg-orange-200/[0.05] p-4 text-sm leading-6 text-orange-100/90">
              <strong>SAFFIRE-I context · Numeric comparison unavailable.</strong>{" "}
              The local SAFFIRE-I collection contains pre-test image frames, not
              a numeric measurement table. This view shows the available FLEX
              and BASS-II data only.{" "}
              <Link className="underline underline-offset-4" href="/saffire#explorer">
                Open SAFFIRE-I frames
              </Link>
              <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <Link href={researchHref("research", "SAFFIRE-I")} className="underline underline-offset-4">
                  SAFFIRE-I evidence
                </Link>
                <Link href={researchHref("ask", "SAFFIRE-I")} className="underline underline-offset-4">
                  Ask about SAFFIRE-I
                </Link>
              </span>
            </div>
          ) : contextExperiment ? (
            <div className="mt-5 rounded-2xl border border-violet-200/15 bg-violet-200/[0.04] p-4 text-sm leading-6 text-slate-300">
              Comparison context: <strong className="text-white">{contextExperiment}</strong>.
              {dataset === "all"
                ? " Viewing the available FLEX and BASS-II data."
                : ` Viewing ${dataset} records; select “Compatible experiments” to add the other dataset.`}{" "}
              The cross-dataset option compares normalized initial oxygen only;
              a shared field does not make the experiments scientifically equivalent.
              <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <Link href={investigationHref(contextExperiment)} className="underline underline-offset-4">
                  Investigation page
                </Link>
                <Link href={researchHref("research", contextExperiment)} className="underline underline-offset-4">
                  Evidence
                </Link>
                <Link href={researchHref("ask", contextExperiment)} className="underline underline-offset-4">
                  Ask about it
                </Link>
              </span>
            </div>
          ) : null}
          {experimentContext.status === "invalid" && (
            <p role="status" className="mt-4 text-sm text-amber-200">
              Unknown investigation “{experimentContext.value}”. Showing the
              available comparison datasets instead.
            </p>
          )}
          {requestedDataset !== null &&
            requestedDataset !== "all" &&
            requestedDataset !== "FLEX" &&
            requestedDataset !== "BASS-II" && (
              <p role="status" className="mt-2 text-sm text-amber-200">
                Unknown dataset “{requestedDataset}”. Showing compatible datasets.
              </p>
            )}
          {datasetConflict && (
            <p role="status" className="mt-2 text-sm text-amber-200">
              The selected dataset does not match the investigation context.
              Showing the context’s available data instead.
            </p>
          )}
          {requestedVariable && !variables.some((item) => item.id === requestedVariable) && (
            <p role="status" className="mt-2 text-sm text-amber-200">
              Unknown measurement “{requestedVariable}”. Showing an available measurement.
            </p>
          )}
          {!variableIsAvailable && (
            <p role="status" className="mt-2 text-sm text-amber-200">
              That measurement is unavailable for this dataset selection; showing{" "}
              {variable.label}.
            </p>
          )}
        </header>

        {loading ? (
          <div className="mt-12 flex items-center gap-3 text-slate-400">
            <LoaderCircle className="animate-spin" size={20} />
            Loading datasets...
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-400/20 bg-red-400/5 p-6 text-red-200">
            {error}
          </div>
        ) : (
          <>
            <section className="mt-10 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-7">
              <label className="text-sm text-slate-300">
                Dataset
                <select
                  value={dataset}
                  onChange={(e) => changeDataset(e.target.value as Dataset)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#111528] px-4 py-3 text-white"
                >
                  <option value="all">Compatible experiments</option>
                  <option value="FLEX">FLEX only</option>
                  <option value="BASS-II">BASS-II only</option>
                </select>
              </label>

              <label className="text-sm text-slate-300">
                Measurement
                <select
                  value={activeVariableId}
                  onChange={(e) => {
                    setResearchSearchParams([
                      ["variable", e.target.value],
                      ["min", null],
                      ["max", null],
                    ]);
                    setSelected(null);
                    setCurrentPage(1);
                  }}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#111528] px-4 py-3 text-white"
                >
                  {availableVariables.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-slate-300">
                Fuel / material
                <select
                  value={fuel}
                  onChange={(e) => {
                    setResearchSearchParam(
                      "fuel",
                      e.target.value === "all" ? null : e.target.value,
                    );
                    setCurrentPage(1);
                  }}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#111528] px-4 py-3 text-white"
                >
                  <option value="all">All fuel types</option>
                  {fuels.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-slate-300">
                Measurement range
                <select
                  value={`${minimum}|${maximum}`}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split("|");
                    setResearchSearchParams([
                      ["min", min || null],
                      ["max", max || null],
                    ]);
                    setCurrentPage(1);
                  }}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#111528] px-4 py-3 text-white"
                >
                  {RANGE_PRESETS.map((preset) => (
                    <option
                      key={`${preset.min}|${preset.max}`}
                      value={`${preset.min}|${preset.max}`}
                    >
                      {preset.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:col-span-2 md:grid-cols-3 lg:col-span-3">
                {/* SAFFIRE */}
                <label className="text-sm text-slate-300">
                  SAFFIRE · Image frames
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        router.push(
                          `/saffire?frame=${encodeURIComponent(e.target.value)}`
                        );
                      }
                    }}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#111528] px-4 py-3 text-white"
                  >
                    <option value="">Select a SAFFIRE frame</option>
                    {Array.from({ length: 764 }, (_, i) => {
                      const frame = String(i + 1).padStart(4, "0");
                      return (
                        <option key={frame} value={frame}>
                          Frame {frame}
                        </option>
                      );
                    })}
                  </select>
                </label>

                {/* FLEX */}
                <label className="text-sm text-slate-300">
                  FLEX · Test records
                  <select
                    value={search.startsWith("FLEX:") ? search.slice("FLEX:".length) : ""}
                    onChange={(e) => {
                      changeDataset(
                        "FLEX",
                        e.target.value ? `FLEX:${e.target.value}` : null,
                      );
                      setCurrentPage(1);
                    }}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#111528] px-4 py-3 text-white"
                  >
                    <option value="">All FLEX records</option>
                    {flexRows.map((row, index) => {
                      const test = row["FLEX Test #"]?.trim();
                      if (!test) return null;

                      return (
                        <option key={`flex-${index}`} value={test}>
                          Test {test}
                        </option>
                      );
                    })}
                  </select>
                </label>

                {/* BASS-II */}
                <label className="text-sm text-slate-300">
                  BASS-II · Test records
                  <select
                    value={search.startsWith("BASS-II:") ? search.slice("BASS-II:".length) : ""}
                    onChange={(e) => {
                      changeDataset(
                        "BASS-II",
                        e.target.value ? `BASS-II:${e.target.value}` : null,
                      );
                      setCurrentPage(1);
                    }}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#111528] px-4 py-3 text-white"
                  >
                    <option value="">All BASS-II records</option>
                    {bassRows.map((row, index) => {
                      const test = row["Test #"]?.trim();
                      if (!test) return null;

                      return (
                        <option key={`bass-${index}`} value={test}>
                          Test {test}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </div>

              <p className="text-xs leading-5 text-slate-500 sm:col-span-2 lg:col-span-3">
                Ranges apply to the selected measurement’s units (for example,
                percent for oxygen or seconds for burn time). They are generic
                filters, not safety thresholds.
              </p>

              <div className="flex items-end lg:col-span-3">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5"
                >
                  <X size={15} /> Reset filters
                </button>
              </div>
            </section>

            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Matching records", filteredRecords.length.toLocaleString()],
                ["Mean", format(overallMean)],
                ["FLEX valid", flexValues.length.toLocaleString()],
                ["BASS-II valid", bassValues.length.toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <p className="text-sm text-slate-400">{label}</p>
                  <p className="mt-3 text-3xl font-semibold">{value}</p>
                  <p className="mt-2 text-xs text-slate-500">{variable.unit}</p>
                </div>
              ))}
            </section>

            <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0c1020]">
              <div className="border-b border-white/10 p-6 sm:p-8">
                <div className="flex items-center gap-2 text-sm text-violet-300">
                  <BarChart3 size={17} /> FILTERED DISTRIBUTION
                </div>
                <h2 className="mt-3 text-2xl font-semibold">{variable.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{variable.description}</p>
              </div>

              <div className="p-4 sm:p-8">
                {chartData.length ? (
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 8 }}>
                        <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="4 4" vertical={false} />
                        <XAxis dataKey="range" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#111528", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#fff" }} />
                        {dataset === "all" ? (
                          <>
                            <Bar dataKey="FLEX" fill="#a78bfa" radius={[5, 5, 0, 0]} />
                            <Bar dataKey="BASS-II" fill="#22d3ee" radius={[5, 5, 0, 0]} />
                          </>
                        ) : (
                          <Bar dataKey="Records" fill={dataset === "FLEX" ? "#a78bfa" : "#22d3ee"} radius={[5, 5, 0, 0]} />
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="py-12 text-center text-sm text-slate-500">
                    No matching numeric records. Try widening the range or resetting filters.
                  </p>
                )}
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-sm text-violet-300">
                <Database size={17} /> DATA-DRIVEN SUMMARY
              </div>
              <h2 className="mt-3 text-2xl font-semibold">What the filtered records show</h2>

              <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                <p>
                  The current filters return <strong>{filteredRecords.length}</strong> valid numeric
                  records for <strong>{variable.label}</strong>.
                </p>
                {dataset === "all" && variable.comparable ? (
                  <p>
                    FLEX has <strong>{flexValues.length}</strong> matching values
                    (mean {format(flexMean)} {variable.unit}; median {format(flexMedian)}).
                    BASS-II has <strong>{bassValues.length}</strong> matching values
                    (mean {format(bassMean)} {variable.unit}; median {format(bassMedian)}).
                  </p>
                ) : (
                  <p>
                    The selected dataset has a mean of <strong>{format(overallMean)}</strong>
                    {" "}and median of <strong>{format(median(combinedValues))}</strong>
                    {" "}{variable.unit}.
                  </p>
                )}
                {(flexMissing !== null || bassMissing !== null) && (
                  <p>
                    Numeric measurement coverage in the loaded table:{" "}
                    {flexMissing !== null && (
                      <>
                        FLEX {flexRows.length - flexMissing}/{flexRows.length}
                        {" "}valid; {flexMissing} missing or nonnumeric
                      </>
                    )}
                    {flexMissing !== null && bassMissing !== null && "; "}
                    {bassMissing !== null && (
                      <>
                        BASS-II {bassRows.length - bassMissing}/{bassRows.length}
                        {" "}valid; {bassMissing} missing or nonnumeric
                      </>
                    )}
                    . Missing values are excluded, not imputed.
                  </p>
                )}
                {flexValues.length > 0 && bassValues.length > 0 && dataset === "all" && variable.comparable && (
                  <p>
                    The difference between the observed sample means is{" "}
                    <strong>{format(Math.abs((flexMean ?? 0) - (bassMean ?? 0)))}</strong>
                    {" "}{variable.unit}. This is a descriptive difference only; it does not
                    demonstrate that one experiment caused a different outcome.
                  </p>
                )}
                <p className="text-slate-400">
                  Missing or nonnumeric measurements are excluded from these calculations.
                  Filtering changes the sample being summarized, and different experiment
                  configurations can limit direct interpretation.
                </p>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-300/15 bg-amber-300/[0.035] p-4">
                <Info className="mt-1 shrink-0 text-amber-200" size={18} />
                <p className="text-xs leading-6 text-slate-400">
                  These statistics describe recorded data. They do not independently establish
                  causation, fire risk, or operational safety thresholds.
                </p>
              </div>
            </section>

            <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#0c1020]">
              <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                  <h2 className="text-2xl font-semibold">Inspect individual records</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Select a row to inspect its original dataset fields.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={exportFilteredRecords}
                  disabled={filteredRecords.length === 0}
                  className="shrink-0 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/20 disabled:opacity-40"
                >
                  <Download className="mr-2 inline h-4 w-4" />
                  Export CSV ({filteredRecords.length})
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-white/[0.035] text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Experiment</th>
                      <th className="px-5 py-4">Record</th>
                      <th className="px-5 py-4">Fuel / material</th>
                      <th className="px-5 py-4">{variable.label} ({variable.unit})</th>
                      <th className="px-5 py-4">Inspect</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRecords.map((record) => (
                      <tr key={record.id} className="border-t border-white/[0.06] hover:bg-white/[0.025]">
                        <td className="px-5 py-4">{record.experiment}</td>
                        <td className="px-5 py-4 text-slate-400">
                          {record.experiment === "FLEX"
                            ? record.raw["FLEX Test #"] || record.id
                            : record.raw["Test #"] || record.id}
                        </td>
                        <td className="px-5 py-4">{record.fuel}</td>
                        <td className="px-5 py-4 font-mono">{format(record.value, 5)}</td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelected(record)}
                            className="rounded-lg border border-violet-400/20 px-3 py-1.5 text-xs text-violet-200 hover:bg-violet-400/10"
                          >
                            View record
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-400">
                  Showing{" "}
                  {filteredRecords.length === 0
                    ? 0
                    : (safePage - 1) * pageSize + 1}
                  {"–"}
                  {Math.min(safePage * pageSize, filteredRecords.length)} of{" "}
                  {filteredRecords.length} records
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={safePage === 1}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="min-w-20 text-center text-sm text-slate-300">
                    Page {safePage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={safePage >= totalPages}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>

            {selected && (
              <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6">
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="record-title"
                  className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#0c1020] p-6 sm:rounded-3xl sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs tracking-widest text-violet-300">{selected.experiment} / RAW RECORD</p>
                      <h2 id="record-title" className="mt-2 text-2xl font-semibold">Record details</h2>
                      <p className="mt-2 text-sm text-slate-400">
                        Selected {variable.label}: {format(selected.value, 5)} {variable.unit}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelected(null)}
                      aria-label="Close record details"
                      className="rounded-xl border border-white/10 p-2 text-slate-400 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Original dataset source
                    </p>

                    <p className="mt-2 font-medium text-white">
                      {selected.experiment}
                    </p>

                    <p className="mt-3 text-xs uppercase tracking-wider text-slate-400">
                      Original test identifier
                    </p>

                    <p className="mt-1 font-mono text-sm text-cyan-200">
                      {selected.experiment === "FLEX"
                        ? `FLEX Test ${selected.raw["FLEX Test #"] ?? "Not available"}`
                        : `BASS-II Test ${selected.raw["Test #"] ?? "Not available"}`}
                    </p>

                    <p className="mt-1 break-all text-sm text-slate-400">
                      {selected.experiment === "FLEX"
                        ? "public/data/flex/flex.csv"
                        : "public/data/bass-ii/bass-ii.csv"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      <a
                        href={
                          selected.experiment === "FLEX"
                            ? "/data/flex/flex.csv"
                            : "/data/bass-ii/bass-ii.csv"
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-300 hover:text-cyan-200"
                      >
                        Open source CSV ↗
                      </a>

                      <Link
                        href="/research"
                        className="text-cyan-300 hover:text-cyan-200"
                      >
                        Research Library ↗
                      </Link>
                    </div>
                  </div>

                  <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                    {Object.entries(selected.raw).map(([key, value]) => (
                      <div key={key} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                        <dt className="text-xs leading-5 text-slate-500">{key}</dt>
                        <dd className="mt-2 break-words text-sm text-slate-200">
                          {value?.trim() || "Not recorded"}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}
          </>
        )}

        <footer className="mt-12 border-t border-white/10 py-6 text-xs text-slate-500">
          SideroSpace · Evidence-led combustion research
          <Link href="/research" className="float-right text-violet-300 hover:text-violet-200">
            Research Library →
          </Link>
        </footer>
      </div>
    </main>
  );
}
