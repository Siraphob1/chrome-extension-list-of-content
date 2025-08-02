import { useEffect, useState } from 'react';
import "./SidePanel.css";

interface ContentItem {
  type: string;
  tag: string;
  text?: string;
  href?: string;
  src?: string;
  alt?: string;
}

export default function SidePanel() {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log("Website Content Lister side panel loaded!");
    getCurrentTab();
  }, []);

  const getCurrentTab = async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.url) {
          setCurrentUrl(tab.url);
        }
      }
    } catch (error) {
      console.error('Error getting current tab:', error);
    }
  };

  const analyzeWebsiteContent = async () => {
    setLoading(true);
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.scripting) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab.id) {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: extractContentFromPage,
          });

          if (results[0]?.result) {
            setContentList(results[0].result);
          }
        }
      }
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractContentFromPage = (): ContentItem[] => {
    const content: ContentItem[] = [];

    // Extract headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (const heading of headings) {
      content.push({
        type: 'heading',
        tag: heading.tagName.toLowerCase(),
        text: heading.textContent?.trim() || ''
      });
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
      }
    }

    return content;
  };

  const renderContentItem = (item: ContentItem, index: number) => {
    switch (item.type) {
      case 'heading':
        return (
          <div key={index} className="content-item heading-item">
            <span className="tag-label">{item.tag.toUpperCase()}</span>
            <span className="content-text">{item.text}</span>
          </div>
        );
      case 'link':
        return (
          <div key={index} className="content-item link-item">
            <span className="tag-label">LINK</span>
            <div className="link-content">
              <div className="link-text">{item.text}</div>
              <div className="link-url">{item.href}</div>
            </div>
          </div>
        );
      case 'image':
        return (
          <div key={index} className="content-item image-item">
            <span className="tag-label">IMG</span>
            <div className="image-content">
              <div className="image-alt">{item.alt || 'No alt text'}</div>
              <div className="image-src">{item.src}</div>
            </div>
          </div>
        );
      case 'paragraph':
        return (
          <div key={index} className="content-item paragraph-item">
            <span className="tag-label">P</span>
            <span className="content-text">{item.text}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="sidepanel-container">
      <div className="header">
        <h1>Website Content Lister</h1>
        <div className="current-url">
          <strong>Current URL:</strong>
          <span className="url-text">{currentUrl || 'No active tab'}</span>
        </div>
      </div>

      <div className="controls">
        <button
          type="button"
          onClick={analyzeWebsiteContent}
          disabled={loading || !currentUrl}
          className="analyze-button"
        >
          {loading ? 'Analyzing...' : 'Analyze Website Content'}
        </button>
      </div>

      <div className="content-list">
        {contentList.length > 0 ? (
          <div className="content-results">
            <h3>Found {contentList.length} content items:</h3>
            <div className="content-items">
              {contentList.map(renderContentItem)}
            </div>
          </div>
        ) : (
          <div className="no-content">
            {loading ? 'Analyzing page content...' : 'Click "Analyze Website Content" to scan the current page'}
          </div>
        )}
      </div>
    </div>
  );
}
