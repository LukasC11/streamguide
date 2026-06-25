"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const searchParams = useSearchParams();
  const maxPage = Math.min(totalPages, 500);

  function getPageUrl(page: number): string {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  }

  if (maxPage <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-200 transition-colors hover:bg-zinc-700"
        >
          Previous
        </Link>
      )}
      <span className="px-4 py-2 text-sm text-zinc-400">
        Page {currentPage} of {maxPage}
      </span>
      {currentPage < maxPage && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-200 transition-colors hover:bg-zinc-700"
        >
          Next
        </Link>
      )}
    </div>
  );
}
