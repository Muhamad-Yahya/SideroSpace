# Roadmap

This roadmap is based on current repository behavior. “Completed” means the
corresponding interface or workflow is present; it does not mean the underlying
science or source collection is complete.

## Verified completed work

- Main dashboard with investigation links, data-derived analytics, featured
  findings, a FLEX spotlight, conclusions, and potential applications.
- Investigation data/image explorers for FLEX, BASS-II, and SAFFIRE-I.
- Context links from each investigation to data, Compare, the Library, and Ask.
- URL-backed investigation selection and supported filters on connected
  research pages.
- Local lexical evidence search shared by the Library and free-text Ask flow.
- Curated Ask questions and answers.
- FLEX/BASS-II comparison for explicitly configured compatible measurements,
  with filters and CSV export.
- Insights page containing findings, conclusions, potential applications, and
  research gaps.
- Developer and research documentation under `docs/`.

See [Features](./FEATURES.md) for route details and status.

## Required remaining work

### Phase 2 — Investigation discovery and relevance ranking

1. Define a verified investigation metadata schema for objectives, fuels and
   materials, experimental conditions, variables, scenarios, source IDs, and
   supported datasets.
2. Populate and validate that schema from authoritative source metadata rather
   than inferring solely from passage text or UI content.
3. Build a cross-investigation discovery result that searches that metadata and
   links to the investigation, relevant dataset view, and evidence.
4. Rank investigations separately from passages. Make each match's reason
   inspectable (matched condition, material, variable, objective, or passage).
5. Add focused tests for matching, ranking, explanation, invalid filters, and
   links. Preserve uncertainty and missing metadata rather than treating it as
   a negative scientific result.

### Phase 5 — Evidence-linked fire-safety applications

1. Map each application area (detection, suppression, material selection,
   atmosphere management, and habitat/future research) to specific source
   passages and their experimental conditions.
2. Record whether each statement is an observation, interpretation, or
   potential application, with caveats and missing evidence.
3. Verify claims about post-visible-flame combustion, oxygen, CO₂, helium,
   materials, airflow, and ventilation against primary sources.
4. Link application cards to relevant Library evidence and investigations.
5. Test that limitations remain visible and that potential applications are
   never presented as validated procedures or safety certification.

These are completion tasks because current application-to-source traceability
is partial; they do not imply that the experiments establish the proposed
engineering outcomes.

## Verification and polish

1. Run the existing tests, TypeScript check, lint, and production build; record
   actual failures and warnings rather than suppressing them.
2. Exercise all three investigation context routes, invalid IDs, refresh,
   browser Back/Forward, empty results, and missing-data behavior.
3. Check responsive navigation and the dense FLEX/BASS-II tables at mobile
   sizes; conduct keyboard and screen-reader checks.
4. Review dashboard and Insights text density, source links, and scientific
   caveats without introducing unsupported imagery or claims.
5. Prepare a walkthrough using only verified screens and data. See
   [Demo Guide](./DEMO_GUIDE.md).

## Optional future enhancements

- Semantic retrieval, if it can be added with transparent provenance and
  evaluated against real research queries.
- Broader SAFFIRE quantitative coverage, only if verified source data and
  definitions become available.
- More comparison variables, only after protocol, units, conditions, and
  measurement definitions are reviewed.
- Additional charts or external source integrations, only when they answer a
  documented research need and preserve stable citations.

## Unsupported ideas to avoid

- Treating arbitrary shared variable names as scientific comparability.
- Presenting a generated answer system as implemented.
- Calling potential applications validated spacecraft safety procedures.
- Claiming SAFFIRE frame imagery measures flame spread.
- Adding unsupported ranking metrics, fabricated experiment metadata, or
  invented source citations.
