# Changelog

All notable changes to ClipShare will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-10-03

### Added
- 🎨 Modern glassmorphism UI design with backdrop blur effects
- 👁️ Hide/Show buttons for QR and Clipboard sections
- 💾 Persistent visibility state across popup reopens
- 🌓 Automatic dark mode based on system preferences
- 🪟 Popup window option for web interface
- 📋 Quick clipboard section in extension popup
- ⬆️⬇️ Direct Send/Receive buttons in popup
- ✨ Glass effect on all major sections (Header, Status, QR, Clipboard)

### Changed
- Replaced manual theme toggle with automatic system theme detection
- Improved CORS handling for better reliability
- Updated UI to be more compact and modern
- Centered header logo for cleaner look

### Fixed
- CORS error causing "Failed" status on Send button
- Added OPTIONS preflight request handling
- Fixed dark mode background color (was blue, now proper dark)
- Improved server performance with suppressed logging

### Removed
- Theme toggle button (now uses system preference)
- Unnecessary documentation files
- Test server files
- Unused QR scanning feature files

## [1.0.0] - 2025-10-01

### Added
- Initial release
- Chrome/Brave extension with native messaging
- Python HTTP server for clipboard sharing
- QR code generation for phone connection
- Bidirectional clipboard sync (PC ↔ Phone)
- Windows installation scripts
- Basic light/dark theme support

### Features
- Local network clipboard sharing
- No cloud services required
- Simple web interface for phones
- Native messaging integration
- Cross-device text sharing

---

## Version History

- **2.0.0** - Glass UI update, hide buttons, auto theme
- **1.0.0** - Initial release

---

## Upcoming

See [TODO section in README](README.md#-todo--roadmap) for planned features.
