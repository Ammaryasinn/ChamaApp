import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
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

const LOAN_MULTIPLES = [2, 3, 4, 5];
const INTEREST_RATES = [5, 8, 10, 12, 15];

const FEATURES = [
  {
    icon: "shield",
    title: "Emergency safety net",
    desc: "Members can borrow quickly for medical bills, school fees, or funerals — no bank needed.",
  },
  {
    icon: "repeat",
    title: "Rotating credit access",
    desc: "Your contributions build your borrowing power. The more you save, the more you can access.",
  },
  {
    icon: "trending-down",
    title: "Low interest — stays in the group",
    desc: "Interest paid on loans goes back into the group pot. Your group earns from itself.",
  },
  {
    icon: "users",
    title: "Group accountability",
    desc: "Members vote on loan approval. No individual bears the risk — the group decides together.",
  },
];

export default function WelfareSetupScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [contribution, setContribution] = useState("");
  const [loanMultiple, setLoanMultiple] = useState(3);
  const [interestRate, setInterestRate] = useState(10);
  const [nameError, setNameError] = useState("");
  const [contribError, setContribError] = useState("");

  const contributionNum = parseInt(contribution.replace(/,/g, ""), 10) || 0;
  const maxLoan = contributionNum * loanMultiple;

  const handleContributionChange = (val: string) => {
    const digits = val.replace(/\D/g, "");
    setContribution(digits ? parseInt(digits, 10).toLocaleString() : "");
    if (contribError) setContribError("");
  };

  const handleContinue = () => {
    let valid = true;
    if (name.trim().length < 3) {
      setNameError("Group name must be at least 3 characters");
      valid = false;
    }
    if (contributionNum < 100) {
      setContribError("Contribution must be at least KES 100");
      valid = false;
    }
    if (!valid) return;

    navigation.navigate("InviteMembers", {
      chamaType: "WELFARE",
      name: name.trim(),
      contributionAmount: contributionNum,
      maxLoanMultiplier: loanMultiple,
      loanInterestRate: interestRate,
    });
    // InviteMembers has a Done → Dashboard button so the flow completes there
  };

  const canContinue = name.trim().length >= 3 && contributionNum >= 100;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ── Hero ── */}
        <LinearGradient
          colors={["#071510", "#0A1F18", "#0D2E22"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={12}
          >
            <Feather
              name="arrow-left"
              size={20}
              color={Colors.textInverseSoft}
            />
          </Pressable>

          <View style={styles.heroIconWrap}>
            <Text style={styles.heroEmoji}>🤝</Text>
          </View>

          <Text style={styles.heroLabel}>WELFARE & SAVINGS CHAMA</Text>
          <Text style={styles.heroTitle}>
            Built on trust,{"\n"}powered by community
          </Text>
          <Text style={styles.heroSub}>
            A member-owned mini bank. Everyone contributes, everyone can borrow.
          </Text>
        </LinearGradient>

        {/* ── Content Card ── */}
        <ScrollView
          style={styles.card}
          contentContainerStyle={styles.cardContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Group Name */}
          <Text style={styles.sectionTitle}>Name your chama</Text>

          <View
            style={[styles.inputWrap, nameError ? styles.inputWrapError : null]}
          >
            <Feather
              name="users"
              size={18}
              color={Colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(t) => {
                setName(t);
                setNameError("");
              }}
              placeholder="e.g. Mama Mboga Welfare Group"
              placeholderTextColor={Colors.textMuted}
              returnKeyType="next"
            />
          </View>
          {nameError ? (
            <Text style={styles.fieldError}>{nameError}</Text>
          ) : null}

          {/* Contribution Amount */}
          <Text style={[styles.sectionTitle, { marginTop: Spacing[6] }]}>
            Monthly contribution
          </Text>
          <Text style={styles.sectionSub}>
            What each member saves per cycle
          </Text>

          <View
            style={[
              styles.inputWrap,
              contribError ? styles.inputWrapError : null,
            ]}
          >
            <Text style={styles.inputPrefix}>KES</Text>
            <TextInput
              style={styles.input}
              value={contribution}
              onChangeText={handleContributionChange}
              placeholder="5,000"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>
          {contribError ? (
            <Text style={styles.fieldError}>{contribError}</Text>
          ) : null}

          {/* Loan Multiple */}
          <Text style={[styles.sectionTitle, { marginTop: Spacing[6] }]}>
            Max loan multiple
          </Text>
          <Text style={styles.sectionSub}>
            How many times their total contributions a member can borrow
          </Text>

          <View style={styles.pillRow}>
            {LOAN_MULTIPLES.map((m) => (
              <Pressable
                key={m}
                style={[styles.pill, loanMultiple === m && styles.pillActive]}
                onPress={() => setLoanMultiple(m)}
              >
                <Text
                  style={[
                    styles.pillText,
                    loanMultiple === m && styles.pillTextActive,
                  ]}
                >
                  {m}×
                </Text>
              </Pressable>
            ))}
          </View>

          {contributionNum > 0 && (
            <View style={styles.calcCard}>
              <Feather
                name="info"
                size={15}
                color={Colors.primary}
                style={{ marginTop: 1 }}
              />
              <Text style={styles.calcText}>
                A member who has contributed{" "}
                <Text style={styles.calcBold}>
                  KES {(contributionNum * 6).toLocaleString()}
                </Text>{" "}
                (6 months) can borrow up to{" "}
                <Text style={styles.calcBold}>
                  KES {(contributionNum * 6 * loanMultiple).toLocaleString()}
                </Text>
              </Text>
            </View>
          )}

          {/* Interest Rate */}
          <Text style={[styles.sectionTitle, { marginTop: Spacing[6] }]}>
            Loan interest rate
          </Text>
          <Text style={styles.sectionSub}>
            Monthly rate. Interest earned stays in the group pot.
          </Text>

          <View style={styles.pillRow}>
            {INTEREST_RATES.map((r) => (
              <Pressable
                key={r}
                style={[styles.pill, interestRate === r && styles.pillActive]}
                onPress={() => setInterestRate(r)}
              >
                <Text
                  style={[
                    styles.pillText,
                    interestRate === r && styles.pillTextActive,
                  ]}
                >
                  {r}%
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* How it works */}
          <Text style={styles.sectionTitle}>How welfare chamas work</Text>

          <View style={styles.featureList}>
            {FEATURES.map((f, i) => (
              <View key={i} style={styles.featureCard}>
                <View style={styles.featureIconWrap}>
                  <Feather
                    name={f.icon as any}
                    size={18}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Rules Preview */}
          <View style={styles.rulesCard}>
            <Text style={styles.rulesLabel}>AUTO-GENERATED RULES</Text>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleBullet}>›</Text>
              <Text style={styles.ruleText}>
                Each member contributes{" "}
                <Text style={styles.ruleBold}>
                  KES {contribution || "—"} per month
                </Text>
              </Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleBullet}>›</Text>
              <Text style={styles.ruleText}>
                Maximum loan is{" "}
                <Text style={styles.ruleBold}>
                  {loanMultiple}× total contributions
                </Text>
              </Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleBullet}>›</Text>
              <Text style={styles.ruleText}>
                Loans accrue{" "}
                <Text style={styles.ruleBold}>
                  {interestRate}% monthly interest
                </Text>{" "}
                — paid back to the group
              </Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleBullet}>›</Text>
              <Text style={styles.ruleText}>
                Loan applications require a{" "}
                <Text style={styles.ruleBold}>majority group vote</Text>
              </Text>
            </View>
          </View>

          <View style={{ height: Spacing[4] }} />
        </ScrollView>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Pressable
            style={[
              styles.continueBtn,
              !canContinue && styles.continueBtnDisabled,
            ]}
            onPress={handleContinue}
            disabled={!canContinue}
          >
            <Text style={styles.continueBtnText}>Set up chama →</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surfaceDark },

  // Hero
  hero: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[8],
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[5],
  },
  heroIconWrap: {
    width: 56,
    height: 56,
    borderRadius: Radius.cardLg,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[4],
  },
  heroEmoji: { fontSize: FontSize["4xl"] },
  heroLabel: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1.8,
    marginBottom: Spacing[2],
  },
  heroTitle: {
    color: Colors.textInverse,
    fontSize: FontSize["5xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: Spacing[2],
  },
  heroSub: {
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
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.hero,
    borderTopRightRadius: Radius.hero,
    marginTop: -Spacing[4],
  },
  cardContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[7],
    paddingBottom: Spacing[6],
  },

  // Section titles
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[1],
  },
  sectionSub: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    marginBottom: Spacing[3],
    lineHeight: 18,
  },

  // Input
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.input,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3.5],
    gap: Spacing[2],
  },
  inputWrapError: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorBg,
  },
  inputIcon: { marginRight: Spacing[1] },
  inputPrefix: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginRight: Spacing[1],
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
  },
  fieldError: {
    color: Colors.error,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    marginTop: Spacing[1],
    marginLeft: Spacing[1],
  },

  // Pills
  pillRow: {
    flexDirection: "row",
    gap: Spacing[2],
    flexWrap: "wrap",
  },
  pill: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[2.5],
    borderRadius: Radius.button,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  pillActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  pillText: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  pillTextActive: {
    color: Colors.primary,
  },

  // Calc hint
  calcCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.primaryTint,
    borderRadius: Radius.input,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    padding: Spacing[3],
    marginTop: Spacing[3],
    gap: Spacing[2],
  },
  calcText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 19,
  },
  calcBold: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing[7],
  },

  // Features
  featureList: { gap: Spacing[3] },
  featureCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing[4],
    gap: Spacing[3],
    ...Shadow.xs,
  },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureText: { flex: 1 },
  featureTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: 3,
  },
  featureDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 18,
  },

  // Rules
  rulesCard: {
    backgroundColor: Colors.surfaceDark,
    borderRadius: Radius.card,
    padding: Spacing[5],
    marginTop: Spacing[6],
    gap: Spacing[2.5],
  },
  rulesLabel: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1.4,
    marginBottom: Spacing[1],
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[2],
  },
  ruleBullet: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.base,
    lineHeight: 20,
  },
  ruleText: {
    flex: 1,
    color: "rgba(255,255,255,0.75)",
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 20,
  },
  ruleBold: {
    color: Colors.textInverse,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // Footer
  footer: {
    paddingHorizontal: Spacing[5],
    paddingBottom: Platform.OS === "android" ? Spacing[5] : Spacing[6],
    paddingTop: Spacing[3],
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  continueBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    paddingVertical: Spacing[4],
    alignItems: "center",
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
    letterSpacing: 0.3,
  },
});
