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

  for (let index = 0; index < allElements.length; index++) {
    const element = allElements[index];
    const tagName = element.tagName.toLowerCase();
    let id = (element as HTMLElement).id;

    if (tagName.match(/^h[1-6]$/)) {
      // Handle headings
      const text = element.textContent?.trim() || '';
      if (text) {
        // If no id exists, create a consistent one based on content and position
        if (!id) {
          // Create a more stable ID based on text content and tag
          const textSlug = text.toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .substring(0, 30); // Limit length
          id = `auto-${tagName}-${textSlug}-${index}`;
          (element as HTMLElement).id = id;
        }

        content.push({
          type: 'heading',
          tag: tagName,
          text,
          id
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
