# Renovation Report

Branch: `master`, fully merged and pushed to origin through `583ffe1`. The OpenAI key referenced
below has since been confirmed revoked and both Resumes MVP repos are private pending the
clean-history rewrite — that work is tracked separately, not in this repo. Base audit:
`PORTFOLIO_AUDIT.md`.

```
583ffe1 fix: shrink project-card image placeholders on mobile
df465ee docs: update renovation report — Resumes MVP card + repo cleanup
7d294d1 feat: add Resumes MVP project card, support multi-repo source links
f931b08 docs: update renovation report with follow-up round
2fd0639 feat: wire real CV/LinkedIn, add AI role, restore Earth + Stars with guards
84faa48 docs: add renovation report
0d86101 docs: meta tags, favicon, semantic HTML, and final cleanup
2a5735d style: consolidate design tokens, fix contrast, restrained motion
a3cde99 feat: rewrite content and consolidate it into src/constants
a96751a feat: responsive rebuild from 320px to ultrawide
c3607bb fix: repair broken bugs, remove testimonials + non-Hero 3D scenes
0595cb6 docs: add portfolio audit
```

Every phase was gated on `npm run lint` (zero warnings, `--max-warnings 0`) and `npm run build` both passing before moving on — confirmed at every commit. Phases 1–5 below are the original renovation; the "Follow-up round" section covers a second pass you asked for afterward (real CV/LinkedIn, an added role card, and restoring Earth + Stars).

**On verification method:** I don't have a GUI browser attached to this session, but I did have a working Chrome install and Node, so I built a small, temporary test harness using `puppeteer-core` (installed in an isolated scratch folder, **not** added to this project's `package.json`/lock file) to drive real Chrome headlessly. All the numbers below — overflow, touch-target sizes, focus rings, hamburger behavior, console errors — are measured from that real browser, not simulated or eyeballed. Where I computed something instead (contrast ratios), I ran the actual WCAG relative-luminance formula rather than guessing. I'll say explicitly anywhere I'm estimating rather than measuring.

---

## Phase 1 — Bug fixes + structural removals

Fixed every bug the audit found, plus more turned up by sweeping the whole codebase for the same bug classes (typo'd Tailwind/CSS class references that fail silently):

- `flex-col-recerse`, `w-fill`, `list-non`, `text secondary` (missing hyphen) — all typo'd, all silently did nothing.
- A new one the audit missed: `yellow-text-gradient` was referenced by two project tags but never defined anywhere in CSS — added it.
- Another: `canvas-load` vs `canvas-loader` in Loader.jsx — the loading spinner's CSS animation never actually applied.
- Another: `frameLoop="demand"` (capital L) on the Hero canvas — the wrong casing meant the "render on demand" perf optimization silently never engaged; fixed to `frameloop`.
- `motion.dev` → `motion.div`, `ket=` → `key=`, `experience.comapany_name` → `company_name`.
- react-tilt's `options` prop was set on a plain `<div>` in About.jsx (no-op) and misspelled `option` in Works.jsx — the tilt effect was never actually configured in either place.
- Added the phantom `prop-types` dependency to `package.json` (was resolving only by luck via transitive deps).
- Fixed `firebase.json`: `public` pointed at the source `public/` folder instead of Vite's `dist/` build output — a plain `npm run build && firebase deploy` would have published the wrong thing.
- Removed unused `firebase` and `maath` dependencies.
- Fixed `.eslintrc.cjs`: added a `node` env override for `*.config.js` files (was flagging `module` as undefined) and a `react/no-unknown-property` ignore list for react-three-fiber's element properties, instead of disable-comment suppression. `npm run lint` had never passed on this codebase before this branch — it passes clean now and at every commit since.

Per your decisions:
- Removed the testimonials section entirely — component, constants data, and the three real-people photos.
- Removed the Earth and Ball/Stars WebGL scenes and the planet 3D model. Kept only the Hero scene.
- Deleted `public/index.html`, the leftover default Firebase Hosting welcome page.
- Gave Projects more vertical room in place of the removed testimonials.

## Phase 2 — Responsive rebuild

- Added an `xxs: 380px` breakpoint below the existing `xs: 450px`.
- Replaced the stacked-breakpoint pixel font sizes with a fluid `clamp()`-based type scale and fluid horizontal/vertical section spacing (tokens below).
- Global `img { max-width: 100%; height: auto }` and `overflow-x: hidden` on `html/body` as a defensive backstop.
- Navbar hamburger: was an `onClick` on a plain `<img>` (unreachable by keyboard) — now a real `<button>` with `aria-label`/`aria-expanded`, 44×44 touch target.
- Works.jsx GitHub overlay: was a clickable `<div>` — now a real `<button>`, 44×44.
- Hero scroll-hint: padded its hit area to 44px+ without changing its visual size.
- Hero 3D scene degrades on small screens: `devicePixelRatio` capped to 1 below the mobile threshold, and WebGL is never mounted at all below the `xs` (450px) breakpoint — a lightweight inline SVG fallback renders instead.
- `prefers-reduced-motion`: framer-motion wrapped in `<MotionConfig reducedMotion="user">`, plus a CSS-level `@media (prefers-reduced-motion: reduce)` rule for anything outside framer-motion's control.

## Phase 3 — Content rewrite

- Consolidated content that was scattered across four components (name in Navbar, tagline in Hero, bio in About, contact email in Contact) into `src/constants/index.js` as `personalInfo`, `heroTagline`, `aboutText`.
- Replaced all content per your spec: About, Experience (3 roles with real bullet points instead of one run-on paragraph each), a new Education section (didn't exist before), Projects (2 real projects replacing 6 tutorial placeholders), Skills (5 grouped categories replacing a flat 11-icon wall).
- Renamed the nav's "Work" → "Experience" and added a direct "Projects" link. **Correction to my own audit:** I'd flagged in `PORTFOLIO_AUDIT.md` that the old nav's "Work" link and the Projects section might be intentionally unlinked; once I was actually in the code building out Projects as "the section that matters most," leaving it with no direct nav anchor clearly worked against that goal, so I fixed the mapping. Nav is now About / Experience / Projects / Contact.
- `ProjectCard`/new `FeaturedProjectCard`: `image` and `source_code_link` are now optional. No image renders an on-brand placeholder instead of a broken `<img>`; no link renders no overlay instead of a button that opens `undefined`. Financial Center gets the featured treatment (bigger card, bulleted architecture breakdown); API Discovery renders as a standard card, proprietary — no image, no link, by design.
- Project tags changed from a per-tag `{name, color}` object to a plain string array with color cycled by index — removes the whole class of bug that produced the `yellow-text-gradient` miss above.
- Added `public/Orel-Benbenista-CV.pdf` (placeholder, see checklist) and wired "Download CV" into Hero (primary) and Contact (secondary).
- Added `.gitattributes` marking pdf/png/jpg/gltf/bin/svg as binary — the repo has `core.autocrlf=true` with nothing stopping the (all-ASCII, byte-offset-sensitive) placeholder PDF's xref table from being corrupted by LF→CRLF conversion on checkout.
- Deleted 6 now-unreferenced project screenshots and 2 unused tech icons (redux, threejs).

### The hero tagline I wrote

You asked me to write this myself, under ~20 words, from: full-stack engineer, deterministic logic decides / AI explains, bank-wide API platform at Matrix, and a live AI investment-research platform of your own. Landed on splitting it into three visual steps rather than one dense sentence:

> **Orel** *(name, h1)*
> **Full Stack Engineer** *(role, accent color, its own line)*
> "Deterministic logic decides, AI explains. Building a bank-wide API platform, and my own live AI investment-research platform." *(tagline, 19 words)*

Say if you want it reworded — it's a first draft, not something I'd consider final without your sign-off.

## Phase 4 — Visual refresh

**Token set** (all in `tailwind.config.js`):

| Token | Value | Where it came from |
|---|---|---|
| `accent` | `#915eff` | Already the site's one recurring brand color, previously scattered as raw hex in 4+ places |
| `accent-hover` / `accent-active` / `accent-pressed` | `#7c4bdb` / `#6c3fc7` / `#5c33ad` | Darker steps of `accent` — needed once I found `accent` itself fails contrast as a button background (see below) |
| `accent-soft` | `#dfd9ff` | Was hardcoded in styles.js for the hero subtext |
| `fluid-h1` / `fluid-h2` / `fluid-lead` / `fluid-body` / `fluid-label` | `clamp()` expressions, ranges documented in the config | Replaced the old 3–4-step pixel-breakpoint font sizes from Phase 2 |
| `gutter` / `section-y` | `clamp()` expressions | Replaced the old 2-step horizontal/vertical section padding |
| `glow` (shadow) | soft accent-colored glow | New, for the primary CTA |

Radii weren't tokenized separately — the codebase already uses Tailwind's default radius scale (`rounded-xl/2xl/3xl/full`) consistently with no drift, so there was nothing to consolidate there.

**Reasoning:** one shared fluid type scale + one shared fluid spacing rhythm, both introduced in Phase 2 and now backed by real named tokens instead of inline `clamp()` strings, so the "one type scale, one spacing rhythm" requirement is structural (every section goes through the same `SectionWrapper` → same `styles.padding`), not just visually consistent by coincidence.

**Contrast — computed, not eyeballed** (WCAG relative-luminance formula, run against every color pair actually used in the site):

| Pair | Ratio | AA (normal text, ≥4.5:1) |
|---|---|---|
| `text-secondary` on `bg-primary`/`bg-tertiary`/`bg-black-100` | 7.8–8.5:1 | pass |
| `text-white` on `bg-primary`/`bg-tertiary` | 18–20:1 | pass |
| `text-accent` on `bg-primary` | 4.99:1 | pass |
| `text-accent-soft` on `bg-primary` | 14.7:1 | pass |
| `text-white-100` on `bg-black-100`/`bg-tertiary` | 16–17:1 | pass |
| **White text on raw `accent` (#915eff) as a button background** | **4.00:1** | **fail** |
| White text on `accent-hover` / `accent-active` / `accent-pressed` | 5.40 / 6.62 / 8.29:1 | pass |
| All 5 tag-gradient stops on their card backgrounds | 4.70–11.5:1 | pass |

Found one real failure: the CV button's white text on raw `accent` was 4.00:1, under the 4.5:1 threshold for body-sized text. Fixed by moving button backgrounds to the darker `accent-hover`/`-active`/`-pressed` ladder and reserving raw `accent` for text/decorative use, where it already passes. Verified in the real browser that the CV button's *computed* background is `rgb(124, 75, 219)` (`#7c4bdb`, the fixed value) — not just that the source code says so.

**Focus-visible:** added globally (`a`, `button`, `input`, `textarea`) as a ring in the accent color. Verified with real keyboard-driven `Tab` presses in the browser — the first two tab stops both showed the actual `box-shadow` ring rendering (`rgb(5, 8, 22) 0 0 0 2px, rgb(145, 94, 255) 0 0 0 4px`), not just that the CSS rule exists.

**Motion:** removed the Hero scroll-indicator's infinite bounce loop — it was the only looping decorative animation anywhere in the codebase (confirmed by grepping for `Infinity`/`repeat:`/`autoRotate` after all other phases landed — zero matches remain).

**Hierarchy:** restructured the Hero so name → role → "what I build" are three distinct visual steps (h1, then a dedicated accent-colored role line, then the tagline) instead of role being buried as the tagline's first clause. Projects' priority is carried by its featured-card treatment and direct nav link from Phase 3.

## Phase 5 — Meta and quality

- Fixed the `<title>` typo ("Protfolio"), added meta description, Open Graph, and Twitter card tags.
- **Generated a real OG image** rather than just flagging that one was needed — `public/og-image.png`, 1200×630, rendered from a small on-brand HTML card through headless Chrome (see checklist for the one thing to confirm about it).
- Replaced the favicon *and* the identical Navbar brand-mark SVG (they were the same file) — both were an auto-generated orange bracket-"0" graphic unrelated to the name and clashing with the new violet palette. Now a simple "OB" monogram in the accent color.
- Fixed heading hierarchy: Contact's section heading was a stray `<h3>` while every other section uses `<h2>` — now consistent. Exactly one `<h1>` on the page (Hero).
- Added a `<main>` landmark (previously the only landmark on the whole page was `<nav>`).
- Fixed two real alt-text bugs: About's four service-card icons all shared the literal hardcoded `alt="web-development"` regardless of which service they were for (so a screen reader would announce "web-development" for the C# Developer icon too); the Navbar logo had generic `alt="logo"`. Both sit immediately next to visible text conveying the same thing, so both are now `alt=""` (correct practice for redundant decorative images) rather than repeating the text and causing double-announcement.
- Rewrote `README.md` (was unedited Vite template boilerplate).
- Confirmed no unused dependencies remain (checked every `package.json` entry against actual imports) and no further unused assets beyond the three already flagged below as deliberately kept.

---

## Follow-up round

### Assets you supplied
- The real CV is now at `public/Orel-Benbenista-CV.pdf`. No code change was needed — there was never conditional "placeholder" logic in the app, just a generated stand-in file linked exactly like the real one is now.
- Added your LinkedIn URL to `personalInfo.linkedinUrl` and gave it (and GitHub) a real home: a row of icon links in the Contact section. Neither had a dedicated spot before — GitHub only existed as an inline "MyGitHub" text link inside a paragraph.

### AI Integration Engineer
Added as the 5th tilt card in the About section, using your preferred phrasing. On register: the existing four already mix stack-layer titles (Web/Backend/Frontend Developer) with one specialization title (C# Developer), so a specialization-style addition doesn't clash with the pattern — I didn't see a clearly better alternative, so I didn't second-guess your preference. No icon asset exists for it (checked the full `src/assets` tree); rather than reuse an unrelated icon, `ServiceCard` now renders a small "AI" badge placeholder when a service has no `icon`. Verified in a real browser: all 5 cards, including this one, render with no overflow or reflow at 320px — the longest of the five titles.

### Restoring Earth and Stars
Recovered both from git history (`git show c3607bb~1:...`, the commit right before Phase 1 deleted them) and adapted rather than reverted:

- **Lazy-loaded.** Both go through `React.lazy` so their code never enters the initial bundle — confirmed in the production build: `Earth-*.js` is 1.54kB, `Stars-*.js` is 7.94kB, both separate chunks; the main bundle grew by under 1kB.
- **Visibility-gated.** A shared `useCanvasGating` hook (IntersectionObserver + `visibilitychange` + `matchMedia`) mounts each scene the first time it nears the viewport (not on initial page load — confirmed: canvas count is 1, Hero only, right after load; becomes 3 only once you scroll near Contact), then *pauses* the render loop — doesn't unmount — when scrolled away or the tab is hidden.
- **Cheaper below `xs` (450px):** DPR capped to 1 on both. Earth's `autoRotate` is disabled — drag-to-rotate stays available at every size, since it's bounded by real interaction events, not a continuous loop. Stars' count drops 5000→1500 and its frame rate is throttled to a real, measured **~19 draws/sec** (down from **~60/sec** on desktop, both under the same 6x CPU throttle — see the numbers below).
- **prefers-reduced-motion:** Earth's `autoRotate` and Stars' per-frame rotation both stop everywhere, not just on small screens. Verified with real `matchMedia` emulation plus a **byte-identical canvas snapshot 1.5 seconds apart** — not just "the code branches on this flag."
- **Never blocks scroll.** The starfield div is `pointer-events-none`. Verified explicitly, as asked: a wheel-scroll dispatched at a point directly over the stars-covered region (both where it's the only thing visually there, and where content sits in front of it) moves the page every time (`document.elementFromPoint` at that coordinate resolves to the real page content, never the canvas).
- **No-WebGL fallback**, on all three scenes, not just the two you named. I added `isWebGLAvailable()` and a `CanvasErrorBoundary` to Earth and Stars as asked — but testing the "block WebGL" path first crashed the *entire page* white, because **Hero's Computers scene had no such guard at all**. That's a pre-existing gap the audit never surfaced (nothing in the original 5 phases exercised a no-WebGL device). I extended the same fix to Computers.jsx so "no WebGL → clean fallback" is actually true for the page, not just for Earth/Stars in isolation.

### Two real bugs the restoration surfaced
1. **`maath`'s `inSphere` writes 3 floats per point, stepping by 3** — the original code sized its buffer directly as `new Float32Array(5000)` (not divisible by 3), so the last point's write ran one index past the buffer's end. TypedArrays drop out-of-bounds writes silently rather than throwing, so this was invisible — until fixing the `radius: 1.2` typo (`redius` in the original, a no-op) let that option actually take effect for the first time, which surfaced it as a `computeBoundingSphere(): NaN` console warning. Fixed by sizing the buffer as `starCount * 3`.
2. **Stars' `Canvas` was missing `gl={{ preserveDrawingBuffer: true }}`** (Earth already had it). Without it, the WebGL drawing buffer clears before anything can read it back — which is exactly why my first render/draw-call instrumentation showed **zero** activity even though every other signal (React state, `useFrame` firing, `invalidate()` being called) looked correct. I spent real time chasing this as if it were a logic bug in my gating code before isolating it down to this one missing renderer option — confirmed by swapping in a trivial test mesh, which also failed to render until this flag was added. I want to be upfront that this cost significant back-and-forth before landing on the actual cause.

---

## Second follow-up round — Resumes MVP card + two-repo cleanup

### What I reviewed
Cloned and read three of your other repos (deleted the temp clones afterward, per your instruction): `ResumesMVP` (frontend), `ResumesMVPServer` (backend), and `Learning-Platform`. Full stack/scale/README findings are in the chat transcript for that request, not duplicated here — the short version:

- **Resumes MVP**: a genuinely substantial two-sided career platform (~46k LOC combined, 286 files) — React 18/TS frontend, .NET 10 backend, PostgreSQL, JWT auth, an OpenAI-backed resume-polishing/job-fit pipeline, and a RAG layer (resume embeddings + semantic "smart search") for company-side candidate search. Added to the portfolio as a second featured card.
- **Learning-Platform**: a modest, complete Angular/.NET course-CRUD app (~4.5k LOC). Per your call, **left out** — it's the same project already cut from this portfolio during the original renovation for reading as tutorial-scale next to your current work, and targeting React/.NET roles specifically means the Angular skill it would back up isn't worth widening that gap for.
- **Found a live OpenAI API key committed in `ResumesMVPServer/appsettings.json`**, in a public repo. Flagged immediately, before doing anything else with the finding.

### Portfolio: Resumes MVP card
Added as the second **featured** project (after Financial Center), exactly as proposed and approved. `Works.jsx` changed to support a project spanning multiple repos:

- `ProjectCard`/`FeaturedProjectCard`'s `source_code_link` (single string) became `sourceLinks` (an array of `{ label, url }`), rendered as one icon button per entry (each with its own `aria-label`, e.g. "Open Frontend source for Resumes MVP on GitHub"). Financial Center and API Discovery were migrated to the same field (`sourceLinks: null`) so there's only one code path, not two.
- Verified in a real browser: the 0-link case (unchanged from before) and the 2-link case (new) both render correctly, with no broken images or console errors either way.
- **The two repos are not linked live yet.** `sourceLinksVerified: false` on the Resumes MVP data entry gates rendering independently of whether the link data is present — I temporarily flipped it to `true` to verify the 2-button render worked, confirmed it, then flipped it back to `false` before committing. Confirmed off again right before the commit. **Do not flip this to `true` until you've confirmed back that (a) the OpenAI key is revoked and (b) both repos have been re-uploaded with clean history** (see below) — at that point, changing that one field in `src/constants/index.js` and redeploying is the entire remaining step.

### Repo cleanup — ResumesMVP & ResumesMVPServer (local only, not pushed)
Cloned fresh working copies to `C:\Users\Orell\Desktop\ResumesMVP` and `...\ResumesMVPServer` (kept, not deleted — these are meant to become your working copies going forward). Changes are committed locally in each; **neither was pushed.**

**ResumesMVP (frontend)** — one commit, `chore: add .gitignore, untrack node_modules/dist, write real README`:
- Added a `.gitignore` (there wasn't one at all) covering `node_modules/`, `dist/`, env files, editor/OS cruft.
- Untracked the 14,109 already-committed `node_modules` files and `dist/` via `git rm --cached` (they stay on disk, just no longer tracked).
- Replaced the one-line README with real docs: what it is, the stack, a feature list, and step-by-step local setup — pointing at the backend repo.
- Verified `npm run build` still succeeds after these changes.

**ResumesMVPServer (backend)** — one commit, `chore: repo hygiene pass — gitignore, secrets, README, DI fix`:
- Expanded `.gitignore` to actually cover `bin/`, `obj/`, `out-temp/`, `.vs/`, `*.user` — a `.gitignore` already existed but only listed `bin/`/`obj/`/`.vs/`, and none of the three were actually excluded because they'd already been committed before the `.gitignore` was added (git doesn't retroactively untrack files). Untracked all 356+ of them via `git rm --cached`.
- **Removed the live OpenAI key from `appsettings.json`** (now an empty placeholder) and added a `UserSecretsId` to the `.csproj` so the real key loads from .NET user-secrets in Development instead — ASP.NET Core's default host builder wires this up automatically once the ID is present, no code change needed beyond that. Documented the `dotnet user-secrets set` setup in the new README, along with the environment-variable equivalent for a real deployment.
- Fixed `IJobApplicationService` being registered twice in `Program.cs`.
- Replaced the one-line README with real docs, pointing at the frontend repo.
- Verified `dotnet build` succeeds with 0 errors (2 pre-existing NuGet advisory warnings on a transitive `Microsoft.OpenApi` package — unrelated to this pass, not something I touched).
- **Deliberately left alone** (out of scope for what you asked, noted in the new README instead): the CORS policy in `Program.cs` still targets a placeholder `"https://yourdomain.com"`, and `Jwt:Secret`/the Postgres connection string in `appsettings.json` are dev-only placeholder values (not real secrets, so not urgent) that should get the same user-secrets treatment before any real deployment.

### Path to clean history — for you to run, not me

Both repos currently have exactly one original commit, now followed by my one cleanup commit each — so the leaked key is still sitting in that first commit's history even though the current `appsettings.json` no longer has it. Since there's no meaningful history to preserve here, the cleanest fix is a full fresh start rather than surgically editing history. Per your instruction, here are the steps — I have not run any of these:

For **each** repo (from inside `C:\Users\Orell\Desktop\ResumesMVP` and separately `...\ResumesMVPServer`):

1. Confirm you're happy with the current state first: `git log --stat -1` (shows my cleanup commit) and `git status` (should be clean).
2. Delete the entire git history: `rm -rf .git` (or `Remove-Item -Recurse -Force .git` in PowerShell).
3. Start over: `git init` then `git branch -m main` (both repos' default branch on GitHub is already `main`).
4. Re-stage everything — the new `.gitignore` will correctly exclude `node_modules`/`dist`/`bin`/`obj`/`.vs` this time: `git add -A`, then `git status` as a sanity check that none of those directories show up.
5. One clean commit: `git commit -m "Initial commit"`.
6. Point at the existing GitHub remote: `git remote add origin https://github.com/Orel009/ResumesMVP.git` (swap the URL for the server repo).
7. Force-push, replacing the remote's history entirely: `git push -f origin main`.

**Two things to know before you do this:**
- This is irreversible on your end once pushed — the old commits are gone from the remote. That's the intent.
- **Force-pushing a clean history does not itself undo the exposure.** GitHub actively scans public repos for recognizable API key patterns (OpenAI's `sk-` prefix is one it watches for) and may have already flagged or cached it, and any bot that scraped the repo in the time it was public already has the key regardless of what you do to history afterward. Revoking the key at platform level is the actual fix; the history rewrite is about hygiene and presentability going forward, not about undoing the leak. Worth checking your OpenAI dashboard for any usage you don't recognize, not just confirming the key shows as revoked.

---

## Third follow-up round — mobile spacing bug: Skills → Contact

You reported a large empty-looking region on mobile between the end of Skills and the start of Contact, with two working hypotheses to check: leftover spacing from a removed section, or the Earth canvas reserving fixed height it didn't need on phones.

**Diagnosed before changing anything, as asked — both hypotheses were wrong:**

- **Not a spacing bug at all.** Measured the literal gap (`nextSection.top − prevSection.bottom`) between every one of the 6 adjacent-section boundaries at 320/375/414px: Hero→About, About→Experience, Experience→Education, Education→Skills, **Skills→Projects**, and **Projects→Contact** were all exactly **0px**, at every width. Every section's own `py-section-y` padding already abuts the next section with no unowned space anywhere — there was never a stray margin or leftover wrapper to remove.
- **Not the Earth canvas.** Screenshotted the settled Contact section on mobile: Earth renders at full width, stacks correctly above the form, no oversized reserved space. (An early rapid-scroll test pass briefly *looked* like a broken, overlapping Contact layout — that turned out to be a timing artifact in my own test script, jumping between scroll positions faster than a 1-second framer-motion entrance transition could finish, not a real bug. Re-verified with a proper settle wait and it's correct: `formWrapper`/`earthWrapper` both `x:20, w:335`, sequential, zero overlap.)
- **What it actually was:** the Projects section sits between Skills and Contact — real content, not empty space by definition — but its three project cards (none has a real screenshot yet) each render a fixed-height `ImagePlaceholder`: 220px (featured cards) or 230px (grid card), full viewport width on mobile. On desktop that box sits *beside* the card's text (`lg:flex-row`), costing no extra scroll length; on mobile the card stacks (`flex-col`), so the same low-information block sits *above* all the dense text, three times in a row. Confirmed visually (screenshot at the transition into Projects) — a large flat-color box with only a small centered project name reads as "empty" even though it's technically inside a content section. This is exactly why it was mobile-specific: the placeholder's cost is only paid in scroll length once it can't share horizontal space with content.

**Fix — the cause, not the gap itself:** the placeholder-only image slot (real images are completely untouched, at every breakpoint) is now shorter below the breakpoint where each card's own layout stacks: `h-28` (112px) below `lg` for `FeaturedProjectCard`, `h-24` (96px) below `sm` for the grid `ProjectCard` — reusing each component's own existing stacking breakpoint rather than inventing a new one or subtracting a compensating negative margin.

**Verified in a real browser:**

| Width | All 6 boundary gaps | Overflow | Overlap | Total page height |
|---|---|---|---|---|
| 320px | all 0px (unchanged) | none | none | 13,847px → **13,497px** |
| 375px | all 0px (unchanged) | none | none | 12,330px → **11,980px** |
| 414px | all 0px (unchanged) | none | none | 11,657px → **11,307px** |
| 768px | all 0px (unchanged) | none | none | 9,372px (only the 2 featured placeholders shrink here — the grid card is already past its `sm` breakpoint, back to full 230px) |
| 1440px | all 0px (unchanged) | none | none | 9,123px (past every card's stacking breakpoint — fully unaffected, matches pre-fix desktop) |

The 350px reduction at 320/375/414px is not a rounded estimate — it's exactly 2×108px (two featured cards, 220px→112px) + 1×134px (one grid card, 230px→96px), matching the arithmetic precisely.

**Earth confirmed still interactive on desktop**, not just unaffected on paper: screenshotted its canvas before and after simulating a mouse-drag rotation at 1440px — the model visibly rotated between the two captures. 3 canvases mount at Contact (Hero + Earth + Stars), zero console errors, matching pre-fix behavior exactly (this fix only touches `Works.jsx`, nothing in `Contact.jsx`/`Earth.jsx`/`Stars.jsx`).

---

## Responsive verification — real numbers

Measured via headless Chrome against the production build (`npm run build` + `vite preview`), after the follow-up round landed — this is the final, authoritative pass:

| Width | scrollWidth vs clientWidth | Nav state | Hero 3D (on load) | Console errors |
|---|---|---|---|---|
| 320px | equal (no overflow) | hamburger | SVG fallback, 0 canvases | 0 |
| 375px | equal | hamburger | SVG fallback, 0 canvases | 0 |
| 414px | equal | hamburger | SVG fallback, 0 canvases | 0 |
| 768px | equal | desktop links | live canvas, 1 | 0 |
| 1024px | equal | desktop links | live canvas, 1 | 0 |
| 1440px | equal | desktop links | live canvas, 1 | 0 |
| 1920px | equal | desktop links | live canvas, 1 | 0 |

### Projects section, after adding the Resumes MVP card — measured, not calculated

You asked for this re-measured with real numbers rather than the reasoning I gave in the proposal. Measured with dev tools (headless Chrome, `document.documentElement.scrollWidth`/`clientWidth`, and `getBoundingClientRect()` on each project card) at exactly the three widths you asked about:

| Width | Overflow | Financial Center card | Resumes MVP card | API Discovery card | Overlap |
|---|---|---|---|---|---|
| 320px | none (320=320) | x:20 w:280 | x:20 w:280 | x:20 w:280 | none |
| 768px | none (768=768) | x:31 w:707 | x:31 w:707 | x:31 w:360 | none |
| 1440px | none (1440=1440) | x:138 w:1165 | x:138 w:1165 | x:138 w:360 | none |

With Learning-Platform left out, there's only one standard-grid card (API Discovery) same as before this round — the two featured cards stack vertically regardless of width, which is why they don't interact with the grid-wrapping question at all. No overflow, no overlap, at any of the three widths. (My proposal's calculated 768px note — that a *second* standard card would wrap to one-per-row there — never got exercised, since Learning-Platform isn't in the data; noting that the reasoning wasn't wrong, just not applicable to what actually shipped.)

Also re-verified at all 7 widths with the 5-card services grid and the Contact social-links row: no overflow anywhere, "AI Integration Engineer" (the longest title) doesn't wrap or reflow its card, both GitHub and LinkedIn icon links measure 44×44 at every width.

Hero heading font size across the same widths (confirms the fluid scale is genuinely continuous, not stepped): 32px → 33.35px → 34.988px → 49.856px → 60.608px → 78.08px → 80px (clamp max, matches the configured 5rem cap).

Touch targets measured directly: hamburger button 44×44 at every narrow width; Contact submit button 105×48 at every width; GitHub/LinkedIn social icons 44×44 at every width. (The project-card GitHub overlay button's 44×44 sizing was verified in Phase 2 against the then-current 6-project content; today's content has zero linked projects — Financial Center's link is pending your decision, API Discovery has none by design — so that exact button isn't exercised by today's data, though its sizing code hasn't changed.)

### Earth/Stars-specific numbers (production build, 6x CPU throttle)

| Scenario | Real WebGL draw calls/sec |
|---|---|
| Tiny viewport (<450px), Stars visible | ~19/s (target cap: 24/s; CPU throttling itself slows the JS timer slightly) |
| Desktop viewport, Stars visible | ~60/s (uncapped "always" mode, matches display refresh — by design, no throttling above the `xs` breakpoint) |
| Either viewport, Contact scrolled out of view | 0/s (fully paused) |

This measures actual `WebGLRenderingContext.drawArrays`/`drawElements` calls (patched at the prototype level before any page script runs), not the page's general animation-frame cadence, which would not have isolated the specific throttle being tested.

Bundle size impact of restoring both scenes (production build, comparing to the Phase-5 build before this follow-up): main bundle 1,214.84kB → 1,219.00kB gzip (**+~4kB**, mostly the two new hooks/utils, since three.js itself was already loaded for Hero). Earth and Stars' own code — 1.54kB and 7.94kB respectively — ships as separate lazy chunks fetched only when the user scrolls near Contact, not in that initial number.

## Interactive-element parity audit

Grepped the entire final codebase for every conditional-hide pattern (`hidden`, breakpoint-prefixed `hidden`/`block`, `aria-hidden`). Result: the **only** breakpoint-driven show/hide pair anywhere in the site is the Navbar's desktop-link-list ↔ hamburger-menu pair, and it has full functional parity — verified with real clicks, not just reading the JSX:

- Closed by default.
- Clicking the hamburger opens it: `aria-expanded` flips to `"true"`, all 4 links render (About/Experience/Projects/Contact), each a 112×48 non-overlapping tap target.
- Clicking a link inside the open menu closes it (`aria-expanded` back to `"false"`) **and** navigates (`window.location.hash` changed, page actually scrolled).

Everything else that gets conditionally hidden is decorative (a `<br>`, a truncated surname span, an `aria-hidden` SVG) — nothing functional disappears at any breakpoint with no equivalent path.

The restored starfield sits behind the entire Contact section on every breakpoint, `pointer-events-none`, and was explicitly tested (not just declared) to never intercept scroll — see the Follow-up round section above.

---

## Deliberately left undone, and why

- **Legacy one-off `text-[Npx]`/`w-[Npx]` arbitrary values** inside card-level components (project card titles, timeline card text, tech icon sizing) weren't migrated to fluid tokens. You framed Phase 4 as "a coherence pass, not a redesign from zero" — the section-level type scale and spacing rhythm (the actual "looks like a template" complaint from the audit) are now unified and tokenized; rewriting every micro-level card size to fit the fluid scale would be disproportionate to that framing. Flagging it rather than silently leaving it.
- **No `<footer>` landmark added.** You asked for "semantic landmark tags" — I added `<main>` (paired with the existing `<nav>`), which addresses the actual gap (previously zero landmarks besides nav). A footer would be a new visible content section nobody asked for, so I left it out rather than invent one.
- **Bundle size** (~1.2MB JS, mostly three.js) and the unresized `herobg.png` (930KB) weren't touched — out of scope for this renovation's five phases as specified, but worth a follow-up if load time matters to you.
- **No click-outside-to-close on the mobile menu** — it already closes correctly on link click (verified), and adding a backdrop-click handler wasn't part of any phase's explicit requirements. Minor, easy to add if you want it.

## Open questions / what I need from you

Resolved since the first draft of this report: the real CV is in place, and your LinkedIn URL is wired in. Still open:

0. **Resumes MVP links, still pending.** The OpenAI key is confirmed revoked and both repos are currently private while you rewrite their history (steps tracked outside this repo, since they're not part of the portfolio). Once both are public again with clean history: flip `sourceLinksVerified: true` on the Resumes MVP entry in `src/constants/index.js`, actually fetch both repo URLs to confirm they resolve (not just assume), then commit and push.
1. **quant-center.com link.** It's live but sits behind HTTP Basic Auth. I did not link it, per your instruction. If you want it linked, my suggestion: a small secondary badge/link on the Financial Center card labeled something like **"Live Site (password-protected)"** with a lock glyph, rather than an unlabeled "Live Demo" button that would surprise a visitor with an unexpected credential prompt. Say the word and I'll wire it in.
2. **11 skills/roles with no available icon asset:** NestJS, FastAPI (Python), Entity Framework Core, Vite, Next.js, Claude, Gemini, PostgreSQL, Caddy, Swagger/OpenAPI (render as text-only pills), plus **AI Integration Engineer** (renders with a small "AI" badge placeholder instead of a matching icon). If you have or want me to source proper icons for any of these, say which ones.
3. **Three existing icon assets kept but currently unused, pending your call:**
   - `css.png` — I merged "CSS3" and "Tailwind" into one skill chip ("CSS3 / Tailwind") using the Tailwind icon, per how your spec listed it. If you'd rather have them as two separate chips, `css.png` is right there.
   - `mongodb.png` — your skill list says generic "NoSQL." If you'd rather name MongoDB specifically, I'll swap the icon in.
   - `figma.png` — your skill list has "UX/UI" but doesn't mention Figma, so I left it as a text-only pill rather than assume. Say if Figma should be named and paired with the icon.
4. **No "Matrix" company logo exists.** The MATRIX (Bank Mizrahi-Tefahot) experience entry reuses the existing Mizrahi-Tefahot icon since that's the closest available asset and the client this role sits at. If you have (or want) a real Matrix logo, send it over.
5. **OG image domain.** `og:url`/`og:image` currently point at `https://portfolio-4de70.web.app`, derived from the Firebase project id in `.firebaserc` — I don't know your actual production domain. Confirm or correct it once you know where this deploys.
6. **Deploy process, still unconfirmed.** The original audit flagged that `firebase.json`'s `public` dir didn't match Vite's build output; I fixed the config (`"public": "dist"`), but I still don't know whether you have some other manual deploy step outside this repo that this might interact with. Worth a quick sanity-check deploy before you trust it fully — which is on you, since I was asked not to deploy.
