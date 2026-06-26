import Image from "next/image";
import Link from "next/link";
import {
  discoverMoviesDateRange,
  discoverTVDateRange,
  getImageUrl,
  isConfigured,
} from "@/lib/tmdb";
import type { MediaItem } from "@/lib/types";
import SetupGuide from "@/components/SetupGuide";

const SERVICES = [
  { id: "8", name: "Netflix" },
  { id: "9", name: "Amazon Prime" },
  { id: "337", name: "Disney+" },
  { id: "1899", name: "Max" },
  { id: "15", name: "Hulu" },
  { id: "350", name: "Apple TV+" },
  { id: "386", name: "Peacock" },
  { id: "531", name: "Paramount+" },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getDateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

async function fetchUpcoming(services: string | undefined) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 30);

  const todayStr = getDateStr(today);
  const futureStr = getDateStr(futureDate);

  const providerStr = services || undefined;

  const [movies, tvShows] = await Promise.all([
    discoverMoviesDateRange({
      primary_release_date_gte: todayStr,
      primary_release_date_lte: futureStr,
      with_watch_providers: providerStr,
      sort_by: "primary_release_date.asc",
    }),
    discoverTVDateRange({
      first_air_date_gte: todayStr,
      first_air_date_lte: futureStr,
      with_watch_providers: providerStr,
      sort_by: "first_air_date.asc",
    }),
  ]);

  const movieItems: MediaItem[] = movies.results.map((m) => ({
    ...m,
    media_type: "movie" as const,
  }));

  const tvItems: MediaItem[] = tvShows.results.map((t) => ({
    ...t,
    media_type: "tv" as const,
  }));

  const all = [...movieItems, ...tvItems].sort((a, b) => {
    const dateA = a.release_date ?? a.first_air_date ?? "";
    const dateB = b.release_date ?? b.first_air_date ?? "";
    return dateA.localeCompare(dateB);
  });

  return all;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  if (!isConfigured()) return <SetupGuide />;

  const resolvedSearchParams = await searchParams;
  const activeServices = resolvedSearchParams.services?.split(",") ?? [];
  const providerParam = activeServices.length > 0 ? activeServices.join("|") : undefined;

  const items = await fetchUpcoming(providerParam);

  const grouped: Record<string, MediaItem[]> = {};
  for (const item of items) {
    const date = item.release_date ?? item.first_air_date ?? "Unknown";
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(item);
  }

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Content Calendar</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Upcoming releases in the next 30 days
        </p>
      </div>

      <div className="mb-8">
        <p className="mb-3 text-sm font-medium text-zinc-300">Filter by service</p>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((service) => {
            const isActive = activeServices.includes(service.id);
            const newServices = isActive
              ? activeServices.filter((s) => s !== service.id)
              : [...activeServices, service.id];
            const href = newServices.length > 0
              ? `/calendar?services=${newServices.join(",")}`
              : "/calendar";
            return (
              <Link
                key={service.id}
                href={href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {service.name}
              </Link>
            );
          })}
        </div>
      </div>

      {sortedDates.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg text-zinc-400">No upcoming releases found.</p>
          <p className="mt-2 text-sm text-zinc-500">
            Try changing your service filters to see more results.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((date) => (
            <div key={date}>
              <h2 className="mb-4 flex items-center gap-3 text-lg font-bold text-zinc-100">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-sm font-bold text-indigo-400">
                  {formatDate(date).split(" ")[1]}
                </span>
                {formatDate(date)}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {grouped[date].map((item) => {
                  const posterUrl = getImageUrl(item.poster_path, "w185");
                  const title = item.title ?? item.name ?? "Untitled";
                  const type = item.media_type === "tv" ? "tv" : "movie";
                  return (
                    <Link
                      key={`${type}-${item.id}`}
                      href={`/${type}/${item.id}`}
                      className="flex gap-3 rounded-xl bg-zinc-900 p-3 ring-1 ring-zinc-800 transition-all hover:ring-indigo-500/50"
                    >
                      {posterUrl ? (
                        <Image
                          src={posterUrl}
                          alt={title}
                          width={60}
                          height={90}
                          className="shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-[90px] w-[60px] shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-600">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-zinc-100 line-clamp-2">{title}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                          <span className="rounded bg-indigo-600/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-indigo-400">
                            {type === "tv" ? "TV" : "Film"}
                          </span>
                          {item.vote_average > 0 && (
                            <span className="flex items-center gap-0.5">
                              <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {item.vote_average.toFixed(1)}
                            </span>
                          )}
                        </div>
                        {item.overview && (
                          <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{item.overview}</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
