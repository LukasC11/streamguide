"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";

export default function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (value.trim()) {
          router.push(`/search?q=${encodeURIComponent(value.trim())}`);
        }
      }, 400);
    },
    [router]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && query.trim()) {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
          }
        }}
        placeholder="Search movies and TV shows..."
        className="w-full rounded-full bg-zinc-800/80 px-5 py-2.5 pl-11 text-sm text-zinc-100 placeholder-zinc-500 outline-none ring-1 ring-zinc-700 transition-all focus:bg-zinc-800 focus:ring-indigo-500"
      />
      <svg
        className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
