"use client";

import { useEffect, useState } from "react";
import type { Invitation } from "@/lib/invitation";
import { Flora } from "./Ornaments";

type Parts = { d: number; h: number; m: number; s: number; left: number };

function split(target: number): Parts {
  const left = Math.floor(Math.max(0, target - Date.now()) / 1000);
  return { d: Math.floor(left / 86400), h: Math.floor((left % 86400) / 3600), m: Math.floor((left % 3600) / 60), s: left % 60, left };
}

export default function Countdown({ inv }: { inv: Invitation }) {
  // Starts at null so the server render and first client render agree; real values arrive on mount.
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const target = new Date(inv.event.start).getTime();
    const tick = () => setParts(split(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [inv.event.start]);

  const units: [keyof Parts, string][] = [
    ["d", "Days"],
    ["h", "Hours"],
    ["m", "Minutes"],
    ["s", "Seconds"],
  ];
  const arrived = parts !== null && parts.left === 0;

  return (
    <section className="garden parch" id="garden">
      <Flora corner="bl" />
      <Flora corner="br" />
      <div className="count-wrap">
        <h2 className="count-head sec-head rv">{inv.countdown.heading}</h2>
        <div className="count-grid rv" role="timer" aria-live="off">
          {units.map(([key, label]) => (
            <div className="panel" key={key}>
              {/* "–" until the script runs, rather than a misleading 0 on slow connections */}
              <b>{parts ? parts[key] : "–"}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <p className="today" hidden={!arrived}>
          {inv.countdown.arrived}
        </p>
      </div>
      <div className="parapet" />
    </section>
  );
}
