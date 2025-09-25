# Resilience Profile (GitHub Pages ready)

This folder is ready for GitHub Pages. It uses Vite + React and builds into `/docs`.

## How to publish

1. **Create a new GitHub repo** (Public), e.g. `resilience-profile`.
2. Upload (or push) *all files in this zip*, including the `/docs` folder after you build.
3. Install deps locally (or in Codespaces):  
   ```bash
   npm install
   npm run build
   ```
   This writes the static site to `docs/`.
4. Commit & push everything.
5. In GitHub: **Settings → Pages → Source: Branch = main, Folder = /docs**.
6. Open your site at: `https://<username>.github.io/<repo>/`.

## Local dev
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```