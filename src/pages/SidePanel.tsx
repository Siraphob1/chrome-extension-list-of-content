import { useEffect, useState } from 'react';
import "../index.css";

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
          <div key={index} className="flex gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border-l-3 border-green-500 text-xs leading-normal">
            <span className="flex-shrink-0 px-1.5 py-0.5 bg-green-500 text-white rounded text-xs font-bold uppercase h-fit">
              {item.tag.toUpperCase()}
            </span>
            <span className="text-gray-700 dark:text-gray-200 break-words">{item.text}</span>
          </div>
        );
      case 'link':
        return (
          <div key={index} className="flex gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border-l-3 border-cyan-500 text-xs leading-normal">
            <span className="flex-shrink-0 px-1.5 py-0.5 bg-cyan-500 text-white rounded text-xs font-bold uppercase h-fit">
              LINK
            </span>
            <div className="flex flex-col gap-1 flex-1">
              <div className="text-gray-700 dark:text-gray-200 font-medium">{item.text}</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs break-all font-mono">{item.href}</div>
            </div>
          </div>
        );
      case 'image':
        return (
          <div key={index} className="flex gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border-l-3 border-yellow-400 text-xs leading-normal">
            <span className="flex-shrink-0 px-1.5 py-0.5 bg-yellow-600 text-white rounded text-xs font-bold uppercase h-fit">
              IMG
            </span>
            <div className="flex flex-col gap-1 flex-1">
              <div className="text-gray-700 dark:text-gray-200 font-medium">{item.alt || 'No alt text'}</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs break-all font-mono">{item.src}</div>
            </div>
          </div>
        );
      case 'paragraph':
        return (
          <div key={index} className="flex gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border-l-3 border-gray-500 text-xs leading-normal">
            <span className="flex-shrink-0 px-1.5 py-0.5 bg-gray-500 text-white rounded text-xs font-bold uppercase h-fit">
              P
            </span>
            <span className="text-gray-700 dark:text-gray-200 break-words">{item.text}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen p-4 box-border font-system bg-white dark:bg-gray-800 overflow-y-auto text-gray-800 dark:text-gray-200">
      <div className="mb-5 border-b border-gray-200 dark:border-gray-600 pb-4">
        <h1 className="m-0 mb-3 text-lg font-semibold text-gray-900 dark:text-white">Website Content Lister</h1>
        <div className="text-xs text-gray-600 dark:text-gray-300 leading-normal">
          <strong className="block mb-1 text-gray-700 dark:text-white">Current URL:</strong>
          <span className="break-all bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono text-gray-800 dark:text-gray-200">
            {currentUrl || 'No active tab'}
          </span>
        </div>
      </div>

      <div className="mb-5">
        <button
          type="button"
          onClick={analyzeWebsiteContent}
          disabled={loading || !currentUrl}
          className="w-full px-4 py-3 bg-blue-600 text-white border-none rounded-md text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Analyze Website Content'}
        </button>
      </div>

      <div className="flex-1">
        {contentList.length > 0 ? (
          <div>
            <h3 className="m-0 mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Found {contentList.length} content items:
            </h3>
            <div className="flex flex-col gap-2">
              {contentList.map(renderContentItem)}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 px-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {loading ? 'Analyzing page content...' : 'Click "Analyze Website Content" to scan the current page'}
          </div>
        )}
      </div>
    </div>
  );
}
