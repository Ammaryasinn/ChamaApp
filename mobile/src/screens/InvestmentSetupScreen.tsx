import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  Animated,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../theme";

const FOCUS_OPTIONS = [
  {
    id: "stocks",
    label: "NSE Stocks",
    icon: "trending-up" as const,
    desc: "Buy shares in Kenyan & global listed companies",
    color: "#3B82F6",
    bg: "#EFF6FF",
  },
  {
    id: "realestate",
    label: "Real Estate",
    icon: "home" as const,
    desc: "Pool funds to buy land or property together",
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    id: "unitstrusts",
    label: "Unit Trusts",
    icon: "pie-chart" as const,
    desc: "Managed funds — lower risk, steady growth",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    id: "mixed",
    label: "Mixed Portfolio",
    icon: "layers" as const,
    desc: "Spread across stocks, property, and funds",
    color: "#D97706",
    bg: "#FFFBEB",
  },
];

function FocusCard({
  item,
  selected,
  onPress,
}: {
  item: (typeof FOCUS_OPTIONS)[number];
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() =>
        Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()
      }
      onPressOut={() =>
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()
      }
    >
      <Animated.View
        style={[
          styles.focusCard,
          selected && { borderColor: item.color, borderWidth: 2, backgroundColor: item.bg },
          { transform: [{ scale }] },
        ]}
      >
        <View style={[styles.focusIconBox, { backgroundColor: item.bg }]}>
          <Feather name={item.icon} size={20} color={item.color} />
        </View>
        <View style={styles.focusTextBlock}>
          <Text style={styles.focusLabel}>{item.label}</Text>
          <Text style={styles.focusDesc}>{item.desc}</Text>
        </View>
        {selected && (
          <View style={[styles.focusCheck, { backgroundColor: item.color }]}>
            <Feather name="check" size={12} color="#fff" />
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

export default function InvestmentSetupScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [monthlyTarget, setMonthlyTarget] = useState("");
  const [focus, setFocus] = useState("stocks");
  const [nameFocused, setNameFocused] = useState(false);
  const [amtFocused, setAmtFocused] = useState(false);

  const canContinue = name.trim().length >= 3 && monthlyTarget.trim().length > 0;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      {/* Dark gradient hero */}
      <LinearGradient
        colors={["#071510", "#0A1F18", "#0D2E22"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={Colors.textInverseSoft} />
        </Pressable>

        <View style={styles.heroContent}>
          <View style={styles.heroIconWrap}>
            <Feather name="trending-up" size={26} color={Colors.accent} />
          </View>
          <Text style={styles.heroOverline}>INVESTMENT CHAMA</Text>
          <Text style={styles.heroTitle}>Build wealth{"\n"}together</Text>
          <Text style={styles.heroSubtitle}>
            Your group pools monthly contributions to invest in stocks, property,
            and funds — growing wealth no single member could alone.
          </Text>
        </View>
      </LinearGradient>

      {/* White card */}
      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.cardContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Chama name */}
        <Text style={styles.sectionLabel}>CHAMA NAME</Text>
        <TextInput
          style={[styles.input, nameFocused && styles.inputFocused]}
          value={name}
          onChangeText={setName}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
          placeholder="e.g. Nairobi Equity Club"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="words"
        />

        {/* Monthly target */}
        <Text style={styles.sectionLabel}>MONTHLY TARGET PER MEMBER</Text>
        <View
          style={[
            styles.amountInput,
            amtFocused && styles.inputFocused,
          ]}
        >
          <Text style={styles.currencyPrefix}>KES</Text>
          <TextInput
            style={styles.amountTextInput}
            value={monthlyTarget}
            onChangeText={(t) => setMonthlyTarget(t.replace(/[^0-9]/g, ""))}
            onFocus={() => setAmtFocused(true)}
            onBlur={() => setAmtFocused(false)}
            placeholder="5,000"
            placeholderTextColor={Colors.textMuted}
            keyboardType="number-pad"
          />
        </View>

        {/* Focus selector */}
        <Text style={styles.sectionLabel}>INVESTMENT FOCUS</Text>
        <View style={styles.focusList}>
          {FOCUS_OPTIONS.map((opt) => (
            <FocusCard
              key={opt.id}
              item={opt}
              selected={focus === opt.id}
              onPress={() => setFocus(opt.id)}
            />
          ))}
        </View>

        {/* How it works explainer */}
        <View style={styles.explainerCard}>
          <View style={styles.explainerHeader}>
            <Feather name="info" size={15} color={Colors.primary} />
            <Text style={styles.explainerTitle}>How investment chamas work</Text>
          </View>
          {[
            {
              icon: "calendar" as const,
              text: "Members contribute a fixed amount each month into the group pot",
            },
            {
              icon: "trending-up" as const,
              text: "The chairperson or treasurer proposes investment opportunities",
            },
            {
              icon: "check-circle" as const,
              text: "Members vote on each investment — majority rules",
            },
            {
              icon: "dollar-sign" as const,
              text: "Returns and dividends are distributed proportionally",
            },
            {
              icon: "bar-chart-2" as const,
              text: "Track your portfolio performance in real time inside the app",
            },
          ].map((item, i) => (
            <View key={i} style={styles.explainerRow}>
              <View style={styles.explainerDot}>
                <Feather name={item.icon} size={13} color={Colors.primary} />
              </View>
              <Text style={styles.explainerText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Spacer for footer */}
        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.continueBtn, !canContinue && styles.continueBtnDisabled]}
          onPress={() =>
            navigation.navigate("InvestmentDashboard", {
              name: name.trim(),
              monthlyTarget,
              focus,
            })
          }
          disabled={!canContinue}
        >
          <Text style={styles.continueBtnText}>Continue to Portfolio</Text>
          <Feather
            name="arrow-right"
            size={18}
            color={canContinue ? Colors.textInverse : Colors.textMuted}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surfaceDark },

  // Hero
  hero: {
    paddingBottom: Spacing[8],
  },
  backBtn: {
    margin: Spacing[5],
    marginBottom: 0,
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    paddingHorizontal: Spacing[7],
    paddingTop: Spacing[4],
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    backgroundColor: "rgba(245,158,11,0.15)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[4],
  },
  heroOverline: {
    color: Colors.accent,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 2,
    marginBottom: Spacing[2],
  },
  heroTitle: {
    color: Colors.textInverse,
    fontSize: FontSize["6xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: Spacing[3],
  },
  heroSubtitle: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 20,
    opacity: 0.85,
  },

  // Card
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.hero,
    borderTopRightRadius: Radius.hero,
    marginTop: -Spacing[6],
    ...Shadow.heroCard,
  },
  cardContent: {
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[7],
    paddingBottom: Spacing[8],
  },

  // Labels
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: Spacing[2],
    marginTop: Spacing[5],
  },

  // Inputs
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.input,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryTint,
  },
  amountInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.input,
    backgroundColor: Colors.background,
    overflow: "hidden",
  },
  currencyPrefix: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    borderRightWidth: 1.5,
    borderRightColor: Colors.border,
  },
  amountTextInput: {
    flex: 1,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },

  // Focus cards
  focusList: {
    gap: Spacing[2],
    marginTop: Spacing[1],
  },
  focusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing[4],
    ...Shadow.xs,
  },
  focusIconBox: {
    width: 42,
    height: 42,
    borderRadius: Radius.input,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing[3],
    flexShrink: 0,
  },
  focusTextBlock: { flex: 1 },
  focusLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: 3,
  },
  focusDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 18,
  },
  focusCheck: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing[2],
  },

  // Explainer
  explainerCard: {
    backgroundColor: Colors.primaryTint,
    borderRadius: Radius.card,
    padding: Spacing[5],
    marginTop: Spacing[6],
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  explainerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    marginBottom: Spacing[4],
  },
  explainerTitle: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  explainerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing[3],
    gap: Spacing[3],
  },
  explainerDot: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  explainerText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 20,
    paddingTop: 4,
  },

  // Footer
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
    borderRadius: Radius.button,
    paddingVertical: Spacing[4.5],
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: Spacing[2],
    ...Shadow.button,
  },
  continueBtnDisabled: {
    backgroundColor: Colors.borderStrong,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.2,
  },
});
