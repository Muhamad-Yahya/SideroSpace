"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  FileText,
  Orbit,
  Search,
  Sparkles,
} from "lucide-react";
import { askQuestions, type AskQuestion, type Experiment } from "@/lib/ask-knowledge";
import {
  getExperimentId,
  getSearchParam,
  parseExperimentContext,
  researchHref,
} from "@/lib/research-context";
import {
  replaceResearchSearchParam,
  setResearchSearchParam,
  useResearchUrl,
} from "@/lib/use-research-url";

type EvidencePassage = {
  id?: string;
  source?: string;
  text?: string;
  content?: string;
  chunk?: string;
};

type SearchResponse = {
  results?: EvidencePassage[];
  passages?: EvidencePassage[];
  error?: string;
};

type ExperimentFilter = "ALL" | Experiment;

const experimentColors: Record<Experiment, string> = {
  FLEX: "border-violet-300/25 bg-violet-300/10 text-violet-200",
  "BASS-II": "border-sky-300/25 bg-sky-300/10 text-sky-200",
  "SAFFIRE-I": "border-orange-300/25 bg-orange-300/10 text-orange-200",
};

const experimentOptions: ExperimentFilter[] = [
  "ALL",
  "FLEX",
  "BASS-II",
  "SAFFIRE-I",
];

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function selectMixedQuestions(
  questions: AskQuestion[],
  limit: number,
  excludeId?: string,
  randomize = true,
): AskQuestion[] {
  const groups = (["FLEX", "BASS-II", "SAFFIRE-I"] as const)
    .map((experiment) => {
      const group = questions.filter(
        (question) =>
          question.experiment === experiment && question.id !== excludeId,
      );
      return randomize ? shuffle(group) : group;
    })
    .filter((group) => group.length > 0);

  const orderedGroups = randomize ? shuffle(groups) : groups;
  const selected: AskQuestion[] = [];

  for (let index = 0; selected.length < limit; index += 1) {
    let added = false;

    for (const group of orderedGroups) {
      if (group[index]) {
        selected.push(group[index]);
        added = true;
        if (selected.length === limit) break;
      }
    }

    if (!added) break;
  }

  return selected;
}

function sourceFilenames(passages: EvidencePassage[]): string[] {
  const filenames = new Map<string, string>();

  for (const passage of passages) {
    if (!passage.source) continue;

    for (const part of passage.source.split("::")) {
      const filename = part.trim().split(/[\\/]/).pop()?.trim();
      if (!filename) continue;

      const key = filename.toLowerCase();
      if (!filenames.has(key)) filenames.set(key, filename);
    }
  }

  return [...filenames.values()];
}

export default function AskPage() {
  const search = useResearchUrl();
  const query = getSearchParam(search, "q") ?? "";
  const context = parseExperimentContext(search);
  const experiment: ExperimentFilter = getExperimentId(search) ?? "ALL";
  const [selectedQuestion, setSelectedQuestion] = useState<AskQuestion | null>(
    null,
  );
  const [answerQuestion, setAnswerQuestion] = useState<AskQuestion | null>(
    null,
  );
  const [passages, setPassages] = useState<EvidencePassage[]>([]);
  const [relatedQuestions, setRelatedQuestions] = useState<AskQuestion[]>([]);
  const [suggestionPool, setSuggestionPool] = useState(() =>
    selectMixedQuestions(askQuestions, 12, undefined, false),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSuggestionPool(selectMixedQuestions(askQuestions, 12));
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const visibleSuggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return suggestionPool.filter(
        (item) => experiment === "ALL" || item.experiment === experiment,
      );
    }

    return askQuestions
      .filter((item) => {
        const matchesExperiment =
          experiment === "ALL" || item.experiment === experiment;

        return (
          matchesExperiment &&
          (item.question.toLowerCase().includes(normalizedQuery) ||
            item.experiment.toLowerCase().includes(normalizedQuery))
        );
      })
      .slice(0, 12);
  }, [experiment, query, suggestionPool]);

  const consultedSources = useMemo(
    () => sourceFilenames(passages),
    [passages],
  );

  function changeExperiment(next: ExperimentFilter) {
    setResearchSearchParam(
      "experiment",
      next === "ALL" ? null : next,
    );
  }

  function selectSuggestion(item: AskQuestion) {
    changeExperiment(item.experiment);
    replaceResearchSearchParam("q", item.question);
    setSelectedQuestion(item);
    setError("");
    setSearched(false);
    setAnswerQuestion(null);
    setPassages([]);
    setRelatedQuestions([]);
  }

  function handleQueryChange(value: string) {
    replaceResearchSearchParam("q", value || null);
    setSelectedQuestion(null);
    setSearched(false);
    setAnswerQuestion(null);
    setPassages([]);
    setRelatedQuestions([]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery || loading) return;

    const matchedQuestion =
      selectedQuestion?.question === trimmedQuery
        ? selectedQuestion
        : askQuestions.find(
            (item) =>
              item.question.toLowerCase() === trimmedQuery.toLowerCase(),
          ) ?? null;

    setLoading(true);
    setError("");
    setSearched(true);
    setAnswerQuestion(null);
    setPassages([]);
    setRelatedQuestions([]);

    try {
      const searchQuery = matchedQuestion?.evidenceQuery ?? trimmedQuery;
      const searchExperiment =
        matchedQuestion?.experiment ??
        (experiment === "ALL" ? "" : experiment);
      const params = new URLSearchParams({
        q: searchQuery,
        limit: "8",
      });

      if (searchExperiment) params.set("experiment", searchExperiment);

      const response = await fetch(
        `/api/research/search?${params.toString()}`,
      );
      const data = (await response.json()) as SearchResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "The evidence search could not finish.");
      }

      setAnswerQuestion(matchedQuestion);
      setPassages(data.passages ?? data.results ?? []);
      setRelatedQuestions(
        selectMixedQuestions(askQuestions, 5, matchedQuestion?.id),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while searching the research library.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070812] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_68%_5%,rgba(111,72,194,0.17),transparent_38%),radial-gradient(ellipse_at_10%_35%,rgba(37,71,122,0.12),transparent_35%)]"
      />

      <div className="relative mx-auto w-full max-w-[1320px] px-5 pb-20 pt-8 sm:px-8 lg:px-12">
        <div className="mb-7 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-slate-400 transition hover:text-white"
          >
            <Orbit size={16} className="text-violet-300" />
            SideroSpace <span className="text-slate-600">/</span> RESEARCH INTELLIGENCE
          </Link>
        </div>

        {context.status === "valid" && (
          <nav
            aria-label="Investigation context"
            className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-violet-200/15 bg-violet-200/[0.04] px-4 py-3 text-xs text-slate-300"
          >
            <strong className="text-violet-100">
              Asking about {context.experiment}
            </strong>
            <Link
              href={researchHref("research", context.experiment)}
              className="underline decoration-white/25 underline-offset-4 hover:text-white"
            >
              View Library evidence
            </Link>
            <Link
              href={researchHref("compare", context.experiment)}
              className="underline decoration-white/25 underline-offset-4 hover:text-white"
            >
              Compare data
            </Link>
          </nav>
        )}
        {context.status === "invalid" && (
          <div
            role="status"
            className="mb-5 rounded-2xl border border-amber-200/20 bg-amber-200/[0.05] px-4 py-3 text-xs leading-5 text-amber-100"
          >
            Unknown investigation “{context.value}”. Showing questions from all
            investigations.{" "}
            <button
              type="button"
              onClick={() => changeExperiment("ALL")}
              className="underline underline-offset-4"
            >
              Clear invalid context
            </button>
          </div>
        )}

        <section className="relative isolate overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0c18] shadow-[0_30px_120px_rgba(0,0,0,0.3)]">
          <div className="absolute inset-0 -z-20 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://svs.gsfc.nasa.gov/vis/a010000/a011600/a011640/s3-1024.jpg"
              alt=""
              className="h-full w-full object-cover object-center opacity-55"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070914] via-[#080a16]/95 to-[#080a16]/40" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#090b17] via-transparent to-[#070812]/15" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_72%_38%,rgba(139,92,246,0.25),transparent_47%)]" />

          <div className="grid min-h-[410px] items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(220px,0.7fr)] lg:px-14 lg:py-14">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/[0.08] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200">
                <Sparkles size={13} />
                Ask SideroSpace · Questions grounded in evidence
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Ask{" "}
                <span className="bg-gradient-to-r from-violet-200 via-purple-300 to-orange-200 bg-clip-text text-transparent">
                  SideroSpace.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Explore the science of fire in space across FLEX, BASS-II, and
                SAFFIRE-I. Start with a curated question or search the indexed
                research sources directly.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {(["FLEX", "BASS-II", "SAFFIRE-I"] as const).map((name) => (
                  <span
                    key={name}
                    className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] ${experimentColors[name]}`}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <figure className="relative hidden aspect-[3/2] w-full max-w-[400px] justify-self-end lg:block">
              <Image
                src="/images/sat1.webp"
                alt="Saturn and its rings against a star-filled sky"
                fill
                sizes="(min-width: 1024px) 400px, 0px"
                className="object-contain"
              />
            </figure>
          </div>
        </section>

        <section className="mt-7 overflow-hidden rounded-[26px] border border-white/10 bg-[#0d101d]/90 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 lg:p-8">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300">
                  Ask the archive
                </p>
                <label
                  htmlFor="research-question"
                  className="mt-2 block text-lg font-medium tracking-tight text-white sm:text-xl"
                >
                  What would you like to explore?
                </label>
              </div>
              <span className="hidden items-center gap-1.5 text-xs text-slate-500 sm:inline-flex">
                <FileText size={13} />
                Answers stay tied to indexed source files
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="group relative min-w-0 flex-1">
                <Search
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-violet-300"
                />
                <input
                  id="research-question"
                  value={query}
                  onChange={(event) => handleQueryChange(event.target.value)}
                  placeholder="Ask about flame spread, oxygen limits, droplet extinction..."
                  className="h-14 w-full rounded-2xl border border-white/10 bg-[#080a14]/80 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/50 focus:bg-[#090b17]"
                />
              </div>

              <button
                type="submit"
                disabled={!query.trim() || loading}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 px-7 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(124,58,237,0.24)] transition hover:from-violet-400 hover:to-purple-400 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {loading ? "Searching" : "Search"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Experiment
              </span>
              {experimentOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => changeExperiment(option)}
                  aria-pressed={experiment === option}
                  className={`rounded-full border px-3 py-1.5 text-[11px] transition ${
                    experiment === option
                      ? "border-violet-300/35 bg-violet-300/10 text-violet-100"
                      : "border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {option === "ALL" ? "All experiments" : option}
                </button>
              ))}
            </div>
          </form>

          <div className="border-t border-white/[0.07] px-5 py-5 sm:px-7 lg:px-8 lg:py-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Start exploring
                </p>
                <h2 className="mt-1.5 text-base font-medium text-slate-100">
                  Curated questions
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                Select one to fill the question field
              </span>
            </div>

            {visibleSuggestions.length > 0 ? (
              <div className="grid gap-2.5 md:grid-cols-2">
                {visibleSuggestions.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectSuggestion(item)}
                    className={`group flex min-h-[72px] items-start gap-3 rounded-2xl border p-3.5 text-left transition ${
                      selectedQuestion?.id === item.id
                        ? "border-violet-300/35 bg-violet-300/[0.08]"
                        : "border-white/[0.07] bg-black/15 hover:border-violet-200/20 hover:bg-white/[0.035]"
                    }`}
                  >
                    <span className="mt-0.5 w-5 shrink-0 font-mono text-[10px] text-slate-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`mb-2 inline-flex rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.13em] ${experimentColors[item.experiment]}`}
                      >
                        {item.experiment}
                      </span>
                      <span className="block text-[13px] leading-5 text-slate-300 transition group-hover:text-white">
                        {item.question}
                      </span>
                    </span>
                    <ChevronDown
                      size={15}
                      className="mt-1 shrink-0 -rotate-90 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-violet-200"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-white/[0.07] bg-black/15 px-4 py-5 text-sm text-slate-500">
                No curated questions match. You can still search your own
                question.
              </p>
            )}
          </div>
        </section>

        {loading && (
          <section
            aria-live="polite"
            className="mt-6 flex items-center gap-4 rounded-2xl border border-violet-300/20 bg-violet-300/[0.06] p-5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-200/15 bg-violet-300/[0.08]">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-200/30 border-t-violet-100" />
            </span>
            <span>
              <span className="block text-sm font-medium text-violet-100">
                Analyzing research evidence...
              </span>
              <span className="mt-1 block text-xs text-slate-400">
                Searching the local experiment research index.
              </span>
            </span>
          </section>
        )}

        {error && (
          <section
            role="alert"
            className="mt-6 rounded-2xl border border-red-300/20 bg-red-300/[0.05] p-5 text-sm text-red-100"
          >
            {error}
          </section>
        )}

        {searched && !loading && !error && (
          <section className="mt-7 space-y-5">
            <article className="relative overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-[#121324] via-[#0e1120] to-[#0b0e18] p-6 sm:p-8">
              <div
                aria-hidden="true"
                className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-500/[0.08] blur-3xl"
              />
              <div className="relative">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                    <Sparkles size={14} />
                    Research response
                  </span>
                  {answerQuestion && (
                    <span
                      className={`rounded-md border px-2 py-1 text-[9px] font-bold tracking-[0.12em] ${experimentColors[answerQuestion.experiment]}`}
                    >
                      {answerQuestion.experiment}
                    </span>
                  )}
                </div>

                <h2 className="max-w-4xl text-xl font-medium leading-8 tracking-tight text-white sm:text-2xl">
                  {answerQuestion?.question ?? query}
                </h2>

                <p className="mt-5 max-w-4xl whitespace-pre-line text-sm leading-7 text-slate-300 sm:text-[15px]">
                  {answerQuestion
                    ? answerQuestion.answer
                    : "No curated answer is available for this question. The source filenames below are the research files returned by the search; consult those originals for the relevant information."}
                </p>

                {answerQuestion?.note && (
                  <p className="mt-5 max-w-4xl rounded-xl border border-amber-200/15 bg-amber-200/[0.04] px-4 py-3 text-xs leading-6 text-amber-100/80">
                    {answerQuestion.note}
                  </p>
                )}
              </div>
            </article>

            <section className="rounded-[22px] border border-white/[0.08] bg-[#0c0f1a]/85 p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2.5">
                <BookOpen size={16} className="text-violet-300" />
                <h2 className="text-sm font-medium text-slate-100">
                  Sources consulted
                </h2>
              </div>

              {consultedSources.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {consultedSources.map((filename) => (
                    <li
                      key={filename}
                      className="inline-flex max-w-full items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-xs text-slate-300"
                    >
                      <FileText
                        size={13}
                        className="shrink-0 text-violet-300"
                      />
                      <span className="break-all">{filename}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">
                  No source filenames were returned for this search.
                </p>
              )}
            </section>

            {relatedQuestions.length > 0 && (
              <section className="rounded-[22px] border border-white/[0.08] bg-[#0c0f1a]/85 p-5 sm:p-6">
                <div className="mb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-violet-300">
                    Keep exploring
                  </p>
                  <h2 className="mt-1.5 text-base font-medium text-slate-100">
                    Explore further
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Choose a question to fill the search field, then press
                    Search.
                  </p>
                </div>

                <div className="grid gap-2.5 md:grid-cols-2">
                  {relatedQuestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectSuggestion(item)}
                      className="group flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-black/15 p-3.5 text-left transition hover:border-violet-200/20 hover:bg-white/[0.035]"
                    >
                      <span
                        className={`mt-0.5 shrink-0 rounded-md border px-2 py-1 text-[9px] font-bold tracking-[0.12em] ${experimentColors[item.experiment]}`}
                      >
                        {item.experiment}
                      </span>
                      <span className="min-w-0 flex-1 text-[13px] leading-5 text-slate-300 transition group-hover:text-white">
                        {item.question}
                      </span>
                      <ArrowRight
                        size={14}
                        className="mt-1 shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-violet-200"
                      />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </section>
        )}

        <footer className="mt-10 border-t border-white/[0.07] pt-5 text-[10px] leading-5 text-slate-600">
          SideroSpace research assistant · Curated answers are paired with source
          files from the local research index.
        </footer>
      </div>
    </main>
  );
}
