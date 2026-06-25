"use client";

import { useState, useCallback } from "react";
import type { MediaItem } from "@/lib/types";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/watchlist";

interface WatchlistButtonProps {
  item: MediaItem;
  size?: "sm" | "md";
}

export default function WatchlistButton({ item, size = "sm" }: WatchlistButtonProps) {
  const [inList, setInList] = useState(() => isInWatchlist(item.id, item.media_type));

  const toggle = useCallback(() => {
    if (inList) {
      removeFromWatchlist(item.id, item.media_type);
      setInList(false);
    } else {
      addToWatchlist(item);
      setInList(true);
    }
  }, [inList, item]);

  const sizeClasses = size === "md"
    ? "px-4 py-2 text-sm gap-2"
    : "p-1.5";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      title={inList ? "Remove from watchlist" : "Add to watchlist"}
      className={`flex items-center rounded-lg transition-all ${sizeClasses} ${
        inList
          ? "bg-indigo-600 text-white hover:bg-indigo-500"
          : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-white backdrop-blur-sm"
      }`}
    >
      {inList ? (
        <svg className={size === "md" ? "h-5 w-5" : "h-4 w-4"} fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ) : (
        <svg className={size === "md" ? "h-5 w-5" : "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )}
      {size === "md" && (
        <span>{inList ? "In Watchlist" : "Add to Watchlist"}</span>
      )}
    </button>
  );
}
