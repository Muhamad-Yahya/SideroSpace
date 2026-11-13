# SideroSpace Architecture

This document describes the current implementation and data flow. It excludes
unrelated routes and focuses on the application surfaces documented in
[Features](./FEATURES.md).

## Stack and runtime

- Next.js 16.4.2 App Router, React/React DOM 19.3.0, TypeScript (strict mode).
- Tailwind CSS 4 is imported through the global stylesheet; much of the
  application styling is route- and component-specific CSS.
- Papa Parse handles CSV parsing; Recharts renders data visualizations; Lucide
  React supplies icons.
- Node.js serves the app. No environment-variable configuration was found in
  the inspected application and scripts.
- `framer-motion` is declared as a dependency, but was not observed in the
  inspected source imports.

See the root [package.json](../package.json), [Next configuration](../next.config.ts),
[TypeScript configuration](../tsconfig.json), and [ESLint configuration](../eslint.config.mjs).

## Routes and important components

| Route | Main implementation |
|---|---|
| `/` | `src/app/page.tsx`, `src/components/MissionIntelligenceDashboard.tsx`, `src/components/ResearchAnalytics.tsx` |
| `/flex` | `src/app/flex/page.tsx` and `src/app/flex/flex.css` |
| `/bass-ii` | `src/app/bass-ii/page.tsx` and `src/app/bass-ii/bass-ii.css` |
| `/saffire` | `src/app/saffire/page.tsx`, `src/components/saffire/SaffireExplorer.tsx`, `src/components/saffire/saffire.css` |
| `/compare` | `src/app/compare/page.tsx`, `src/lib/compare-data.ts` |
| `/research` | `src/app/research/page.tsx` |
| `/ask` | `src/app/ask/page.tsx`, `src/lib/ask-knowledge.ts` |
| `/insights` | `src/app/insights/page.tsx` |
| `GET /api/research/search` | `src/app/api/research/search/route.ts`, `src/lib/research-retrieval.ts` |

Shared navigation and experiment context links are implemented in
`src/components/WorkspaceNavigation.tsx` and
`src/components/ExperimentResearchContext.tsx`. The global stylesheet is
`src/app/globals.css`.

## Data and evidence flow

```mermaid
flowchart TD
  CSVF[public/data/flex/flex.csv] --> FLEX[/flex explorer]
  CSVB[public/data/bass-ii/bass-ii.csv] --> BASS[/bass-ii explorer]
  CSVF --> CMP[Compare]
  CSVB --> CMP
  MF[public/data/saffire/f1c1/manifest.json] --> SAF[/saffire image explorer]
  IMG[public/data/saffire/f1c1/*.jpeg] --> SAF
  IDX[public/data/research/evidence-index.json] --> API[GET /api/research/search]
  API --> RET[Lexical passage retrieval]
  RET --> LIB[/research Library]
  RET --> ASK[/ask free-text evidence results]
  CUR[Curated Q&A in src/lib/ask-knowledge.ts] --> ASK
  CONTENT[src/lib/experiment-research-content.ts] --> CTX[Investigation context links]
  CTX --> CMP
  CTX --> LIB
  CTX --> ASK
  DASH[Dashboard /] --> INS[/insights]
```

The diagram shows the integrated local data flow, not every navigation or
presentation component.

### Data assets and schemas

- FLEX and BASS-II are local CSV files under `public/data/`. Their original
  headers and source values are retained; utilities parse and map the fields
  consumed by their pages.
- SAFFIRE-I uses a JSON manifest (`frame`, `filename`, `timestampMs`,
  `timestampUtc`) and matching local JPEG files. Current integrated coverage
  is F1C1 only.
- The evidence index is JSON at `public/data/research/evidence-index.json`.
  Each passage has an ID, inferred investigation ID, source name/type,
  optional page, chunk number, and text.
- Investigation descriptions, source references, variable notes, and
  limitations are in `src/lib/experiment-research-content.ts`.
- Curated question/answer material is in `src/lib/ask-knowledge.ts`.

Counts, provenance, and known data limitations are documented in
[Data and Evidence](./DATA_AND_EVIDENCE.md).

### Evidence indexing and search

`scripts/build_evidence_index.py` reads supported text/PDF/archive material,
extracts text, chunks it, and writes the local evidence JSON. It searches the
research data directory and configured Downloads subdirectories; the script
imports `pypdf`. Experiment assignment is inferred from text/metadata patterns,
so it is not guaranteed ground truth.

The API reads the JSON index at request time, validates the query (3–500
characters), investigation selection, and result limit (1–20), then returns
passage text and source/page/chunk metadata with a lexical relevance score.
`src/lib/research-retrieval.ts` tokenizes and scores text, deduplicates highly
similar passages within an investigation, and caps each source at three
selected passages. It is not semantic retrieval and does not synthesize answers.

### URL state and navigation

`src/lib/research-context.ts` defines the canonical IDs `FLEX`, `BASS-II`, and
`SAFFIRE-I`, parses `experiment`, constructs context links, and maps each ID to
its route. `src/lib/use-research-url.ts` keeps connected page controls in query
state and uses browser history so refreshes and Back/Forward retain supported
filters.

Verified query conventions include:

- Investigation context: `experiment=FLEX|BASS-II|SAFFIRE-I`.
- Compare: `dataset`, `variable`, `fuel`, `min`, `max`, and `search` in
  addition to `experiment`. SAFFIRE-I has no comparison dataset preselection.
- Library: `q`, `experiment`, and `type`.
- Ask: `q` and `experiment`.
- Insights: query-backed finding/section selection.

Invalid investigation context is handled as an invalid state with a visible
fallback on connected research views rather than being treated as a valid ID.
The exact set of filters persisted is page-specific; do not assume every
control is serialized.

### Comparison rules

`src/lib/compare-data.ts` loads the available numeric tables, normalizes source
headers for field lookup, and determines supported comparison measurements.
Only explicitly configured common measurements are offered as cross-dataset
comparisons. Missing values are not fabricated. The comparison UI retains its
filters and CSV export.

## APIs and backend functionality

The inspected backend surface includes `GET /api/research/search`. It reads the
local evidence index from disk using the server working directory and returns
JSON results or an error response. There is no database-backed service or
generative answer API in the inspected source.

## Scripts, tests, and caching

- `scripts/build_evidence_index.py` generates the research passage index and
  depends on Python `pypdf` (no Python dependency manifest was found).
- `scripts/audit_saffire.py` compares a locally supplied workbook with the
  image/manifest inventory and depends on `openpyxl`; it expects the workbook
  in the user's Downloads/SAFFIRE directory. This is a local audit workflow,
  not part of the application request path.
- Focused Node tests live in `src/lib/*.test.mts`; they cover data parsing,
  comparison rules, URL context, and CSV encoding.
- The evidence API rereads and parses the JSON index per request. No persistent
  retrieval cache was identified.

## Known limitations and architectural debt

- Investigation discovery lacks a normalized, queryable investigation index.
- Passage search is lexical and provides no interpretable match explanation
  beyond a score.
- Evidence classification is inferred, and passages may omit scanned PDF
  content, source links, or independent verification.
- Compare coverage is limited to the two numeric CSVs and configured shared
  fields; SAFFIRE is image-only in this integration.
- Python script dependencies are not described in a Python requirements file.
- Dashboard and insight content has some separately authored presentation
  content; source traceability for every application statement is not enforced
  by a shared evidence schema.
