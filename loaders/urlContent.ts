export interface Props {
  url: string;
  takeScreenshot?: boolean;
}

export interface UrlContent {
  url: string;
  content: string;
  screenshot?: string;
  error?: string;
}

export default async function loader(
  props: Props,
  req: Request,
): Promise<UrlContent> {
  const { url, takeScreenshot = false } = props;

  try {
    // Fetch the URL content
    const response = await fetch(url);
    const content = await response.text();

    return {
      url,
      content,
      screenshot: takeScreenshot ? `Screenshot would be at: /live/invoke/site/loaders/urlContent.ts` : undefined,
    };
  } catch (error) {
    return {
      url,
      content: "",
      error: error instanceof Error ? error.message : "Failed to fetch URL",
    };
  }
}