# Portfolio Audit

Repo: https://github.com/Orel009/Portfolio.git
Cloned and analyzed in place. No code was modified as part of this audit; `node_modules/` and `dist/` were generated locally by `npm install` / `npm run build` and are gitignored (not committed).

## Step 1 — Repo basics

```
git log --oneline -20
9a8235c add project and new job
48698ac first commit
```

- **2 commits total.** This is effectively a fresh/minimal history — "first commit" (initial Vite/React template + JSX3D template content) then one follow-up commit adding a project and a job.
- **Last commit date:** Tue Dec 30 2025, 13:14:41 +0200 — about 8 months before this audit (2026-08-27).
- **Branches:** only `master` (local and `origin/master`). No feature branches, no `gh-pages` branch, no tags.
- **Remote:** `https://github.com/Orel009/Portfolio.git` (origin only).

This is a solo, unbranched project — there's no history of iteration to preserve, so a rebuild would lose nothing in terms of git archaeology.

---

## Stack and build

### package.json

- **Framework:** React 18.2 (`react`, `react-dom` ^18.2.0), routed with `react-router-dom` ^6.22.0 (only used for `<BrowserRouter>` — the whole site is a single page with anchor-link scrolling; the router is not actually doing multi-route work).
- **Build tool:** Vite 5.0.8 (via `@vitejs/plugin-react` ^4.2.1).
- **Styling:** Tailwind CSS ^3.4.1 + PostCSS ^8.4.33 + Autoprefixer ^10.4.17.
- **3D/animation:** `three` ^0.161.0, `@react-three/fiber` ^8.15.16, `@react-three/drei` ^9.97.0, `maath` ^0.10.7, `framer-motion` ^11.0.3.
- **Other:** `@emailjs/browser` ^4.1.0 (contact form), `firebase` ^11.4.0 (declared as a dependency but **not imported anywhere in `src/`** — dead dependency), `react-tilt` ^1.0.2 (tilt-on-hover cards), `react-vertical-timeline-component` ^3.6.0 (experience timeline).
- **Dev deps:** `eslint` ^8.55.0 + `eslint-plugin-react`/`react-hooks`/`react-refresh`, `@types/react` + `@types/react-dom` (types installed but the project is plain `.jsx`, not TypeScript — not a problem, just unused inference help), `autoprefixer`, `postcss`, `tailwindcss`, `vite`.

**Scripts:** `dev` (vite), `build` (vite build), `lint` (eslint, `--max-warnings 0`), `preview` (vite preview). No test script — there are no tests in the repo.

**Flagged as outdated/deprecated (as installed, not upgraded):**
- **ESLint 8.55** — ESLint 8 is EOL (end-of-life since Oct 2024); current major is ESLint 9 with flat config. Not broken, just unsupported upstream.
- **React 18.2** — still supported, but React 19 has been out for a while; if the rebuild path is chosen this is the natural version to move to.
- **firebase 11.4.0** dependency is dead weight — nothing in `src/` imports `firebase`. Only `firebase.json`/`.firebaserc` (hosting config) reference Firebase; the SDK itself isn't used by the app.
- `npm audit` reports **28 vulnerabilities (1 low, 9 moderate, 16 high, 2 critical)** in the resolved dependency tree — all in transitive build-tooling packages (`postcss`, `rollup`, `protobufjs`, `nanoid`, `picomatch`, `websocket-driver`, `yaml`, `uuid`, `minimatch`), not in your own code, and not exploitable in the shipped static site (these are dev/build-time tools). Still worth knowing before any dependency bump.
- **`prop-types` is used directly in `src/components/Works.jsx`** (`import PropTypes from "prop-types"`) but is **not declared in `package.json`** at all. It currently resolves only because it's a transitive dependency of `@react-three/drei`, `eslint-plugin-react`, and `react-vertical-timeline-component` (confirmed via `npm ls prop-types`). This is a "phantom dependency" — it works today by luck of the dependency tree, and could silently break the build in the future if any of those packages drop `prop-types` as a dependency.

### Does it build?

Yes. Ran exactly as instructed — no upgrades, no codemods.

**`npm install`** — succeeded. `added 510 packages` in ~12s. No install errors. Output noise:
- 28 vulnerabilities per `npm audit` (see above).
- `npm warn allow-scripts` for 4 packages with postinstall scripts (`@firebase/util`, `esbuild`, `protobufjs`, `react-vertical-timeline-component`) — informational only, not an error.
- Note: `הרחבות.txt` (a personal notes file, see below) says to install with `--legacy-peer-deps`; that flag was **not** needed — plain `npm install` resolved cleanly on this machine (npm 11.16.0, Node v24.18.0). Peer-dependency conflicts can be version/npm-resolver dependent, so this may have been necessary on an older npm/Node combination the note was written for.

**`npm run build`** — succeeded, output in `dist/` (22 MB). Warnings:
- `Browserslist: caniuse-lite is outdated` — cosmetic, doesn't affect output.
- `node_modules/three-stdlib/libs/lottie.js ... Use of eval() is strongly discouraged` — comes from a third-party dependency (three-stdlib), not your code; nothing to fix on your side.
- **Bundle size warning:** `dist/assets/index-*.js` is **1,228.93 kB** (361 kB gzipped) — Rollup's "chunks larger than 500 kB" warning fires. This is a single monolithic JS bundle with zero code-splitting. The three.js/react-three-fiber stack is the overwhelming majority of that weight.
- Several individual image assets ship at large sizes directly in the bundle output, notably `herobg-*.png` at **930 kB** — this is the hero section's CSS background image, unresized, loaded on first paint.

**`npm run lint`** — **fails** with 64 errors and 13 warnings (`--max-warnings 0` means any warning also fails the script). This means CI/`npm run lint` has likely never passed on this codebase as committed. Full breakdown is in the "Quality / dead code" section below — highlights:
- `'React' is defined but never used` in nearly every component (React 18's automatic JSX runtime doesn't need the import, but the ESLint parser config here isn't set to recognize that, so this always fires — a config/react-version mismatch, not a real code problem).
- Real bugs caught by lint, see "Responsiveness" and "Content" sections below for the two that actually affect behavior (`Experience.jsx` missing `key`, and the `.eslintrc.cjs`'s own linting of `tailwind.config.js` failing on `no-undef: module` because Node globals aren't enabled for config files).

### Lock file, Node version, configs

- **Lock file:** `package-lock.json`, `lockfileVersion: 3` — present and consistent with the installed tree (npm 7+/lockfile v3 format).
- **Required Node version:** **not specified anywhere** — no `engines` field in `package.json`, no `.nvmrc`, no `.node-version`. Tested successfully on Node v24.18.0 / npm 11.16.0, but nothing pins a minimum version for other contributors/CI.
- **Vite config** (`vite.config.js`): minimal, just `react()` plugin, no aliases, no base path, no build overrides (no `manualChunks`, no asset inlining thresholds changed).
- **Tailwind config** (`tailwind.config.js`): `content: ["./src/**/*.{js,jsx}"]`, `mode: "jit"` (redundant in Tailwind 3, JIT is the default and the `mode` key is a no-op leftover from Tailwind 2 config style — harmless but dead config). Custom theme extensions: color palette (`primary`, `secondary`, `tertiary`, `black-100`, `black-200`, `white-100`), one custom `boxShadow.card`, one custom breakpoint `xs: 450px`, and a `hero-pattern` background image pointing at `/src/assets/herobg.png`.
- **PostCSS config**: just `tailwindcss` + `autoprefixer`, standard.
- **ESLint config** (`.eslintrc.cjs`): legacy `.eslintrc` format (pre-flat-config), `env: { browser: true, es2020: true }` — **does not include `node: true`**, which is why linting `tailwind.config.js` itself throws `'module' is not defined`. `ignorePatterns` excludes `dist` and the config file's own filename but not `tailwind.config.js`/`postcss.config.js`, so those get linted under browser-only globals and fail.
- **No `tsconfig.json`** — project is plain JS/JSX despite `@types/react` being installed.
- **Firebase config** (`firebase.json`): `"public": "public"` with a catch-all SPA rewrite to `index.html`. **This looks like a deployment bug** — the Vite build output goes to `dist/`, not `public/`. `public/` in this repo is Vite's static-assets source folder (3D model files) plus a leftover **default Firebase Hosting welcome page** (`public/index.html`, literally the "Firebase Hosting Setup Complete" boilerplate — see Quality section). As configured, `firebase deploy` would publish the raw `public/` folder — the actual React app in `dist/` would not be what's live, unless there's a manual step (e.g., copying `dist/` into `public/`, or editing `firebase.json` before each deploy) that isn't captured anywhere in this repo. **I'm flagging this rather than guessing** — you'll want to confirm what your actual deploy process is before relying on this config as-is.

---

## Structure and content

### Full file tree (excluding node_modules, dist, .git)

```
.eslintrc.cjs                  ESLint config (legacy format, missing node env — see above)
.firebaserc                    Firebase project alias → "portfolio-4de70"
.gitignore                     standard Vite gitignore
README.md                      unedited Vite template boilerplate (no project-specific info)
firebase.json                  Firebase Hosting config (public dir mismatch — see above)
index.html                     Real Vite entry HTML (title, viewport, favicon link, #root, script tag)
package-lock.json
package.json
postcss.config.js
tailwind.config.js
vite.config.js
הרחבות.txt                     Personal scratch note (Hebrew filename "extensions.txt"): an EmailJS
                                dashboard link and an `npm install --legacy-peer-deps ...` command.
                                Not used by the app; looks like a personal reminder file accidentally committed.

public/
  index.html                   DEAD FILE — default Firebase Hosting "Setup Complete" welcome page,
                                never referenced by the real app (Vite ignores public/index.html; the
                                real entry is the root index.html). Leftover from `firebase init hosting`.
  logo.svg                     favicon source
  desktop_pc/                  3D desktop model (glTF + textures + license.txt) — 16 MB — used by Hero canvas
  planet/                      3D earth model (glTF + textures + license.txt) — 2.9 MB — used by Contact canvas

src/
  main.jsx                     React root render, wraps <App/> in StrictMode
  App.jsx                      Top-level layout: renders Navbar, Hero, About, Experience, Tech, Works,
                                Feedbacks, Contact, StarsCanvas in that order, wrapped in BrowserRouter
  index.css                    Global styles: Poppins font import, Tailwind directives, box-shadow/text
                                gradient utility classes, the canvas loader spinner keyframes
  styles.js                    Small shared Tailwind class-string constants (padding, heading sizes)
  utils/motion.js               framer-motion variant factories (fadeIn, zoomIn, slideIn, textVariant, staggerContainer)

  constants/index.js           ALL portfolio content data: navLinks, services, technologies, experiences,
                                testimonials, projects (see "Where content lives" below)

  hoc/SectionWrapper.jsx        Higher-order component: wraps a section in a framer-motion fade/stagger
                                container + an anchor `<span id="...">` used for nav-link scrolling
  hoc/index.js                  barrel export

  components/
    Navbar.jsx                  Sticky top nav: logo + name, desktop link row, mobile hamburger menu
    Hero.jsx                    Full-viewport hero: name/tagline text + 3D desktop-computer canvas + scroll-down affordance
    About.jsx                   "Overview" section: bio paragraph (hardcoded, not in constants — see below)
                                 + 4 "service" tilt cards (Web/C#/Backend/Frontend Developer)
    Experience.jsx               Work-experience vertical timeline (react-vertical-timeline-component),
                                 data from constants.experiences
    Tech.jsx                     Grid of spinning 3D "ball" icons, one per technology (constants.technologies)
    Works.jsx                    "Projects" grid of tilt cards with image, description, tags, GitHub link
                                 (constants.projects)
    Feedbacks.jsx                "Testimonials" section — see Content flag below (fabricated quotes
                                 attributed to real public figures)
    Contact.jsx                  Contact form (EmailJS) + 3D earth canvas
    Loader.jsx                   Shared <Suspense> fallback for all 3D canvases (percentage loader)
    index.js                     barrel export for all components + canvas components

    canvas/
      Computers.jsx              3D desktop-PC scene for Hero, mobile-aware scale/position via matchMedia
      Earth.jsx                  3D globe scene for Contact
      Ball.jsx                   3D icosahedron+decal "ball" used per tech icon in Tech section
      Stars.jsx                  Full-page starfield background (fixed behind Contact section)
      index.js                   barrel export

  assets/                        all images/icons (tech logos, company logos, project screenshots,
                                 fake-testimonial headshots, hero background, UI icons)
  assets/index.js                named exports for every asset actually used by components
```

### Where personal content lives (file + line map)

Content is **split between a central data file and hardcoded JSX**, inconsistently:

| Section | Data location | Hardcoded in JSX? |
|---|---|---|
| Name / brand ("Orel \| Benbenista") | — | **Yes** — [`src/components/Navbar.jsx:26-28`](src/components/Navbar.jsx#L26-L28) |
| Hero headline ("Hi, I'm Orel") + tagline | — | **Yes** — [`src/components/Hero.jsx:16-22`](src/components/Hero.jsx#L16-L22) |
| Nav link labels (About/Work/Contact) | [`src/constants/index.js:30-43`](src/constants/index.js#L30-L43) | data-driven |
| Bio / "Overview" paragraph | — | **Yes** — [`src/components/About.jsx:46-57`](src/components/About.jsx#L46-L57), full paragraph inline |
| "Services" cards (Web/C#/Backend/Frontend Developer) | [`src/constants/index.js:45-62`](src/constants/index.js#L45-L62) | data-driven |
| Technologies / skills icons | [`src/constants/index.js:64-129`](src/constants/index.js#L64-L129) | data-driven (note: two entries, Redux and Three JS, are commented out — dead data, lines 109-112 and 117-120) |
| Work experience (titles, companies, dates, bullet points) | [`src/constants/index.js:131-162`](src/constants/index.js#L131-L162) | data-driven |
| Testimonials | [`src/constants/index.js:164-189`](src/constants/index.js#L164-L189) | data-driven, **but see content flag below** |
| Projects (name, description, tags, image, repo link) | [`src/constants/index.js:191-335`](src/constants/index.js#L191-L335) | data-driven |
| Contact form recipient name/email + EmailJS service/template/public keys | — | **Yes, hardcoded** — [`src/components/Contact.jsx:30-39`](src/components/Contact.jsx#L30-L39) |
| Site `<title>` | — | **Yes** — [`index.html:8`](index.html#L8) (currently reads "Orel \| Protfolio" — typo) |

**Practical implication for your content update:** swapping in new experience/project/skills/testimonial data is a clean edit confined to `src/constants/index.js`. But your **name, hero tagline, bio paragraph, and contact-form target email/name** live directly inside component JSX in three different files and will need separate edits — see the "Content-edit map" in the summary below for the exact list.

### Section render order (as shipped, from `App.jsx`)

1. Navbar (fixed, always visible)
2. Hero (full-viewport intro + 3D PC)
3. About ("Overview" — bio + service cards)
4. Experience (work timeline)
5. Tech (skills, 3D ball grid)
6. Works (projects grid)
7. Feedbacks (testimonials)
8. Contact (form + 3D earth) with a starfield canvas layered behind it

### Hebrew/RTL support

**None.** `index.html` declares `<html lang="en">` only, no `dir="rtl"` anywhere, no conditional language switching logic anywhere in `src/`. The only Hebrew text in the whole repo is the filename `הרחבות.txt` and its contents (a personal note, not rendered by the site). If you want bilingual/RTL support post-upgrade, that's a from-scratch feature, not something partially there today.

---

## Design and styling

- **Styling approach:** Tailwind CSS utility classes almost exclusively, applied inline in JSX `className` strings. A handful of custom global CSS classes are defined in `src/index.css` for effects Tailwind doesn't do out of the box (gradient-text clip effects, the canvas loading spinner keyframes, a `.hash-span` anchor-offset hack for the sticky nav). No CSS Modules, no styled-components, no other UI library. This is one consistent approach, not a mix — that's a genuine plus for a rebuild-in-place approach.
- **Design tokens:** Partial. Colors are tokenized in `tailwind.config.js` (`primary`, `secondary`, `tertiary`, `black-100`, `black-200`, `white-100`) and used consistently via those names. **Typography and spacing are not tokenized** — font sizes are scattered as one-off arbitrary values directly in class strings (e.g. `text-[80px]`, `text-[60px]`, `text-[50px]`, `text-[40px]` all appear ad hoc across `styles.js` and individual components rather than a shared type scale). Some of the "text gradient" classes in `index.css` hardcode raw hex colors that don't correspond to any Tailwind token (`#f12711`, `#11998e`, `#2f80ed`, `#ec008c`, etc.) — a second, uncoordinated color palette living outside the Tailwind config.
- **Fonts:** Single font family, Poppins, loaded from Google Fonts CDN via `@import` in `index.css` (weights 100–900). This is a render-blocking `@import` — a `<link rel="preconnect">`/`<link>` in `index.html` would load faster, but this is a minor perf nit, not a functional bug.
- **Color palette:** Dark theme only (`color-scheme: dark` is forced globally in `index.css`); no light mode, no user toggle.
- **Icon sources:** All icons are individual PNG/SVG image files under `src/assets` (tech logos, company logos, UI icons), not an icon font or icon component library.
- **Animation:** `framer-motion` for scroll-reveal/stagger effects (via the `SectionWrapper` HOC and the `motion.js` variant factories), plus `react-tilt` for the 3D-tilt-on-hover effect on service/project cards, plus the full three.js/`@react-three/fiber` stack for the three 3D scenes (hero PC, contact earth, tech-icon balls) and the starfield background.

---

## Responsiveness — detailed findings

### Viewport meta tag
Present and correct: `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` in `index.html:7`. Good.

### Media queries
There are **no manually-written `@media` rules anywhere in the CSS** (`index.css` has zero). All responsive behavior comes from Tailwind's utility-class breakpoint prefixes, which Tailwind compiles into media queries at build time. Breakpoints in play, per `tailwind.config.js` + Tailwind defaults:

| Prefix | Min-width | Source |
|---|---|---|
| `xs:` | 450px | custom, `tailwind.config.js:19` |
| `sm:` | 640px | Tailwind default |
| `md:` | 768px | Tailwind default |
| `lg:` | 1024px | Tailwind default |
| `xl:` | 1280px | Tailwind default |

There is **no breakpoint between 0 and 450px** — meaning there's exactly one layout for every phone narrower than 450px (which is most phones in portrait: iPhone SE/mini/standard are all ≤ 430px), and it's whatever the "no prefix" (mobile-first base) classes produce.

### Concrete hazards found

1. **Contact section layout is broken on mobile due to a typo — high severity.** [`src/components/Contact.jsx:62`](src/components/Contact.jsx#L62):
   ```jsx
   <div className="xl:mt-12 xl:flex-row flex-col-recerse flex gap-10 overflow-hidden">
   ```
   `flex-col-recerse` is not a real Tailwind class (should be `flex-col-reverse`) — Tailwind will silently drop it since it doesn't match any utility. The intent was clearly "stack as a column, form below the earth canvas, on small screens; go side-by-side only at `xl:`." Because the typo'd class does nothing, below the `xl` breakpoint (i.e. on every phone and most tablets) this container falls back to the browser's default flex-direction (`row`), putting the contact **form and the 3D earth canvas side-by-side** instead of stacked. The earth canvas has a fixed height (`h-[350px]` / `md:h-[550px]`) but no width control, and the form has fixed input padding — on a narrow screen this will visibly squash both, and is a strong candidate for horizontal overflow/clipping. This is the single most concrete, verifiable responsive bug in the codebase — it directly contradicts the apparent design intent and is easy to point at with certainty (not a guess).

2. **Single monolithic mobile breakpoint below 450px.** Because the custom `xs` breakpoint starts at 450px, phones narrower than that (many current iPhones/Androids in portrait) get no intermediate tuning — text sizes drop straight from the `xs:` value to the unprefixed base value, which for e.g. the hero heading (`text-[40px]` unprefixed) may still be large relative to a ~360-390px viewport width once you account for padding.

3. **Non-fluid, hardcoded pixel font sizes throughout**, e.g. `src/styles.js:6-14` (`heroHeadText`, `heroSubText`, `sectionHeadText`, etc. all use arbitrary `text-[Npx]` values per breakpoint rather than `clamp()`/fluid typography). This works but means every size is a fixed step-function across exactly the breakpoints defined — no fluid scaling in between, and any new breakpoint requires touching every one of these strings by hand.

4. **Fixed-width 3D canvases with no small-screen fallback.** All three `<Canvas>` 3D scenes (`Computers.jsx`, `Earth.jsx`, `Ball.jsx` ×N in the Tech grid) render full WebGL scenes on every screen size, including small phones. `Computers.jsx` does adjust scene *scale*/*position* for `isMobile` (a `matchMedia("(max-width:500px)")` check — inconsistent with the Tailwind `xs`/`sm` breakpoints, which are 450px/640px, so there's a third, uncoordinated breakpoint definition here), but it still renders the full 3D model and OrbitControls on mobile — meaning mobile users pay the full WebGL/GPU/battery cost of desktop-grade 3D rendering, which is a common source of jank/slow load on low-end phones. This isn't a layout-overflow bug, but it's a real mobile-UX/performance hazard worth listing.

5. **`Tech.jsx` icon grid** (`src/components/Tech.jsx:9`): `flex flex-row flex-wrap justify-center gap-10` with each icon in a fixed `w-28 h-28` (112px) box. This does wrap correctly (no overflow), but with `gap-10` (40px) between fixed 112px boxes, on a ~360px-wide phone you get at most 2 icons per row with a lot of empty side margin — not broken, just not an efficient use of space; a design/polish item rather than a bug.

6. **Testimonial cards fixed width below `xs`.** [`src/components/Feedbacks.jsx:18`](src/components/Feedbacks.jsx#L18): `className="bg-black-200 p-10 rounded-3xl xs:w-[320px] w-fill"`. `w-fill` is **not a valid Tailwind class** (should be `w-full`) — same typo pattern as the Contact bug. Below the `xs` (450px) breakpoint this falls back to no explicit width, which for a block-level div effectively behaves like `w-auto`/parent-constrained, so it's less severe than the Contact bug (it doesn't break layout, since the parent is `flex-wrap`), but it's dead/wrong code that should be `w-full` for the intended mobile-full-width-card look.

7. **No tables in the codebase** — not a hazard here.

8. **Images:** All content images are rendered through React with explicit Tailwind sizing classes (e.g. `w-full h-full object-cover`), not raw unstyled `<img>` tags, so there's no "unconstrained native image width causing overflow" issue. No `max-width` hazard found from raw images.

### Nav/header on narrow screens
Handled correctly, structurally: [`src/components/Navbar.jsx`](src/components/Navbar.jsx) shows the horizontal link row only at `sm:` and above (`hidden sm:flex`, line 30) and shows a hamburger icon (`sm:hidden`, line 43) below that, which toggles a dropdown panel with the same three links. **No links are lost on mobile** — they move into the hamburger menu, which is the correct pattern. Two small things: the toggle panel positions absolutely (`absolute top-20 right-0 ... z-10`) with no click-outside-to-close handler (has to be manually toggled again to close), and the brand text `" | Benbenista"` is hidden below `sm:` (`sm:block hidden`, line 27) — that's a deliberate content truncation (first name only on mobile), not a functionality loss.

### Interactive elements hidden entirely on mobile (the thing you said you care about most)
I checked every `hidden`/`sm:hidden`/breakpoint-conditional class in the components. **I did not find any button or link that disappears with no mobile equivalent.** The only conditionally-hidden interactive-adjacent elements are:
- The nav links (`Navbar.jsx:30`) — hidden at `<sm`, but re-appear inside the hamburger menu (`Navbar.jsx:43-71`). Not lost.
- A decorative `<br>` (`Hero.jsx:21`) and a decorative name suffix span (`Navbar.jsx:27`) — neither is interactive.

So: **no vanishing functionality found**, but I want to flag this honestly rather than overclaim — my check was a targeted `grep` for `hidden`/breakpoint-prefixed-`hidden` classes plus a manual read of every component; if there's a subtler case (e.g. something hidden via inline JS state rather than a Tailwind class) that I didn't spot, say so and I'll dig further before you rely on this conclusion.

---

## Assets, deployment, quality

### Images and files
- Total `src/assets/` size: **~7.0 MB**. Notable outliers:
  - `SatyaNadella.jpg` — **3.64 MB**, by far the largest single asset in the repo, used as a small 40×40px rounded avatar (`Feedbacks.jsx:34` renders it at `w-10 h-10`). Massively oversized for its display size.
  - `herobg.png` — **930 KB**, used as the full-page hero CSS background, loaded on first paint, uncompressed/unresized.
  - `carShop.png` (417 KB), `cart.png` (227 KB), `angular.png` (174 KB), `saas.png` (166 KB), `LearningPlatform.png` (165 KB), `medicalMedia.png` (118 KB), `JobInterviewAI.png` (92 KB) — all project/company images shipped at what look like un-downsized source resolutions.
  - `public/desktop_pc/` (16 MB) and `public/planet/` (2.9 MB) — glTF 3D models + textures, by far the largest assets in the whole repo, loaded on every page view of the Hero and Contact sections respectively.
- **Dead/unused image files** (present in `src/assets/` but never imported by `src/assets/index.js` or anywhere else): `mobile.png`, `carrent.png` (758 KB), `logo.png` (there's also `logo.svg`, which is the one actually used).
- **No CV/resume file anywhere in the repo**, and no "Download CV" link/button in any component. If the old site had one, it's not in this codebase; if it never had one, that's a gap worth deciding on for the upgrade (a CV download is a fairly standard portfolio feature).
- **Total `dist/` build output: 22 MB** — dominated by the 3D model assets and the unoptimized images above.

### Deployment
- **Firebase Hosting** is the deployment target (`.firebaserc` → project `portfolio-4de70`, `firebase.json` present). No GitHub Actions/CI workflow exists (no `.github/` directory at all) — deployment is presumably manual (`firebase deploy` run locally).
- **No `homepage` field in `package.json`** and no `base` override in `vite.config.js` — so the build assumes root-path hosting (`/`), consistent with Firebase Hosting serving from a custom/root domain rather than a GitHub Pages project-subpath setup.
- **Flagging, not guessing:** as detailed in the Stack section above, `firebase.json`'s `"public": "public"` does not point at the Vite build output directory (`dist`). Either there's a manual/undocumented step that reconciles this before each deploy, or the live site is not actually serving the current React build. I did not find anything in the repo that resolves this ambiguity, so please confirm your actual deploy steps before the upgrade — this affects whether "make the site live" is a one-line `firebase.json` fix or already working via a process outside the repo.

### SEO and meta
- `<title>` present but has a typo: **"Orel | Protfolio"** (`index.html:8`) — should be "Portfolio".
- **No `<meta name="description">`.**
- **No Open Graph tags** (`og:title`, `og:description`, `og:image`, etc.) — links shared on social/Slack/etc. will show no preview card.
- **No `<meta name="twitter:card">` equivalents either.**
- Favicon: present and reasonable (`public/logo.svg`, linked correctly at `index.html:6`).
- No `robots.txt` or `sitemap.xml` in `public/`.

### Accessibility
- **Image alt text:** present on almost every `<img>`. One bug: [`src/components/Experience.jsx:24`](src/components/Experience.jsx#L24) sets `alt={experience.comapany_name}` — note the typo **`comapany_name`**, which does not exist on the experience objects in `constants/index.js` (the real field is `company_name`, spelled correctly elsewhere in the same file at line 36). This means every experience-timeline icon renders with `alt={undefined}`, i.e. effectively no alt text, for a screen reader.
- **Semantic HTML:** minimal. The site is almost entirely `<div>`s; the only semantic landmark is `<nav>` in `Navbar.jsx`. No `<main>`, no `<footer>`, no `<header>` (the "hero" section is a plain `<section>` via `SectionWrapper`, which is good, but there's no outer `<main>` wrapping the page content).
- **Focus states:** [`src/components/Contact.jsx:108`](src/components/Contact.jsx#L108) applies `outline-none` to the submit button with **no replacement focus style** — this removes the browser's default keyboard-focus ring for keyboard/screen-reader-adjacent users without providing an alternative, a real (if small) accessibility regression. (The three text inputs use a typo'd `outlined-none`, which is not a real Tailwind class, so they're unaffected — their default focus outline is intact, which is good, but only by accident.)
- **Color/contrast:** not formally audited (would need a running instance + contrast checker), but the design leans on `text-secondary` (`#aaa6c3`) on dark backgrounds (`primary` `#050816`, `tertiary` `#151030`) for a lot of body copy — this combination is plausibly borderline-to-passing for WCAG AA at typical body text sizes; worth running an actual contrast check once the new content/design is in place rather than guessing here.
- **Forced dark mode:** `color-scheme: dark` is set globally (`index.css:13`) with no light-mode alternative or `prefers-color-scheme` handling — not an accessibility bug per se, but worth knowing if a future visitor's OS/browser preference is light mode.

### Broken links, dead code, leftover files
- **`public/index.html`** — dead file, the default Firebase Hosting welcome page, never served by the actual app (see Structure section).
- **`README.md`** — unedited Vite template boilerplate; contains no project-specific information.
- **`הרחבות.txt`** — a personal scratch note (EmailJS dashboard link + an `npm install` command) that appears to have been committed by accident; not referenced by any code.
- **Unused assets:** `mobile.png`, `carrent.png`, `logo.png` in `src/assets/` (see Assets section).
- **Commented-out dead data** in `constants/index.js`: a Redux Toolkit technology entry (lines 109-112) and a Three JS technology entry (lines 117-120) are commented out but left in place, along with their now-unused imports still present in `assets/index.js` (`redux`, `threejs`, `figma` are imported and exported but `figma`/`threejs`/`redux` are never rendered — `figma` isn't even referenced in the commented-out block).
- **Commented-out dead export** in `Works.jsx:114`: `//export default SectionWrapper(Works, "");` left above the real, functionally-identical export on the next line.
- **`ket={index}`** typo (should be `key`) in [`Experience.jsx:62`](src/components/Experience.jsx#L62) — every timeline card renders without a proper React `key`, which `eslint` correctly flags as an error (`react/jsx-key`) and which can cause subtle re-render/reconciliation bugs if the experience list is ever reordered or filtered.
- **`motion.dev`** (should almost certainly be `motion.div`) in [`Hero.jsx:29`](src/components/Hero.jsx#L29) — framer-motion doesn't recognize `dev` as an HTML tag, so this renders a literal non-standard `<dev>` element. It happens to still animate and display because framer-motion's proxy just passes through unknown tags to `React.createElement`, and browsers render unknown elements as inline anonymous boxes by default — so visually it "works," but it's invalid HTML and not what was intended.
- **Content/ethics flag — fabricated testimonials using real people's names and photos:** [`src/constants/index.js:164-189`](src/constants/index.js#L164-L189) attributes invented quotes to Satya Nadella (Microsoft), Elon Musk (Tesla/SpaceX), and Tim Cook (Apple), paired with their actual headshots (`SatyaNadella.jpg`, `ElonMusk.jpg`, `TimCook.jpg` in `src/assets/`). The section heading in [`Feedbacks.jsx:54`](src/components/Feedbacks.jsx#L54) does self-label this as **"Legendary Testimonials (Totally Not Fake 😉)"**, so it reads as an intentional joke rather than an attempt to deceive — but on a professional portfolio a recruiter or hiring manager might see, putting fabricated quotes and real photos of named public figures next to your name carries real reputational/legal risk regardless of the wink-emoji disclaimer, and is worth a deliberate decision (keep as a joke, or replace with real references) rather than carrying it forward by default.
- **No tests exist** in the repository — no test runner configured, no `*.test.*`/`*.spec.*` files.
- I did not find any broken *internal* links. External links (GitHub repo links per project, the `MyGitHub` link in `Works.jsx`) point to real-looking GitHub URLs under `github.com/Orel009/...` — I did not fetch them to verify they resolve (out of scope for a static code audit), so if any of those repos have since been renamed/deleted/made private, that wouldn't show up here.

---

## Summary

### 1. Verdict: renovate or rebuild?

**Renovate, don't rebuild from scratch — but plan for a near-total rewrite of the JSX layer while keeping the toolchain.** Here's the honest reasoning from what I actually found, not the safe-sounding default:

- The **toolchain is sound and current enough to keep**: Vite 5 + React 18 + Tailwind 3 is a completely reasonable, modern stack. It installs cleanly, it builds cleanly, and nothing about the build pipeline itself needs replacing. Throwing this away and starting a new project would mean re-solving problems (Vite config, Tailwind config, the 3D canvas setup) that are already solved and working here.
- **But the component code itself is rough** — not "add features on top" rough, but "the kind of rough that's faster to rewrite than to carefully patch" rough. Every single component file has real bugs (typos in class names that silently break Tailwind, a typo'd `alt` prop, a typo'd `key` prop, a non-existent HTML tag, a phantom npm dependency, an ESLint config that's never actually passed). This isn't a sign of a fundamentally broken codebase — it's the signature of a bootcamp/tutorial-derived template (this looks like it started from a well-known "React Three.js portfolio" tutorial template, based on the file structure, naming conventions like `SectionWrapper`/`StarsCanvas`/`fadeIn`, and the placeholder "Legendary Testimonials" joke) that was customized with real content but never really cleaned up or responsive-audited afterward.
- Given your three goals — new content, real mobile-responsiveness, better visual design — **all three require touching nearly every component file anyway.** Content touches `constants/index.js` plus three separate hardcoded spots; responsiveness fixes require rewriting the Tailwind classes on Hero/Navbar/Contact/Feedbacks/Tech; a visual redesign means new class strings everywhere. There is very little in the current JSX that would survive an honest pass at all three goals untouched.
- **What's worth keeping as-is:** the Vite/Tailwind/PostCSS/ESLint tooling config, the overall Firebase deployment target, the 3D asset files themselves (the glTF models), and the general section structure (Hero → About → Experience → Tech → Works → Feedbacks → Contact is a sensible order to keep). **What's worth rewriting rather than patching:** essentially every component's JSX/className content, the `constants/index.js` data (new content anyway, per your goal #1), and the ad hoc/duplicated color-and-typography values.

So: keep the project skeleton and toolchain, treat the component layer as a from-scratch rewrite informed by the current structure — which is "renovate" in spirit (you're not starting a new repo or re-choosing a stack) but will read like "rebuild" in terms of how much JSX changes.

### 2. Three options

**Option A — In-place renovation (recommended)**
Keep the repo, toolchain, and Firebase target. Rewrite `constants/index.js` with your new CV content, fix the confirmed bugs (typos, phantom `prop-types` dependency, `firebase.json` public-dir mismatch, dead files), rebuild each component's Tailwind classes for real mobile-first responsiveness, and apply a cohesive visual refresh (typography scale, consolidated color tokens) on top of the existing dark-theme aesthetic.
- **Pros:** No new tooling decisions to make; keeps the working 3D/animation effects if you like them; git history (thin as it is) is preserved; fastest path to "live and updated."
- **Cons:** You inherit some tutorial-template DNA (page structure, animation style, the three.js-heavy aesthetic) unless you deliberately diverge from it; still requires touching nearly every file, so it's not meaningfully less work than a rebuild — the savings are mostly in *decisions*, not typing.
- **Rough effort:** content swap (~1-2 hrs once you supply the CV data) + responsive rewrite of Navbar/Hero/Contact/Feedbacks/Tech (~1-2 days) + visual design pass across all sections (~2-4 days depending on how different you want it to look) + cleanup of confirmed bugs/dead files (~1-2 hrs).

**Option B — Fresh rebuild, new stack**
Start a new project (e.g. Next.js or a fresh Vite app), design mobile-first from day one, port over only the content and assets you want to keep (trim the 3D models if you decide they're not worth the mobile-performance cost).
- **Pros:** Clean slate — no inherited typos/dead code/phantom deps; freedom to reconsider whether the heavy three.js aesthetic is even the right call for a fast, mobile-friendly site; chance to add things not present today (CV download, OG tags, proper meta/SEO, tests).
- **Cons:** Most expensive option; re-solves already-solved problems (3D canvas setup, Tailwind config, deploy config); higher risk of new bugs since nothing is battle-tested yet; loses the (admittedly thin) existing git history.
- **Rough effort:** 1-2 weeks for a comparable feature set, more if you also redo the 3D scenes.

**Option C — Minimal patch, ship fast, defer the redesign**
Fix only what's broken (typos, phantom dependency, `firebase.json`, dead files) and swap in new content via `constants/index.js` + the three hardcoded spots, without a visual or deep responsive overhaul. Get the CV update live quickly, then tackle design/responsiveness as a second, separate project later.
- **Pros:** Fastest way to get accurate, current content live; lowest risk of introducing new bugs; doesn't block on design decisions.
- **Cons:** Explicitly does not address goals #2 (mobile-responsive) or #3 (visual design) — you'd be back here again soon for a second pass; the Contact-section mobile bug and other responsive hazards would remain live.
- **Rough effort:** 2-4 hours.

Given you've stated all three goals together, **Option A** is the one I'd actually plan around — Option C under-delivers on two of your three stated goals, and Option B's extra cost buys you a clean slate you don't strictly need given the toolchain is fine.

### 3. Responsive issues, by severity

- **High:** [`Contact.jsx:62`](src/components/Contact.jsx#L62) — `flex-col-recerse` typo (should be `flex-col-reverse`) breaks the intended mobile stacking of the contact form and 3D earth canvas; below `xl:` they sit side-by-side and squash instead of stacking.
- **Medium:** No breakpoint tuning below 450px (the custom `xs` breakpoint) — every phone narrower than that shares one layout with no intermediate step.
- **Medium:** Full WebGL 3D scenes (desktop PC, earth, tech-icon balls) render at full fidelity on mobile with only cosmetic scale/position adjustment (`Computers.jsx`'s `isMobile` check) — real performance/battery/jank risk on low-end phones, and its own 500px breakpoint doesn't match Tailwind's 450px/640px, so "mobile" is defined three inconsistent ways across the codebase.
- **Low:** [`Feedbacks.jsx:18`](src/components/Feedbacks.jsx#L18) — `w-fill` typo (should be `w-full`) on testimonial cards below the `xs` breakpoint; doesn't break layout (flex-wrap absorbs it) but isn't the intended full-width mobile card.
- **Low:** Non-fluid, hardcoded pixel font sizes throughout (`styles.js` and inline classes) — works but doesn't scale smoothly between breakpoints and is tedious to maintain.
- **Not a bug, confirmed clean:** no button or link disappears entirely on mobile with no equivalent — the nav is the only conditionally-hidden interactive element, and it correctly reappears in the hamburger menu.

### 4. Content-edit map (exactly what to touch once you send new CV content)

| What | File : Lines |
|---|---|
| Name / brand text | [`src/components/Navbar.jsx:26-28`](src/components/Navbar.jsx#L26-L28) |
| Hero headline + tagline | [`src/components/Hero.jsx:16-22`](src/components/Hero.jsx#L16-L22) |
| Bio / "Overview" paragraph | [`src/components/About.jsx:46-57`](src/components/About.jsx#L46-L57) |
| "Services" cards | [`src/constants/index.js:45-62`](src/constants/index.js#L45-L62) |
| Technologies/skills list | [`src/constants/index.js:64-129`](src/constants/index.js#L64-L129) |
| Work experience entries | [`src/constants/index.js:131-162`](src/constants/index.js#L131-L162) |
| Testimonials (decide: keep the joke, or replace) | [`src/constants/index.js:164-189`](src/constants/index.js#L164-L189) + [`src/components/Feedbacks.jsx:54`](src/components/Feedbacks.jsx#L54) (heading text) |
| Projects list | [`src/constants/index.js:191-335`](src/constants/index.js#L191-L335) |
| Contact form target name/email + EmailJS keys | [`src/components/Contact.jsx:30-39`](src/components/Contact.jsx#L30-L39) |
| Page `<title>` | [`index.html:8`](index.html#L8) |
| Images for new projects/companies | add files to `src/assets/`, import + export in [`src/assets/index.js`](src/assets/index.js), reference from `constants/index.js` |

### 5. Open questions for you before implementation starts

1. **Deployment:** How do you actually deploy today — is there a manual step (copying `dist/` into `public/`, or editing `firebase.json`) that reconciles the mismatch I found, or is the live site currently not reflecting the latest build? I don't want to "fix" `firebase.json` in a way that breaks a process you already have in place.
2. **Testimonials:** Keep the joke fake-testimonials section (with real photos of Musk/Cook/Nadella and invented quotes), replace it with real references/recommendations, or drop the section entirely?
3. **3D scenes:** Given the mobile-performance cost of the full WebGL scenes (desktop PC, earth, per-icon balls) on phones, do you want to keep all three, simplify/replace some with lighter alternatives on mobile, or keep them as-is and accept the tradeoff?
4. **CV download:** There's no CV/resume file or download link anywhere today — do you want one added as part of this upgrade?
5. **Hebrew/RTL:** You mentioned Hebrew content in a stray file (`הרחבות.txt`) — is bilingual (English/Hebrew) or RTL support actually in scope for this upgrade, or is English-only fine?
6. **Router usage:** `react-router-dom` is installed and wraps the app in a `<BrowserRouter>`, but the site has exactly one route/page (everything is anchor-scroll navigation within a single page). Keep it (e.g. in case you want a future `/projects/:slug` detail page or a separate blog route) or drop the dependency since nothing currently uses actual routing?
7. **Visual direction:** Do you have a reference site/aesthetic in mind for the "improve the visual design" goal, or should that be proposed fresh based on your updated CV content and current design trends?
