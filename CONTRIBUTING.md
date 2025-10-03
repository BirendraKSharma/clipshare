# Contributing to ClipShare

First off, thank you for considering contributing to ClipShare! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
- [Submitting Changes](#submitting-changes)

## 📜 Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. Please be kind and constructive.

## 🤔 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details**:
  - OS version
  - Python version
  - Browser and version
  - Extension version

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When suggesting an enhancement:

- **Use a clear title**
- **Provide detailed description** of the enhancement
- **Explain why** it would be useful
- **Include mockups** if applicable

### Pull Requests

1. Fork the repo and create your branch from `main`
2. Make your changes
3. Test thoroughly
4. Update documentation if needed
5. Write clear commit messages
6. Submit a pull request

## 🛠️ Development Setup

### Prerequisites

- Python 3.8+
- Chrome or Brave browser
- Git

### Setup Steps

```bash
# 1. Fork and clone
git clone https://github.com/yourusername/clipshare.git
cd clipshare

# 2. Install Python dependencies
cd native-host
pip install -r requirements.txt

# 3. Install native host
install_windows.bat  # Run as Administrator

# 4. Load extension in Chrome
# Go to chrome://extensions/
# Enable Developer mode
# Click "Load unpacked"
# Select the clipshare folder
```

### Testing Your Changes

1. **Extension Changes**: Reload the extension in `chrome://extensions/`
2. **Python Changes**: Stop and restart the server from extension popup
3. **Native Host Changes**: Restart Chrome/Brave

## 🎨 Style Guidelines

### Python Code

- Follow [PEP 8](https://pep8.org/)
- Use meaningful variable names
- Add docstrings to functions
- Keep functions focused and small

```python
def good_function_name():
    """Clear description of what it does."""
    pass
```

### JavaScript Code

- Use `const` and `let`, not `var`
- Use meaningful variable names
- Add comments for complex logic
- Keep functions pure when possible

```javascript
// Good
const getUserClipboard = async () => {
    // Implementation
};

// Avoid
var x = function() { };
```

### HTML/CSS

- Use semantic HTML
- CSS classes should be descriptive
- Follow existing naming conventions
- Keep styles modular

## 📝 Commit Messages

Write clear commit messages:

```
feat: add clipboard history feature
fix: resolve CORS issue with phone connection
docs: update installation instructions
style: improve glass effect styling
refactor: simplify server startup logic
```

Prefixes:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting, styling
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance

## 🔄 Submitting Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

3. **Push to your fork**
   ```bash
   git push origin feature/my-feature
   ```

4. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template
   - Submit!

### Pull Request Checklist

- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tested on Windows
- [ ] Works with Chrome and Brave

## 🎯 Priority Areas

We'd especially love help with:

- **Cross-platform support** (Linux, macOS)
- **Testing** - Unit tests, integration tests
- **Documentation** - Tutorials, examples
- **Translations** - Internationalization
- **Security** - Code audits, improvements

## 💡 Questions?

Feel free to:
- Open an issue with your question
- Start a discussion in GitHub Discussions
- Check existing issues and PRs

## 🙏 Thank You!

Your contributions make ClipShare better for everyone. Every contribution, no matter how small, is valued and appreciated!

---

Happy Coding! 🚀
