# LinkedOFF – LinkedIn Buzzword Detox Extension

<img src="linkedoff_small.png" alt="LinkedOFF Logo" width="128"/>

## Overview

LinkedOFF is a Chrome extension that transforms verbose, buzzword-laden LinkedIn posts into clear, concise, and authentic content. It quickly rewrites posts on the fly so you can enjoy a genuine feed free of corporate fluff and hype.

## Features

- ✂️ **Instant Post Rewriting:** Automatically transforms long-winded posts into succinct, real-talk versions.
- 🔄 **Toggle Between Versions:** Easily switch between the original and the rewritten post with a single click.
- 🤖 **Powered by AI:** Utilizes advanced language processing to cut out the BS and highlight what truly matters.
- ⚡ **User-Friendly Interface:** Designed for a seamless, no-nonsense user experience on LinkedIn.
- 🎯 **Focus on Authenticity:** Helps you see and share real achievements without the noise.

## Installation

### Manual Installation

1. Download or clone this repository.
2. Open your browser's extension management page:
   - **Chrome:** `chrome://extensions/`
   - **Edge:** `edge://extensions/`
3. Enable **Developer mode**.
4. Click **Load unpacked extension**.
5. Select the `linkedoff` directory.

## Usage

1. Navigate to LinkedIn.
2. Click the LinkedOFF extension icon in your browser toolbar.
3. Use the toggle switch on any post to reveal its rewritten, buzzword-free version.
4. Enjoy a cleaner, more authentic LinkedIn feed!

## Files Structure

linked-off/
├── manifest.json        # Extension manifest configuration
├── content.js          # Content script for LinkedIn interaction
├── background.js       # Background service worker
├── popup.js           # Extension popup functionality
├── linkedoff.html     # Extension popup HTML
├── styles.css         # Extension styling
├── LinkedOFF.png      # Extension icons
├── LinkedIN.png       # Extension icons
└── linkedoff_small.png # Extension small icon

## Support

If you find this extension helpful, you can support the development by:
- [Buy Me a Coffee](https://www.buymeacoffee.com/)
- Starring the repository
- Reporting issues and contributing to the code

## Privacy

LinkedOFF sends only the text you provide for rewriting to trusted external APIs over secure, encrypted channels. Your content is used solely to generate a more concise version of your post and is not stored or shared beyond that purpose. No personal data is collected beyond what you explicitly provide.

## License

This project is licensed under the [MIT License](LICENSE).

---

*Stay authentic. Cut the buzz. Welcome to LinkedOFF!*