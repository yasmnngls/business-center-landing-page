import React from "react";
import { COLORS, FONTS, WEIGHT } from "../theme";

type TextProps = {
  children: React.ReactNode;
  size?: number;
  weight?: keyof typeof WEIGHT;
  color?: string;
  tracking?: string;
  style?: React.CSSProperties;
};

/** Narrative type — Inter. */
export const Sans: React.FC<TextProps> = ({
  children,
  size = 32,
  weight = "regular",
  color = COLORS.fg,
  tracking = "0.01em",
  style,
}) => (
  <div
    style={{
      fontFamily: FONTS.sans,
      fontSize: size,
      fontWeight: WEIGHT[weight],
      letterSpacing: tracking,
      color,
      lineHeight: 1.2,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Inspectable / technical content — IBM Plex Mono. Always regular weight. */
export const Mono: React.FC<Omit<TextProps, "weight">> = ({
  children,
  size = 24,
  color = COLORS.fg,
  tracking = "0",
  style,
}) => (
  <div
    style={{
      fontFamily: FONTS.mono,
      fontSize: size,
      fontWeight: WEIGHT.regular,
      letterSpacing: tracking,
      color,
      lineHeight: 1.5,
      whiteSpace: "pre",
      ...style,
    }}
  >
    {children}
  </div>
);
