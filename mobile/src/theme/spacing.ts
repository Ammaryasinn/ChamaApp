/**
 * ─────────────────────────────────────────────────────────────
 *  HAZINA — Spacing & Layout Tokens
 *
 *  Built on a 4pt baseline grid.
 *  Every margin, padding, gap, and border radius in the app
 *  should come from this file — never use raw numbers.
 *
 *  Usage:
 *    import { Spacing, Radius, Shadow } from '@/theme/spacing';
 *    style={{ padding: Spacing[4], borderRadius: Radius.card }}
 * ─────────────────────────────────────────────────────────────
 */

import { Platform } from "react-native";

// ─── Spacing Scale (4pt grid) ─────────────────────────────────────────────────
// Every value is a multiple of 4.
// Named by step number — use the semantic aliases below in components.

export const Spacing = {
  /** 0px */
  0:   0,
  /** 2px — hairline gaps, icon optical corrections */
  0.5: 2,
  /** 4px — micro spacing, icon padding */
  1:   4,
  /** 6px — tight inline gaps */
  1.5: 6,
  /** 8px — compact padding, small gaps */
  2:   8,
  /** 10px — slightly relaxed compact padding */
  2.5: 10,
  /** 12px — standard inline padding, gap between icon and label */
  3:   12,
  /** 14px — slightly generous inline gap */
  3.5: 14,
  /** 16px — standard component padding, list item vertical padding */
  4:   16,
  /** 18px — comfortable component padding */
  4.5: 18,
  /** 20px — screen horizontal padding, card inner padding */
  5:   20,
  /** 24px — section spacing, card padding */
  6:   24,
  /** 28px — generous card padding, onboarding horizontal padding */
  7:   28,
  /** 32px — section breaks, modal padding */
  8:   32,
  /** 36px — large section spacing */
  9:   36,
  /** 40px — generous screen section breaks */
  10:  40,
  /** 44px — minimum touch target, large vertical padding */
  11:  44,
  /** 48px — hero top padding, large screen gaps */
  12:  48,
  /** 52px — hero bottom padding */
  13:  52,
  /** 56px — extra large spacing */
  14:  56,
  /** 64px — jumbo spacing, bottom safe area buffer */
  16:  64,
  /** 72px — very large gaps, scroll bottom padding */
  18:  72,
  /** 80px — avatar sizes, icon container sizes */
  20:  80,
  /** 96px — large avatar, empty state icon container */
  24:  96,
} as const;

// ─── Semantic Spacing Aliases ─────────────────────────────────────────────────
// Use these in components rather than raw Spacing[n] values.
// They describe *intent*, not size.

export const Layout = {
  // ── Screen ──────────────────────────────────────────────────────────────────
  /** Horizontal padding for all full-width screen content */
  screenPaddingH:       Spacing[5],
  /** Top padding for screen content below the header */
  screenPaddingTop:     Spacing[4],
  /** Bottom padding — extra room for the tab bar */
  screenPaddingBottom:  Spacing[16],

  // ── Hero / dark header panel ─────────────────────────────────────────────────
  heroPaddingH:         Spacing[7],
  heroPaddingTop:       Spacing[12],
  heroPaddingBottom:    Spacing[13],

  // ── Cards ────────────────────────────────────────────────────────────────────
  /** Standard card inner padding */
  cardPadding:          Spacing[5],
  /** Compact card inner padding */
  cardPaddingCompact:   Spacing[4],
  /** Generous card inner padding — e.g. empty state card */
  cardPaddingLg:        Spacing[7],
  /** Gap between stacked cards */
  cardGap:              Spacing[3],
  /** Gap between stacked cards — compact lists */
  cardGapSm:            Spacing[2],

  // ── List rows ────────────────────────────────────────────────────────────────
  /** Vertical padding inside a list row */
  rowPaddingV:          Spacing[4],
  /** Horizontal padding inside a list row */
  rowPaddingH:          Spacing[4],
  /** Gap between icon/avatar and text in a row */
  rowIconGap:           Spacing[3],

  // ── Sections ────────────────────────────────────────────────────────────────
  /** Vertical gap between page sections */
  sectionGap:           Spacing[6],
  /** Gap between section label and its content */
  sectionLabelGap:      Spacing[3],
  /** Bottom margin below a section header row */
  sectionHeaderBottom:  Spacing[3],

  // ── Forms / inputs ───────────────────────────────────────────────────────────
  /** Vertical padding inside an input field */
  inputPaddingV:        Spacing[4],
  /** Horizontal padding inside an input field */
  inputPaddingH:        Spacing[4],
  /** Gap between input label and the input box */
  inputLabelGap:        Spacing[2],
  /** Gap between stacked input groups */
  inputGroupGap:        Spacing[5],

  // ── Buttons ──────────────────────────────────────────────────────────────────
  /** Vertical padding inside a large primary button */
  buttonPaddingVLg:     Spacing[4.5],
  /** Vertical padding inside a standard button */
  buttonPaddingV:       Spacing[4],
  /** Vertical padding inside a compact / outline button */
  buttonPaddingVSm:     Spacing[3],
  /** Horizontal padding inside a button (when not full-width) */
  buttonPaddingH:       Spacing[6],
  /** Gap between stacked buttons */
  buttonGap:            Spacing[3],

  // ── Badges / pills ───────────────────────────────────────────────────────────
  /** Horizontal padding inside a badge pill */
  badgePaddingH:        Spacing[2],
  /** Vertical padding inside a badge pill */
  badgePaddingV:        Spacing[0.5],
  /** Horizontal padding inside a larger chip */
  chipPaddingH:         Spacing[3],
  /** Vertical padding inside a larger chip */
  chipPaddingV:         Spacing[1.5],

  // ── Tab bar ──────────────────────────────────────────────────────────────────
  tabBarHeight:         64,
  tabBarPaddingTop:     Spacing[1.5],
  tabBarPaddingBottom:  Platform.OS === "android" ? Spacing[3] : Spacing[2.5],

  // ── Avatars ──────────────────────────────────────────────────────────────────
  avatarSm:   32,
  avatarMd:   42,
  avatarLg:   56,
  avatarXl:   72,
  avatarHero: 84,

  // ── Icons ────────────────────────────────────────────────────────────────────
  iconXs:  16,
  iconSm:  20,
  iconMd:  24,
  iconLg:  28,
  iconXl:  32,

  // ── FAB ─────────────────────────────────────────────────────────────────────
  fabSize:   60,
  fabLift:   28,

  // ── Touch targets ────────────────────────────────────────────────────────────
  /** Minimum accessible touch target (Apple HIG / Material) */
  touchTargetMin: 44,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const Radius = {
  /** 4px — subtle rounding on small inline elements */
  xs:     4,
  /** 6px — badges, small chips */
  sm:     6,
  /** 8px — compact tags, small buttons */
  md:     8,
  /** 10px — standard chips, back buttons */
  badge:  10,
  /** 12px — standard buttons, input fields */
  input:  12,
  /** 14px — primary CTA buttons */
  button: 14,
  /** 16px — standard buttons (large) */
  lg:     16,
  /** 20px — chama type cards, list cards */
  card:   20,
  /** 24px — dashboard cards, member cards */
  cardLg: 24,
  /** 28px — sheet overlays, bottom drawers */
  sheet:  28,
  /** 32px — hero card sliding up panel */
  hero:   32,
  /** 9999px — fully rounded pills, avatar circles */
  full:   9999,
} as const;

// ─── Elevation / Shadow Presets ───────────────────────────────────────────────
// Cross-platform shadow objects.
// Use Platform.select for fine-grained iOS vs Android control.

export const Shadow = {
  /** No shadow */
  none: Platform.select({
    ios:     {},
    android: { elevation: 0 },
    default: {},
  }),

  /** Hairline — subtle card separation on white backgrounds */
  xs: Platform.select({
    ios: {
      shadowColor:   "#000",
      shadowOffset:  { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius:  2,
    },
    android: { elevation: 1 },
    default: {},
  }),

  /** Small — default card shadow */
  sm: Platform.select({
    ios: {
      shadowColor:   "#000",
      shadowOffset:  { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius:  6,
    },
    android: { elevation: 2 },
    default: {},
  }),

  /** Medium — elevated cards, action sheets */
  md: Platform.select({
    ios: {
      shadowColor:   "#000",
      shadowOffset:  { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius:  12,
    },
    android: { elevation: 4 },
    default: {},
  }),

  /** Large — modals, bottom sheets, popovers */
  lg: Platform.select({
    ios: {
      shadowColor:   "#000",
      shadowOffset:  { width: 0, height: 8 },
      shadowOpacity: 0.10,
      shadowRadius:  20,
    },
    android: { elevation: 8 },
    default: {},
  }),

  /** Hero card — the white card sliding up over the dark header */
  heroCard: Platform.select({
    ios: {
      shadowColor:   "#000",
      shadowOffset:  { width: 0, height: -4 },
      shadowOpacity: 0.06,
      shadowRadius:  16,
    },
    android: { elevation: 8 },
    default: {},
  }),

  /** Brand FAB — the floating green action button */
  fab: Platform.select({
    ios: {
      shadowColor:   "#006D5B",
      shadowOffset:  { width: 0, height: 5 },
      shadowOpacity: 0.40,
      shadowRadius:  10,
    },
    android: { elevation: 8 },
    default: {},
  }),

  /** Brand button — primary CTA buttons */
  button: Platform.select({
    ios: {
      shadowColor:   "#006D5B",
      shadowOffset:  { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius:  8,
    },
    android: { elevation: 4 },
    default: {},
  }),
} as const;

// ─── Z-index ──────────────────────────────────────────────────────────────────

export const ZIndex = {
  base:    0,
  raised:  1,
  overlay: 10,
  modal:   20,
  toast:   30,
  fab:     40,
} as const;

// ─── Type exports ─────────────────────────────────────────────────────────────

export type SpacingToken  = keyof typeof Spacing;
export type LayoutToken   = keyof typeof Layout;
export type RadiusToken   = keyof typeof Radius;
export type ShadowToken   = keyof typeof Shadow;
export type ZIndexToken   = keyof typeof ZIndex;
