export default function SetupGuide() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-lg rounded-2xl bg-zinc-900 p-8 ring-1 ring-zinc-800 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600/20">
          <svg
            className="h-8 w-8 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-white">
          Add Your TMDB API Key
        </h2>
        <p className="mb-6 text-sm text-zinc-400">
          StreamGuide uses The Movie Database (TMDB) to fetch show and movie
          data. Get a free API key in 30 seconds:
        </p>

        <ol className="mb-6 space-y-3 text-left text-sm text-zinc-300">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600/20 text-xs font-bold text-indigo-400">
              1
            </span>
            <span>
              Sign up at{" "}
              <a
                href="https://www.themoviedb.org/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                themoviedb.org/signup
              </a>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600/20 text-xs font-bold text-indigo-400">
              2
            </span>
            <span>
              Go to{" "}
              <a
                href="https://www.themoviedb.org/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                Settings &rarr; API
              </a>{" "}
              and request an API key
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600/20 text-xs font-bold text-indigo-400">
              3
            </span>
            <span>
              Create a <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-indigo-300">.env.local</code> file in the project root:
            </span>
          </li>
        </ol>

        <div className="rounded-lg bg-zinc-950 p-4 text-left">
          <code className="text-sm text-indigo-300">
            TMDB_API_KEY=your_api_key_here
          </code>
        </div>

        <p className="mt-4 text-xs text-zinc-500">
          Then restart the dev server with <code className="rounded bg-zinc-800 px-1 py-0.5 text-indigo-300">npm run dev</code>
        </p>
      </div>
    </div>
  );
}
