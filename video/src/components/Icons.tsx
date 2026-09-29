import React from "react";
import { COLORS } from "../theme";

const stroke = {
  fill: "none",
  stroke: COLORS.fg,
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const SheetIcon: React.FC<{ size?: number }> = ({ size = 96 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <rect x="7" y="9" width="34" height="30" rx="4" {...stroke} />
    <line x1="7" y1="19" x2="41" y2="19" {...stroke} />
    <line x1="7" y1="29" x2="41" y2="29" {...stroke} />
    <line x1="19" y1="9" x2="19" y2="39" {...stroke} />
    <line x1="30" y1="9" x2="30" y2="39" {...stroke} />
  </svg>
);

export const DatabaseIcon: React.FC<{ size?: number }> = ({ size = 96 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <ellipse cx="24" cy="11" rx="14" ry="5" {...stroke} />
    <path d="M10 11v26c0 2.8 6.3 5 14 5s14-2.2 14-5V11" {...stroke} />
    <path d="M10 24c0 2.8 6.3 5 14 5s14-2.2 14-5" {...stroke} />
  </svg>
);

export const DocIcon: React.FC<{ size?: number }> = ({ size = 96 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path d="M13 6h15l9 9v27H13z" {...stroke} />
    <path d="M28 6v9h9" {...stroke} />
    <line x1="18" y1="24" x2="32" y2="24" {...stroke} />
    <line x1="18" y1="30" x2="32" y2="30" {...stroke} />
    <line x1="18" y1="36" x2="26" y2="36" {...stroke} />
  </svg>
);

export const PersonIcon: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = COLORS.fg }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="17" r="7" {...stroke} stroke={color} />
    <path d="M10 40c1.5-7.5 7-11 14-11s12.5 3.5 14 11" {...stroke} stroke={color} />
  </svg>
);

/** Checkmark that draws itself. */
export const Check: React.FC<{ size?: number; progress: number; color?: string; width?: number }> = ({
  size = 40,
  progress,
  color = COLORS.accent,
  width = 3.5,
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path
      d="M11 25l9 9 17-19"
      pathLength={1}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="1 1"
      strokeDashoffset={1 - Math.max(0, Math.min(1, progress))}
      opacity={progress <= 0 ? 0 : 1}
    />
  </svg>
);
