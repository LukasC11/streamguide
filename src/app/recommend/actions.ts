"use server";

import { discoverMovies, discoverTV } from "@/lib/tmdb";
import type { MediaItem } from "@/lib/types";

export interface RecommendationRequest {
  mediaType: "movie" | "tv" | "both";
  genres: string[];
  mood: string;
  runtimePreference: string;
  services: string[];
  minRating: string;
}

const MOOD_TO_GENRES: Record<string, number[]> = {
  happy: [35, 10402, 10751],
  thrilling: [28, 53, 80],
  thoughtful: [18, 36, 99],
  scary: [27, 9648],
  adventurous: [12, 14, 878],
  romantic: [10749, 35],
};

export async function getRecommendations(
  request: RecommendationRequest
): Promise<MediaItem[]> {
  const moodGenres = MOOD_TO_GENRES[request.mood] ?? [];
  const allGenres = [...new Set([...request.genres.map(Number), ...moodGenres])];
  const genreStr = allGenres.length > 0 ? allGenres.join(",") : undefined;
  const providerStr = request.services.length > 0 ? request.services.join("|") : undefined;

  let runtimeGte: string | undefined;
  let runtimeLte: string | undefined;
  switch (request.runtimePreference) {
    case "short":
      runtimeLte = "90";
      break;
    case "medium":
      runtimeGte = "90";
      runtimeLte = "150";
      break;
    case "long":
      runtimeGte = "150";
      break;
  }

  const params = {
    with_genres: genreStr,
    with_watch_providers: providerStr,
    watch_region: "US",
    sort_by: "vote_average.desc",
    vote_average_gte: request.minRating || "7",
    vote_count_gte: "100",
    with_runtime_gte: runtimeGte,
    with_runtime_lte: runtimeLte,
  };

  const results: MediaItem[] = [];

  if (request.mediaType === "movie" || request.mediaType === "both") {
    const movies = await discoverMovies(params);
    results.push(
      ...movies.results.slice(0, 10).map((m) => ({ ...m, media_type: "movie" as const }))
    );
  }

  if (request.mediaType === "tv" || request.mediaType === "both") {
    const tvParams = { ...params };
    delete tvParams.with_runtime_gte;
    delete tvParams.with_runtime_lte;
    const shows = await discoverTV(tvParams);
    results.push(
      ...shows.results.slice(0, 10).map((s) => ({ ...s, media_type: "tv" as const }))
    );
  }

  results.sort((a, b) => b.vote_average - a.vote_average);
  return results;
}
