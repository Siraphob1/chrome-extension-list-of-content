# Website Content Lister

A browser extension that lists and analyzes content from websites in a convenient side panel. Built with React, TypeScript, and Tailwind CSS.

## Features
- Extracts and displays headings and content structure from any web page
- Side panel UI for easy navigation
- Click to scroll to content on the page
- Reload/refresh analysis with a button
- Responsive design


## Installation
1. Clone this repository.
2. Install dependencies:
  - With npm: `npm install`
  - Or with Yarn: `yarn install`
3. Start development mode:
  - With npm: `npm run dev`
  - Or with Yarn: `yarn dev`
4. Build the extension for production:
  - With npm: `npm run build`
  - Or with Yarn: `yarn build`
5. Load the `dist` folder as an unpacked extension in your browser (Chrome/Firefox).

## Usage
- Open the extension side panel from your browser.
- The extension will automatically analyze the current page and list headings/content.
- Click on any listed item to scroll to that section on the page.
- Use the reload button to reanalyze the page content.

## Development
- Built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/).
- Uses the Chrome/Firefox extension APIs for tab and scripting access.

## Scripts
- `npm run dev` / `yarn dev` — Start development server
- `npm run build` / `yarn build` — Build for production

## Folder Structure
- `src/` — Source code
  - `components/` — React components
  - `hooks/` — Custom React hooks
  - `utils/` — Utility functions
  - `pages/` — Main UI pages (side panel)
  - `public/` — Static assets and icons

## License
MIT
