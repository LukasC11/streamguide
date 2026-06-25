import Image from "next/image";
import Link from "next/link";
import type { MediaItem } from "@/lib/types";
import { getDisplayTitle, getDisplayDate, getYear, getImageUrl } from "@/lib/tmdb";

export default function HeroSection({ item }: { item: MediaItem }) {
  const title = getDisplayTitle(item);
  const year = getYear(getDisplayDate(item));
  const backdropUrl = getImageUrl(item.backdrop_path, "w1280");
  const type = item.media_type === "tv" ? "tv" : "movie";
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;

  return (
    <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden sm:h-[60vh]">
      {backdropUrl ? (
        <Image
          src={backdropUrl}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-zinc-900" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
              {type === "tv" ? "TV Series" : "Movie"}
            </span>
            {rating && (
              <span className="flex items-center gap-1 text-sm text-zinc-300">
                <svg
                  className="h-4 w-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rating}
              </span>
            )}
            {year && <span className="text-sm text-zinc-400">{year}</span>}
          </div>

          <h1 className="mb-3 text-3xl font-bold text-white sm:text-5xl">
            {title}
          </h1>

          {item.overview && (
            <p className="mb-5 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base line-clamp-3">
              {item.overview}
            </p>
          )}

          <Link
            href={`/${type}/${item.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            View Details
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
