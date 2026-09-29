# Music bed cue (placeholder)

No music is composed. `CentriIntroMusicCue` carries a silent placeholder track at the position where a bed would drop in.

| Mark          | Frame | Timecode | Why                                                           |
| ------------- | ----- | -------- | ------------------------------------------------------------- |
| Cue in        | 420   | 0:14     | The turn: black, then "Centri". The first calm after the problem montage. |
| Full level    | 450   | 0:15     | 1s fade-in                                                    |
| Fade out      | 1680  | 0:56     | "Centri" has returned                                         |
| Cue out       | 1740  | 0:58     | Silence for the final two seconds of stillness                |

0:00–0:14 (the cold open and the problem montage) is left dry on purpose.

## Dropping in a real track

1. Replace `public/music-placeholder.wav` with the track. Keep the name, or change `staticFile(...)` in `src/CentriIntro.tsx`.
2. If the track should start partway in, add `startFrom={frames}` to the `<Audio>`.
3. Change the frames in `MUSIC_CUE` in `src/timeline.ts`, and in `scripts/make-silence.mjs` if you still generate the placeholder.
4. Run `npm run render:cue`.
