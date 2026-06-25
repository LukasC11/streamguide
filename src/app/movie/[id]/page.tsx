import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getMovieDetails,
  getCredits,
  getVideos,
  getWatchProviders,
  getSimilar,
  getImageUrl,
  getYear,
  isConfigured,
} from "@/lib/tmdb";
import type { MediaItem } from "@/lib/types";
import ServiceBadge from "@/components/ServiceBadge";
import MediaGrid from "@/components/MediaGrid";
import SetupGuide from "@/components/SetupGuide";

async function fetchMovieData(movieId: number) {
  const [movie, credits, videos, providers, similar] = await Promise.all([
    getMovieDetails(movieId),
    getCredits("movie", movieId),
    getVideos("movie", movieId),
    getWatchProviders("movie", movieId),
    getSimilar("movie", movieId),
  ]);

  const trailer = videos.results.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  const usProviders = providers.results?.US;
  const cast = credits.cast.slice(0, 12);
  const backdropUrl = getImageUrl(movie.backdrop_path, "w1280");
  const posterUrl = getImageUrl(movie.poster_path, "w500");
  const year = getYear(movie.release_date);

  const similarItems: MediaItem[] = similar.results
    .slice(0, 10)
    .map((s) => ({ ...s, media_type: "movie" as const }));

  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;
  const runtime = movie.runtime ? `${hours}h ${minutes}m` : null;

  return { movie, trailer, usProviders, cast, backdropUrl, posterUrl, year, similarItems, runtime };
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  if (!isConfigured()) return <SetupGuide />;

  const { id } = await params;
  const movieId = parseInt(id, 10);
  if (isNaN(movieId)) notFound();

  let data: Awaited<ReturnType<typeof fetchMovieData>>;
  try {
    data = await fetchMovieData(movieId);
  } catch {
    notFound();
  }

  const { movie, trailer, usProviders, cast, backdropUrl, posterUrl, year, similarItems, runtime } = data;

  return (
    <div>
      <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden sm:h-[50vh]">
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="-mt-32 relative z-10 flex flex-col gap-8 sm:flex-row">
          {posterUrl && (
            <div className="shrink-0">
              <Image
                src={posterUrl}
                alt={movie.title}
                width={250}
                height={375}
                className="rounded-xl shadow-2xl ring-1 ring-zinc-800 hidden sm:block"
              />
            </div>
          )}

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="mt-1 text-sm italic text-zinc-400">
                  {movie.tagline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              {year && (
                <span className="text-zinc-400">{year}</span>
              )}
              {runtime && (
                <span className="text-zinc-400">{runtime}</span>
              )}
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 text-zinc-300">
                  <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {movie.vote_average.toFixed(1)}
                </span>
              )}
            </div>

            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {movie.overview && (
              <p className="max-w-2xl text-sm leading-relaxed text-zinc-300">
                {movie.overview}
              </p>
            )}

            {usProviders && (
              <div className="space-y-3">
                {usProviders.flatrate && usProviders.flatrate.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-zinc-200">
                      Stream
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {usProviders.flatrate.map((p) => (
                        <ServiceBadge key={p.provider_id} provider={p} />
                      ))}
                    </div>
                  </div>
                )}
                {usProviders.rent && usProviders.rent.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-zinc-200">
                      Rent
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {usProviders.rent.map((p) => (
                        <ServiceBadge key={p.provider_id} provider={p} />
                      ))}
                    </div>
                  </div>
                )}
                {usProviders.buy && usProviders.buy.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-zinc-200">
                      Buy
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {usProviders.buy.map((p) => (
                        <ServiceBadge key={p.provider_id} provider={p} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {trailer && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-zinc-100">Trailer</h2>
            <div className="aspect-video max-w-3xl overflow-hidden rounded-xl">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </section>
        )}

        {cast.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-zinc-100">Cast</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {cast.map((member) => {
                const profileUrl = getImageUrl(member.profile_path, "w185");
                return (
                  <div key={member.id} className="text-center">
                    <div className="relative mx-auto mb-2 h-24 w-24 overflow-hidden rounded-full bg-zinc-800">
                      {profileUrl ? (
                        <Image
                          src={profileUrl}
                          alt={member.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-zinc-600">
                          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium text-zinc-200 line-clamp-1">
                      {member.name}
                    </p>
                    <p className="text-[11px] text-zinc-500 line-clamp-1">
                      {member.character}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {similarItems.length > 0 && (
          <section className="mt-10 pb-10">
            <MediaGrid title="Similar Movies" items={similarItems} />
          </section>
        )}
      </div>
    </div>
  );
}
