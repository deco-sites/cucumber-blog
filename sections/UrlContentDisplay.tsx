import type { UrlContent } from "../loaders/urlContent.ts";

export interface Props {
  urlData?: UrlContent | null;
  title?: string;
}

export const loader = async (props: Props, req: Request) => {
  // Get URL from query parameter
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get("url");
  
  if (!targetUrl) {
    return {
      ...props,
      urlData: null,
    };
  }

  // Fetch the content
  try {
    const response = await fetch(targetUrl);
    const content = await response.text();
    
    return {
      ...props,
      urlData: {
        url: targetUrl,
        content,
        screenshot: null,
        error: null,
      },
    };
  } catch (error) {
    return {
      ...props,
      urlData: {
        url: targetUrl,
        content: "",
        screenshot: null,
        error: error instanceof Error ? error.message : "Failed to fetch URL",
      },
    };
  }
};

export default function UrlContentDisplay({ 
  urlData, 
  title = "URL Content Viewer" 
}: Props) {
  if (!urlData) {
    return (
      <div class="container mx-auto p-8">
        <h1 class="text-3xl font-bold mb-4">{title}</h1>
        <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          <p class="font-bold">How to use:</p>
          <p>Add <code class="bg-blue-200 px-2 py-1 rounded">?url=YOUR_URL</code> to the page URL</p>
          <p class="mt-2">Example: <code class="bg-blue-200 px-2 py-1 rounded text-xs">?url=https://deco.cx</code></p>
        </div>
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
        <div class="mt-4">
          <a href="/url-viewer" class="text-blue-600 hover:underline">← Go back</a>
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