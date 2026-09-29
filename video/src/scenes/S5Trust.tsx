import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { lerp, progress, reveal, settle } from "../lib/anim";
import { COLORS } from "../theme";
import { Mono, Sans } from "../components/Type";
import { MiniChart, barGeometry } from "../components/MiniChart";
import { FullFrameSvg, TracePath } from "../components/TraceLine";
import { Cursor } from "../components/Cursor";

// The drill-to-detail moment. Everything inspectable is mono; the trace is the accent.

const HI = 5; // the bar being inspected
const CW = 1300;
const CH = 520;
const START = { x: 310, y: 280, s: 1 };
const END = { x: 860, y: 70, s: 920 / CW };

const bar = barGeometry(CW, CH, HI);

const DEF = { x: 900, y: 470, w: 880 };
const DEF_LINES = [
  { text: "// revenue: total of paid orders, per month", comment: true },
  { text: 'sum(orders.amount) where status = "paid"' },
  { text: "group by month  ·  source: orders" },
];
const DEF_TICK_Y = 546;

const ROWS_TOP = 652;
const ROW_H = 52;
const rowY = (i: number) => ROWS_TOP + 58 + ROW_H * i + ROW_H / 2;
// Placeholder rows — illustrative only.
const ROWS = [
  { id: "ord_0406", month: "2026-07", status: "paid", amount: "940.00", match: false },
  { id: "ord_0409", month: "2026-08", status: "paid", amount: "1,200.00", match: true },
  { id: "ord_0410", month: "2026-08", status: "refunded", amount: "310.00", match: false },
  { id: "ord_0411", month: "2026-08", status: "paid", amount: "850.00", match: true },
  { id: "ord_0412", month: "2026-08", status: "paid", amount: "2,100.00", match: true },
];

const GUTTER = 872;
// Leave from the bar's lower-right corner so the line clears the month label.
const TRACE_START = { x: END.x + END.s * (bar.cx + bar.barW / 2) - 5, y: END.y + END.s * bar.base + 4 };
const ELBOW_Y = 452;
const LAST_Y = rowY(ROWS.length - 1);
const TRACE_D = `M ${TRACE_START.x} ${TRACE_START.y} V ${ELBOW_Y} H ${GUTTER} V ${LAST_Y}`;
const TRACE_LEN = ELBOW_Y - TRACE_START.y + (TRACE_START.x - GUTTER) + (LAST_Y - ELBOW_Y);
const TRACE_AT = 132;
const TRACE_DUR = 42;
/** Frame at which the trace head reaches a given y on the gutter. */
const reachAt = (y: number) =>
  TRACE_AT + TRACE_DUR * ((ELBOW_Y - TRACE_START.y + (TRACE_START.x - GUTTER) + (y - ELBOW_Y)) / TRACE_LEN);

const linear = (t: number) => t;
const COLS = [0, 200, 380];

export const S5Trust: React.FC = () => {
  const f = useCurrentFrame();

  // Cursor travels to the bar and clicks once.
  const move = settle(f, 14, 32);
  const tipX = lerp(1560, START.x + bar.cx, move);
  const tipY = lerp(1010, START.y + (bar.top + bar.base) / 2, move);
  const press = progress(f, 48, 4) * (1 - progress(f, 52, 6));
  const ring = progress(f, 50, 18, Easing.out(Easing.quad));
  const selected = progress(f, 52, 12);

  // Curtain: the chart lifts away to reveal what's underneath.
  const lift = settle(f, 66, 34);
  const cx = lerp(START.x, END.x, lift);
  const cy = lerp(START.y, END.y, lift);
  const cs = lerp(START.s, END.s, lift);

  const trace = progress(f, TRACE_AT, TRACE_DUR, linear);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          transformOrigin: "0 0",
          transform: `scale(${cs})`,
          opacity: progress(f, 0, 10),
        }}
      >
        <MiniChart width={CW} height={CH} highlight={HI} dim={selected} />
      </div>

      {/* Definition, in plain language first */}
      <div
        style={{
          position: "absolute",
          left: DEF.x,
          top: DEF.y,
          width: DEF.w,
          padding: "22px 28px",
          boxSizing: "border-box",
          borderRadius: 14,
          background: COLORS.surface,
          border: `1px solid ${COLORS.hairline}`,
          opacity: progress(f, 88, 14),
        }}
      >
        {DEF_LINES.map((l, i) => (
          <div key={l.text} style={reveal(f, 96 + i * 8, 14, 6)}>
            <Mono size={24} color={l.comment ? COLORS.muted : COLORS.fg}>
              {l.text}
            </Mono>
          </div>
        ))}
      </div>

      {/* Source rows */}
      <div
        style={{
          position: "absolute",
          left: DEF.x,
          top: ROWS_TOP,
          width: DEF.w,
          height: 58 + ROW_H * ROWS.length + 14,
          borderRadius: 14,
          background: COLORS.surface,
          border: `1px solid ${COLORS.hairline}`,
          boxSizing: "border-box",
          overflow: "hidden",
          opacity: progress(f, 116, 14),
        }}
      >
        <RowCells
          y={14}
          cells={["id", "month", "status", "amount"]}
          color={COLORS.muted}
          size={20}
        />
        {ROWS.map((r, i) => {
          const hit = r.match ? progress(f, reachAt(rowY(i)) + 4, 10) : 0;
          const settleDim = progress(f, reachAt(LAST_Y) + 6, 12);
          const top = 58 + ROW_H * i;
          return (
            <div key={r.id} style={reveal(f, 120 + i * 3, 12, 6)}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top,
                  height: ROW_H,
                  background: COLORS.accentSoft,
                  opacity: hit,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top,
                  width: 3,
                  height: ROW_H,
                  background: COLORS.accent,
                  opacity: hit,
                }}
              />
              <RowCells
                y={top + 10}
                cells={[r.id, r.month, r.status, r.amount]}
                color={r.match ? COLORS.fg : lerpColor(settleDim)}
                size={22}
              />
            </div>
          );
        })}
      </div>

      {/* The trace: from the bar, past its definition, down to the rows it came from */}
      <FullFrameSvg>
        <circle cx={TRACE_START.x} cy={TRACE_START.y} r={5 * progress(f, TRACE_AT - 6, 8)} fill={COLORS.accent} />
        <TracePath d={TRACE_D} progress={trace} width={2.5} />
        <TracePath d={`M ${GUTTER} ${DEF_TICK_Y} H ${DEF.x}`} progress={progress(f, reachAt(DEF_TICK_Y), 6)} width={2.5} />
        {ROWS.map((r, i) =>
          r.match ? (
            <TracePath
              key={r.id}
              d={`M ${GUTTER} ${rowY(i)} H ${DEF.x}`}
              progress={progress(f, reachAt(rowY(i)), 6)}
              width={2.5}
            />
          ) : null
        )}
      </FullFrameSvg>

      {/* The line the whole video exists to land */}
      <div style={{ position: "absolute", left: 140, top: 430, width: 700, ...reveal(f, 196, 24, 12) }}>
        <Sans size={60} weight="medium" tracking="0.005em" style={{ lineHeight: 1.16 }}>
          Every number,
          <br />
          traced back to
          <br />
          where it came from.
        </Sans>
      </div>

      <Cursor x={tipX} y={tipY} press={press} ring={ring} opacity={progress(f, 10, 8) * (1 - progress(f, 64, 10))} />
    </AbsoluteFill>
  );
};

// Non-matching rows fade from fg to muted once the trace has landed.
const lerpColor = (t: number) => `rgba(245, 245, 240, ${lerp(1, 0.4, t)})`;

const RowCells: React.FC<{ y: number; cells: string[]; color: string; size: number }> = ({ y, cells, color, size }) => (
  <>
    {cells.slice(0, 3).map((c, i) => (
      <Mono key={i} size={size} color={color} style={{ position: "absolute", left: 32 + COLS[i], top: y }}>
        {c}
      </Mono>
    ))}
    <Mono size={size} color={color} style={{ position: "absolute", right: 32, top: y, textAlign: "right" }}>
      {cells[3]}
    </Mono>
  </>
);
