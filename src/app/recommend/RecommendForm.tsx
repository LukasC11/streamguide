"use client";

import { useState, useTransition } from "react";
import { getRecommendations } from "./actions";
import type { RecommendationRequest } from "./actions";
import type { Genre, MediaItem } from "@/lib/types";
import MediaCard from "@/components/MediaCard";

const MOODS = [
  { value: "happy", label: "Feel-Good", icon: "😊", desc: "Comedy, music, family" },
  { value: "thrilling", label: "On the Edge", icon: "🔥", desc: "Action, thriller, crime" },
  { value: "thoughtful", label: "Thought-Provoking", icon: "🧠", desc: "Drama, history, documentary" },
  { value: "scary", label: "Spine-Tingling", icon: "👻", desc: "Horror, mystery" },
  { value: "adventurous", label: "Epic Adventure", icon: "🗺️", desc: "Adventure, fantasy, sci-fi" },
  { value: "romantic", label: "Love Story", icon: "💕", desc: "Romance, rom-com" },
];

const RUNTIME_OPTIONS = [
  { value: "", label: "Any Length" },
  { value: "short", label: "Quick Watch (< 90 min)" },
  { value: "medium", label: "Standard (90-150 min)" },
  { value: "long", label: "Epic (150+ min)" },
];

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

interface RecommendFormProps {
  movieGenres: Genre[];
  tvGenres: Genre[];
}

export default function RecommendForm({ movieGenres, tvGenres }: RecommendFormProps) {
  const [step, setStep] = useState(0);
  const [mediaType, setMediaType] = useState<"movie" | "tv" | "both">("both");
  const [mood, setMood] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [runtimePreference, setRuntimePreference] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [minRating, setMinRating] = useState("7");
  const [results, setResults] = useState<MediaItem[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const genres = mediaType === "tv" ? tvGenres : movieGenres;

  function toggleGenre(id: string) {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function handleSubmit() {
    const request: RecommendationRequest = {
      mediaType,
      genres: selectedGenres,
      mood,
      runtimePreference,
      services: selectedServices,
      minRating,
    };

    startTransition(async () => {
      const recs = await getRecommendations(request);
      setResults(recs);
      setStep(5);
    });
  }

  function reset() {
    setStep(0);
    setMediaType("both");
    setMood("");
    setSelectedGenres([]);
    setRuntimePreference("");
    setSelectedServices([]);
    setMinRating("7");
    setResults(null);
  }

  if (step === 5 && results) {
    return (
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Recommendations</h2>
            <p className="mt-1 text-sm text-zinc-400">
              {results.length} titles matched your preferences
            </p>
          </div>
          <button
            onClick={reset}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            Start Over
          </button>
        </div>
        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {results.map((item) => (
              <MediaCard key={`${item.media_type}-${item.id}`} item={item} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-zinc-400">No matches found for your preferences.</p>
            <p className="mt-2 text-sm text-zinc-500">Try broadening your criteria.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex justify-center gap-2">
        {[0, 1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 w-12 rounded-full transition-colors ${
              s <= step ? "bg-indigo-500" : "bg-zinc-800"
            }`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-6">
          <h2 className="text-center text-2xl font-bold text-white">
            What are you in the mood for?
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {["movie", "tv", "both"].map((type) => (
              <button
                key={type}
                onClick={() => { setMediaType(type as "movie" | "tv" | "both"); setStep(1); }}
                className={`rounded-xl border-2 p-4 text-left transition-all ${
                  mediaType === type
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <p className="text-lg font-semibold text-white">
                  {type === "movie" ? "Movies" : type === "tv" ? "TV Shows" : "Movies & TV"}
                </p>
                <p className="text-sm text-zinc-400">
                  {type === "movie"
                    ? "Feature films only"
                    : type === "tv"
                      ? "Series and miniseries"
                      : "Show me everything"}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-center text-2xl font-bold text-white">
            Pick your mood
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => { setMood(m.value); setStep(2); }}
                className={`rounded-xl border-2 p-4 text-left transition-all ${
                  mood === m.value
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <p className="text-lg">
                  <span className="mr-2">{m.icon}</span>
                  <span className="font-semibold text-white">{m.label}</span>
                </p>
                <p className="mt-1 text-sm text-zinc-400">{m.desc}</p>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(0)} className="text-sm text-zinc-500 hover:text-zinc-300">
            ← Back
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-center text-2xl font-bold text-white">
            Any specific genres?
          </h2>
          <p className="text-center text-sm text-zinc-400">Optional — select as many as you like</p>
          <div className="flex flex-wrap justify-center gap-2">
            {genres.map((g) => (
              <button
                key={g.id}
                onClick={() => toggleGenre(String(g.id))}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedGenres.includes(String(g.id))
                    ? "bg-indigo-500 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(1)} className="text-sm text-zinc-500 hover:text-zinc-300">
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-center text-2xl font-bold text-white">
            How long do you want to watch?
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {RUNTIME_OPTIONS.map((r) => (
              <button
                key={r.value}
                onClick={() => { setRuntimePreference(r.value); setStep(4); }}
                className={`rounded-xl border-2 p-4 text-left transition-all ${
                  runtimePreference === r.value
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <p className="font-semibold text-white">{r.label}</p>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} className="text-sm text-zinc-500 hover:text-zinc-300">
            ← Back
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-center text-2xl font-bold text-white">
            Which services do you have?
          </h2>
          <p className="text-center text-sm text-zinc-400">
            Select your subscriptions to see what&apos;s available to you
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleService(s.id)}
                className={`rounded-xl border-2 p-3 text-center text-sm font-medium transition-all ${
                  selectedServices.includes(s.id)
                    ? "border-indigo-500 bg-indigo-500/10 text-white"
                    : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">Minimum rating</label>
            <input
              type="range"
              min="5"
              max="9"
              step="0.5"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full accent-indigo-500"
            />
            <p className="mt-1 text-center text-sm text-zinc-300">{minRating}+ stars</p>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setStep(3)} className="text-sm text-zinc-500 hover:text-zinc-300">
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="rounded-lg bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
            >
              {isPending ? "Finding matches..." : "Find My Next Watch"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
