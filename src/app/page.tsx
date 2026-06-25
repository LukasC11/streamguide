import { getTrending, isConfigured } from "@/lib/tmdb";
import type { MediaItem } from "@/lib/types";
import HeroSection from "@/components/HeroSection";
import MediaGrid from "@/components/MediaGrid";
import SetupGuide from "@/components/SetupGuide";

async function fetchTrending() {
  const [allRes, movieRes, tvRes] = await Promise.all([
    getTrending("all", "week"),
    getTrending("movie", "week"),
    getTrending("tv", "week"),
  ]);
  return {
    trending: allRes.results,
    trendingMovies: movieRes.results.map((m) => ({ ...m, media_type: "movie" as const })),
    trendingTV: tvRes.results.map((t) => ({ ...t, media_type: "tv" as const })),
  };
}

export default async function HomePage() {
  if (!isConfigured()) {
    return <SetupGuide />;
  }

  let trending: MediaItem[] = [];
  let trendingMovies: MediaItem[] = [];
  let trendingTV: MediaItem[] = [];
  let fetchError = false;

  try {
    const data = await fetchTrending();
    trending = data.trending;
    trendingMovies = data.trendingMovies;
    trendingTV = data.trendingTV;
  } catch {
    fetchError = true;
  }

  if (fetchError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-zinc-400">
          Failed to load content. Please check your API key and try again.
        </p>
      </div>
    );
  }

  const hero = trending.find((item) => item.backdrop_path) ?? trending[0];

  return (
    <div>
      {hero && <HeroSection item={hero} />}

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6">
        <MediaGrid
          title="Trending This Week"
          items={trending.slice(hero ? 1 : 0, 11)}
        />

        <MediaGrid
          title="Popular Movies"
          items={trendingMovies.slice(0, 10)}
        />

        <MediaGrid
          title="Popular TV Shows"
          items={trendingTV.slice(0, 10)}
        />
      </div>
    </div>
  );
}
