const fs = require('fs');
const path = './mobile/src/theme/colors.ts';

const newColors = `/**
 * ─────────────────────────────────────────────────────────────
 *  HAZINA — Master Color Tokens (Deep Jungle Dark Theme)
 * ─────────────────────────────────────────────────────────────
 */

export const PrimaryColor = {
  950: "#02120D", // App Background
  900: "#052118", // Surface / Cards
  800: "#083326", // Elevated surfaces / Borders
  700: "#0B4736", // Borders / pressed
  600: "#0F5C46", // Muted Brand
  500: "#13755A", // Primary Brand Buttons
  400: "#1AA67E", // Highlights
  300: "#22D4A2", // Text highlights / icons
  200: "#5EE3BD",
  100: "#A1F0D8",
  50:  "#DDF9F0",
} as const;

export const AccentColor = {
  900: "#78350F",
  800: "#92400E",
  700: "#B45309",
  600: "#D97706",
  500: "#F59E0B", // Warm Gold accents
  200: "#FDE68A",
  100: "#FEF3C7",
  50:  "#FFFBEB",
} as const;

export const Neutral = {
  900: "#02120D",
  800: "#052118",
  700: "#083326",
  600: "#144A3A",
  500: "#2A735D",
  400: "#519C85", // Muted text (Sage)
  300: "#86C2AE", // Secondary text (Light Sage)
  200: "#BEE8DA", // Primary text (Very light mint/sage)
  150: "#DDF9F0",
  100: "#F0FCF8",
  50:  "#F7FDFB",
  0:   "#FFFFFF",
} as const;

export const Colors = {
  primary:            PrimaryColor[500],
  primaryDark:        PrimaryColor[700],
  primaryDeep:        PrimaryColor[950],
  primaryLight:       PrimaryColor[800], 
  primaryTint:        PrimaryColor[900], 
  primaryPressed:     PrimaryColor[600],

  accent:             AccentColor[500],
  accentDark:         AccentColor[700],
  accentLight:        AccentColor[900], 
  accentTint:         AccentColor[900], 

  textPrimary:        Neutral[100], // Near white/mint text
  textSecondary:      Neutral[300], // Sage text
  textMuted:          Neutral[400], // Darker sage text
  textInverse:        PrimaryColor[950], // Dark text on light buttons
  textInverseSoft:    PrimaryColor[800],
  textAccentOnDark:   AccentColor[500],

  background:         PrimaryColor[950],
  surface:            PrimaryColor[900],
  surfaceElevated:    PrimaryColor[800],
  surfaceSunken:      PrimaryColor[950],
  surfaceDark:        PrimaryColor[950],
  surfaceDeepDark:    "#000000",

  border:             PrimaryColor[800],
  borderStrong:       PrimaryColor[700],
  borderBrand:        PrimaryColor[500],
  divider:            PrimaryColor[800],

  success:            "#10B981",
  successDark:        "#065F46",
  successLight:       "#022C22",
  successBg:          "#064E3B",

  warning:            AccentColor[500],
  warningDark:        "#92400E",
  warningLight:       "#451A03",
  warningBg:          "#78350F",

  error:              "#EF4444",
  errorDark:          "#991B1B",
  errorLight:         "#450A0A",
  errorBg:            "#7F1D1D",

  info:               "#3B82F6",
  infoLight:          "#172554",
  infoBg:             "#1E3A8A",

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
`;

fs.writeFileSync(path, newColors);
console.log("Patched to Deep Jungle theme");
