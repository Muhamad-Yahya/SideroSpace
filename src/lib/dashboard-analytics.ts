import { readFile } from "node:fs/promises";
import path from "node:path";
import Papa from "papaparse";
import { decodeCsvBytes } from "./csv-encoding";

export type CountItem = {
  label: string;
  count: number;
};

export type DistributionBin = {
  label: string;
  count: number;
};

export type MeasurementDistribution = {
  label: string;
  unit: string;
  recorded: number;
  missing: number;
  bins: DistributionBin[];
};

export type DashboardAnalytics = {
  evidence: {
    totalPassages: number;
    byExperiment: CountItem[];
    pdfFiles: number;
    zipArchives: number;
    textFiles: number;
  };
  flex: {
    rows: number;
    fuels: CountItem[];
    outcomes: CountItem[];
    oxygen: MeasurementDistribution;
    pressure: MeasurementDistribution;
    dropletDiameter: MeasurementDistribution;
    burningRate: MeasurementDistribution;
    extinctionDiameter: MeasurementDistribution;
  };
  bass: {
    rows: number;
    materials: CountItem[];
    distinctMaterialLabels: number;
    oxygen: MeasurementDistribution;
  };
  saffire: {
    frames: number;
  };
  oxygenComparison: {
    label: string;
    flexCount: number;
    bassCount: number;
  }[];
};

type CsvRow = Record<string, string>;
type EvidenceIndex = {
  summary: {
    passages_indexed: number;
    pdf_files_scanned: number;
    zip_archives_scanned: number;
    text_files_scanned: number;
  };
  passages: { experiment: string }[];
};

const experiments = ["FLEX", "BASS-II", "SAFFIRE-I"] as const;
const numberPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;

function parseCsv(contents: string, source: string): CsvRow[] {
  const parsed = Papa.parse<CsvRow>(contents, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.replace(/^\uFEFF/, "").trim(),
  });

  if (parsed.errors.length > 0) {
    const firstError = parsed.errors[0];
    throw new Error(
      `Could not parse ${source}: ${firstError.message} at row ${firstError.row}.`
    );
  }

  return parsed.data.filter((row) =>
    Object.values(row).some((value) => value.trim() !== "")
  );
}

function getNumber(row: CsvRow, field: string): number | null {
  const raw = row[field]?.trim();
  if (!raw) return null;

  const normalized = raw.replace(/,/g, "");
  if (!numberPattern.test(normalized)) return null;

  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function countValues(values: string[]): CountItem[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    const label = value.trim().replace(/\s+/g, " ");
    if (label) counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(value);
}

function createDistribution(
  values: number[],
  totalRows: number,
  label: string,
  unit: string,
  requestedBins = 8
): MeasurementDistribution {
  if (values.length === 0) {
    return {
      label,
      unit,
      recorded: 0,
      missing: totalRows,
      bins: [],
    };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const binCount = min === max ? 1 : requestedBins;
  const width = (max - min) / binCount;
  const bins = Array.from({ length: binCount }, (_, index) => {
    const start = min + width * index;
    const end = index === binCount - 1 ? max : start + width;
    return {
      label:
        binCount === 1
          ? formatNumber(min)
          : `${formatNumber(start)}–${formatNumber(end)}`,
      count: 0,
    };
  });

  for (const value of values) {
    const index =
      width === 0
        ? 0
        : Math.min(Math.floor((value - min) / width), binCount - 1);
    bins[index].count += 1;
  }

  return {
    label,
    unit,
    recorded: values.length,
    missing: totalRows - values.length,
    bins,
  };
}

function getRequiredField(rows: CsvRow[], field: string, source: string): void {
  if (rows.length > 0 && !(field in rows[0])) {
    throw new Error(`Expected column "${field}" was not found in ${source}.`);
  }
}

function topItems(values: string[], limit: number): CountItem[] {
  const counts = countValues(values);
  const top = counts.slice(0, limit);
  const otherCount = counts.slice(limit).reduce((sum, item) => sum + item.count, 0);
  return otherCount > 0
    ? [...top, { label: "Other recorded labels", count: otherCount }]
    : top;
}

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  "use cache";

  const [flexContents, bassContents, evidenceText, manifestText] =
    await Promise.all([
      readFile(
        path.join(process.cwd(), "public", "data", "flex", "flex.csv")
      ),
      readFile(
        path.join(process.cwd(), "public", "data", "bass-ii", "bass-ii.csv"),
        "utf8"
      ),
      readFile(
        path.join(
          process.cwd(),
          "public",
          "data",
          "research",
          "evidence-index.json"
        ),
        "utf8"
      ),
      readFile(
        path.join(
          process.cwd(),
          "public",
          "data",
          "saffire",
          "f1c1",
          "manifest.json"
        ),
        "utf8"
      ),
    ]);
  const flexRows = parseCsv(
    decodeCsvBytes(flexContents),
    "the FLEX table"
  );
  const bassRows = parseCsv(bassContents, "the BASS-II table");
  const evidence = JSON.parse(evidenceText) as EvidenceIndex;
  const manifest = JSON.parse(manifestText.replace(/^\uFEFF/, "")) as unknown;

  if (!Array.isArray(evidence.passages) || !Array.isArray(manifest)) {
    throw new Error("Dashboard source index or SAFFIRE manifest is malformed.");
  }
  if (evidence.passages.length !== evidence.summary.passages_indexed) {
    throw new Error("Research evidence index summary does not match its passages.");
  }

  const flexFields = {
    fuel: "Fuel",
    oxygen: "O initial ambient composition; mole fraction",
    pressure: "Ambient pressure; mmHg",
    dropletDiameter: "Droplet initial diameter; mm",
    burningRate: "Burning rate; mm",
    extinctionDiameter: "Visible flame extinction diameter; mm",
    outcome: "Test end",
  } as const;
  const bassFields = {
    material: "Fuel Sample Material",
    oxygen: "Calibrated  initial O2 % by vol",
  } as const;

  for (const field of Object.values(flexFields)) {
    getRequiredField(flexRows, field, "the FLEX table");
  }
  for (const field of Object.values(bassFields)) {
    getRequiredField(bassRows, field, "the BASS-II table");
  }

  const flexOxygen = flexRows
    .map((row) => getNumber(row, flexFields.oxygen))
    .filter((value): value is number => value !== null)
    .map((value) => value * 100);
  const bassOxygen = bassRows
    .map((row) => getNumber(row, bassFields.oxygen))
    .filter((value): value is number => value !== null);
  const combinedOxygen = [...flexOxygen, ...bassOxygen];
  const oxygenComparisonDistribution = createDistribution(
    combinedOxygen,
    combinedOxygen.length,
    "Initial oxygen concentration",
    "% by volume"
  );
  const comparisonWidth =
    oxygenComparisonDistribution.bins.length > 1
      ? (Math.max(...combinedOxygen) - Math.min(...combinedOxygen)) /
        oxygenComparisonDistribution.bins.length
      : 0;
  const oxygenComparison = oxygenComparisonDistribution.bins.map(
    (bin, index) => {
      const start = Math.min(...combinedOxygen) + comparisonWidth * index;
      const end =
        index === oxygenComparisonDistribution.bins.length - 1
          ? Math.max(...combinedOxygen)
          : start + comparisonWidth;
      const includes = (value: number) =>
        index === oxygenComparisonDistribution.bins.length - 1
          ? value >= start && value <= end
          : value >= start && value < end;

      return {
        label: bin.label,
        flexCount: flexOxygen.filter(includes).length,
        bassCount: bassOxygen.filter(includes).length,
      };
    }
  );

  const evidenceByExperiment = experiments.map((experiment) => ({
    label: experiment,
    count: evidence.passages.filter(
      (passage) => passage.experiment === experiment
    ).length,
  }));
  const flexValues = (field: string) =>
    flexRows
      .map((row) => getNumber(row, field))
      .filter((value): value is number => value !== null);
  const bassMaterials = bassRows
    .map((row) => row[bassFields.material] ?? "")
    .filter((value) => value.trim() !== "");
  const distinctMaterialLabels = countValues(bassMaterials).length;

  return {
    evidence: {
      totalPassages: evidence.passages.length,
      byExperiment: evidenceByExperiment,
      pdfFiles: evidence.summary.pdf_files_scanned,
      zipArchives: evidence.summary.zip_archives_scanned,
      textFiles: evidence.summary.text_files_scanned,
    },
    flex: {
      rows: flexRows.length,
      fuels: countValues(flexRows.map((row) => row[flexFields.fuel] ?? "")),
      outcomes: countValues(
        flexRows.map((row) => row[flexFields.outcome] ?? "")
      ),
      oxygen: createDistribution(
        flexOxygen,
        flexRows.length,
        "Initial oxygen concentration",
        "mol % (mole fraction × 100)"
      ),
      pressure: createDistribution(
        flexValues(flexFields.pressure),
        flexRows.length,
        "Ambient pressure",
        "mmHg"
      ),
      dropletDiameter: createDistribution(
        flexValues(flexFields.dropletDiameter),
        flexRows.length,
        "Initial droplet diameter",
        "mm"
      ),
      burningRate: createDistribution(
        flexValues(flexFields.burningRate),
        flexRows.length,
        "Burning rate",
        "mm (source column label)"
      ),
      extinctionDiameter: createDistribution(
        flexValues(flexFields.extinctionDiameter),
        flexRows.length,
        "Visible flame extinction diameter",
        "mm"
      ),
    },
    bass: {
      rows: bassRows.length,
      materials: topItems(bassMaterials, 8),
      distinctMaterialLabels,
      oxygen: createDistribution(
        bassOxygen,
        bassRows.length,
        "Calibrated initial oxygen",
        "% by volume"
      ),
    },
    saffire: {
      frames: manifest.length,
    },
    oxygenComparison,
  };
}
