// ClipShare background service worker
let nativePort = null;

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('ClipShare extension installed!');
});

// Handle messages from popup or native host
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getClipboard') {
    // Forward clipboard request to popup
    chrome.runtime.sendMessage(request).then(sendResponse);
    return true;
  }
});

// Keep service worker alive
chrome.runtime.onConnect.addListener((port) => {
  console.log('Port connected:', port.name);
});
