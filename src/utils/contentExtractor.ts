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

  // Extract headings with id
  const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
  for (const heading of headings) {
    const text = heading.textContent?.trim() || '';
    const id = (heading as HTMLElement).id;
    if (text && id) {
      content.push({
        type: 'heading',
        tag: heading.tagName.toLowerCase(),
        text,
        id
      });
      stats.headings++;
    }
  }
  // Extract images with id
  const images = document.querySelectorAll('img[src][id]');
  for (const img of images) {
    const src = (img as HTMLImageElement).src;
    const alt = (img as HTMLImageElement).alt || '';
    const id = (img as HTMLElement).id;
    if (src && id) {
      content.push({
        type: 'image',
        tag: 'img',
        src,
        alt,
        id
      });
      stats.images++;
    }
  }

  // Extract paragraphs with id
  const paragraphs = document.querySelectorAll('p[id]');
  for (const p of paragraphs) {
    const text = p.textContent?.trim() || '';
    const id = (p as HTMLElement).id;
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

  stats.total = content.length;

  return {
    content,
    stats,
    url: window.location.href,
    timestamp: Date.now()
  };
};
