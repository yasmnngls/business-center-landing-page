import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fadeOut, lerp, progress, reveal, settle, typeDuration, typed } from "../lib/anim";
import { WORKFLOW_BEAT } from "../timeline";
import { COLORS } from "../theme";
import { Mono, Sans } from "../components/Type";
import { FullFrameSvg, TracePath } from "../components/TraceLine";
import { MiniChart } from "../components/MiniChart";
import { Check, DatabaseIcon, DocIcon, PersonIcon, SheetIcon } from "../components/Icons";

const B = WORKFLOW_BEAT;
const WORDS = ["CONNECT", "UNDERSTAND", "DECIDE", "ACT"];
const WORD_X = [300, 740, 1180, 1620];
const WORD_Y = 196;
const NODE_Y = 262;

export const S4Workflow: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Throughline f={f} />
      {f < B ? <Connect b={f} /> : null}
      {f >= B ? <Understand f={f} /> : null}
      {f >= B * 3 ? <Act b={f - B * 3} /> : null}
    </AbsoluteFill>
  );
};

/* ---------------- The throughline: words + a line that draws forward ---------------- */

const Throughline: React.FC<{ f: number }> = ({ f }) => (
  <>
    <FullFrameSvg>
      {WORD_X.slice(1).map((x, i) => (
        <TracePath
          key={x}
          d={`M ${WORD_X[i] + 10} ${NODE_Y} H ${x - 10}`}
          progress={progress(f, (i + 1) * B, 22)}
          width={2}
        />
      ))}
      {WORD_X.map((x, i) => {
        const p = progress(f, i * B + (i === 0 ? 4 : 18), 10);
        return <circle key={x} cx={x} cy={NODE_Y} r={6 * p} fill={COLORS.accent} />;
      })}
    </FullFrameSvg>
    {WORDS.map((w, i) => {
      const start = i * B;
      const r = reveal(f, start + 8, 18, 10);
      // Past words step back once the next word takes focus.
      const past = i < 3 ? progress(f, (i + 1) * B + 6, 14) : 0;
      return (
        <div
          key={w}
          style={{
            position: "absolute",
            left: WORD_X[i] - 250,
            width: 500,
            top: WORD_Y - 22,
            textAlign: "center",
            ...r,
            opacity: r.opacity * (1 - past * 0.55),
          }}
        >
          <Sans size={34} weight="medium" tracking="0.16em">
            {w}
          </Sans>
        </div>
      );
    })}
  </>
);

/* ---------------- CONNECT: scattered sources slide into one point ---------------- */

const POINT = { x: 960, y: 650 };
const SOURCES = [
  { x: 520, y: 560, rot: -6, label: "sheet", Icon: SheetIcon },
  { x: 1400, y: 520, rot: 5, label: "database", Icon: DatabaseIcon },
  { x: 1010, y: 900, rot: -3, label: "doc", Icon: DocIcon },
];

const Connect: React.FC<{ b: number }> = ({ b }) => {
  const exit = fadeOut(b, 116, 16);
  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <FullFrameSvg>
        {SOURCES.map((s, i) => {
          const t = settle(b, 50 + i * 4, 30);
          const x = lerp(s.x, POINT.x, t);
          const y = lerp(s.y, POINT.y, t);
          return (
            <line
              key={s.label}
              x1={s.x}
              y1={s.y}
              x2={x}
              y2={y}
              stroke={COLORS.accent}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={t > 0.01 ? 0.55 : 0}
            />
          );
        })}
        <circle cx={POINT.x} cy={POINT.y} r={12 * progress(b, 80, 14)} fill={COLORS.accent} />
      </FullFrameSvg>
      {SOURCES.map((s, i) => {
        const t = settle(b, 50 + i * 4, 30);
        const x = lerp(s.x, POINT.x, t);
        const y = lerp(s.y, POINT.y, t);
        const r = reveal(b, 8 + i * 7, 18, 12);
        return (
          <div
            key={s.label}
            style={{
              position: "absolute",
              left: x - 70,
              top: y - 70,
              width: 140,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              opacity: r.opacity * (1 - progress(b, 62 + i * 4, 18)),
              transform: `${r.transform} rotate(${lerp(s.rot, 0, t)}deg) scale(${lerp(1, 0.3, t)})`,
            }}
          >
            <s.Icon size={110} />
            <Mono size={20} color={COLORS.muted} style={{ opacity: 1 - t }}>
              {s.label}
            </Mono>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- UNDERSTAND → DECIDE → (group for ACT) ---------------- */

const QUESTION = "how did revenue trend over the last six months?";
const Q_START = 12;
const Q_CPS = 26;
const CHART_W = 800;
const CHART_H = 360;

// Dashboard geometry (frame coordinates).
// Tiles share the chart card's aspect ratio so the chart lands in its slot exactly.
const TILE = { w: 586, h: 264, gap: 20 };
const DASH = { x: 340, y: 380, w: 1240, h: 56 + TILE.h * 2 + TILE.gap + 24 };
const DASH_CY = DASH.y + DASH.h / 2;
const tilePos = (col: number, row: number) => ({
  x: DASH.x + 24 + col * (TILE.w + TILE.gap),
  y: DASH.y + 56 + row * (TILE.h + TILE.gap),
});
const CHART_TILE_SCALE = TILE.w / 800;

const Understand: React.FC<{ f: number }> = ({ f }) => {
  const u = f - B; // understand-local
  const d = f - B * 2; // decide-local
  const a = f - B * 3; // act-local

  // Query field
  const typedDone = Q_START + typeDuration(QUESTION, Q_CPS);
  const lift = settle(u, typedDone + 4, 24);
  const fieldY = lerp(640, 440, lift);
  const fieldOpacity = progress(u, 0, 14) * (d >= 0 ? fadeOut(d, 0, 12) : 1);
  const caret = u < typedDone + 10 ? 1 : fadeOut(u, typedDone + 10, 10);

  // Chart: grows in UNDERSTAND, then lands in the dashboard during DECIDE.
  const chartIn = progress(u, typedDone + 12, 14);
  const land = d >= 0 ? settle(d, 6, 30) : 0;
  const tl = tilePos(0, 0);
  const cx = lerp(960, tl.x + TILE.w / 2, land);
  const cy = lerp(720, tl.y + TILE.h / 2, land);
  const scale = lerp(1, CHART_TILE_SCALE, land);

  // ACT: the whole dashboard steps left and shrinks to make room for the workflow.
  const step = a >= 0 ? settle(a, 0, 30) : 0;
  const groupT = `translate(${lerp(0, -530, step)}px, ${lerp(0, ROW_Y - DASH_CY, step)}px) scale(${lerp(1, 0.4, step)})`;

  return (
    <AbsoluteFill>
      {/* Query field */}
      <div
        style={{
          position: "absolute",
          left: 960 - 450,
          top: fieldY - 38,
          width: 900,
          height: 76,
          borderRadius: 14,
          border: `1px solid ${COLORS.faint}`,
          background: COLORS.surface,
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          boxSizing: "border-box",
          gap: 16,
          opacity: fieldOpacity,
        }}
      >
        <Mono size={26} color={COLORS.muted}>
          ›
        </Mono>
        <Mono size={26}>
          {typed(QUESTION, u, Q_START, Q_CPS)}
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: "1em",
              marginLeft: 4,
              verticalAlign: "-0.12em",
              background: COLORS.fg,
              opacity: caret,
            }}
          />
        </Mono>
      </div>

      <AbsoluteFill style={{ transformOrigin: `960px ${DASH_CY}px`, transform: groupT }}>
        {d >= 0 ? <Dashboard d={d} /> : null}
        <div
          style={{
            position: "absolute",
            left: cx - CHART_W / 2,
            top: cy - CHART_H / 2,
            opacity: chartIn,
            transform: `scale(${scale})`,
          }}
        >
          <MiniChart
            width={CHART_W}
            height={CHART_H}
            grow={(i) => progress(u, typedDone + 16 + i * 4, 18)}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Skeleton: React.FC<{ w: number | string; h?: number; style?: React.CSSProperties }> = ({ w, h = 12, style }) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, background: COLORS.faint, ...style }} />
);

const Tile: React.FC<{ col: number; row: number; d: number; at: number; children?: React.ReactNode }> = ({
  col,
  row,
  d,
  at,
  children,
}) => {
  const p = tilePos(col, row);
  return (
    <div
      style={{
        position: "absolute",
        left: p.x,
        top: p.y,
        width: TILE.w,
        height: TILE.h,
        borderRadius: 16,
        background: COLORS.surface,
        border: `1px solid ${COLORS.hairline}`,
        boxSizing: "border-box",
        padding: 32,
        ...reveal(d, at, 16, 8),
      }}
    >
      {children}
    </div>
  );
};

const Dashboard: React.FC<{ d: number }> = ({ d }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: DASH.x,
        top: DASH.y,
        width: DASH.w,
        height: DASH.h,
        borderRadius: 22,
        border: `1px solid ${COLORS.faint}`,
        boxSizing: "border-box",
        opacity: progress(d, 2, 18),
      }}
    >
      <Mono size={20} color={COLORS.muted} style={{ position: "absolute", left: 28, top: 14 }}>
        Overview
      </Mono>
    </div>
    <Tile col={1} row={0} d={d} at={18}>
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <Skeleton w={180} />
        <Skeleton w="80%" h={10} />
        <Skeleton w="64%" h={10} />
        <Skeleton w="72%" h={10} />
      </div>
    </Tile>
    <Tile col={0} row={1} d={d} at={24}>
      <Skeleton w={140} />
      <Skeleton w={260} h={44} style={{ marginTop: 34, borderRadius: 10 }} />
      <Skeleton w={120} h={10} style={{ marginTop: 24 }} />
    </Tile>
    <Tile col={1} row={1} d={d} at={30}>
      <Skeleton w={160} />
      <svg width={520} height={120} style={{ marginTop: 26 }}>
        <path
          d="M0 90 C 60 80, 90 40, 150 55 S 260 100, 320 60 S 440 20, 520 35"
          fill="none"
          stroke={COLORS.faint}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </svg>
    </Tile>
  </>
);

/* ---------------- ACT: dashboard triggers a workflow with a human review step ---------------- */

const NODE_W = 200;
const NODE_XS = [760, 1016, 1272, 1528];
const ROW_Y = 640;
const STEPS = [
  { title: "Trigger", sub: "on change", at: 30 },
  { title: "Draft", sub: "summary", at: 48 },
  { title: "Review", sub: "human approval", at: 64, human: true },
  { title: "Send", sub: "to team", at: 106 },
];
const CONNECTORS = [
  { x1: 678, x2: NODE_XS[0], at: 22 },
  { x1: NODE_XS[0] + NODE_W, x2: NODE_XS[1], at: 42 },
  { x1: NODE_XS[1] + NODE_W, x2: NODE_XS[2], at: 58 },
  { x1: NODE_XS[2] + NODE_W, x2: NODE_XS[3], at: 100 }, // only after review is checked
];
const CHECK_AT = 80;

const Act: React.FC<{ b: number }> = ({ b }) => (
  <AbsoluteFill>
    <FullFrameSvg>
      {CONNECTORS.map((c) => (
        <TracePath key={c.x1} d={`M ${c.x1 + 6} ${ROW_Y} H ${c.x2 - 6}`} progress={progress(b, c.at, 12)} />
      ))}
    </FullFrameSvg>
    {STEPS.map((s, i) => {
      const h = s.human ? 164 : 124;
      return (
        <div
          key={s.title}
          style={{
            position: "absolute",
            left: NODE_XS[i],
            top: ROW_Y - h / 2,
            width: NODE_W,
            height: h,
            borderRadius: 16,
            background: COLORS.surface,
            border: s.human ? `1.5px solid ${COLORS.fg}` : `1px solid ${COLORS.faint}`,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            ...reveal(b, s.at, 14, 10),
          }}
        >
          {s.human ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <PersonIcon size={40} />
              <Check size={40} progress={progress(b, CHECK_AT, 16)} />
            </div>
          ) : null}
          <Sans size={28} weight="medium">
            {s.title}
          </Sans>
          <Mono size={17} color={COLORS.muted}>
            {s.sub}
          </Mono>
        </div>
      );
    })}
  </AbsoluteFill>
);
