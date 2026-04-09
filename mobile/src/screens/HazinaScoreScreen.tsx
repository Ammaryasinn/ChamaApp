import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import Svg, {
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { Colors, FontFamily, FontSize, Spacing } from "../theme";

// ─────────────────────────────────────────────────────────────────────────────
//  Config
// ─────────────────────────────────────────────────────────────────────────────
const SCORE = 742;
const MIN_SCORE = 300;
const MAX_SCORE = 850;
const RADIUS = 90;
const STROKE = 14;
const FULL_CIRC = 2 * Math.PI * RADIUS;

// Arc is drawn from 210° to 330° (240° sweep) — a horseshoe
const ARC_SWEEP = 240;
const ARC_START_DEG = 150; // starts bottom-left
const DASH_TOTAL = (ARC_SWEEP / 360) * FULL_CIRC;

const SCORE_FACTORS = [
  { label: "Payment Consistency", weight: 35, value: 92, color: "#16A34A" },
  { label: "Loan Repayment", weight: 25, value: 80, color: "#0A1F18" },
  { label: "Tenure", weight: 20, value: 75, color: Colors.primaryLight },
  { label: "Penalty Record", weight: 10, value: 95, color: "#F59E0B" },
  { label: "Contribution Growth", weight: 10, value: 70, color: "#16A34A" },
];

const BANK_OFFERS = [
  {
    bank: "KCB Bank",
    offer: "Up to Ksh 200,000 business loan",
    rate: "11% p.a.",
    locked: false,
  },
  {
    bank: "Equity Bank",
    offer: "Group micro-loan Ksh 50,000",
    rate: "13% p.a.",
    locked: false,
  },
  {
    bank: "NCBA",
    offer: "Asset finance — vehicles & machinery",
    rate: "14% p.a.",
    locked: true,
  },
  {
    bank: "Absa Kenya",
    offer: "Chama mortgage — land & housing",
    rate: "12.5% p.a.",
    locked: true,
  },
];

const TIPS = [
  {
    icon: "check-circle" as const,
    tip: "Contribute on time every cycle — this affects 35% of your score.",
  },
  {
    icon: "trending-up" as const,
    tip: "Increase your monthly contribution amount steadily.",
  },
  {
    icon: "shield" as const,
    tip: "Repay any active loans before the due date.",
  },
  {
    icon: "clock" as const,
    tip: "Stay in your chama longer — tenure builds trust.",
  },
  {
    icon: "alert-circle" as const,
    tip: "Avoid penalties — late contributions reduce your score.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  Helpers: map score (300–850) to the arc's dash offset
// ─────────────────────────────────────────────────────────────────────────────
function scoreToOffset(score: number) {
  const pct = (score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE);
  const filled = pct * DASH_TOTAL;
  return DASH_TOTAL - filled; // dashOffset: 0 = full, DASH_TOTAL = empty
}

function scoreLabel(score: number) {
  if (score >= 750) return { label: "Excellent", color: "#16A34A" };
  if (score >= 650) return { label: "Good", color: "#059669" };
  if (score >= 550) return { label: "Fair", color: "#D97706" };
  return { label: "Poor", color: "#DC2626" };
}

// ─────────────────────────────────────────────────────────────────────────────
//  Arc Gauge component
// ─────────────────────────────────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  const animVal = useRef(new Animated.Value(0)).current;
  const { label, color } = scoreLabel(score);

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  const animatedOffset = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [DASH_TOTAL, scoreToOffset(score)],
  });

  const SIZE = (RADIUS + STROKE) * 2 + 4;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  // Convert arc start to radians for SVG path (not needed for circle trick)
  // We use strokeDasharray / strokeDashoffset trick on the circle
  // Rotate the whole circle so the gap is at the bottom
  const rotation = `rotate(${ARC_START_DEG} ${CX} ${CY})`;

  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ width: SIZE, height: SIZE * 0.75, overflow: "hidden" }}>
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <LinearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#16A34A" />
            </LinearGradient>
          </Defs>

          {/* Background track */}
          <Circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            stroke="#EBF1EF"
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={`${DASH_TOTAL} ${FULL_CIRC - DASH_TOTAL}`}
            strokeLinecap="round"
            transform={rotation}
          />

          {/* Animated fill — uses plain View trick since SVG animation needs workaround */}
          <Circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            stroke="url(#arcGradient)"
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={`${DASH_TOTAL} ${FULL_CIRC - DASH_TOTAL}`}
            strokeDashoffset={scoreToOffset(score)}
            strokeLinecap="round"
            transform={rotation}
          />
        </Svg>

        {/* Score text overlay */}
        <View style={[S.gaugeCenter, { top: SIZE * 0.22 }]}>
          <Text style={S.gaugeScore}>{score}</Text>
          <Text style={[S.gaugeLabel, { color }]}>{label}</Text>
          <Text style={S.gaugeRange}>
            {MIN_SCORE}–{MAX_SCORE}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Factor bar
// ─────────────────────────────────────────────────────────────────────────────
function FactorBar({ label, weight, value, color }: (typeof SCORE_FACTORS)[0]) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value / 100,
      duration: 800,
      delay: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={[S.factorRow, { marginBottom: 16 }]}>
      <View style={[S.factorTop, { marginBottom: 6 }]}>
        <Text style={S.factorLabel}>
          {label}{" "}
          <Text style={{ color: "#9CA3AF", fontSize: 12 }}>({weight}%)</Text>
        </Text>
        <Text style={[S.factorScore, { color, fontWeight: "bold" }]}>
          {value}/100
        </Text>
      </View>
      <View
        style={[
          S.trackBg,
          {
            height: 8,
            borderRadius: 4,
            backgroundColor: "#E5E7EB",
            overflow: "hidden",
          },
        ]}
      >
        <Animated.View
          style={[
            S.trackFill,
            {
              height: "100%",
              borderRadius: 4,
              backgroundColor: color,
              width: anim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", `${value}%`] as any,
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Bank offer card
// ─────────────────────────────────────────────────────────────────────────────
function BankCard({
  bank,
  offer,
  rate,
  locked,
  score,
}: (typeof BANK_OFFERS)[0] & { score: number }) {
  const isUnlocked = score >= 600 && !locked;

  return (
    <View style={[S.bankCard, locked && S.bankCardLocked]}>
      {locked && (
        <View style={S.lockOverlay}>
          <Feather name="lock" size={18} color={Colors.textMuted} />
          <Text style={S.lockText}>Score ≥ 600 to unlock</Text>
        </View>
      )}
      <View style={[S.bankCardInner, locked && { opacity: 0.3 }]}>
        <View style={S.bankTop}>
          <View style={S.bankIcon}>
            <Feather name="credit-card" size={18} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={S.bankName}>{bank}</Text>
            <Text style={S.bankOffer}>{offer}</Text>
          </View>
          <View style={S.ratePill}>
            <Text style={S.rateText}>{rate}</Text>
          </View>
        </View>
        {isUnlocked && (
          <TouchableOpacity style={S.applyBtn} activeOpacity={0.85}>
            <Text style={S.applyBtnText}>Apply Now</Text>
            <Feather name="external-link" size={13} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Tips accordion item
// ─────────────────────────────────────────────────────────────────────────────
function TipRow({ icon, tip }: (typeof TIPS)[0]) {
  return (
    <View style={S.tipRow}>
      <View style={S.tipIcon}>
        <Feather name={icon} size={16} color={Colors.primary} />
      </View>
      <Text style={S.tipText}>{tip}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Screen
// ─────────────────────────────────────────────────────────────────────────────
export default function HazinaScoreScreen({ navigation }: any) {
  const [tipsOpen, setTipsOpen] = useState(false);

  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity style={S.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Hazina Score</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={S.scroll}
      >
        {/* Gauge card */}
        <View style={S.gaugeCard}>
          <Text style={S.gaugeCardTitle}>Your Hazina Credit Score</Text>
          <ScoreGauge score={SCORE} />
          <Text style={S.gaugeCardSub}>
            Your score is used by partner banks to determine loan eligibility
            and limits.
          </Text>
        </View>

        {/* Score breakdown */}
        <View style={S.section}>
          <Text style={S.sectionTitle}>Score Breakdown</Text>
          <View style={S.sectionCard}>
            {SCORE_FACTORS.map((f) => (
              <FactorBar key={f.label} {...f} />
            ))}
          </View>
        </View>

        {/* Bank offers */}
        <View style={S.section}>
          <Text style={S.sectionTitle}>Bank Offers</Text>
          <Text style={S.sectionSub}>Score ≥ 600 unlocks all offers</Text>
          <View style={{ gap: 10 }}>
            {BANK_OFFERS.map((o) => (
              <BankCard key={o.bank} {...o} score={SCORE} />
            ))}
          </View>
        </View>

        {/* Tips accordion */}
        <View style={S.section}>
          <TouchableOpacity
            style={S.accordionHeader}
            onPress={() => setTipsOpen((v) => !v)}
            activeOpacity={0.85}
          >
            <Text style={S.sectionTitle}>How to improve</Text>
            <Feather
              name={tipsOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color={Colors.textMuted}
            />
          </TouchableOpacity>

          {tipsOpen && (
            <View style={S.sectionCard}>
              {TIPS.map((t, i) => (
                <TipRow key={i} {...t} />
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: FontFamily.extraBold,
    fontSize: 17,
    color: Colors.textPrimary,
    fontWeight: "800",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: { paddingHorizontal: 16, paddingTop: 20, gap: 24 },

  // ── Gauge card ─────────────────────────────────────────────────────────────
  gaugeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  gaugeCardTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "800",
    marginBottom: 12,
  },
  gaugeCardSub: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 12,
  },
  gaugeCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  gaugeScore: {
    fontFamily: FontFamily.extraBold,
    fontSize: 52,
    color: Colors.textPrimary,
    fontWeight: "800",
    lineHeight: 56,
  },
  gaugeLabel: {
    fontFamily: FontFamily.heading,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },
  gaugeRange: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // ── Sections ───────────────────────────────────────────────────────────────
  section: { gap: 10 },
  sectionTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "800",
  },
  sectionSub: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textMuted,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // ── Factor bars ────────────────────────────────────────────────────────────
  factorRow: { gap: 6 },
  factorTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  factorLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  factorWeight: {
    fontFamily: FontFamily.extraBold,
    fontSize: 13,
    fontWeight: "800",
  },
  trackBg: {
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  trackFill: { height: 8, borderRadius: 4 },
  factorScore: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.textMuted,
    alignSelf: "flex-end",
  },

  // ── Bank cards ─────────────────────────────────────────────────────────────
  bankCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    position: "relative",
  },
  bankCardLocked: { borderColor: Colors.border },
  bankCardInner: { padding: 14 },
  lockOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    gap: 4,
    borderRadius: 14,
  } as any,
  lockText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: Colors.textMuted,
  },
  bankTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#E8F7F4",
    alignItems: "center",
    justifyContent: "center",
  },
  bankName: {
    fontFamily: FontFamily.heading,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: "700",
  },
  bankOffer: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  ratePill: {
    backgroundColor: "#E8F7F4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rateText: {
    fontFamily: FontFamily.heading,
    fontSize: 11,
    color: Colors.primary,
    fontWeight: "700",
  },
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
    alignSelf: "flex-end",
  },
  applyBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.primary,
  },

  // ── Tips ───────────────────────────────────────────────────────────────────
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tipRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#E8F7F4",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tipText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
});
