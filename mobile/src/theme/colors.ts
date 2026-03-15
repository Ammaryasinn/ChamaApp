/**
 * ─────────────────────────────────────────────────────────────
 *  HAZINA — Master Color Tokens
 *  Every color value in the app lives here.
 *  Import from this file only — never hardcode hex strings.
 * ─────────────────────────────────────────────────────────────
 */

// ─── Brand: Forest Green ──────────────────────────────────────────────────────
// The core identity. Green = money, growth, community, Kenya.

export const Green = {
  /** Deep forest — hero headers, dark backgrounds */
  950: "#071510",
  /** Very dark — nav bars, rich backgrounds */
  900: "#0A1F18",
  /** Dark — pressed states on dark surfaces */
  800: "#0D2E22",
  /** Deep — active tab indicators on dark bg */
  700: "#0F4030",
  /** Primary brand — main CTAs, FAB, key UI */
  600: "#006D5B",
  /** Slightly lighter — hover on primary */
  500: "#007D69",
  /** Mid — secondary text on dark bg, active labels */
  400: "#2E9E87",
  /** Light-mid — icons on light bg, progress fills */
  300: "#5BBAA5",
  /** Pale — borders, dividers on light surfaces */
  200: "#A8D8CF",
  /** Very pale — pill backgrounds, avatar fills */
  100: "#D1F0EA",
  /** Tint — screen backgrounds, card tints */
  50:  "#E8F7F4",
  /** Near-white tint — screen backgrounds */
  25:  "#F2FBF8",
} as const;

// ─── Brand: Amber / Gold ──────────────────────────────────────────────────────
// The accent. Warm, earthy, East-African. Used for highlights,
// payout amounts on dark backgrounds, due-date warnings, badges.

export const Amber = {
  /** Deep amber — text on amber-tinted surfaces */
  900: "#78350F",
  /** Dark amber — strong alert text */
  800: "#92400E",
  /** Rich amber — alert body text */
  700: "#B45309",
  /** Primary amber — badges, highlights, icons */
  600: "#D97706",
  /** Bright amber — key numbers on dark hero bg */
  500: "#F59E0B",
  /** Light amber — icon backgrounds, pill bg */
  200: "#FDE68A",
  /** Very pale amber — alert/warning card bg */
  100: "#FEF3C7",
  /** Near-white amber tint */
  50:  "#FFFBEB",
} as const;

// ─── Neutrals ─────────────────────────────────────────────────────────────────
// Warm-tinted greys — not cold blue-greys. Pairs naturally with the greens.

export const Neutral = {
  /** Near black — primary text */
  900: "#111D18",
  /** Very dark — headings */
  800: "#1A2920",
  /** Dark — subheadings, strong body */
  700: "#2D3D36",
  /** Mid-dark — secondary headings */
  600: "#3D5048",
  /** Mid — secondary text, icons */
  500: "#5A7A70",
  /** Mid-light — muted text, placeholders */
  400: "#7A9990",
  /** Light — disabled text, hints */
  300: "#9DB5AE",
  /** Pale — borders, dividers */
  200: "#C8D8D4",
  /** Very pale — input borders, subtle dividers */
  150: "#DDEAE6",
  /** Near-white — card borders, separators */
  100: "#EBF1EF",
  /** Off-white — screen backgrounds */
  50:  "#F6F9F7",
  /** Pure white — card surfaces */
  0:   "#FFFFFF",
} as const;

// ─── Semantic: Status Colors ──────────────────────────────────────────────────

export const Status = {
  // Success — paid contributions, completed cycles, approved loans
  successDark:   "#065F46",
  success:       "#059669",
  successMid:    "#34D399",
  successLight:  "#D1FAE5",
  successBg:     "#ECFDF5",

  // Warning — due soon, pending, partial payment
  warningDark:   "#92400E",
  warning:       "#D97706",
  warningMid:    "#FCD34D",
  warningLight:  "#FDE68A",
  warningBg:     "#FFFBEB",

  // Error — late contributions, failed transactions, rejected loans
  errorDark:     "#991B1B",
  error:         "#DC2626",
  errorMid:      "#F87171",
  errorLight:    "#FECACA",
  errorBg:       "#FEF2F2",

  // Info — general notices, loan voting, neutral info
  infoDark:      "#1E40AF",
  info:          "#3B82F6",
  infoMid:       "#93C5FD",
  infoLight:     "#DBEAFE",
  infoBg:        "#EFF6FF",
} as const;

// ─── Semantic Aliases ─────────────────────────────────────────────────────────
// These are the named tokens you use in components.
// They reference the palette above — change the palette, aliases follow.

export const Colors = {
  // ── Brand ──────────────────────────────────────────────────
  /** Primary green — main CTAs, FAB, key interactive elements */
  primary:            Green[600],
  /** Dark primary — pressed states, hero headers */
  primaryDark:        Green[900],
  /** Deeper dark — deepest hero bg */
  primaryDeep:        Green[950],
  /** Light primary — tinted backgrounds, avatar fills */
  primaryLight:       Green[100],
  /** Very light primary — screen background tint */
  primaryTint:        Green[50],
  /** Pressed state for primary buttons */
  primaryPressed:     Green[700],

  // ── Accent ─────────────────────────────────────────────────
  /** Warm amber — payout amounts on dark bg, highlights */
  accent:             Amber[500],
  /** Dark amber — text on amber backgrounds */
  accentDark:         Amber[700],
  /** Light amber — badge backgrounds, pill fills */
  accentLight:        Amber[100],
  /** Amber tint bg — warning cards, alert boxes */
  accentTint:         Amber[50],

  // ── Text ───────────────────────────────────────────────────
  /** Primary text — headings, body content */
  textPrimary:        Neutral[900],
  /** Secondary text — subtitles, supporting copy */
  textSecondary:      Neutral[500],
  /** Muted text — placeholders, disabled, hints */
  textMuted:          Neutral[300],
  /** Inverted text — on dark/green backgrounds */
  textInverse:        Neutral[0],
  /** Soft inverted — secondary text on dark bg */
  textInverseSoft:    Green[300],
  /** Accent on dark — amber numbers/highlights on hero bg */
  textAccentOnDark:   Amber[500],

  // ── Surfaces ───────────────────────────────────────────────
  /** Main screen background */
  background:         Neutral[50],
  /** Card and sheet surfaces */
  surface:            Neutral[0],
  /** Elevated card surface (e.g. inside another card) */
  surfaceElevated:    Neutral[0],
  /** Sunken surface — input backgrounds */
  surfaceSunken:      Green[25],
  /** Dark hero surface — top panels, headers */
  surfaceDark:        Green[900],
  /** Deepest dark — splash, auth hero */
  surfaceDeepDark:    Green[950],

  // ── Borders ────────────────────────────────────────────────
  /** Default border — cards, inputs */
  border:             Neutral[150],
  /** Strong border — focused inputs */
  borderStrong:       Neutral[200],
  /** Brand border — selected state */
  borderBrand:        Green[600],
  /** Subtle divider — list separators */
  divider:            Neutral[100],

  // ── Status ─────────────────────────────────────────────────
  // Success
  success:            Status.success,
  successDark:        Status.successDark,
  successLight:       Status.successLight,
  successBg:          Status.successBg,

  // Warning
  warning:            Status.warning,
  warningDark:        Status.warningDark,
  warningLight:       Status.warningLight,
  warningBg:          Status.warningBg,

  // Error
  error:              Status.error,
  errorDark:          Status.errorDark,
  errorLight:         Status.errorLight,
  errorBg:            Status.errorBg,

  // Info
  info:               Status.info,
  infoLight:          Status.infoLight,
  infoBg:             Status.infoBg,

  // ── Contribution / Member Status ───────────────────────────
  // Mapped to semantic colors so badge components stay consistent
  paid:               Status.success,
  paidBg:             Status.successBg,
  paidBorder:         Status.successLight,

  partial:            Status.warning,
  partialBg:          Status.warningBg,
  partialBorder:      Status.warningLight,

  late:               Status.error,
  lateBg:             Status.errorBg,
  lateBorder:         Status.errorLight,

  pending:            Neutral[400],
  pendingBg:          Neutral[50],
  pendingBorder:      Neutral[150],

  // ── Tab bar ────────────────────────────────────────────────
  tabBarBg:           Neutral[0],
  tabBarBorder:       Neutral[100],
  tabBarActive:       Green[600],
  tabBarInactive:     Neutral[300],

  // ── Shadows ────────────────────────────────────────────────
  // Use as shadowColor in StyleSheet
  shadowDefault:      "#000000",
  shadowBrand:        Green[600],
  shadowAmber:        Amber[500],

  // ── Transparent ────────────────────────────────────────────
  transparent:        "transparent",
} as const;

// ─── Type exports ─────────────────────────────────────────────────────────────

export type ColorToken = keyof typeof Colors;
export type GreenShade = keyof typeof Green;
export type AmberShade = keyof typeof Amber;
export type NeutralShade = keyof typeof Neutral;
