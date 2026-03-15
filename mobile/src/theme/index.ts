/**
 * ─────────────────────────────────────────────────────────────
 *  HAZINA — Theme Index
 *  Single import point for all design tokens.
 *
 *  Usage:
 *    import { Colors, Typography, Spacing, Radius, Shadow, Layout } from '@/theme';
 *    import { Colors, Typography } from '../theme';
 * ─────────────────────────────────────────────────────────────
 */

// ── Color tokens ──────────────────────────────────────────────
export {
  Colors,
  Green,
  Amber,
  Neutral,
  Status,
} from "./colors";

export type {
  ColorToken,
  GreenShade,
  AmberShade,
  NeutralShade,
} from "./colors";

// ── Typography tokens ─────────────────────────────────────────
export {
  Typography,
  FontFamily,
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
  lineHeight,
} from "./typography";

export type {
  TypographyToken,
  FontSizeToken,
  FontWeightToken,
} from "./typography";

// ── Spacing, layout & shadow tokens ──────────────────────────
export {
  Spacing,
  Layout,
  Radius,
  Shadow,
  ZIndex,
} from "./spacing";

export type {
  SpacingToken,
  LayoutToken,
  RadiusToken,
  ShadowToken,
  ZIndexToken,
} from "./spacing";

// ── Convenience re-export: the full theme object ───────────────
// Useful when you want to pass the whole theme via context
// or inspect all tokens in one place.

import { Colors, Green, Amber, Neutral, Status } from "./colors";
import {
  Typography,
  FontFamily,
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
} from "./typography";
import { Spacing, Layout, Radius, Shadow, ZIndex } from "./spacing";

export const Theme = {
  colors:       Colors,
  palette: {
    green:   Green,
    amber:   Amber,
    neutral: Neutral,
    status:  Status,
  },
  typography:   Typography,
  fonts:        FontFamily,
  fontSize:     FontSize,
  fontWeight:   FontWeight,
  lineHeight:   LineHeight,
  letterSpacing: LetterSpacing,
  spacing:      Spacing,
  layout:       Layout,
  radius:       Radius,
  shadow:       Shadow,
  zIndex:       ZIndex,
} as const;

export type HazinaTheme = typeof Theme;
