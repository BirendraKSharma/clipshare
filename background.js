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
    chrome.runtime.sendMessage(request).then((response) => {
      sendResponse(response);
    }).catch((error) => {
      console.error('Error forwarding clipboard request:', error);
      sendResponse({ error: error.message });
    });
    return true; // Keep message channel open for async response
  }
});

// Keep service worker alive
chrome.runtime.onConnect.addListener((port) => {
  console.log('Port connected:', port.name);
  
  // Store the port reference
  if (port.name === 'clipshare-popup') {
    nativePort = port;
    
    port.onDisconnect.addListener(() => {
      console.log('Port disconnected:', port.name);
      nativePort = null;
    });
  }
});
