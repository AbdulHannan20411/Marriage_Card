import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // Link previews (WhatsApp etc.) need absolute image URLs. On Vercel, Next.js fills in the
  // deployment's own domain automatically; set NEXT_PUBLIC_SITE_URL only for a custom domain.
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: "Wedding Invitation",
  description: "A wedding invitation.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#260408",
};

/*
 * Runs before first paint, before any of the page's JavaScript has downloaded.
 * - `js` turns on the animated door cover. Reduced-motion visitors never get it, so they see the
 *   static cover without a flash of the doors.
 * - Scroll restoration is off so a reload always opens on the closed doors, not mid-animation.
 * - `booting` holds the page on the cover until the animations are wired up (InvitationMotion
 *   removes it). Scrolling earlier would only be yanked back when they attach.
 * - A tap on the seal during that wait is remembered (and the seal turns to show it was heard);
 *   InvitationMotion plays it as soon as it's ready.
 * - If the scripts still haven't arrived after 15s (bad or dropped connection), give up on the
 *   animation and show the static layout, so nobody is stuck on the cover.
 */
const bootScript = `(function(){
if('scrollRestoration' in history)history.scrollRestoration='manual';
var d=document.documentElement;
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
d.classList.add('js','booting');
var on=function(){return d.classList.contains('booting')};
var hold=function(e){if(on())e.preventDefault()};
addEventListener('wheel',hold,{passive:false});
addEventListener('touchmove',hold,{passive:false});
addEventListener('keydown',function(e){if(on()&&e.target===document.body&&/^( |PageDown|PageUp|ArrowDown|ArrowUp|End|Home)$/.test(e.key))e.preventDefault()});
addEventListener('click',function(e){var t=e.target;if(on()&&t&&t.closest&&t.closest('#seal')){window.__sealTap=true;d.classList.add('seal-queued')}},true);
window.__bootTimer=setTimeout(function(){if(on())d.classList.remove('js','booting','seal-queued')},15000);
})()`;

const preloadFonts = [
  "cinzel-decorative-latin-700-normal",
  "cormorant-garamond-latin-500-normal",
  "cormorant-garamond-latin-600-normal",
  "pinyon-script-latin-400-normal",
  "aref-ruqaa-arabic-400-normal",
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {preloadFonts.map((f) => (
          <link key={f} rel="preload" href={`/fonts/${f}.woff2`} as="font" type="font/woff2" crossOrigin="" />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
