// ClipShare - Minimal popup controller
let serverRunning = false;
let serverUrl = '';
let port = null;

// UI Elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const qrSection = document.getElementById('qrSection');
const clipboardSection = document.getElementById('clipboardSection');
const clipboardText = document.getElementById('clipboardText');
const qrcode = document.getElementById('qrcode');
const urlDisplay = document.getElementById('urlDisplay');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const errorMessage = document.getElementById('errorMessage');
const copyUrlBtn = document.getElementById('copyUrlBtn');
const openWindowBtn = document.getElementById('openWindowBtn');
const receiveBtn = document.getElementById('receiveBtn');
const sendBtn = document.getElementById('sendBtn');
const hideQrBtn = document.getElementById('hideQrBtn');
const hideClipboardBtn = document.getElementById('hideClipboardBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkServerStatus();
  
  startBtn.addEventListener('click', startServer);
  stopBtn.addEventListener('click', stopServer);
  copyUrlBtn.addEventListener('click', copyUrl);
  openWindowBtn.addEventListener('click', openWindow);
  receiveBtn.addEventListener('click', receiveClipboard);
  sendBtn.addEventListener('click', sendClipboard);
  hideQrBtn.addEventListener('click', hideQrSection);
  hideClipboardBtn.addEventListener('click', hideClipboardSection);
});

// Connect to native host
function connectNativeHost() {
  if (port) {
    port.disconnect();
  }
  
  port = chrome.runtime.connectNative('com.clipshare.host');
  
  port.onMessage.addListener((message) => {
    console.log('Received from native:', message);
    handleNativeMessage(message);
  });
  
  port.onDisconnect.addListener(() => {
    console.log('Native host disconnected');
    if (chrome.runtime.lastError) {
      showError('Native host error: ' + chrome.runtime.lastError.message);
    }
    serverRunning = false;
    updateUI();
  });
  
  return port;
}

// Handle messages from native host
function handleNativeMessage(message) {
  if (message.type === 'server_started') {
    serverRunning = true;
    serverUrl = message.url;
    updateUI();
    generateQR(serverUrl);
  } else if (message.type === 'server_stopped') {
    serverRunning = false;
    updateUI();
  } else if (message.type === 'error') {
    showError(message.message);
    serverRunning = false;
    updateUI();
  } else if (message.type === 'clipboard_update') {
    // Update clipboard when phone sends content
    navigator.clipboard.writeText(message.content).then(() => {
      console.log('Clipboard updated from phone');
    });
  }
}

// Start server
async function startServer() {
  hideError();
  startBtn.disabled = true;
  startBtn.innerHTML = '<div class="spinner"></div><span>Starting...</span>';
  
  try {
    const p = connectNativeHost();
    p.postMessage({ command: 'start' });
  } catch (error) {
    showError('Failed to start server. Make sure the native host is installed.');
    startBtn.disabled = false;
    startBtn.innerHTML = '<span>🚀</span><span>Start Server</span>';
  }
}

// Stop server
function stopServer() {
  if (port) {
    port.postMessage({ command: 'stop' });
  }
  serverRunning = false;
  updateUI();
}

// Check server status
function checkServerStatus() {
  chrome.storage.local.get(['serverRunning', 'serverUrl'], (result) => {
    serverRunning = result.serverRunning || false;
    serverUrl = result.serverUrl || '';
    updateUI();
    if (serverRunning && serverUrl) {
      generateQR(serverUrl);
    }
  });
}

// Update UI based on server status
function updateUI() {
  if (serverRunning) {
    // Server is running
    startBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');
    statusDot.classList.add('online');
    statusText.textContent = 'Online';
    urlDisplay.textContent = serverUrl;
    
    // Restore visibility state from storage
    chrome.storage.local.get(['qrVisible', 'clipboardVisible'], (result) => {
      if (result.qrVisible !== false) {
        qrSection.classList.remove('hidden');
      }
      if (result.clipboardVisible !== false) {
        clipboardSection.classList.remove('hidden');
      }
    });
    
    // Save state
    chrome.storage.local.set({ serverRunning: true, serverUrl: serverUrl });
  } else {
    // Server is stopped
    startBtn.classList.remove('hidden');
    startBtn.disabled = false;
    startBtn.innerHTML = '<span>▶️</span><span>Start</span>';
    stopBtn.classList.add('hidden');
    qrSection.classList.add('hidden');
    clipboardSection.classList.add('hidden');
    statusDot.classList.remove('online');
    statusText.textContent = 'Offline';
    clipboardText.value = '';
    
    // Clear state
    chrome.storage.local.set({ serverRunning: false, serverUrl: '', qrVisible: true, clipboardVisible: true });
  }
}

// Generate QR code
function generateQR(url) {
  qrcode.innerHTML = '';
  try {
    new QRCode(qrcode, {
      text: url,
      width: 160,
      height: 160,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  } catch (error) {
    console.error('QR generation error:', error);
    qrcode.innerHTML = '<div style="color: var(--text-secondary);">QR failed</div>';
  }
}

// Copy URL to clipboard
function copyUrl() {
  navigator.clipboard.writeText(serverUrl).then(() => {
    const originalText = copyUrlBtn.innerHTML;
    copyUrlBtn.innerHTML = '<span>✅</span><span>Copied!</span>';
    setTimeout(() => {
      copyUrlBtn.innerHTML = originalText;
    }, 2000);
  });
}

// Open in separate window
function openWindow() {
  if (serverUrl) {
    const width = 400;
    const height = 500;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    chrome.windows.create({
      url: serverUrl,
      type: 'popup',
      width: width,
      height: height,
      left: Math.round(left),
      top: Math.round(top)
    });
  }
}

// Receive clipboard from server
async function receiveClipboard() {
  if (!serverUrl) return;
  
  receiveBtn.disabled = true;
  const originalText = receiveBtn.innerHTML;
  receiveBtn.innerHTML = '<div class="spinner"></div><span>Receiving...</span>';
  
  try {
    const response = await fetch(`${serverUrl}/api/get`);
    if (response.ok) {
      const data = await response.json();
      clipboardText.value = data.content || '';
      
      // Also update system clipboard
      await navigator.clipboard.writeText(data.content || '');
      
      receiveBtn.innerHTML = '<span>✅</span><span>Received!</span>';
      setTimeout(() => {
        receiveBtn.innerHTML = originalText;
        receiveBtn.disabled = false;
      }, 2000);
    } else {
      throw new Error('Failed to receive clipboard');
    }
  } catch (error) {
    console.error('Receive error:', error);
    receiveBtn.innerHTML = '<span>❌</span><span>Failed</span>';
    setTimeout(() => {
      receiveBtn.innerHTML = originalText;
      receiveBtn.disabled = false;
    }, 2000);
  }
}

// Send clipboard to server
async function sendClipboard() {
  if (!serverUrl) return;
  
  const content = clipboardText.value;
  if (!content) {
    clipboardText.focus();
    return;
  }
  
  sendBtn.disabled = true;
  const originalText = sendBtn.innerHTML;
  sendBtn.innerHTML = '<div class="spinner"></div><span>Sending...</span>';
  
  try {
    const response = await fetch(`${serverUrl}/api/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: content })
    });
    
    if (response.ok) {
      sendBtn.innerHTML = '<span>✅</span><span>Sent!</span>';
      setTimeout(() => {
        sendBtn.innerHTML = originalText;
        sendBtn.disabled = false;
      }, 2000);
    } else {
      throw new Error('Failed to send clipboard');
    }
  } catch (error) {
    console.error('Send error:', error);
    sendBtn.innerHTML = '<span>❌</span><span>Failed</span>';
    setTimeout(() => {
      sendBtn.innerHTML = originalText;
      sendBtn.disabled = false;
    }, 2000);
  }
}

// Show error
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

// Hide error
function hideError() {
  errorMessage.classList.add('hidden');
}

// Hide QR section
function hideQrSection() {
  qrSection.classList.add('hidden');
  chrome.storage.local.set({ qrVisible: false });
}

// Hide clipboard section
function hideClipboardSection() {
  clipboardSection.classList.add('hidden');
  chrome.storage.local.set({ clipboardVisible: false });
}

// Listen for clipboard requests from phone
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getClipboard') {
    navigator.clipboard.readText().then(text => {
      sendResponse({ content: text });
    });
    return true; // Keep channel open for async response
  }
});
