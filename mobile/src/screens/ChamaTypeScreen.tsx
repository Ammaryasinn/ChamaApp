import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Animated,
  Modal,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../theme";

// ─────────────────────────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────────────────────────

type ChamaTypeId = "merry_go_round" | "investment" | "welfare" | "hybrid";

interface ChamaTypeData {
  id: ChamaTypeId;
  title: string;
  swahili: string;
  description: string;
  icon: string;
  iconBg: string;
  badge?: string;
  bestFor: string;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Static data
// ─────────────────────────────────────────────────────────────────────────────

const CHAMA_TYPES: ChamaTypeData[] = [
  {
    id: "merry_go_round",
    title: "Merry-go-round",
    swahili: "Mchezo",
    description:
      "Everyone contributes each cycle. The full pot goes to one member at a time, rotating until all have received.",
    icon: "↺",
    iconBg: "#FEF3C7",
    badge: "MOST POPULAR",
    bestFor: "Predictable lump-sum payouts",
  },
  {
    id: "investment",
    title: "Investment chama",
    swahili: "Uwekezaji",
    description:
      "Contributions go into a shared fund. Group votes on stocks, land, unit trusts, or a business.",
    icon: "📈",
    iconBg: "#DBEAFE",
    bestFor: "Long-term wealth building",
  },
  {
    id: "welfare",
    title: "Welfare / savings",
    swahili: "Akiba",
    description:
      "Members save together and borrow from the pot at low interest. A member-owned mini bank.",
    icon: "🤝",
    iconBg: "#EDE9FE",
    bestFor: "Emergency access to affordable credit",
  },
  {
    id: "hybrid",
    title: "Hybrid",
    swahili: "Mchanganyiko",
    description:
      "Combine two or three types. Set your own contribution split below.",
    icon: "⚖️",
    iconBg: "#D1FAE5",
    bestFor: "Maximum flexibility",
  },
];

const TYPE_ROUTE_MAP: Record<ChamaTypeId, string> = {
  merry_go_round: "MGRSetup",
  investment: "InvestmentSetup",
  welfare: "WelfareSetup",
  hybrid: "InviteMembers",
};

// ─────────────────────────────────────────────────────────────────────────────
//  Animated toggle
// ─────────────────────────────────────────────────────────────────────────────

function AnimatedToggle({ isOn }: { isOn: boolean }) {
  const anim = useRef(new Animated.Value(isOn ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOn]);

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.borderStrong, Colors.primary],
  });
  const thumbTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 22],
  });

  return (
    <Animated.View style={[S.toggleTrack, { backgroundColor: trackColor }]}>
      <Animated.View
        style={[S.toggleThumb, { transform: [{ translateX: thumbTranslate }] }]}
      />
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MGR "What if?" nudge modal
// ─────────────────────────────────────────────────────────────────────────────

interface NudgeModalProps {
  visible: boolean;
  onKeepMGR: () => void;
  onAddPot: () => void;
}

function NudgeModal({ visible, onKeepMGR, onAddPot }: NudgeModalProps) {
  const slideAnim = useRef(new Animated.Value(80)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 12,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 80,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[S.modalOverlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            S.nudgeSheet,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Question mark accent */}
          <View style={S.nudgeAccent}>
            <Text style={S.nudgeAccentText}>?</Text>
          </View>

          <Text style={S.nudgeQuestion}>
            What happens if Akinyi needs money urgently — before her turn in
            month 7?
          </Text>

          <View style={S.nudgeScenarioRow}>
            <View style={[S.nudgeScenario, S.nudgeScenarioBad]}>
              <Text style={S.nudgeScenarioLabel}>Pure MGR</Text>
              <Text style={S.nudgeScenarioText}>
                She waits — or borrows outside at 30–40% interest.
              </Text>
            </View>
            <View style={[S.nudgeScenario, S.nudgeScenarioGood]}>
              <Text style={[S.nudgeScenarioLabel, { color: Colors.successDark }]}>
                MGR + Savings pot
              </Text>
              <Text style={[S.nudgeScenarioText, { color: Colors.successDark }]}>
                She borrows from the group in 48 hours at 5%.
              </Text>
            </View>
          </View>

          <Text style={S.nudgeHint}>
            Adding just{" "}
            <Text style={S.nudgeHintBold}>20% to a savings pot</Text> costs
            each member less than an M-Pesa transaction fee per month —
            and gives everyone a safety net.
          </Text>

          {/* CTAs */}
          <Pressable style={S.nudgePrimaryBtn} onPress={onAddPot}>
            <Text style={S.nudgePrimaryBtnText}>
              Add a small savings pot →
            </Text>
          </Pressable>

          <Pressable style={S.nudgeSecondaryBtn} onPress={onKeepMGR}>
            <Text style={S.nudgeSecondaryBtnText}>Keep pure MGR for now</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Hybrid split builder
// ─────────────────────────────────────────────────────────────────────────────

interface HybridBuilderProps {
  contribution: number;
  mgrPct: number;
  investPct: number;
  welfarePct: number;
  welfareEnabled: boolean;
  investEnabled: boolean;
  onAdjustMgr: (delta: number) => void;
  onToggleWelfare: () => void;
  onToggleInvest: () => void;
}

function HybridBuilder({
  contribution,
  mgrPct,
  investPct,
  welfarePct,
  welfareEnabled,
  investEnabled,
  onAdjustMgr,
  onToggleWelfare,
  onToggleInvest,
}: HybridBuilderProps) {
  const mgrAmount = Math.round((contribution * mgrPct) / 100);
  const invAmount = Math.round((contribution * investPct) / 100);
  const welfareAmount = contribution - mgrAmount - invAmount;

  return (
    <View style={S.hybridContainer}>
      {/* Section header */}
      <Text style={S.hybridTitle}>Configure your split</Text>
      <Text style={S.hybridSub}>
        Choose which components to include and how to split the contribution.
      </Text>

      {/* Component toggles */}
      <View style={S.hybridToggles}>
        {/* MGR — always on in hybrid */}
        <View style={S.hybridToggleRow}>
          <View style={[S.hybridToggleIcon, { backgroundColor: "#FEF3C7" }]}>
            <Text style={S.hybridToggleEmoji}>↺</Text>
          </View>
          <Text style={S.hybridToggleName}>Merry-go-round</Text>
          <View style={S.hybridToggleOnBadge}>
            <Text style={S.hybridToggleOnText}>Always on</Text>
          </View>
        </View>

        <View style={S.hybridDivider} />

        {/* Investment */}
        <Pressable style={S.hybridToggleRow} onPress={onToggleInvest}>
          <View style={[S.hybridToggleIcon, { backgroundColor: "#DBEAFE" }]}>
            <Text style={S.hybridToggleEmoji}>📈</Text>
          </View>
          <Text style={S.hybridToggleName}>Investment fund</Text>
          <AnimatedToggle isOn={investEnabled} />
        </Pressable>

        <View style={S.hybridDivider} />

        {/* Welfare */}
        <Pressable style={S.hybridToggleRow} onPress={onToggleWelfare}>
          <View style={[S.hybridToggleIcon, { backgroundColor: "#EDE9FE" }]}>
            <Text style={S.hybridToggleEmoji}>🤝</Text>
          </View>
          <Text style={S.hybridToggleName}>Welfare / savings pot</Text>
          <AnimatedToggle isOn={welfareEnabled} />
        </Pressable>
      </View>

      {/* MGR slider */}
      <View style={S.sliderSection}>
        <View style={S.sliderHeader}>
          <Text style={S.sliderLabelText}>MERRY-GO-ROUND</Text>
          <Text style={S.sliderPctText}>{mgrPct}%</Text>
        </View>
        <View style={S.sliderRow}>
          <Pressable style={S.stepBtn} onPress={() => onAdjustMgr(-10)}>
            <Text style={S.stepBtnText}>−</Text>
          </Pressable>
          <View style={S.trackContainer}>
            <View style={S.trackBg} />
            <View style={[S.trackFill, { width: `${mgrPct}%` as any }]} />
            <View
              style={[
                S.trackThumb,
                { left: `${mgrPct}%` as any, marginLeft: -11 },
              ]}
            />
          </View>
          <Pressable style={S.stepBtn} onPress={() => onAdjustMgr(10)}>
            <Text style={S.stepBtnText}>+</Text>
          </Pressable>
        </View>

        {/* Auto bars */}
        {investEnabled && (
          <View style={[S.autoBarRow, { marginTop: Spacing[4] }]}>
            <Text style={S.autoBarLabel}>INVESTMENT FUND</Text>
            <Text style={[S.autoBarPct, { color: "#3B82F6" }]}>
              {investPct}%
            </Text>
            <View style={S.autoTrackBg}>
              <View
                style={[
                  S.autoTrackFill,
                  {
                    width: `${investPct}%` as any,
                    backgroundColor: "#93C5FD",
                  },
                ]}
              />
            </View>
          </View>
        )}

        {welfareEnabled && (
          <View style={[S.autoBarRow, { marginTop: Spacing[3] }]}>
            <Text style={S.autoBarLabel}>WELFARE POT</Text>
            <Text style={[S.autoBarPct, { color: "#7C3AED" }]}>
              {welfarePct}%
            </Text>
            <View style={S.autoTrackBg}>
              <View
                style={[
                  S.autoTrackFill,
                  {
                    width: `${welfarePct}%` as any,
                    backgroundColor: "#C4B5FD",
                  },
                ]}
              />
            </View>
          </View>
        )}
      </View>

      {/* Live breakdown card */}
      <View style={S.breakdownCard}>
        <Text style={S.breakdownTitle}>
          Each{" "}
          <Text style={S.breakdownBold}>
            Ksh {contribution.toLocaleString()}
          </Text>{" "}
          contribution splits as:
        </Text>
        <View style={S.breakdownRows}>
          <View style={S.breakdownRow}>
            <View style={[S.breakdownDot, { backgroundColor: Colors.primary }]} />
            <Text style={S.breakdownItem}>MGR pot</Text>
            <Text style={S.breakdownAmount}>
              Ksh {mgrAmount.toLocaleString()}
            </Text>
          </View>
          {investEnabled && (
            <View style={S.breakdownRow}>
              <View
                style={[S.breakdownDot, { backgroundColor: "#93C5FD" }]}
              />
              <Text style={S.breakdownItem}>Investment fund</Text>
              <Text style={S.breakdownAmount}>
                Ksh {invAmount.toLocaleString()}
              </Text>
            </View>
          )}
          {welfareEnabled && (
            <View style={S.breakdownRow}>
              <View
                style={[S.breakdownDot, { backgroundColor: "#C4B5FD" }]}
              />
              <Text style={S.breakdownItem}>Welfare pot</Text>
              <Text style={S.breakdownAmount}>
                Ksh {welfareAmount.toLocaleString()}
              </Text>
            </View>
          )}
        </View>
        <Text style={S.breakdownNote}>
          After 3 months your welfare pot = Ksh{" "}
          {welfareEnabled
            ? (welfareAmount * 3).toLocaleString()
            : "0"}{" "}
          — available for member loans immediately.
        </Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Chama type card
// ─────────────────────────────────────────────────────────────────────────────

interface CardProps {
  item: ChamaTypeData;
  selected: boolean;
  onPress: () => void;
  expanded?: boolean;
  hybridContent?: React.ReactNode;
}

function ChamaCard({
  item,
  selected,
  onPress,
  expanded,
  hybridContent,
}: CardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, {
      toValue: 0.975,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();

  const handlePressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[S.card, selected && S.cardSelected]}
      >
        {/* Top row */}
        <View style={S.cardTopRow}>
          {/* Icon */}
          <View style={[S.iconCircle, { backgroundColor: item.iconBg }]}>
            <Text style={S.iconEmoji}>{item.icon}</Text>
          </View>

          {/* Text */}
          <View style={S.cardTextBlock}>
            <View style={S.cardTitleRow}>
              <Text style={S.cardTitle}>{item.title}</Text>
              <Text style={S.cardSwahili}>{item.swahili}</Text>
            </View>
            {item.badge && (
              <View style={S.badge}>
                <Text style={S.badgeText}>{item.badge}</Text>
              </View>
            )}
            <Text style={S.cardDesc}>{item.description}</Text>
            <View style={S.bestForRow}>
              <Text style={S.bestForLabel}>Best for: </Text>
              <Text style={S.bestForValue}>{item.bestFor}</Text>
            </View>
          </View>

          {/* Radio */}
          <View style={[S.radio, selected && S.radioSelected]}>
            {selected && <View style={S.radioDot} />}
          </View>
        </View>

        {/* Hybrid builder — inline expansion */}
        {selected && expanded && hybridContent && (
          <View style={S.cardExpansion}>{hybridContent}</View>
        )}
      </Pressable>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Main screen
// ─────────────────────────────────────────────────────────────────────────────

export default function ChamaTypeScreen({ navigation }: any) {
  const [selectedType, setSelectedType] = useState<ChamaTypeId>("merry_go_round");
  const [nudgeVisible, setNudgeVisible] = useState(false);

  // Hybrid state
  const BASE_CONTRIBUTION = 5000;
  const [mgrEnabled] = useState(true); // always on
  const [investEnabled, setInvestEnabled] = useState(true);
  const [welfareEnabled, setWelfareEnabled] = useState(false);
  const [mgrPct, setMgrPct] = useState(60);

  const welfarePct = welfareEnabled ? 10 : 0;
  const remaining = 100 - welfarePct;
  const clampedMgr = Math.min(mgrPct, remaining - (investEnabled ? 10 : 0));
  const investPct = investEnabled ? remaining - clampedMgr : 0;

  const adjustMgr = (delta: number) => {
    const max = remaining - (investEnabled ? 10 : 0);
    const min = investEnabled ? 10 : remaining;
    setMgrPct((p) => Math.min(max, Math.max(min, p + delta)));
  };

  const handleSelectType = (id: ChamaTypeId) => {
    setSelectedType(id);
    // Trigger nudge when selecting pure MGR
    if (id === "merry_go_round") {
      setTimeout(() => setNudgeVisible(true), 400);
    }
  };

  const handleKeepMGR = () => {
    setNudgeVisible(false);
  };

  const handleAddPot = () => {
    setNudgeVisible(false);
    // Switch to hybrid pre-configured as MGR + welfare
    setSelectedType("hybrid");
    setInvestEnabled(false);
    setWelfareEnabled(true);
    setMgrPct(80);
  };

  const handleContinue = () => {
    if (selectedType === "hybrid") {
      navigation.navigate("InviteMembers", {
        chamaType: "HYBRID",
        mgrPercent: clampedMgr,
        investPercent: investPct,
        welfarePercent: welfarePct,
      });
    } else {
      navigation.navigate(TYPE_ROUTE_MAP[selectedType]);
    }
  };

  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={S.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [S.backBtn, pressed && S.backBtnPressed]}
          hitSlop={12}
        >
          <Text style={S.backArrow}>←</Text>
        </Pressable>
        <Text style={S.headerTitle}>New chama</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={S.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero text */}
        <Text style={S.screenTitle}>Choose your{"\n"}chama type</Text>
        <Text style={S.screenSub}>
          Select the structure that best fits how your group will save, invest,
          or rotate money.
        </Text>

        {/* Cards */}
        <View style={S.cardList}>
          {CHAMA_TYPES.map((type) => (
            <ChamaCard
              key={type.id}
              item={type}
              selected={selectedType === type.id}
              onPress={() => handleSelectType(type.id)}
              expanded={type.id === "hybrid"}
              hybridContent={
                type.id === "hybrid" ? (
                  <HybridBuilder
                    contribution={BASE_CONTRIBUTION}
                    mgrPct={clampedMgr}
                    investPct={investPct}
                    welfarePct={welfarePct}
                    welfareEnabled={welfareEnabled}
                    investEnabled={investEnabled}
                    onAdjustMgr={adjustMgr}
                    onToggleWelfare={() => setWelfareEnabled((v) => !v)}
                    onToggleInvest={() => setInvestEnabled((v) => !v)}
                  />
                ) : undefined
              }
            />
          ))}
        </View>

        {/* Chairperson note */}
        <View style={S.chairpersonNote}>
          <Text style={S.chairpersonIcon}>👑</Text>
          <Text style={S.chairpersonText}>
            By creating this chama, you automatically become its{" "}
            <Text style={S.chairpersonBold}>Chairperson</Text>.
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={S.footer}>
        <Pressable
          style={({ pressed }) => [
            S.continueBtn,
            pressed && S.continueBtnPressed,
          ]}
          onPress={handleContinue}
        >
          <Text style={S.continueBtnText}>Continue</Text>
        </Pressable>
      </View>

      {/* MGR nudge modal */}
      <NudgeModal
        visible={nudgeVisible}
        onKeepMGR={handleKeepMGR}
        onAddPot={handleAddPot}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  // ── Screen ────────────────────────────────────────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    backgroundColor: Colors.surface,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.input,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backBtnPressed: {
    backgroundColor: Colors.divider,
  },
  backArrow: {
    fontSize: 20,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },

  // ── Content ───────────────────────────────────────────────────────────────
  content: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[10],
  },
  screenTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["6xl"],
    fontWeight: FontWeight.extraBold,
    color: Colors.textPrimary,
    lineHeight: 42,
    letterSpacing: -0.5,
    marginBottom: Spacing[2],
  },
  screenSub: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing[7],
  },

  // ── Card list ─────────────────────────────────────────────────────────────
  cardList: {
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    overflow: "hidden",
    ...Shadow.sm,
  },
  cardSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.primaryTint,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing[4],
    gap: Spacing[3],
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  iconEmoji: {
    fontSize: 22,
    lineHeight: 26,
  },
  cardTextBlock: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    marginBottom: Spacing[1],
  },
  cardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  cardSwahili: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    color: Colors.textMuted,
    fontStyle: "italic",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    marginBottom: Spacing[1.5],
  },
  badgeText: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.micro,
    fontWeight: FontWeight.extraBold,
    color: Colors.accentDark,
    letterSpacing: 0.5,
  },
  cardDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: Spacing[1.5],
  },
  bestForRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  bestForLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.textMuted,
  },
  bestForValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },

  // Radio
  radio: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 4,
  },
  radioSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },

  // Card expansion
  cardExpansion: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },

  // ── Animated toggle ───────────────────────────────────────────────────────
  toggleTrack: {
    width: 46,
    height: 27,
    borderRadius: Radius.full,
    justifyContent: "center",
    flexShrink: 0,
  },
  toggleThumb: {
    width: 21,
    height: 21,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    position: "absolute",
    ...Shadow.sm,
  },

  // ── Hybrid builder ────────────────────────────────────────────────────────
  hybridContainer: {
    padding: Spacing[4],
    backgroundColor: Colors.surface,
  },
  hybridTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extraBold,
    color: Colors.textPrimary,
    marginBottom: Spacing[1],
  },
  hybridSub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: Spacing[5],
  },

  // Hybrid toggles
  hybridToggles: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    marginBottom: Spacing[6],
  },
  hybridToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3.5],
    gap: Spacing[3],
  },
  hybridToggleIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  hybridToggleEmoji: { fontSize: 18 },
  hybridToggleName: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  hybridToggleOnBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
  },
  hybridToggleOnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  hybridDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing[4],
  },

  // Slider section
  sliderSection: {
    marginBottom: Spacing[5],
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing[3],
  },
  sliderLabelText: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.extraBold,
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  sliderPctText: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["2xl"],
    fontWeight: FontWeight.extraBold,
    color: Colors.primary,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepBtnText: {
    color: Colors.primary,
    fontSize: FontSize["2xl"],
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    lineHeight: 28,
  },
  trackContainer: {
    flex: 1,
    height: 8,
    position: "relative",
    justifyContent: "center",
  },
  trackBg: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: Radius.xs,
  },
  trackFill: {
    position: "absolute",
    left: 0,
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xs,
  },
  trackThumb: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 3,
    borderColor: Colors.primary,
    top: -7,
    ...Shadow.sm,
  },

  // Auto bars
  autoBarRow: {
    gap: Spacing[2],
  },
  autoBarLabel: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.xxs,
    fontWeight: FontWeight.extraBold,
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: Spacing[1],
  },
  autoBarPct: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    position: "absolute",
    right: 0,
    top: 0,
  },
  autoTrackBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: Radius.xs,
    overflow: "hidden",
  },
  autoTrackFill: {
    height: 6,
    borderRadius: Radius.xs,
  },

  // Breakdown card
  breakdownCard: {
    backgroundColor: Colors.successBg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.successLight,
    padding: Spacing[4],
  },
  breakdownTitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.successDark,
    lineHeight: 20,
    marginBottom: Spacing[3],
  },
  breakdownBold: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  breakdownRows: {
    gap: Spacing[2],
    marginBottom: Spacing[3],
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
  breakdownItem: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.successDark,
  },
  breakdownAmount: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extraBold,
    color: Colors.successDark,
  },
  breakdownNote: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    color: Colors.success,
    lineHeight: 17,
    borderTopWidth: 1,
    borderTopColor: Colors.successLight,
    paddingTop: Spacing[2.5],
  },

  // ── Chairperson note ──────────────────────────────────────────────────────
  chairpersonNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.accentTint,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.warningLight,
    paddingVertical: Spacing[3.5],
    paddingHorizontal: Spacing[4],
    gap: Spacing[3],
  },
  chairpersonIcon: {
    fontSize: 22,
    lineHeight: 26,
  },
  chairpersonText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.warningDark,
    lineHeight: 21,
  },
  chairpersonBold: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    color: "#78350F",
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Platform.OS === "android" ? Spacing[6] : Spacing[7],
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  continueBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.button,
  },
  continueBtnPressed: {
    backgroundColor: Colors.primaryPressed,
  },
  continueBtnText: {
    color: Colors.textInverse,
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.3,
  },

  // ── Nudge modal ───────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(7, 21, 16, 0.6)",
    justifyContent: "flex-end",
  },
  nudgeSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[6],
    paddingBottom: Platform.OS === "android" ? Spacing[8] : Spacing[10],
  },
  nudgeAccent: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[4],
  },
  nudgeAccentText: {
    fontSize: 24,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    color: Colors.accentDark,
    lineHeight: 28,
  },
  nudgeQuestion: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["3xl"],
    fontWeight: FontWeight.extraBold,
    color: Colors.textPrimary,
    lineHeight: 32,
    marginBottom: Spacing[5],
    letterSpacing: -0.3,
  },
  nudgeScenarioRow: {
    flexDirection: "row",
    gap: Spacing[3],
    marginBottom: Spacing[5],
  },
  nudgeScenario: {
    flex: 1,
    borderRadius: Radius.lg,
    padding: Spacing[3.5],
    borderWidth: 1,
  },
  nudgeScenarioBad: {
    backgroundColor: Colors.errorBg,
    borderColor: Colors.errorLight,
  },
  nudgeScenarioGood: {
    backgroundColor: Colors.successBg,
    borderColor: Colors.successLight,
  },
  nudgeScenarioLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.errorDark,
    marginBottom: Spacing[1.5],
  },
  nudgeScenarioText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    color: Colors.errorDark,
    lineHeight: 18,
  },
  nudgeHint: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing[6],
  },
  nudgeHintBold: {
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  nudgePrimaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: Spacing[3],
    ...Shadow.button,
  },
  nudgePrimaryBtnText: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extraBold,
    color: Colors.textInverse,
    letterSpacing: 0.2,
  },
  nudgeSecondaryBtn: {
    borderRadius: Radius.lg,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  nudgeSecondaryBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
  },
});
