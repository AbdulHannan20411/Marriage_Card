import type { Invitation } from "@/lib/invitation";

export default function DressCode({ inv }: { inv: Invitation }) {
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
        <path d="M8 3l4 3 4-3 5 4-3 4v10H6V11L3 7z" />
      </svg>
      <span className="eyebrow">{inv.dressCode.label}</span>
      <p>{inv.dressCode.text}</p>
    </div>
  );
}
