import browser from "webextension-polyfill";

console.log("Website table of contents background script loaded!");

browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
});

// Handle action button click to open side panel (Chrome)
if (typeof chrome !== 'undefined' && chrome.sidePanel) {
  chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
    if (tab.windowId) {
      chrome.sidePanel.open({ windowId: tab.windowId });
    }
  });
}

// Handle browser action click for Firefox
if (browser.browserAction) {
  browser.browserAction.onClicked.addListener((tab) => {
    // Firefox will automatically open the sidebar when the button is clicked
    // due to the sidebar_action in manifest.json
    console.log("Browser action clicked for tab:", tab.id);
  });
}
