
export interface EvidencePassage {
  id: string;
  experiment: "FLEX" | "BASS-II" | "SAFFIRE-I";
  source: string;
  source_type: string;
  page: number | null;
  chunk: number;
  text: string;
}

export interface EvidenceSearchResult {
  passage: EvidencePassage;
  score: number;
}

function normalizeEvidenceText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateSimilarity(a: string, b: string): number {
  const first = normalizeEvidenceText(a);
  const second = normalizeEvidenceText(b);

  if (first === second) return 1;
  if (!first.length || !second.length) return 0;

  const firstWords = new Set(
    a.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/)
  );
  const secondWords = new Set(
    b.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/)
  );

  const intersection = [...firstWords].filter(
    (word) => secondWords.has(word)
  ).length;

  const union = new Set([...firstWords, ...secondWords]).size;

  return union === 0 ? 0 : intersection / union;
}

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were",
  "what", "how", "why", "when", "where",
  "does", "do", "did", "can", "could",
  "and", "or", "to", "of", "in", "on",
  "for", "with", "about", "from", "by"
]);

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, " ")
    .split(/\s+/)
    .filter(
      (word) => word.length > 1 && !STOP_WORDS.has(word)
    );
}

function getEvidenceQuality(text: string): number {
  const normalized = text.toLowerCase();

  const directEvidenceTerms = [
    "experimental results",
    "results show",
    "measured",
    "measurements",
    "experimental procedure",
    "test procedure",
    "data analysis",
    "burning rate",
    "flame extinction",
  ];

  const contextTerms = [
    "objectives include",
    "primary objective",
    "investigation objective",
    "study aims",
    "instruments",
    "primary variables",
  ];

  const publicationTerms = [
    "study publication title",
    "publication title",
    "study publication author",
  ];

  const directCount = directEvidenceTerms.filter(
    (term) => normalized.includes(term)
  ).length;

  const contextCount = contextTerms.filter(
    (term) => normalized.includes(term)
  ).length;

  const publicationCount = publicationTerms.filter(
    (term) => normalized.includes(term)
  ).length;

  let quality = 0;

  if (directCount > 0) quality += 4;
  if (contextCount > 0) quality += 2;
  if (publicationCount > 0) quality -= 5;

  return quality;
}

function calculateScore(
  queryTerms: string[],
  passage: EvidencePassage
): number {
  const text = passage.text.toLowerCase();
  const source = passage.source.toLowerCase();

  let score = 0;

  for (const term of queryTerms) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = text.match(
      new RegExp(`\\b${escaped}\\b`, "g")
    );

    if (matches) {
      score += Math.min(matches.length, 3) * 2;
    }

    if (source.includes(term)) {
      score += 1;
    }
  }

  // Prefer substantive research documents.
  if (passage.source_type === "PDF") {
    score += 3;
  }

  // Reward passages discussing actual research.
  const positiveTerms = [
    "results",
    "objective",
    "experiment",
    "oxygen concentration",
    "flame growth",
    "flame spread",
    "extinction",
    "burning rate",
    "measurements",
    "findings",
    "data",
  ];

  for (const term of positiveTerms) {
    if (text.includes(term)) score += 1;
  }

  const evidenceTerms = [
    "objectives include",
    "primary objective",
    "experimental procedure",
    "test procedure",
    "experimental results",
    "measured",
    "measurements",
    "results show",
  ];

  for (const term of evidenceTerms) {
    if (text.includes(term)) score += 2;
  }

  const metadataTerms = [
    "ontology source reference",
    "term source name",
    "investigation person email",
    "investigation person phone",
    "study submission date",
    "investigation contacts",

    // Bibliographic metadata: useful for discovery, not direct evidence
    "study publication title",
    "study publication author",
    "publication title",
    "publication authors",
  ];

  for (const term of metadataTerms) {
    if (text.includes(term)) score -= 4;
  }

  if (source.includes("iinvestigation.txt")) {
    score -= 3;
  }

  score += getEvidenceQuality(text);

  return Math.max(0, score);
}



export function searchEvidence(
  passages: EvidencePassage[],
  query: string,
  experiment?: string,
  limit = 8
): EvidenceSearchResult[] {
  const queryTerms = [...new Set(tokenize(query))];

  if (queryTerms.length === 0) return [];

  const uniquePassages: EvidencePassage[] = [];

  const sourcePriority: Record<string, number> = {
    PDF: 3,
    "ZIP metadata": 2,
    "Text metadata": 1,
  };

  for (const passage of passages) {
    if (
      experiment &&
      experiment !== "ALL" &&
      passage.experiment !== experiment
    ) {
      continue;
    }

    const duplicateIndex = uniquePassages.findIndex(
      (existing) =>
        existing.experiment === passage.experiment &&
        calculateSimilarity(existing.text, passage.text) >= 0.95
    );

    if (duplicateIndex === -1) {
      uniquePassages.push(passage);
      continue;
    }

    const existing = uniquePassages[duplicateIndex];

    if (
      (sourcePriority[passage.source_type] ?? 0) >
        (sourcePriority[existing.source_type] ?? 0)
    ) {
      uniquePassages[duplicateIndex] = passage;
    }
  }

  const ranked = uniquePassages
    .map((passage) => ({
      passage,
      score: calculateScore(queryTerms, passage),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);

  const selected: EvidenceSearchResult[] = [];
  const sourceCounts = new Map<string, number>();

  for (const result of ranked) {
    if (selected.length >= limit) break;

    const sourceKey =
      `${result.passage.experiment}::${result.passage.source}`;

    const count = sourceCounts.get(sourceKey) ?? 0;

    // Allow multiple passages from one source,
    // but prevent one document from dominating.
    if (count >= 3) continue;

    selected.push(result);
    sourceCounts.set(sourceKey, count + 1);
  }

  return selected;
}
