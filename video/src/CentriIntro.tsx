import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { COLORS } from "./theme";
import { MUSIC_CUE, SCENES } from "./timeline";
import { S1ColdOpen } from "./scenes/S1ColdOpen";
import { S2Problem } from "./scenes/S2Problem";
import { S3Turn } from "./scenes/S3Turn";
import { S4Workflow } from "./scenes/S4Workflow";
import { S5Trust } from "./scenes/S5Trust";
import { S6Recap } from "./scenes/S6Recap";
import { S7Close } from "./scenes/S7Close";

const ORDER = [
  { key: "coldOpen", C: S1ColdOpen },
  { key: "problem", C: S2Problem },
  { key: "turn", C: S3Turn },
  { key: "workflow", C: S4Workflow },
  { key: "trust", C: S5Trust },
  { key: "recap", C: S6Recap },
  { key: "close", C: S7Close },
] as const;

export const CentriIntro: React.FC<{ withMusicCue?: boolean }> = ({ withMusicCue = false }) => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
    {ORDER.map(({ key, C }) => (
      <Sequence key={key} name={key} from={SCENES[key].from} durationInFrames={SCENES[key].duration}>
        <C />
      </Sequence>
    ))}

    {withMusicCue ? (
      // MUSIC BED CUE — placeholder only. Swap public/music-placeholder.wav for the real track.
      <Sequence name="♪ music bed (placeholder)" from={MUSIC_CUE.in} durationInFrames={MUSIC_CUE.out - MUSIC_CUE.in}>
        <Audio
          src={staticFile("music-placeholder.wav")}
          volume={(f) =>
            interpolate(
              f,
              [0, 30, MUSIC_CUE.fadeOutStart - MUSIC_CUE.in, MUSIC_CUE.out - MUSIC_CUE.in],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
          }
        />
      </Sequence>
    ) : null}
  </AbsoluteFill>
);
