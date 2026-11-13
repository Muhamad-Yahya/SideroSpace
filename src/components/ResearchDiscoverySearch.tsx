"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle, Search } from "lucide-react";

type SearchResult = {
  id: string;
  experiment: string;
  source: string;
  sourceType: string;
  page: number | null;
  chunk: number;
  text: string;
};

type SearchResponse = {
  error?: string;
  results?: SearchResult[];
  resultCount?: number;
};

export default function ResearchDiscoverySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 3) {
      setError("Enter at least 3 characters to search indexed sources.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ q: trimmedQuery, limit: "5" });
      const response = await fetch(`/api/research/search?${params}`);
      const payload = (await response.json()) as SearchResponse;
      if (!response.ok) {
        throw new Error(payload.error ?? "Research search failed.");
      }
      if (!Array.isArray(payload.results)) {
        throw new Error("The research search returned an invalid response.");
      }

      setResults(payload.results);
      setSearched(true);
    } catch (searchError) {
      setResults([]);
      setSearched(false);
      setError(
        searchError instanceof Error
          ? searchError.message
          : "Research search failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="discovery-search">
      <form className="discovery-search-form" onSubmit={handleSubmit}>
        <Search size={19} aria-hidden="true" />
        <label className="sr-only" htmlFor="dashboard-research-query">
          Search indexed research sources
        </label>
        <input
          id="dashboard-research-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search topics, conditions, materials, or findings…"
          minLength={3}
          maxLength={500}
        />
        <button type="submit" disabled={loading}>
          {loading ? (
            <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <>
              Search sources
              <ArrowRight size={15} aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      {error && (
        <p className="discovery-search-message error" role="alert">
          {error}
        </p>
      )}
      {searched && results.length === 0 && !error && (
        <p className="discovery-search-message" role="status">
          No indexed passages matched that query. Try a broader research term.
        </p>
      )}
      {results.length > 0 && (
        <div className="discovery-results" aria-live="polite">
          <div className="discovery-results-heading">
            <strong>{results.length} relevant source passages</strong>
            <span>Ranked from the current evidence index</span>
          </div>
          {results.map((result) => (
            <article className="discovery-result" key={result.id}>
              <div className="discovery-result-meta">
                <span>{result.experiment}</span>
                <span>{result.sourceType}</span>
                {result.page !== null && <span>Page {result.page}</span>}
              </div>
              <p>{result.text}</p>
              <small>{result.source}</small>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
