# Ashmita & Sripad Wedding Invitation

A React, TypeScript, and Vite wedding invitation. Wedding content is centralized in `src/data/wedding.ts`; reusable ceremony-card data and calendar generation are adapted through `src/data/events.ts`.

## Local Development

```sh
npm ci
npm run dev
```

The app runs on the Vite URL printed in the terminal. Use another port with `npm run dev -- --port 5174` if needed.

## Validation

```sh
npm run build
npm run lint
```

The build is the required release check. Oxlint currently reports existing warnings in `MusicContext.tsx`, `SealedEnvelope.tsx`, and `RsvpForm.tsx`; review those before treating lint as clean.

## Confirming Invitation Content

Names, family details, ceremony schedule, venue, RSVP deadline, and contact values live in `src/data/wedding.ts`. Only the couple names have been explicitly requested in this project history. Other existing values are draft content and their `wedding.confirmation` flags remain `false`.

After the hosts verify a field, update its value and corresponding confirmation flag. The invitation, timeline, countdown, RSVP deadline, map links, and calendar actions use those flags to avoid presenting unverified data as final. Calendar exports use `STATUS:TENTATIVE` until the host-approved release policy is updated.

The current photography in `public/images` is locally supplied project content. Confirm usage rights with the image provider before publishing.

## RSVP Configuration

Copy `.env.example` to `.env.local` and set `VITE_WEDDING_RSVP_ENDPOINT` to the hosts' RSVP service URL. The endpoint must accept a JSON `POST` containing the guest's RSVP and return a `2xx` response only after accepting it. Validation responses may return `400` or `422` with an `errors` object keyed by `guestName`, `phone`, `celebrations`, or `personalMessage`.

If the backend is unavailable, the form retains a local draft and shows a retry message. An optional `VITE_WEDDING_RSVP_WHATSAPP_NUMBER` enables a separately labeled WhatsApp handoff; that handoff is never recorded as a successful RSVP. A success receipt appears only after the backend returns `2xx`.

Set `VITE_WEDDING_MUSIC_URL` to an approved audio file URL to enable the HTML audio player. Without it, music controls stay disabled. Restart Vite after changing environment values. Do not commit `.env.local` or other secrets.

## Release Readiness

Before publishing, confirm all content flags and the RSVP contact, choose and configure a hosting provider/domain, add automated desktop/mobile interaction tests, verify calendar files and external links, and test the deployed URL. This repository does not yet include a hosting configuration, deployment credentials, a production domain, or automated browser tests.
