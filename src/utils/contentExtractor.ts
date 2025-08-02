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

  // Extract headings
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  for (const heading of headings) {
    const text = heading.textContent?.trim() || '';
    if (text) {
      content.push({
        type: 'heading',
        tag: heading.tagName.toLowerCase(),
        text
      });
      stats.headings++;
    }
  }

  // Extract links
  const links = document.querySelectorAll('a[href]');
  for (const link of links) {
    const href = (link as HTMLAnchorElement).href;
    const text = link.textContent?.trim() || '';
    if (href && text) {
      content.push({
        type: 'link',
        tag: 'a',
        text,
        href
      });
      stats.links++;
    }
  }

  // Extract images
  const images = document.querySelectorAll('img[src]');
  for (const img of images) {
    const src = (img as HTMLImageElement).src;
    const alt = (img as HTMLImageElement).alt || '';
    if (src) {
      content.push({
        type: 'image',
        tag: 'img',
        src,
        alt
      });
      stats.images++;
    }
  }

  // Extract paragraphs
  const paragraphs = document.querySelectorAll('p');
  for (const p of paragraphs) {
    const text = p.textContent?.trim() || '';
    if (text.length > 20) { // Only include substantial paragraphs
      content.push({
        type: 'paragraph',
        tag: 'p',
        text: text.substring(0, 200) + (text.length > 200 ? '...' : '')
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
