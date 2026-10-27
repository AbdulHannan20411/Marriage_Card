"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/**
 * Garland leaves and flowers (~500 SVG groups) pop in by scale, rotation and opacity. GSAP measures
 * every SVG element it animates (getBBox), and repeats that on each ScrollTrigger refresh, which froze
 * slower phones for seconds. Instead GSAP animates these plain numbers and `draw` writes each group's
 * transform around its pre-measured pivot (data-svg-origin, from lib/flora.ts): same easing and
 * stagger, no layout reads.
 */
function floraPop(selector: string) {
  const items = gsap.utils.toArray<SVGGElement>(selector).map((el) => {
    const [ox, oy] = (el.dataset.svgOrigin || "0 0").split(" ").map(Number);
    return { el, ox, oy, s: 1, r: 0, o: 1, last: "" };
  });
  const draw = () => {
    for (const p of items) {
      const t = `translate(${p.ox} ${p.oy}) rotate(${p.r}) scale(${p.s}) translate(${-p.ox} ${-p.oy})`;
      if (t + p.o === p.last) continue;
      p.last = t + p.o;
      p.el.setAttribute("transform", t);
      p.el.style.opacity = String(p.o);
    }
  };
  return { items, draw };
}

/** Set by the boot script in app/layout.tsx while this component's code is still downloading. */
type BootWindow = Window & { __sealTap?: boolean; __bootTimer?: number };

/**
 * All scroll-driven motion for the card. Renders nothing; it drives the server-rendered markup by
 * id and class. With reduced motion it removes `html.js`, which swaps the doors for a static cover.
 */
export default function InvitationMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const boot = window as BootWindow;
    const $ = (id: string) => document.getElementById(id);

    // ?photo=<url> previews a different couple photo inside the dome
    const photo = new URLSearchParams(location.search).get("photo");
    if (photo) $("photoImg")?.setAttribute("href", photo);

    // Reduced motion, or the boot script already gave up waiting and showed the static layout:
    // stay static rather than rearranging a page the visitor may already be reading.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !root.classList.contains("js")) {
      root.classList.remove("js", "booting", "seal-queued");
      return;
    }
    window.clearTimeout(boot.__bootTimer);
    root.classList.add("js");
    // every visit starts on the closed doors, never mid-animation
    if (!location.hash) window.scrollTo(0, 0);
    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis | null = null;
    const raf = (t: number) => lenis?.raf(t * 1000);
    try {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    } catch {
      lenis = null;
    }

    const spawned: HTMLElement[] = [];
    const spawn = (host: HTMLElement, className: string) => {
      const el = document.createElement("i");
      el.className = className;
      host.appendChild(el);
      spawned.push(el);
      return el;
    };

    const seal = $("seal");
    const ctx = gsap.context(() => {
      /* Looping decoration (sway, dust, birds) only runs while its scene is on screen, so phones
         aren't repainting hundreds of hidden leaves while the visitor reads further down. */
      const loops: Record<string, gsap.core.Tween[]> = {};
      const ambient = (scene: string, tween: gsap.core.Tween) => {
        tween.pause();
        (loops[scene] ||= []).push(tween);
      };
      const gateFlora = floraPop("#gate .fi");
      const coupleFlora = floraPop("#couple .fi");
      const gardenFlora = floraPop("#garden .fi");

      /* cover: doors split, seal spins, curtains draw aside, garden grows in */
      const tl = gsap.timeline({
        scrollTrigger: {
          id: "gate",
          trigger: "#gate",
          start: "top top",
          end: "+=210%",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          onUpdate: (self) => seal?.classList.toggle("opened", self.progress > 0.004),
          onRefresh: gateFlora.draw,
        },
      });
      tl.to(".seal-art", { rotate: 220, scale: 1.1, duration: 1.2, ease: "power1.inOut" }, 0)
        .to(".seal", { opacity: 0, duration: 0.35 }, 0.9)
        .to(".door-edge", { opacity: 1, duration: 0.25 }, 1.0)
        .to(".dl", { xPercent: -101, duration: 1.4, ease: "power2.inOut" }, 0.8)
        .to(".dr", { xPercent: 101, duration: 1.4, ease: "power2.inOut" }, 0.8)
        .to(".cl", { scaleX: 0.1, duration: 1.3, ease: "power2.inOut" }, 2.0)
        .to(".cr", { scaleX: 0.1, duration: 1.3, ease: "power2.inOut" }, 2.0)
        .from(gateFlora.items, { s: 0, r: -28, o: 0, duration: 1.1, stagger: { each: 0.025, from: "start" }, ease: "back.out(1.6)", onUpdate: gateFlora.draw }, 2.1)
        .from("#gate .bird", { x: -120, y: 30, opacity: 0, duration: 1.6, stagger: 0.15, ease: "power2.out" }, 2.3)
        .from("#gate .gr", { y: 28, opacity: 0, duration: 0.9, stagger: 0.18, ease: "power3.out" }, 2.3)
        .to({}, { duration: 0.9 });
      ambient("#gate", gsap.to("#gate .bird", { y: "+=8", x: "+=14", duration: 3.2, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.4 }));
      gsap.from(".seal", { scale: 0.6, opacity: 0, duration: 1.1, ease: "back.out(1.6)", delay: 0.2 });

      /* the couple walks in together */
      const cs = gsap.timeline({
        scrollTrigger: { trigger: "#couple", start: "top top", end: "+=140%", pin: true, scrub: 0.7, anticipatePin: 1, onRefresh: coupleFlora.draw },
      });
      cs.from("#dome", { y: 70, opacity: 0, scale: 0.94, transformOrigin: "50% 100%", duration: 1.2, ease: "power2.out" }, 0)
        .fromTo("#photoImg", { opacity: 0, scale: 1.14, transformOrigin: "50% 40%" }, { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" }, 0.25)
        .from("#couple .cp", { y: 24, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }, 1.2)
        .from(coupleFlora.items, { s: 0, r: 24, o: 0, duration: 1.0, stagger: 0.02, ease: "back.out(1.6)", onUpdate: coupleFlora.draw }, 0.5)
        .to({}, { duration: 0.7 });
      ["#gate", "#couple", "#garden"].forEach((s) => {
        ambient(s, gsap.to(`${s} .flora.tl, ${s} .flora.bl`, { rotate: 1.6, transformOrigin: "0% 50%", duration: 3.4, yoyo: true, repeat: -1, ease: "sine.inOut" }));
        ambient(s, gsap.to(`${s} .flora.tr, ${s} .flora.br`, { rotate: -1.6, transformOrigin: "100% 50%", duration: 3.8, yoyo: true, repeat: -1, ease: "sine.inOut" }));
      });

      /* petals fall once the couple scene is mostly in; scrolling back to its start re-arms them */
      const couple = $("couple");
      let showered = false;
      const petals = () => {
        if (!couple) return;
        const cols = ["#b02a45", "#e2c070", "#7d1829", "#f4d98a"];
        for (let i = 0; i < 28; i++) {
          const p = spawn(couple, "petal");
          p.style.background = cols[i % 4];
          p.style.left = 10 + Math.random() * 80 + "%";
          p.style.top = "-4%";
          gsap.fromTo(
            p,
            { y: 0, x: 0, rotate: 0, opacity: 0 },
            {
              y: couple.clientHeight * (0.7 + Math.random() * 0.3),
              x: (Math.random() - 0.5) * 140,
              rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              opacity: 1,
              duration: 3 + Math.random() * 2,
              ease: "sine.in",
              delay: Math.random() * 0.8,
              onComplete: () => p.remove(),
            },
          );
          gsap.to(p, { opacity: 0, duration: 0.7, delay: 3.3 + Math.random(), overwrite: false });
        }
      };
      ScrollTrigger.create({
        trigger: "#couple",
        start: "top top",
        end: "+=140%",
        onUpdate: (s) => {
          if (!showered && s.progress > 0.62) {
            showered = true;
            ctx.add(petals);
          }
          if (s.progress < 0.1) showered = false;
        },
      });

      /* gold dust drifting in the garden scenes */
      ["gate", "couple"].forEach((id) => {
        const host = $(id);
        if (!host) return;
        for (let i = 0; i < 14; i++) {
          const d = spawn(host, "dust");
          d.style.left = Math.random() * 100 + "%";
          d.style.top = 10 + Math.random() * 70 + "%";
          d.style.opacity = "0";
          ambient(`#${id}`, gsap.to(d, { y: -40 - Math.random() * 60, x: (Math.random() - 0.5) * 50, opacity: 0.85, duration: 2.4 + Math.random() * 2, yoyo: true, repeat: -1, ease: "sine.inOut", delay: Math.random() * 3 }));
        }
      });

      /* reveals */
      gsap.utils.toArray<HTMLElement>(".rv").forEach((el) => {
        gsap.from(el, { y: 36, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
      });
      gsap.from(".panel", { y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: "back.out(1.4)", scrollTrigger: { trigger: ".count-grid", start: "top 92%", once: true } });
      gsap.from(gardenFlora.items, { s: 0, o: 0, duration: 0.9, stagger: 0.02, ease: "back.out(1.5)", onUpdate: gardenFlora.draw, scrollTrigger: { trigger: "#garden", start: "top 70%", once: true } });
      [gateFlora, coupleFlora, gardenFlora].forEach((f) => f.draw());

      Object.entries(loops).forEach(([scene, tweens]) =>
        ScrollTrigger.create({
          trigger: scene,
          start: "top bottom",
          end: "bottom top",
          onToggle: (st) => tweens.forEach((t) => (st.isActive ? t.resume() : t.pause())),
        }),
      );

      /* timeline draws itself */
      gsap.to("#tl-fill", { scaleY: 1, ease: "none", scrollTrigger: { trigger: "#tl", start: "top 70%", end: "bottom 60%", scrub: true } });
      gsap.utils.toArray<HTMLElement>(".tl-item").forEach((it) => {
        ScrollTrigger.create({ trigger: it, start: "top 68%", onEnter: () => it.classList.add("on"), onLeaveBack: () => it.classList.remove("on") });
      });
      gsap.to("#closing .medal", { rotate: 90, ease: "none", scrollTrigger: { trigger: "#closing", start: "top bottom", end: "bottom bottom", scrub: true } });

      /* photo arches: slow parallax inside each frame, and a staggered rise into view */
      gsap.utils.toArray<HTMLElement>(".arch img").forEach((im) => {
        gsap.fromTo(im, { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: im.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>(".pics").forEach((r) => {
        gsap.from(r.querySelectorAll(".arch"), { y: 50, opacity: 0, duration: 1, stagger: 0.16, ease: "power3.out", scrollTrigger: { trigger: r, start: "top 88%", once: true } });
      });
    });

    /* tap to open: glide through the whole door sequence */
    const onSeal = () => {
      seal?.classList.add("opened");
      // tell BackgroundMusic (the flag covers a listener that mounts after this fires)
      root.dataset.opened = "1";
      window.dispatchEvent(new Event("invitation:open"));
      const st = ScrollTrigger.getById("gate");
      if (!st) return;
      const to = st.start + (st.end - st.start) * 0.98;
      if (lenis) lenis.scrollTo(to, { duration: 3.4, easing: easeInOutQuad });
      else {
        const o = { y: window.scrollY };
        gsap.to(o, { y: to, duration: 3.4, ease: "power2.inOut", onUpdate: () => window.scrollTo(0, o.y) });
      }
    };
    seal?.addEventListener("click", onSeal);

    // Ready: let the visitor scroll, and play a seal tap they made while the page was loading.
    root.classList.remove("booting", "seal-queued");
    if (boot.__sealTap) {
      boot.__sealTap = false;
      onSeal();
    }

    // Web fonts change text heights, so re-measure once they arrive (only if they weren't already in).
    let alive = true;
    if (document.fonts && document.fonts.status !== "loaded") document.fonts.ready.then(() => alive && ScrollTrigger.refresh());

    // Fetch the lazy photos in the background once things are quiet, so a connection that drops
    // while the visitor is reading doesn't leave empty frames further down.
    const warm = () => document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => (new Image().src = img.currentSrc || img.src));
    const hasIdle = typeof window.requestIdleCallback === "function"; // missing on older Safari
    const idle = hasIdle ? window.requestIdleCallback(warm, { timeout: 4000 }) : window.setTimeout(warm, 2500);

    return () => {
      alive = false;
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      seal?.removeEventListener("click", onSeal);
      gsap.killTweensOf(spawned);
      spawned.forEach((el) => el.remove());
      ctx.revert();
      document.querySelectorAll<SVGGElement>(".fi").forEach((el) => {
        el.removeAttribute("transform");
        el.style.opacity = "";
      });
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
    };
  }, []);

  return null;
}
