import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  BASS_FINAL_OXYGEN_COLUMN,
  BASS_INITIAL_OXYGEN_COLUMN,
  FLEX_INITIAL_OXYGEN_COLUMN,
  getNumericColumnRecords,
  isVariableAvailableForDataset,
  normalizeCsvHeader,
  parseCsvRows,
  resolveCompareDataset,
  resolveCsvColumn,
} from "./compare-data.ts";

const dataPath = new URL("../../public/data/", import.meta.url);

async function loadCsv(relativePath: string, encoding: string) {
  const bytes = await readFile(new URL(relativePath, dataPath));
  return parseCsvRows(new TextDecoder(encoding).decode(bytes), relativePath);
}

test("normalizes headers while preserving original keys and values", async () => {
  assert.equal(
    normalizeCsvHeader("  Calibrated\t  INITIAL O2 % by vol  "),
    "calibrated initial o2 % by vol"
  );

  const bassRows = await loadCsv("bass-ii/bass-ii.csv", "utf-8");
  const headers = Object.keys(bassRows[0]);
  const initialHeader = resolveCsvColumn(headers, BASS_INITIAL_OXYGEN_COLUMN);
  const finalHeader = resolveCsvColumn(headers, BASS_FINAL_OXYGEN_COLUMN);

  assert.equal(initialHeader, "Calibrated  initial O2 % by vol ");
  assert.equal(finalHeader, "Calibrated final O2 % by vol");
  assert.notEqual(initialHeader, finalHeader);
  assert.equal(bassRows[0][initialHeader!], "22.2");
  assert.equal(bassRows[0][finalHeader!], "22.2");
});

test("rejects CSV headers that normalize to the same name", () => {
  assert.throws(
    () => parseCsvRows("Value, value \n1,2", "ambiguous.csv"),
    /Ambiguous CSV columns/
  );
});

test("maps actual FLEX and BASS-II oxygen fields and excludes nonnumeric final values", async () => {
  const [flexRows, bassRows] = await Promise.all([
    loadCsv("flex/flex.csv", "windows-1252"),
    loadCsv("bass-ii/bass-ii.csv", "utf-8"),
  ]);
  const flexInitial = getNumericColumnRecords(
    flexRows,
    FLEX_INITIAL_OXYGEN_COLUMN,
    (value) => value * 100
  );
  const bassInitial = getNumericColumnRecords(
    bassRows,
    BASS_INITIAL_OXYGEN_COLUMN
  );
  const bassFinal = getNumericColumnRecords(
    bassRows,
    BASS_FINAL_OXYGEN_COLUMN
  );
  const bassFinalHeader = resolveCsvColumn(
    Object.keys(bassRows[0]),
    BASS_FINAL_OXYGEN_COLUMN
  );
  const nonnumericBassFinal = bassRows.filter((row) => {
    const rawValue = row[bassFinalHeader!]?.trim();
    return !rawValue || !Number.isFinite(Number(rawValue));
  });

  assert.equal(flexInitial.length, 274);
  assert.equal(bassInitial.length, 129);
  assert.equal(flexInitial.length + bassInitial.length, 403);
  assert.equal(bassFinal.length, 127);
  assert.equal(nonnumericBassFinal.length, 2);
  assert.deepEqual(
    nonnumericBassFinal.map((row) => row[bassFinalHeader!]),
    ["none", "none"]
  );
  assert.equal(bassFinal.some(({ value }) => !Number.isFinite(value)), false);
  assert.deepEqual(getNumericColumnRecords(bassRows, "Missing oxygen field"), []);
});

test("keeps cross-dataset comparisons limited to explicitly compatible variables", () => {
  const variables = [
    { id: "oxygen", comparable: true, flexColumn: "O₂", bassColumn: "O₂" },
    { id: "finalOxygen", comparable: false, bassColumn: "final O₂" },
    { id: "burnTime", comparable: false, flexColumn: "burn time" },
  ];

  assert.deepEqual(
    variables
      .filter((variable) => isVariableAvailableForDataset(variable, "all"))
      .map((variable) => variable.id),
    ["oxygen"],
  );
  assert.deepEqual(
    variables
      .filter((variable) => isVariableAvailableForDataset(variable, "FLEX"))
      .map((variable) => variable.id),
    ["oxygen", "burnTime"],
  );
  assert.deepEqual(
    variables
      .filter((variable) => isVariableAvailableForDataset(variable, "BASS-II"))
      .map((variable) => variable.id),
    ["oxygen", "finalOxygen"],
  );
});

test("resolves compare dataset selection from valid context and falls back on conflicts", () => {
  assert.equal(resolveCompareDataset("?experiment=FLEX&dataset=FLEX"), "FLEX");
  assert.equal(resolveCompareDataset("?experiment=BASS-II"), "BASS-II");
  assert.equal(resolveCompareDataset("?experiment=SAFFIRE-I"), "all");
  assert.equal(resolveCompareDataset("?dataset=BASS-II"), "BASS-II");
  assert.equal(
    resolveCompareDataset("?experiment=invalid&dataset=BASS-II"),
    "BASS-II",
  );
  assert.equal(resolveCompareDataset("?experiment=FLEX&dataset=all"), "all");
  assert.equal(
    resolveCompareDataset("?experiment=FLEX&dataset=BASS-II"),
    "FLEX",
  );
  assert.equal(
    resolveCompareDataset("?experiment=SAFFIRE-I&dataset=BASS-II"),
    "all",
  );
  assert.equal(resolveCompareDataset("?dataset=invalid"), "all");
});
