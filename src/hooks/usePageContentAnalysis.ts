import { isUrlChange } from '@/utils/url';
import type { ContentExtractionResult } from '@customTypes/content';
import { extractContentFromPage } from '@utils/contentExtractor';
import { useCallback, useEffect, useState } from 'react';

interface TabChangeInfo {
  url?: string;
  status?: string;
}


export function usePageContentAnalysis() {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [extractionResult, setExtractionResult] = useState<ContentExtractionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const syncActiveTabUrl = useCallback(async () => {
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

  const analyzeWebsiteContent = useCallback(async (manual?: boolean) => {
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
      if (manual) {
        setTimeout(() => setLoading(false), 500);
      }
      else {
        setLoading(false);
      }
    }
  }, []);

  const handleTabUpdated = useCallback((tabId: number, changeInfo: TabChangeInfo, tab: chrome.tabs.Tab) => {
    if (changeInfo.url && tab.active) {
      if (isUrlChange(currentUrl, changeInfo.url)) {
        setCurrentUrl(changeInfo.url);
        setExtractionResult(null);
        setTimeout(() => analyzeWebsiteContent(), 500);
      }
    }
  }, [analyzeWebsiteContent, currentUrl]);

  const handleTabActivated = useCallback(async () => {
    await syncActiveTabUrl();
    setExtractionResult(null);
    setTimeout(() => analyzeWebsiteContent(), 500);
  }, [syncActiveTabUrl, analyzeWebsiteContent]);

  const reset = useCallback(() => setExtractionResult(null), []);

  useEffect(() => {
    syncActiveTabUrl();
    analyzeWebsiteContent();

    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.onUpdated.addListener(handleTabUpdated);
      chrome.tabs.onActivated.addListener(handleTabActivated);
    }

    return () => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.onUpdated.removeListener(handleTabUpdated);
        chrome.tabs.onActivated.removeListener(handleTabActivated);
      }
    };
  }, [syncActiveTabUrl, handleTabUpdated, handleTabActivated, analyzeWebsiteContent]);


  return { currentUrl, extractionResult, loading, reset, analyzeWebsiteContent } as const;
}

export default usePageContentAnalysis;
