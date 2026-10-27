import type { Invitation } from "@/lib/invitation";
import { Frame, Medallion, Rule } from "./Ornaments";

export default function ClosingSection({ inv }: { inv: Invitation }) {
  return (
    <section className="velvet closing" id="closing">
      <Frame>
        <div className="in">
          <Medallion className="medal rv" />
          <Rule className="rv" />
          <p className="close-line script rv">{inv.closing.line}</p>
          <Rule className="rv" />
          <p className="close-names script rv">{inv.closing.names}</p>
        </div>
      </Frame>
    </section>
  );
}
