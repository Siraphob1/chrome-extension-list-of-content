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
  const allElements = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id],  p[id]');

  for (const element of allElements) {
    const tagName = element.tagName.toLowerCase();
    const id = (element as HTMLElement).id;

    if (tagName.match(/^h[1-6]$/)) {
      // Handle headings
      const text = element.textContent?.trim() || '';
      if (text && id) {
        content.push({
          type: 'heading',
          tag: tagName,
          text,
          id
        });
        stats.headings++;
      }
    } else if (tagName === 'p') {
      // Handle paragraphs
      const text = element.textContent?.trim() || '';
      if (text.length > 20 && id) { // Only include substantial paragraphs with id
        content.push({
          type: 'paragraph',
          tag: 'p',
          text: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
          id
        });
        stats.paragraphs++;
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
