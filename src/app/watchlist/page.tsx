"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { getWatchlist, removeFromWatchlist } from "@/lib/watchlist";

let watchlistVersion = 0;
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return watchlistVersion;
}

function getServerSnapshot() {
  return 0;
}

function notifyChange() {
  watchlistVersion++;
  for (const listener of listeners) listener();
}

export default function WatchlistPage() {
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items = getWatchlist();
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

  function handleRemove(id: number, mediaType: "movie" | "tv") {
    removeFromWatchlist(id, mediaType);
    notifyChange();
  }

  const filtered = filter === "all" ? items : items.filter((i) => i.media_type === filter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {items.length} title{items.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "movie", "tv"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {f === "all" ? "All" : f === "movie" ? "Movies" : "TV Shows"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="mb-4 h-16 w-16 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-lg text-zinc-400">
            {items.length === 0
              ? "Your watchlist is empty"
              : "No titles match this filter"}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {items.length === 0
              ? "Hover over any title and click the bookmark icon to save it here."
              : "Try a different filter to see your saved titles."}
          </p>
          {items.length === 0 && (
            <Link
              href="/"
              className="mt-6 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Browse Content
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const posterUrl = item.poster_path
              ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
              : null;
            const date = item.release_date ?? item.first_air_date ?? "";
            const year = date ? date.split("-")[0] : "";

            return (
              <div
                key={`${item.media_type}-${item.id}`}
                className="flex gap-4 rounded-xl bg-zinc-900 p-4 ring-1 ring-zinc-800"
              >
                <Link href={`/${item.media_type}/${item.id}`} className="shrink-0">
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={item.title}
                      width={80}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-[120px] w-[80px] items-center justify-center rounded-lg bg-zinc-800 text-zinc-600">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/${item.media_type}/${item.id}`}
                      className="font-semibold text-zinc-100 hover:text-indigo-400 transition-colors line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                      <span className="rounded bg-indigo-600/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-indigo-400">
                        {item.media_type === "tv" ? "TV" : "Film"}
                      </span>
                      {year && <span>{year}</span>}
                      {item.vote_average > 0 && (
                        <span className="flex items-center gap-0.5">
                          <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {item.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id, item.media_type)}
                    className="mt-2 self-start rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-red-900/50 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
