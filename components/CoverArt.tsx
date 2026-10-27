import type { Invitation } from "@/lib/invitation";
import { Frame, Rule } from "./Ornaments";

/**
 * The velvet cover picture. Each door renders a full copy at double width and clips half of it,
 * so the closed doors read as one seamless cover. The middle row leaves room for the seal.
 */
export default function CoverArt({ inv, asHeading = false }: { inv: Invitation; asHeading?: boolean }) {
  const Title = asHeading ? "h1" : "p";
  return (
    <div className="art">
      <Frame />
      <div className="art-content">
        <div className="art-top">
          <p className="bismillah" lang="ur">
            {inv.bismillah}
          </p>
          <Title
            className="title gold-text"
            style={{ "--title-chars": Math.max(6, inv.cover.title.length) } as React.CSSProperties}
          >
            {inv.cover.title}
          </Title>
          <p className="subtitle">{inv.cover.subtitle}</p>
          <Rule />
        </div>
        <div className="art-mid" />
        <div className="art-bot">
          <p className="hero-names script">{inv.cover.names}</p>
          <p className="hero-date eyebrow">{inv.cover.date}</p>
        </div>
      </div>
    </div>
  );
}
