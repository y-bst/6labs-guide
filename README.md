# 6labs Studio guides

Scroll-story guides for the BD team. Each guide is written as React components and
built into one self-contained HTML page (CSS, JS and icons inlined). No React ships
to the browser.

```
npm install
npm run dev      # build, rebuild on change, serve on http://localhost:5178
npm run build    # write index.html and 0X-*.html to the repo root (stale 0X-*.html are removed)
npm run check    # build, screenshot every scene, compare with .snap/base
npm run typecheck
```

The built `*.html` files in the root are what gets published (GitHub Pages).

## Layout

```
src/
  registry.tsx          every guide: number, area, title, index card. Start here.
  guides/               one file (or folder) per guide: scenes, screen, recap
  shell/                the page around a guide
    guide.tsx             defineGuide() and GuidePage
    Story.tsx             step bar, scene cards, pinned screen
    scenes.tsx            scene names → beats: useScenes, <Layer>, <Show>
    content.tsx           card/recap blocks: Bullets, Facts, Term, TextLink, NextButton, RecapFlow, Recap
    layout.tsx            Page, TopBar, Intro, Glance
    story.css, story.js   scroll story styles and behaviour
  ui/                   product screen kit (replicas of the 6labs prototype)
    tokens.css            the palette and the fonts, on :root so the shell can use them too
    base.css              app frame, shared sidebar shell
    Icon.tsx, icons.svg   icon sprite for Intelligence screens
    intel/                Oracle, Radiologist, Documents, Connectors
    testing/              every Testing screen, by part (.tsx, and .css of the same name):
      app                   frame, tree sidebar, page header, top bar, page scroll
                            and the primitives: PageLayer, Button, Label, Row, Divider, Input
      library               video cards, the library picker used inside tests
      run                   new-run bits, run history rows, submit → run history
      report                User Test / AI Behavioural report blocks
      composer              two-tile new run (build or videos + test cases), run name; styled in verify.css
      verify                result, coverage, case list, case detail popup
      ai                    build picker, personas, agents, live sessions, agent video
      TestingMap.tsx        "Testing at a glance" diagram, current guide boxed
  data/                 sample data shown on the screens (testing, verify, behavioural, intel)
  pages/Index.tsx       the landing page, generated from the registry
scripts/
  build.tsx             renders everything
  snap.mjs              visual check (screenshots + pixel diff)
  html2jsx.mjs          converts prototype HTML into JSX
```

## How a guide works

A guide is data plus one screen component:

```tsx
export default defineGuide({
  slug: 'oracle',                        // must exist in registry.tsx
  hero: <Icon name="oracle" size={36} />,
  lede: <>Oracle is the 6labs agent you ask…</>,
  steps: [{ id: 'home', label: 'Home' }, …],                    // the step bar
  scenes: [{ id: 'home', step: 'home', title: '…', body: <>…</> }, …],   // one card each
  Screen,                                // the pinned product screen
  recap: { title, head, quotes, faqs, next },
});
```

As the reader scrolls, one scene is active at a time. The screen reacts to it by
**scene name**, never by number, so scenes can be added or reordered freely:

```tsx
const { at, fx, cls } = useScenes();
<Layer show="thinking..export">…</Layer>          // a full-size layer, visible in those scenes
<Show when="drop">…</Show>                          // a block inside a layer
<span {...cls('i-plus', { hl: 'add' })} />          // class "hl" during scene "add"
<div {...fx({ on: 'ask..', hl: 'source' })} />     // several toggles
```

Scene specs: `'a'` · `'a..b'` · `'a..'` (to the end) · `'..b'` (from the start) · `'a, c..d'`.
A misspelled scene name fails the build.

`focus: [x, y, zoom]` on a scene zooms the screen onto that point of the 1180×780 canvas.
Card chapter labels default to the step label (plus "· 2 of 3" when a step has several
scenes); set `chapter` to override.

## Adding a guide

1. Add it to `GUIDES` in `src/registry.tsx` (and to `CATALOG` for the index page).
2. Create `src/guides/<slug>.tsx`, or a folder `src/guides/<slug>/index.tsx` for a big one.
   Page-only styles go in `<slug>.css` / `style.css`, a page script in `<slug>.js` / `script.js`.
3. Import it in `src/guides/index.ts`.
4. `npm run dev` and build the screen from `ui/` components. Put sample data in `src/data/`.

## Styles

CSS is plain and global, loaded in this order: `ui/tokens.css` → `ui/base.css` → the area's kit
(`ui/intel/*.css` or `ui/testing/*.css`, in the order listed in `scripts/build.tsx`) → `shell/story.css` → the guide's own CSS.
A kit rule that `story.css` also sets (e.g. `.shot .layer`) needs the extra `.shot` to win.
Kit classes start with `s-` (Testing) or `i-` (Intelligence). Avoid bare names that `story.css`
or `story.js` already use: `off` hides elements between scenes, `progress` is the scroll bar.

Colours and fonts are the tokens in `ui/tokens.css`; write `var(--ink-3)`, not `#4F566C`.
They sit on `:root`, so the shell (`story.css`, `pages/index.css`) can use them as well as the
screens. `ui/base.css` holds what every screen shares: the frame, and the sidebar shell both
areas use (`.s-side`, `.s-nav`, `.s-nav-h`). What differs between the two areas — the tree
style, the SOON badge — stays in that area's own stylesheet.

The screen size is set once, by `<Story width height>`; the frame fills the canvas from there.

**Each page ships only the rules it uses.** `scripts/build.tsx` renders the guide once to see
which classes it reaches for, then drops every kit rule for a class the page never renders —
about half of the area's kit, since one guide carries the screens of all of them. If a class is
only ever added by a script at runtime, add it to `RUNTIME` in `build.tsx` or its rules will be
purged. `npm run check` is what catches a mistake here.

## Primitives

Screens are built from the kit's components, not from its class names — so a class can be
renamed in one place and `npm run typecheck` finds every use. `ui/testing/app.tsx` exports the
small ones: `PageLayer` (one screen of the app), `Button`, `Label`, `Row`, `Divider`, `Input`.
Most take `show` for the scenes they appear in, and `hl` for the scenes they pulse.

## Visual check

`.snap/base` holds screenshots of every scene of every page (desktop and phone); new pages are
picked up automatically.
After a refactor, `npm run check` must report "All … screenshots match". After an
intended visual change, refresh the baseline: `node scripts/snap.mjs capture base`.
