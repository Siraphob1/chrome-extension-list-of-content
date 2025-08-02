export interface ContentItem {
  type: string;
  tag: string;
  text?: string;
  href?: string;
  src?: string;
  alt?: string;
  id?: string;
}

export interface ContentStats {
  headings: number;
  links: number;
  images: number;
  paragraphs: number;
  total: number;
}

export interface ContentExtractionResult {
  content: ContentItem[];
  stats: ContentStats;
  url: string;
  timestamp: number;
}
