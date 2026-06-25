"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Genre, WatchProvider } from "@/lib/types";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "primary_release_date.desc", label: "Newest First" },
  { value: "primary_release_date.asc", label: "Oldest First" },
  { value: "vote_count.desc", label: "Most Voted" },
];

const YEAR_OPTIONS = (() => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let y = currentYear; y >= 1970; y--) {
    years.push(String(y));
  }
  return years;
})();

const RATING_OPTIONS = [
  { value: "9", label: "9+" },
  { value: "8", label: "8+" },
  { value: "7", label: "7+" },
  { value: "6", label: "6+" },
  { value: "5", label: "5+" },
];

const TOP_PROVIDERS = [
  { id: 8, name: "Netflix" },
  { id: 9, name: "Amazon Prime" },
  { id: 337, name: "Disney+" },
  { id: 1899, name: "Max" },
  { id: 15, name: "Hulu" },
  { id: 350, name: "Apple TV+" },
  { id: 386, name: "Peacock" },
  { id: 531, name: "Paramount+" },
];

interface DiscoverFiltersProps {
  genres: Genre[];
  providers: WatchProvider[];
  mediaType: "movie" | "tv";
}

export default function DiscoverFilters({ genres, providers, mediaType }: DiscoverFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentGenre = searchParams.get("genre") ?? "";
  const currentYear = searchParams.get("year") ?? "";
  const currentSort = searchParams.get("sort") ?? "popularity.desc";
  const currentRating = searchParams.get("rating") ?? "";
  const currentProvider = searchParams.get("provider") ?? "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/discover/${mediaType}?${params.toString()}`);
    },
    [router, searchParams, mediaType]
  );

  const clearFilters = useCallback(() => {
    router.push(`/discover/${mediaType}`);
  }, [router, mediaType]);

  const hasFilters = currentGenre || currentYear || currentRating || currentProvider || currentSort !== "popularity.desc";

  const displayProviders = TOP_PROVIDERS.filter((tp) =>
    providers.some((p) => p.provider_id === tp.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <select
          value={currentGenre}
          onChange={(e) => updateFilter("genre", e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={String(g.id)}>{g.name}</option>
          ))}
        </select>

        <select
          value={currentProvider}
          onChange={(e) => updateFilter("provider", e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All Services</option>
          {displayProviders.map((p) => (
            <option key={p.id} value={String(p.id)}>{p.name}</option>
          ))}
        </select>

        <select
          value={currentYear}
          onChange={(e) => updateFilter("year", e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All Years</option>
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          value={currentRating}
          onChange={(e) => updateFilter("rating", e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">Any Rating</option>
          {RATING_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        <select
          value={currentSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
