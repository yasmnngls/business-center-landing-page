// Single source of truth for timing. All values are frames at 30fps.
// Retime the piece here; scenes only ever read their own local frame.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION = 1800; // 60s

export const SCENES = {
  coldOpen: { from: 0, duration: 180 }, //   0:00–0:06
  problem: { from: 180, duration: 240 }, //  0:06–0:14
  turn: { from: 420, duration: 180 }, //     0:14–0:20
  workflow: { from: 600, duration: 540 }, // 0:20–0:38
  trust: { from: 1140, duration: 300 }, //   0:38–0:48
  recap: { from: 1440, duration: 210 }, //   0:48–0:55
  close: { from: 1650, duration: 150 }, //   0:55–1:00
} as const;

// Workflow sub-beats (local to the workflow scene).
export const WORKFLOW_BEAT = 135;

// Marked gap for a music bed. Nothing is composed; this is where a track drops in.
// in:  the turn (black → "Centri") — the first moment of calm after the problem.
// out: music is fully gone before the final two seconds of stillness.
export const MUSIC_CUE = {
  in: SCENES.turn.from, // 420 → 0:14
  fadeOutStart: 1680, // 0:56
  out: 1740, // 0:58
} as const;
