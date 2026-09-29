# Centri — 60s intro video

Remotion (React + TypeScript). 1920×1080, 30fps, 1800 frames, H.264.

```sh
npm install
npm run studio          # preview and scrub
npm run render:silent   # out/centri-intro-silent.mp4
npm run render:cue      # out/centri-intro-music-cue.mp4 (silent placeholder bed, see MUSIC_CUE.md)
npm run render          # both
```

## Where things live

- `src/timeline.ts`: all scene timings, in frames. Retime here. Scenes only read their own local frame.
- `src/theme.ts`: palette and type. Cobalt `#3D5AFE` is reserved for anything that represents traceable data: throughlines, trace lines, chart marks, the click ring and the review check.
- `src/scenes/S1…S7`: one component per scene, sequenced in `src/CentriIntro.tsx`.
- `src/lib/anim.ts`: `progress`, `reveal`, `settle` (a critically damped spring that never overshoots) and `typed`. All motion is `interpolate`/`spring` driven by the frame. There are no CSS animations.

Inter (400/500) is used for narrative type. IBM Plex Mono is used for anything inspectable: the query, definitions and source rows.

All data, IDs and amounts on screen are illustrative placeholders.
