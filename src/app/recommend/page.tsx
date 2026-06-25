import { getGenres, isConfigured } from "@/lib/tmdb";
import RecommendForm from "./RecommendForm";
import SetupGuide from "@/components/SetupGuide";

async function fetchGenres() {
  const [movieGenres, tvGenres] = await Promise.all([
    getGenres("movie"),
    getGenres("tv"),
  ]);
  return { movieGenres: movieGenres.genres, tvGenres: tvGenres.genres };
}

export default async function RecommendPage() {
  if (!isConfigured()) return <SetupGuide />;

  const { movieGenres, tvGenres } = await fetchGenres();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white">Find My Next Watch</h1>
        <p className="mt-3 text-zinc-400">
          Answer a few quick questions and we&apos;ll find the perfect movie or show for you
        </p>
      </div>

      <RecommendForm movieGenres={movieGenres} tvGenres={tvGenres} />
    </div>
  );
}
