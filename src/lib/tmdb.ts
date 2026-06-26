import type {
  CastMember,
  Genre,
  MediaItem,
  MovieDetails,
  TMDBResponse,
  TVDetails,
  Video,
  WatchProvider,
  WatchProviderResult,
} from "./types";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  if (!API_KEY) {
    throw new Error("TMDB_API_KEY is not configured");
  }

  const searchParams = new URLSearchParams({ api_key: API_KEY, ...params });
  const res = await fetch(`${BASE_URL}${path}?${searchParams}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export function isConfigured(): boolean {
  return !!API_KEY;
}

export async function getTrending(
  mediaType: "all" | "movie" | "tv" = "all",
  timeWindow: "day" | "week" = "week"
): Promise<TMDBResponse<MediaItem>> {
  return tmdbFetch(`/trending/${mediaType}/${timeWindow}`);
}

export async function searchMulti(
  query: string,
  page = 1
): Promise<TMDBResponse<MediaItem>> {
  return tmdbFetch("/search/multi", { query, page: String(page) });
}

export interface DiscoverParams {
  page?: number;
  with_genres?: string;
  with_watch_providers?: string;
  watch_region?: string;
  sort_by?: string;
  primary_release_year?: string;
  first_air_date_year?: string;
  vote_average_gte?: string;
  vote_average_lte?: string;
  with_runtime_gte?: string;
  with_runtime_lte?: string;
  vote_count_gte?: string;
}

function buildDiscoverParams(params: DiscoverParams): Record<string, string> {
  const fetchParams: Record<string, string> = {};
  if (params.page) fetchParams.page = String(params.page);
  if (params.with_genres) fetchParams.with_genres = params.with_genres;
  if (params.with_watch_providers) {
    fetchParams.with_watch_providers = params.with_watch_providers;
    fetchParams.watch_region = params.watch_region || "US";
    fetchParams.with_watch_monetization_types = "flatrate|rent|buy";
  }
  if (params.sort_by) fetchParams.sort_by = params.sort_by;
  if (params.vote_average_gte) fetchParams["vote_average.gte"] = params.vote_average_gte;
  if (params.vote_average_lte) fetchParams["vote_average.lte"] = params.vote_average_lte;
  if (params.with_runtime_gte) fetchParams["with_runtime.gte"] = params.with_runtime_gte;
  if (params.with_runtime_lte) fetchParams["with_runtime.lte"] = params.with_runtime_lte;
  if (params.vote_count_gte) fetchParams["vote_count.gte"] = params.vote_count_gte;
  return fetchParams;
}

export async function discoverMovies(params: DiscoverParams = {}): Promise<TMDBResponse<MediaItem>> {
  const fetchParams = buildDiscoverParams(params);
  if (params.primary_release_year) fetchParams.primary_release_year = params.primary_release_year;
  return tmdbFetch("/discover/movie", fetchParams);
}

export async function discoverTV(params: DiscoverParams = {}): Promise<TMDBResponse<MediaItem>> {
  const fetchParams = buildDiscoverParams(params);
  if (params.first_air_date_year) fetchParams.first_air_date_year = params.first_air_date_year;
  return tmdbFetch("/discover/tv", fetchParams);
}

export async function getWatchProviderList(
  type: "movie" | "tv"
): Promise<{ results: WatchProvider[] }> {
  return tmdbFetch(`/watch/providers/${type}`, { watch_region: "US" });
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return tmdbFetch(`/movie/${id}`);
}

export async function getTVDetails(id: number): Promise<TVDetails> {
  return tmdbFetch(`/tv/${id}`);
}

export async function getCredits(
  type: "movie" | "tv",
  id: number
): Promise<{ cast: CastMember[] }> {
  return tmdbFetch(`/${type}/${id}/credits`);
}

export async function getVideos(
  type: "movie" | "tv",
  id: number
): Promise<{ results: Video[] }> {
  return tmdbFetch(`/${type}/${id}/videos`);
}

export async function getWatchProviders(
  type: "movie" | "tv",
  id: number
): Promise<{ results: Record<string, WatchProviderResult> }> {
  return tmdbFetch(`/${type}/${id}/watch/providers`);
}

export async function getGenres(
  type: "movie" | "tv"
): Promise<{ genres: Genre[] }> {
  return tmdbFetch(`/genre/${type}/list`);
}

export async function getSimilar(
  type: "movie" | "tv",
  id: number
): Promise<TMDBResponse<MediaItem>> {
  return tmdbFetch(`/${type}/${id}/similar`);
}

export interface DiscoverDateRangeParams extends DiscoverParams {
  primary_release_date_gte?: string;
  primary_release_date_lte?: string;
  first_air_date_gte?: string;
  first_air_date_lte?: string;
}

export async function discoverMoviesDateRange(
  params: DiscoverDateRangeParams
): Promise<TMDBResponse<MediaItem>> {
  const fetchParams = buildDiscoverParams(params);
  if (params.primary_release_date_gte) fetchParams["primary_release_date.gte"] = params.primary_release_date_gte;
  if (params.primary_release_date_lte) fetchParams["primary_release_date.lte"] = params.primary_release_date_lte;
  return tmdbFetch("/discover/movie", fetchParams);
}

export async function discoverTVDateRange(
  params: DiscoverDateRangeParams
): Promise<TMDBResponse<MediaItem>> {
  const fetchParams = buildDiscoverParams(params);
  if (params.first_air_date_gte) fetchParams["first_air_date.gte"] = params.first_air_date_gte;
  if (params.first_air_date_lte) fetchParams["first_air_date.lte"] = params.first_air_date_lte;
  return tmdbFetch("/discover/tv", fetchParams);
}

export function getImageUrl(
  path: string | null,
  size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "w1280" | "original" = "w500"
): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getDisplayTitle(item: MediaItem): string {
  return item.title ?? item.name ?? "Untitled";
}

export function getDisplayDate(item: MediaItem): string | undefined {
  return item.release_date ?? item.first_air_date;
}

export function getYear(dateStr: string | undefined): string {
  if (!dateStr) return "";
  return dateStr.split("-")[0];
}
