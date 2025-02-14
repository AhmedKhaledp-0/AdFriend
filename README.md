# AdFriend Browser Extension

A lightweight browser extension that replaces web advertisements with clean, minimal placeholder elements.

## Features

- Automatically detects and replaces common ad elements
- Minimal performance impact using efficient DOM observation
- Clean, unobtrusive placeholder design
- Works across most websites

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the AdFriend directory

## How It Works

AdFriend uses MutationObserver to detect ad elements as they appear on the page. When ads are found, they are replaced with simple placeholder divs, improving page load times and creating a cleaner browsing experience.

## Technical Details

- Uses Manifest V3
- Implements efficient DOM observation with debouncing
- Utilizes WeakSet for tracking processed elements
- Employs requestIdleCallback for better performance
