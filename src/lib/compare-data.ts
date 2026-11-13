import Papa from "papaparse";
import { getExperimentId } from "./research-context.ts";

export type CsvRow = Record<string, string>;
export type CompareDataset = "all" | "FLEX" | "BASS-II";

type ComparableVariable = {
  comparable: boolean;
  flexColumn?: string;
  bassColumn?: string;
};

export function resolveCompareDataset(search: string): CompareDataset {
  const params = new URLSearchParams(search);
  const requestedDataset = params.get("dataset");
  const experiment = getExperimentId(search);

  if (requestedDataset === "all") return "all";
  if (requestedDataset === "FLEX" || requestedDataset === "BASS-II") {
    if (experiment && experiment !== requestedDataset) {
      return experiment === "FLEX" || experiment === "BASS-II"
        ? experiment
        : "all";
    }
    return requestedDataset;
  }

  return experiment === "FLEX" || experiment === "BASS-II"
    ? experiment
    : "all";
}

export function isVariableAvailableForDataset(
  variable: ComparableVariable,
  dataset: CompareDataset,
): boolean {
  if (dataset === "all") return variable.comparable;
  return dataset === "FLEX"
    ? Boolean(variable.flexColumn)
    : Boolean(variable.bassColumn);
}

export type NumericCsvRecord = {
  index: number;
  raw: CsvRow;
  value: number;
};

export const FLEX_INITIAL_OXYGEN_COLUMN =
  "O initial ambient composition; mole fraction";
export const BASS_INITIAL_OXYGEN_COLUMN =
  "Calibrated initial O2 % by vol";
export const BASS_FINAL_OXYGEN_COLUMN =
  "Calibrated final O2 % by vol";

export function normalizeCsvHeader(header: string): string {
  return header.trim().replace(/\s+/g, " ").toLowerCase();
}

export function parseCsvRows(contents: string, source: string): CsvRow[] {
  const parsed = Papa.parse<string[]>(contents, {
    header: false,
    skipEmptyLines: true,
  });

  if (parsed.errors.length && !parsed.data.length) {
    throw new Error(`Unable to parse ${source}`);
  }

  const [rawHeaders = [], ...records] = parsed.data;
  const headers = rawHeaders.map((header, index) =>
    index === 0 ? header.replace(/^\uFEFF/, "") : header
  );
  const normalizedHeaders = new Map<string, string>();

  for (const header of headers) {
    const normalized = normalizeCsvHeader(header);
    const existing = normalizedHeaders.get(normalized);

    if (existing !== undefined) {
      throw new Error(
        `Ambiguous CSV columns in ${source}: "${existing}" and "${header}" normalize to the same header.`
      );
    }

    normalizedHeaders.set(normalized, header);
  }

  return records.map((values) =>
    Object.fromEntries(
      headers.map((header, index) => [header, values[index] ?? ""])
    )
  );
}

export function resolveCsvColumn(
  headers: readonly string[],
  expected: string
): string | null {
  const normalizedExpected = normalizeCsvHeader(expected);
  const matches = headers.filter(
    (header) => normalizeCsvHeader(header) === normalizedExpected
  );

  if (matches.length > 1) {
    throw new Error(
      `Ambiguous CSV mapping for "${expected}": ${matches.map((header) => `"${header}"`).join(", ")}.`
    );
  }

  return matches[0] ?? null;
}

export function getNumericColumnRecords(
  rows: readonly CsvRow[],
  expectedColumn: string,
  convert: (value: number) => number = (value) => value
): NumericCsvRecord[] {
  if (rows.length === 0) return [];

  const actualColumn = resolveCsvColumn(
    Object.keys(rows[0]),
    expectedColumn
  );
  if (actualColumn === null) return [];

  const numericRecords: NumericCsvRecord[] = [];

  rows.forEach((raw, index) => {
    const rawValue = raw[actualColumn]?.trim();
    if (!rawValue) return;

    const value = Number(rawValue);
    if (!Number.isFinite(value)) return;

    const convertedValue = convert(value);
    if (!Number.isFinite(convertedValue)) return;

    numericRecords.push({ index, raw, value: convertedValue });
  });

  return numericRecords;
}
