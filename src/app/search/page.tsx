import { searchMulti, isConfigured } from "@/lib/tmdb";
import type { MediaItem } from "@/lib/types";
import MediaGrid from "@/components/MediaGrid";
import SetupGuide from "@/components/SetupGuide";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  if (!isConfigured()) {
    return <SetupGuide />;
  }

  const { q, page } = await searchParams;

  if (!q) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 text-center">
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Search</h1>
        <p className="text-zinc-400">
          Enter a title to search for movies and TV shows.
        </p>
      </div>
    );
  }

  const pageNum = page ? parseInt(page, 10) : 1;

  let results: MediaItem[] = [];
  let totalResults = 0;
  let searchError = false;

  try {
    const data = await searchMulti(q, pageNum);
    results = data.results.filter(
      (item) => item.media_type === "movie" || item.media_type === "tv"
    );
    totalResults = data.total_results;
  } catch {
    searchError = true;
  }

  if (searchError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 text-center">
        <p className="text-zinc-400">
          Search failed. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">
          Results for &ldquo;{q}&rdquo;
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {totalResults} result{totalResults !== 1 ? "s" : ""} found
        </p>
      </div>

      {results.length > 0 ? (
        <MediaGrid items={results} />
      ) : (
        <div className="py-16 text-center">
          <p className="text-zinc-400">
            No movies or TV shows found for &ldquo;{q}&rdquo;.
          </p>
        </div>
      )}
    </div>
  );
}
