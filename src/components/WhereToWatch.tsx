import Image from "next/image";
import type { WatchProviderResult } from "@/lib/types";
import { getImageUrl } from "@/lib/tmdb";

interface WhereToWatchProps {
  providers: WatchProviderResult;
}

export default function WhereToWatch({ providers }: WhereToWatchProps) {
  const allProviders = new Map<
    number,
    { name: string; logo: string; methods: string[]; link: string }
  >();

  const categories: { key: keyof WatchProviderResult; label: string }[] = [
    { key: "flatrate", label: "Stream" },
    { key: "free", label: "Free" },
    { key: "ads", label: "Free w/ Ads" },
    { key: "rent", label: "Rent" },
    { key: "buy", label: "Buy" },
  ];

  for (const cat of categories) {
    const list = providers[cat.key];
    if (!list || !Array.isArray(list)) continue;
    for (const p of list) {
      const existing = allProviders.get(p.provider_id);
      if (existing) {
        existing.methods.push(cat.label);
      } else {
        allProviders.set(p.provider_id, {
          name: p.provider_name,
          logo: p.logo_path,
          methods: [cat.label],
          link: providers.link,
        });
      }
    }
  }

  if (allProviders.size === 0) return null;

  const sorted = [...allProviders.values()].sort((a, b) => {
    const order = ["Stream", "Free", "Free w/ Ads", "Rent", "Buy"];
    const aMin = Math.min(...a.methods.map((m) => order.indexOf(m)));
    const bMin = Math.min(...b.methods.map((m) => order.indexOf(m)));
    return aMin - bMin;
  });

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold text-zinc-100">Where to Watch</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="pb-3 pr-4 font-medium text-zinc-400">Service</th>
              {categories.map((cat) => (
                <th key={cat.key} className="pb-3 px-3 text-center font-medium text-zinc-400">
                  {cat.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {sorted.map((provider) => {
              const logoUrl = getImageUrl(provider.logo, "w92");
              return (
                <tr key={provider.name} className="hover:bg-zinc-800/30">
                  <td className="py-3 pr-4">
                    <a
                      href={provider.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:text-indigo-400 transition-colors"
                    >
                      {logoUrl && (
                        <Image
                          src={logoUrl}
                          alt={provider.name}
                          width={32}
                          height={32}
                          className="rounded-md"
                        />
                      )}
                      <span className="font-medium text-zinc-200">{provider.name}</span>
                    </a>
                  </td>
                  {categories.map((cat) => (
                    <td key={cat.key} className="px-3 py-3 text-center">
                      {provider.methods.includes(cat.label) ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-900/50 text-emerald-400">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      ) : (
                        <span className="text-zinc-700">&mdash;</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-zinc-600">
        Availability data provided by JustWatch.{" "}
        <a
          href={providers.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-zinc-300"
        >
          View all options →
        </a>
      </p>
    </section>
  );
}
