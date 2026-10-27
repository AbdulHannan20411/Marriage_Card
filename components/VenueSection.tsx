import Image from "next/image";
import type { Invitation } from "@/lib/invitation";

export default function VenueSection({ inv, mapsHref }: { inv: Invitation; mapsHref: string }) {
  const v = inv.venue;
  return (
    <div className="card rv">
      <svg
        className="pin"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
        <circle cx="12" cy="10" r="2.6" />
      </svg>
      <Image className="vp" src={v.photo.src} alt={v.photo.alt} width={v.photo.width} height={v.photo.height} />
      <span className="eyebrow">{v.label}</span>
      <p className="nm">{v.name}</p>
      <p>{v.address}</p>
      <a className="btn ghost" href={mapsHref} target="_blank" rel="noopener">
        {v.mapsLabel}
      </a>
    </div>
  );
}
