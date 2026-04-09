const fs = require('fs');
const path = './mobile/src/theme/colors.ts';

const newColors = `/**
 * ─────────────────────────────────────────────────────────────
 *  HAZINA — Master Color Tokens (Modern Neo-Bank Theme)
 * ─────────────────────────────────────────────────────────────
 */

// ─── Brand: Indigo / Midnight Blue ──────────────────────────────────────────
export const PrimaryColor = {
  950: "#0F172A", // Deepest slate/indigo
  900: "#1E1B4B", // Midnight blue (hero backgrounds)
  800: "#312E81", 
  700: "#3730A3", // Pressed states
  600: "#4338CA", // Main Brand (Indigo)
  500: "#4F46E5", // Hover/Active
  400: "#6366F1", // Secondary accents
  300: "#818CF8", 
  200: "#C7D2FE", 
  100: "#E0E7FF", // Light tinted backgrounds
  50:  "#EEF2FF",
  25:  "#F8FAFC",
} as const;

// ─── Accent: Electric Mint / Cyan ─────────────────────────────────────────
export const AccentColor = {
  900: "#164E63",
  800: "#155E75",
  700: "#0E7490",
  600: "#0891B2",
  500: "#06B6D4", // Electric Cyan (Highlights, Numbers)
  200: "#A5F3FC",
  100: "#CFFAFE",
  50:  "#ECFEFF",
} as const;

// ─── Neutrals (Cool / Crisp) ───────────────────────────────────────────────
export const Neutral = {
  900: "#0F172A", // Slate 900
  800: "#1E293B",
  700: "#334155",
  600: "#475569",
  500: "#64748B",
  400: "#94A3B8",
  300: "#CBD5E1",
  200: "#E2E8F0",
  150: "#F1F5F9", // Slate 100
  100: "#F8FAFC", // Slate 50
  50:  "#F8FAFC",
  0:   "#FFFFFF",
} as const;

export const Status = {
  successDark:   "#166534",
  success:       "#10B981", // Emerald
  successMid:    "#34D399",
  successLight:  "#D1FAE5",
  successBg:     "#ECFDF5",

  warningDark:   "#9A3412",
  warning:       "#F59E0B",
  warningMid:    "#FCD34D",
  warningLight:  "#FEF3C7",
  warningBg:     "#FFFBEB",

  errorDark:     "#991B1B",
  error:         "#EF4444",
  errorMid:      "#F87171",
  errorLight:    "#FECACA",
  errorBg:       "#FEF2F2",

  infoDark:      "#1E40AF",
  info:          "#3B82F6",
  infoMid:       "#93C5FD",
  infoLight:     "#DBEAFE",
  infoBg:        "#EFF6FF",
} as const;

export const Colors = {
  primary:            PrimaryColor[600],
  primaryDark:        PrimaryColor[900],
  primaryDeep:        PrimaryColor[950],
  primaryLight:       PrimaryColor[100],
  primaryTint:        PrimaryColor[50],
  primaryPressed:     PrimaryColor[700],

  accent:             AccentColor[500],
  accentDark:         AccentColor[700],
  accentLight:        AccentColor[100],
  accentTint:         AccentColor[50],

  textPrimary:        Neutral[900],
  textSecondary:      Neutral[500],
  textMuted:          Neutral[400],
  textInverse:        Neutral[0],
  textInverseSoft:    PrimaryColor[200],
  textAccentOnDark:   AccentColor[500],

  background:         Neutral[100],
  surface:            Neutral[0],
  surfaceElevated:    Neutral[0],
  surfaceSunken:      PrimaryColor[25],
  surfaceDark:        PrimaryColor[900],
  surfaceDeepDark:    PrimaryColor[950],

  border:             Neutral[200],
  borderStrong:       Neutral[300],
  borderBrand:        PrimaryColor[600],
  divider:            Neutral[150],

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
  pendingBorder:      Neutral[200],

  tabBarBg:           Neutral[0],
  tabBarBorder:       Neutral[150],
  tabBarActive:       PrimaryColor[600],
  tabBarInactive:     Neutral[400],

  shadowDefault:      "#000000",
  shadowBrand:        PrimaryColor[600],
  shadowAmber:        AccentColor[500],
  transparent:        "transparent",
} as const;
`;

fs.writeFileSync(path, newColors);
console.log("Patched theme colors");
