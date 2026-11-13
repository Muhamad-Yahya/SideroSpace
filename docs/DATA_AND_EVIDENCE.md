# Data and Evidence

SideroSpace combines local experiment tables and imagery with a searchable
passage index. Data coverage is finite and should not be confused with the
complete NASA investigation archive.

## Integrated datasets

| Investigation | Local asset | Coverage and use |
|---|---|---|
| FLEX / PSI-69 | `public/data/flex/flex.csv` | 274 records used by the FLEX explorer and comparison logic |
| BASS-II / PSI-25 | `public/data/bass-ii/bass-ii.csv` | 129 records used by the BASS-II explorer and comparison logic |
| SAFFIRE-I | `public/data/saffire/f1c1/manifest.json` plus JPEG files | 764 F1C1 images with frame and timestamp metadata; the available series is pre-test flow visualization |
| Research evidence | `public/data/research/evidence-index.json` | 352 indexed passages: 276 classified FLEX, 44 BASS-II, 32 SAFFIRE-I |

The evidence-index counts and investigation assignments describe the generated
local index, not complete source-document coverage. The app does not load a
numeric SAFFIRE-I fire-measurement table.

## Provenance and index generation

`scripts/build_evidence_index.py` reads source text from supported text,
Markdown, PDF, and ZIP/archive content under configured research and local
download directories. It extracts and chunks text with overlap and writes
`public/data/research/evidence-index.json`. It imports `pypdf` for PDF handling.
The experiment associated with a passage is inferred from source/text patterns;
it should be validated rather than treated as authoritative metadata.

The index stores passage IDs, experiment, source name/type, optional page,
chunk number, and passage text. It does not itself guarantee that the original
document is bundled, its link is verified, or the extraction preserved all
content. Scanned PDFs may yield no searchable text.

`scripts/audit_saffire.py` compares a downloaded workbook inventory with the
local image manifest/files and writes an integrity report. It imports
`openpyxl` and expects a workbook in the user's Downloads/SAFFIRE folder. No
Python dependency manifest was found.

## Search and passage ranking

The Library and free-text Ask flow call `GET /api/research/search`. The
endpoint validates a 3–500 character query, a known experiment filter, and a
result limit clamped to 1–20. It reads the evidence JSON and returns passage
text, source metadata, page/chunk values, and a numeric relevance score.

`src/lib/research-retrieval.ts` performs lexical token matching and heuristic
scoring, sorts matching passages, removes highly similar passages within an
investigation, and caps a source at three selected passages. It is not
embedding-based semantic search. It does not rank investigations, explain an
investigation-level match, or generate answers.

## Missing values, encoding, and units

- Blank values are not filled with invented measurements. Explorers display
  missing values and identify incomplete measurement pairs.
- Zero is not automatically treated as missing. FLEX highlights certain
  zero-valued fields for source review rather than silently recoding them.
- Original CSV headers and labels are retained where practical. The field
  `Burning rate; mm` in FLEX is explicitly not reinterpreted as a rate in a
  different unit without source documentation.
- BASS-II gas fields retain their source unit labels (including `% by volume`
  and `ppm`). Other instrument/display fields may not have enough definition
  in the local CSV headers to support physical interpretation.
- `src/lib/csv-encoding.ts` provides explicit CSV decoding/export handling.
  Exported CSVs include a UTF-8 byte-order mark for spreadsheet compatibility.

## Comparability limits

Compare uses only the FLEX and BASS-II tables and their declared compatible
measurements. Initial oxygen is the only common comparison currently declared.
The page's compatibility rules prevent unsupported field comparisons; a shared
name or unit alone would not demonstrate that tests used comparable protocols,
conditions, samples, or calibration. SAFFIRE-I's integrated frame data is not
a quantitative dataset in Compare.

## What indexed evidence can support

Search results can point a reader to the indexed passage and its source
metadata. They can support locating relevant material for review. They do not,
on their own, establish:

- that the inferred investigation classification is correct;
- that the source is complete or independently verified;
- that a passage is representative of the full study;
- a causal interpretation or cross-investigation equivalence;
- a safety threshold, validated engineering procedure, or spacecraft
  certification claim.

Curated Ask answers and Insights content should be checked against their
references and the experimental conditions. Arbitrary Ask queries return
passages, not synthesized answers.

## Safely adding or updating data

1. Preserve the original source file and record its provenance, identifier,
   retrieval/version information, and any usage requirements.
2. Inspect headers, encoding, units, missing-value conventions, and duplicate
   identifiers before integrating a table.
3. Keep source values unchanged unless a documented transformation is required;
   distinguish missing values from zeros and special tokens.
4. Update the relevant parser/mapping and focused tests when schema changes.
5. Rebuild the evidence index with the repository script only after confirming
   its configured inputs and Python dependencies. Review inferred experiment
   labels, passage text, source/page/chunk metadata, and output counts.
6. For imagery, verify the manifest-to-file relationship and that the images
   depict the described phase of the experiment.
7. Update relevant limitations and source references. Do not invent
   measurements, citations, causal explanations, or scientific equivalence.

For the data consumers and API flow, see [Architecture](./ARCHITECTURE.md).
The complete functional inventory is in [Features](./FEATURES.md).
