import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";

const inter = loadInter("normal", { weights: ["400", "500"], subsets: ["latin"] });
const mono = loadPlexMono("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const COLORS = {
  bg: "#0A0A0B",
  fg: "#F5F5F0",
  // Anything that represents traceable data, and only that.
  accent: "#3D5AFE",
  muted: "rgba(245, 245, 240, 0.45)",
  faint: "rgba(245, 245, 240, 0.16)",
  hairline: "rgba(245, 245, 240, 0.10)",
  surface: "#131315",
  accentSoft: "rgba(61, 90, 254, 0.18)",
} as const;

export const FONTS = {
  sans: inter.fontFamily,
  mono: mono.fontFamily,
} as const;

// Two weights only.
export const WEIGHT = { regular: 400, medium: 500 } as const;
