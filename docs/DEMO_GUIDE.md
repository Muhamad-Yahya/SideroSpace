# Demo Guide

This walkthrough uses the existing routes and local assets. It demonstrates
research navigation and evidence inspection without implying that the app
performs scientific validation or produces AI-generated answers.

## Introduction

> SideroSpace is a research interface for exploring locally integrated NASA
> microgravity combustion data and source passages. It connects experiment
> pages, supported comparisons, curated research answers, and indexed evidence.
> Its coverage is intentionally bounded by the data and source material
> currently integrated.

## Suggested live-demo sequence

### 1. Dashboard — `/`

Show the three investigation entry points, the analytics, and the featured
findings/spotlight. Explain that dashboard summaries link to deeper content and
should be read with their cited scope and caveats.

### 2. FLEX — `/flex`

Open the data explorer, filter/search records, inspect a chart and the record
table, and point out the source-field and data-integrity notes. If useful,
export the filtered CSV. Emphasize that the integrated table has 274 records
and does not represent every FLEX source.

### 3. Compare — `/compare?experiment=FLEX&dataset=FLEX`

Show the preselected FLEX dataset, then add BASS-II and choose a supported
measurement. Point out that only configured compatible variables are offered;
initial oxygen is the current declared common comparison. Explain that
matching fields do not make experiments scientifically equivalent.

### 4. Research Library — `/research?experiment=FLEX`

Search a focused term (for example, `extinction`) and open a result. Show the
indexed passage and its source/page/chunk metadata when available. Explain that
the ranking is lexical and that source classification or completeness may need
verification.

### 5. Ask SideroSpace — `/ask?experiment=FLEX`

Select a curated question and show its existing answer and source references.
Then enter a different question to demonstrate evidence retrieval. Clarify that
free-text retrieval returns source passages; it does not generate an answer.

### 6. BASS-II — `/bass-ii`

Show the material filter, gas-reading charts, and table. Call out that the
integrated file contains 129 records and gas/metadata fields, not direct
flame-spread measurements.

### 7. SAFFIRE-I — `/saffire`

Navigate the available image sequence and show frame/timestamp metadata. State
that the integrated F1C1 images are pre-test flow visualization and are not
sample-burning footage or a quantitative flame-spread dataset.

### 8. Insights — `/insights`

Show a finding, an application, and a research gap. Distinguish documented
observations from potential engineering relevance and discuss the limitations
shown on the page.

## Concise narration script

> SideroSpace brings together several locally integrated research views. The
> dashboard points to FLEX, BASS-II, and SAFFIRE-I, but each has different data
> coverage. FLEX and BASS-II provide record-level tables; SAFFIRE-I currently
> provides a pre-test image sequence. Compare only exposes measurements that
> the application explicitly treats as comparable. The Library searches
> indexed source passages, while Ask combines curated answers with that same
> retrieval system. The Insights page summarizes possible research relevance,
> not certified procedures. Throughout the demo, the original conditions,
> source limitations, and missing data matter as much as the visualizations.

## Claims to avoid

- “The app uses AI to answer any research question.”
- “Search semantically ranks the best investigations.”
- “FLEX, BASS-II, and SAFFIRE-I are directly interchangeable.”
- “The SAFFIRE images show fire growth or provide flame-spread measurements.”
- “A plotted association proves a causal effect.”
- “These findings are validated spacecraft fire-safety procedures.”
- “Every indexed passage has been checked against the complete original source.”

## Recording checklist

- [ ] Start the development server and verify each route opens.
- [ ] Use a stable query and confirm the local evidence index returns results.
- [ ] Check that the selected investigation context is visible in each URL.
- [ ] Confirm FLEX/BASS-II comparison selection and export work before recording.
- [ ] Avoid presenting SAFFIRE as a numerical experiment explorer.
- [ ] Keep source caveats visible when discussing findings or applications.
- [ ] Use a desktop viewport for charts, then show at least one mobile layout.
- [ ] Do not expose private paths, browser profiles, credentials, or unrelated
      workspace content in the recording.
- [ ] Use only imagery already verified as depicting the described experiment
      phase; otherwise show the existing CSS illustration or local source view.

For feature status and limitations, see [Features](./FEATURES.md). For setup
and commands, see [Getting Started](./GETTING_STARTED.md).
