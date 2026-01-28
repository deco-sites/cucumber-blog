import UrlFetcher from "../islands/UrlFetcher.tsx";

export interface Props {
  /**
   * @title Initial URL
   * @description The default URL to show in the input field
   */
  initialUrl?: string;
}

export default function InteractiveUrlViewer({ 
  initialUrl = "https://deco.cx" 
}: Props) {
  return <UrlFetcher initialUrl={initialUrl} />;
}