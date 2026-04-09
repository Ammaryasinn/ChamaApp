const fs = require('fs');
const path = './mobile/src/theme/colors.ts';
let code = fs.readFileSync(path, 'utf8');

// Fix circular dependencies and missing exports
code = code.replace(/Colors\.surfaceElevated/g, '"#083326"');
code = code.replace(/Colors\.primary/g, '"#13755A"');

// Re-add Green and Amber aliases so imports don't break
code += `
export const Green = PrimaryColor;
export const Amber = AccentColor;
export const Status = {
  successDark:   "#065F46",
  success:       "#10B981",
  successLight:  "#D1FAE5",
  successBg:     "#ECFDF5",
  warningDark:   "#92400E",
  warning:       "#F59E0B",
  warningLight:  "#FEF3C7",
  warningBg:     "#FFFBEB",
  errorDark:     "#991B1B",
  error:         "#EF4444",
  errorLight:    "#FECACA",
  errorBg:       "#FEF2F2",
  infoDark:      "#1E40AF",
  info:          "#3B82F6",
  infoLight:     "#DBEAFE",
  infoBg:        "#EFF6FF",
};

export type ColorToken = keyof typeof Colors;
export type GreenShade = keyof typeof Green;
export type AmberShade = keyof typeof Amber;
export type NeutralShade = keyof typeof Neutral;
`;

fs.writeFileSync(path, code);
console.log('Fixed theme exports');
