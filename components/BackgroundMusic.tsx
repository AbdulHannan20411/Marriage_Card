"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Gentle background level; 1 is full volume. */
const VOLUME = 0.25;
const FADE_IN_S = 2.5;
const FADE_OUT_S = 0.4;
/** Remembers a guest who switched the music off, so a second visit stays quiet. */
const MUTED_KEY = "invitation-music-off";

type Graph = { ctx: AudioContext; gain: GainNode };

const readMuted = () => {
  try {
    return localStorage.getItem(MUTED_KEY) === "1";
  } catch {
    return false;
  }
};
const writeMuted = (off: boolean) => {
  try {
    if (off) localStorage.setItem(MUTED_KEY, "1");
    else localStorage.removeItem(MUTED_KEY);
  } catch {
    /* private mode: preference just isn't kept */
  }
};

/**
 * Optional background nasheed. It starts when the seal is tapped (the "invitation:open" event from
 * InvitationMotion), fades in to a low level, and can be toggled with the round button. The file is
 * only downloaded once it plays. Volume goes through Web Audio because iOS ignores audio.volume.
 */
export default function BackgroundMusic({ src, title }: { src: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const pauseTimer = useRef<number | undefined>(undefined);
  const wantPlaying = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState(false);
  /** Autoplay was blocked (e.g. the tap happened before the page loaded): invite a manual tap. */
  const [nudge, setNudge] = useState(false);

  const fadeTo = useCallback((level: number, seconds: number) => {
    const g = graphRef.current;
    if (g) {
      const now = g.ctx.currentTime;
      g.gain.gain.cancelScheduledValues(now);
      g.gain.gain.setValueAtTime(g.gain.gain.value, now);
      g.gain.gain.linearRampToValueAtTime(level, now + seconds);
    } else if (audioRef.current) {
      audioRef.current.volume = level;
    }
  }, []);

  const play = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    window.clearTimeout(pauseTimer.current);
    // The Web Audio graph has to be created during a tap, so build it on first play.
    if (!graphRef.current) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AC) {
        try {
          const ctx = new AC();
          const gain = ctx.createGain();
          gain.gain.value = 0;
          ctx.createMediaElementSource(a).connect(gain).connect(ctx.destination);
          graphRef.current = { ctx, gain };
        } catch {
          /* fall back to audio.volume below */
        }
      }
      if (!graphRef.current) a.volume = 0;
    }
    try {
      await graphRef.current?.ctx.resume();
      await a.play();
      fadeTo(VOLUME, FADE_IN_S);
      wantPlaying.current = true;
      setPlaying(true);
      setNudge(false);
    } catch {
      wantPlaying.current = false;
      setPlaying(false);
      setNudge(true);
    }
  }, [fadeTo]);

  const pause = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    wantPlaying.current = false;
    setPlaying(false);
    fadeTo(0, FADE_OUT_S);
    pauseTimer.current = window.setTimeout(() => a.pause(), FADE_OUT_S * 1000);
  }, [fadeTo]);

  useEffect(() => {
    const root = document.documentElement;
    // In the static layout (reduced motion, or the slow-connection fallback) there is no seal, so
    // nothing autoplays; CSS shows the button from the start (html:not(.js) .music).
    const onOpen = () => {
      setShown(true);
      if (!readMuted()) void play();
    };
    const onScroll = () => {
      if (window.scrollY > 40) setShown(true);
    };
    // Pause while the guest is in another app or tab, and pick up again when they return.
    const onVisibility = () => {
      const a = audioRef.current;
      if (!a) return;
      if (document.hidden) a.pause();
      else if (wantPlaying.current) void a.play().catch(() => {});
    };

    window.addEventListener("invitation:open", onOpen);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    // The doors may already have been opened before this mounted.
    if (root.dataset.opened === "1") onOpen();

    const audio = audioRef.current;
    return () => {
      window.removeEventListener("invitation:open", onOpen);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(pauseTimer.current);
      audio?.pause();
      void graphRef.current?.ctx.close();
      graphRef.current = null;
    };
  }, [play]);

  const toggle = () => {
    if (playing) {
      writeMuted(true);
      pause();
    } else {
      writeMuted(false);
      void play();
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} preload="none" loop />
      <button
        type="button"
        className={`music${shown ? " shown" : ""}${playing ? " on" : ""}${nudge ? " nudge" : ""}`}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        title={playing ? `Pause ${title}` : `Play ${title}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill="currentColor" fillOpacity=".25" />
          {playing ? (
            <>
              <path d="M15.5 9.2a4 4 0 0 1 0 5.6" />
              <path d="M18.2 6.6a7.6 7.6 0 0 1 0 10.8" />
            </>
          ) : (
            <path d="M16 9.5l5 5M21 9.5l-5 5" />
          )}
        </svg>
      </button>
    </>
  );
}
