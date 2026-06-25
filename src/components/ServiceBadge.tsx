import Image from "next/image";
import type { WatchProvider } from "@/lib/types";
import { getImageUrl } from "@/lib/tmdb";

interface ServiceBadgeProps {
  provider: WatchProvider;
  link?: string;
}

export default function ServiceBadge({ provider, link }: ServiceBadgeProps) {
  const logoUrl = getImageUrl(provider.logo_path, "w92");

  const content = (
    <>
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={provider.provider_name}
          width={28}
          height={28}
          className="rounded-md"
        />
      ) : (
        <div className="h-7 w-7 rounded-md bg-zinc-700" />
      )}
      <span className="text-sm text-zinc-300">{provider.provider_name}</span>
      {link && (
        <svg
          className="h-3.5 w-3.5 text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-3 py-2 ring-1 ring-zinc-700/50 hover:bg-zinc-700/50 hover:ring-zinc-600/50 transition-colors"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-3 py-2 ring-1 ring-zinc-700/50">
      {content}
    </div>
  );
}
