# React Image Browser (Local)

A single-file, light React app that runs locally (double-click `index.html`) and lets you browse images from a local folder or selected image files.

Features
- No server required: open `index.html` in your browser by double-clicking.
- Uses CDN React + `react-bootstrap` UMD builds; responsive UI.
- Browse a folder (use the "Browse folder" button) — uses `input type="file" webkitdirectory` to read a folder.
- Folders appear as titled sections; images displayed in a responsive grid (default 5 columns on large screens).
- Images are loaded lazily and more images are appended as you scroll.
- Click an image to view a larger modal.
- Fixed footer contains controls: set columns (range), select all checkbox, download selected as ZIP, copy selected to clipboard (if supported), and shows counts.
- Offcanvas lists folders and clicking a folder scrolls to it.

Limitations & notes
- Browsing a folder requires selecting it via the folder picker. Web pages cannot arbitrarily read the filesystem for security reasons.
- `webkitdirectory` is supported by most Chromium-based browsers and Firefox (behavior may vary). The app uses the `webkitRelativePath` property when available.
- Copying multiple images to the clipboard depends on browser support for `navigator.clipboard.write` with image ClipboardItems. If not available, the app falls back to ZIP download.

How to use
1. Double-click `index.html` to open in your browser.
2. Click `Browse folder` to pick a folder containing images, or `Open file` to pick individual images.
3. Use the search box to filter filenames, click images to open them, and use footer controls to change columns, select images, and download.

How to "build" or make a standalone app
- This file is meant to run locally without building. If you want a distributable desktop app, consider packaging with:
  - Electron: wrap this `index.html` as the UI and distribute a desktop app.
  - Tauri: similar lightweight native wrapper.
- If you want a production React project with bundling (create-react-app or Vite), you can port the code to a standard React project and build with `npm run build`.

Files
- `index.html` — the entire app (open locally).
- `README.md` — this file.

Enjoy! If you want, I can:
- Convert this to a small create-react-app / Vite project with bundling and a `npm` workflow.
- Add an option to stream images with virtualization for even larger folders.
- Add keyboard navigation, lightbox features, or tagging.
