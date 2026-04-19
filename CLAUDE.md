# CLAUDE.md

Guidance for AI assistants working in this repository.

## Project overview

Single-page digital menu for **Linc Caffè Zero** (Terni, Italy). Users tap a
category card, a dialog opens with the products in that category, each product
shows price, allergens, and dietary badges. UI strings are Italian. The app
is static (no backend) — all menu data lives in `src/data.js`.

## Tech stack

- **Vite 6** + **React 19** (JSX, no TypeScript — `jsconfig.json` maps `@/*` → `src/*`)
- **Tailwind CSS v4** via `@tailwindcss/vite` (config-less; theme tokens are defined in `src/App.css` with `@theme inline` and CSS custom properties, plus `tw-animate-css`)
- **shadcn/ui** (style: `new-york`, base color: `neutral`, icon library: `lucide`) — see `components.json`
- **Radix UI** primitives (already installed for every shadcn component in `src/components/ui/`)
- **framer-motion** for entry/exit animations and the loading screen
- **pnpm 10.4.1** is the declared package manager (`packageManager` field in `package.json`). Use `pnpm`, not `npm`/`yarn`.

## Commands

```bash
pnpm install       # install dependencies
pnpm dev           # start Vite dev server
pnpm build         # production build → dist/
pnpm preview       # preview the production build
pnpm lint          # run eslint over the repo
```

There is no test runner configured.

## Repository layout

```
├── index.html                 # Vite entry; NOTE: currently hardcodes hashed /assets/*.js|css (see "Known quirks")
├── vite.config.js             # base: './', @ alias → ./src, react + tailwind plugins
├── components.json            # shadcn/ui config
├── eslint.config.js           # flat config; ignores dist/
├── jsconfig.json              # @/* path mapping for editors
├── public/
│   ├── favicon.ico
│   └── images/                # product + category images served at /images/*
├── assets/                    # committed build output (hashed index-*.js/css + logo)
├── dist/                      # `pnpm build` output (also committed)
└── src/
    ├── main.jsx               # createRoot + <StrictMode><App/></StrictMode>
    ├── App.jsx                # entire app (header, grid, product dialog, footer, dark mode)
    ├── App.css                # Tailwind v4 directives + theme tokens + app-specific classes
    ├── index.css              # empty
    ├── data.js                # categories[], menuData{}, allergenIcons, dietaryIcons — edit here for menu changes
    ├── assets/                # logo.jpeg, react.svg (bundled via JS imports)
    ├── components/
    │   ├── LoadingScreen.jsx  # 3s intro with animated logo + progress bar
    │   └── ui/                # shadcn/ui components (accordion, button, card, dialog, ...)
    ├── hooks/
    │   └── use-mobile.js      # useIsMobile() — 768px breakpoint matchMedia hook
    └── lib/
        └── utils.js           # cn() = twMerge(clsx(...))
```

## Editing the menu

The menu is fully data-driven from `src/data.js`:

- `categories` — array of `{ id, name, description, image }` shown as cards on the home screen.
- `menuData` — object keyed by `category.id`, each value an array of products:
  `{ id, name, type, description, price, image, allergens, dietary }`.
- `allergenIcons` — emoji map keyed by allergen string (`gluten`, `lactose`, `eggs`, `peanuts`, `nuts`, `soy`, `fish`, `shellfish`, `sulfites`).
- `dietaryIcons` — emoji map for `vegan`, `vegetarian`, `organic`.

Rules when editing:
- Keep product `id` values unique across all categories (they're used as React keys in the dialog grid). A few existing ids collide between `colazioni` and `pranzo` — don't copy that pattern; pick fresh ids.
- `price` must be a number (rendered with `price.toFixed(2)` and a `€` prefix).
- `allergens` / `dietary` are arrays of strings; unknown keys render the raw string with no emoji — add to the icon map in the same file if introducing a new one.
- Product images live in `public/images/` and are referenced as `/images/<name>.webp` (absolute public path). Add the image file there; don't import it.

## Styling conventions

- Use Tailwind utility classes directly in JSX. Combine with `cn(...)` from `@/lib/utils` when composing conditional class strings.
- Theme colors are CSS variables (`--background`, `--primary`, `--muted-foreground`, etc.) defined in `src/App.css`. Dark mode is opted in via a `.dark` class on `<html>` (toggled in `App.jsx` and persisted to `localStorage` under the key `manus-theme`).
- shadcn components come from `@/components/ui/<name>.jsx`. Generate new ones with the shadcn CLI using the config in `components.json` (style `new-york`, base color `neutral`).
- Icons: `lucide-react`.

## Animations

`framer-motion` is used for:
- `LoadingScreen` intro (3s, then calls `onLoaded`).
- Category cards (fade + slide-up on mount).
- Product cards inside the dialog (fade + scale).

When adding more, prefer `motion` + `AnimatePresence` over custom CSS.

## Known quirks / gotchas

- **Logo import path.** Both `src/App.jsx` and `src/components/LoadingScreen.jsx` import the logo from the absolute URL `/caff--menuTerni-digitale/assets/logo.jpeg`. That path only resolves when the site is served under the GitHub Pages sub-path `/caff--menuTerni-digitale/`. Locally (`pnpm dev`) the logo will 404. If you touch this, consider switching to `import logo from '@/assets/logo.jpeg'` (the file exists at `src/assets/logo.jpeg`) so it works in both environments — but confirm with the user before changing deployment-affecting paths.
- **`index.html` references hashed assets.** `index.html` currently contains `<script src="/assets/index-ChgwG3tA.js">` and a matching stylesheet link, which are build outputs rather than the dev entry (`/src/main.jsx`). This is unusual — `vite build` normally rewrites `index.html` into `dist/index.html`. Don't assume `pnpm dev` works without first restoring the dev entry (`<script type="module" src="/src/main.jsx"></script>`). Ask before "fixing" this, since the current state may be intentional for a specific deploy flow.
- **`vite.config.js` uses `base: './'`** (relative asset URLs) — keep it that way so builds work under GitHub Pages' sub-path.
- **`dist/` and `assets/` are committed.** Treat them as deploy artifacts; the source of truth is `src/`. Don't hand-edit files under `dist/` or the hashed bundles in `assets/`.
- **No `.gitignore`.** Adding one (at minimum `node_modules/`) is safe, but skip `dist/` and `assets/` since they're part of the deploy flow above.
- **Empty `src/index.css`.** `main.jsx` imports it but all styles live in `src/App.css`. Leave it unless the user asks to consolidate.

## Lint rules worth knowing (`eslint.config.js`)

- `no-unused-vars` with `varsIgnorePattern: '^[A-Z_]'` — unused uppercase-named imports/vars are allowed (useful for types / constants).
- `react-hooks/recommended` and `react-refresh/only-export-components` (warn) are enabled.
- `dist/` is ignored.

## Branching / git workflow for AI sessions

- Develop on the branch the harness has assigned (e.g. `claude/<slug>`); never push directly to `main`.
- Use `git push -u origin <branch>`; retry on transient network errors only.
- Do not open a PR unless the user asks for one.
