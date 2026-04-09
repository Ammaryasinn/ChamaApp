import React, { useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "../theme";
import { useChamaContext } from "../context/ChamaContext";

// ─────────────────────────────────────────────────────────────────────────────
//  Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

function HeroCircles({ color }: { color?: string }) {
  return (
    <>
      <View style={[S.cTR, color ? { backgroundColor: "rgba(255,255,255,0.1)" } : null]} />
      <View style={[S.cBL, color ? { backgroundColor: "rgba(0,0,0,0.1)" } : null]} />
    </>
  );
}

function CheckRow({ text, amber }: { text: string; amber?: boolean }) {
  return (
    <View style={S.featureRow}>
      <Feather name="check" size={14} color={amber ? "#F59E0B" : "#059669"} />
      <Text style={[S.featureText, amber && S.featureTextAmber]}>{text}</Text>
    </View>
  );
}

function CrossRow({ text }: { text: string }) {
  return (
    <View style={S.featureRow}>
      <Feather name="x" size={14} color="#C8D8D4" />
      <Text style={[S.featureText, S.featureTextMuted]}>{text}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Compact horizontal slider
// ─────────────────────────────────────────────────────────────────────────────

function Slider({
  value, min, max, step = 1,
  onChange, label, unit,
  color,
}: {
  value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; label: string; unit: string;
  color: string;
}) {
  return (
    <View style={S.sliderWrap}>
      <Text style={S.sliderCaption}>{label}</Text>
      <View style={S.sliderRow}>
        <Pressable style={S.stepBtn} onPress={() => onChange(Math.max(min, value - step))}>
          <Text style={[S.stepBtnText, { color }]}>−</Text>
        </Pressable>
        <View style={S.trackContainer}>
          <View style={S.trackBg} />
          <View style={[S.trackFill, { width: `${((value - min) / (max - min)) * 100}%` as any, backgroundColor: color }]} />
          <View style={[S.trackThumb, { left: `${((value - min) / (max - min)) * 100}%` as any, marginLeft: -10, borderColor: color }]} />
        </View>
        <Text style={[S.sliderValue, { color }]}>{value}</Text>
        <Text style={S.sliderUnit}>{unit}</Text>
        <Pressable style={S.stepBtn} onPress={() => onChange(Math.min(max, value + step))}>
          <Text style={[S.stepBtnText, { color }]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function PremiumSubscriptionScreen({ navigation }: any) {
  const { activeChamaColor } = useChamaContext();
  const heroBg = activeChamaColor || Colors.primary;

  const [members, setMembers] = useState(20);
  const [chamas,  setChamas]  = useState(8);

  // Premium: Ksh 999/chama ÷ members
  const perMember = members > 0 ? Math.round(999 / members) : 0;

  // Taasisi: base 9,999 covers 5 chamas; each extra = 1,500
  const BASE_PRICE  = 9999;
  const EXTRA_PRICE = 1500;
  const BASE_COVERS = 5;
  const extraChamas = Math.max(0, chamas - BASE_COVERS);
  const extraCost   = extraChamas * EXTRA_PRICE;
  const taasisiTotal = BASE_PRICE + extraCost;

  // Savings vs buying individual Premium licenses
  const vsMultiple = 999 * chamas;
  const saving = Math.max(0, vsMultiple - taasisiTotal);

  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="light" />

      {/* ── Hero header ───────────────────────────────────── */}
      <View style={[S.hero, { backgroundColor: heroBg }]}>
        <HeroCircles color={activeChamaColor} />
        <View style={S.heroNav}>
          <Pressable onPress={() => navigation.goBack()} style={S.backBtn} hitSlop={12}>
            <Feather name="chevron-left" size={18} color="#fff" />
          </Pressable>
          <Text style={S.heroNavTitle}>Upgrade Hazina</Text>
        </View>
        <Text style={S.heroTitle}>Choose your plan</Text>
        <Text style={S.heroSub}>Start free · Upgrade when your chama is ready</Text>
      </View>

      <ScrollView contentContainerStyle={S.scroll} showsVerticalScrollIndicator={false}>

        {/* ════════════════════════════════════════════════
            FREE TIER
          ════════════════════════════════════════════════ */}
        <View style={S.card}>
          {/* Header */}
          <View style={S.cardHeaderFree}>
            <View style={S.badgeFree}><Text style={S.badgeFreeText}>Free — Bure</Text></View>
            <Text style={S.planName}>Free forever</Text>
            <View style={S.priceRow}>
              <Text style={S.priceCurrency}>Ksh</Text>
              <Text style={S.priceAmount}>0</Text>
              <Text style={S.pricePer}>/month</Text>
            </View>
            <Text style={S.planCaption}>Up to 15 members · No card needed</Text>
          </View>

          {/* Features */}
          <View style={S.featureList}>
            <CheckRow text="M-Pesa contribution collection" />
            <CheckRow text="Live group balance dashboard" />
            <CheckRow text="Auto penalty calculator" />
            <CheckRow text="Basic Hazina Score (view only)" />
            <CrossRow text="MGR rotation scheduler" />
            <CrossRow text="Bank loan access" />
          </View>

          <TouchableOpacity style={S.currentPlanBtn}>
            <Text style={S.currentPlanBtnText}>Current plan</Text>
          </TouchableOpacity>
        </View>

        {/* ════════════════════════════════════════════════
            PREMIUM TIER
          ════════════════════════════════════════════════ */}
        <View style={[S.card, S.cardFeatured]}>
          {/* Header */}
          <View style={[S.cardHeaderGreen, { backgroundColor: heroBg }]}>
            <View style={S.badgePremium}><Text style={[S.badgePremiumText, { color: heroBg }]}>Premium — Bila kikomo</Text></View>
            <Text style={[S.planName, S.planNameWhite]}>Premium</Text>
            <View style={S.priceRow}>
              <Text style={[S.priceCurrency, S.priceWhite]}>Ksh</Text>
              <Text style={[S.priceAmount, S.priceWhite]}>999</Text>
              <Text style={[S.pricePer, S.priceWhiteLight]}>/month</Text>
            </View>
            <Text style={S.planCaptionWhite}>
              Ksh {perMember} per member for {members} members
            </Text>
          </View>

          {/* Slider row — own section with top border */}
          <View style={S.sliderSection}>
            <Slider
              label="Your chama size:"
              value={members} min={2} max={50}
              onChange={setMembers}
              unit="members"
              color={heroBg}
            />
          </View>

          {/* Features */}
          <View style={S.featureList}>
            <CheckRow text="Everything in Free" />
            <CheckRow text="Unlimited members" />
            <CheckRow text="MGR rotation + swap requests" />
            <CheckRow text="Internal loan voting system" />
            <CheckRow text="Annual PDF financial report" />
            <CheckRow text="Full Hazina Score + history" amber />
            <CheckRow text="Bank loan offers unlocked" amber />
          </View>

          <TouchableOpacity style={[S.upgradePrimaryBtn, { backgroundColor: heroBg }]} activeOpacity={0.85}>
            <Text style={S.upgradePrimaryText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        </View>

        {/* ════════════════════════════════════════════════
            INSTITUTION / TAASISI TIER
          ════════════════════════════════════════════════ */}
        <View style={[S.card, S.cardFeatured]}>
          {/* Header */}
          <View style={[S.cardHeaderGreen, { backgroundColor: heroBg }]}>
            <View style={S.badgeTaasisi}><Text style={[S.badgeTaasisiText, { color: heroBg }]}>Institution — Taasisi</Text></View>
            <Text style={[S.planName, S.planNameWhite]}>Institution</Text>
            <View style={S.priceRow}>
              <Text style={[S.priceCurrency, S.priceWhite]}>Ksh</Text>
              <Text style={[S.priceAmount, S.priceAmountLarge, S.priceWhite]}>9,999</Text>
              <Text style={[S.pricePer, S.priceWhiteLight]}>/month</Text>
            </View>
            <Text style={S.planCaptionWhite}>
              Covers {BASE_COVERS} chamas · Ksh {EXTRA_PRICE.toLocaleString()} per extra
            </Text>
          </View>

          {/* Calculator row */}
          <View style={S.sliderSection}>
            <Slider
              label="How many chamas are you managing?"
              value={chamas} min={1} max={25}
              onChange={setChamas}
              unit="chamas"
              color={heroBg}
            />

            {/* 3-row breakdown: base · extra · divider · total */}
            <View style={S.breakdown}>
              <View style={S.breakdownRow}>
                <Text style={S.breakdownLabel}>Base plan ({BASE_COVERS} chamas)</Text>
                <Text style={S.breakdownVal}>Ksh {BASE_PRICE.toLocaleString()}</Text>
              </View>

              <View style={S.breakdownRow}>
                <Text style={S.breakdownLabel}>
                  Extra chamas ({extraChamas > 0 ? `+${extraChamas} × Ksh ${EXTRA_PRICE.toLocaleString()}` : "none"})
                </Text>
                <Text style={S.breakdownVal}>
                  {extraCost > 0 ? `Ksh ${extraCost.toLocaleString()}` : "—"}
                </Text>
              </View>

              <View style={S.breakdownDivider} />

              <View style={S.breakdownRow}>
                <Text style={S.breakdownTotalLabel}>Total per month</Text>
                <View style={S.breakdownTotalRight}>
                  <Text style={S.breakdownTotalCurrency}>Ksh</Text>
                  <Text style={S.breakdownTotalAmt}>{taasisiTotal.toLocaleString()}</Text>
                </View>
              </View>
            </View>

            {/* Savings pill — green tint (good news!) */}
            {saving > 0 && (
              <View style={S.savingPill}>
                <Feather name="trending-down" size={13} color="#059669" />
                <Text style={S.savingPillText}>
                  Save Ksh {saving.toLocaleString()} vs buying Premium for each chama
                </Text>
              </View>
            )}
          </View>

          {/* Features */}
          <View style={S.featureList}>
            <CheckRow text="Everything in Premium — all chamas" />
            <CheckRow text="One dashboard for all chamas" />
            <CheckRow text="Bulk M-Pesa across all groups" />
            <CheckRow text="Custom branding — your logo" />
            <CheckRow text="Dedicated account manager" />
            <CheckRow text="Direct bank API integration" amber />
            <CheckRow text="Group loan product from bank" amber />
          </View>

          <TouchableOpacity style={S.upgradePrimaryBtn} activeOpacity={0.85}>
            <Text style={S.upgradePrimaryText}>Get started with Taasisi</Text>
          </TouchableOpacity>
          <Text style={S.taasisiNote}>No setup fee · First month free · Cancel anytime</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primary },

  // Hero
  cTR: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(255,255,255,0.05)", top: -50, right: -50 },
  cBL: { position: "absolute", width: 140, height: 140, borderRadius: 70, backgroundColor: "rgba(245,158,11,0.10)", bottom: -40, left: -30 },
  hero: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20, overflow: "hidden", gap: 8 },
  heroNav: { flexDirection: "row", alignItems: "center", gap: 10 },
  backBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  heroNavTitle: { fontFamily: FontFamily.medium, fontSize: 14, color: "rgba(255,255,255,0.9)" },
  heroTitle: { fontFamily: FontFamily.extraBold, fontSize: 26, color: "#E8D6B5", fontWeight: "800", letterSpacing: -0.5 },
  heroSub:   { fontFamily: FontFamily.regular, fontSize: 13, color: "rgba(255,255,255,0.65)" },

  // Scroll
  scroll: { backgroundColor: "#F6F9F7", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100, gap: 16 },

  // Plan cards
  card: { backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1, borderColor: "#EBF1EF", overflow: "hidden" },
  cardFeatured: { borderWidth: 1.5, borderColor: "#EBF1EF" },

  // Card headers
  cardHeaderFree: { backgroundColor: "#F6F9F7", padding: 16, gap: 4 },

  // ── SOLID green header ──────────────────────────────────────────────────
  cardHeaderGreen: { backgroundColor: Colors.primary, padding: 16, gap: 4 },

  // Badges
  badgeFree:    { alignSelf: "flex-start", backgroundColor: "#E8F7F4", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 4 },
  badgeFreeText:{ fontFamily: FontFamily.heading, fontSize: 11, color: "#085041", fontWeight: "700" },
  badgePremium: { alignSelf: "flex-start", backgroundColor: "#F59E0B", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 4 },
  badgePremiumText: { fontFamily: FontFamily.heading, fontSize: 11, color: "#E8D6B5", fontWeight: "700" },
  badgeTaasisi: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 4 },
  badgeTaasisiText: { fontFamily: FontFamily.heading, fontSize: 11, color: "#E8D6B5", fontWeight: "700" },

  // Plan title + pricing
  planName:      { fontFamily: FontFamily.extraBold, fontSize: 22, color: "#E8D6B5", fontWeight: "800" },
  planNameWhite: { color: "#E8D6B5" },
  priceRow:      { flexDirection: "row", alignItems: "baseline", gap: 2 },
  priceCurrency: { fontFamily: FontFamily.heading, fontSize: 14, color: "#E8D6B5", fontWeight: "700", marginBottom: 3 },
  priceAmount:   { fontFamily: FontFamily.extraBold, fontSize: 38, color: "#E8D6B5", fontWeight: "800", letterSpacing: -1, lineHeight: 44 },
  priceAmountLarge: { fontSize: 42 },
  pricePer:      { fontFamily: FontFamily.regular, fontSize: 14, color: Colors.textMuted },
  priceWhite:    { color: "#E8D6B5" },
  priceWhiteLight:{ color: "rgba(255,255,255,0.7)" },
  planCaption:   { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textMuted },
  planCaptionWhite: { fontFamily: FontFamily.heading, fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: "700", marginTop: 2 },

  // Slider section — sits between header & features with a top border
  sliderSection: {
    borderTopWidth: 1, borderTopColor: "#EBF1EF",
    backgroundColor: Colors.background,
    paddingHorizontal: 16, paddingVertical: 14, gap: 12,
  },
  sliderWrap: { gap: 8 },
  sliderCaption: { fontFamily: FontFamily.medium, fontSize: 12, color: Colors.textSecondary },
  sliderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: "#EBF1EF",
    alignItems: "center", justifyContent: "center",
  },
  stepBtnText: { fontFamily: FontFamily.heading, fontSize: 18, color: Colors.primary, lineHeight: 22, fontWeight: "700" },
  trackContainer: { flex: 1, height: 6, position: "relative" },
  trackBg:     { position: "absolute", left: 0, right: 0, height: 6, backgroundColor: "#EBF1EF", borderRadius: 3 },
  trackFill:   { position: "absolute", left: 0, height: 6, backgroundColor: Colors.primary, borderRadius: 3 },
  trackThumb:  { position: "absolute", top: -7, width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.surface, borderWidth: 2.5, borderColor: Colors.primary },
  sliderValue: { fontFamily: FontFamily.extraBold, fontSize: 18, color: Colors.primary, fontWeight: "800", minWidth: 28, textAlign: "center" },
  sliderUnit:  { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textMuted },

  // Taasisi 3-row breakdown
  breakdown: {
    backgroundColor: "#EDE9FE", borderRadius: 10, padding: 12, gap: 6,
  },
  breakdownRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  breakdownLabel: { fontFamily: FontFamily.regular, fontSize: 12, color: "#4C1D95", flex: 1, flexWrap: "wrap" },
  breakdownVal:   { fontFamily: FontFamily.heading, fontSize: 12, color: "#4C1D95", fontWeight: "700" },
  breakdownDivider: { height: 1, backgroundColor: "#C4B5FD", marginVertical: 4 },
  breakdownTotalLabel: { fontFamily: FontFamily.heading, fontSize: 13, color: "#3C3489", fontWeight: "700", flex: 1 },
  breakdownTotalRight: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  breakdownTotalCurrency: { fontFamily: FontFamily.heading, fontSize: 12, color: "#3C3489", fontWeight: "700" },
  breakdownTotalAmt: { fontFamily: FontFamily.extraBold, fontSize: 22, color: "#3C3489", fontWeight: "800", letterSpacing: -0.5 },

  // Savings pill — green tint (it's good news!)
  savingPill: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    backgroundColor: "#ECFDF5", borderRadius: 8, borderWidth: 1, borderColor: "#A7F3D0",
    paddingHorizontal: 12, paddingVertical: 8,
  },
  savingPillText: { fontFamily: FontFamily.heading, fontSize: 12, color: "#065F46", fontWeight: "700", flex: 1, lineHeight: 17 },

  // Feature list
  featureList: { paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  featureText: { fontFamily: FontFamily.regular, fontSize: 13, color: "#E8D6B5", flex: 1 },
  featureTextAmber: { color: "#D97706", fontFamily: FontFamily.heading, fontWeight: "700" },
  featureTextMuted: { color: Colors.textMuted },

  // Buttons
  currentPlanBtn: {
    margin: 16, borderRadius: Radius.button, height: 48,
    borderWidth: 1.5, borderColor: "#EBF1EF",
    alignItems: "center", justifyContent: "center",
  },
  currentPlanBtnText: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.textSecondary, fontWeight: "700" },

  upgradePrimaryBtn: {
    margin: 16, backgroundColor: Colors.primary,
    borderRadius: Radius.button, height: 52,
    alignItems: "center", justifyContent: "center",
  },
  upgradePrimaryText: { fontFamily: FontFamily.heading, fontSize: 15, color: "#E8D6B5", fontWeight: "700" },

  taasisiNote: { textAlign: "center", fontFamily: FontFamily.regular, fontSize: 11, color: Colors.textMuted, paddingBottom: 16 },
});
