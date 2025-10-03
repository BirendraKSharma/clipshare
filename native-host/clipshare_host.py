#!/usr/bin/env python3
"""
ClipShare Native Host
Manages local web server for clipboard sharing between PC and phone
"""

import sys
import json
import struct
import threading
import socket
from http.server import BaseHTTPRequestHandler, HTTPServer
import pyperclip

# Configuration
PORT = 8080
server_thread = None
httpd = None
server_url = ''


class ClipboardHandler(BaseHTTPRequestHandler):
    """HTTP request handler for clipboard operations"""
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        if self.path == '/':
            self.send_html_page()
        elif self.path == '/api/get':
            self.send_clipboard_content()
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        if self.path == '/api/set':
            self.receive_clipboard_content()
        else:
            self.send_response(404)
            self.end_headers()
    
    def send_html_page(self):
        """Serve the web interface for phone"""
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        html = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
            <title>ClipShare</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                :root {
                    --bg-primary: #ffffff;
                    --bg-secondary: #f5f5f5;
                    --text-primary: #000000;
                    --text-secondary: #666666;
                    --border-color: #e0e0e0;
                    --button-bg: #000000;
                    --button-text: #ffffff;
                }
                
                @media (prefers-color-scheme: dark) {
                    :root {
                        --bg-primary: #1a1a1a;
                        --bg-secondary: #2a2a2a;
                        --text-primary: #ffffff;
                        --text-secondary: #b0b0b0;
                        --border-color: #404040;
                        --button-bg: #ffffff;
                        --button-text: #000000;
                    }
                }
                
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    min-height: 100vh;
                    padding: 20px;
                    transition: background 0.3s, color 0.3s;
                }
                
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                }
                
                .header {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding-bottom: 16px;
                    border-bottom: 2px solid var(--border-color);
                    margin-bottom: 24px;
                }
                
                .logo {
                    font-size: 24px;
                    font-weight: 600;
                }
                
                .card {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 16px;
                }
                
                textarea {
                    width: 100%;
                    min-height: 200px;
                    padding: 14px;
                    font-size: 16px;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    resize: vertical;
                    font-family: inherit;
                }
                
                textarea:focus {
                    outline: none;
                    border-color: var(--text-primary);
                }
                
                .button-group {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-top: 16px;
                }
                
                button {
                    padding: 16px 24px;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background: var(--button-bg);
                    color: var(--button-text);
                }
                
                button:active {
                    transform: scale(0.98);
                }
                
                .status {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    padding: 12px 16px;
                    border-radius: 8px;
                    text-align: center;
                    font-size: 14px;
                    margin-top: 12px;
                    opacity: 0;
                    transition: opacity 0.3s;
                    color: var(--text-secondary);
                }
                
                .status.show {
                    opacity: 1;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">ClipShare</div>
                </div>
                
                <div class="card">
                    <textarea id="clipboard" placeholder="Type or paste content here..."></textarea>
                    
                    <div class="button-group">
                        <button onclick="receiveFromPC()">
                            ⬇️ Receive
                        </button>
                        <button onclick="sendToPC()">
                            ⬆️ Send
                        </button>
                    </div>
                    
                    <div id="status" class="status"></div>
                </div>
            </div>
            
            <script>
                // Clipboard operations
                async function receiveFromPC() {
                    try {
                        const response = await fetch('/api/get');
                        const data = await response.json();
                        document.getElementById('clipboard').value = data.content;
                        showStatus('✅ Received from PC');
                    } catch (error) {
                        showStatus('❌ Failed to receive');
                    }
                }
                
                async function sendToPC() {
                    try {
                        const content = document.getElementById('clipboard').value;
                        if (!content.trim()) {
                            showStatus('⚠️ Nothing to send');
                            return;
                        }
                        
                        await fetch('/api/set', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({content: content})
                        });
                        showStatus('✅ Sent to PC');
                    } catch (error) {
                        showStatus('❌ Failed to send');
                    }
                }
                
                function showStatus(msg) {
                    const status = document.getElementById('status');
                    status.textContent = msg;
                    status.classList.add('show');
                    setTimeout(() => {
                        status.classList.remove('show');
                    }, 3000);
                }
            </script>
        </body>
        </html>
        """
        self.wfile.write(html.encode('utf-8'))
    
    def send_clipboard_content(self):
        """Send current clipboard content to phone"""
        try:
            content = pyperclip.paste()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = json.dumps({'content': content, 'status': 'success'})
            self.wfile.write(response.encode('utf-8'))
        except Exception as e:
            self.send_error(500, str(e))
    
    def receive_clipboard_content(self):
        """Receive clipboard content from phone and update PC clipboard"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            pyperclip.copy(data['content'])
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = json.dumps({'status': 'success'})
            self.wfile.write(response.encode('utf-8'))
        except Exception as e:
            self.send_error(500, str(e))
    
    def log_message(self, format, *args):
        """Suppress console logs"""
        pass


def get_local_ip():
    """Get local IP address"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return '127.0.0.1'


def start_server():
    """Start HTTP server in a separate thread"""
    global httpd, server_url, server_thread
    
    try:
        ip = get_local_ip()
        server_url = f'http://{ip}:{PORT}'
        
        httpd = HTTPServer(('0.0.0.0', PORT), ClipboardHandler)
        
        server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
        server_thread.start()
        
        send_message({
            'type': 'server_started',
            'url': server_url,
            'ip': ip,
            'port': PORT
        })
        
    except Exception as e:
        send_message({
            'type': 'error',
            'message': f'Failed to start server: {str(e)}'
        })


def stop_server():
    """Stop HTTP server"""
    global httpd
    
    if httpd:
        httpd.shutdown()
        httpd = None
        send_message({'type': 'server_stopped'})


def send_message(message):
    """Send message to Chrome extension"""
    encoded_content = json.dumps(message).encode('utf-8')
    encoded_length = struct.pack('I', len(encoded_content))
    sys.stdout.buffer.write(encoded_length)
    sys.stdout.buffer.write(encoded_content)
    sys.stdout.buffer.flush()


def read_message():
    """Read message from Chrome extension"""
    raw_length = sys.stdin.buffer.read(4)
    if len(raw_length) == 0:
        sys.exit(0)
    
    message_length = struct.unpack('I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return json.loads(message)


def main():
    """Main message loop"""
    while True:
        try:
            message = read_message()
            
            if message['command'] == 'start':
                start_server()
            elif message['command'] == 'stop':
                stop_server()
            
        except Exception as e:
            send_message({
                'type': 'error',
                'message': str(e)
            })
            break


if __name__ == '__main__':
    main()
