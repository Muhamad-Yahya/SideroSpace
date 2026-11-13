# SideroSpace Design

This document records the current visual system separately from suggested
improvements. It is based on the shared CSS, navigation, and investigation
explorers in the repository.

## Current design

### Identity and visual language

The application uses a dark scientific interface with deep navy/charcoal
surfaces, muted gray-blue text, purple interaction accents, and occasional
orange highlights. Shared design tokens are defined at the top of
`src/app/globals.css`:

| Token | Current value | Use |
|---|---|---|
| `--bg` | `#080b12` | Main page background |
| `--panel` | `#10141e` | Primary panel |
| `--panel-2` | `#141a27` | Secondary panel |
| `--border` | `#252c3a` | Borders/dividers |
| `--muted` | `#818ca1` | Supporting text |
| `--text` | `#edf1fa` | Main text |
| `--purple` | `#a78bfa` | Focus and interaction accent |
| `--orange` | `#ff9c62` | Secondary highlight |

The shared body uses Arial/Helvetica sans-serif at a compact base size. Some
labels use monospace; selected editorial headings use Georgia. The palette and
typography are CSS-based rather than supplied by an external font service.

### Layout and components

The shared workspace uses a left navigation rail on wider screens and
responsive navigation at narrower widths. Pages favor compact cards, subtle
borders, dense datasets, section labels, and charts on dark panels. Navigation
and data pages share the same overall dark/purple vocabulary, but FLEX,
BASS-II, SAFFIRE-I, dashboard, and research tools have route-specific CSS and
layout details.

The dashboard uses card grids for featured findings, conclusions, and
applications. It includes a CSS-based droplet/flame illustration rather than
claiming a real experiment photograph. The data explorers prioritize filters,
charts, tables, record counts, caveats, and exports over editorial imagery.

### Responsive behavior

The global and page-specific styles use media queries to collapse navigation,
grids, charts, and data layouts for tablet/mobile widths. Breakpoints vary by
component, commonly around 600–850px, with some explorer-specific widths.
Responsive CSS exists, but this documentation does not claim that every
screen size has been manually verified.

### Accessibility and interaction

- Links, buttons, inputs, and selects receive a visible purple `:focus-visible`
  outline in the global stylesheet.
- Navigation and interactive controls use semantic links, buttons, labels,
  and form elements in the inspected components.
- The dashboard featured cards and other interactive surfaces have hover
  styling; reduced-motion media queries reduce some transitions.
- Charts use Recharts and provide tooltips; data tables expose original fields
  and empty/loading states.

Keyboard and screen-reader behavior should still be checked in a full
accessibility audit. The presence of focus styles alone does not establish
complete accessibility.

## Current UI/UX weaknesses

- Dense data tables and compact supporting text can be difficult to scan,
  especially on narrow screens.
- Typography and breakpoints are not fully uniform across route-specific
  stylesheets.
- The application has substantial explanatory copy. Long insight/research
  sections can compete with the data-oriented workflow.
- Source availability and traceability vary by passage; visual presentation
  cannot resolve gaps in metadata.
- Several scientific variables have source labels whose unit or meaning needs
  confirmation; the interface appropriately warns about some of these, but
  interpretation remains demanding for new users.

## Proposed improvements (not yet implemented)

1. Establish reusable type, spacing, and card tokens across route stylesheets,
   while preserving the existing dark/purple identity.
2. Improve table density controls, mobile horizontal scrolling cues, and
   persistent filter summaries without hiding source values.
3. Use authentic NASA imagery only when it is verified to depict the named
   investigation and is properly attributed. Otherwise prefer the existing
   restrained CSS scientific illustrations over unrelated stock imagery.
4. Make evidence citations and caveats visually consistent across dashboard,
   Insights, Library, and Ask.
5. Conduct keyboard, screen-reader, contrast, and small-screen checks before
   claiming comprehensive accessibility.

For verified implemented screens and functionality, see
[Features](./FEATURES.md). The engineering details are in
[Architecture](./ARCHITECTURE.md).
