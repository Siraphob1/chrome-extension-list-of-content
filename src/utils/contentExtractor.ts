import type { ContentExtractionResult, ContentItem, ContentStats } from '@customTypes/content';

export const extractContentFromPage = (): ContentExtractionResult => {
  const content: ContentItem[] = [];
  const stats: ContentStats = {
    headings: 0,
    links: 0,
    images: 0,
    paragraphs: 0,
    total: 0
  };

  // Get all elements in document order
  const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

  for (const element of allElements) {
    const tagName = element.tagName.toLowerCase();
    const id = (element as HTMLElement).id;

    if (tagName.match(/^h[1-6]$/)) {
      // Handle headings
      const text = element.textContent?.trim() || '';
      if (text) {
        content.push({
          type: 'heading',
          tag: tagName,
          text,
          id: id || undefined // Use undefined if no id exists
        });
        stats.headings++;
      }
    }
  }

  stats.total = content.length;

  return {
    content,
    stats,
    url: window.location.href,
    timestamp: Date.now()
  };
};
