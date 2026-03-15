import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Animated,
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

// ─── Type map ────────────────────────────────────────────────────────────────
const TYPE_MAP: Record<string, string> = {
  merry_go_round: "MERRY_GO_ROUND",
  investment: "INVESTMENT",
  welfare: "WELFARE",
  hybrid: "HYBRID",
};

// ─── Data ────────────────────────────────────────────────────────────────────
const CHAMA_TYPES = [
  {
    id: "merry_go_round",
    title: "Merry-go-round",
    description:
      "Each member contributes every cycle. The full pot goes to one member at a time. Rotates until everyone has received.",
    icon: "↺",
    iconBg: "#FEF3C7",
    badge: "MOST POPULAR",
  },
  {
    id: "investment",
    title: "Investment chama",
    description:
      "Contributions go into a shared investment fund. Group votes on stocks, land, unit trusts, or a business.",
    icon: "📈",
    iconBg: "#DBEAFE",
    badge: null,
  },
  {
    id: "welfare",
    title: "Welfare / savings chama",
    description:
      "Members save together and can borrow from the group pot at low interest. Like a member-owned mini bank.",
    icon: "🤝",
    iconBg: "#EDE9FE",
    badge: null,
  },
  {
    id: "hybrid",
    title: "Hybrid",
    description:
      "Combine two or more chama types. You'll configure the split in the next step.",
    icon: "⚖️",
    iconBg: "#D1FAE5",
    badge: null,
  },
];

// ─── Animated Toggle ─────────────────────────────────────────────────────────
function ToggleSwitch({ isOn }: { isOn: boolean }) {
  const anim = useRef(new Animated.Value(isOn ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isOn ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [isOn]);

  // Pill: width 44, height 26 — thumb: 20×20 — padding: 3
  // OFF: thumb at x=3, ON: thumb at x = 44 − 20 − 3 = 21
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 21],
  });

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#D1D5DB", "#006D5B"],
  });

  return (
    <Animated.View style={[styles.togglePill, { backgroundColor: trackColor }]}>
      <Animated.View
        style={[styles.toggleThumb, { transform: [{ translateX }] }]}
      />
    </Animated.View>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────
interface CardProps {
  item: (typeof CHAMA_TYPES)[number];
  selected: boolean;
  onPress: () => void;
}

function ChamaCard({ item, selected, onPress }: CardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.975, useNativeDriver: true }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.card,
          selected && styles.cardSelected,
          { transform: [{ scale }] },
        ]}
      >
        {/* Icon circle */}
        <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
          <Text style={styles.iconEmoji}>{item.icon}</Text>
        </View>

        {/* Text block */}
        <View style={styles.cardBody}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardDesc}>{item.description}</Text>
        </View>

        {/* Toggle */}
        <ToggleSwitch isOn={selected} />
      </Animated.View>
    </Pressable>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function ChamaTypeScreen({ navigation }: any) {
  const [selectedType, setSelectedType] = useState("merry_go_round");

  const handleContinue = () => {
    const mapped = TYPE_MAP[selectedType] ?? selectedType.toUpperCase();
    switch (mapped) {
      case "MERRY_GO_ROUND":
        navigation.navigate("MGRSetup");
        break;
      case "INVESTMENT":
        navigation.navigate("InvestmentSetup");
        break;
      case "WELFARE":
        navigation.navigate("WelfareSetup");
        break;
      case "HYBRID":
        navigation.navigate("ChamaDetails", { chamaType: mapped });
        break;
      default:
        navigation.navigate("ChamaDetails", { chamaType: mapped });
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backBtn,
            pressed && styles.backBtnPressed,
          ]}
          hitSlop={12}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
      </View>

      {/* ── Scrollable content ── */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Choose your{"\n"}chama type</Text>
        <Text style={styles.screenSub}>
          Select the structure that best fits how your group will save, invest,
          or rotate money.
        </Text>

        {/* Cards */}
        <View style={styles.cardList}>
          {CHAMA_TYPES.map((type) => (
            <ChamaCard
              key={type.id}
              item={type}
              selected={selectedType === type.id}
              onPress={() => setSelectedType(type.id)}
            />
          ))}
        </View>

        {/* Chairperson alert */}
        <View style={styles.alertBox}>
          <Text style={styles.alertIcon}>👑</Text>
          <Text style={styles.alertText}>
            By creating this Chama, you automatically become its{" "}
            <Text style={styles.alertBold}>Chairperson</Text>.
          </Text>
        </View>
      </ScrollView>

      {/* ── Sticky footer ── */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.continueBtn,
            pressed && styles.continueBtnPressed,
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Screen
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[2],
    paddingBottom: Spacing[1],
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.input,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  backBtnPressed: {
    backgroundColor: Colors.divider,
  },
  backArrow: {
    fontSize: FontSize["2xl"],
    color: Colors.textPrimary,
    lineHeight: 24,
    marginTop: -1,
  },

  // Content
  content: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[9],
  },
  screenTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["6xl"],
    fontWeight: FontWeight.extraBold,
    color: Colors.textPrimary,
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: Spacing[2.5],
  },
  screenSub: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing[7],
  },

  // Card list
  cardList: {
    gap: Spacing[3.5],
    marginBottom: Spacing[6],
  },

  // Card
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[4],
    ...Shadow.sm,
  },
  cardSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.primaryLight,
  },

  // Icon
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing[3.5],
    flexShrink: 0,
  },
  iconEmoji: {
    fontSize: FontSize["3xl"],
    lineHeight: 28,
  },

  // Card body
  cardBody: {
    flex: 1,
    marginRight: Spacing[3],
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: Spacing[1],
  },
  cardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  cardDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    lineHeight: 19,
  },

  // Badge
  badge: {
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.micro,
    fontWeight: FontWeight.extraBold,
    color: Colors.warning,
    letterSpacing: 0.4,
  },

  // Toggle pill
  togglePill: {
    width: 44,
    height: 26,
    borderRadius: Radius.full,
    justifyContent: "center",
    flexShrink: 0,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    ...Shadow.md,
  },

  // Chairperson alert
  alertBox: {
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
  alertIcon: {
    fontSize: FontSize["3xl"],
    lineHeight: 26,
  },
  alertText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.warningDark,
    lineHeight: 21,
  },
  alertBold: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    color: "#78350F",
  },

  // Footer
  footer: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Platform.OS === "android" ? Spacing[6] : Spacing[7],
    backgroundColor: Colors.background,
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
});
