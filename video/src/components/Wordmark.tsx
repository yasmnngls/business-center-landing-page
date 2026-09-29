import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { reveal } from "../lib/anim";
import { COLORS } from "../theme";
import { Sans } from "./Type";

/** "Centri" + one quiet line beneath. Shared by the turn and the close so they match exactly. */
export const Wordmark: React.FC<{ sub: string; markAt?: number; subAt?: number }> = ({
  sub,
  markAt = 15,
  subAt = 60,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div style={reveal(frame, markAt, 30, 8)}>
          <Sans size={76} weight="medium" tracking="0.06em">
            Centri
          </Sans>
        </div>
        <div style={reveal(frame, subAt, 24, 8)}>
          <Sans size={30} color={COLORS.muted} tracking="0.02em">
            {sub}
          </Sans>
        </div>
      </div>
    </AbsoluteFill>
  );
};
