# SideroSpace Features

SideroSpace is a dark, data-oriented research interface for browsing NASA
microgravity combustion investigations and their locally integrated data and
source evidence. This inventory describes behavior verified in the repository,
not planned functionality.

## What is available

| Area | Route | Current status |
|---|---|---|
| Research dashboard and analytics | `/` | Implemented |
| FLEX experiment data explorer | `/flex` | Implemented for the integrated 274-record CSV |
| BASS-II experiment data explorer | `/bass-ii` | Implemented for the integrated 129-record CSV |
| SAFFIRE-I image explorer | `/saffire` | Implemented for local F1C1 pre-test images |
| Experiment comparison | `/compare` | Implemented for supported FLEX/BASS-II CSV fields |
| Research Library | `/research` | Implemented for the local evidence index |
| Ask SideroSpace | `/ask` | Implemented as curated answers plus evidence retrieval |
| Research Insights | `/insights` | Implemented with findings, conclusions, applications, and research gaps |
| Investigation discovery and relevance ranking | Across the research tools | Partially implemented; evidence passages are ranked, not investigations |
| Engineering fire-safety application traceability | `/insights` | Partially implemented; applications are not comprehensively linked to source passages |

## Pages and tools

### Dashboard

The home route presents investigation cards, data-derived analytics, featured
research findings, a FLEX research spotlight, conclusions, and potential
applications. Links lead to the relevant investigation and insight pages.
Dashboard summaries are not a substitute for source records or a complete
review of the evidence.

### Investigation pages

- **FLEX (`/flex`)** — filters and searches the integrated table, plots recorded
  values, shows records and data-quality notes, and supports filtered CSV
  export. Field labels and unresolved unit/definition issues are surfaced.
- **BASS-II (`/bass-ii`)** — filters and searches the integrated table, shows
  paired gas-reading charts and record metadata, paginates results, and exports
  filtered CSV.
- **SAFFIRE-I (`/saffire`)** — displays, navigates, and downloads the available
  F1C1 images and their frame/timestamp information. The local image set is
  pre-test flow visualization, not sample-burning footage or flame measurements.

Each investigation page has contextual links to data, Compare, the Library, and
Ask. The context uses the actual investigation IDs. SAFFIRE-I has no numeric
comparison dataset, so its Compare link does not preselect a dataset.

### Compare (`/compare`)

Compare loads numeric records from the FLEX and BASS-II CSV files. It supports
dataset selection, selection of compatible measurements, record filters,
comparison displays, filtered-record export, and links to source records.
Initial oxygen is the only declared common measurement in the current
comparison rules. A shared field name does not establish scientific equivalence;
missing and unsupported measurements are not synthesized. SAFFIRE-I is not a
numeric comparison dataset.

Comparison context and relevant filters are URL-backed. The URL parameters
include `experiment`, `dataset`, `variable`, `fuel`, `min`, `max`, and `search`.
See [Architecture](./ARCHITECTURE.md) for the page-specific state conventions.

### Research Library (`/research`)

The Library searches passages from the locally generated evidence index. It
supports a text query, investigation filter (`experiment`), and source-type
filter (`type`). Results retain the indexed passage text, investigation,
source/source type, page (when available), chunk, and score. Opening a result
uses the source link when one is available; local indexing alone does not ensure
that every source file is present or independently verified.

### Ask SideroSpace (`/ask`)

Ask offers 31 curated question-and-answer entries and related-question
suggestions. It also submits free-text questions to the same lexical evidence
search used by the Library. Curated answers have their associated source
references; arbitrary queries return passages rather than a generated answer.
Investigation context is carried in the `experiment` query parameter.

### Research Insights (`/insights`)

Insights presents the research findings, conclusions, possible engineering
applications, and research gaps held in the application. Dashboard links can
open an insight or section through query parameters. Application content is
framed as potential research relevance, not as validated procedures or
certification.

## Investigation coverage

| Investigation | Integrated local coverage | Available exploration | Important limits |
|---|---|---|---|
| FLEX (PSI-69) | 274 CSV records; related source passages in the evidence index | Fuel/outcome filters, text search, charts, record table, integrity notes, CSV export | A CSV field named `Burning rate; mm` is not fully defined by its header. The table is not the complete FLEX record. |
| BASS-II (PSI-25) | 129 CSV records; related source passages in the evidence index | Material filter, text search, gas-pair charts, paginated table, missing-field information, CSV export | The integrated table has gas composition and metadata, not direct flame-spread measurements; some equipment fields are not defined by the header alone. |
| SAFFIRE-I | F1C1 manifest and 764 local JPEG frames; related source passages in the evidence index | Frame navigation, image display/download, frame and timestamp metadata | The available local frames are pre-test flow visualization. This is not a numeric fire-measurement dataset. |

## Discovery and relevance ranking (Phase 2 audit)

| Capability | Status | What the application actually does |
|---|---|---|
| Search investigations with research questions | Partially Implemented | Text search queries evidence passages. It does not retrieve/rank investigation records as a first-class result. |
| Search by fuel or material | Partially Implemented | FLEX/BASS-II table filters and passage text search can match labels; there is no unified investigation discovery index. |
| Search by experimental conditions | Partially Implemented | Users can inspect/select some fields in data explorers and Compare; arbitrary condition-based discovery across investigations is absent. |
| Search by variables and measurements | Partially Implemented | Compare exposes supported fields and Library text search can match passage text; there is no normalized cross-investigation variable catalog. |
| Search by scenario or objective | Partially Implemented | Research copy and passage search can find words in indexed content; no structured scenario/objective search is implemented. |
| Rank investigations by relevance | Not Implemented | The lexical scorer ranks passages, not investigations. |
| Explain why an investigation matches | Not Implemented | A numeric passage score is returned, but no user-facing investigation-level rationale is generated. |
| Link results to pages, data, or evidence | Partially Implemented | Context links connect investigation pages to research tools; passage results link to source metadata where available. There is no ranked investigation result card with a complete data/evidence route. |

## Fire-safety applications (Phase 5 audit)

The Insights page and shared experiment content describe possible relevance,
but do not constitute a complete application-to-evidence traceability system.

| Application area | Status | Verified coverage and gap |
|---|---|---|
| Fire detection | Partially Implemented | FLEX content describes low-temperature combustion after visible flame extinction in certain tests; BASS-II discusses fire-detection relevance. Sensor requirements and passage-level application mapping are incomplete. |
| Fire suppression | Partially Implemented | FLEX objectives mention CO₂ and helium; application language is potential. The UI does not fully map each suppression claim to supporting passages or characterize translation limits. |
| Material selection | Partially Implemented | BASS-II material labels and solid-combustion context are present. A systematic, comparative interior-material recommendation or evidence map is absent. |
| Oxygen and atmosphere management | Partially Implemented | FLEX and BASS-II include oxygen-related content and recorded gas fields. Pressure/atmosphere conclusions remain bounded by the integrated data and source definitions; application traceability is incomplete. |
| Future spacecraft and habitat research | Partially Implemented | Airflow, ventilation, and further research are discussed. No habitat-design validation or complete evidence-linked engineering requirements exist. |


For implementation details, see [Architecture](./ARCHITECTURE.md),
[Data and Evidence](./DATA_AND_EVIDENCE.md), and
[Getting Started](./GETTING_STARTED.md).
