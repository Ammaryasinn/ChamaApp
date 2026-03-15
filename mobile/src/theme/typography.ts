/**
 * ─────────────────────────────────────────────────────────────
 *  HAZINA — Typography Tokens
 *
 *  Font family: Plus Jakarta Sans
 *  Loaded via expo-font in App.tsx.
 *  Fall-backs: System (SF Pro on iOS, Roboto on Android).
 *
 *  Usage:
 *    import { Typography, FontFamily, FontSize } from '@/theme/typography';
 *    style={Typography.h1}
 *    style={{ fontSize: FontSize.lg, fontWeight: FontWeight.bold }}
 * ─────────────────────────────────────────────────────────────
 */

import { Platform, type TextStyle } from "react-native";

// ─── Font Families ────────────────────────────────────────────────────────────

export const FontFamily = {
  /** Regular (400) */
  regular:      "PlusJakartaSans_400Regular",
  /** Medium (500) */
  medium:       "PlusJakartaSans_500Medium",
  /** SemiBold (600) */
  semiBold:     "PlusJakartaSans_600SemiBold",
  /** Bold (700) */
  bold:         "PlusJakartaSans_700Bold",
  /** ExtraBold (800) */
  extraBold:    "PlusJakartaSans_800ExtraBold",

  // System fallbacks (used before fonts load)
  systemRegular:  Platform.OS === "ios" ? "System" : "Roboto",
  systemBold:     Platform.OS === "ios" ? "System" : "Roboto",
} as const;

// ─── Font Sizes ───────────────────────────────────────────────────────────────
// Scale based on an 4pt baseline grid.
// Named by role, not by number — so you think in meaning, not pixels.

export const FontSize = {
  /** 10px — micro labels, legal text */
  micro:   10,
  /** 11px — uppercase badge labels, tab bar labels */
  xs:      11,
  /** 12px — timestamps, metadata, helper text */
  xxs:     12,
  /** 13px — secondary body, input labels, captions */
  sm:      13,
  /** 14px — supporting body, alert text */
  base:    14,
  /** 15px — primary body copy */
  md:      15,
  /** 16px — slightly prominent body, button labels */
  lg:      16,
  /** 17px — list titles, section headers */
  xl:      17,
  /** 20px — card titles, modal headings */
  "2xl":   20,
  /** 22px — page sub-headings */
  "3xl":   22,
  /** 24px — page headings */
  "4xl":   24,
  /** 28px — large screen titles */
  "5xl":   28,
  /** 32px — hero titles */
  "6xl":   32,
  /** 36px — hero display (e.g. pot balance on dark bg) */
  "7xl":   36,
  /** 42px — splash / jumbo display */
  "8xl":   42,
} as const;

// ─── Font Weights ─────────────────────────────────────────────────────────────
// React Native expects string literals for fontWeight.

export const FontWeight = {
  regular:   "400",
  medium:    "500",
  semiBold:  "600",
  bold:      "700",
  extraBold: "800",
} as const;

// ─── Line Heights ─────────────────────────────────────────────────────────────
// Line height = font size × multiplier.
// Tighter for headings (where you control layout), looser for body (readability).

export const LineHeight = {
  none:     1,      // 1× — single-line display numbers, never wraps
  tight:    1.2,    // 1.2× — headings, titles
  snug:     1.3,    // 1.3× — sub-headings, card titles
  normal:   1.5,    // 1.5× — body copy standard
  relaxed:  1.6,    // 1.6× — long-form text, alert boxes
  loose:    1.75,   // 1.75× — onboarding / marketing copy
} as const;

// Helper — returns a concrete px line height from a font size + multiplier
export function lineHeight(
  fontSize: number,
  multiplier: number = LineHeight.normal,
): number {
  return Math.round(fontSize * multiplier);
}

// ─── Letter Spacing ───────────────────────────────────────────────────────────

export const LetterSpacing = {
  /** Tighter — large display titles */
  tighter: -0.8,
  /** Tight — headings (32px+) */
  tight:   -0.5,
  /** Snug — sub-headings (20-28px) */
  snug:    -0.3,
  /** None — body copy */
  normal:  0,
  /** Wide — button labels */
  wide:    0.2,
  /** Wider — input labels */
  wider:   0.4,
  /** Widest — uppercase badge labels */
  widest:  1.5,
} as const;

// ─── Composed Text Styles ─────────────────────────────────────────────────────
// Ready-to-use TextStyle objects.
// Combine with a color token — these intentionally omit color so they're reusable.
//
// Usage:
//   <Text style={[Typography.h1, { color: Colors.textPrimary }]}>Hello</Text>

export const Typography = {

  // ── Display (hero sections, dark backgrounds) ───────────────────────────────

  /** Jumbo hero number — pot balance, big KES figures */
  display: {
    fontFamily:    FontFamily.extraBold,
    fontSize:      FontSize["7xl"],
    fontWeight:    FontWeight.extraBold,
    lineHeight:    lineHeight(FontSize["7xl"], LineHeight.tight),
    letterSpacing: LetterSpacing.tighter,
  } satisfies TextStyle,

  /** Large hero title — splash screen, onboarding */
  displaySm: {
    fontFamily:    FontFamily.extraBold,
    fontSize:      FontSize["6xl"],
    fontWeight:    FontWeight.extraBold,
    lineHeight:    lineHeight(FontSize["6xl"], LineHeight.tight),
    letterSpacing: LetterSpacing.tight,
  } satisfies TextStyle,

  // ── Headings ────────────────────────────────────────────────────────────────

  /** H1 — screen / page title */
  h1: {
    fontFamily:    FontFamily.extraBold,
    fontSize:      FontSize["5xl"],
    fontWeight:    FontWeight.extraBold,
    lineHeight:    lineHeight(FontSize["5xl"], LineHeight.tight),
    letterSpacing: LetterSpacing.tight,
  } satisfies TextStyle,

  /** H2 — section heading, modal title */
  h2: {
    fontFamily:    FontFamily.extraBold,
    fontSize:      FontSize["4xl"],
    fontWeight:    FontWeight.extraBold,
    lineHeight:    lineHeight(FontSize["4xl"], LineHeight.snug),
    letterSpacing: LetterSpacing.snug,
  } satisfies TextStyle,

  /** H3 — card title, sheet heading */
  h3: {
    fontFamily:    FontFamily.bold,
    fontSize:      FontSize["3xl"],
    fontWeight:    FontWeight.bold,
    lineHeight:    lineHeight(FontSize["3xl"], LineHeight.snug),
    letterSpacing: LetterSpacing.snug,
  } satisfies TextStyle,

  /** H4 — prominent card title */
  h4: {
    fontFamily:    FontFamily.bold,
    fontSize:      FontSize["2xl"],
    fontWeight:    FontWeight.bold,
    lineHeight:    lineHeight(FontSize["2xl"], LineHeight.snug),
    letterSpacing: LetterSpacing.snug,
  } satisfies TextStyle,

  // ── Titles ──────────────────────────────────────────────────────────────────

  /** Title large — list headers, section labels */
  titleLg: {
    fontFamily:    FontFamily.bold,
    fontSize:      FontSize.xl,
    fontWeight:    FontWeight.bold,
    lineHeight:    lineHeight(FontSize.xl, LineHeight.snug),
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  /** Title — list items, nav headers */
  title: {
    fontFamily:    FontFamily.bold,
    fontSize:      FontSize.lg,
    fontWeight:    FontWeight.bold,
    lineHeight:    lineHeight(FontSize.lg, LineHeight.snug),
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  /** Title small — member names, row titles */
  titleSm: {
    fontFamily:    FontFamily.semiBold,
    fontSize:      FontSize.md,
    fontWeight:    FontWeight.semiBold,
    lineHeight:    lineHeight(FontSize.md, LineHeight.normal),
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  // ── Body ────────────────────────────────────────────────────────────────────

  /** Body large — intro copy, onboarding description */
  bodyLg: {
    fontFamily:    FontFamily.regular,
    fontSize:      FontSize.md,
    fontWeight:    FontWeight.regular,
    lineHeight:    lineHeight(FontSize.md, LineHeight.relaxed),
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  /** Body — standard body copy */
  body: {
    fontFamily:    FontFamily.regular,
    fontSize:      FontSize.base,
    fontWeight:    FontWeight.regular,
    lineHeight:    lineHeight(FontSize.base, LineHeight.normal),
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  /** Body medium — slightly emphasised body */
  bodyMedium: {
    fontFamily:    FontFamily.medium,
    fontSize:      FontSize.base,
    fontWeight:    FontWeight.medium,
    lineHeight:    lineHeight(FontSize.base, LineHeight.normal),
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  /** Body small — captions, secondary info */
  bodySm: {
    fontFamily:    FontFamily.regular,
    fontSize:      FontSize.sm,
    fontWeight:    FontWeight.regular,
    lineHeight:    lineHeight(FontSize.sm, LineHeight.normal),
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  /** Body small medium — slightly emphasised captions */
  bodySmMedium: {
    fontFamily:    FontFamily.medium,
    fontSize:      FontSize.sm,
    fontWeight:    FontWeight.medium,
    lineHeight:    lineHeight(FontSize.sm, LineHeight.normal),
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  // ── Labels ──────────────────────────────────────────────────────────────────

  /** Label — input field labels, form section titles */
  label: {
    fontFamily:    FontFamily.semiBold,
    fontSize:      FontSize.sm,
    fontWeight:    FontWeight.semiBold,
    lineHeight:    lineHeight(FontSize.sm, LineHeight.snug),
    letterSpacing: LetterSpacing.wider,
  } satisfies TextStyle,

  /** Label small — helper text below inputs */
  labelSm: {
    fontFamily:    FontFamily.medium,
    fontSize:      FontSize.xxs,
    fontWeight:    FontWeight.medium,
    lineHeight:    lineHeight(FontSize.xxs, LineHeight.snug),
    letterSpacing: LetterSpacing.wide,
  } satisfies TextStyle,

  /** Overline — small allcaps section tag above a heading */
  overline: {
    fontFamily:    FontFamily.extraBold,
    fontSize:      FontSize.xs,
    fontWeight:    FontWeight.extraBold,
    lineHeight:    lineHeight(FontSize.xs, LineHeight.none),
    letterSpacing: LetterSpacing.widest,
    textTransform: "uppercase",
  } satisfies TextStyle,

  // ── Buttons ─────────────────────────────────────────────────────────────────

  /** Button large — primary CTA buttons */
  buttonLg: {
    fontFamily:    FontFamily.bold,
    fontSize:      FontSize.lg,
    fontWeight:    FontWeight.bold,
    lineHeight:    lineHeight(FontSize.lg, LineHeight.none),
    letterSpacing: LetterSpacing.wide,
  } satisfies TextStyle,

  /** Button — standard buttons */
  button: {
    fontFamily:    FontFamily.bold,
    fontSize:      FontSize.base,
    fontWeight:    FontWeight.bold,
    lineHeight:    lineHeight(FontSize.base, LineHeight.none),
    letterSpacing: LetterSpacing.wide,
  } satisfies TextStyle,

  /** Button small — compact / outline buttons */
  buttonSm: {
    fontFamily:    FontFamily.semiBold,
    fontSize:      FontSize.sm,
    fontWeight:    FontWeight.semiBold,
    lineHeight:    lineHeight(FontSize.sm, LineHeight.none),
    letterSpacing: LetterSpacing.wide,
  } satisfies TextStyle,

  // ── Badges ──────────────────────────────────────────────────────────────────

  /** Badge — pill labels (PAID, LATE, PENDING) */
  badge: {
    fontFamily:    FontFamily.extraBold,
    fontSize:      FontSize.xs,
    fontWeight:    FontWeight.extraBold,
    lineHeight:    lineHeight(FontSize.xs, LineHeight.none),
    letterSpacing: LetterSpacing.widest,
    textTransform: "uppercase",
  } satisfies TextStyle,

  /** Badge large — prominent status chips */
  badgeLg: {
    fontFamily:    FontFamily.extraBold,
    fontSize:      FontSize.xxs,
    fontWeight:    FontWeight.extraBold,
    lineHeight:    lineHeight(FontSize.xxs, LineHeight.none),
    letterSpacing: LetterSpacing.widest,
    textTransform: "uppercase",
  } satisfies TextStyle,

  // ── Numerics ─────────────────────────────────────────────────────────────────
  // Use for KES amounts, progress percentages, and counts.

  /** Large amount — e.g. pot balance on dark hero bg */
  amountLg: {
    fontFamily:    FontFamily.extraBold,
    fontSize:      FontSize["5xl"],
    fontWeight:    FontWeight.extraBold,
    lineHeight:    lineHeight(FontSize["5xl"], LineHeight.tight),
    letterSpacing: LetterSpacing.tight,
  } satisfies TextStyle,

  /** Medium amount — card totals */
  amount: {
    fontFamily:    FontFamily.bold,
    fontSize:      FontSize["2xl"],
    fontWeight:    FontWeight.bold,
    lineHeight:    lineHeight(FontSize["2xl"], LineHeight.tight),
    letterSpacing: LetterSpacing.snug,
  } satisfies TextStyle,

  /** Small amount — list row amounts */
  amountSm: {
    fontFamily:    FontFamily.semiBold,
    fontSize:      FontSize.md,
    fontWeight:    FontWeight.semiBold,
    lineHeight:    lineHeight(FontSize.md, LineHeight.tight),
    letterSpacing: LetterSpacing.normal,
  } satisfies TextStyle,

  // ── Tab bar ─────────────────────────────────────────────────────────────────

  /** Tab bar label */
  tabLabel: {
    fontFamily:    FontFamily.semiBold,
    fontSize:      FontSize.xs,
    fontWeight:    FontWeight.semiBold,
    lineHeight:    lineHeight(FontSize.xs, LineHeight.none),
    letterSpacing: LetterSpacing.wide,
  } satisfies TextStyle,

} as const;

// ─── Type exports ─────────────────────────────────────────────────────────────

export type TypographyToken = keyof typeof Typography;
export type FontSizeToken   = keyof typeof FontSize;
export type FontWeightToken = keyof typeof FontWeight;
