"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { Invitation } from "@/lib/invitation";
import { Rule } from "./Ornaments";

const HEART_D =
  "M50,88 C20,66 2,48 2,28 C2,13 14,3 27,3 C37,3 46,8 50,18 C54,8 63,3 73,3 C86,3 98,13 98,28 C98,48 80,66 50,88Z";
/** Share of the canvas the heart covers; the reveal fires once half the heart is scratched away. */
const HEART_SHARE = 0.62;
const CONFETTI = ["#e2c070", "#b8903a", "#7d1829", "#fff0bd"];

export default function ScratchReveal({ inv, calendarHref }: { inv: Invitation; calendarHref: string }) {
  const s = inv.scratch;
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);

  const reveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    const stage = stageRef.current;
    if (!stage) return;
    for (let i = 0; i < 36; i++) {
      const c = document.createElement("i");
      c.className = "confetti";
      c.style.background = CONFETTI[i % 4];
      c.style.left = "50%";
      c.style.top = "45%";
      stage.appendChild(c);
      gsap.to(c, {
        x: (Math.random() - 0.5) * 360,
        y: (Math.random() - 0.7) * 300,
        rotate: Math.random() * 360,
        opacity: 0,
        duration: 1.4 + Math.random(),
        ease: "power2.out",
        onComplete: () => c.remove(),
      });
    }
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    const stage = stageRef.current;
    const ctx = cv?.getContext("2d", { willReadFrequently: true });
    if (!cv || !stage || !ctx) return;
    const heart = new Path2D(HEART_D);
    let W = 0;
    let drawing = false;
    let lastCheck = 0;

    const paintCoat = () => {
      const r = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width));
      const H = Math.max(1, Math.round(r.height));
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.globalCompositeOperation = "source-over";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      // draw in the heart's own 100x90 units
      ctx.setTransform((dpr * W) / 100, 0, 0, (dpr * H) / 90, 0, 0);
      ctx.clip(heart);
      const g = ctx.createLinearGradient(0, 0, 100, 90);
      g.addColorStop(0, "#7d1829");
      g.addColorStop(0.5, "#b8903a");
      g.addColorStop(1, "#5a0e1a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 100, 90);
      for (let i = 0; i < 260; i++) {
        ctx.fillStyle =
          Math.random() > 0.5 ? `rgba(255,240,189,${Math.random() * 0.7})` : `rgba(38,4,8,${Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(Math.random() * 100, Math.random() * 90, Math.random() * 0.7 + 0.15, 0, 6.3);
        ctx.fill();
      }
      ctx.restore();
    };

    const check = () => {
      try {
        const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
        let clear = 0;
        let total = 0;
        for (let i = 3; i < d.length; i += 64) {
          total++;
          if (d[i] < 20) clear++;
        }
        if (clear / total > 1 - HEART_SHARE + HEART_SHARE * 0.5) reveal();
      } catch {
        /* canvas unreadable: the fallback button still reveals */
      }
    };

    const scratchAt = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(e.clientX - r.left, e.clientY - r.top, Math.max(16, W * 0.07), 0, 6.3);
      ctx.fill();
      const now = Date.now();
      if (now - lastCheck > 250) {
        lastCheck = now;
        check();
      }
    };

    const onDown = (e: PointerEvent) => {
      drawing = true;
      try {
        cv.setPointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
      scratchAt(e);
    };
    const onMove = (e: PointerEvent) => {
      if (drawing) scratchAt(e);
    };
    const onUp = () => {
      if (!drawing) return;
      drawing = false;
      check();
    };
    const onResize = () => {
      if (!revealedRef.current) paintCoat();
    };

    paintCoat();
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("resize", onResize);
    return () => {
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, [reveal]);

  return (
    <section className="sec parch" id="reveal">
      <h2 className="sec-head rv">{s.heading}</h2>
      <Rule className="rv" />
      <div className="scratch-stage rv" ref={stageRef}>
        <div className="heart-under">
          <svg viewBox="0 0 100 90" aria-hidden="true">
            <path d={HEART_D} fill="#f4ead4" stroke="#8f6a25" strokeWidth="1.2" />
            <path
              d="M50,82 C24,63 8,47 8,29 C8,17 17,9 27,9 C37,9 45,14 50,24 C55,14 63,9 73,9 C83,9 92,17 92,29 C92,47 76,63 50,82Z"
              fill="none"
              stroke="#b8903a"
              strokeWidth=".6"
              strokeDasharray="1.5 2"
            />
          </svg>
          {/* hidden from assistive tech until revealed, so the surprise is kept for everyone */}
          <div className="heart-copy" aria-hidden={!revealed} aria-live="polite">
            <span className="k">{s.kicker}</span>
            <span className="d">{s.date}</span>
            <span className="s">{s.weekday}</span>
            <span className="s">{s.time}</span>
          </div>
        </div>
        <canvas ref={canvasRef} className={`scratch-canvas${revealed ? " done" : ""}`} aria-hidden="true" />
      </div>
      <button className="link-btn rv" type="button" onClick={reveal}>
        {s.fallbackLabel}
      </button>
      <a className="btn ghost rv" href={calendarHref} target="_blank" rel="noopener">
        {inv.calendar.buttonLabel}
      </a>
    </section>
  );
}
