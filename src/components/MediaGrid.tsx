import type { MediaItem } from "@/lib/types";
import MediaCard from "./MediaCard";

export default function MediaGrid({
  items,
  title,
}: {
  items: MediaItem[];
  title?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section>
      {title && (
        <h2 className="mb-4 text-xl font-bold text-zinc-100">{title}</h2>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => (
          <MediaCard key={`${item.media_type}-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  );
}
