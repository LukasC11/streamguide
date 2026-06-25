"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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

interface MultiSelectDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onApply: (values: string[]) => void;
}

function MultiSelectDropdown({ label, options, selected, onApply }: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onApply(next);
  };

  const handleClear = () => {
    onApply([]);
    setOpen(false);
  };

  const selectedCount = selected.length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
      >
        <span>{label}</span>
        {selectedCount > 0 && (
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-medium text-white">
            {selectedCount}
          </span>
        )}
        <svg
          className={`h-4 w-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl">
          <div className="max-h-60 overflow-y-auto p-2">
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => toggle(opt.value)}
                  className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                />
                {opt.label}
              </label>
            ))}
          </div>
          {selectedCount > 0 && (
            <div className="border-t border-zinc-800 px-3 py-2">
              <button
                onClick={handleClear}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface DiscoverFiltersProps {
  genres: Genre[];
  providers: WatchProvider[];
  mediaType: "movie" | "tv";
}

export default function DiscoverFilters({ genres, providers, mediaType }: DiscoverFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentGenres = searchParams.get("genre")?.split(",").filter(Boolean) ?? [];
  const currentProviders = searchParams.get("provider")?.split(",").filter(Boolean) ?? [];
  const currentYear = searchParams.get("year") ?? "";
  const currentSort = searchParams.get("sort") ?? "popularity.desc";
  const currentRating = searchParams.get("rating") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      params.delete("page");
      router.push(`/discover/${mediaType}?${params.toString()}`);
    },
    [router, searchParams, mediaType]
  );

  const updateMultiFilter = useCallback(
    (key: string, values: string[]) => {
      updateParams({ [key]: values.join(",") });
    },
    [updateParams]
  );

  const updateSingleFilter = useCallback(
    (key: string, value: string) => {
      updateParams({ [key]: value });
    },
    [updateParams]
  );

  const clearFilters = useCallback(() => {
    router.push(`/discover/${mediaType}`);
  }, [router, mediaType]);

  const hasFilters =
    currentGenres.length > 0 ||
    currentProviders.length > 0 ||
    currentYear ||
    currentRating ||
    currentSort !== "popularity.desc";

  const displayProviders = TOP_PROVIDERS.filter((tp) =>
    providers.some((p) => p.provider_id === tp.id)
  );

  const genreOptions = genres.map((g) => ({ value: String(g.id), label: g.name }));
  const providerOptions = displayProviders.map((p) => ({ value: String(p.id), label: p.name }));

  const selectedGenreNames = currentGenres
    .map((id) => genres.find((g) => String(g.id) === id)?.name)
    .filter(Boolean);
  const selectedProviderNames = currentProviders
    .map((id) => displayProviders.find((p) => String(p.id) === id)?.name)
    .filter(Boolean);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <MultiSelectDropdown
          label="Genres"
          options={genreOptions}
          selected={currentGenres}
          onApply={(values) => updateMultiFilter("genre", values)}
        />

        <MultiSelectDropdown
          label="Services"
          options={providerOptions}
          selected={currentProviders}
          onApply={(values) => updateMultiFilter("provider", values)}
        />

        <select
          value={currentYear}
          onChange={(e) => updateSingleFilter("year", e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
        >
          <option value="">All Years</option>
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          value={currentRating}
          onChange={(e) => updateSingleFilter("rating", e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
        >
          <option value="">Any Rating</option>
          {RATING_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        <select
          value={currentSort}
          onChange={(e) => updateSingleFilter("sort", e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-400 hover:border-red-800 hover:text-red-400 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear all
          </button>
        )}
      </div>

      {(selectedGenreNames.length > 0 || selectedProviderNames.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {selectedGenreNames.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 rounded-full bg-indigo-900/40 px-2.5 py-1 text-xs font-medium text-indigo-300 ring-1 ring-indigo-800/50"
            >
              {name}
              <button
                onClick={() => {
                  const genreId = genres.find((g) => g.name === name)?.id;
                  if (genreId) {
                    updateMultiFilter(
                      "genre",
                      currentGenres.filter((id) => id !== String(genreId))
                    );
                  }
                }}
                className="ml-0.5 hover:text-indigo-100 transition-colors"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          {selectedProviderNames.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-900/40 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-800/50"
            >
              {name}
              <button
                onClick={() => {
                  const providerId = displayProviders.find((p) => p.name === name)?.id;
                  if (providerId) {
                    updateMultiFilter(
                      "provider",
                      currentProviders.filter((id) => id !== String(providerId))
                    );
                  }
                }}
                className="ml-0.5 hover:text-emerald-100 transition-colors"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
