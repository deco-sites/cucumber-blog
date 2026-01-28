import { useState } from "preact/hooks";
import { invoke } from "../runtime.ts";
import type { UrlContent } from "../loaders/urlContent.ts";

export interface Props {
  initialUrl?: string;
}

export default function UrlFetcher({ initialUrl = "https://deco.cx" }: Props) {
  const [url, setUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [urlData, setUrlData] = useState<UrlContent | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchUrl = async () => {
    if (!inputUrl.trim()) {
      alert("Please enter a valid URL");
      return;
    }

    setLoading(true);
    try {
      const data = await invoke.site.loaders.urlContent({
        url: inputUrl,
        takeScreenshot: false,
      });
      setUrlData(data);
      setUrl(inputUrl);
      setHasLoaded(true);
    } catch (error) {
      setUrlData({
        url: inputUrl,
        content: "",
        error: `Failed to fetch: ${error.message}`,
      });
      setHasLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    fetchUrl();
  };

  return (
    <div class="container mx-auto p-8">
      <h1 class="text-3xl font-bold mb-6">URL Content Viewer</h1>

      {/* Input Form */}
      <form onSubmit={handleSubmit} class="mb-8">
        <div class="flex gap-2">
          <input
            type="url"
            value={inputUrl}
            onInput={(e) => setInputUrl((e.target as HTMLInputElement).value)}
            placeholder="Enter URL (e.g., https://example.com)"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Loading..." : "Fetch"}
          </button>
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Fetching content...</p>
        </div>
      )}

      {/* Results */}
      {!loading && hasLoaded && urlData && (
        <div>
          {urlData.error ? (
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p class="font-bold">Error loading URL:</p>
              <p>{urlData.error}</p>
            </div>
          ) : (
            <>
              <div class="mb-6">
                <h2 class="text-xl font-semibold mb-2">URL:</h2>
                <a
                  href={urlData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:underline break-all"
                >
                  {urlData.url}
                </a>
              </div>

              <div class="mb-6">
                <h2 class="text-xl font-semibold mb-2">Raw Content:</h2>
                <div class="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                  <pre class="text-xs whitespace-pre-wrap break-words font-mono">
                    {urlData.content}
                  </pre>
                </div>
              </div>

              <div class="text-sm text-gray-500">
                Content length: {urlData.content.length} characters
              </div>
            </>
          )}
        </div>
      )}

      {/* Initial State */}
      {!loading && !hasLoaded && (
        <div class="text-center py-8 text-gray-500">
          <p>Enter a URL above and click "Fetch" to view its raw content</p>
        </div>
      )}
    </div>
  );
}