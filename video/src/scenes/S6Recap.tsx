import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { progress, reveal } from "../lib/anim";
import { COLORS } from "../theme";
import { Sans } from "../components/Type";
import { Check } from "../components/Icons";
import { FullFrameSvg, TracePath } from "../components/TraceLine";

const EACH = 32;
const WORDS = ["Connect.", "Understand.", "Decide.", "Act."];
const ASSEMBLE = EACH * WORDS.length; // 128

/* Tiny echoes of the workflow visuals. */
const Echo: React.FC<{ i: number; f: number }> = ({ i, f }) => {
  const p = progress(f, 4, 14);
  const s = 120;
  if (i === 0)
    return (
      <svg width={s} height={s} viewBox="0 0 120 120">
        {[
          [14, 30],
          [106, 22],
          [70, 110],
        ].map(([x, y], k) => (
          <line
            key={k}
            x1={x}
            y1={y}
            x2={x + (60 - x) * p}
            y2={y + (62 - y) * p}
            stroke={COLORS.accent}
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.6}
          />
        ))}
        <circle cx={60} cy={62} r={8 * progress(f, 12, 8)} fill={COLORS.accent} />
      </svg>
    );
  if (i === 1)
    return (
      <svg width={s} height={s} viewBox="0 0 120 120">
        {[0.45, 0.6, 0.55, 0.85].map((v, k) => {
          const h = 90 * v * progress(f, 2 + k * 3, 10);
          return <rect key={k} x={14 + k * 26} y={104 - h} width={16} height={h} rx={3} fill={COLORS.accent} />;
        })}
      </svg>
    );
  if (i === 2)
    return (
      <svg width={s} height={s} viewBox="0 0 120 120" opacity={p}>
        <rect x={10} y={14} width={46} height={42} rx={6} fill={COLORS.accent} />
        <rect x={64} y={14} width={46} height={42} rx={6} fill="none" stroke={COLORS.faint} strokeWidth={2} />
        <rect x={10} y={64} width={46} height={42} rx={6} fill="none" stroke={COLORS.faint} strokeWidth={2} />
        <rect x={64} y={64} width={46} height={42} rx={6} fill="none" stroke={COLORS.faint} strokeWidth={2} />
      </svg>
    );
  return <Check size={s} progress={progress(f, 4, 12)} width={3} />;
};

const Beat: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={reveal(f, 0, 10, 8)}>
          <Sans size={96} weight="medium" tracking="0.02em">
            {WORDS[i]}
          </Sans>
        </div>
        <Echo i={i} f={f} />
      </div>
    </AbsoluteFill>
  );
};

const Locked: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <FullFrameSvg>
        <TracePath d="M 460 486 H 1460" progress={progress(f, 6, 26)} width={2} />
      </FullFrameSvg>
      <div
        style={{
          position: "absolute",
          top: 404,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 84,
        }}
      >
        {WORDS.map((w, i) => (
          <div key={w} style={reveal(f, i * 3, 12, 8)}>
            <Sans size={38} color={COLORS.muted} tracking="0.04em">
              {w}
            </Sans>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", ...reveal(f, 18, 22, 10) }}>
        <Sans size={64} weight="medium" tracking="0.01em" style={{ lineHeight: 1.25 }}>
          One workflow.
          <br />
          Everything your business runs on.
        </Sans>
      </div>
    </AbsoluteFill>
  );
};

export const S6Recap: React.FC = () => (
  <AbsoluteFill>
    {WORDS.map((w, i) => (
      <Sequence key={w} from={i * EACH} durationInFrames={EACH} layout="none">
        <Beat i={i} />
      </Sequence>
    ))}
    <Sequence from={ASSEMBLE} layout="none">
      <Locked />
    </Sequence>
  </AbsoluteFill>
);
