import type { UrlContent } from "../loaders/urlContent.ts";

export interface Props {
  urlData?: UrlContent | null;
  title?: string;
}

export default function UrlContentDisplay({ 
  urlData, 
  title = "URL Content Viewer" 
}: Props) {
  if (!urlData) {
    return (
      <div class="container mx-auto p-8">
        <h1 class="text-3xl font-bold mb-4">{title}</h1>
        <p class="text-gray-600">No URL data loaded. Please configure a URL in the loader.</p>
      </div>
    );
  }

  if (urlData.error) {
    return (
      <div class="container mx-auto p-8">
        <h1 class="text-3xl font-bold mb-4">{title}</h1>
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p class="font-bold">Error loading URL:</p>
          <p>{urlData.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div class="container mx-auto p-8">
      <h1 class="text-3xl font-bold mb-4">{title}</h1>
      
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

      {urlData.screenshot && (
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-2">Screenshot:</h2>
          <p class="text-gray-600">{urlData.screenshot}</p>
        </div>
      )}

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
    </div>
  );
}