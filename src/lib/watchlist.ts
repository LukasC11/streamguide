import type { MediaItem } from "./types";

const STORAGE_KEY = "streamguide-watchlist";

export interface WatchlistItem {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  added_at: number;
}

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToWatchlist(item: MediaItem): WatchlistItem[] {
  const list = getWatchlist();
  if (list.some((w) => w.id === item.id && w.media_type === item.media_type)) {
    return list;
  }
  const entry: WatchlistItem = {
    id: item.id,
    media_type: item.media_type,
    title: item.title ?? item.name ?? "Untitled",
    poster_path: item.poster_path,
    vote_average: item.vote_average,
    release_date: item.release_date,
    first_air_date: item.first_air_date,
    added_at: Date.now(),
  };
  const updated = [entry, ...list];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function removeFromWatchlist(id: number, mediaType: "movie" | "tv"): WatchlistItem[] {
  const list = getWatchlist();
  const updated = list.filter((w) => !(w.id === id && w.media_type === mediaType));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function isInWatchlist(id: number, mediaType: "movie" | "tv"): boolean {
  return getWatchlist().some((w) => w.id === id && w.media_type === mediaType);
}
