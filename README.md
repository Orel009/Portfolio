# Portfolio — Orel Benbenista

Personal portfolio site, built with React 18 + Vite + Tailwind CSS, with a three.js scene in the Hero.

## Stack

- React 18 + React Router (single page, anchor-link navigation)
- Vite 5
- Tailwind CSS 3
- `@react-three/fiber` / `@react-three/drei` for the Hero 3D scene
- framer-motion for entrance animations
- EmailJS for the contact form

## Scripts

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
npm run lint      # eslint, must pass with zero warnings
```

## Content

All personal content (name, bio, experience, education, projects, skills) lives in
`src/constants/index.js`. That's the one file to edit to update the site's content.

## Deployment

Deployed via Firebase Hosting (`firebase.json` points at the `dist/` build output).

```bash
npm run build
firebase deploy
```

See `RENOVATION_REPORT.md` for the history of the 2026 content/design renovation, including
open items that still need action (real CV PDF, OG image domain, a couple of pending
content decisions).
