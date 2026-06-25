import Image from "next/image";
import type { WatchProvider } from "@/lib/types";
import { getImageUrl } from "@/lib/tmdb";

export default function ServiceBadge({ provider }: { provider: WatchProvider }) {
  const logoUrl = getImageUrl(provider.logo_path, "w92");

  return (
    <div className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-3 py-2 ring-1 ring-zinc-700/50">
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
    </div>
  );
}
