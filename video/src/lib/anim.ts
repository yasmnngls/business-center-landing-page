import { Easing, interpolate, spring } from "remotion";
import { FPS } from "../timeline";

// Matches the landing page's --ease-out token.
export const easeOut = Easing.bezier(0.23, 1, 0.32, 1);
export const easeInOut = Easing.bezier(0.77, 0, 0.175, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 between start and start+dur, eased out. */
export const progress = (frame: number, start: number, dur: number, easing = easeOut) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing });

/** 1 → 0 between start and start+dur. */
export const fadeOut = (frame: number, start: number, dur: number) =>
  1 - progress(frame, start, dur, easeInOut);

/** Opacity + small upward drift. Returns a style object. */
export const reveal = (frame: number, start: number, dur = 18, distance = 12) => {
  const p = progress(frame, start, dur);
  return { opacity: p, transform: `translateY(${(1 - p) * distance}px)` };
};

/** Critically damped spring — precise, never overshoots. */
export const settle = (frame: number, start: number, durationInFrames = 24) =>
  spring({
    frame: frame - start,
    fps: FPS,
    durationInFrames,
    config: { damping: 200, mass: 1, stiffness: 120, overshootClamping: true },
  });

/** Characters revealed so far for a typewriter at `cps` chars/sec. */
export const typed = (text: string, frame: number, start: number, cps = 18) => {
  const n = Math.floor(Math.max(0, frame - start) * (cps / FPS));
  return text.slice(0, Math.min(n, text.length));
};

export const typeDuration = (text: string, cps = 18) => Math.ceil((text.length / cps) * FPS);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
