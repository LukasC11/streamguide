import { Suspense } from "react";
import {
  discoverTV,
  getGenres,
  getWatchProviderList,
  isConfigured,
} from "@/lib/tmdb";
import type { MediaItem } from "@/lib/types";
import DiscoverFilters from "@/components/DiscoverFilters";
import MediaGrid from "@/components/MediaGrid";
import Pagination from "@/components/Pagination";
import SetupGuide from "@/components/SetupGuide";

async function fetchDiscoverData(searchParams: Record<string, string | undefined>) {
  const page = parseInt(searchParams.page ?? "1", 10) || 1;

  const [genres, providers, results] = await Promise.all([
    getGenres("tv"),
    getWatchProviderList("tv"),
    discoverTV({
      page,
      with_genres: searchParams.genre || undefined,
      with_watch_providers: searchParams.provider || undefined,
      sort_by: searchParams.sort || "popularity.desc",
      first_air_date_year: searchParams.year || undefined,
      vote_average_gte: searchParams.rating || undefined,
      vote_count_gte: searchParams.rating ? "50" : undefined,
    }),
  ]);

  const items: MediaItem[] = results.results.map((item) => ({
    ...item,
    media_type: "tv" as const,
  }));

  return { genres: genres.genres, providers: providers.results, items, totalPages: results.total_pages, page };
}

export default async function DiscoverTVPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  if (!isConfigured()) return <SetupGuide />;

  const resolvedSearchParams = await searchParams;
  const { genres, providers, items, totalPages, page } = await fetchDiscoverData(resolvedSearchParams);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Discover TV Shows</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Browse and filter TV shows across all streaming services
        </p>
      </div>

      <Suspense fallback={null}>
        <DiscoverFilters genres={genres} providers={providers} mediaType="tv" />
      </Suspense>

      <div className="mt-8">
        {items.length > 0 ? (
          <>
            <MediaGrid items={items} />
            <Suspense fallback={null}>
              <Pagination currentPage={page} totalPages={totalPages} basePath="/discover/tv" />
            </Suspense>
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-zinc-400">No TV shows found matching your filters.</p>
            <p className="mt-2 text-sm text-zinc-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
}
