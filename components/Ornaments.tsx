import { cornerTransform, flora, floraOrigins, symbolBox, type Corner } from "@/lib/flora";

/** The gold divider rule with a central diamond. */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <svg className={`rule ${className}`.trim()} viewBox="0 0 300 24" aria-hidden="true" focusable="false">
      <use href="#divider" />
    </svg>
  );
}

/** Gold frame with the four ornamental corners; used on the doors and the closing panel. */
export function Frame({ children }: { children?: React.ReactNode }) {
  return (
    <div className="frame">
      {(["tl", "tr", "bl", "br"] as const).map((c) => (
        <svg key={c} className={`corner ${c}`} viewBox="0 0 150 150" aria-hidden="true" focusable="false">
          <use href="#corner" />
        </svg>
      ))}
      {children}
    </div>
  );
}

/** A floral garland for one corner of a parchment scene. Leaves and flowers animate as `.fi`. */
export function Flora({ corner }: { corner: Corner }) {
  return (
    <svg className={`flora ${corner}`} viewBox="0 0 300 300" aria-hidden="true" focusable="false">
      <g transform={cornerTransform[corner]}>
        {flora[corner].map(([id, x, y, r, s], i) => {
          const [bx, by, bw, bh] = symbolBox[id];
          const kind = id.startsWith("leaf") ? "lf" : "fl";
          const [ox, oy] = floraOrigins[corner][i];
          return (
            <g key={i} className={`fi ${kind}`} data-svg-origin={`${ox} ${oy}`}>
              <image
                href={`/ornaments/${id}.svg`}
                x={bx}
                y={by}
                width={bw}
                height={bh}
                transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function Bird({ className }: { className: string }) {
  return (
    <svg className={`bird ${className}`} viewBox="0 0 60 24" aria-hidden="true" focusable="false">
      <use href="#bird" />
    </svg>
  );
}

export function Medallion({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <use href="#medallion" />
    </svg>
  );
}
