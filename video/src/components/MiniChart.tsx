import React from "react";
import { COLORS } from "../theme";
import { Mono } from "./Type";

// Illustrative shape only — not real data.
export const CHART_VALUES = [0.42, 0.55, 0.5, 0.66, 0.72, 0.86];
export const CHART_LABELS = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];

export const CHART_PAD = { l: 56, r: 56, t: 90, b: 72 };

/** Geometry shared with scenes that need to point at a bar. */
export const barGeometry = (w: number, h: number, i: number) => {
  const inner = w - CHART_PAD.l - CHART_PAD.r;
  const slot = inner / CHART_VALUES.length;
  const barW = slot * 0.46;
  const cx = CHART_PAD.l + slot * (i + 0.5);
  const base = h - CHART_PAD.b;
  const maxH = h - CHART_PAD.t - CHART_PAD.b;
  const top = base - maxH * CHART_VALUES[i];
  return { cx, barW, base, top };
};

/**
 * A plain bar chart card. `grow(i)` returns 0 → 1 for each bar.
 * `highlight` + `dim` fade the other bars back so one bar reads as selected.
 */
export const MiniChart: React.FC<{
  width: number;
  height: number;
  grow?: (i: number) => number;
  highlight?: number;
  dim?: number;
  title?: string;
  chrome?: number; // opacity of labels/baseline
}> = ({ width, height, grow = () => 1, highlight, dim = 0, title = "Revenue · last 6 months", chrome = 1 }) => {
  const base = height - CHART_PAD.b;
  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        background: COLORS.surface,
        border: `1px solid ${COLORS.hairline}`,
        borderRadius: 18,
      }}
    >
      <Mono size={22} color={COLORS.muted} style={{ position: "absolute", left: CHART_PAD.l, top: 30, opacity: chrome }}>
        {title}
      </Mono>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <line
          x1={CHART_PAD.l}
          x2={width - CHART_PAD.r}
          y1={base}
          y2={base}
          stroke={COLORS.faint}
          strokeWidth={1.5}
          opacity={chrome}
        />
        {CHART_VALUES.map((_, i) => {
          const g = barGeometry(width, height, i);
          const p = Math.max(0, Math.min(1, grow(i)));
          const h = (g.base - g.top) * p;
          const isHi = highlight === i;
          return (
            <rect
              key={i}
              x={g.cx - g.barW / 2}
              y={g.base - h}
              width={g.barW}
              height={h}
              rx={4}
              fill={COLORS.accent}
              opacity={isHi ? 1 : 1 - dim * 0.72}
            />
          );
        })}
      </svg>
      {CHART_LABELS.map((label, i) => {
        const g = barGeometry(width, height, i);
        return (
          <Mono
            key={label}
            size={18}
            color={highlight === i && dim > 0.5 ? COLORS.fg : COLORS.muted}
            style={{ position: "absolute", top: base + 18, left: g.cx - 40, width: 80, textAlign: "center", opacity: chrome }}
          >
            {label}
          </Mono>
        );
      })}
    </div>
  );
};
