import Image from "next/image";
import Link from "next/link";
import type { MediaItem } from "@/lib/types";
import { getDisplayTitle, getDisplayDate, getYear, getImageUrl } from "@/lib/tmdb";

export default function MediaCard({ item }: { item: MediaItem }) {
  const title = getDisplayTitle(item);
  const year = getYear(getDisplayDate(item));
  const posterUrl = getImageUrl(item.poster_path, "w342");
  const type = item.media_type === "tv" ? "tv" : "movie";
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;

  return (
    <Link
      href={`/${type}/${item.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-zinc-800 transition-all hover:ring-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-800">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {rating && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-zinc-900/80 px-1.5 py-0.5 text-xs font-semibold backdrop-blur-sm">
            <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-zinc-100">{rating}</span>
          </div>
        )}

        <div className="absolute right-2 top-2">
          <span className="rounded-md bg-indigo-600/90 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {type === "tv" ? "TV" : "Film"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        {year && <p className="text-xs text-zinc-500">{year}</p>}
      </div>
    </Link>
  );
}
