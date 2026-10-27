/**
 * All invitation content lives here; the page at /invitation renders `invitation` below.
 * The layout, animations and links all read from this object, so editing the text here is enough.
 */

/** Width and height are the file's pixel size; they reserve layout space before the image loads. */
export type Photo = { src: string; alt: string; width: number; height: number };

export type ProgramItem = { time: string; title: string; description: string };

export type Invitation = {
  meta: { title: string; description: string };

  /** Event start and end with an explicit UTC offset; drives the countdown and calendar link. */
  event: { start: string; end: string };

  bismillah: string;
  bismillahTranslation: string;

  /** The velvet door cover. */
  cover: { title: string; subtitle: string; names: string; date: string; tapLabel: string };

  /** The parchment garden revealed behind the doors. */
  garden: { invite: string; groom: string; with: string; bride: string; label: string; blessing: string };

  couple: {
    together: string;
    names: string;
    /** Portrait photo shown inside the dome arch; faces near the top work best. */
    photo: string;
    dateRow: { left: string; day: string; month: string; right: string };
  };

  scratch: {
    heading: string;
    kicker: string;
    date: string;
    weekday: string;
    time: string;
    fallbackLabel: string;
  };

  calendar: { title: string; details: string; buttonLabel: string };

  countdown: { heading: string; arrived: string };

  /** Three photos for the arched trio: left, centre (taller), right. */
  gallery: [Photo, Photo, Photo];

  program: { heading: string; items: ProgramItem[] };

  venue: {
    label: string;
    name: string;
    address: string;
    /** Used to build a Maps search link when no exact `mapsLink` is given. */
    mapsQuery: string;
    /** An exact Google Maps share link; takes priority over `mapsQuery`. */
    mapsLink?: string;
    photo: Photo;
    mapsLabel: string;
  };

  dressCode: { label: string; text: string };

  presence: string;

  closing: { line: string; names: string };

  /**
   * Optional background audio, started by the seal tap. Put the file in public/ (e.g.
   * public/audio/nasheed.mp3); while the file is missing the player is simply left out.
   */
  music?: { src: string; title: string };
};

const shaleema: Invitation = {
  meta: {
    title: "Shaleema | Abdul Hannan & Hamail Shahzad",
    description: "You are cordially invited to the Shaleema of Abdul Hannan & Hamail Shahzad, Friday 27th November 2026.",
  },
  event: { start: "2026-11-27T18:30:00+05:00", end: "2026-11-27T22:00:00+05:00" },

  bismillah: "بسم اللہ الرحمٰن الرحیم",
  bismillahTranslation: "In the name of Allah, the Most Beneficent, the Most Merciful",

  cover: {
    title: "SHALEEMA",
    subtitle: "Wedding Invitation",
    names: "Hannan & Hamail",
    date: "Friday, 27th November 2026",
    tapLabel: "Tap to open",
  },

  garden: {
    invite: "Muhammad Rasheed cordially invites you to celebrate the Shaleema of his grandson",
    groom: "Abdul Hannan",
    with: "with",
    bride: "Hamail Shahzad",
    label: "Shaleema",
    blessing: "As we celebrate their union with joy, love and blessings.",
  },

  couple: {
    together: "Together with their families",
    names: "Hannan & Hamail",
    photo: "/images/couple-placeholder.svg",
    dateRow: { left: "On Friday", day: "27", month: "November", right: "6:30 to 10:00 PM" },
  },

  scratch: {
    heading: "Scratch to reveal",
    kicker: "You are invited",
    date: "27 November 2026",
    weekday: "Friday",
    time: "6:30 PM to 10:00 PM",
    fallbackLabel: "Or tap here to reveal",
  },

  calendar: {
    title: "Shaleema: Hannan and Hamail",
    details: "Shaleema: Nikkah, photo shoot and dinner",
    buttonLabel: "Add to Google Calendar",
  },

  countdown: { heading: "Counting down to the Shaleema", arrived: "The day has arrived. Alhamdulillah." },

  gallery: [
    { src: "/images/prog-dholki.webp", alt: "Hands on a dholki", width: 720, height: 720 },
    { src: "/images/hero-gate.webp", alt: "Red curtains opening onto a garden", width: 1080, height: 1620 },
    { src: "/images/when-chandelier.webp", alt: "Chandeliers at night", width: 720, height: 1080 },
  ],

  program: {
    heading: "Shaleema day",
    items: [
      { time: "6:30 PM", title: "Guests arrive", description: "Welcome and seating." },
      { time: "7:00 PM", title: "Nikkah", description: "The Nikkah ceremony, followed by dua." },
      { time: "8:00 PM", title: "Photo shoot", description: "Photos with the couple and family." },
      { time: "8:45 PM", title: "Dinner", description: "Khana is served." },
    ],
  },

  venue: {
    label: "Venue",
    name: "Seven Star Event Complex",
    address: "Lahore",
    mapsQuery: "Seven Star Event Complex Lahore",
    mapsLink: "https://maps.app.goo.gl/VvreKJPi2XgGMkB99",
    photo: { src: "/images/venue-mughalarch.webp", alt: "Mughal arch looking onto a garden", width: 693, height: 1200 },
    mapsLabel: "Open in Google Maps",
  },

  dressCode: { label: "Dress code", text: "Dress as you like — come comfortable and celebrate with us." },

  presence: "Your presence will make our day special.",

  closing: { line: "We look forward to celebrating this precious moment with you.", names: "Hannan & Hamail" },

  music: { src: "/audio/nasheed.mp3", title: "Nasheed" },
};

export const invitation = shaleema;

/** Google Calendar wants UTC timestamps in the compact form 20261128T140000Z. */
function toCalendarStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function calendarUrl(inv: Invitation): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: inv.calendar.title,
    dates: `${toCalendarStamp(inv.event.start)}/${toCalendarStamp(inv.event.end)}`,
    details: inv.calendar.details,
    location: `${inv.venue.name}, ${inv.venue.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function mapsUrl(inv: Invitation): string {
  if (inv.venue.mapsLink) return inv.venue.mapsLink;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(inv.venue.mapsQuery)}`;
}
