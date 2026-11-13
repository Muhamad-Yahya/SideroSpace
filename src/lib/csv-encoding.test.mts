import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import Papa from "papaparse";
import { createUtf8CsvBlob, decodeCsvBytes } from "./csv-encoding.ts";

const sourcePath = new URL("../../public/data/flex/flex.csv", import.meta.url);

test("decodes the source FLEX CSV without losing its original characters", async () => {
  const bytes = await readFile(sourcePath);
  const decoded = decodeCsvBytes(bytes);
  const parsed = Papa.parse<Record<string, string>>(decoded, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim(),
  });

  assert.equal(decoded.match(/\u2013/g)?.length, 34);
  assert.equal(decoded.includes("\uFFFD"), false);
  assert.equal(parsed.errors.length, 0);
  assert.equal(parsed.data.length, 274);
  assert.equal(
    parsed.data.flatMap((row) => Object.values(row)).join("\n").match(/\u2013/g)
      ?.length,
    34
  );

  const exportedText = Papa.unparse(parsed.data);
  const blob = createUtf8CsvBlob(exportedText);
  const exportedBytes = new Uint8Array(await blob.arrayBuffer());
  const roundTrip = new TextDecoder("utf-8").decode(exportedBytes);
  const reparsed = Papa.parse<Record<string, string>>(roundTrip, {
    header: true,
    skipEmptyLines: "greedy",
  });

  assert.deepEqual([...exportedBytes.slice(0, 3)], [0xef, 0xbb, 0xbf]);
  assert.equal(roundTrip, exportedText);
  assert.equal(roundTrip.match(/\u2013/g)?.length, 34);
  assert.equal(roundTrip.includes("\uFFFD"), false);
  assert.equal(reparsed.errors.length, 0);
  assert.deepEqual(reparsed.data, parsed.data);
});

test("UTF-8 CSV export preserves quoting, commas, and embedded line breaks", async () => {
  const records = [
    { Fuel: 'PMMA, "clear"\nfilm', Outcome: "burned – recorded" },
  ];
  const csv = Papa.unparse(records);
  const blob = createUtf8CsvBlob(csv);
  const roundTrip = new TextDecoder("utf-8").decode(
    new Uint8Array(await blob.arrayBuffer())
  );
  const parsed = Papa.parse<typeof records[number]>(roundTrip, {
    header: true,
    skipEmptyLines: "greedy",
  });

  assert.equal(parsed.errors.length, 0);
  assert.deepEqual(parsed.data, records);
});
