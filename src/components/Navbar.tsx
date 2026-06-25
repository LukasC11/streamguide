import Link from "next/link";
import { Suspense } from "react";
import SearchBar from "./SearchBar";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-white">StreamGuide</span>
        </Link>

        <Suspense>
          <SearchBar className="max-w-md flex-1" />
        </Suspense>

        <div className="hidden items-center gap-4 text-sm font-medium sm:flex">
          <Link
            href="/discover/movie"
            className="text-zinc-400 transition-colors hover:text-white"
          >
            Movies
          </Link>
          <Link
            href="/discover/tv"
            className="text-zinc-400 transition-colors hover:text-white"
          >
            TV Shows
          </Link>
          <Link
            href="/calendar"
            className="text-zinc-400 transition-colors hover:text-white"
          >
            Calendar
          </Link>
          <Link
            href="/watchlist"
            className="text-zinc-400 transition-colors hover:text-white"
          >
            Watchlist
          </Link>
          <Link
            href="/recommend"
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white transition-colors hover:bg-indigo-500"
          >
            Find My Next Watch
          </Link>
        </div>
      </div>
    </nav>
  );
}
