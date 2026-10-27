import type { Invitation } from "@/lib/invitation";
import CoverArt from "./CoverArt";
import { Bird, Flora, Medallion, Rule } from "./Ornaments";

/**
 * Opening scene. With motion enabled (html.js) the velvet doors, seal and curtains sit on top of the
 * parchment garden, and InvitationMotion pins this section and plays them open on scroll or tap.
 * Without motion the doors are hidden and the static cover is shown above the garden instead.
 */
export default function InvitationCover({ inv }: { inv: Invitation }) {
  const g = inv.garden;
  return (
    <>
      <section className="static-cover velvet" aria-label={`${inv.cover.title} ${inv.cover.subtitle}`}>
        <CoverArt inv={inv} />
      </section>

      <section className="gate parch" id="gate" aria-label="Invitation">
        <Flora corner="tl" />
        <Flora corner="tr" />
        <Flora corner="bl" />
        <Flora corner="br" />
        <Bird className="b1" />
        <Bird className="b2" />
        <Bird className="b3" />
        <div className="garden-content">
          <p className="bismillah gr" lang="ur">
            {inv.bismillah}
          </p>
          <p className="tr gr">{inv.bismillahTranslation}</p>
          <Rule className="gr" />
          <p className="invite gr">{g.invite}</p>
          <p className="big-name script gr">{g.groom}</p>
          <p className="with eyebrow gr">{g.with}</p>
          <p className="big-name script gr">{g.bride}</p>
          <div className="bar-label gr">{g.label}</div>
          <p className="blessing gr">{g.blessing}</p>
        </div>
        <div className="parapet" />
        <div className="curtain cl" />
        <div className="curtain cr" />
        <div className="valance" />
        <div className="door dl">
          <CoverArt inv={inv} asHeading />
          <i className="door-edge" />
        </div>
        <div className="door dr" aria-hidden="true">
          <CoverArt inv={inv} />
          <i className="door-edge" />
        </div>
        <button className="seal" id="seal" type="button" aria-label={inv.cover.tapLabel}>
          <span className="seal-art">
            <Medallion />
          </span>
          <span className="tap">{inv.cover.tapLabel}</span>
        </button>
      </section>
    </>
  );
}
