import React from "react";
import { Composition } from "remotion";
import { CentriIntro } from "./CentriIntro";
import { DURATION, FPS, HEIGHT, WIDTH } from "./timeline";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="CentriIntro"
      component={CentriIntro}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ withMusicCue: false }}
    />
    <Composition
      id="CentriIntroMusicCue"
      component={CentriIntro}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{ withMusicCue: true }}
    />
  </>
);
