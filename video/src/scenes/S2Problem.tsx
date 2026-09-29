import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { lerp, progress, reveal, settle } from "../lib/anim";
import { Mono, Sans } from "../components/Type";
import { COLORS } from "../theme";

// Deadpan vignettes. Everything here is grey on purpose: none of it is traceable,
// so none of it gets the accent color.

const BEAT_A = 62; // spreadsheet
const BEAT_B = 62; // chat
const CAL_FROM = BEAT_A + BEAT_B;

export const S2Problem: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={BEAT_A} layout="none">
      <Spreadsheet />
    </Sequence>
    <Sequence from={BEAT_A} durationInFrames={BEAT_B} layout="none">
      <Chat />
    </Sequence>
    <Sequence from={CAL_FROM} layout="none">
      <CalendarWithOverlay />
    </Sequence>
  </AbsoluteFill>
);

/* ---------------- Spreadsheet: copy, paste, paste again ---------------- */

const COLS = 7;
const ROWS = 8;
const CW = 170;
const CH = 54;
const GRID_W = COLS * CW;
const GRID_H = ROWS * CH;
const GX = (1920 - GRID_W) / 2;
const GY = (1080 - GRID_H) / 2 - 20;

// Deterministic "content" widths — grey filler, not numbers.
const fill = (r: number, c: number) => 0.35 + (((r * 7 + c * 13) % 9) / 9) * 0.45;

const SOURCE = { r: 2, c: 4 };
const PASTES = [
  { r: 5, c: 1, at: 16 },
  { r: 7, c: 5, at: 36 },
];

const Cell: React.FC<{ r: number; c: number; w: number; opacity?: number; style?: React.CSSProperties }> = ({
  r,
  c,
  w,
  opacity = 1,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: GX + c * CW,
      top: GY + r * CH,
      width: CW,
      height: CH,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 16px",
      boxSizing: "border-box",
      opacity,
      ...style,
    }}
  >
    <div style={{ width: `${w * 100}%`, height: 10, borderRadius: 5, background: COLORS.faint }} />
  </div>
);

const Spreadsheet: React.FC = () => {
  const frame = useCurrentFrame();
  const selected = progress(frame, 4, 6);

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: COLS + 1 }).map((_, i) => (
          <line key={`c${i}`} x1={GX + i * CW} x2={GX + i * CW} y1={GY} y2={GY + GRID_H} stroke={COLORS.hairline} />
        ))}
        {Array.from({ length: ROWS + 1 }).map((_, i) => (
          <line key={`r${i}`} x1={GX} x2={GX + GRID_W} y1={GY + i * CH} y2={GY + i * CH} stroke={COLORS.hairline} />
        ))}
      </svg>

      {Array.from({ length: ROWS }).flatMap((_, r) =>
        Array.from({ length: COLS }).map((__, c) => {
          const isTarget = PASTES.some((p) => p.r === r && p.c === c);
          if (isTarget) return null;
          if ((r + c * 3) % 5 === 0) return null; // some empty cells
          return <Cell key={`${r}-${c}`} r={r} c={c} w={fill(r, c)} />;
        })
      )}

      {/* Selection on the source cell: dashed, static — no marching ants. */}
      <div
        style={{
          position: "absolute",
          left: GX + SOURCE.c * CW - 1,
          top: GY + SOURCE.r * CH - 1,
          width: CW + 2,
          height: CH + 2,
          border: `2px dashed ${COLORS.fg}`,
          boxSizing: "border-box",
          opacity: selected,
        }}
      />

      {PASTES.map((p, i) => {
        const t = settle(frame, p.at, 16);
        const x = lerp(SOURCE.c, p.c, t);
        const y = lerp(SOURCE.r, p.r, t);
        const landed = frame >= p.at + 16;
        return (
          <React.Fragment key={i}>
            {frame >= p.at ? (
              <div
                style={{
                  position: "absolute",
                  left: GX + x * CW,
                  top: GY + y * CH,
                  width: CW,
                  height: CH,
                  border: landed ? "none" : `1px solid ${COLORS.muted}`,
                  background: landed ? "transparent" : COLORS.surface,
                  boxSizing: "border-box",
                }}
              />
            ) : null}
            {frame >= p.at ? (
              <Cell r={0} c={0} w={fill(SOURCE.r, SOURCE.c)} style={{ left: GX + x * CW, top: GY + y * CH }} />
            ) : null}
          </React.Fragment>
        );
      })}

      <Mono
        size={22}
        color={COLORS.muted}
        style={{ position: "absolute", left: GX, top: GY + GRID_H + 32 }}
      >
        {frame < PASTES[0].at ? "copy" : frame < PASTES[1].at ? "paste" : "paste again"}
      </Mono>
    </AbsoluteFill>
  );
};

/* ---------------- Chat: the ask nobody can answer ---------------- */

const Avatar: React.FC = () => (
  <div style={{ width: 56, height: 56, borderRadius: 28, background: COLORS.faint, flex: "none" }} />
);

const Message: React.FC<{ text: string; time: string; attachment?: boolean; style: React.CSSProperties }> = ({
  text,
  time,
  attachment,
  style,
}) => (
  <div style={{ display: "flex", gap: 24, ...style }}>
    <Avatar />
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 120, height: 12, borderRadius: 6, background: COLORS.faint }} />
        <Mono size={18} color={COLORS.muted}>
          {time}
        </Mono>
      </div>
      <Sans size={36}>{text}</Sans>
      {attachment ? (
        <div
          style={{
            marginTop: 8,
            width: 380,
            height: 190,
            borderRadius: 12,
            border: `1px solid ${COLORS.hairline}`,
            background: COLORS.surface,
            backgroundImage: `linear-gradient(${COLORS.hairline} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.hairline} 1px, transparent 1px)`,
            backgroundSize: "54px 32px",
          }}
        />
      ) : null}
    </div>
  </div>
);

const Chat: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 900, display: "flex", flexDirection: "column", gap: 48 }}>
        <Message text="can someone double check this" time="10:42" attachment style={reveal(frame, 4, 14, 10)} />
        <Message text="which version is this?" time="10:57" style={reveal(frame, 34, 14, 10)} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Calendar: the same block, over and over ---------------- */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = 8; // 9:00 → 17:00
const CAL_W = 1240;
const CAL_H = 600;
const CX = (1920 - CAL_W) / 2;
const CY = (1080 - CAL_H) / 2 + 20;
const HEAD = 44;
const COL_W = CAL_W / DAYS.length;
const ROW_H = (CAL_H - HEAD) / HOURS;

const BLOCKS: { d: number; h: number; len: number; label: string }[] = [
  { d: 0, h: 0, len: 1, label: "Weekly report" },
  { d: 1, h: 0, len: 1, label: "Weekly report" },
  { d: 2, h: 0, len: 1, label: "Weekly report" },
  { d: 3, h: 0, len: 1, label: "Weekly report" },
  { d: 4, h: 0, len: 1, label: "Weekly report" },
  { d: 0, h: 4, len: 1, label: "Fix weekly report" },
  { d: 1, h: 2, len: 2, label: "Pull numbers for weekly report" },
  { d: 2, h: 5, len: 1, label: "Weekly report review" },
  { d: 3, h: 2, len: 1, label: "Weekly report" },
  { d: 3, h: 6, len: 1, label: "Recheck weekly report" },
  { d: 4, h: 5, len: 2, label: "Weekly report" },
];

const CalendarWithOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const dim = 1 - progress(frame, 56, 16) * 0.92;
  const lines = ["Rebuilt by hand.", "Every week.", "Never quite trusted."];

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: dim }}>
        {DAYS.map((d, i) => (
          <Mono
            key={d}
            size={20}
            color={COLORS.muted}
            style={{ position: "absolute", left: CX + i * COL_W + 16, top: CY + 8 }}
          >
            {d}
          </Mono>
        ))}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: HOURS + 1 }).map((_, i) => (
            <line
              key={i}
              x1={CX}
              x2={CX + CAL_W}
              y1={CY + HEAD + i * ROW_H}
              y2={CY + HEAD + i * ROW_H}
              stroke={COLORS.hairline}
            />
          ))}
          {Array.from({ length: DAYS.length + 1 }).map((_, i) => (
            <line key={i} x1={CX + i * COL_W} x2={CX + i * COL_W} y1={CY} y2={CY + CAL_H} stroke={COLORS.hairline} />
          ))}
        </svg>
        {BLOCKS.map((b, i) => {
          const at = 4 + i * 4;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: CX + b.d * COL_W + 6,
                top: CY + HEAD + b.h * ROW_H + 4,
                width: COL_W - 12,
                height: b.len * ROW_H - 8,
                borderRadius: 8,
                background: COLORS.surface,
                border: `1px solid ${COLORS.hairline}`,
                borderLeft: `3px solid ${COLORS.muted}`,
                boxSizing: "border-box",
                padding: "8px 12px",
                ...reveal(frame, at, 8, 6),
              }}
            >
              <Sans size={19} color={COLORS.fg} style={{ lineHeight: 1.25 }}>
                {b.label}
              </Sans>
            </div>
          );
        })}
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          {lines.map((l, i) => (
            <div key={l} style={reveal(frame, 62 + i * 12, 16, 6)}>
              <Sans size={60} weight="medium" tracking="0.01em">
                {l}
              </Sans>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
