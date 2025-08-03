import "@/index.css";
import type { ContentExtractionResult, ContentItem } from "@customTypes/content";
import { extractContentFromPage } from '@utils/contentExtractor';
import { useCallback, useEffect, useState } from 'react';

// Chrome API type definitions
interface TabChangeInfo {
  url?: string;
  status?: string;
}

interface TabActiveInfo {
  tabId: number;
  windowId: number;
}

export default function SidePanel() {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [extractionResult, setExtractionResult] = useState<ContentExtractionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  const getCurrentTab = useCallback(async () => {
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
  }, []);

  const analyzeWebsiteContent = useCallback(async () => {
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
            setExtractionResult(results[0].result);
          }
        }
      }
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const scrollToElement = async (elementId: string) => {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.scripting) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab.id) {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (id: string) => {
              const element = document.getElementById(id);
              if (element) {
                element.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });
              }
            },
            args: [elementId]
          });
        }
      }
    } catch (error) {
      console.error('Error scrolling to element:', error);
    }
  };

  const getHeadingLevel = (tag: string): number => {
    const match = tag.match(/^h([1-6])$/);
    return match ? Number.parseInt(match[1]) : 1;
  };

  const getIndentationStyle = (level: number) => {
    const baseIndent = (level - 1) * 20; // 20px per level
    return { marginLeft: `${baseIndent}px` };
  };

  const renderContentItem = (item: ContentItem, index: number) => {
    switch (item.type) {
      case 'heading': {
        const headingLevel = getHeadingLevel(item.tag || 'h1');
        const indentStyle = getIndentationStyle(headingLevel);

        return (
          <div key={index} style={indentStyle}>
            <button
              type="button"
              className="flex gap-2   dark:bg-gray-700 rounded-md  text-xs leading-normal cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors w-full max-w-max"
              onClick={() => item.id && scrollToElement(item.id)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && item.id) {
                  e.preventDefault();
                  scrollToElement(item.id);
                }
              }}
              tabIndex={0}
              title={item.id ? `Click to focus on element with ID: ${item.id}` : 'No ID available'}
            >
              <span className="text-gray-700 dark:text-gray-200 break-words">
                {item.text}
              </span>
            </button>
          </div>
        );
      }
      case 'paragraph':
        return (
          <button
            type="button"
            key={index}
            className="flex gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border-l-3 border-gray-500 text-xs leading-normal cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            onClick={() => item.id && scrollToElement(item.id)}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && item.id) {
                e.preventDefault();
                scrollToElement(item.id);
              }
            }}
            tabIndex={0}
            title={item.id ? `Click to focus on element with ID: ${item.id}` : 'No ID available'}
          >
            <span className="flex-shrink-0 px-1.5 py-0.5 bg-gray-500 text-white rounded text-xs font-bold uppercase h-fit">
              P
            </span>
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-gray-700 dark:text-gray-200 break-words">{item.text}</span>
              {item.id && (
                <div className="text-gray-500 dark:text-gray-400 text-xs font-mono">
                  ID: {item.id}
                </div>
              )}
            </div>
          </button>
        );
      default:
        return null;
    }
  };


  useEffect(() => {
    console.log("Website Content Lister side panel loaded!");
    getCurrentTab();

    // Listen for tab URL changes
    const handleTabUpdated = (tabId: number, changeInfo: TabChangeInfo, tab: chrome.tabs.Tab) => {
      if (changeInfo.url && tab.active) {
        setCurrentUrl(changeInfo.url);
        // Clear previous results when URL changes
        setExtractionResult(null);
      }
    };

    // Listen for tab switches
    const handleTabActivated = async (activeInfo: TabActiveInfo) => {
      try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        if (tab.url) {
          setCurrentUrl(tab.url);
          // Clear previous results when switching tabs
          setExtractionResult(null);
        }
      } catch (error) {
        console.error("Error getting activated tab:", error);
      }
    };

    // Add event listeners
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.onUpdated.addListener(handleTabUpdated);
      chrome.tabs.onActivated.addListener(handleTabActivated);
    }

    // Cleanup listeners on unmount
    return () => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.onUpdated.removeListener(handleTabUpdated);
        chrome.tabs.onActivated.removeListener(handleTabActivated);
      }
    };
  }, [getCurrentTab]);

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
        {extractionResult && extractionResult.content.length > 0 ? (
          <div>
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
              <h3 className="m-0 mb-2 text-sm font-semibold text-blue-800 dark:text-blue-200">
                Analysis Results
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-blue-700 dark:text-blue-300">
                <div>Total items: <span className="font-semibold">{extractionResult.stats.total}</span></div>
                <div>Headings: <span className="font-semibold">{extractionResult.stats.headings}</span></div>
                <div>Links: <span className="font-semibold">{extractionResult.stats.links}</span></div>
                <div>Images: <span className="font-semibold">{extractionResult.stats.images}</span></div>
                <div className="col-span-2">Paragraphs: <span className="font-semibold">{extractionResult.stats.paragraphs}</span></div>
              </div>
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                Analyzed at: {new Date(extractionResult.timestamp).toLocaleTimeString()}
              </div>
            </div>
            <h3 className="m-0 mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Content Items:
            </h3>
            <div className="flex flex-col gap-2">
              {extractionResult.content.map(renderContentItem)}
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
