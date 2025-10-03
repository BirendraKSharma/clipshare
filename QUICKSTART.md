# Quick Start Guide

Get ClipShare up and running in 5 minutes! ⚡

## ⚙️ Installation (One-time setup)

### 1. Install Python
If you don't have Python installed:
- Download from [python.org](https://www.python.org/downloads/)
- During installation, check "Add Python to PATH"

### 2. Clone or Download ClipShare
```bash
git clone https://github.com/yourusername/clipshare.git
cd clipshare
```

Or download ZIP and extract.

### 3. Install Python Package
```bash
cd native-host
pip install pyperclip
```

### 4. Install Native Host
**Right-click** `native-host/install_windows.bat` → **Run as Administrator**

### 5. Load Extension in Chrome/Brave
1. Open `chrome://extensions/`
2. Toggle **Developer mode** ON (top-right)
3. Click **Load unpacked**
4. Select the `clipshare` folder
5. Done! ✅

---

## 🚀 Daily Usage

### On Your PC:

1. **Click** the ClipShare icon in your browser toolbar
2. **Click** ▶️ **Start** button
3. **QR code appears** - scan with your phone
4. **Share clipboard** using Quick Clipboard or phone interface
5. **Click** ⏹️ **Stop** when done

### On Your Phone:

1. **Scan** the QR code with camera
2. **Opens** web interface in browser
3. **Type** or paste content
4. **Click** ⬆️ Send to PC or ⬇️ Receive from PC

---

## 💡 Pro Tips

- **Hide QR after scanning**: Click "👁️ Hide QR" to save space
- **Quick clipboard**: Type directly in popup, no phone needed
- **Window mode**: Click 🪟 Window for larger interface
- **Auto theme**: Works with your system dark/light mode
- **Stop when idle**: Conserve resources when not sharing

---

## ❓ Troubleshooting

### Extension shows "Native host error"
→ Rerun `install_windows.bat` as Administrator, then restart Chrome

### Phone can't connect
→ Make sure phone and PC are on the **same WiFi network**

### Send button fails
→ Stop and restart the server (⏹️ then ▶️)

---

## 📖 Full Documentation

See [README.md](README.md) for complete documentation.

---

**Questions?** Open an [issue on GitHub](https://github.com/yourusername/clipshare/issues)
