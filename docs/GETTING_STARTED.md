# Getting Started

This guide covers the setup commands and tools present in the repository.

## Prerequisites

- Node.js and npm. The repository does not declare a Node `engines` range;
  choose a Node version that supports the package's Next.js release and the
  Node test runner's `--experimental-strip-types` option.
- Git, if you are cloning the repository.
- Python and optional Python modules only if you intend to run the data
  processing scripts (see [Data and Evidence](./DATA_AND_EVIDENCE.md)).

No application environment variables were found in the inspected source.

## Install and run

From the repository root:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Available package scripts from `package.json`:

| Command | Purpose |
|---|---|
| `npm run dev` | Start Next.js in development with `--webpack` |
| `npm run build` | Create the production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run the configured Node test files |

TypeScript can be checked with the repository-used command:

```bash
npx tsc --noEmit
```

There is no separate `typecheck` package script in the inspected manifest.

## Project map

```text
src/app/          App Router pages and API route
src/components/   Shared navigation, dashboard, experiment and research UI
src/lib/          Data parsing, comparison, research content/search, tests
public/data/      Local CSV, evidence index, SAFFIRE manifest and images
scripts/          Evidence-index generation and SAFFIRE inventory audit
docs/             Project documentation
```

Important pages and data files are listed in
[Architecture](./ARCHITECTURE.md) and [Data and Evidence](./DATA_AND_EVIDENCE.md).

## Local research assets

The app's integrated files are already stored under `public/data/`; no external
dataset download is needed just to run the current pages. Avoid replacing
source CSVs or indexed evidence without preserving provenance and updating
relevant tests. See [Data and Evidence](./DATA_AND_EVIDENCE.md) before changing
these assets.

## Validation

Run the relevant checks from the repository root:

```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
```

The test script uses Node's built-in test runner and
`--experimental-strip-types`. Current tests are under `src/lib/` with
`.test.mts` names. `npm run lint` and `npm run build` may surface existing
warnings unrelated to a local documentation-only change.

## Troubleshooting

- **Port 3000 is occupied:** stop the other local server or use the port
  option supported by the installed Next CLI.
- **Missing local data:** check that the files under `public/data/` are present;
  the explorers read these local assets rather than a live NASA API.
- **A comparison field is unavailable:** Compare exposes only fields supported
  by its current mapping and compatibility rules. A shared label alone does
  not imply comparability.
- **Evidence search returns no passages:** try a more specific query of at
  least three characters and check the investigation filter. Search is lexical
  over the current local evidence index.
- **Python script import error:** the scripts use `pypdf` or `openpyxl`; the
  repository has no Python dependency manifest, so their installation and
  version requirements need to be established separately.
- **SAFFIRE audit cannot find its workbook:** `scripts/audit_saffire.py`
  expects a source workbook in a Downloads/SAFFIRE folder. The app itself uses
  the integrated local manifest/images and does not require that workbook.

## Documentation map

- [Features](./FEATURES.md)
- [Architecture](./ARCHITECTURE.md)
- [Design](./DESIGN.md)
- [Data and Evidence](./DATA_AND_EVIDENCE.md)
- [Roadmap](./ROADMAP.md)
- [Demo Guide](./DEMO_GUIDE.md)
