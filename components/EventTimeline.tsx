import type { ProgramItem } from "@/lib/invitation";

/** Vertical timeline; InvitationMotion scrubs the gold fill down it and lights each dot as it passes. */
export default function EventTimeline({ items }: { items: ProgramItem[] }) {
  return (
    <div className="tline" id="tl" role="list">
      <div className="tl-line" aria-hidden="true">
        <div className="tl-fill" id="tl-fill" />
      </div>
      {items.map((it) => (
        <div className="tl-item" role="listitem" key={it.time + it.title}>
          <span className="tl-time eyebrow">{it.time}</span>
          <span className="tl-title">{it.title}</span>
          <span className="tl-desc">{it.description}</span>
        </div>
      ))}
    </div>
  );
}
