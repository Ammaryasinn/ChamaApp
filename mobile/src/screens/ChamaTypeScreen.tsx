import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Animated,
  Modal,
  Platform,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadow } from "../theme";

// ─────────────────────────────────────────────────────────────────────────────
//  Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

function HeroCircles() {
  return (
    <>
      <View style={S.circleTopRight} />
      <View style={S.circleBottomLeft} />
    </>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = (step / total) * 100;
  return (
    <View style={S.progressTrack}>
      <View style={[S.progressFill, { width: `${pct}%` as any }]} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Animated toggle
// ─────────────────────────────────────────────────────────────────────────────

function AnimatedToggle({ isOn }: { isOn: boolean }) {
  const anim = useRef(new Animated.Value(isOn ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: isOn ? 1 : 0, duration: 200, useNativeDriver: false }).start();
  }, [isOn]);
  const trackColor = anim.interpolate({ inputRange: [0, 1], outputRange: ["#C8D8D4", Colors.primary] });
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 20] });
  return (
    <Animated.View style={[S.toggleTrack, { backgroundColor: trackColor }]}>
      <Animated.View style={[S.toggleThumb, { transform: [{ translateX }] }]} />
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Hybrid builder — sits inside the expanded card
// ─────────────────────────────────────────────────────────────────────────────

function HybridBuilder({ name, onNameChange, contribution, mgrPct, investPct, welfarePct, investEnabled, welfareEnabled, onAdjustMgr, onToggleInvest, onToggleWelfare }: any) {
  const mgrAmt     = Math.round((contribution * mgrPct) / 100);
  const invAmt     = Math.round((contribution * investPct) / 100);
  const welfareAmt = contribution - mgrAmt - invAmt;

  return (
    <View style={S.hybridWrap}>
      <Text style={S.hybridTitle}>Configure your split</Text>
      <Text style={S.hybridSub}>Choose which components and how to split contributions</Text>

      <Text style={[S.sliderLabel, { marginTop: 4, marginBottom: 8 }]}>CHAMA NAME</Text>
      <View style={S.nameInputWrap}>
        <TextInput
          style={S.nameInput}
          value={name}
          onChangeText={onNameChange}
          placeholder="e.g. Westlands Hybrid"
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {/* Toggle rows */}
      <View style={S.toggleBlock}>
        <View style={S.toggleRow}>
          <View style={[S.toggleIcon, { backgroundColor: "#FEF3C7" }]}>
            <Feather name="rotate-cw" size={16} color="#D97706" />
          </View>
          <Text style={S.toggleName}>Merry-go-round</Text>
          <View style={S.alwaysOnBadge}><Text style={S.alwaysOnText}>Always on</Text></View>
        </View>

        <View style={S.toggleDivider} />

        <Pressable style={S.toggleRow} onPress={onToggleInvest}>
          <View style={[S.toggleIcon, { backgroundColor: "#DBEAFE" }]}>
            <Feather name="trending-up" size={16} color="#3B82F6" />
          </View>
          <Text style={S.toggleName}>Investment fund</Text>
          <AnimatedToggle isOn={investEnabled} />
        </Pressable>

        <View style={S.toggleDivider} />

        <Pressable style={S.toggleRow} onPress={onToggleWelfare}>
          <View style={[S.toggleIcon, { backgroundColor: "#EDE9FE" }]}>
            <Feather name="shield" size={16} color="#7C3AED" />
          </View>
          <Text style={S.toggleName}>Welfare pot</Text>
          <AnimatedToggle isOn={welfareEnabled} />
        </Pressable>
      </View>

      {/* MGR slider */}
      <View style={S.sliderSection}>
        <View style={S.sliderHeader}>
          <Text style={S.sliderLabel}>MERRY-GO-ROUND</Text>
          <Text style={S.sliderPct}>{mgrPct}%</Text>
        </View>
        <View style={S.sliderRow}>
          <Pressable style={S.stepBtn} onPress={() => onAdjustMgr(-10)}>
            <Text style={S.stepBtnText}>−</Text>
          </Pressable>
          <View style={S.trackWrap}>
            <View style={S.trackBg} />
            <View style={[S.trackFill, { width: `${mgrPct}%` as any }]} />
            <View style={[S.trackThumb, { left: `${mgrPct}%` as any, marginLeft: -11 }]} />
          </View>
          <Pressable style={S.stepBtn} onPress={() => onAdjustMgr(10)}>
            <Text style={S.stepBtnText}>+</Text>
          </Pressable>
        </View>

        {investEnabled && (
          <View style={{ marginTop: 12 }}>
            <View style={S.autoBarHeader}>
              <Text style={S.autoBarLabel}>INVESTMENT FUND</Text>
              <Text style={[S.autoBarPct, { color: "#3B82F6" }]}>{investPct}%</Text>
            </View>
            <View style={S.autoTrack}>
              <View style={[S.autoFill, { width: `${investPct}%` as any, backgroundColor: "#93C5FD" }]} />
            </View>
          </View>
        )}
      </View>

      {/* Breakdown card — #E8F7F4 bg with colored dots */}
      <View style={S.breakdownCard}>
        <Text style={S.breakdownTitle}>
          Each <Text style={S.breakdownBold}>Ksh {contribution.toLocaleString()}</Text> contribution splits as:
        </Text>
        <View style={S.breakdownRows}>
          <View style={S.breakdownRow}>
            <View style={[S.bDot, { backgroundColor: Colors.primary }]} />
            <Text style={S.bItem}>MGR pot</Text>
            <Text style={S.bAmt}>Ksh {mgrAmt.toLocaleString()}</Text>
          </View>
          {investEnabled && (
            <View style={S.breakdownRow}>
              <View style={[S.bDot, { backgroundColor: "#93C5FD" }]} />
              <Text style={S.bItem}>Investment fund</Text>
              <Text style={S.bAmt}>Ksh {invAmt.toLocaleString()}</Text>
            </View>
          )}
          {welfareEnabled && (
            <View style={S.breakdownRow}>
              <View style={[S.bDot, { backgroundColor: "#C4B5FD" }]} />
              <Text style={S.bItem}>Welfare pot</Text>
              <Text style={S.bAmt}>Ksh {welfareAmt.toLocaleString()}</Text>
            </View>
          )}
        </View>
        {!welfareEnabled && (
          <Text style={S.breakdownNote}>No welfare pot yet — toggle it above to add one</Text>
        )}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Data
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_ICON_BG: Record<string, string> = {
  merry_go_round: "#FEF3C7",
  investment:     "#DBEAFE",
  welfare:        "#EDE9FE",
  hybrid:         "#D1FAE5",
  group_purchase: "#FEF3C7",
};
const TYPE_FEATHER: Record<string, React.ComponentProps<typeof Feather>["name"]> = {
  merry_go_round: "rotate-cw",
  investment:     "trending-up",
  welfare:        "shield",
  hybrid:         "sliders",
  group_purchase: "shopping-bag",
};
const TYPE_COLOR: Record<string, string> = {
  merry_go_round: "#D97706",
  investment:     "#3B82F6",
  welfare:        "#7C3AED",
  hybrid:         "#059669",
  group_purchase: "#D97706",
};

type ChamaTypeId = "merry_go_round" | "investment" | "welfare" | "hybrid" | "group_purchase";

const CHAMA_TYPES = [
  { id: "merry_go_round" as ChamaTypeId, title: "Merry-go-round", swahili: "Mchezo",        description: "Pot rotates to one member per cycle until all have received.", badge: "MOST POPULAR", bestFor: "Predictable lump-sum payouts" },
  { id: "investment"     as ChamaTypeId, title: "Investment",       swahili: "Uwekezaji",   description: "Group votes on stocks, land, unit trusts, or a business.",   bestFor: "Long-term wealth building" },
  { id: "welfare"        as ChamaTypeId, title: "Welfare / savings", swahili: "Akiba",      description: "Borrow from the group pot at low interest.",                 bestFor: "Emergency affordable credit" },
  { id: "hybrid"         as ChamaTypeId, title: "Hybrid",            swahili: "Mchanganyiko", description: "Combine two or three types with a custom split.",          bestFor: "Maximum flexibility" },
  { id: "group_purchase" as ChamaTypeId, title: "Group purchase",    swahili: "Nunua Pamoja", description: "Members save together to buy the same product for every household — one per cycle.", bestFor: "Appliances, furniture, solar, insurance" },
];

const TYPE_ROUTE: Record<ChamaTypeId, string> = {
  merry_go_round: "MGRSetup",
  investment:     "InvestmentSetup",
  welfare:        "WelfareSetup",
  hybrid:         "InviteMembers",
  group_purchase: "GroupPurchaseSetup",
};

// ─────────────────────────────────────────────────────────────────────────────
//  Chama card — equal height when unselected, smooth expansion when selected
//  Swahili on the SAME LINE as English title, italic gray
// ─────────────────────────────────────────────────────────────────────────────

function ChamaCard({ item, selected, onPress, hybridContent }: {
  item: typeof CHAMA_TYPES[0];
  selected: boolean;
  onPress: () => void;
  hybridContent?: React.ReactNode;
}) {
  const expandAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: selected && hybridContent ? 1 : 0,
      duration: 260,
      useNativeDriver: false,
    }).start();
  }, [selected]);

  return (
    <Pressable
      style={[S.card, selected && S.cardSelected]}
      onPress={onPress}
    >
      {/* Fixed-height card top — all cards same height at this section */}
      <View style={S.cardTop}>
        {/* Icon */}
        <View style={[S.iconBox, { backgroundColor: TYPE_ICON_BG[item.id] }]}>
          <Feather name={TYPE_FEATHER[item.id]} size={20} color={TYPE_COLOR[item.id]} />
        </View>

        {/* Text */}
        <View style={S.cardMeta}>
          {item.badge ? (
            <View style={S.popularBadge}>
              <Text style={S.popularBadgeText}>{item.badge}</Text>
            </View>
          ) : null}

          {/* Title + Swahili on SAME LINE */}
          <Text style={S.cardTitle} numberOfLines={1}>
            {item.title}
            <Text style={S.cardSwahili}> · {item.swahili}</Text>
          </Text>

          <Text style={S.cardDesc} numberOfLines={2}>{item.description}</Text>
          <Text style={S.bestFor} numberOfLines={1}>
            <Text style={S.bestForLabel}>Best for: </Text>
            <Text style={S.bestForVal}>{item.bestFor}</Text>
          </Text>
        </View>

        {/* Radio */}
        <View style={[S.radio, selected && S.radioSelected]}>
          {selected && <View style={S.radioDot} />}
        </View>
      </View>

      {/* Hybrid builder expands smoothly below — other cards stay full opacity */}
      {hybridContent && selected && (
        <View style={S.cardExpansion}>
          {hybridContent}
        </View>
      )}
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MGR nudge modal — slides up from bottom, rounded top corners
// ─────────────────────────────────────────────────────────────────────────────

function NudgeModal({ visible, onKeep, onAddPot }: {
  visible: boolean;
  onKeep: () => void;
  onAddPot: () => void;
}) {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fade,  { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(slide, { toValue: 0, tension: 70, friction: 11, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fade,  { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 100, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[S.overlay, { opacity: fade }]}>
        {/* Tap outside to dismiss */}
        <Pressable style={{ flex: 1 }} onPress={onKeep} />

        {/* Bottom sheet — slides up, rounded top corners only */}
        <Animated.View style={[S.sheet, { transform: [{ translateY: slide }] }]}>
          {/* Drag handle */}
          <View style={S.sheetHandle} />

          {/* 48px amber circle with alert-triangle */}
          <View style={S.nudgeAccent}>
            <Feather name="alert-triangle" size={22} color="#D97706" />
          </View>

          <Text style={S.nudgeQ}>
            What happens if Akinyi needs money urgently — before her turn in month 7?
          </Text>

          {/* Two scenario cards — exactly same size, side by side */}
          <View style={S.scenarioRow}>
            <View style={[S.scenario, S.scenarioBad]}>
              <Text style={S.scenarioBadLabel}>Pure MGR</Text>
              <Text style={S.scenarioBadText}>She waits or borrows outside at 30–40% interest.</Text>
            </View>
            <View style={[S.scenario, S.scenarioGood]}>
              <Text style={S.scenarioGoodLabel}>MGR + Savings</Text>
              <Text style={S.scenarioGoodText}>Borrows from group in 48 hrs at 5%.</Text>
            </View>
          </View>

          <Text style={S.nudgeHint}>
            Adding just{" "}
            <Text style={{ fontFamily: FontFamily.heading, color: Colors.textPrimary }}>
              20% to a savings pot
            </Text>{" "}
            costs less than a single M-Pesa fee per member per month.
          </Text>

          <TouchableOpacity style={S.nudgePrimary} onPress={onAddPot} activeOpacity={0.85}>
            <Text style={S.nudgePrimaryText}>Add a small savings pot</Text>
          </TouchableOpacity>

          <TouchableOpacity style={S.nudgeSecondary} onPress={onKeep} activeOpacity={0.85}>
            <Text style={S.nudgeSecondaryText}>Keep pure MGR for now</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function ChamaTypeScreen({ navigation }: any) {
  const [selected, setSelected] = useState<ChamaTypeId>("merry_go_round");
  const [nudge, setNudge] = useState(false);
  const [hybridName, setHybridName] = useState("");

  const [investEnabled, setInvestEnabled] = useState(true);
  const [welfareEnabled, setWelfareEnabled] = useState(false);
  const [mgrPct, setMgrPct] = useState(60);
  const CONTRIB = 5000;

  const welfarePct = welfareEnabled ? 10 : 0;
  const remaining  = 100 - welfarePct;
  const clampedMgr = Math.min(mgrPct, remaining - (investEnabled ? 10 : 0));
  const investPct  = investEnabled ? remaining - clampedMgr : 0;

  const adjustMgr = (delta: number) => {
    const max = remaining - (investEnabled ? 10 : 0);
    const min = investEnabled ? 10 : remaining;
    setMgrPct((p) => Math.min(max, Math.max(min, p + delta)));
  };

  const handleSelect = (id: ChamaTypeId) => {
    setSelected(id);
    if (id === "merry_go_round") setTimeout(() => setNudge(true), 360);
  };

  const handleContinue = () => {
    if (selected === "hybrid") {
      navigation.navigate("InviteMembers", { chamaType: "HYBRID", name: hybridName.trim() || "Hybrid Chama", mgrPercent: clampedMgr, investPercent: investPct, welfarePercent: welfarePct });
    } else {
      navigation.navigate(TYPE_ROUTE[selected]);
    }
  };

  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="light" />

      {/* Hero */}
      <View style={S.hero}>
        <HeroCircles />
        <View style={S.heroNav}>
          <Pressable onPress={() => navigation.goBack()} style={S.backBtn} hitSlop={12}>
            <Feather name="chevron-left" size={18} color="#fff" />
          </Pressable>
          <Text style={S.heroNavTitle}>New chama · Step 2 of{"\n"}3</Text>
        </View>
        <ProgressBar step={2} total={3} />
        <Text style={S.heroTitle}>Choose your{"\n"}chama type</Text>
        <Text style={S.heroSub}>
          {selected === "hybrid"
            ? "Hybrid selected — configure your split below"
            : "Select the structure that fits your group"}
        </Text>
      </View>

      {/* Cards list — non-selected cards stay at FULL opacity, only slightly dimmed */}
      <ScrollView contentContainerStyle={S.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={S.cardList}>
          {CHAMA_TYPES.map((t) => (
            <View
              key={t.id}
              style={[
                // dim NON-selected cards when hybrid is expanded (not when another simple type selected)
                selected === "hybrid" && t.id !== "hybrid"
                  ? { opacity: 0.45 }
                  : undefined,
              ]}
            >
              <ChamaCard
                item={t}
                selected={selected === t.id}
                onPress={() => handleSelect(t.id)}
                hybridContent={
                  t.id === "hybrid" ? (
                    <HybridBuilder
                      name={hybridName}
                      onNameChange={setHybridName}
                      contribution={CONTRIB}
                      mgrPct={clampedMgr}
                      investPct={investPct}
                      welfarePct={welfarePct}
                      investEnabled={investEnabled}
                      welfareEnabled={welfareEnabled}
                      onAdjustMgr={adjustMgr}
                      onToggleInvest={() => setInvestEnabled((v) => !v)}
                      onToggleWelfare={() => setWelfareEnabled((v) => !v)}
                    />
                  ) : undefined
                }
              />
            </View>
          ))}
        </View>

        {/* Chairperson note */}
        <View style={S.chairNote}>
          <Feather name="star" size={16} color="#D97706" />
          <Text style={S.chairText}>
            Creating this chama makes you its <Text style={S.chairBold}>Chairperson</Text> automatically.
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={S.footer}>
        <TouchableOpacity style={S.btnPrimary} onPress={handleContinue} activeOpacity={0.85}>
          <Text style={S.btnPrimaryText}>
            {selected === "hybrid" ? "Continue with hybrid" : "Continue"}
          </Text>
          <Feather name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <NudgeModal
        visible={nudge}
        onKeep={() => setNudge(false)}
        onAddPot={() => {
          setNudge(false);
          setSelected("hybrid");
          setInvestEnabled(false);
          setWelfareEnabled(true);
          setMgrPct(80);
        }}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primary },

  // Hero
  hero: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[5], paddingTop: 40, paddingBottom: 20,
    overflow: "hidden", gap: 8,
  },
  circleTopRight: {
    position: "absolute", width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.05)", top: -60, right: -60,
  },
  circleBottomLeft: {
    position: "absolute", width: 160, height: 160, borderRadius: 80,
    backgroundColor: "rgba(245,158,11,0.10)", bottom: -50, left: -40,
  },
  heroNav: { flexDirection: "row", alignItems: "center", gap: 10 },
  backBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  heroNavTitle: { fontFamily: FontFamily.medium, fontSize: 13, color: "rgba(255,255,255,0.85)" },
  progressTrack: { height: 3, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 2, overflow: "hidden" },
  progressFill:  { height: 3, backgroundColor: "#F59E0B", borderRadius: 2 },
  heroTitle: {
    fontFamily: FontFamily.extraBold, fontSize: 24, color: "#FFFFFF",
    fontWeight: "800", lineHeight: 30, letterSpacing: -0.3,
  },
  heroSub: { fontFamily: FontFamily.regular, fontSize: 13, color: "rgba(255,255,255,0.65)" },

  // Scroll
  scrollContent: {
    backgroundColor: "#F6F9F7",
    paddingHorizontal: Spacing[4], paddingTop: Spacing[4], paddingBottom: 100,
  },
  cardList: { gap: 10, marginBottom: Spacing[4] },

  // Card — fixed height for the top section so all look same when unselected
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14, borderWidth: 1, borderColor: "#EBF1EF",
    overflow: "hidden",
  },
  cardSelected: { borderColor: Colors.primary, borderWidth: 2 },

  cardTop: {
    flexDirection: "row", alignItems: "flex-start",
    padding: 14, gap: 12,
    // Set a min-height so short cards match tall ones
    minHeight: 98,
  },
  iconBox: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2,
  },
  cardMeta: { flex: 1, gap: 3 },
  popularBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FEF3C7", borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  popularBadgeText: {
    fontFamily: FontFamily.heading, fontSize: 9, color: "#D97706",
    fontWeight: "700", letterSpacing: 0.5,
  },

  // Title + swahili on same line
  cardTitle: {
    fontFamily: FontFamily.heading, fontSize: 15, color: Colors.textPrimary, fontWeight: "700",
    lineHeight: 20,
  },
  cardSwahili: {
    fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textMuted,
    fontStyle: "italic", fontWeight: "400",
  },
  cardDesc: {
    fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textSecondary, lineHeight: 17,
  },
  bestFor: { flexDirection: "row", flexWrap: "wrap" },
  bestForLabel: { fontFamily: FontFamily.medium, fontSize: 11, color: Colors.textMuted },
  bestForVal:   { fontFamily: FontFamily.heading, fontSize: 11, color: Colors.primary, fontWeight: "700" },

  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: "#C8D8D4",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  radioSelected: { borderColor: Colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },

  cardExpansion: { borderTopWidth: 1, borderTopColor: "#EBF1EF" },

  // Hybrid builder
  hybridWrap: { padding: 14, backgroundColor: "#FFFFFF" },
  hybridTitle: { fontFamily: FontFamily.heading, fontSize: 13, color: Colors.textPrimary, fontWeight: "700", marginBottom: 2 },
  hybridSub:   { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.textMuted, marginBottom: 14 },

  nameInputWrap: {
    backgroundColor: "#F9FBFA", borderWidth: 1, borderColor: "#EBF1EF", borderRadius: 10,
    marginBottom: 16, paddingHorizontal: 12, paddingVertical: 10,
  },
  nameInput: { fontFamily: FontFamily.semiBold, fontSize: 14, color: Colors.textPrimary },

  toggleBlock: {
    backgroundColor: "#F6F9F7", borderRadius: 10, borderWidth: 1, borderColor: "#EBF1EF",
    overflow: "hidden", marginBottom: 16,
  },
  toggleRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 12, paddingVertical: 10, gap: 10,
  },
  toggleIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  toggleName: { flex: 1, fontFamily: FontFamily.medium, fontSize: 13, color: Colors.textPrimary },
  toggleDivider: { height: 1, backgroundColor: "#EBF1EF", marginHorizontal: 12 },
  alwaysOnBadge: { backgroundColor: "#E8F7F4", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  alwaysOnText:  { fontFamily: FontFamily.heading, fontSize: 10, color: Colors.primary, fontWeight: "700" },
  toggleTrack: { width: 44, height: 25, borderRadius: 13, justifyContent: "center" },
  toggleThumb: {
    width: 21, height: 21, borderRadius: 11, backgroundColor: "#FFFFFF",
    position: "absolute", ...Shadow.sm,
  },

  // Slider
  sliderSection: { marginBottom: 16 },
  sliderHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  sliderLabel:  { fontFamily: FontFamily.heading, fontSize: 10, color: Colors.textSecondary, fontWeight: "700", letterSpacing: 1 },
  sliderPct:    { fontFamily: FontFamily.extraBold, fontSize: 20, color: Colors.primary, fontWeight: "800" },
  sliderRow:    { flexDirection: "row", alignItems: "center", gap: 10 },
  stepBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: "#F6F9F7", borderWidth: 1, borderColor: "#EBF1EF",
    alignItems: "center", justifyContent: "center",
  },
  stepBtnText: { fontFamily: FontFamily.heading, fontSize: 18, color: Colors.primary, lineHeight: 22, fontWeight: "700" },
  trackWrap: { flex: 1, height: 6, position: "relative" },
  trackBg:   { position: "absolute", left: 0, right: 0, height: 6, backgroundColor: "#EBF1EF", borderRadius: 3 },
  trackFill: { position: "absolute", left: 0, height: 6, backgroundColor: Colors.primary, borderRadius: 3 },
  trackThumb: {
    position: "absolute", width: 22, height: 22, borderRadius: 11,
    backgroundColor: "#FFFFFF", borderWidth: 2.5, borderColor: Colors.primary, top: -8, ...Shadow.sm,
  },
  autoBarHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  autoBarLabel:  { fontFamily: FontFamily.heading, fontSize: 9, color: Colors.textSecondary, letterSpacing: 1, fontWeight: "700", textTransform: "uppercase" },
  autoBarPct:    { fontFamily: FontFamily.heading, fontSize: 11, fontWeight: "700" },
  autoTrack:     { height: 5, backgroundColor: "#EBF1EF", borderRadius: 3, overflow: "hidden" },
  autoFill:      { height: 5, borderRadius: 3 },

  // Breakdown card — #E8F7F4 bg with colored dots
  breakdownCard: {
    backgroundColor: "#E8F7F4", borderRadius: 10, borderWidth: 1, borderColor: "#A8D8CF", padding: 12,
  },
  breakdownTitle: { fontFamily: FontFamily.medium, fontSize: 13, color: "#065F46", lineHeight: 18, marginBottom: 8 },
  breakdownBold:  { fontFamily: FontFamily.heading, fontWeight: "700" },
  breakdownRows:  { gap: 6, marginBottom: 6 },
  breakdownRow:   { flexDirection: "row", alignItems: "center", gap: 8 },
  bDot:   { width: 8, height: 8, borderRadius: 4 },
  bItem:  { flex: 1, fontFamily: FontFamily.medium, fontSize: 12, color: "#065F46" },
  bAmt:   { fontFamily: FontFamily.heading, fontSize: 12, color: "#065F46", fontWeight: "700" },
  breakdownNote: { fontFamily: FontFamily.regular, fontSize: 11, color: "#2E9E87", lineHeight: 15 },

  // Chairperson note
  chairNote: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    backgroundColor: "#FFFBEB", borderRadius: 10, borderWidth: 1, borderColor: "#FDE68A", padding: 12,
  },
  chairText: { flex: 1, fontFamily: FontFamily.regular, fontSize: 13, color: "#92400E", lineHeight: 18 },
  chairBold: { fontFamily: FontFamily.heading, fontWeight: "700", color: "#78350F" },

  // Footer
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#EBF1EF",
    paddingHorizontal: Spacing[5], paddingTop: 12,
    paddingBottom: Platform.OS === "android" ? 20 : 28,
  },
  btnPrimary: {
    backgroundColor: Colors.primary, borderRadius: Radius.button, height: 50,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  btnPrimaryText: { fontFamily: FontFamily.heading, fontSize: FontSize.lg, color: "#FFFFFF", fontWeight: "700" },

  // Nudge modal — slides up from bottom, top corners rounded only
  overlay: { flex: 1, backgroundColor: "rgba(7,21,16,0.65)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,  borderTopRightRadius: 28,
    borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 36,
  },
  sheetHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: "#E5E7EB", alignSelf: "center", marginBottom: 20,
  },
  nudgeAccent: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center", marginBottom: 14,
  },
  nudgeQ: {
    fontFamily: FontFamily.extraBold, fontSize: 19, color: Colors.textPrimary,
    lineHeight: 26, marginBottom: 16, fontWeight: "800", letterSpacing: -0.3,
  },

  // Scenario cards — EQUAL size with fixed height, side by side
  scenarioRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  scenario: {
    flex: 1,               // equal width
    minHeight: 80,         // equal min height
    borderRadius: 10, padding: 12, borderWidth: 1,
    justifyContent: "flex-start",
  },
  scenarioBad:  { backgroundColor: "#FEF2F2", borderColor: "#FECACA" },
  scenarioGood: { backgroundColor: "#ECFDF5", borderColor: "#D1FAE5" },
  scenarioBadLabel:  { fontFamily: FontFamily.heading, fontSize: 12, color: "#DC2626", fontWeight: "700", marginBottom: 4 },
  scenarioBadText:   { fontFamily: FontFamily.regular, fontSize: 12, color: "#DC2626", lineHeight: 16 },
  scenarioGoodLabel: { fontFamily: FontFamily.heading, fontSize: 12, color: "#059669", fontWeight: "700", marginBottom: 4 },
  scenarioGoodText:  { fontFamily: FontFamily.regular, fontSize: 12, color: "#059669", lineHeight: 16 },

  nudgeHint: { fontFamily: FontFamily.regular, fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: 20 },
  nudgePrimary: {
    backgroundColor: Colors.primary, borderRadius: Radius.button, height: 50,
    alignItems: "center", justifyContent: "center", marginBottom: 10,
  },
  nudgePrimaryText:   { fontFamily: FontFamily.heading, fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
  nudgeSecondary: {
    borderRadius: Radius.button, height: 46,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: "#EBF1EF",
  },
  nudgeSecondaryText: { fontFamily: FontFamily.medium, fontSize: 14, color: Colors.textSecondary },
});
