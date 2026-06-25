"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MediaItem } from "@/lib/types";

interface RandomPickProps {
  items: MediaItem[];
}

export default function RandomPick({ items }: RandomPickProps) {
  const [pick, setPick] = useState<MediaItem | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const pickRandom = useCallback(() => {
    if (items.length === 0) return;
    setIsSpinning(true);

    let count = 0;
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * items.length);
      setPick(items[idx]);
      count++;
      if (count >= 8) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 120);
  }, [items]);

  if (items.length === 0) return null;

  const title = pick?.title ?? pick?.name ?? "";
  const type = pick?.media_type === "tv" ? "tv" : "movie";
  const posterUrl = pick?.poster_path
    ? `https://image.tmdb.org/t/p/w342${pick.poster_path}`
    : null;
  const rating = pick?.vote_average ? pick.vote_average.toFixed(1) : null;
  const date = pick?.release_date ?? pick?.first_air_date;
  const year = date ? date.split("-")[0] : "";

  return (
    <div className="rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 ring-1 ring-purple-500/20">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <div className="flex flex-1 flex-col items-center gap-4 sm:items-start">
          <div>
            <h3 className="text-lg font-bold text-white">Can&apos;t Decide?</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Let us pick something random from the current results.
            </p>
          </div>
          <button
            onClick={pickRandom}
            disabled={isSpinning}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-purple-500 disabled:opacity-50"
          >
            <svg
              className={`h-5 w-5 ${isSpinning ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isSpinning ? "Picking..." : "Pick for Me"}
          </button>
        </div>

        {pick && (
          <Link
            href={`/${type}/${pick.id}`}
            className={`flex w-full gap-4 rounded-xl bg-zinc-900/50 p-4 ring-1 ring-zinc-700 transition-all hover:ring-indigo-500/50 sm:w-auto sm:min-w-[280px] ${
              isSpinning ? "opacity-60" : ""
            }`}
          >
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={title}
                width={60}
                height={90}
                className="shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-[90px] w-[60px] shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div>
              <p className="font-semibold text-zinc-100 line-clamp-2">{title}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                <span className="rounded bg-indigo-600/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-indigo-400">
                  {type === "tv" ? "TV" : "Film"}
                </span>
                {year && <span>{year}</span>}
                {rating && (
                  <span className="flex items-center gap-0.5">
                    <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {rating}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-indigo-400">View details →</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
