import type { Invitation } from "@/lib/invitation";
import { Flora, Rule } from "./Ornaments";

/** Mughal dome outline, shared by the frame, inner rule and photo clip. */
const DOME =
  "M200,4 C212,34 262,52 306,84 C360,124 396,184 396,268 V560 H4 V268 C4,184 40,124 94,84 C138,52 188,34 200,4Z";
const inset = (scale: number) => `translate(200 300) scale(${scale}) translate(-200 -300)`;

export default function CoupleSection({ inv }: { inv: Invitation }) {
  const c = inv.couple;
  return (
    <section className="couple parch" id="couple">
      <Flora corner="tl" />
      <Flora corner="tr" />
      <div className="couple-head">
        <p className="together cp">{c.together}</p>
        <h2 className="names script cp">{c.names}</h2>
        <Rule className="cp" />
      </div>
      <div className="stage">
        <svg className="dome" id="dome" viewBox="0 0 400 560" role="img" aria-label={c.names}>
          <defs>
            <clipPath id="domeClip">
              <path d={DOME} transform={inset(0.925)} />
            </clipPath>
            <linearGradient id="domeMaroon" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7d1829" />
              <stop offset="1" stopColor="#4a0b16" />
            </linearGradient>
            <linearGradient id="domeWarm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffe9b8" stopOpacity=".12" />
              <stop offset=".6" stopColor="#ffe9b8" stopOpacity="0" />
              <stop offset="1" stopColor="#3a0a12" stopOpacity=".28" />
            </linearGradient>
          </defs>
          <g>
            <path d={DOME} fill="url(#domeMaroon)" stroke="#e2c070" strokeWidth="3" />
            <path d={DOME} fill="none" stroke="#e2c070" strokeWidth="1" strokeOpacity=".7" transform={inset(0.965)} />
          </g>
          <g clipPath="url(#domeClip)">
            <image
              id="photoImg"
              href={c.photo}
              x="15"
              y="50"
              width="370"
              height="556"
              preserveAspectRatio="xMidYMin slice"
            />
            <rect x="0" y="0" width="400" height="560" fill="url(#domeWarm)" />
          </g>
          <path d={DOME} fill="none" stroke="#f3dc9a" strokeWidth="1.6" transform={inset(0.925)} />
        </svg>
      </div>
      <div className="date-row cp">
        <div>
          <span className="eyebrow">{c.dateRow.left}</span>
        </div>
        <div className="mid">
          <b>{c.dateRow.day}</b>
          <span className="eyebrow">{c.dateRow.month}</span>
        </div>
        <div>
          <span className="eyebrow">{c.dateRow.right}</span>
        </div>
      </div>
      <Flora corner="bl" />
      <Flora corner="br" />
      <div className="floor" />
    </section>
  );
}
