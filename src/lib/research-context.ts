export const experimentIds = ["FLEX", "BASS-II", "SAFFIRE-I"] as const;

export type ExperimentId = (typeof experimentIds)[number];

export type ExperimentContext =
  | { status: "absent" }
  | { status: "valid"; experiment: ExperimentId }
  | { status: "invalid"; value: string };

export function getSearchParam(search: string, key: string): string | null {
  return new URLSearchParams(search).get(key);
}

export function parseExperimentContext(search: string): ExperimentContext {
  const value = getSearchParam(search, "experiment");

  if (value === null) return { status: "absent" };
  const experiment = experimentIds.find((item) => item === value);
  if (experiment) return { status: "valid", experiment };

  return { status: "invalid", value };
}

export function getExperimentId(search: string): ExperimentId | null {
  const context = parseExperimentContext(search);
  return context.status === "valid" ? context.experiment : null;
}

export function experimentFromContentId(
  id: "flex" | "bass" | "saffire",
): ExperimentId {
  switch (id) {
    case "flex":
      return "FLEX";
    case "bass":
      return "BASS-II";
    case "saffire":
      return "SAFFIRE-I";
  }
}

export function researchHref(
  area: "compare" | "research" | "ask",
  experiment: ExperimentId,
): string {
  const params = new URLSearchParams({ experiment });

  if (area === "compare" && experiment !== "SAFFIRE-I") {
    params.set("dataset", experiment);
  }

  return `/${area}?${params.toString()}`;
}

export function investigationHref(experiment: ExperimentId): string {
  const route =
    experiment === "FLEX"
      ? "/flex"
      : experiment === "BASS-II"
        ? "/bass-ii"
        : "/saffire";
  const target =
    experiment === "FLEX"
      ? "data-explorer"
      : experiment === "BASS-II"
        ? "data-explorer"
        : "explorer";

  return `${route}#${target}`;
}

export function updateSearchParam(
  search: string,
  key: string,
  value: string | null,
): string {
  const params = new URLSearchParams(search);

  if (value === null) params.delete(key);
  else params.set(key, value);

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function updateSearchParams(
  search: string,
  updates: readonly (readonly [string, string | null])[],
): string {
  return updates.reduce(
    (current, [key, value]) => updateSearchParam(current, key, value),
    search,
  );
}
