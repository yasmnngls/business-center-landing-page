import React from "react";
import { COLORS } from "../theme";

/** Pointer with a single, non-repeating click ring. `x,y` is the tip. */
export const Cursor: React.FC<{ x: number; y: number; press: number; ring: number; opacity?: number }> = ({
  x,
  y,
  press,
  ring,
  opacity = 1,
}) => (
  <div style={{ position: "absolute", left: 0, top: 0, opacity }}>
    {ring > 0 && ring < 1 ? (
      <div
        style={{
          position: "absolute",
          left: x - 40,
          top: y - 40,
          width: 80,
          height: 80,
          borderRadius: 40,
          border: `2px solid ${COLORS.accent}`,
          transform: `scale(${0.3 + ring * 0.9})`,
          opacity: 1 - ring,
        }}
      />
    ) : null}
    <svg
      width={44}
      height={44}
      viewBox="0 0 24 24"
      style={{
        position: "absolute",
        left: x - 9,
        top: y - 5.5,
        transform: `scale(${1 - press * 0.12})`,
        transformOrigin: "9px 5.5px",
      }}
    >
      <path
        d="M5 3l13 8.5-6 1.2 3.4 6.6-2.6 1.3-3.4-6.6L5 18z"
        fill={COLORS.fg}
        stroke={COLORS.bg}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </svg>
  </div>
);
