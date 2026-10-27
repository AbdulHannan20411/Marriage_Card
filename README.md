# Shaleema Invitation

An animated wedding invitation (Shaleema of Abdul Hannan & Hamail Shahzad), built with Next.js App Router, TypeScript, GSAP + ScrollTrigger, and Lenis smooth scrolling.

The card is served at `/invitation` (`/` and the old `/cards/ref/...` links redirect there).

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Production check:

```bash
npm run typecheck
npm run lint
npm run build && npm start
```

## Editing the invitation

All text, dates, venue, photos and timeline entries live in [lib/invitation.ts](lib/invitation.ts).

- `event.start` / `event.end` (ISO with UTC offset) drive the countdown and the Google Calendar link.
- `couple.photo` is the portrait shown in the dome. It is a placeholder for now. Put a photo in `public/images/` and point this at it. A photo with faces near the top works best. You can preview a photo without editing code by adding `?photo=<image-url>` to the page URL.

## Background nasheed (optional)

Put an MP3 at `public/audio/nasheed.mp3`, then rebuild (or just refresh in `npm run dev`). The player appears automatically; without the file it's left out entirely.

- It starts when the guest taps the seal, fading in to a low volume. A small round button in the corner pauses and resumes it, and a guest who switches it off stays muted on their next visit.
- The file only downloads when it actually plays. Keep it to about 1–2 MB: roughly 2–3 minutes at 64–96 kbps mono, which loops seamlessly.
- To use a different file or name, change `music` in `lib/invitation.ts`.
- Use a recording you have the rights to share.

## Link preview (WhatsApp)

`app/invitation/opengraph-image.jpg` (1200×630) is the picture shown when the link is shared. It is a capture of the cover, so **recapture it if you change the names or date on the cover**.

On Vercel the preview works with no setup. With a custom domain, set the environment variable `NEXT_PUBLIC_SITE_URL` (e.g. `https://hannan-hamail.com`). WhatsApp caches previews per link, so test a fresh deployment URL, or add something like `?v=2` to the link, to see an updated image.

## Deploy to Vercel (Hobby plan)

1. Push this folder to a GitHub repository.
2. On vercel.com choose **Add New → Project**, import the repo, and keep the detected **Next.js** defaults. The build command is `npm run build`.
3. Deploy. No environment variables are needed.

Or from the terminal: `npx vercel` and then `npx vercel --prod`.

The site is fully static: no API routes, no database, no server functions at request time. Image optimization is turned off (`images.unoptimized`) because the photos are already compressed WebP files, so the Hobby plan's image-optimization quota is never used. No paid services are involved.

## Slow phones and slow connections

- The cover is plain HTML, so it shows before any JavaScript arrives (about 2 s on 3G).
- Until the animations are ready, the page stays on the cover. A tap on the seal during that time is remembered (the seal turns) and opens the doors as soon as they can move.
- If the scripts haven't arrived after 15 s, the page switches to the static layout so the invitation is still readable. This logic is the boot script in `app/layout.tsx`.
- Once the page is idle, the photos further down are fetched in the background, so a connection that drops while someone is reading doesn't leave empty frames.
- The garland flowers and leaves are small SVG files in `public/ornaments/`. Their pop-in animation uses pre-measured pivots (`floraOrigins` in `lib/flora.ts`), so phones don't have to measure ~500 elements. If you edit a garland's placement data, re-measure its pivots too.

## Assets and licences

- **Fonts** (Cinzel Decorative, Cormorant Garamond, Pinyon Script, Aref Ruqaa) are self-hosted in `public/fonts/` under the SIL Open Font License.
- **Photos** in `public/images/*.webp` were copied from the Patalox reference card this site recreates. Their licence is unknown. Replace them with your own photos, or get permission, before publishing.
- All ornaments (medallion, frame corners, garlands, birds, jali patterns) were drawn for this repo, as inline SVG, CSS and the files in `public/ornaments/`.
