# Wedding Invitation

A single-page React and TypeScript wedding invitation built with Vite. The experience includes an interactive sealed envelope, ceremony itinerary, wedding-day countdown, music, and RSVP links.

## Local development

Install the locked dependencies and start the Vite development server:

```sh
npm ci
npm run dev
```

The development server is available at `http://localhost:5173`.

## Validation and production preview

```sh
npm run lint
npm run build
npm run preview
```

`npm run build` runs the TypeScript project checks and creates the static production site in `dist`. `npm run preview` serves that build locally (usually at `http://localhost:4173`). There is no separate automated test script in `package.json`.

## Deploying on Vercel

Import the project root into Vercel and use the Vite preset with these settings:

- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: the directory containing `package.json`

No Vercel-specific configuration file or build-time environment variable is required for the current app. After publishing a change, verify that the production deployment is built from the intended branch and latest commit. If the deployed page still shows old content, inspect the Vercel deployment's source commit and build logs, correct the branch/build settings if necessary, and redeploy that revision.

## App configuration notes

- Wedding names, dates, venue, event schedule, and image paths are in `src/data/wedding.ts`.
- Images and decorative illustrations are served from `public/images`; keep their root-relative `/images/...` URLs when adding assets.
- RSVP entries are saved in the guest's browser storage and submitted by opening WhatsApp; there is no server-side RSVP API.
- Replace the concierge number in `src/components/RsvpForm.tsx` with the intended wedding contact before using the RSVP/call links publicly.
- Google Fonts are loaded from Google Fonts; the page falls back to local font stacks if that service is unavailable.
