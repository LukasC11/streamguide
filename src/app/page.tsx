import Link from "next/link";
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

        <section className="rounded-2xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-8 ring-1 ring-indigo-500/20">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Not sure what to watch?</h2>
              <p className="mt-2 text-zinc-300">
                Tell us your mood and preferences — we&apos;ll find the perfect match.
              </p>
            </div>
            <Link
              href="/recommend"
              className="shrink-0 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Find My Next Watch →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
