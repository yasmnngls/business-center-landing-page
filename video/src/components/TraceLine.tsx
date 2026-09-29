import React from "react";
import { COLORS } from "../theme";

/**
 * A path that draws itself forward. `progress` 0 → 1.
 * Rendered inside a full-frame SVG so coordinates are frame pixels.
 */
export const TracePath: React.FC<{
  d: string;
  progress: number;
  width?: number;
  color?: string;
  opacity?: number;
}> = ({ d, progress, width = 2, color = COLORS.accent, opacity = 1 }) => (
  <path
    d={d}
    pathLength={1}
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray="1 1"
    strokeDashoffset={1 - Math.max(0, Math.min(1, progress))}
    opacity={progress <= 0 ? 0 : opacity}
  />
);

export const FullFrameSvg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <svg
    width={1920}
    height={1080}
    viewBox="0 0 1920 1080"
    style={{ position: "absolute", inset: 0, overflow: "visible", ...style }}
  >
    {children}
  </svg>
);
