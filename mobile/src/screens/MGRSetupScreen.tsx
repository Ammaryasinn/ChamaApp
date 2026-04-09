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
import { chamaApi } from "../lib/api";
import { Alert, ActivityIndicator } from "react-native";

const FREQUENCIES = [
  { id: "weekly", label: "Weekly", sub: "Every 7 days" },
  { id: "biweekly", label: "Bi-weekly", sub: "Every 14 days" },
  { id: "monthly", label: "Monthly", sub: "Once a month" },
] as const;
type Frequency = (typeof FREQUENCIES)[number]["id"];

const MEETING_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MGRSetupScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [contributionAmount, setContributionAmount] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [penaltyAmount, setPenaltyAmount] = useState("");
  const [graceDays, setGraceDays] = useState("3");
  const [meetingDay, setMeetingDay] = useState("Sat");
  const [maxMembers, setMaxMembers] = useState("12");
  const [loading, setLoading] = useState(false);

  const contrib = parseFloat(contributionAmount.replace(/,/g, "")) || 0;
  const penalty = parseFloat(penaltyAmount.replace(/,/g, "")) || 0;
  const grace = parseInt(graceDays) || 0;
  const members = parseInt(maxMembers) || 12;
  const potSize = contrib * members;

  const canContinue = name.trim().length >= 3 && contrib > 0;

  const freqLabel =
    FREQUENCIES.find((f) => f.id === frequency)?.label.toLowerCase() ??
    "monthly";

  const handleContinue = async () => {
    if (!canContinue) return;
    setLoading(true);
    try {
      const dayMap: Record<string, number> = {
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
        Sun: 7,
      };
      const newChama = await chamaApi.createChama({
        name: name.trim(),
        chamaType: "merry_go_round",
        contributionAmount: contrib,
        contributionFrequency: frequency,
        penaltyAmount: penalty,
        penaltyGraceDays: grace,
        meetingDay: dayMap[meetingDay] ?? 6,
        maxLoanMultiplier: 3,
        loanInterestRate: 10,
        minVotesToApproveLoan: 0,
        mgrPercentage: 100,
        investmentPercentage: 0,
        welfarePercentage: 0,
      });
      navigation.navigate("InviteMembers", {
        chamaType: "merry_go_round",
        name: name.trim(),
        monthlyTarget: contrib,
        focus: "mgr",
        chamaId: newChama.id,
      });
      return;
    } catch (e: any) {
      // Non-blocking — show warning but don't block navigation
      console.warn("Chama API error (offline?):", e?.message);
    } finally {
      setLoading(false);
      // Always navigate forward so the UI flow works
      navigation.navigate("InviteMembers", {
        chamaType: "MERRY_GO_ROUND",
        name: name.trim(),
      });
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ── Hero ── */}
        <LinearGradient
          colors={[Colors.surfaceDeepDark, Colors.surfaceDark]}
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
              size={22}
              color={Colors.textInverseSoft}
            />
          </Pressable>

          <View style={styles.heroIconWrap}>
            <Text style={styles.heroIcon}>↺</Text>
          </View>
          <Text style={styles.heroOverline}>MERRY-GO-ROUND</Text>
          <Text style={styles.heroTitle}>Set up your{"\n"}rotation chama</Text>
          <Text style={styles.heroSub}>
            Members contribute every cycle. The full pot rotates to one member
            at a time until everyone has received.
          </Text>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Chama Name ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CHAMA NAME</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Umoja Investment Circle"
              placeholderTextColor={Colors.textMuted}
              maxLength={60}
            />
          </View>

          {/* ── Contribution Amount ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CONTRIBUTION PER MEMBER</Text>
            <View style={styles.amountInputWrap}>
              <Text style={styles.currencyLabel}>KES</Text>
              <TextInput
                style={styles.amountInput}
                value={contributionAmount}
                onChangeText={setContributionAmount}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            {potSize > 0 && (
              <View style={styles.potPreview}>
                <Feather name="info" size={13} color={Colors.primary} />
                <Text style={styles.potPreviewText}>
                  Pot size with {members} members:{" "}
                  <Text style={styles.potPreviewBold}>
                    KES {potSize.toLocaleString()}
                  </Text>
                </Text>
              </View>
            )}
          </View>

          {/* ── Frequency ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CONTRIBUTION FREQUENCY</Text>
            <View style={styles.freqRow}>
              {FREQUENCIES.map((f) => (
                <Pressable
                  key={f.id}
                  style={[
                    styles.freqCard,
                    frequency === f.id && styles.freqCardActive,
                  ]}
                  onPress={() => setFrequency(f.id)}
                >
                  <Text
                    style={[
                      styles.freqLabel,
                      frequency === f.id && styles.freqLabelActive,
                    ]}
                  >
                    {f.label}
                  </Text>
                  <Text
                    style={[
                      styles.freqSub,
                      frequency === f.id && styles.freqSubActive,
                    ]}
                  >
                    {f.sub}
                  </Text>
                  {frequency === f.id && (
                    <View style={styles.freqCheck}>
                      <Feather name="check" size={11} color={Colors.surface} />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* ── Meeting Day ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>MEETING DAY</Text>
            <View style={styles.daysRow}>
              {MEETING_DAYS.map((d) => (
                <Pressable
                  key={d}
                  style={[
                    styles.dayBtn,
                    meetingDay === d && styles.dayBtnActive,
                  ]}
                  onPress={() => setMeetingDay(d)}
                >
                  <Text
                    style={[
                      styles.dayBtnText,
                      meetingDay === d && styles.dayBtnTextActive,
                    ]}
                  >
                    {d}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* ── Max Members ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>MAX GROUP SIZE</Text>
            <View style={styles.stepperRow}>
              <Pressable
                style={styles.stepperBtn}
                onPress={() => setMaxMembers(String(Math.max(2, members - 1)))}
              >
                <Feather name="minus" size={18} color={Colors.primary} />
              </Pressable>
              <View style={styles.stepperValue}>
                <Text style={styles.stepperNumber}>{members}</Text>
                <Text style={styles.stepperUnit}>members</Text>
              </View>
              <Pressable
                style={styles.stepperBtn}
                onPress={() => setMaxMembers(String(Math.min(50, members + 1)))}
              >
                <Feather name="plus" size={18} color={Colors.primary} />
              </Pressable>
            </View>
          </View>

          {/* ── Penalties ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>LATE PAYMENT PENALTY</Text>
            <View style={styles.amountInputWrap}>
              <Text style={styles.currencyLabel}>KES</Text>
              <TextInput
                style={styles.amountInput}
                value={penaltyAmount}
                onChangeText={setPenaltyAmount}
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                maxLength={8}
              />
            </View>
            <Text style={styles.graceLabelStacked}>
              Grace period before penalty applies
            </Text>
            <View style={styles.graceInputRowStacked}>
              <TextInput
                style={styles.graceInputStacked}
                value={graceDays}
                onChangeText={setGraceDays}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.graceUnit}>days</Text>
            </View>
            <Text style={styles.fieldHint}>
              Set penalty to 0 to disable it.
            </Text>
          </View>

          {/* ── Auto-generated Rules Summary ── */}
          <View style={styles.rulesCard}>
            <View style={styles.rulesHeader}>
              <Feather name="file-text" size={16} color={Colors.primary} />
              <Text style={styles.rulesTitle}>Group Rules Preview</Text>
              <Text style={styles.rulesAuto}>Auto-generated</Text>
            </View>

            <View style={styles.rulesList}>
              <RuleRow
                icon="users"
                text={`Maximum ${members} members in the rotation.`}
              />
              <RuleRow
                icon="repeat"
                text={`Each member contributes KES ${
                  contrib > 0 ? contrib.toLocaleString() : "—"
                } ${freqLabel}.`}
              />
              <RuleRow
                icon="gift"
                text={`Full pot of KES ${
                  potSize > 0 ? potSize.toLocaleString() : "—"
                } is paid to one member per cycle.`}
              />
              <RuleRow
                icon="calendar"
                text={`Group meets every ${meetingDay}.`}
              />
              {penalty > 0 ? (
                <RuleRow
                  icon="alert-triangle"
                  text={`Late payment penalty: KES ${penalty.toLocaleString()} after ${grace} day${
                    grace !== 1 ? "s" : ""
                  } grace.`}
                  warn
                />
              ) : (
                <RuleRow
                  icon="check-circle"
                  text="No late penalty — contributions are honour-based."
                />
              )}
              <RuleRow
                icon="lock"
                text="All transactions are recorded and visible to every member."
              />
              <RuleRow
                icon="rotate-ccw"
                text="Rotation order is set by the Chairperson and can be swapped by member agreement."
              />
            </View>
          </View>

          <View style={{ height: Spacing[8] }} />
        </ScrollView>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Pressable
            style={[
              styles.continueBtn,
              (!canContinue || loading) && styles.continueBtnDisabled,
            ]}
            onPress={handleContinue}
            disabled={!canContinue || loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.textInverse} />
            ) : (
              <>
                <Text style={styles.continueBtnText}>
                  Continue — Invite Members
                </Text>
                <Feather
                  name="arrow-right"
                  size={18}
                  color={Colors.textInverse}
                />
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function RuleRow({
  icon,
  text,
  warn = false,
}: {
  icon: string;
  text: string;
  warn?: boolean;
}) {
  return (
    <View style={styles.ruleRow}>
      <Feather
        name={icon as any}
        size={14}
        color={warn ? Colors.warning : Colors.primary}
        style={styles.ruleIcon}
      />
      <Text style={[styles.ruleText, warn && styles.ruleTextWarn]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  // Hero
  hero: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[2],
    paddingBottom: Spacing[7],
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
    width: 52,
    height: 52,
    borderRadius: Radius.input,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[4],
  },
  heroIcon: { fontSize: 28, color: Colors.warningDark },
  heroOverline: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 2,
    marginBottom: Spacing[2],
  },
  heroTitle: {
    color: Colors.textInverse,
    fontSize: FontSize["5xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: Spacing[3],
  },
  heroSub: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 20,
    opacity: 0.85,
  },

  // Content
  content: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[4],
  },
  section: { marginBottom: Spacing[6] },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1.5,
    marginBottom: Spacing[2.5],
  },

  // Input
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.input,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: "#E8D6B5",
    ...Shadow.xs,
  },

  // Amount input
  amountInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.input,
    overflow: "hidden",
    ...Shadow.xs,
  },
  currencyLabel: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    backgroundColor: Colors.divider,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    borderRightWidth: 1.5,
    borderRightColor: Colors.border,
  },
  amountInput: {
    flex: 1,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    fontSize: FontSize["2xl"],
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: "#E8D6B5",
  },
  potPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1.5],
    marginTop: Spacing[2],
    paddingHorizontal: Spacing[1],
  },
  potPreviewText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },
  potPreviewBold: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // Frequency picker
  freqRow: { flexDirection: "row", gap: Spacing[2] },
  freqCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing[3],
    alignItems: "center",
    position: "relative",
    ...Shadow.xs,
  },
  freqCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryTint,
    borderWidth: 2,
  },
  freqLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: 2,
  },
  freqLabelActive: { color: Colors.primary },
  freqSub: {
    color: Colors.textMuted,
    fontSize: FontSize.xs - 1,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    textAlign: "center",
  },
  freqSubActive: { color: Colors.primary, opacity: 0.75 },
  freqCheck: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.surface,
  },

  // Meeting days
  daysRow: { flexDirection: "row", gap: Spacing[1.5] },
  dayBtn: {
    flex: 1,
    paddingVertical: Spacing[2.5],
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: "center",
  },
  dayBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayBtnText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  dayBtnTextActive: { color: Colors.textInverse },

  // Stepper
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.input,
    borderWidth: 1.5,
    borderColor: Colors.border,
    overflow: "hidden",
    ...Shadow.xs,
  },
  stepperBtn: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.divider,
  },
  stepperValue: {
    flex: 1,
    alignItems: "center",
  },
  stepperNumber: {
    color: "#E8D6B5",
    fontSize: FontSize["4xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  stepperUnit: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    marginTop: -2,
  },

  // Penalty row
  penaltyRow: { flexDirection: "row", gap: Spacing[3], alignItems: "stretch" },
  penaltyInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.input,
    overflow: "hidden",
    ...Shadow.xs,
  },
  graceWrap: { width: 110, gap: Spacing[1] },
  graceLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  graceInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.input,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
    gap: Spacing[2],
    ...Shadow.xs,
  },
  graceInput: {
    flex: 1,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: "#E8D6B5",
  },
  graceUnit: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
  },
  graceLabelStacked: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    marginTop: Spacing[3],
    marginBottom: Spacing[1.5],
  },
  graceInputRowStacked: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.input,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    gap: Spacing[2],
    ...Shadow.xs,
  },
  graceInputStacked: {
    flex: 1,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    color: "#E8D6B5",
  },
  fieldHint: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    marginTop: Spacing[2],
  },

  // Rules summary card
  rulesCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing[5],
    ...Shadow.sm,
  },
  rulesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    marginBottom: Spacing[4],
  },
  rulesTitle: {
    flex: 1,
    color: "#E8D6B5",
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  rulesAuto: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    backgroundColor: Colors.divider,
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  rulesList: { gap: Spacing[3] },
  ruleRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing[3] },
  ruleIcon: { marginTop: 1 },
  ruleText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 20,
  },
  ruleTextWarn: { color: Colors.warningDark },

  // Footer
  footer: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    ...Shadow.heroCard,
  },
  continueBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    paddingVertical: Spacing[4],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
    ...Shadow.button,
  },
  continueBtnDisabled: {
    backgroundColor: Colors.textMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
});
