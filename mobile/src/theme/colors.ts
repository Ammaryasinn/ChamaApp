/**
 * ─────────────────────────────────────────────────────────────
 *  HAZINA — Master Color Tokens (Logo Matched Theme)
 * ─────────────────────────────────────────────────────────────
 */

export const PrimaryColor = {
  950: "#08201A", // Deepest background (Darkest Forest Green)
  900: "#0B2A22", // Surface / Cards
  800: "#0F362B", // Elevated surfaces / Borders
  700: "#134739", // Borders / pressed
  600: "#185C4A", // Muted Brand
  500: "#1D755D", // Primary Brand Buttons
  400: "#249474", // Highlights
  300: "#32B892", // Text highlights / icons
  200: "#60D4B5",
  100: "#A3E8D3",
  50:  "#D4F5EB",
} as const;

export const AccentColor = {
  900: "#5A2E12", // Dark Warm Brown
  800: "#8B4A1F", // Warm Brown
  700: "#B25D24", 
  600: "#D97A2B", // Gradient Orange
  500: "#D4A24C", // Gold / Amber (Main Accent)
  400: "#F2C56B", // Light Gold
  200: "#FBE3B3",
  100: "#FDF2DE",
  50:  "#FEF8EF",
} as const;

export const Neutral = {
  900: "#0B2A22",
  800: "#153A30",
  700: "#2A4F44",
  600: "#446A5E",
  500: "#A19379",
  400: "#AFA085", // Muted text
  300: "#C4B497", // Secondary text (Muted cream)
  200: "#E8D6B5", // Primary text (Light Beige / Cream)
  100: "#F5E8D3", // Brightest text
  50:  "#FAF3E6",
  0:   "#FFFFFF",
} as const;

export const Green = PrimaryColor;
export const Amber = AccentColor;

export const Status = {
  successDark:   "#065F46",
  success:       "#10B981",
  successLight:  "#D1FAE5",
  successBg:     "#064E3B",
  warningDark:   "#92400E",
  warning:       "#F59E0B",
  warningLight:  "#FEF3C7",
  warningBg:     "#78350F",
  errorDark:     "#991B1B",
  error:         "#EF4444",
  errorLight:    "#FECACA",
  errorBg:       "#7F1D1D",
  infoDark:      "#1E40AF",
  info:          "#3B82F6",
  infoLight:     "#DBEAFE",
  infoBg:        "#1E3A8A",
} as const;

export const Colors = {
  primary:            PrimaryColor[500],
  primaryDark:        PrimaryColor[700],
  primaryDeep:        PrimaryColor[950],
  primaryLight:       PrimaryColor[800], 
  primaryTint:        PrimaryColor[900], 
  primaryPressed:     PrimaryColor[600],

  accent:             AccentColor[600], // Orange
  accentDark:         AccentColor[800], // Warm Brown
  accentLight:        AccentColor[900], 
  accentTint:         AccentColor[900], 

  textPrimary:        Neutral[200], // Cream / Beige
  textSecondary:      Neutral[300], // Muted Cream
  textMuted:          Neutral[400], // Darker Beige
  textInverse:        PrimaryColor[950], // Dark text on light buttons
  textInverseSoft:    PrimaryColor[800],
  textAccentOnDark:   AccentColor[500], // Gold text

  background:         PrimaryColor[950],
  surface:            PrimaryColor[900],
  surfaceElevated:    PrimaryColor[800],
  surfaceSunken:      PrimaryColor[950],
  surfaceDark:        PrimaryColor[950],
  surfaceDeepDark:    PrimaryColor[950],

  border:             PrimaryColor[800],
  borderStrong:       PrimaryColor[700],
  borderBrand:        PrimaryColor[500],
  divider:            PrimaryColor[800],

  success:            Status.success,
  successDark:        Status.successDark,
  successLight:       Status.successLight,
  successBg:          Status.successBg,

  warning:            Status.warning,
  warningDark:        Status.warningDark,
  warningLight:       Status.warningLight,
  warningBg:          Status.warningBg,

  error:              Status.error,
  errorDark:          Status.errorDark,
  errorLight:         Status.errorLight,
  errorBg:            Status.errorBg,

  info:               Status.info,
  infoLight:          Status.infoLight,
  infoBg:             Status.infoBg,

  paid:               "#10B981",
  paidBg:             "#064E3B",
  paidBorder:         "#065F46",
  partial:            AccentColor[500],
  partialBg:          "#78350F",
  partialBorder:      "#92400E",
  late:               "#EF4444",
  lateBg:             "#7F1D1D",
  lateBorder:         "#991B1B",
  pending:            Neutral[400],
  pendingBg:          PrimaryColor[800],
  pendingBorder:      PrimaryColor[700],

  tabBarBg:           PrimaryColor[950],
  tabBarBorder:       PrimaryColor[800],
  tabBarActive:       AccentColor[500], // Gold active tabs
  tabBarInactive:     Neutral[400],

  shadowDefault:      "#000000",
  shadowBrand:        PrimaryColor[500],
  shadowAmber:        AccentColor[500],
  transparent:        "transparent",
} as const;

export type ColorToken = keyof typeof Colors;
export type GreenShade = keyof typeof Green;
export type AmberShade = keyof typeof Amber;
export type NeutralShade = keyof typeof Neutral;
