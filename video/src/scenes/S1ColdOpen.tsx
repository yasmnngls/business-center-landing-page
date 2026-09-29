import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fadeOut, typeDuration, typed } from "../lib/anim";
import { COLORS, FONTS } from "../theme";

const LINE = "Where did this number come from?";
const START = 12;
const CPS = 18;

export const S1ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const shown = typed(LINE, frame, START, CPS);
  const done = START + typeDuration(LINE, CPS);
  // Solid caret: present while typing, then quietly leaves. It never blinks.
  const caret = frame < START ? 0 : fadeOut(frame, done + 24, 12);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "relative",
          fontFamily: FONTS.sans,
          fontSize: 56,
          fontWeight: 400,
          letterSpacing: "0.01em",
          color: COLORS.fg,
        }}
      >
        {/* Invisible full line reserves the width so the text doesn't shift while typing. */}
        <span style={{ visibility: "hidden" }}>{LINE}</span>
        <span style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap" }}>
          {shown}
          <span
            style={{
              display: "inline-block",
              width: 3,
              height: "1.05em",
              marginLeft: 6,
              verticalAlign: "-0.15em",
              background: COLORS.fg,
              opacity: caret,
            }}
          />
        </span>
      </div>
    </AbsoluteFill>
  );
};
